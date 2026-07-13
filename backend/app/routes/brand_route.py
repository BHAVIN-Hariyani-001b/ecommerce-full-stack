from flask import Blueprint, jsonify, request
from app.models.brand import Brand
from app.util.imageUpload import save_image
from app.db import db
from sqlalchemy import select

brand_bp = Blueprint("brand", __name__)


@brand_bp.route("/brand", methods=["GET"])
def brand_get():
    try:
        result = db.session.execute(select(Brand))
        brands = result.scalars().all()

        if not brands:
            return jsonify({"message": "brand data not found"}), 400

        data = [i.to_dict() for i in brands]

        return jsonify({"brand": data})

    except Exception as e:
        return jsonify({"message": "brand not get successfully", "error": str(e)}), 500


@brand_bp.route("/brand", methods=["POST"])
def brand_add():
    try:
        name = request.form.get("name")
        image_filename = request.files.get("image")

        if not name and not image_filename:
            return jsonify({"message": "Name and Image are required fields"}), 400

        if not name:
            return jsonify({"message": "Name are required fields"}), 400

        if not image_filename:
            return jsonify({"message": "image are required fields"}), 400

        image = None
        filename = save_image(
            image_filename, UPLOAD_FOLDER="../../../frontend/public/image/Brand"
        )
        if filename:
            image = filename

        print(image)

        result = Brand(name=name, image=image)

        db.session.add(result)
        db.session.commit()
        return jsonify(
            {"message": "Brand created successfully", "brand": result.to_dict()}
        )
    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": "An error occurred while creating the brand",
                    "error": str(e),
                },
            ),
            400,
        )


@brand_bp.route("/brand/<int:id>", methods=["PUT"])
def brand_update(id):
    try:
        existing = db.session.get(Brand, id)

        if not existing:
            return jsonify({"message": "brand not found"}), 404

        name = request.form.get("name")
        image_file = request.files.get("image")

        existingImage = request.form.get("existingImage")

        if not name:
            return jsonify({"message": "name is required"}), 400

        if existingImage:
            existing.image = existingImage
        elif image_file:
            filename = save_image(
                image_file, UPLOAD_FOLDER="../../../frontend/public/image/Brand"
            )
            if filename:
                existing.image = filename
        else:
            return jsonify({"message": "image is required"}), 404

        existing.name = name

        db.session.commit()

        return jsonify(
            {"message": "brand update successfully", "brand": existing.to_dict()}
        )

    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": "An error occurred while updating the brand",
                    "error": str(e),
                }
            ),
            500,
        )


@brand_bp.route("/brand/<int:id>", methods=["DELETE"])
def brand_delete(id):
    try:
        existing = db.session.get(Brand, id)

        if not existing:
            return jsonify({"message": "brand not found"}), 404
        
        brand_data = existing.to_dict()


        db.session.delete(existing)
        db.session.commit()

        return (
            jsonify({"message": "brand delete successfully", "brand": brand_data}),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "brand not delete", "error": str(e)}), 500
