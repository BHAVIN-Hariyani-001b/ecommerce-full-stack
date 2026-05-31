from flask import Blueprint,jsonify,request,Response,current_app
from app.models.product import Products, Gender, Status
from app.models.category import Category
from app.models.productImage import ProductImage
from app.models.productAttribute import ProductAttribute
from app.db import db
from werkzeug.utils import secure_filename
import os
import json
from datetime import datetime

product_bp = Blueprint('product',__name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, product_id=None):
    """Save uploaded file to img folder and return filename"""
    if not file or file.filename == '':
        return None
    
    if not allowed_file(file.filename):
        return None
    
    # Create img folder if it doesn't exist - use absolute path
    img_folder = os.path.join(os.path.dirname(__file__), '../../../frontend/public/image/product_img')
    img_folder = os.path.abspath(img_folder)
    
    try:
        os.makedirs(img_folder, exist_ok=True)
    except Exception as e:
        print(f"Error creating folder {img_folder}: {e}")
        return None
    
    # Generate unique filename
    ext = file.filename.rsplit('.', 1)[1].lower()
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
    filename = secure_filename(f"{timestamp}{file.filename}")
    
    # Save file
    filepath = os.path.join(img_folder, filename)
    try:
        file.save(filepath)
        print(f"File saved successfully to: {filepath}")
        return filename
    except Exception as e:
        print(f"Error saving file to {filepath}: {e}")
        return None

@product_bp.route("/product/<uuid:id>",methods=["GET"])
def get_product(id : int) -> Response:
    """get id of the product and return product detail's base on id"""
    try:
        product = db.session.get(Products,id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        return jsonify([
            {'message' : 'success',
              'product' : product.to_dict()
            }
        ]),200
    except Exception as e:
        return jsonify({
            "message":"An error occurred while fetching the product",
            "error" : str(e)
        }),500  
    
@product_bp.route("/product/add",methods=["POST"])
def create_product():
    """create product with all details, handle file uploads, and return created product details"""
    try:
        # Handle both JSON and form data
        data = request.form.to_dict() if request.form else {}
        if request.is_json:
            data.update(request.get_json() or {})
        
        print(data)
        
        # Validate required fields
        required_fields = ['name', 'Base_price', 'Product_price', 'sku', 'qty']
        missing_fields = []
        
        for field in required_fields:
            value = data.get(field)
            if value is None or (isinstance(value, str) and value.strip() == ''):
                missing_fields.append(field)
        
        if missing_fields:
            return jsonify({
                "message": f"Missing required fields: {', '.join(missing_fields)}",
                "required_fields": required_fields
            }), 400
        
        # Parse numeric fields
        try:
            base_price = float(data.get('Base_price'))
            product_price = float(data.get('Product_price'))
            qty = int(data.get('qty', 0))
            discount = float(data.get('discount', 0))
        except (ValueError, TypeError):
            return jsonify({
                "message": "Invalid numeric values for Base_price, Product_price, qty, or discount"
            }), 400
        
        category_name = data.get("Category") or data.get("category")
        if category_name and category_name != "option":
            category = Category.query.filter_by(name=category_name).first()
        else:
            category = Category.query.first()

        if not category:
            return jsonify({
                "message": "Category not found"
            }), 404

        gender = data.get("gender")
        if isinstance(gender, str):
            gender = gender.lower()
        try:
            gender = Gender(gender) if gender and gender != "option" else None
        except ValueError:
            gender = None

        status = data.get("status")
        if isinstance(status, str):
            status = status.lower()
        try:
            status = Status(status) if status else Status.PUBLIC
        except ValueError:
            status = Status.PUBLIC

        product = Products(
            name=data.get('name').strip(),
            Base_price=base_price,
            Product_price=product_price,
            sku=data.get('sku').strip(),
            qty=qty,
            discount=discount,
            category_id=category.id,
            description=data.get('description', '').strip() or None,
            gender=gender,
            status=status
        )

        # Handle primary image from file upload
        primary_image_file = None
        if 'primary_image' in request.files:
            primary_image_file = request.files['primary_image']
        elif 'image' in request.files:
            primary_image_file = request.files['image']
            
        if primary_image_file:
            filename = save_uploaded_file(primary_image_file)
            if filename:
                product.images.append(
                    ProductImage(
                        image_name=filename,
                        is_primary=True,
                        sort_order=1,
                    )
                )
        # Handle primary image from JSON (fallback for legacy support)
        elif data.get('image_name'):
            product.images.append(
                ProductImage(
                    image_name=data.get('image_name'),
                    is_primary=True,
                    sort_order=1,
                )
            )

        # Handle gallery images from file uploads
        gallery_files = []
        
        # Check for gallery_image_0, gallery_image_1, etc.
        idx = 0
        while f'gallery_image_{idx}' in request.files:
            gallery_files.append(request.files[f'gallery_image_{idx}'])
            idx += 1
        
        # Fallback to 'images' field
        if not gallery_files and 'images' in request.files:
            gallery_files = request.files.getlist('images')
        
        for idx, file in enumerate(gallery_files, start=2):
            filename = save_uploaded_file(file)
            if filename:
                product.images.append(ProductImage(
                    image_name=filename,
                    is_primary=False,
                    sort_order=idx,
                ))

        # Handle multiple images from JSON (fallback for legacy support)
        images_data = data.get('images', [])
        if isinstance(images_data, str):
            try:
                images_data = json.loads(images_data)
            except (json.JSONDecodeError, TypeError):
                images_data = []
        
        for idx, img in enumerate(images_data, start=2):
            if isinstance(img, str):
                continue
            if not img.get('image_name'):
                continue
            product.images.append(ProductImage(
                image_name=img.get('image_name'),
                is_primary=img.get('is_primary', False),
                sort_order=img.get('sort_order', idx),
            ))

        # Handle attributes from FormData or JSON
        attributes_data = []
        
        # Check for attributes[0], attributes[1], etc. from FormData
        attr_idx = 0
        while f'attributes[{attr_idx}]' in data:
            attr_str = data.get(f'attributes[{attr_idx}]', '')
            if isinstance(attr_str, str) and attr_str:
                try:
                    attr_obj = json.loads(attr_str)
                    if isinstance(attr_obj, dict):
                        attributes_data.append(attr_obj)
                except (json.JSONDecodeError, TypeError):
                    pass
            attr_idx += 1
        
        # Fallback to regular attributes field
        if not attributes_data:
            attributes_data = data.get('attributes', [])
            if isinstance(attributes_data, str):
                try:
                    attributes_data = json.loads(attributes_data)
                except (json.JSONDecodeError, TypeError):
                    attributes_data = []
        
        for attr in attributes_data:
            if isinstance(attr, str):
                continue
            if not isinstance(attr, dict):
                continue
            product.attributes.append(
                ProductAttribute(
                    type=attr.get('type') or attr.get('name'),
                    value=attr.get('value'),
                )
            )

        db.session.add(product)
        db.session.commit()

        return jsonify({
            "message": "Product created successfully",
            "product_id": product.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message" : "An error occurred while creating the product",
            "error" : str(e)
        }),500

@product_bp.route("/product",methods=["GET"])
def get_products():
    """get category in perameter in url OR not get perameter and defualt all Product. return all product base on category"""
    try:
        category = request.args.get('category')
        print(category)
        if category:
            products = Products.query.filter(
                Products.category.has(name=category)
            ).all()
        else:
            products = Products.query.all()

        return jsonify({"products" : [i.to_dict() for i in products]})
    except Exception as e:
        return jsonify({
            "message" : "An error occurred while fetching the all products ",
            "error" : str(e)
        }),500




