from flask import Flask, render_template, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import make_response
from flask_migrate import Migrate
from flask import send_file
from random import sample





app = Flask(__name__)
app.secret_key = 'your_secret_key'  
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "supports_credentials": True}})  # Allow only for /api routes
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///doggybase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)
current_user = None


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    price = db.Column(db.Float)
    image_source = db.Column(db.String(100))  # Add a new field for the image source
    cart_items = db.relationship('CartItem', backref='product', lazy=True)

    def __init__(self, name, price, image_source):  # Add 'image_source' to the constructor
        self.name = name
        self.price = price
        self.image_source = image_source

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    quantity = db.Column(db.Integer, default=1)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id')) 

    def __init__(self, product_id, quantity=1, order_id=None):  # Include order_id in the constructor
        self.product_id = product_id
        self.quantity = quantity
        self.order_id = order_id  


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    cart_items = db.relationship('CartItem', backref='order', lazy=True)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128))
    address = db.Column(db.String(255))  # Add the address field
    phone = db.Column(db.String(20))  # Add the phone field
    current_user = db.Column(db.String(50), default='login')  
    orders = db.relationship('Order', backref='user', lazy=True)

    def __init__(self, name, email, password, address='', phone = '', current_user='login'):
        self.name = name
        self.email = email
        self.password = password
        self.address = address
        self.phone = phone
        self.current_user = current_user







    
# Create tables
with app.app_context():
    db.create_all()



@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Check if the user exists
    user = User.query.filter_by(email=email, password=password).first()

    if user:
        # Set the user ID in the session to mark the user as logged in
        session['user_id'] = user.id

        # Update the current_user field to the user's name
        user.current_user = user.name
        db.session.commit()

        print(f"User {user.name} logged in. current_user updated to {user.current_user}")

        return jsonify({
            'success': True,
            'message': 'Login successful',
            'current_user': user.current_user
        })
    else:
        return jsonify({'success': False, 'message': 'Invalid email or password'})


 
    
@app.route('/api/logout')
def logout():
    session.pop('user_id', None)  # Remove 'user_id' from the session
    return jsonify({'success': True, 'message': 'Logout successful'})

@app.route('/api/signup', methods=['OPTIONS', 'POST'])
def signup():
    if request.method == 'OPTIONS':
        return jsonify({'success': True}), 200

    try:
        data = request.get_json()

        # Extract user data from the request
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        # Check if all required fields are present
        if not (name and email and password):
            return jsonify({'success': False, 'message': 'Incomplete data'}), 400

        # Check if the email is already registered
        if User.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Email already in use'}), 409

        # Create a new user instance
        new_user = User(name=name, email=email, password=password)

        # Add the new user to the database
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Signup successful'}), 201

    except Exception as e:
        print('Error during signup:', str(e))
        return jsonify({'success': False, 'message': 'Signup failed'}), 500

@app.route('/api/user', methods=['GET'])
def get_user():
    if 'user_id' in session:
        # User is logged in, fetch the user's information
        user_id = session['user_id']
        current_user = User.query.get(user_id)

        user_data = {
            'current_user': current_user.name,
            'email': current_user.email,
            'address': current_user.address,
            'phone': current_user.phone,
            'orders': [{'id': order.id, 'order_date': order.order_date.strftime('%Y-%m-%d')} for order in current_user.orders]
        }
    else:
        # User is not logged in
        user_data = {'current_user': 'Login', 'email': 'login@mail.com', 'address': '10 Login Lane', 'orders': []}

    return jsonify(user_data)

@app.route('/api/images/<path:filename>')
def serve_image(filename):
    print(f"Request for image: {filename}")
    try:
        # Use the correct path to the ProductImages folder
        return send_file(f'ProductImages/{filename}', mimetype='image/jpeg')
    except Exception as e:
        print(f"Error serving image: {str(e)}")
        return jsonify({'error': str(e)}), 500


# Route to view the cart contents
@app.route('/api/view_cart')
def view_cart():
    cart_items = CartItem.query.all()
    cart_contents = []

    for item in cart_items:
        if item.product:
            cart_contents.append({
                'name': item.product.name,
                'price': item.product.price,
                'quantity': item.quantity
            })
        else:
            cart_contents.append({
                'name': 'Unknown Product',
                'price': 0,
                'quantity': item.quantity
            })

    # Print or log the cart_contents before returning the response
    print("Sending Cart Contents:", cart_contents)

    return jsonify({'cart': cart_contents})





