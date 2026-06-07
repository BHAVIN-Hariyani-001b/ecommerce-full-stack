from app import create_app
from app.models.product import Products
from app.models.category import Category
from app.models.productImage import ProductImage
from app.models.users import User
from app.models.product import Gender
from app.models.productAttribute import ProductAttribute

from app.db import db
from dotenv import load_dotenv

load_dotenv()

app = create_app()

with app.app_context():         
    db.create_all()

    # 👇 Step 1: Create all categories
    # categories = {
    #     "All"         : Category(name="All",image="all.png"),
    #     "Fashion"     : Category(name="Fashion",image="feshion.png"),
    #     "Mobile"      : Category(name="Mobile",image="mobile.png"),
    #     "Beauty"      : Category(name="Beauty",image="beauty.png"),
    #     "Electronics" : Category(name="Electronics",image="electronics.png"),
    #     "Home"        : Category(name="Home",image="home.png"),
    #     "Food"        : Category(name="Food",image="food.png"),
    # }

    # db.session.add_all(categories.values())
    # db.session.commit()  # 👈 Commit first to generate IDs

    # 👇 Step 2: Use category_id (not category string)
    # products_data = [
    #     {
    #         "product": Products(
    #             name="T-Shirt",
    #             Base_price=499,
    #             Product_price=399,
    #             sku=1001,
    #             qty=50,
    #             discount=20,
    #             category_id=categories["Fashion"].id,
    #             description="Comfortable cotton t-shirt",
    #             gender=Gender.UNISEX,
    #         ),
    #         "images": [
    #             ProductImage(image_url="https://example.com/tshirt1.jpg", is_primary=True, sort_order=1),
    #             ProductImage(image_url="https://example.com/tshirt2.jpg", is_primary=False, sort_order=2),
    #             ProductImage(image_url="https://example.com/tshirt3.jpg", is_primary=False, sort_order=3),
    #         ]
    #     }
    # ]

    # for item in products_data:
    #     product = item["product"]

    #     # attach images
    #     for img in item["images"]:
    #         product.images.append(img)

    #     db.session.add(product)

    db.session.commit()

    print("Products + Images inserted ✅")
    # print(f"✅ {len(categories)} categories inserted!")
    # print(f"✅ {len(products_data)} products inserted!")