from flask import Blueprint, jsonify, request
import razorpay
from app.db import db
import os
from decimal import Decimal, ROUND_HALF_UP
from dotenv import load_dotenv
from app.models.payment import Payment, PaymentStatus, PaymentMethod
from app.models.users import User
from app.models.orders import Orders, OrderStatus
from sqlalchemy import select
import hashlib
import hmac
from datetime import datetime

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
                jsonify({"error": "Amount must be an integer of at least 100 paise."}),
                400,
            )

        if method not in ALLOWED_METHODS:
            return jsonify({"error": "Unsupported payment method."}), 400

        if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
            return (
                jsonify(
                    {"error": "Razorpay credentials are not configured on the server."}
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
            jsonify({"error": "Unable to create payment order.", "detail": str(e)}),
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
                    {"verified": False, "error": "Missing payment verification fields."}
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
                        "error": "Invalid payment signature.",
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
                        "error": "Payment record not found.",
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

        product_order = db.session.get(
            Orders,
            payment.order_id
        )

        if not product_order:
            db.session.rollback()

            return jsonify({
                "verified": True,
                "success": False,
                "error": "Order not found."
            }), 404

        product_order.status = OrderStatus.CONFIRMED

        db.session.commit()

        return jsonify({
            "verified": True,
            "success": True,
            "message": "Payment verified successfully.",
            "order_id": product_order.id,
            "payment_id": payment.id,
            "razorpay_payment_id": payment.razorpay_payment_id
        }), 200

    except Exception as e:  
        db.session.rollback()

        print("Payment verification error:", e)

        return jsonify({
            "verified": False,
            "success": False,
            "error": "Unable to verify payment.",
            "detail": str(e)
        }), 500

@payment_order_bp.route("/webhook/razorpay", methods=["POST"])
def razorpay_webhook():
    try:
        payload = request.get_data()
        signature = request.headers.get("X-Razorpay-Signature")

        try:
            client.utility.verify_webhook_signature(
                payload, signature, RAZORPAY_WEBHOOK_SECRET
            )
        except Exception:
            return jsonify({"success": False, "message": "Invalid signature"}), 400

        # Process event here

        return (
            jsonify({"success": True, "message": "signature verify successfully"}),
            200,
        )
    except Exception as e:
        return jsonify({"message": "signature is not verify", "success": False})