# Route to clear the cart
@app.route('/api/clear_cart', methods=['POST'])
def clear_cart():
    try:
        # Delete all items from the CartItem table
        CartItem.query.delete()

        # Commit the changes to the database
        db.session.commit()

        return jsonify({'success': True, 'message': 'Cart cleared successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error clearing cart: {str(e)}'})


# Route to add an item to the cart
@app.route('/api/add_to_cart', methods=['POST', 'OPTIONS'])
def add_to_cart():
    if request.method == 'OPTIONS':
        # Handle preflight requests
        response = make_response()
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response

    data = request.json
    quantity = data.get('quantity', 1)
    product_name = data.get('name')
    product_price = data.get('price')

    if product_name is None or product_price is None:
        return jsonify({'success': False, 'message': 'Incomplete product data'})

    if request.method == 'POST':
        print(f"Adding item to the cart: Name - {product_name}, Price - {product_price}")

    # Check if the item is already in the cart
    product = Product.query.filter_by(name=product_name, price=product_price).first()

    if product:
        # If the product is found, add it to the cart
        cart_item = CartItem.query.filter_by(product_id=product.id).first()

        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(product_id=product.id, quantity=quantity)
            db.session.add(cart_item)

        db.session.commit()

        # Return the added item details
        return jsonify({
            'success': True,
            'message': 'Item added to the cart',
            'item': {
                'product_id': product.id,
                'name': product.name,
                'price': product.price,
                'quantity': quantity
            }
        })
    else:
        # Handle the case where the product is not found
        return jsonify({
            'success': False,
            'message': 'Product not found'
        })





# Route to get the current cart contents
@app.route('/api/cart')
def get_cart():
    cart_items = CartItem.query.all()
    cart_contents = []

    for item in cart_items:
        if item.product:
            cart_contents.append({
                'product_id': item.product_id,
                'name': item.product.name,
                'price': item.product.price,
                'quantity': item.quantity,
                'image': item.product.image_source  # Include the image property
            })
        else:
            cart_contents.append({
                'product_id': None,
                'name': 'Unknown Product',
                'price': 0,
                'quantity': item.quantity,
                'image': 'default.jpg'  # Provide a default image or handle accordingly
            })

    # Print or log the cart_contents before returning the response
    print("Current Cart Contents:", cart_contents)
    
    return jsonify({'cart': cart_contents})



@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        product_list = [{'id': product.id, 'name': product.name, 'price': product.price, 'image_source': f'\\{product.image_source}'} for product in products]



        return jsonify({'products': product_list})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/add_product', methods=['POST'])
def add_product():
    data = request.json
    new_product = Product(name=data['name'], price=data['price'])
    db.session.add(new_product)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Product added successfully'})

