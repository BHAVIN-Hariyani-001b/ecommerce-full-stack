from flask import Blueprint, jsonify

health_db = Blueprint("health", __name__)


@health_db.route("/health",methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200