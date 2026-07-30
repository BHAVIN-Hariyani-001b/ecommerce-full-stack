from flask import Blueprint, jsonify, request, Response
from app.models.product import Products, Gender, Status
from app.models.category import Category
from app.models.productImage import ProductImage
from app.models.productAttribute import ProductAttribute
from app.models.AttributeValue import AttributeValue
from app.models.Attribute import Attribute
from app.models.brand import Brand
from app.db import db
from app.util.imageUpload import save_image as save_uploaded_file
import json
from app.util.admin import admin_required
from sqlalchemy import update, delete, select
from sqlalchemy.orm import joinedload
from collections import defaultdict

product_bp = Blueprint("product", __name__)


@product_bp.route("/product/<uuid:id>", methods=["GET"])
def get_product(id) -> Response:
    """get id of the product and return product detail's base on id"""
    try:
        product = db.session.get(Products, str(id))
        if not product:
            return jsonify({"message": "Product not found"}), 404

        return jsonify({"message": "success", "product": product.to_dict()}), 200
    except Exception as e:
        return (
            jsonify(
                {
                    "message": "An error occurred while fetching the product",
                    "error": str(e),
                }
            ),
            500,
        )


@product_bp.route("/product/add", methods=["POST"])
@admin_required
def create_product():
    """create product with all details, handle file uploads, and return created product details"""
    try:
        # Handle both JSON and form data
        data = request.form.to_dict() if request.form else {}
        if request.is_json:
            data.update(request.get_json() or {})

        print(data)

        # Validate required fields
        required_fields = ["name", "Base_price", "Product_price", "sku", "qty"]
        missing_fields = []

        for field in required_fields:
            value = data.get(field)
            if value is None or (isinstance(value, str) and value.strip() == ""):
                missing_fields.append(field)

        if missing_fields:
            return (
                jsonify(
                    {
                        "message": f"Missing required fields: {', '.join(missing_fields)}",
                        "required_fields": required_fields,
                    }
                ),
                400,
            )

        # Parse numeric fields
        try:
            base_price = float(data.get("Base_price"))
            product_price = float(data.get("Product_price"))
            qty = int(data.get("qty", 0))
            discount = float(data.get("discount", 0))
        except (ValueError, TypeError):
            return (
                jsonify(
                    {
                        "message": "Invalid numeric values for Base_price, Product_price, qty, or discount"
                    }
                ),
                400,
            )

        category_name = data.get("Category") or data.get("category")
        if category_name and category_name != "option":
            category = Category.query.filter_by(name=category_name).first()
        else:
            category = Category.query.first()

        if not category:
            return jsonify({"message": "Category not found"}), 404

        parent_category_name = data.get("SubCategory")
        print(str(parent_category_name))
        if parent_category_name and parent_category_name != "option":
            parentCategory = Category.query.filter_by(name=parent_category_name).first()
        else:
            parentCategory = Category.query.first()

        if not parentCategory:
            return jsonify({"message": "Parent Category Not Found"}), 400

        brand_name = data.get("brand")
        if brand_name and brand_name != "option":
            brand = Brand.query.filter_by(name=brand_name).first()
        else:
            brand = Brand.query.first()
        print(brand)

        if not brand:
            return jsonify({"message": "Brand Not Found"}), 400

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
            name=data.get("name").strip(),
            Base_price=base_price,
            Product_price=product_price,
            sku=data.get("sku").strip(),
            qty=qty,
            brand_id=brand.id,
            discount=discount,
            category_id=category.id,
            subcategory_id=parentCategory.id if parentCategory else None,
            description=data.get("description", "").strip() or None,
            aboutItem=data.get("aboutItem", "").strip() or None,
            gender=gender,
            status=status,
        )

        # Handle primary image from file upload
        primary_image_file = None
        if "primary_image" in request.files:
            primary_image_file = request.files["primary_image"]
        elif "image" in request.files:
            primary_image_file = request.files["image"]

        if primary_image_file:
            filename = save_uploaded_file(
                primary_image_file,
                UPLOAD_FOLDER="../../../frontend/public/image/product_img",
            )
            if filename:
                product.images.append(
                    ProductImage(
                        image_name=filename,
                        is_primary=True,
                        sort_order=1,
                    )
                )
        # Handle primary image from JSON (fallback for legacy support)
        elif data.get("image_name"):
            product.images.append(
                ProductImage(
                    image_name=data.get("image_name"),
                    is_primary=True,
                    sort_order=1,
                )
            )

        # Handle gallery images from file uploads
        gallery_files = []

        # Check for gallery_image_0, gallery_image_1, etc.
        idx = 0
        while f"gallery_image_{idx}" in request.files:
            gallery_files.append(request.files[f"gallery_image_{idx}"])
            idx += 1

        # Fallback to 'images' field
        if not gallery_files and "images" in request.files:
            gallery_files = request.files.getlist("images")

        for idx, file in enumerate(gallery_files, start=2):
            filename = save_uploaded_file(
                file, UPLOAD_FOLDER="../../../frontend/public/image/product_img"
            )
            if filename:
                product.images.append(
                    ProductImage(
                        image_name=filename,
                        is_primary=False,
                        sort_order=idx,
                    )
                )

        # Handle multiple images from JSON (fallback for legacy support)
        images_data = data.get("images", [])
        if isinstance(images_data, str):
            try:
                images_data = json.loads(images_data)
            except (json.JSONDecodeError, TypeError):
                images_data = []

        for idx, img in enumerate(images_data, start=2):
            if isinstance(img, str):
                continue
            if not img.get("image_name"):
                continue
            product.images.append(
                ProductImage(
                    image_name=img.get("image_name"),
                    is_primary=img.get("is_primary", False),
                    sort_order=img.get("sort_order", idx),
                )
            )

        # Handle attributes from FormData or JSON
        attributes_data = []

        # Check for attributes[0], attributes[1], etc. from FormData
        attr_idx = 0
        while f"attributes[{attr_idx}]" in data:
            attr_str = data.get(f"attributes[{attr_idx}]", "")
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
            attributes_data = data.get("attributes", [])
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
                AttributeValue(
                    a_id=attr.get("id"),
                    p_id=product.id,
                    value=attr.get("value"),
                )
            )

        db.session.add(product)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Product created successfully",
                    "product": product.to_dict(),
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": "An error occurred while creating the product",
                    "error": str(e),
                }
            ),
            500,
        )


