from flask import Blueprint, jsonify, request
import razorpay
from app.db import db
import os
from decimal import Decimal, ROUND_HALF_UP
from dotenv import load_dotenv
from app.models.payment import Payment, PaymentStatus, PaymentMethod
from app.models.users import User
from app.models.orders import Orders, OrderStatus
from app.models.product import Products
from app.models.cart import Cart
from sqlalchemy import select
import hashlib
import hmac
from datetime import datetime
from sqlalchemy import and_

load_dotenv()


payment_order_bp = Blueprint("payment", __name__)

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
ALLOWED_METHODS = {"card", "upi"}

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


@payment_order_bp.route("/create/order", methods=["POST"])
def create_payment_order():
    try:
        data = request.get_json(silent=True) or {}
        method = data.get("method", "card")
        user_id = data.get("user_id")
        order_id = data.get("order_id")

        user = db.session.get(User, user_id)

        if not user:
            return (
                jsonify(
                    {
                        "message": "User Not Found",
                        "success": False,
                    }
                ),
                404,
            )

        product_order = db.session.scalar(
            select(Orders).where(Orders.user_id == user.id, Orders.id == order_id)
        )

        if not product_order:
            return jsonify({"message": "Order not found", "success": False}), 404

        amount_rupees = Decimal(str(product_order.total_amount))
        amount = int(
            (amount_rupees * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        )

        if amount < 100:
            return (
                jsonify(
                    {"message": "Amount must be an integer of at least 100 paise."}
                ),
                400,
            )

        if method not in ALLOWED_METHODS:
            return jsonify({"message": "Unsupported payment method."}), 4000

        if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
            return (
                jsonify(
                    {
                        "message": "Razorpay credentials are not configured on the server."
                    }
                ),
                500,
            )

        # Reuse an existing pending Razorpay order for this product order
        existing_payment = db.session.scalar(
            select(Payment).where(
                Payment.order_id == product_order.id,
                Payment.status == PaymentStatus.PENDING,
                Payment.razorpay_order_id.isnot(None),
            )
        )

        if existing_payment and existing_payment.razorpay_order_id:
            return jsonify(
                {
                    "razorpay_order_id": existing_payment.razorpay_order_id,
                    "amount": amount,
                    "currency": "INR",
                    "key_id": RAZORPAY_KEY_ID,
                    "order_id": product_order.id,
                }
            )

        order = client.order.create(
            {
                "amount": amount,
                "currency": "INR",
                "receipt": f"receipt_{os.urandom(6).hex()}",
                "notes": {
                    "preferred_method": method,
                    "product_order_id": str(product_order.id),
                },
            }
        )

        payment = Payment(
            order_id=product_order.id,
            user_id=user.id,
            method=PaymentMethod[method.upper()],
            amount_paid=amount_rupees,
            razorpay_order_id=order["id"],
        )

        db.session.add(payment)
        db.session.commit()

        return jsonify(
            {
                "razorpay_order_id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"],
                "key_id": RAZORPAY_KEY_ID,
                "order_id": product_order.id,
            }
        )

    except Exception as e:
        db.session.rollback()
        print("Create payment order error:", e)
        return (
            jsonify({"message": "Unable to create payment order.", "detail": str(e)}),
            502,
        )