# Route to update the quantity of an item in the cart
@app.route('/api/update_quantity', methods=['POST'])
def update_quantity():
    try:
        data = request.json
        product_id = data.get('product_id')
        quantity = data.get('quantity')

        # Validate input
        if product_id is None or quantity is None:
            return jsonify({'success': False, 'message': 'Invalid request'})

        # Find the cart item by product_id
        cart_item = CartItem.query.filter_by(product_id=product_id).first()

        if cart_item:
            # Update the quantity
            cart_item.quantity = quantity
            db.session.commit()

            return jsonify({'success': True, 'message': 'Quantity updated successfully'})
        else:
            return jsonify({'success': False, 'message': 'Product not found in the cart'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error updating quantity: {str(e)}'})



@app.route('/checkout', methods=['GET', 'POST'])
def checkout():
    return jsonify({'success': True, 'message': 'Checkout successful'})
    # Your implementation here


@app.route('/')
def index():
    if 'user_id' in session:
        # User is logged in, fetch the user's name
        user_id = session['user_id']
        current_user = User.query.get(user_id)
        user_name = current_user.name if current_user else 'Unknown User'
    else:
        # User is not logged in
        user_name = 'Login'

    return render_template('index.html', current_user=user_name)

#api route to get random tiles for home page
@app.route('/api/random', methods=['GET'])
def get_random_products():
    try:
        # Get all products from the database with valid image sources
        products_with_images = Product.query.filter(Product.image_source.isnot(None)).all()

        # Choose 4 random products using sample
        random_products = sample(products_with_images, 4)

        # Convert the list of random products to a dictionary
        product_list = [{'id': product.id, 'name': product.name, 'price': product.price, 'image_source': f'\\{product.image_source}'} for product in random_products]

        return jsonify({'products': product_list})
    except Exception as e:
        return jsonify({'error': str(e)})

def get_cart_contents():
    cart_items = CartItem.query.all()
    cart_contents = []

    for item in cart_items:
        if item.product:
            cart_contents.append({
                'product_id': item.product.id,
                'name': item.product.name,
                'price': item.product.price,
                'quantity': item.quantity
            })
        else:
            cart_contents.append({
                'product_id': None,
                'name': 'Unknown Product',
                'price': 0,
                'quantity': item.quantity
            })

    return cart_contents

# creates 12 products
productsData = [
    { 'name': 'Fashion Collar and Leash', 'price': 200, 'image_source': 'p1.jpg' },
    { 'name': 'Purina One Dog Food', 'price': 100, 'image_source': 'p2.jpg' },
    { 'name': 'Blue Dog Squeek Toy', 'price': 300, 'image_source': 'p3.jpg' },
    { 'name': 'Yellow Rubber Chew Toy', 'price': 400, 'image_source': 'p4.jpg' },
    { 'name': 'Metal Pet Food Bowl', 'price': 500, 'image_source': 'p5.jpg' },
    { 'name': 'Plastic Pet Food Bowl', 'price': 600, 'image_source': 'p6.jpg' },
    { 'name': 'Large Pet Cage', 'price': 700, 'image_source': 'p7.jpg' },
    { 'name': 'Large Bird Cage', 'price': 800, 'image_source': 'p8.jpg' },
    { 'name': 'Red Leash', 'price': 900, 'image_source': 'p9.jpg' },
    { 'name': 'Assorted Dog Food', 'price': 1000, 'image_source': 'p10.jpg' },
    { 'name': 'Bravo Chicken Pet Food', 'price': 1100, 'image_source': 'p11.jpg' },
    { 'name': 'Fun Pills for Pets', 'price': 1200, 'image_source': 'p12.jpg' },
    { 'name': 'Tennis Ball Launcher', 'price': 400, 'image_source': 'p13.jpg' },
    { 'name': 'Cat Grill', 'price': 700, 'image_source': 'p14.jpg' },
    { 'name': 'Round Cat House', 'price': 1500, 'image_source': 'p15.jpg' },
    { 'name': 'Dog Pringle Simulator', 'price': 100, 'image_source': 'p16.jpg' },
    { 'name': 'Cleaning Supplies', 'price': 200, 'image_source': 'p17.jpg' },
    { 'name': 'Definitely Not Ground Dog', 'price': 1300, 'image_source': 'p18.jpg' },
    { 'name': 'Doggoform', 'price': 500, 'image_source': 'p19.jpg' },
    { 'name': 'Almost Dog Food', 'price': 700, 'image_source': 'p20.jpg' },


]

# Function to initialize the database with predefined products
def initialize_database():
    print('Initializing database with products and user order...')

    try:
        # Check if products already exist in the database
        existing_products = Product.query.all()

        if not existing_products:
            # Loop through the predefined productsData and add them to the database
            for product_data in productsData:
                new_product = Product(
                    name=product_data['name'],
                    price=product_data['price'],
                    image_source=product_data['image_source']
                )
                db.session.add(new_product)

            # Commit the changes to the database
            db.session.commit()

            print('Database initialized with products.')
        else:
            print('Products already exist in the database. Skipping initialization.')

    except Exception as e:
        print(f'Error initializing database: {str(e)}')

    try:
        # Check if the 'Login' user already exists
        existing_user = User.query.filter_by(email='Login@mail.com').first()

        if not existing_user:
            # Create a new user with 'current_user' set to 'login'
            new_user = User(name='Login', email='Login@mail.com', password='Login', phone = '410-442-1109', current_user='Login')
            db.session.add(new_user)
            db.session.commit()
        else:
            new_user = existing_user

        # Create an order for the user
        user_order = Order(user_id=new_user.id)
        db.session.add(user_order)
        db.session.commit()

        # Add the first 3 products to the user's order
        for i in range(3):
            product = Product.query.offset(i).first()
            if product:
                cart_item = CartItem(product_id=product.id, quantity=1, order_id=user_order.id)
                db.session.add(cart_item)

        # Commit the changes to the database
        db.session.commit()

        print('User order initialized with the first 3 products.')

    except Exception as e:
        print(f'Error initializing database: {str(e)}')


def clear_database():
    try:
        # Delete all products from the Product table
        Product.query.delete()

        # Commit the changes to the database
        db.session.commit()

        print('Database cleared successfully.')
    except Exception as e:
        print(f'Error clearing database: {str(e)}')

# Call the initialize_database function when the app starts
if __name__ == '__main__':
    with app.app_context():
        clear_database()
        initialize_database()
    app.run(debug=True)