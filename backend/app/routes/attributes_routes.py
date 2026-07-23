from flask import Blueprint, request, jsonify
from app import db
from app.models.AttributeValue import AttributeValue
from app.models.Attribute import Attribute

attributes_bp = Blueprint("attributes", __name__)


# @attributes_bp.route("/attributes", methods=["GET"])
# def get_attributes():
#     try:
#         attributes = AttributeValue.query.all()
#         return jsonify([attribute.to_dict() for attribute in attributes]), 200
#     except Exception as e:
#         return jsonify({"message": "data not fetch", "error": str(e)}), 500


@attributes_bp.route("/attributes/get", methods=["GET"])
def get_attributes_type():
    try:
        attributes = Attribute.query.all()
        return jsonify([attribute.to_dict() for attribute in attributes]), 200
    except Exception as e:
        return jsonify({"message": "data not fetch", "error": str(e)}), 500


@attributes_bp.route("/attributes/add", methods=["POST"])
def create_attribute():
    try:
        data = request.get_json()
        aname = data.get("name")
        value = data.get("value")
        desc = data.get("desc")


        print(data)

        if not aname or not value:
            return jsonify({"error": "Name and value are required"}), 400

        new_attribute = Attribute(name=aname, example_value=value,description=desc)
        db.session.add(new_attribute)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "attribute's insert successfully",
                    "data": new_attribute.to_dict(),
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return (
            jsonify({"message": "duplicate record's are not allow", "error": str(e)}),
            500,
        )


@attributes_bp.route("/attributes/<uuid:attribute_id>", methods=["PUT"])
def update_attribute(attribute_id):
    try:
        attribute = Attribute.query.get(attribute_id)
        if not attribute:
            return jsonify({"error": "Attribute not found"}), 404

        data = request.get_json()
        name = data.get("name")
        value = data.get("value")
        desc = data.get("desc")

        if name:
            attribute.name = name

        if value:
            attribute.example_value = value

        if desc:
            attribute.description = desc

        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Attribute are update successfully",
                    "data": attribute.to_dict(),
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Attribute not update", "error": str(e)}), 500


@attributes_bp.route("/attributes/<uuid:attribute_id>", methods=["DELETE"])
def delete_attribute(attribute_id):
    try:
        attribute = Attribute.query.get(attribute_id)
        if not attribute:
            return jsonify({"error": "Attribute not found"}), 404

        db.session.delete(attribute)
        db.session.commit()

        return jsonify({"message": "Attribute deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