@product_bp.route("/product/update/<uuid:id>", methods=["PUT"])
def update_product(id) -> Response:
    """update product with all details, handle file uploads, and return updated product details"""
    try:
        data = request.form.to_dict()
        # data = request.get_json()
        print(data)
        print(request.files)

        existing = db.session.get(Products, str(id))
        if not existing:
            return jsonify({"error": "Product not found"})

        try:
            base_price = float(data.get("Base_price") or 0)
            product_price = float(data.get("Product_price") or 0)
            qty = int(data.get("qty", 0) or 0)
            discount = float(data.get("discount", 0) or 0)
        except (ValueError, TypeError):
            return (
                jsonify(
                    {
                        "message": "Invalid numeric values for Base_price, Product_price, qty, or discount"
                    }
                ),
                400,
            )

        category_name = data.get("category")
        if category_name:
            category = Category.query.filter_by(name=category_name).first()
        else:
            category = Category.query.first()

        if not category:
            return jsonify({"message": "Category not found"}), 404

        parent_category_name = data.get("SubCategory")
        if parent_category_name:
            parentCategory = Category.query.filter_by(name=parent_category_name).first()
        else:
            parentCategory = Category.query.first()

        if not parentCategory:
            return jsonify({"message": "Parent Category Not Found"}), 404

        brand_name = data.get("brand")
        if brand_name and brand_name != "option":
            brand = Brand.query.filter_by(name=brand_name).first()
        else:
            brand = Brand.query.first()
        print(brand)

        if not brand:
            return jsonify({"message": "Brand Not Found"}), 404

        gender = data.get("gender", "").lower()

        try:
            gender = Gender(gender) if gender else None
        except ValueError:
            gender = None

        status = data.get("status", "").lower()
        if isinstance(status, str):
            status = status.lower()
        try:
            status = Status(status) if status else Status.PUBLIC
        except ValueError:
            status = Status.PUBLIC

        ## all valie are update depeands on user change
        existing.name = data.get("name", existing.name).strip()
        existing.Base_price = base_price
        existing.Product_price = product_price
        existing.sku = data.get("sku", existing.sku).strip()
        existing.qty = qty
        existing.discount = discount
        existing.category_id = category.id
        existing.brand_id = brand.id
        existing.description = data.get("description", existing.description) or None
        existing.gender = gender
        existing.status = status
        existing.aboutItem = data.get("aboutItem", existing.aboutItem) or None
        existing.subcategory_id = parentCategory.id

        # update primary image``
        primary_image_file = None
        if "image" in request.files:
            primary_image_file = request.files.get("image")

        if primary_image_file:
            filename = save_uploaded_file(
                primary_image_file,
                UPLOAD_FOLDER="../../../frontend/public/image/product_img",
            )
            if filename:
                db.session.execute(
                    update(ProductImage)
                    .where(
                        ProductImage.product_id == str(id),
                        ProductImage.is_primary == True,
                    )
                    .values(image_name=filename)
                )

        # remove gallry image for admin remove
        remove_img_ids = request.form.getlist("removeImg[]")

        if remove_img_ids:
            for i in remove_img_ids:
                db.session.execute(delete(ProductImage).where(ProductImage.id == i))

        ## add gallery image
        gallery_files = request.files.getlist("images")
        for file in gallery_files:
            filename = save_uploaded_file(
                file, UPLOAD_FOLDER="../../../frontend/public/image/product_img"
            )
            if filename:
                existing.images.append(ProductImage(image_name=filename))

        new_order = 2
        for img in existing.images:
            if img.is_primary:
                img.sort_order = 1
            else:
                if (img.sort_order or 0) > 1:
                    img.sort_order = new_order
                    new_order += 1

        ## add attributes

        attributes_data = []

        idx = 0
        while f"attributes[{idx}]" in data:
            attr_str = data.get(f"attributes[{idx}]")
            attr_obj = json.loads(attr_str)

            if "id" not in attr_obj:
                attributes_data.append(attr_obj)

            idx += 1

        for i in attributes_data:
            attribute = Attribute.query.filter_by(name=i.get("type")).first()

            if not attribute:
                continue

            db.session.add(
                AttributeValue(
                    p_id=existing.id,
                    value=i.get("value"),
                    a_id=attribute.id
                )
            )


        # remove deleted attributes
        remove_attr_ids = request.form.getlist("removeAttributes[]")
        for attr_id in remove_attr_ids:
            db.session.execute(
                delete(AttributeValue).where(AttributeValue.id == attr_id)
            )

        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Product update successfully",
                    "product": existing.to_dict(),
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": "An error occurred while updateing product",
                    "error": str(e),
                }
            ),
            500,
        )


