from flask import Blueprint,jsonify,request,Response
from app.models.product import Product
from app.models.category import Category
from app.db import db
from sqlalchemy import select

product_bp = Blueprint('product',__name__)

@product_bp.route("/product/<int:id>",methods=["GET"])
def get_product(id : int) -> Response:
    """get id of the product and return product detail's base on id"""
    try:
        product = db.session.get(Product,id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        return jsonify(product.to_dict()),200
    except Exception as e:
        return jsonify({
            "message":"An error occurred while fetching the product",
            "error" : str(e)
        }),500

@product_bp.route("/product",methods=["GET"])
def get_products():
    """get category in perameter in url OR not get perameter and defualt all Product. return all product base on category"""
    try:
        category = request.args.get('category')
        print(category)
        if category:
            products = Product.query.filter(
                Product.category.has(name=category)
            ).all()
        else:
            products = Product.query.all()

        return jsonify({"products" : [i.to_dict() for i in products]})
    except Exception as e:
        return jsonify({
            "message" : "An error occurred while fetching the all products ",
            "error" : str(e)
        }),500

@product_bp.route("/product/category",methods=["GET"])
def get_category() -> Response:
    """unique category return"""
    try:
        result = db.session.execute(select(Category))
        # result = Product.query.all()
        category = result.scalars().all()

        if not result:
            return jsonify({"message" : "Category not found"}), 404
        
        data = [c.to_dict() for c in category]
        
        return jsonify({"category": data}),200
    
    except Exception as e:
        return jsonify({
            "message" : "An error occurred while fetching the category",
            "error" : str(e)
        }),500

