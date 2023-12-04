from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import random
from flask import jsonify


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db' 
# Generate a random secret key
secret_key = os.urandom(24)
app.secret_key = secret_key  # Replace 'secret_key' with your generated secret key
db = SQLAlchemy(app)

# database models based on schema

class Customer(db.Model):
    __tablename__ = "Customers"  # Table name in database
    CustomerID = db.Column(db.Integer, primary_key=True)
    CustomerName = db.Column(db.String(255))
    CustomerEmail = db.Column(db.String(100))
    CustomerPhone = db.Column(db.String(20))
    CustomerAddress = db.Column(db.String(255))
    customer_logins = db.relationship('CustomerLogin', backref='customer', lazy='dynamic')

class CustomerLogin(db.Model):
    __tablename__ = "CustomerLogins"  # Table name in database
    CustomerLoginID = db.Column(db.Integer, primary_key=True)
    CustomerID = db.Column(db.Integer, db.ForeignKey('Customers.CustomerID'))
    Username = db.Column(db.String(50))
    PasswordHash = db.Column(db.String(100))
    Salt = db.Column(db.String(50))
    # Define the many-to-one relationship with the Customer model
    #customer = db.relationship('Customer', back_populates='customer_logins')

class Seller(db.Model):
    __tablename__ = "Sellers"  # Table name in database
    SellerID = db.Column(db.Integer, primary_key=True)
    SellerName = db.Column(db.String(255))
    SellerEmail = db.Column(db.String(100))
    SellerPhone = db.Column(db.String(20))
    SellerAddress = db.Column(db.String(255))
    # Define the one-to-many relationship between Seller and SellerLogin
    seller_logins = db.relationship('SellerLogin', backref='seller', lazy='dynamic')

class SellerLogin(db.Model):
    __tablename__ = "SellerLogins"  # Table name in database
    SellerLoginID = db.Column(db.Integer, primary_key=True)
    SellerID = db.Column(db.Integer, db.ForeignKey('Sellers.SellerID'))
    Username = db.Column(db.String(50))
    PasswordHash = db.Column(db.String(100))
    Salt = db.Column(db.String(50))
    # Define the many-to-one relationship with the Seller model
    #seller = db.relationship('Seller', foreign_keys=[SellerID], backref='seller_logins')

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

# Add information for pet friendly and other categories
class Restaurant(db.Model):
    __tablename__ = "RestaurantTables"
    TableID = db.Column(db.Integer, primary_key=True)
    TableNumber = db.Column(db.Integer)
    Seats = db.Column(db.Integer)

class User(db.Model):
    __tablename__ = "Users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

class Checkout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)  # Assuming a user is logged in, and you store their ID
    product_id = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, default=1)

# Define API routes for CRUD operations

# Add a new route for checkout
@app.route('/checkout', methods=['GET', 'POST'])
def checkout():
    if request.method == 'POST':
        # Process the checkout form data (name, email, address)
        name = request.form['name']
        email = request.form['email']
        address = request.form['address']

        # Here you can perform actions such as creating an order, sending confirmation emails, etc.
        # Store the information in the session
        session['checkout_info'] = {
            'name': name,
            'email': email,
            'address': address
        }

        # Redirect to the checkout success page
        return redirect(url_for('checkout_success'))

    # Fetch the list of products in the checkout process
    user_id = 1  # Replace with the actual user ID

    # Assuming Checkout has a relationship with Product
    # Using aliased to distinguish between the Checkout and Product entities
    checkout_items = db.session.query(Checkout, Product)\
        .join(Product, Checkout.product_id == Product.ProductID) \
        .filter(Checkout.user_id == user_id) \
        .all()

    # Pass the checkout items to the template
    return render_template('checkout.html', checkout_items=checkout_items)

# Update the route for adding to checkout
@app.route('/add_to_checkout/<int:id>', methods=['POST'])
def add_to_checkout(id):
    product = Product.query.get(id)

    if product:
        # Assuming a user is logged in, get their user ID (you may need to implement user authentication)
        user_id = 1  # Replace with the actual user ID

        # Check if the product is already in the checkout for the user
        existing_checkout = Checkout.query.filter_by(user_id=user_id, product_id=id).first()

        if existing_checkout:
            # Increment the quantity if the product is already in the checkout
            existing_checkout.quantity += 1
        else:
            # Otherwise, create a new record in the Checkout table
            new_checkout = Checkout(user_id=user_id, product_id=id)
            db.session.add(new_checkout)

        # Commit the changes to the database
        db.session.commit()

    # Redirect back to the index page or wherever you want to go after adding to checkout
    return redirect(url_for('index'))

# Add a route for checkout success page
@app.route('/checkout/success')
def checkout_success():
    user_id = 1
    # Retrieve the stored checkout information from the session
    checkout_info = session.get('checkout_info', {})

    # Generate a random order number using uuid
    random_order_number = random.randint(9000, 9999)

    # Assuming Checkout has a relationship with Product
    # Using aliased to distinguish between the Checkout and Product entities
    checkout_items = db.session.query(Checkout, Product)\
        .join(Product, Checkout.product_id == Product.ProductID) \
        .filter(Checkout.user_id == user_id) \
        .all()

    # Render the checkout success page with the retrieved information
    return render_template('checkout_success.html', checkout_info=checkout_info, checkout_items=checkout_items, random_order_number=random_order_number)



# Create User for Login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()
        if user is not None:
            if check_password_hash(user.password, password):
                # Authentication successful, you can set a session or token here
                return redirect(url_for('index'))
            else:
                flash('Login failed. Please check your credentials.')
        else:
            flash('Login failed. Please check your credentials.')


    return render_template('login.html')


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


@app.route('/api/products')
def get_products():
    products = Product.query.all()
    product_list = [
        {
            'id': product.ProductID,
            'name': product.ProductName,
            'price': float(product.Price),  # Convert to float if needed
            'description': product.Description,
            'category_id': product.CategoryID,
            'stock_quantity': product.StockQuantity
        }
        for product in products
    ]
    return jsonify(product_list)

# Add route for login page



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


# Run the application
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
       

    app.run(debug=True)

