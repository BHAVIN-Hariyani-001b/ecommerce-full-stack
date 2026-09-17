from flask import Blueprint, request, jsonify
from app.db import db
from app.models.GST import GST
from app.models.product import Products
from sqlalchemy import select

gst_bp = Blueprint("gst", __name__)


@gst_bp.route("/gst/<int:gst_id>", methods=["GET"])
def get_gst(gst_id):
    try:
        gst = GST.query.get(gst_id)

        if not gst:
            return jsonify({"message": "GST not found", "success": False}), 404

        return (
            jsonify(
                {
                    "message": "GST Fetch successfully",
                    "success": True,
                    "data": gst.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return (
            jsonify(
                {
                    "message": "GST Not Fetch",
                    "success": False,
                }
            ),
            500,
        )


@gst_bp.route("/gst/get", methods=["GET"])
def get_get_all():
    try:

        gst = db.session.scalars(select(GST)).all()

        return (
            jsonify(
                {
                    "message": "GST Fetch successfully",
                    "success": True,
                    "data": [i.to_dict() for i in gst],
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return (
            jsonify(
                {
                    "message": "GST Not Fetch",
                    "success": False,
                }
            ),
            500,
        )


@gst_bp.route("/create/gst", methods=["POST"])
def create_gst():
    try:
        data = request.get_json()

        gst_rate = data.get("gst_rate")

        if not gst_rate:
            return jsonify({"message": "GST rate is required"}), 400

        existing = GST.query.filter_by(gst_rate=gst_rate).first()

        if existing:
            return jsonify({"message": "GST rate already exists"}), 409

        gst = GST(gst_rate=gst_rate, is_active=True)

        db.session.add(gst)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "GST created successfully",
                    "success": True,
                    "data": gst.to_dict(),
                }
            ),
            201,
        )
    except Exception as e:
        print(e)
        return jsonify({"messgae": "gst not add", "success": False})


@gst_bp.route("/edit/gst/<int:gst_id>", methods=["PUT"])
def update_gst(gst_id):
    try:
        gst = GST.query.get(gst_id)

        if not gst:
            return jsonify({"message": "GST not found"}), 404

        data = request.get_json()

        gst_rate = data.get("gst_rate")
        is_active = data.get("is_active")

        if gst_rate is not None:

            existing_gst = GST.query.filter(
                GST.gst_rate == gst_rate, GST.id != gst_id
            ).first()

            if existing_gst:
                return (
                    jsonify({"message": "GST rate already exists", "success": False}),
                    409,
                )

            gst.gst_rate = gst_rate

        if is_active is not None:
            gst.is_active = is_active

        db.session.commit()

        return (
            jsonify(
                {
                    "message": "GST updated successfully",
                    "success": True,
                    "data": gst.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"message": "GST Not Update", "sucess": False})


@gst_bp.route("/delete/gst/<int:gst_id>", methods=["DELETE"])
def delete_gst(gst_id):
    try:
        gst = GST.query.get(gst_id)

        if not gst:
            return jsonify({"message": "GST not found"}), 404

        if gst.products:
            return (
                jsonify({"message": "Cannot delete GST because products are using it"}),
                400,
            )

        db.session.delete(gst)
        db.session.commit()

        return jsonify({"message": "GST deleted successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "GST Not Delete", "success": False}), 500
