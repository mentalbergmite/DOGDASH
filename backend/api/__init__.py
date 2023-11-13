from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from flask_cors import CORS, cross_origin

db = SQLAlchemy()

def create_app():
    
    app = Flask(__name__, template_folder="templates")
    CORS(app)
    app.config['SECRET_KEY'] = "doggydash"
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db' 
    db.init_app(app)
    
    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    from .models import CustomerLogin
    
    with app.app_context():
        db.create_all()
        print("Created database")

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader

    def load_customer(id):
        return CustomerLogin.query.get(int(id))

    return app

def create_database(app):
    if not path.exists("api/database.db"):
        db.create_all(app=app)
        print("Created database!")

