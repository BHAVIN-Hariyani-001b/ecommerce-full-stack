from flask import Blueprint, jsonify, request
from app.models.product import Products
from app.models.wishlist import Wishlist
from app.models.users import User
from app.db import db

wishlist_bp = Blueprint("whishlist_bp", __name__)


@wishlist_bp.route("/wishlist/<uuid:id>", methods=["GET"])
def wishList_Product_get(id):
    """user wishlist Product fetch"""

    try:
        if not id:
            return jsonify({"message": "user id are required", "success": False}), 404

        user = db.session.get(User, str(id))
        print(user)

        if not user:
            return jsonify({"message": "User Not Found", "success": False}), 404

        wishListProduct = Wishlist.query.filter_by(user_id=str(id)).all()

        result = [i.to_dict() for i in wishListProduct]

        return (
            jsonify(
                {
                    "message": "Product Fetch successfully",
                    "success": True,
                    "data": result,
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"message": "Product Not Fetch", "success": False}), 500


@wishlist_bp.route("/wishlist/add", methods=["POST"])
def wishList_add():
    """add product in wishlist"""

    try:
        data = request.get_json()

        user_id = data.get("user_id")
        product_id = data.get("product_id")

        print(data)

        if not user_id or not product_id:
            return (
                jsonify(
                    {"message": "Product id and user id are required", "success": False}
                ),
                400,
            )

        existing = Wishlist.query.filter_by(
            user_id=user_id, product_id=product_id
        ).first()

        if existing:
            return (
                jsonify(
                    {"message": "Product are already for wishlist", "success": False}
                ),
                409,
            )

        wish = Wishlist(user_id=user_id, product_id=product_id)
        db.session.add(wish)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Product added to wishlist successfully",
                    "success": True,
                    "data": wish.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        print(f"Wishlist add error: {e}")
        return (
            jsonify({"message": "Product not added in wishlist", "success": False}),
            500,
        )


@wishlist_bp.route("/wishlist/remove/<uuid:id>", methods=["DELETE"])
def remove_product_wishlist(id):
    try:
        if not id:
            return (
                jsonify({"message": "WishList Id Are Required", "success": False}),
                404,
            )

        exsiting = db.session.get(Wishlist, id)
        print("id fdas ", exsiting.product_id)

        if not exsiting:
            return jsonify({"message": "Product Not Found", "success": False}), 404

        db.session.delete(exsiting)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Product Delete Successfully",
                    "success": True,
                    "data": {"id": id, "product_id": exsiting.product_id},
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        print(f"wishlist remove error : {e}")
        return (
            jsonify({"message": "Product not Remove Form wishlist", "success": False}),
            500,
        )
