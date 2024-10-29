from flask_restful import reqparse,Resource
from flask_security import auth_required,roles_required,current_user
from datetime import datetime,timedelta
from .models import db,Feedback,Book,BookRequest,BookLended, Purchase


class FeedbackResource(Resource):
    @auth_required('token')
    def post(self):
        try:
            feedback_parser = reqparse.RequestParser()
            feedback_parser.add_argument('name', type=str, required=True, help='Unsual error try reloading')
            feedback_parser.add_argument('feedback', type=str, required=True, help='Feedback text is required')

            args = feedback_parser.parse_args()

            name = args['name']
            feedback_text = args['feedback']

            book = Book.query.filter_by(name=name).first()

            feedback = Feedback(user_id=current_user.id, book_id=book.id, feedback_text=feedback_text)
            db.session.add(feedback)
            db.session.commit()

            return {'message': 'Feedback posted successfully'}, 201
        
        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500
        

class fetchdata(Resource):
    @auth_required('token')
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('book_name', type=str, required=True)
            args = parser.parse_args()

            name = args['book_name']
            book = Book.query.filter_by(name=name).first()
            purchased = Purchase.query.filter_by(user_id=current_user.id,book_id=book.id).first()
            if purchased:
                out = {'requested':'you have already purchased this Book'}
                return {'message':out},201
            requested = BookRequest.query.filter_by(book_id=book.id,user_id=current_user.id).first()
            blahh = None
            lended =  BookLended.query.filter_by(user_id=current_user.id, book_id=book.id).first()
            if requested:
                blahh = "This book has been already Requested"
            if lended:
                blahh = 'You have this book please check'
            out ={'name':book.name,'id':book.id,'limitError':current_user.lendedBooks,'requested':blahh}
            return {'message':out},200
        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500
        

class bookrequest(Resource):
    @auth_required('token')
    @roles_required('admin')
    def get(self):
        try:
            requests = BookRequest.query.all()
            serialized_requests = [
                {
                    'id':request.id,
                    'username':request.user.username,
                    'book_name':request.book.name
                } for request in requests]
            if not requests:
                return {'message':'No request left to show'},200
            return {'requests':serialized_requests},200
        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500
    
    @auth_required('token')    
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('book_id', type=int, required=True, help='Book ID is required')

            args = parser.parse_args()
            book_id = args['book_id']
            
            book = Book.query.get(book_id)
            if not book:
                return {'error': 'Book not found'}, 404
            
            
            if current_user.lendedBooks <= 5:
                book_request = BookRequest(user_id=current_user.id, book_id=book_id)
            
                db.session.add(book_request)
                current_user.lendedBooks += 1
                db.session.commit()
                
                return {'message': 'Book successfully Requested'}, 201
            return {'message': 'Max Limit reached'}, 401
        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500
        
    @auth_required('token')
    @roles_required('admin')   
    def delete(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('id', type=int)
            args = parser.parse_args()
            request_id = args['id']

            request = BookRequest.query.filter_by(id=request_id).first()
            request.user.lendedBooks -= 1
            db.session.commit()
            db.session.delete(request)
            db.session.commit()
            return {'message':'successfull'},200
        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500
        
class booklended(Resource):
    @auth_required('token')
    @roles_required('admin')
    def get(self):
        try:
            supplied = BookLended.query.all()
            serialized_supplied = [
                {
                    'id':supply.id,
                    'username':supply.user.username,
                    'book_name':supply.book.name
                } for supply in supplied]
            if not supplied:
                return {'message':'No Books are lended'},200
            return {'supplied':serialized_supplied},200
        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500

    @auth_required('token')
    @roles_required('admin')    
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('id', type=int)
            args = parser.parse_args()
            request_id = args['id']

            request = BookRequest.query.filter_by(id=request_id).first()
            days = request.book.return_date // 24
            hours = request.book.return_date % 24
            return_date = datetime.now() + timedelta(days=days,hours=hours)
            lend = BookLended(
                user_id = request.user_id,
                book_id=request.book_id,
                return_date = return_date
                )
            db.session.add(lend)
            request.user.lendedBooks -= 1
            db.session.commit()
            db.session.delete(request)
            db.session.commit()
            return {'message':'successfull'},200
        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500

    @auth_required('token') 
    def delete(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('id', type=int)
            args = parser.parse_args()
            request_id = args['id']

            toDel = BookLended.query.filter_by(id = request_id).first()
            db.session.delete(toDel)
            db.session.commit()
            return {'message':'successfull'},200
        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500
        

class mybooks(Resource):
    @auth_required('token')
    def get(self):
        try:
            lended = BookLended.query.filter_by(user_id=current_user.id).all()
            serialized =[{
                'id': item.book.id,
                'lendid':item.id,
                'section_id': item.book.section_id,
                'name': item.book.name,
                'content': item.book.content[:5]+'.....',
                'author': item.book.author,
                'date_issued': str(item.book.date_issued),
                'return_date': item.return_date.strftime('%Y-%m-%d'),
                'price': item.book.price
            } for item in lended]
            return {'books': serialized}
        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500