from flask import Blueprint, jsonify, request
from app.models.orders import Orders, OrderStatus
from app.models.orderItem import OrderItem
from app.models.users import User
from app.models.product import Products
from app.models.cart import Cart
from app.models.payment import Payment, PaymentMethod, PaymentStatus
from app.db import db
from sqlalchemy import select
from decimal import Decimal

order_bp = Blueprint("order", __name__)


@order_bp.route("/order/create", methods=["POST"])
def create_order():
    try:
        data = request.get_json()

        required_fields = [
            "user_id",
            "address_id",
        ]
        missing = [f for f in required_fields if f not in data]
        if missing:
            return (
                jsonify(
                    {
                        "message": f"Missing fields: {', '.join(missing)}",
                        "success": False,
                    }
                ),
                400,
            )

        user_id = data.get("user_id")
        address_id = data.get("address_id")
        payment_method = (data.get("payment_method") or "cod").lower()

        cart_items = db.session.scalars(
            select(Cart).where(Cart.user_id == user_id)
        ).all()

        if not cart_items:
            return (
                jsonify(
                    {
                        "message": "Cart is empty",
                        "success": False,
                    }
                ),
                400,
            )

        total_amount = Decimal("0")
        products = []

        for cart_item in cart_items:
            product = db.session.get(Products, cart_item.product.id)

            if not product:
                return jsonify({"message": "Invalid product_id", "success": False}), 400

            if product.qty < cart_item.qty:
                return (
                    jsonify(
                        {
                            "message": f"Insufficient stock for {product.name}",
                            "success": False,
                        }
                    ),
                    400,
                )

            total_amount += Decimal(str(product.Product_price)) * cart_item.qty

            products.append({"cart_item": cart_item, "product": product})

        def total_count(total):
            return total + (total * Decimal("2") / Decimal("100"))

        order_total = total_count(total_amount)
        order = Orders(
            user_id=user_id,
            address_id=address_id,
            total_amount=order_total,
            status=(
                OrderStatus.CONFIRMED
                if payment_method == "cod"
                else OrderStatus.PENDING
            ),
        )

        db.session.add(order)
        db.session.flush()

        for item in products:
            cart_item = item.get("cart_item")
            product = item.get("product")

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                attribute_id=f"{[str(j.attribute_value_id) for j in cart_item.values]}",
                qty=cart_item.qty,
                price_at_purchase=product.Product_price,
            )

            product.qty -= cart_item.qty

            db.session.add(order_item)

        if payment_method == "cod":
            db.session.add(
                Payment(
                    order_id=order.id,
                    user_id=user_id,
                    method=PaymentMethod.COD,
                    status=PaymentStatus.PENDING,
                    amount_paid=order_total,
                )
            )

        for cart_item in cart_items:
            db.session.delete(cart_item)

        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Order Create SuccessFully",
                    "success": True,
                    "data": order.to_dict(),
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "Order Are Not Create", "success": False}), 500


@order_bp.route("/order/<uuid:id>", methods=["GET"])
def get_order(id):
    try:
        existing = db.session.get(Orders, id)

        if not existing:
            return jsonify({"message": "Order Not Found", "success": False}), 404

        return (
            jsonify(
                {
                    "message": "Order retrieved successfully",
                    "success": True,
                    "data": existing.to_dict(),
                }
            ),
            200,
        )

    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"message": "Something went wrong", "success": False}), 500


@order_bp.route("/order/get/<uuid:id>", methods=["GET"])
def get_all_order(id):
    try:
        # Check whether user exists
        existing_user = db.session.get(User, id)

        if not existing_user:
            return jsonify({"message": "User not found", "success": False}), 404

        print(existing_user)

        if existing_user.role == "admin":
            orders = db.session.scalars(select(Orders)).all()
        else:
            orders = db.session.scalars(
                select(Orders).where(Orders.user_id == existing_user.id)
            ).all()

        print(orders)

        if not orders:
            return jsonify({"message": "Order not found", "success": False}), 404

        return (
            jsonify(
                {
                    "message": "Orders retrieved successfully",
                    "success": True,
                    "data": [order.to_dict() for order in orders],
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "Something went wrong", "success": False}), 500


@order_bp.route("/order/status/<uuid:id>", methods=["PATCH"])
def update_order_status(id):
    try:
        order = db.session.get(Orders, id)

        if not order:
            return jsonify({"message": "Order not found", "success": False}), 404

        data = request.get_json()

        if not data or "status" not in data:
            return jsonify({"message": "Status is required", "success": False}), 400

        order.status = data.get("status")

        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Order status updated successfully",
                    "success": True,
                    "data": order.to_dict(),
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Something went wrong", "success": False}), 500
