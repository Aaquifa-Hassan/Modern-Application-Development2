from flask import Flask
from flask_security import Security
from .models import db
from config import DevelopmentConfig
from .resources import api
from .security import datastore
from .worker import celery_init_app
from celery.schedules import crontab
from .tasks import revoke_permissions,remainder,report
from .insrances import cache



def create_app():
    app = Flask(
        __name__,
        static_folder='../static',
        template_folder='../templates'
        )
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    app.security = Security(app,datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views
    return app

app = create_app()
celery_app = celery_init_app(app)

@celery_app.on_after_configure.connect
def permission(sender,**kwargs):
    sender.add_periodic_task(
        crontab(hour= 10,minute=12),
        revoke_permissions.s()
    )

@celery_app.on_after_configure.connect
def remainder_message(sender,**kwargs):
    sender.add_periodic_task(
        crontab(hour=1,minute=25),
        remainder.s()
    )

@celery_app.on_after_configure.connect
def report_message(sender,**kwargs):
    sender.add_periodic_task(
        crontab(day_of_month=15,hours=1,minute=25),
        report.s()
    )