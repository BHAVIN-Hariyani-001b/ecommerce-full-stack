from flask import Blueprint, request, jsonify
from app.models.category import Category
from app.models.product import Products
from app.db import db
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from app.util.imageUpload import save_image

# from app.util.admin import admin_required

category_bp = Blueprint("category_bp", __name__)


@category_bp.route("/product/category", methods=["GET"])
def get_category():
    """Return all categories"""
    try:
        result = db.session.execute(select(Category).order_by(Category.sort_order.asc()))
        category = result.scalars().all()

        if not category:
            return jsonify({"message": "Category not found"}), 404

        data = [c.to_dict() for c in category]
        return jsonify({"category": data}), 200

    except Exception as e:
        return (
            jsonify(
                {
                    "message": "An error occurred while fetching the category",
                    "error": str(e),
                }
            ),
            500,
        )


@category_bp.route("/product/category/add", methods=["POST"])
def create_category():
    """Add new category"""
    try:
        name = request.form.get("name")
        description = request.form.get("description")
        status = request.form.get("status")
        image_file = request.files.get("catImage")
        order = request.form.get("sort_order")

        if not name or not image_file:
            return jsonify({"message": "Name and Image are required fields"}), 400

        image = None
        filename = save_image(
            image_file, UPLOAD_FOLDER="../../../frontend/public/image/category_img"
        )
        if filename:
            image = filename

        parent_category_name = request.form.get("parentCategory")

        parent_id = None
        if parent_category_name and parent_category_name != "option":
            pcat = Category.query.filter_by(name=parent_category_name).first()
            if pcat:
                parent_id = pcat.id

        result = Category(
            name=name,
            description=description,
            image=image,
            status=status,
            parent_id=parent_id,
            sort_order=int(order),
        )

        db.session.add(result)
        db.session.commit()
        return (
            jsonify(
                {
                    "message": "Category created successfully",
                    "category": result.to_dict(),
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": "An error occurred while creating the category",
                    "error": str(e),
                }
            ),
            500,
        )


@category_bp.route("/product/category/update/<int:id>", methods=["PUT"])
def update_category(id):
    """Update existing category"""
    try:
        existing = db.session.get(Category, id)
        if not existing:
            return jsonify({"error": "Category not found"}), 404

        image_file = request.files.get("catImage")

        image = None
        if request.form.get("existingImage"):
            image = request.form.get("existingImage")
        elif image_file:
            filename = save_image(
                image_file, UPLOAD_FOLDER="../../../frontend/public/image/category_img"
            )
            if filename:
                image = filename

        parent_category_name = request.form.get("parentCategory")

        parent_id = None
        if parent_category_name and parent_category_name != "option":
            pcat = Category.query.filter_by(name=parent_category_name).first()
            if pcat:
                parent_id = pcat.id

        stmt = (
            update(Category)
            .where(Category.id == id)
            .values(
                name=request.form.get("name"),
                description=request.form.get("description"),
                image=image,
                status=request.form.get("status"),
                parent_id=parent_id,
                sort_order=int(request.form.get("sort_order")),
            )
        )

        db.session.execute(stmt)
        db.session.commit()


        return (
            jsonify(
                {
                    "message": "Category updated successfully",
                    "category": existing.to_dict(),
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": "An error occurred while updating the category",
                    "error": str(e),
                }
            ),
            500,
        )


@category_bp.route("/product/category/delete/<int:id>", methods=["DELETE"])
def delete_category(id):
    """Delete a category, detaching any products/subcategories that reference it"""
    try:
        existing = db.session.get(Category, id)
        if not existing:
            return jsonify({"error": "Category not found"}), 404

        category_data = existing.to_dict()

        # Detach products that use this as their main category
        Products.query.filter_by(category_id=id).update({"category_id": None})

        # Detach products that use this as their subcategory
        Products.query.filter_by(subcategory_id=id).update({"subcategory_id": None})

        # Detach any child categories pointing to this as their parent
        Category.query.filter_by(parent_id=id).update({"parent_id": None})

        db.session.delete(existing)
        db.session.commit()

        return (
            jsonify(
                {"message": "Category deleted successfully", "category": category_data}
            ),
            200,
        )

    except IntegrityError as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": "An error occurred while deleting the category",
                    "error": str(e),
                }
            ),
            409,
        )

    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": "An error occurred while deleting the category",
                    "error": str(e),
                }
            ),
            500,
        )
