from flask_restful import reqparse,Resource
from flask_security import auth_required,roles_required,current_user
from datetime import datetime
from .models import db,Section,Book
from .insrances import cache

class book(Resource):
    @auth_required('token')
    @cache.cached(timeout=60,key_prefix="getsectionswithbooks")
    def get(self):
        sections_with_books = Section.query.outerjoin(Book).all()
        serialized_sections = [{
            'id': section.id,
            'name': section.name,
            'date_created': section.date_created.strftime('%Y-%m-%d'),
            'description': section.description,
            'books': [{
                'id': book.id,
                'name': book.name,
                'content': book.content[0:5],
                'author': book.author,
                'date_issued': book.date_issued.strftime('%Y-%m-%d') if book.date_issued else None,
                'days': book.return_date // 24,
                'hours':book.return_date  % 24,
                'price': book.price
            } for book in section.books]
        } for section in sections_with_books]
        return {'sections': serialized_sections}

    @auth_required('token')
    @roles_required('admin')
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('name', type=str, required=True)
            parser.add_argument('content', type=str, required=True)
            parser.add_argument('price', type=int, required=True)
            parser.add_argument('author', type=str, required=True)
            parser.add_argument('date_issued', type=str, required=True)
            parser.add_argument('days', type=int, required=True)
            parser.add_argument('hours', type=int, required=True)
            parser.add_argument('ExistingSection', type=str)
            parser.add_argument('NewSection', type=str)
            args = parser.parse_args()
            
            name = args['name']
            content = args['content']
            price = args['price']
            author = args['author']
            date_issued = datetime.strptime(args['date_issued'], '%Y-%m-%d').date()
            days = args['days']
            hours = args['hours']
            existing_section = args['ExistingSection']
            new_section = args['NewSection']

            section_id = None
            return_date = (int(days)*24)+(int(hours))

            check_name = Book.query.filter_by(name=name).first()
            if check_name:
                return {'error': 'A book already exists with this name'}, 400

            if existing_section == 'Default' and not new_section:
                return {'error': 'Fill any one of the Optional fields'}, 400
            
            print(existing_section)
            if existing_section != 'Default':
                section_id = int(existing_section)
            
            if existing_section == 'Default':
                existing = Section.query.filter_by(name=new_section).first()
                
                if existing:
                    return {'error': 'A Section already exists with this name'}, 400
                if not existing:
                    random = Section.query.filter_by(name=new_section).first()
                    if random:
                        return {'error': 'A Section already exists with this name'}, 400
                    new_section = Section(name=new_section)
                    db.session.add(new_section)
                    db.session.commit()
                    
                    section_id = new_section.id
            
            new_book = Book(
                name=name,
                content=content,
                author=author,
                date_issued=date_issued,
                return_date=return_date,
                section_id=section_id,
                price=price
            )

            db.session.add(new_book)
            db.session.commit()
            cache.delete("getsectionswithbooks")
            return {'message': 'Book added successfully'}, 201
        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500
    
    @auth_required('token')
    @roles_required('admin')
    def put(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('name', type=str)
            parser.add_argument('content', type=str)
            parser.add_argument('price', type=int)
            parser.add_argument('author', type=str)
            parser.add_argument('date_issued', type=str)
            parser.add_argument('days', type=int, required=True)
            parser.add_argument('hours', type=int, required=True)
            parser.add_argument('ExistingSection', type=str)
            parser.add_argument('NewSection', type=str)
            parser.add_argument('toUpdate', type=str)
            args = parser.parse_args()

            name = args['name']
            content = args['content']
            price = args['price']
            author = args['author']
            date_issued = False
            if args['date_issued']:
                date_issued = datetime.strptime(args['date_issued'], '%Y-%m-%d').date()
            days = args['days']
            hours = args['hours']
            existing_section = args['ExistingSection']
            new_section = args['NewSection']
            toUpdate = args['toUpdate']

            book = Book.query.filter_by(name=toUpdate).first()

            if name:
                check_name = Book.query.filter_by(name=name).first()
                if check_name:
                    return {'error': 'A book already exists with this name'}, 400
                book.name = name
                
            if content:
                book.content = content

            if price:
                book.price = price
            
            if author:
                book.author = author
            
            if date_issued:
                book.date_issued = date_issued
            
            if days or hours:
                if not days :
                    days = 0
                if not hours :
                    hours = 0
                return_date = (int(days)*24)+(int(hours))
                
            if return_date:
                book.return_date = return_date

            if existing_section != 'Default':
                book.section_id = int(existing_section)
            
            if existing_section == 'Default' and new_section:
                existing = Section.query.filter_by(name=new_section).first()
                
                if existing:
                    return {'error': 'A Section already exists with this name'}, 400
                if not existing:
                    new_section = Section(name=new_section)

                    db.session.add(new_section)
                    db.session.commit()
                    book.section_id = new_section.id
            
            db.session.commit()
            cache.delete("getsectionswithbooks")
            return {'message': 'Book updated successfully','updated':book.name}, 201
        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500

    @auth_required('token')
    @roles_required('admin')
    def delete(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('name', type=str,required=True)
            args = parser.parse_args()

            name = args['name']

            book = Book.query.filter_by(name=name).first()
            if not book:
                return {'error': "Section doesn't exists with this name"}, 400
            
            db.session.delete(book)
            db.session.commit()
            cache.delete("getsectionswithbooks")
            return {'message':'Book deleted successfully '},200
        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500
        

class section(Resource):
    @auth_required('token')
    @roles_required('admin')
    def put(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('name', type=str)
            parser.add_argument('old_name', type=str)
            parser.add_argument('description', type=str)

            args = parser.parse_args()

            name = args['name']
            description = args['description']
            old_name = args['old_name']

            section = Section.query.filter_by(name=old_name).first()
            existing = Section.query.filter_by(name=name).first()
            if existing:
                return {'error': 'A Section already exists with this name'}, 400
            if name:
                section.name = name
            if description:
                section.description = description
            db.session.commit()
            cache.delete("getsectionswithbooks")
            return {'message':'Changes Successfully made','new_name':name},200

        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500
        
    @auth_required('token')
    @roles_required('admin')
    def delete(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('name', type=str,required=True)

            args = parser.parse_args()

            name = args['name']

            section = Section.query.filter_by(name=name).first()
            if not section:
                return {'error': "Section doesn't exists with this name"}, 400
            
            for book in section.books:
                db.session.delete(book)
            db.session.delete(section)
            db.session.commit()
            cache.delete("getsectionswithbooks")
            return {'message':'Section deleted successfully along with books'},200
        except Exception as e:
            print(e)
            return {'error':'Internal server error'},500