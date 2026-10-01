from flask import Blueprint

routes = Blueprint("routes", __name__)


@routes.route("/")
def home():
    return "CloudHoux Backend API is running!"


@routes.route("/health")
def health():
    return {"Status": "ok"}