from flask import Blueprint, request, jsonify
from app.models.category import Category
from app.db import db
from sqlalchemy import select,update,delete

category_bp = Blueprint('category_bp', __name__)

@category_bp.route("/product/category",methods=["GET"])
def get_category():
    """unique category return"""
    try:
        result = db.session.execute(select(Category))
        category = result.scalars().all()

        if not category:
            return jsonify({"message" : "Category not found"}), 404
        
        data = [c.to_dict() for c in category if c.status.value == "active"]
        return jsonify({"category": data}),200
    
    except Exception as e:
        return jsonify({
            "message" : "An error occurred while fetching the category",
            "error" : str(e)
        }),500

@category_bp.route('/categories', methods=['POST'])
def create_category():
    """add new category"""
    try:
        data =  request.get_json()

        if not data.get('name'):
            return jsonify({"error": "Name is required"}), 400
        
        result = Category(
            name=data.get('name'),
            slug=data.get('slug'),
            description=data.get('description'),
            image=data.get('catImage'),
            status=data.get('status', 'active')
        )

        db.session.add(result)
        db.session.commit()
        return jsonify({"message": "Category created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message" : "An error occurred while creating the category",
            "error" : str(e)
        }),500
    
@category_bp.route('/categories/<int:id>', methods=['PUT'])
def update_category(id):
    """update new category"""
    try:
        data =  request.get_json()

        existing = db.session.get(Category,id)
        if not existing:
            return jsonify({"error": "Category not found"}), 404
        
        result = update(Category).where(Category.id == id).values(
            name=data.get('name'),
            slug=data.get('slug'),
            description=data.get('description'),
            image=data.get('catImage'),
            status=data.get('status')
        )

        db.session.execute(result)
        db.session.commit()
        return jsonify({"message": "Category updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message" : "An error occurred while creating the category",
            "error" : str(e)
        }),500
    
@category_bp.route('/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    """Delete new category"""
    try:
        existing = db.session.get(Category, id)
        if not existing:
            return jsonify({"error": "Category not found"}), 404

        result = delete(Category).where(Category.id == id)
        db.session.execute(result)
        db.session.commit()
        return jsonify({"message": "Category deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "An error occurred while deleting the category",
            "error" : str(e)
        }),500

