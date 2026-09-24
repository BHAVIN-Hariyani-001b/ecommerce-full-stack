from flask import Blueprint, jsonify, request
from app.db import db
from app.models.cart import Cart
from app.models.cartValue import CartValue
from app.models.product import Products
from sqlalchemy import select

cart_bp = Blueprint("cart", __name__)


@cart_bp.route("/cart/<uuid:id>", methods=["GET"])
def get_cart(id):
    """user cart information get"""
    try:
        cart_item = Cart.query.filter_by(user_id=str(id)).all()
        if not cart_item:
            return (
                jsonify(
                    {
                        "message": "Cart Item Not Found",
                        "cart": [],
                    }
                ),
                200,
            )

        return (
            jsonify(
                {
                    "message": "success",
                    "cart": [item.to_dict() for item in cart_item],
                }
            ),
            200,
        )

    except Exception as e:
        return (
            jsonify(
                {
                    "message": "An error occurred while fetching the cart",
                    "error": str(e),
                }
            ),
            500,
        )


@cart_bp.route("/add/cart", methods=["POST"])
def add_cart():
    """add to cart product"""
    try:
        data = request.get_json()
        print(data)

        user_id = data.get("user_id")
        product_id = data.get("product_id")
        qty = data.get("qty", 1)
        attributes_value_ids = data.get("attributes_value_ids", [])

        try:
            qty = int(qty)
        except (TypeError, ValueError):
            return jsonify({"message": "qty must be a number"}), 400

        if qty < 1:
            return jsonify({"message": "qty must be at least 1"}), 400

        if not user_id or not product_id:
            return jsonify({"message": "user_id and product_id required"}), 400

        if not attributes_value_ids:
            return jsonify({"message": "product attribute are required"}), 400

        existing = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()

        if existing:
            existing.qty += qty
            db.session.commit()
            return jsonify({"message": "Cart update", "cart": existing.to_dict()}), 200

        new_item = Cart(user_id=user_id, product_id=product_id, qty=qty)
        db.session.add(new_item)
        db.session.commit()

        if attributes_value_ids:
            for i in attributes_value_ids:
                cart_value = CartValue(cart_id=new_item.id, attribute_value_id=i)
                db.session.add(cart_value)
                db.session.commit()

        return jsonify({"message": "Added to Cart", "cart": new_item.to_dict()})
    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": "An error occurred while creating the cart",
                    "error": str(e),
                }
            ),
            500,
        )


@cart_bp.route("/cart/clear/<uuid:id>", methods=["DELETE"])
def clear_cart(id):
    try:
        existing = db.session.scalars(
            select(Cart).where(Cart.user_id == str(id))
        ).all()
        print(existing)

        if not existing:
            return (
                jsonify(
                    {
                        "message": "Cart Item Not Found",
                    }
                ),
                404,
            )

        for cart_item in existing:
            db.session.delete(cart_item)

        db.session.commit()

        return jsonify({"items": [], "message": "cart item delete successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "Faild To Delete Cart Item", "error": str(e)}), 500


@cart_bp.route("/cart/increment/<string:cart_id>", methods=["PATCH"])
def increment_cart(cart_id):
    """cart product item increment"""
    try:
        cart = Cart.query.get(cart_id)

        if not cart:
            return jsonify({"message": "Cart not found", "success": False}), 404

        product = db.session.get(Products, cart.product_id)

        if not product:
            return jsonify({"message": "Product not found", "success": False}), 404

        if cart.qty + 1 > product.qty:
            return jsonify({
                "message": f"Only {product.qty} in stock",
                "success": False,
            }), 400

        cart.qty += 1
        db.session.commit()

        return jsonify({
            "message": "Incremented",
            "success": True,
            "cart": cart.to_dict(),
        }), 200

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "Something went wrong", "success": False}), 500


@cart_bp.route("/cart/decrement/<string:cart_id>", methods=["PATCH"])
def decrement_cart(cart_id):
    """cart product item decrement"""
    try:
        cart = Cart.query.get(cart_id)
        if not cart:
            return jsonify({"message": "Cart not found", "success": False}), 404

        if cart.qty > 1:
            cart.qty -= 1
            db.session.commit()
            return jsonify({
                "message": "Decremented",
                "success": True,
                "cart": cart.to_dict(),
            }), 200
        else:
            db.session.delete(cart)
            db.session.commit()
            return jsonify({
                "message": "Removed",
                "success": True,
                "cart_id": cart_id,
            }), 200

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "Something went wrong", "success": False}), 500