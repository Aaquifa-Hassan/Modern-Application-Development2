from application import app
from application.models import db
from application.security import datastore
from werkzeug.security import generate_password_hash


with app.app_context():
    db.create_all()

    datastore.find_or_create_role(
                            name='admin',
                            description='this is for Librarian'
                            )
    db.session.commit()

    if not datastore.find_user(email='admin@email.com'):
        datastore.create_user(
                            username='Admin',
                            email='admin@email.com',
                            password=generate_password_hash('admin'),
                            roles=['admin']
                            )
    
    datastore.find_or_create_role(
                            name='user',
                            description='this is for reader'
                            )
    db.session.commit()

    try:
        db.session.commit()
    except:
        pass