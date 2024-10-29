from flask import current_app as app,render_template,jsonify,request,send_file
from flask_security import auth_required,roles_required,current_user
from werkzeug.security import check_password_hash,generate_password_hash
from .security import datastore
from .models import db,User,Book,Purchase, BookRequest
from datetime import datetime, date
from weasyprint import HTML

@app.get('/')
def base():
    return render_template('index.html')

@app.post('/login-user')
def login():
    cred = request.get_json()
    email = cred.get('email')
    password = cred.get('password')
    if not email or not password :
        return jsonify({"error":"Fill the user credentials"}),400
    
    user = datastore.find_user(email=email)

    if not user or user.roles[0].name == 'admin' :
        return jsonify({"error":"User not found"}),404
    
    if check_password_hash(user.password,password):
        user.last_active = datetime.now()
        db.session.commit()
        return jsonify(
                        {
                        "token":user.get_auth_token(),
                        "email":user.email,
                        "role":user.roles[0].name,
                        "username":user.username
                        }
                    )
    else:
        return jsonify({"error":"Incorrect Password"}),400
    
@app.post('/login-admin')
def admin_login():
    cred = request.get_json()
    print(cred)
    email = cred.get('email')
    password = cred.get('password')
    print(email,password)
    if not email or not password :
        return jsonify({"error":"Fill the user credentials"}),400
    
    user = datastore.find_user(email=email)

    if not user or user.roles[0].name != 'admin' :
        return jsonify({"error":"User not found"}),404
    
    if check_password_hash(user.password,password):
        return jsonify(
                        {
                        "token":user.get_auth_token(),
                        "email":user.email,
                        "role":user.roles[0].name,
                        "username":user.username
                        }
                    )
    else:
        return jsonify({"error":"Incorrect Password"}),400
    
@app.post('/signup')
def signup():
    cred = request.get_json()
    email = cred.get('email')
    username = cred.get('username')
    password = cred.get('password')
    if not email or not username or not password:
        return jsonify({"message":"Fill the credentials"}),400
    
    if datastore.find_user(email= email) or datastore.find_user(username= username):
        return jsonify({"message":"User already exists"}),401
    
    try:
        datastore.create_user(
                    username=username,
                    email=email,
                    password=generate_password_hash(password),
                    roles=['user']
                    )
        db.session.commit()
        return jsonify({"message": "Successfully Created"}),200
    except:
        return jsonify({"message":"there was an unexpected error"}),500
    
@app.route('/purchase',methods=['GET','POST'])
def puchace():
    try:
        if request.method == "POST":
        
            name = request.get_json().get('name')

            book = Book.query.filter_by(name=name).first()
            
            new_purchase = Purchase(user_id=current_user.id,book_id=book.id,price=book.price)
            requested = BookRequest.query.filter_by(user_id=current_user.id, book_id=book.id).first()
            if requested:
                db.session.delete(requested)
            db.session.add(new_purchase)
            db.session.commit()

            return jsonify({"message": "Successfull"}),200
    
    except Exception as e:
        print(e)

@app.route('/purchase/<name>',methods=['GET','POST'])
def puchacedownload(name):
    try:
        book = Book.query.filter_by(name=name).first()
        book_name = book.name
        author = book.author
        content = book.content
        html_content = f"<html><body><h1>{book_name}</h1><p>Author: {author}</p><p>{content}</p></body></html>"
        pdf_filename = f"{book_name}.pdf"
        HTML(string=html_content).write_pdf(pdf_filename)
        return send_file("../"+pdf_filename, as_attachment=True)
    
    except Exception as e:
        print(e)


@app.route('/purchasefetch/<name>',methods=['GET','POST'])
def purchasefetch(name):
    try:
        
        book = Book.query.filter_by(name=name).first()
        purchased = Purchase.query.filter_by(user_id=current_user.id,book_id=book.id).first()
        print(purchased)
        if purchased :
            return jsonify({"message": "Book is already been purchased"}),200

        return jsonify({"secondarymessage": "book is not purchased"}),200
    
    except Exception as e:
        print(e)

@app.get('/getdate')
def getdate():
    current_date= date.today().isoformat()
    return jsonify({'current_date':current_date}),200