@payment_order_bp.route("/payment/verify-payment", methods=["POST"])
def verify_payment():
    try:
        data = request.get_json(silent=True) or {}

        required = ("razorpay_order_id", "razorpay_payment_id", "razorpay_signature")

        if any(not data.get(field) for field in required):
            return (
                jsonify(
                    {
                        "verified": False,
                        "message": "Missing payment verification fields.",
                    }
                ),
                400,
            )

        razorpay_order_id = data["razorpay_order_id"]
        razorpay_payment_id = data["razorpay_payment_id"]
        razorpay_signature = data["razorpay_signature"]

        message = f'{data["razorpay_order_id"]}|{data["razorpay_payment_id"]}'

        expected_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode(), message.encode(), hashlib.sha256
        ).hexdigest()

        verified = hmac.compare_digest(expected_signature, razorpay_signature)

        if not verified:
            return (
                jsonify(
                    {
                        "verified": False,
                        "success": False,
                        "message": "Invalid payment signature.",
                    }
                ),
                400,
            )

        payment = db.session.scalar(
            select(Payment).where(Payment.razorpay_order_id == razorpay_order_id)
        )

        if not payment:
            return (
                jsonify(
                    {
                        "verified": True,
                        "success": False,
                        "message": "Payment record not found.",
                    }
                ),
                404,
            )

        if payment.status == PaymentStatus.SUCCESS:
            return (
                jsonify(
                    {
                        "verified": True,
                        "success": True,
                        "message": "Payment already verified.",
                        "order_id": payment.order_id,
                    }
                ),
                200,
            )

        payment.razorpay_payment_id = razorpay_payment_id
        payment.status = PaymentStatus.SUCCESS
        payment.paid_at = datetime.utcnow()

        product_order = db.session.get(Orders, payment.order_id)

        if not product_order:
            db.session.rollback()

            return (
                jsonify(
                    {"verified": True, "success": False, "message": "Order not found."}
                ),
                404,
            )

        product_order.status = OrderStatus.CONFIRMED

        for order_item in product_order.order_item:
            product = db.session.get(Products, order_item.product_id)
            if product:
                product.qty -= order_item.qty

        cart_items = db.session.scalars(
            select(Cart).where(Cart.user_id == product_order.user_id)
        ).all()
        
        for item in cart_items:
            db.session.delete(item)

        db.session.commit()

        return (
            jsonify(
                {
                    "verified": True,
                    "success": True,
                    "message": "Payment verified successfully.",
                    "order_id": product_order.id,
                    "payment_id": payment.id,
                    "razorpay_payment_id": payment.razorpay_payment_id,
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()

        print("Payment verification error:", e)

        return (
            jsonify(
                {
                    "verified": False,
                    "success": False,
                    "message": "Unable to verify payment.",
                    "detail": str(e),
                }
            ),
            500,
        )


@payment_order_bp.route("/webhook/razorpay", methods=["POST"])
def razorpay_webhook():
    try:
        payload = request.get_data()
        signature = request.headers.get("X-Razorpay-Signature")

        if not signature:
            return jsonify({
                "success": False,
                "message": "Missing Razorpay signature"
            }), 400

        # Verify Razorpay webhook signature
        try:
            client.utility.verify_webhook_signature(
                payload,
                signature,
                RAZORPAY_WEBHOOK_SECRET
            )
        except Exception:
            return jsonify({
                "success": False,
                "message": "Invalid signature"
            }), 400

        event = request.get_json(silent=True) or {}
        event_type = event.get("event")

        print("Razorpay webhook verified:", event_type)

        # -----------------------------------------
        # PAYMENT CAPTURED
        # -----------------------------------------
        if event_type == "payment.captured":

            razorpay_payment = event["payload"]["payment"]["entity"]

            razorpay_payment_id = razorpay_payment["id"]
            razorpay_order_id = razorpay_payment.get("order_id")
            razorpay_amount = razorpay_payment["amount"]

            # Find our Payment record
            payment = db.session.scalar(
                select(Payment).where(
                    Payment.razorpay_order_id == razorpay_order_id
                )
            )

            if not payment:
                print(
                    "Payment record not found:",
                    razorpay_order_id
                )

                return jsonify({
                    "success": False,
                    "message": "Payment record not found"
                }), 404

            # -----------------------------------------
            # Already processed
            # -----------------------------------------
            if payment.status == PaymentStatus.SUCCESS:
                return jsonify({
                    "success": True,
                    "message": "Payment already processed"
                }), 200

            # -----------------------------------------
            # Verify amount
            # -----------------------------------------

            expected_amount = int(
                (
                    Decimal(str(payment.amount_paid)) * 100
                ).quantize(
                    Decimal("1"),
                    rounding=ROUND_HALF_UP
                )
            )

            if razorpay_amount != expected_amount:
                print(
                    "Payment amount mismatch:",
                    razorpay_amount,
                    expected_amount
                )

                return jsonify({
                    "success": False,
                    "message": "Payment amount mismatch"
                }), 400

            # -----------------------------------------
            # Update Payment
            # -----------------------------------------

            payment.razorpay_payment_id = razorpay_payment_id
            payment.status = PaymentStatus.SUCCESS
            payment.paid_at = datetime.utcnow()

            # -----------------------------------------
            # Update Product Order
            # -----------------------------------------

            product_order = db.session.get(
                Orders,
                payment.order_id
            )

            if not product_order:
                db.session.rollback()

                return jsonify({
                    "success": False,
                    "message": "Order not found"
                }), 404
            
            product_order.status = OrderStatus.CONFIRMED

            for order_item in product_order.order_item:
                product = db.session.get(Products, order_item.product_id)
                if product:
                    product.qty -= order_item.qty

            cart_items = db.session.scalars(
                select(Cart).where(Cart.user_id == product_order.user_id)
            ).all()

            for item in cart_items:
                db.session.delete(item)

            db.session.commit()

            return jsonify({
                "success": True,
                "message": "Payment captured successfully"
            }), 200

        # -----------------------------------------
        # PAYMENT FAILED
        # -----------------------------------------
        elif event_type == "payment.failed":

            razorpay_payment = event["payload"]["payment"]["entity"]

            razorpay_payment_id = razorpay_payment["id"]
            razorpay_order_id = razorpay_payment.get("order_id")

            payment = db.session.scalar(
                select(Payment).where(
                    Payment.razorpay_order_id == razorpay_order_id
                )
            )

            if not payment:
                return jsonify({
                    "success": False,
                    "message": "Payment record not found"
                }), 404

            # Don't change an already successful payment
            if payment.status == PaymentStatus.SUCCESS:
                return jsonify({
                    "success": True,
                    "message": "Payment already successful"
                }), 200

            payment.razorpay_payment_id = razorpay_payment_id
            payment.status = PaymentStatus.FAILED

            db.session.commit()

            return jsonify({
                "success": True,
                "message": "Payment failure recorded"
            }), 200

        # -----------------------------------------
        # Other events
        # -----------------------------------------

        return jsonify({
            "success": True,
            "message": "Event received"
        }), 200

    except Exception as e:
        db.session.rollback()

        print("Razorpay webhook error:", e)

        return jsonify({
            "success": False,
            "message": "Webhook processing failed"
        }), 500



@payment_order_bp.route("/get/payments", methods=["GET"])
def get_all_payment():
    try:
        payment = db.session.scalars(
            select(Payment).order_by(Payment.create_at.desc())
        ).all()

        return (
            jsonify(
                {
                    "message": "Payment Data Fetch Successfully",
                    "success": True,
                    "data": [i.to_dict() for i in payment],
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"message": "Payment Data Not Fetch", "success": False}), 500


@payment_order_bp.route("/report/payments", methods=["GET"])
def get_payment_report():
    try:
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        status = request.args.get("status")
        method = request.args.get("method")
        limit = int(request.args.get("limit", 50))

        query = select(Payment)
        filters = []

        if start_date:
            filters.append(Payment.create_at >= datetime.fromisoformat(start_date))
        if end_date:
            filters.append(Payment.create_at <= datetime.fromisoformat(end_date))
        if status:
            filters.append(Payment.status == PaymentStatus(status))
        if method:
            filters.append(Payment.method == PaymentMethod(method))

        if filters:
            query = query.where(and_(*filters))

        query = query.order_by(Payment.create_at.desc())
        payments = db.session.scalars(query).all()

        total_paid = sum(p.amount_paid or 0 for p in payments)
        total_refunded = sum(p.amount_refunded or 0 for p in payments)

        status_counts = {}
        method_counts = {}
        for p in payments:
            status_key = p.status.value if p.status else "unknown"
            method_key = p.method.value if p.method else "unknown"
            status_counts[status_key] = status_counts.get(status_key, 0) + 1
            method_counts[method_key] = method_counts.get(method_key, 0) + 1

        return (
            jsonify(
                {
                    "message": "Payment report fetched successfully",
                    "success": True,
                    "summary": {
                        "total_records": len(payments),
                        "total_amount_paid": float(total_paid),
                        "total_amount_refunded": float(total_refunded),
                        "net_revenue": float(total_paid - total_refunded),
                        "by_status": status_counts,
                        "by_method": method_counts,
                    },
                    "limit": limit,
                    "payment_data": [p.to_dict() for p in payments[:limit]],
                }
            ),
            200,
        )

    except Exception as e:
        print(e)
        return jsonify({"message": "Payment report not fetched", "success": False}), 500


@payment_order_bp.route("/change/status/payment/<uuid:id>", methods=["POST"])
def change_payment_status(id):
    try:
        payment = db.session.get(Payment, id)

        if not payment:
            return jsonify({"messgae": "Payment Not Found", "success": False}), 404

        data = request.get_json()

        if not data:
            return jsonify({"message": "Data Are Required", "success": False}), 400

        payment.status = data.get("status")

        db.session.commit()

        return jsonify(
            {
                "message": "Payment Data Fetch SuccessFully",
                "success": True,
                "data": payment.to_dict(),
            }
        )

    except Exception as e:
        print(e)
        return (
            jsonify(
                {
                    "message": "Something went wrong",
                    "success": False,
                }
            ),
            500,
        )
