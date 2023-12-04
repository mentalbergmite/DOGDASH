# manage.py
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from your_application import app, db

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)



from doggybaseREACT import db

with doggybaseREACT.app_context():
    # Create the table if it doesn't exist
    db.create_all()

    # Commit the changes
    db.session.commit()
