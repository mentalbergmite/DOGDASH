from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length, EqualTo
from . import db


# database models based on schema

class Customer(db.Model):
    __tablename__ = "Customers"  # Table name in database
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(255))
    #customer_logins = db.relationship('CustomerLogin', backref='customer', lazy='dynamic')

class CustomerLogin(UserMixin, db.Model):
    #__tablename__ = "CustomerLogin"  # Table name in database
    id = db.Column(db.Integer, primary_key=True)
    #customer_id = db.Column(db.Integer, db.ForeignKey('Customers.id'))
    name = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    
    #Salt = db.Column(db.String(50))
    # Define the many-to-one relationship with the Customer model
    #customer = db.relationship('Customer', back_populates='customer_logins')

class Seller(db.Model):
    __tablename__ = "Sellers"  # Table name in database
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(255))
    # Define the one-to-many relationship between Seller and SellerLogin
    #seller_logins = db.relationship('SellerLogin', backref='seller', lazy='dynamic')

class Product(db.Model):
    __tablename__ = "Products"  # Table name in database
    ProductID = db.Column(db.Integer, primary_key=True)
    ProductName = db.Column(db.String(255))
    Price = db.Column(db.DECIMAL(10, 2))
    Description = db.Column(db.Text)
    CategoryID = db.Column(db.Integer)
    StockQuantity = db.Column(db.Integer)
    # Define the many-to-one relationship with the Category model
    #category = db.relationship('Category', foreign_keys=[CategoryID], backref='products')


