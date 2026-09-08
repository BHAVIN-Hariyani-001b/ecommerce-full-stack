from flask import Blueprint, jsonify, request
from app.models.orders import Orders
from app.models.orderItem import OrderItem
from app.models.users import User
from app.models.product import Products
from app.db import db
from sqlalchemy import select

order_bp = Blueprint("order", __name__)


@order_bp.route("/order/create", methods=["POST"])
def create_order():
    try:
        data = request.get_json()

        required_fields = [
            "user_id",
            "product_id",
            "attribute_id",
            "address_id",
            "qty",
            "total_amount",
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
        product_id = data.get("product_id")
        attribute_id = data.get("attribute_id")
        address_id = data.get("address_id")
        qty = data.get("qty")
        total_amount = data.get("total_amount")
        PPrice = data.get("PPrice")

        try:
            qty = int(data.get("qty"))
            if qty < 1:
                raise ValueError
        except (TypeError, ValueError):
            return (
                jsonify(
                    {"message": "qty must be a positive integer", "success": False}
                ),
                400,
            )

        total_amount = float(data.get("total_amount"))
        if total_amount <= 0:
            return (
                jsonify(
                    {"message": "total_amount must be greater than 0", "success": False}
                ),
                400,
            )

        product = db.session.get(Products, product_id)
        # print(product)
        if not product:
            return jsonify({"message": "Invalid product_id", "success": False}), 400

        if product.qty < qty:
            return jsonify({"message": "Insufficient stock", "success": False}), 400

        order = Orders(
            user_id=user_id,
            address_id=address_id,
            total_amount=total_amount,
        )

        product.qty -= qty

        db.session.add(order)
        db.session.commit()

        order_item = OrderItem(
            order_id=order.id,
            product_id=product_id,
            attribute_id=attribute_id,
            qty=qty,
            price_at_purchase=PPrice,
        )

        db.session.add(order_item)
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
        existing = db.session.get(Orders,id)

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
