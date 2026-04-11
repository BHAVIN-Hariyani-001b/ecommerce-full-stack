from app import create_app
from app.models.product import Product
from app.models.category import Category
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
    products = [
        # Fashion
        Product(name="T-Shirt",  price=499,   discount=20, category_id=categories["Fashion"].id),
        Product(name="Jeans",    price=1299,  discount=15, category_id=categories["Fashion"].id),
        Product(name="Sneakers", price=2499,  discount=25, category_id=categories["Fashion"].id),

        # Mobile
        Product(name="iPhone 15",           price=79999, discount=5,  category_id=categories["Mobile"].id),
        Product(name="Samsung Galaxy S23",  price=69999, discount=10, category_id=categories["Mobile"].id),
        Product(name="OnePlus 11",          price=56999, discount=8,  category_id=categories["Mobile"].id),

        # Beauty
        Product(name="Lipstick",  price=299, discount=10, category_id=categories["Beauty"].id),
        Product(name="Face Wash", price=199, discount=5,  category_id=categories["Beauty"].id),
        Product(name="Perfume",   price=999, discount=20, category_id=categories["Beauty"].id),

        # Electronics
        Product(name="Samsung TV",          price=45000, discount=15, category_id=categories["Electronics"].id),
        Product(name="Bluetooth Speaker",   price=1999,  discount=30, category_id=categories["Electronics"].id),
        Product(name="Laptop",              price=65000, discount=12, category_id=categories["Electronics"].id),

        # Home
        Product(name="Sofa",         price=25000, discount=18, category_id=categories["Home"].id),
        Product(name="Dining Table", price=15000, discount=10, category_id=categories["Home"].id),
        Product(name="Bed Sheet",    price=1200,  discount=5,  category_id=categories["Home"].id),

        # Food
        Product(name="Pizza",  price=349, discount=0,  category_id=categories["Food"].id),
        Product(name="Burger", price=199, discount=5,  category_id=categories["Food"].id),
        Product(name="Pasta",  price=299, discount=10, category_id=categories["Food"].id),
    ]

    db.session.add_all(products)
    db.session.commit()

    print(f"✅ {len(categories)} categories inserted!")
    print(f"✅ {len(products)} products inserted!")