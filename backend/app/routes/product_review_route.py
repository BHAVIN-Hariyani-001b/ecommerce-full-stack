from flask import Blueprint, request, jsonify
from app.models.ProductReview import ProductReview
from app.models.users import User
from app.db import db

product_review_bp = Blueprint("poduct_review", __name__)


@product_review_bp.route("/product_review/<uuid:id>", methods=["GET"])
def product_review_get(id):
    try:
        productReview = (
            ProductReview.query.filter_by(product_id=str(id)).limit(20).all()
        )
        print(productReview)

        if not productReview:
            return (
                jsonify({"success": False, "message": "product review not found"}),
                404,
            )

        product_review = [review.to_dict__() for review in productReview]
        print(product_review)

        rating_summary = ProductReview.count_rating(str(id))

        return jsonify(
            {
                "success": True,
                "message": "product review are fetch",
                "data": product_review,
                "review": rating_summary,
            }
        )
    except Exception as e:
        return jsonify(
            {
                "message": "Product Review Are Not Fetch",
                "success": False,
                "error": str(e),
            }
        )


@product_review_bp.route("/product_review", methods=["POST"])
def product_review_add():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "All Data Are reqired"}), 400

        u_id = data.get("user_id")
        p_id = data.get("product_id")
        rating = data.get("product_rating")
        pcomment = data.get("comment")

        if not all([u_id, p_id, rating]):
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "user_id, product_id, and product_rating are required",
                    }
                ),
                400,
            )

        existing_record = ProductReview.query.filter_by(
            user_id=u_id, product_id=p_id
        ).first()

        if existing_record:
            return jsonify(
                {"success": False, "message": "Review already exists for this product"}
            )

        product_review = ProductReview(
            user_id=u_id,
            product_id=p_id,
            product_rating=rating,
            comment=pcomment,
        )

        db.session.add(product_review)
        db.session.commit()

        rating_summary = ProductReview.count_rating(str(p_id))

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Product review created",
                    "data": product_review.to_dict(),
                    "review": rating_summary,
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify(
            {"success": False, "message": "Product review not create", "error": str(e)}
        )


@product_review_bp.route("/product_review/<uuid:id>", methods=["PUT"])
def product_review_update(id):
    try:
        existing = db.session.get(ProductReview, str(id))
        print(existing)

        if not existing:
            return jsonify({"message": "review not found"}), 404

        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "All Data Are reqired"}), 400

        rating = data.get("product_rating")

        if not rating:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "product_rating are required",
                    }
                ),
                400,
            )

        existing.product_rating = rating
        existing.comment = data.get("comment")

        db.session.commit()

        rating_summary = ProductReview.count_rating(str(existing.product_id))

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Product review updated",
                    "data": existing.to_dict(),
                    "review": rating_summary,
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Product review not update",
                    "error": str(e),
                }
            ),
            500,
        )


@product_review_bp.route("/product_review/<uuid:id>", methods=["DELETE"])
def product_review_delete(id):
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        print(data)

        if not user_id:
            return jsonify({"message": "User Id Not Found"}), 404

        user = User.query.filter_by(id=user_id).first()
        # print(user)

        if not user:
            return jsonify({"message" : "User Not Found"})

        existing = db.session.get(ProductReview, str(id))

        if not existing:
            return jsonify({"message": "Product Review Not Found"}), 404
        
        print(existing.user_id)
        print(user.id)

        p_id = existing.product_id

        if existing.user_id == user.id or (user.role and user.role.value == "admin"):
            db.session.delete(existing)
            db.session.commit()
        else:
            return jsonify({"success": False, "message": "Not authorized to delete this review"}), 403

        rating_summary = ProductReview.count_rating(str(p_id))

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Product Review Delete Successfully",
                    "data": id,
                    "review": rating_summary,
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"success": False, "message": "Product review Not Delete"}), 500

