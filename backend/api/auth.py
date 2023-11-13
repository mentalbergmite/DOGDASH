from flask import Blueprint, request, jsonify, flash, redirect, url_for, render_template
from .models import db, CustomerLogin
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from email_validator import validate_email, EmailNotValidError

auth = Blueprint('auth', __name__, template_folder="../templates")


@auth.route("/api/login", methods=["POST"])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        customer = CustomerLogin.query.filter_by(email=email).first()
        if customer:
            if check_password_hash(customer.password, password):
                flash('Logged in successfully!', category='success')
                login_user(customer, remember=True)
                return jsonify({"message": "Login successful", "user": {"id": customer.id, "email": customer.email, "name": customer.name}})
            else:
                flash('Incorrect password, try again.', category='error')
        else:
            flash('Email does not exist.', category='error')

    return jsonify({"error": "Incorrect password or email does not exist"}), 401


@auth.route('/api/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))


@auth.route("/api/signup", methods=["POST"])
def signup():
    print("signing up")
    if request.method == "POST":
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        print('Received data:')
        print('Name:', name)
        print('Email:', email)
        print('Password:', password)
        
        try:
            validate_email(email)
        except EmailNotValidError as e:
            # Handle the case where the email is not valid
            flash('Invalid email address', category='error')
            return jsonify({"error": "Invalid email address"}), 400
        
        email_exists = CustomerLogin.query.filter_by(email=email).first()

        if email_exists:
            flash('Email address already exists', category='error')
            return jsonify({"error": "Email address already exists"}), 400

        
        
        new_user = CustomerLogin(name=name, email=email, password=generate_password_hash(password, method='sha256'))
        db.session.add(new_user)
        db.session.commit()
        flash('User Created!')
        print('user created')

        return jsonify({
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
        })
    
    return jsonify({"error": "Invalid request"}), 400
