from flask import Blueprint, request, jsonify
from app import db
from app.models import Attribute

attributes_bp = Blueprint('attributes', __name__)

@attributes_bp.route('/attributes', methods=['GET'])
def get_attributes():
    try:
        attributes = Attribute.query.all()
        return jsonify([attribute.to_dict() for attribute in attributes]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@attributes_bp.route('/attributes', methods=['POST'])
def create_attribute():
    try:
        data = request.get_json()
        name = data.get('name')
        value = data.get('value')

        if not name or not value:
            return jsonify({'error': 'Name and value are required'}), 400

        new_attribute = Attribute(name=name, value=value)
        db.session.add(new_attribute)
        db.session.commit()

        return jsonify(new_attribute.to_dict()), 201    

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@attributes_bp.route('/attributes/<int:attribute_id>', methods=['PUT'])
def update_attribute(attribute_id):
    try:
        attribute = Attribute.query.get(attribute_id)
        if not attribute:
            return jsonify({'error': 'Attribute not found'}), 404

        data = request.get_json()
        name = data.get('name')
        value = data.get('value')

        if name:
            attribute.name = name
        if value:
            attribute.value = value

        db.session.commit()

        return jsonify(attribute.to_dict()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@attributes_bp.route('/attributes/<int:attribute_id>', methods=['DELETE'])
def delete_attribute(attribute_id):
    try:
        attribute = Attribute.query.get(attribute_id)
        if not attribute:
            return jsonify({'error': 'Attribute not found'}), 404

        db.session.delete(attribute)
        db.session.commit()

        return jsonify({'message': 'Attribute deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
