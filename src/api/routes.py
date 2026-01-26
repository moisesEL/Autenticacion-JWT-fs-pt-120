"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select  # <--- Importante para el nuevo estilo
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }
    return jsonify(response_body), 200

#
# REGISTRO DE USUARIO


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    if not data.get('email') or not data.get('password'):
        return jsonify({"mensaje": "Email y contraseña obligatorio"}), 400

    existing_user = db.session.execute(select(User).where(
        User.email == data.get('email'))).scalars().first()
    if existing_user:
        return jsonify({"msg": "Usuario existente"}), 400

    new_user = User(
        email=data.get('email'),
        is_active=True
    )
    new_user.set_password(data.get('password'))

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado correctamente"}), 201

# LOGIN DE USUARIO


@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body.get("email", None)
    password = body.get("password", None)

    if not email:
        return jsonify({"msg": "email obligatorio"}), 400

    user = db.session.execute(select(User).where(
        User.email == email)).scalars().first()

    if not user:
        return jsonify({"msg": "usuario no encontrado"}), 404

    if not user.check_password(password):
        return jsonify({"msg": "Contraseña incorrecta"}), 401

    # Generamos el token
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": access_token,
        "user": user.serialize(),
        "email": user.email
    }), 200

# RUTA PRIVADA


@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    current_user_id = get_jwt_identity()

    user = db.session.get(User, current_user_id)

    if not user:
        return jsonify({"done": False, "msg": "Usuario no encontrado"}), 404

    return jsonify({
        "done": True,
        "user": user.serialize(),
    }), 200
