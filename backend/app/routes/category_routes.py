from flask import Blueprint, request, jsonify
from app.models.category import Category
from app.db import db
from sqlalchemy import select,update,delete
from app.util.imageUpload import save_image
from app.util.admin import admin_required

category_bp = Blueprint('category_bp', __name__)

@category_bp.route("/product/category",methods=["GET"])
def get_category():
    """unique category return"""
    try:
        result = db.session.execute(select(Category))
        category = result.scalars().all()

        if not category:
            return jsonify({"message" : "Category not found"}), 404
        
        data = [c.to_dict() for c in category]
        return jsonify({"category": data}),200
    
    except Exception as e:
        return jsonify({
            "message" : "An error occurred while fetching the category",
            "error" : str(e)
        }),500

@category_bp.route('/product/category/add', methods=['POST'])
def create_category():
    """add new category"""
    try:
        print(request.headers)
        print(request.form)

        name = request.form.get('name')
        description = request.form.get('description')
        status = request.form.get('status')
        image_file = request.files.get('catImage')

        image = None
        if image_file:
            filename = save_image(image_file, UPLOAD_FOLDER = '../../../frontend/public/image/category_img')
            if filename:
                image = filename

        if not name and image:
            return jsonify({"message": "Name and Image are required fields"}), 400


        parentCategory = request.form.get('parentCategory')
        print(parentCategory)

        parent_category_name = request.form.get("parentCategory")
        if parent_category_name and parent_category_name != "option":
            pcat = Category.query.filter_by(name=parent_category_name).first()
        else:
            pcat = Category.query.first()
            

        if not pcat:
            return jsonify({
                "message": "Category not found"
            }), 404

        print(pcat)

        result = Category(
            name=name,
            description=description,
            image=image,
            status=status,
            parent_id=pcat.id
        )

        db.session.add(result)
        db.session.commit()
        return jsonify({"message": "Category created successfully", "category": result.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message" : "An error occurred while creating the category",
            "error" : str(e)
        }),500
    
@category_bp.route('/product/category/update/<int:id>', methods=['PUT'])
def update_category(id):
    """update new category"""
    try:
        existing = db.session.get(Category,id)
        if not existing:
            return jsonify({"error": "Category not found"}), 404
        
        image_file = request.files.get('catImage')

        image = None
        if request.form.get('existingImage'):
            image = request.form.get('existingImage')
        else:
            if image_file:
                filename = save_image(image_file, UPLOAD_FOLDER = '../../../frontend/public/image/category_img')
                if filename:
                    image = filename

        parent_category_name = request.form.get("parentCategory")
        if parent_category_name and parent_category_name != "option":
            pcat = Category.query.filter_by(name=parent_category_name).first()
        else:
            pcat = Category.query.first()
            

        if not pcat:
            return jsonify({
                "message": "Category not found"
            }), 404
        
        
        result = update(Category).where(Category.id == id).values(
            name=request.form.get('name'),
            description=request.form.get('description'),
            image=image,
            status=request.form.get('status'),
            parent_id = pcat.id,
        )

        db.session.execute(result)
        db.session.commit()
        return jsonify({"message": "Category updated successfully","category": existing.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message" : "An error occurred while updating the category",
            "error" : str(e)
        }),500
    
@category_bp.route('/product/category/delete/<int:id>', methods=['DELETE'])
def delete_category(id):
    """Delete new category"""
    try:
        existing = db.session.get(Category, id)
        if not existing:
            return jsonify({"error": "Category not found"}), 404

        db.session.delete(existing)
        db.session.commit()
        return jsonify({"message": "Category deleted successfully","category": existing.to_dict()}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "An error occurred while deleting the category",
            "error" : str(e)
        }),500