"""
# Define API routes for CRUD operations

# Add customer to database
@app.route('/add_customer', methods=['POST'])
def add_customer():
    if request.method == 'POST':
        customer_name = request.form['customer_name']
        customer_email = request.form['customer_email']
        customer_phone = request.form['customer_phone']
        customer_address = request.form['customer_address']
        customer_id = request.form.get('customer_id')

        existing_customer = Customer.query.get(customer_id)

        if existing_customer:
            return edit_customer(existing_customer.CustomerID)
        else:
            new_customer = Customer(CustomerName=customer_name, CustomerEmail=customer_email, CustomerPhone=customer_phone, CustomerAddress=customer_address)
            if customer_id:
                new_customer.CustomerID = customer_id
            db.session.add(new_customer)
            db.session.commit()
    return redirect(url_for('index'))

# Update customer
@app.route('/edit_customer/<int:id>', methods=['GET', 'POST'])
def edit_customer(id):
    customer = Customer.query.get(id)
    if request.method == 'POST':
        customer.CustomerName = request.form['customer_name']
        customer.CustomerEmail = request.form['customer_email']
        customer.CustomerPhone = request.form['customer_phone']
        customer.CustomerAddress = request.form['customer_address']
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('edit_customer.html', customer=customer)

# Delete customer from database by ID
@app.route('/delete_customer/<int:id>')
def delete_customer(id):
    customer = Customer.query.get(id)
    db.session.delete(customer)
    db.session.commit()
    return redirect(url_for('index'))

# Add seller to database
@app.route('/add_seller', methods=['POST'])
def add_seller():
    if request.method == 'POST':
        seller_name = request.form['seller_name']
        seller_email = request.form['seller_email']
        seller_phone = request.form['seller_phone']
        seller_address = request.form['seller_address']
        seller_id = request.form.get('seller_id')

        existing_seller = Seller.query.get(seller_id)

        if existing_seller:
            return edit_seller(existing_seller.SellerID)
        else:
            new_seller = Seller(SellerName=seller_name, SellerEmail=seller_email, SellerPhone=seller_phone, SellerAddress=seller_address)
            if seller_id:
                new_seller.SellerID = seller_id
            db.session.add(new_seller)
            db.session.commit()
    return redirect(url_for('index'))

# Update seller
@app.route('/edit_seller/<int:id>', methods=['GET', 'POST'])
def edit_seller(id):
    seller = Seller.query.get(id)
    if request.method == 'POST':
        seller.SellerName = request.form['seller_name']
        seller.SellerEmail = request.form['seller_email']
        seller.SellerPhone = request.form['seller_phone']
        seller.SellerAddress = request.form['seller_address']
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('edit_seller.html', seller=seller)

# Delete seller from database by ID
@app.route('/delete_seller/<int:id>')
def delete_seller(id):
    seller = Seller.query.get(id)
    db.session.delete(seller)
    db.session.commit()
    return redirect(url_for('index'))

# Add product to database
@app.route('/add_product', methods=['POST'])
def add_product():
    if request.method == 'POST':
        product_name = request.form['product_name']
        price = request.form['price']
        description = request.form['description']
        category_id = request.form['category_id']
        stock_quantity = request.form['stock_quantity']
        product_id = request.form.get('product_id')

        existing_product = Product.query.get(product_id)

        if existing_product:
            return edit_product(existing_product.ProductID)
        else:
            new_product = Product(ProductName=product_name, Price=price, Description=description, CategoryID=category_id, StockQuantity=stock_quantity)
            if product_id:
                new_product.ProductID = product_id
            db.session.add(new_product)
            db.session.commit()
    return redirect(url_for('index'))

# Update product
@app.route('/edit_product/<int:id>', methods=['GET', 'POST'])
def edit_product(id):
    product = Product.query.get(id)
    if request.method == 'POST':
        product.ProductName = request.form['product_name']
        product.Price = request.form['price']
        product.Description = request.form['description']
        product.CategoryID = request.form['category_id']
        product.StockQuantity = request.form['stock_quantity']
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('edit_product.html', product=product)

# Delete product from database by ID
@app.route('/delete_product/<int:id>')
def delete_product(id):
    product = Product.query.get(id)
    db.session.delete(product)
    db.session.commit()
    return redirect(url_for('index'))

# Add restaurant table to the database
@app.route('/add_table', methods=['POST'])
def add_table():
    if request.method == 'POST':
        table_number = request.form['table_number']
        seats = request.form['seats']
        table_id = request.form.get('table_id')

        existing_table = Restaurant.query.get(table_id)

        if existing_table:
            return edit_table(existing_table.TableID)
        else:
            new_table = Restaurant(TableNumber=table_number, Seats=seats)
            if table_id:
                new_table.TableID = table_id
            db.session.add(new_table)
            db.session.commit()
    return redirect(url_for('index'))

# Update restaurant table
@app.route('/edit_table/<int:id>', methods=['GET', 'POST'])
def edit_table(id):
    table = Restaurant.query.get(id)
    if request.method == 'POST':
        table.TableNumber = request.form['table_number']
        table.Seats = request.form['seats']
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('edit_table.html', table=table)

# Delete restaurant table from the database by ID
@app.route('/delete_table/<int:id>')
def delete_table(id):
    table = Restaurant.query.get(id)
    db.session.delete(table)
    db.session.commit()
    return redirect(url_for('index'))

### Login page

# Create the login form
class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')

# Create the sign-up form
class SignUpForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6, max=40)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

# Route for handling customer login
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        customer = Customer.query.filter_by(email=form.email.data).first()
        if customer and customer.password == form.password.data:
            login_user(customer)
            return redirect(url_for('dashboard'))  # Redirect to the dashboard page
        else:
            flash('Login failed. Check your email and password.', 'danger')
    return render_template('login.html', form=form)


# Route for handling customer sign-up
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignUpForm()
    if form.validate_on_submit():
        customer = Customer(email=form.email.data)
        customer.set_password(form.password.data)
        db.session.add(customer)
        db.session.commit()
        flash('Your account has been created. You can now log in.', 'success')
        return redirect(url_for('login'))  # Redirect to the login page
    return render_template('signup.html', form=form)

# Route for customer logout
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

# Read
@app.route('/')
def index():
    customers = Customer.query.all()
    sellers = Seller.query.all()
    products = Product.query.all()
    tables = Restaurant.query.all()
    return render_template('index.html', customers=customers, sellers=sellers, products=products, tables=tables)



#sample functions to populate database
def create_sample_customers():
    customer1 = Customer(CustomerName="Alice", CustomerEmail="alice@example.com", CustomerPhone="123-456-7890", CustomerAddress="123 Main St")
    customer2 = Customer(CustomerName="Bob", CustomerEmail="bob@example.com", CustomerPhone="987-654-3210", CustomerAddress="456 Elm St")
    
    # Add customers to the database
    db.session.add_all([customer1, customer2])
    db.session.commit()


def create_sample_sellers():
    seller1 = Seller(SellerName="Seller 1", SellerEmail="seller1@example.com", SellerPhone="111-222-3333", SellerAddress="789 Oak St")
    seller2 = Seller(SellerName="Seller 2", SellerEmail="seller2@example.com", SellerPhone="444-555-6666", SellerAddress="321 Pine St")
    
    # Add sellers to the database
    db.session.add_all([seller1, seller2])
    db.session.commit()


def create_sample_products():
    product1 = Product(ProductName="Product A", Price=19.99, Description="Sample product A description", CategoryID=1, StockQuantity=50)
    product2 = Product(ProductName="Product B", Price=29.99, Description="Sample product B description", CategoryID=2, StockQuantity=75)
    
    # Add products to the database
    db.session.add_all([product1, product2])
    db.session.commit()

"""