@product_bp.route("/product/delete/<uuid:id>", methods=["DELETE"])
def delete_product(id):
    """product delete with use of the product id"""
    try:
        print(id)
        existing = db.session.get(Products, str(id))

        if not existing:
            return jsonify({"error": "Product not found"}), 404

        db.session.delete(existing)
        db.session.commit()

        print(existing)
        return jsonify({"message": "product delete successfully"})
    except Exception as e:
        return (
            jsonify(
                {
                    "message": "An error occurred while deleting the product",
                    "error": str(e),
                }
            ),
            500,
        )


@product_bp.route("/product", methods=["GET"])
def get_products():
    """get category in perameter in url OR not get perameter and defualt all Product. return all product base on category"""
    try:
        category = request.args.get("category")
        role = request.args.get("role")
        if category:
            products = Products.query.filter(Products.category.has(name=category)).all()
        else:
            products = Products.query.all()
        if role == "admin":
            return jsonify({"products": [i.to_dict() for i in products]})

        return jsonify({"products": [i.to_dictt() for i in products]})
    except Exception as e:
        return (
            jsonify(
                {
                    "message": "An error occurred while fetching the all products ",
                    "error": str(e),
                }
            ),
            500,
        )


@product_bp.route("/products/homepage/product-summary")
def get_products_page():
    try:
        products = (
            db.session.query(Products)
            .options(
                joinedload(Products.category),
                joinedload(Products.images),
            )
            .all()
        )

        grouped = defaultdict(list)
        category_meta = {}

        for product in products:
            cat_id = product.category_id
            grouped[cat_id].append(product.to_dictt())

            if cat_id not in category_meta:
                category_meta[cat_id] = (
                    product.category.name if product.category else None
                )

        result = [
            {
                "id": cat_id,
                "categoryName": category_meta[cat_id],
                "products": products_list,
            }
            for cat_id, products_list in grouped.items()
        ]

        return jsonify({"categories": result})

    except Exception as e:
        return jsonify({"message": "Error fetching products", "error": str(e)}), 500
