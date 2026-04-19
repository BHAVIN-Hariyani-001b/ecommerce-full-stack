from app import create_app
from app.models.product import Product
from app.models.category import Category
from app.models.productImage import ProductImage
from app.models.users import User

from app.db import db
from dotenv import load_dotenv

load_dotenv()

app = create_app()

with app.app_context():
    db.drop_all()           
    db.create_all()

    # 👇 Step 1: Create all categories
    categories = {
        "All"         : Category(name="All",image="all.png"),
        "Fashion"     : Category(name="Fashion",image="feshion.png"),
        "Mobile"      : Category(name="Mobile",image="mobile.png"),
        "Beauty"      : Category(name="Beauty",image="beauty.png"),
        "Electronics" : Category(name="Electronics",image="electronics.png"),
        "Home"        : Category(name="Home",image="home.png"),
        "Food"        : Category(name="Food",image="food.png"),
    }

    db.session.add_all(categories.values())
    db.session.commit()  # 👈 Commit first to generate IDs

    # 👇 Step 2: Use category_id (not category string)
    products_data = [
        {
            "product": Product(
                name="T-Shirt",
                price=499,
                discount=20,
                category_id=categories["Fashion"].id
            ),
            "images": [
                ProductImage(image_url="https://example.com/tshirt1.jpg", is_primary=True, order=1),
                ProductImage(image_url="https://example.com/tshirt2.jpg", is_primary=False, order=2),
                ProductImage(image_url="https://example.com/tshirt3.jpg", is_primary=False, order=3),
            ]
        },
        {
            "product": Product(
                name="Jeans",
                price=1299,
                discount=15,
                category_id=categories["Fashion"].id
            ),
            "images": [
                ProductImage(image_url="https://example.com/jeans1.jpg", is_primary=True, order=1),
                ProductImage(image_url="https://example.com/jeans2.jpg", is_primary=False, order=2),
            ]
        },
        {
            "product": Product(
                name="Sneakers",
                price=2499,
                discount=25,
                category_id=categories["Fashion"].id
            ),
            "images": [
                ProductImage(image_url="https://example.com/shoes1.jpg", is_primary=True, order=1),
                ProductImage(image_url="https://example.com/shoes2.jpg", is_primary=False, order=2),
            ]
        },

        # Mobile
        {
            "product": Product(
                name="iPhone 15",
                price=79999,
                discount=5,
                category_id=categories["Mobile"].id
            ),
            "images": [
                ProductImage(image_url="https://example.com/iphone1.jpg", is_primary=True, order=1),
                ProductImage(image_url="https://example.com/iphone2.jpg", is_primary=False, order=2),
                ProductImage(image_url="https://example.com/iphone3.jpg", is_primary=False, order=3),
            ]
        },
        {
            "product": Product(
                name="Samsung Galaxy S23",
                price=69999,
                discount=10,
                category_id=categories["Mobile"].id
            ),
            "images": [
                ProductImage(image_url="https://example.com/samsung1.jpg", is_primary=True, order=1),
                ProductImage(image_url="https://example.com/samsung2.jpg", is_primary=False, order=2),
            ]
        },

        # Beauty
        {
            "product": Product(
                name="Lipstick",
                price=299,
                discount=10,
                category_id=categories["Beauty"].id
            ),
            "images": [
                ProductImage(image_url="https://example.com/lipstick1.jpg", is_primary=True, order=1),
            ]
        },

        # Electronics
        {
            "product": Product(
                name="Samsung TV",
                price=45000,
                discount=15,
                category_id=categories["Electronics"].id
            ),
            "images": [
                ProductImage(image_url="https://example.com/tv1.jpg", is_primary=True, order=1),
                ProductImage(image_url="https://example.com/tv2.jpg", is_primary=False, order=2),
            ]
        },

        # Home
        {
            "product": Product(
                name="Sofa",
                price=25000,
                discount=18,
                category_id=categories["Home"].id
            ),
            "images": [
                ProductImage(image_url="https://example.com/sofa1.jpg", is_primary=True, order=1),
            ]
        },

        # Food
        {
            "product": Product(
                name="Pizza",
                price=349,
                discount=0,
                category_id=categories["Food"].id
            ),
            "images": [
                ProductImage(image_url="https://example.com/pizza1.jpg", is_primary=True, order=1),
            ]
        },
    ]

    for item in products_data:
        product = item["product"]

        # attach images
        for img in item["images"]:
            product.images.append(img)

        db.session.add(product)

    db.session.commit()

    print("Products + Images inserted ✅")
    print(f"✅ {len(categories)} categories inserted!")
    print(f"✅ {len(products_data)} products inserted!")