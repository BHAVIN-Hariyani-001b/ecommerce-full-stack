from flask import Blueprint,request,jsonify
from app.models.product import Products
from app.models.category import Category
from app.db import db

search_bp = Blueprint('search',__name__)

@search_bp.route("/search",methods=["POST"])
def search():
    data = request.get_json()
    print(data)
    if not data:
        return jsonify({
            "message" : "Data Not Found"
        }),404
    
    query = data.get('query')
    print(query)

    if not query:
        return jsonify({"message": "Query parameter is required"}), 400

    results = []

    products = Products.query.join(
        Category, Products.category_id == Category.id 
    ).filter(
        db.or_(
            Products.name.ilike(f"%{query}%"),
            Category.name.ilike(f"%{query}%")
        )
    ).all()

    results = [p.to_dictt()  for p in products]
    
    return jsonify({
        "message": "Success",
        "query"  : query,
        "count"  : len(results),
        "results": results
    }), 200