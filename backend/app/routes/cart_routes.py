from flask import Blueprint, jsonify, request
from app.db import db
from app.models.cart import Cart
from app.models.cartValue import CartValue
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
                        "message": "success",
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


# @cart_bp.route("/cart/clear/<uuid:id>",methods=["DELETE"])
# def clear_cart(id):
#     try:
#         existing = db.session.get(Cart,user_id=str(id))
#         print(existing)
#         if not existing:
#             return jsonify({
#                 "error": "Cart Item Not Found"
#             }),404

#         db.session.delete(existing)
#         db.session.commit()

#         return jsonify({"message" : "cart item delete successfully"}),200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({
#             "message" : "Faild To Delete Cart Item",
#             "error" : str(e)
#             }),500


@cart_bp.route("/cart/increment/<string:cart_id>", methods=["PATCH"])
def increment_cart(cart_id):
    """cart product item increment"""
    cart = Cart.query.get(cart_id)

    if not cart:
        return jsonify({"message": "Cart not found"}), 404

    cart.qty += 1
    db.session.commit()

    return jsonify({"message": "incremented", "cart": cart.to_dict()})


@cart_bp.route("/cart/decrement/<string:cart_id>", methods=["PATCH"])
def decrement_cart(cart_id):
    """cart product item decrement"""

    cart = Cart.query.get(cart_id)
    if not cart:
        return jsonify({"message": "Cart not found"}), 404

    if cart.qty > 1:
        cart.qty -= 1
        db.session.commit()
        return jsonify({"message": "decremented", "cart": cart.to_dict()})
    else:
        db.session.delete(cart)
        db.session.commit()
        return jsonify({"message": "removed"})
