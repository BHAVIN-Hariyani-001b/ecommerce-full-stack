from flask import Blueprint, jsonify, request
import razorpay
from app.db import db
import os
from dotenv import load_dotenv
from app.models.payment import Payment, PaymentStatus, PaymentMethod

load_dotenv()


payment_order = Blueprint("payment", __name__)

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
ALLOWED_METHODS = {"card", "upi"}

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


@payment_order.route("/create/order", methods=["POST"])
def create_payment_order():
    try:
        data = request.get_json(silent=True) or {}
        amount = data.get("amount")
        method = data.get("method", "card")


        if not isinstance(amount, int) or amount < 100:
            return (
                jsonify({"error": "Amount must be an integer of at least 100 paise."}),
                400,
            )
        if method not in ALLOWED_METHODS:
            return jsonify({"error": "Unsupported payment method."}), 400
        if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
            return (
                jsonify(
                    {"error": "Razorpay credentials are not configured on the server."}
                ),
                500,
            )

        order = client.order.create(
            {
                "amount": amount,
                "currency": "INR",
                "receipt": f"receipt_{os.urandom(6).hex()}",
                "notes": {"preferred_method": method},
            }
        )

    except Exception as e:
        return (
            jsonify({"error": "Unable to create payment order.", "detail": str(e)}),
            502,
        )
