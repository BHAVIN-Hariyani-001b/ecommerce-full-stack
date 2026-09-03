from flask import Blueprint, jsonify, request
from app.db import db
from app.models.users import User
from app.models.UserAddress import UserAddress

user_address_bp = Blueprint("user_address", __name__)


@user_address_bp.route("/address/<uuid:id>", methods=["GET"])
def user_address_get(id):
    """user address get for use in id"""
    try:
        existing = db.session.get(User, id)

        if not existing:
            return jsonify({"message": "User is Not Found"}), 404

        user_address = UserAddress.query.filter_by(user_id=existing.id).all()

        if not user_address:
            return jsonify({"message": "User Address is Not Found"}), 404

        result = [i.to_dict() for i in user_address]

        return (
            jsonify({"message": "user Address Fetch successfully", "data": result}),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"message": "User Address Not Found"}), 500


@user_address_bp.route("/address/", methods=["POST"])
def user_address_post():
    """user address Add"""
    try:
        data = request.get_json()
        user_id = data.get("user_id")

        existing = db.session.get(User, user_id)

        if not existing:
            return jsonify({"message": "User is Not Found"}), 404

        user_area = data.get("streetArea")
        user_city = data.get("city")
        user_state = data.get("state")
        user_pin_code = data.get("pin_code")
        user_name = data.get("username")
        user_location_type = data.get("location_type")
        user_phone = data.get("phone")

        required_fields = {
            "username": user_name,
            "city": user_city,
            "state": user_state,
            "pin_code": user_pin_code,
            "location_type": user_location_type,
            "phone": user_phone,
        }

        missing_fields = [
            field
            for field, value in required_fields.items()
            if value is None or str(value).strip() == ""
        ]

        if missing_fields:
            return (
                jsonify(
                    {   
                        "message": "Required fields are missing",
                        "missing_fields": missing_fields,
                    }
                ),
                400,
            )

        if not user_location_type:
            return (
                jsonify(
                    {
                        "message": "Invalid location_type",
                    }
                ),
                400,
            )   

        user_address = UserAddress(
            user_id=user_id,
            street_area=user_area,
            city=user_city,
            state=user_state,
            pin_code=user_pin_code,
            userfullname=user_name,
            location_type=user_location_type,
            isPrimary=data.get("isPrimary", False)
        )

        try:
            existing.phone = user_phone
        except Exception as e:
            db.session.rollback()
            print(e)
            return jsonify({"message": str(e)}), 500

        db.session.add(user_address)
        db.session.commit()

        UserAddress.query.filter_by(user_id=user_id).update({"isPrimary": False})
        user_address.isPrimary = True

        db.session.commit()

        return (
            jsonify(
                {
                    "message": "user Address Fetch successfully",
                    "data": user_address.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "User Address Not Found"}), 500


@user_address_bp.route("/address/<uuid:id>", methods=["PUT"])
def user_address_update(id):
    """user address Add"""
    try:
        data = request.get_json()
        print(data)

        existing = db.session.get(UserAddress, id)

        if not existing:
            return jsonify({"message": "User Address Not Found is Not Found"}), 404

        required = [
            "city",
            "streetArea",
            "state",
            "pin_code",
            "location_type",
            "username",
            "phone",
        ]

        missing = [f for f in required if not data.get(f)]

        if missing:
            return jsonify({"message": f"Missing fileds : {', '.join(missing)}"}), 400

        existing.city = data.get("city")
        existing.street_area = data.get("streetArea")
        existing.state = data.get("state")
        existing.pin_code = data.get("pin_code")
        existing.location_type = data.get("location_type")
        existing.userfullname = data.get("username")
        existing.isPrimary = data.get("isPrimary", existing.isPrimary)

        existingUser = db.session.get(User, existing.user_id)
        existingUser.phone = data.get("phone")


        UserAddress.query.filter_by(user_id=existingUser.id).update({"isPrimary": False})
        existing.isPrimary = True
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "user Address Update successfully",
                    "data": existing.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "User Address Not Found"}), 500


@user_address_bp.route("/address/<uuid:id>", methods=["DELETE"])
def user_address_delete(id):
    """user address Add"""
    try:
        existing = db.session.get(UserAddress, id)

        if not existing:
            return jsonify({"message": "User is Not Found"}), 404

        db.session.delete(existing)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "user Address Delete successfully",
                    "data": str(id),
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "User Address Not Found"}), 500
