from flask_restful import Api,Resource
from .resources_for_admin import book,section
from .resources_for_user import FeedbackResource,fetchdata
from .resources_for_user import bookrequest,booklended,mybooks

api = Api()

api.add_resource(book,'/book')
api.add_resource(section,'/section')
api.add_resource(FeedbackResource,'/feedback')
api.add_resource(fetchdata,'/fetchdata')
api.add_resource(bookrequest,'/bookrequest')
api.add_resource(booklended,'/booklended')
api.add_resource(mybooks,'/mybooks')