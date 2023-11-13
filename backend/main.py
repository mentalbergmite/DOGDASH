from flask import Flask
from api import create_app, db

app = create_app()

if __name__ == "main":
    app.run(debug=True)