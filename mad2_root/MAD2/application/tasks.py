from flask import render_template_string
from flask_security import current_user
from celery import shared_task
from .models import Book,User,BookLended,db,Role
from .mail_sender import remainder_mail,report_email
from jinja2 import Template
from sqlalchemy import extract
from datetime import datetime,timedelta
import os
import logging


@shared_task(ignore_result=False)
def revoke_permissions():
    try:
        print('hi')
        expired_entries = BookLended.query.filter(BookLended.return_date <= datetime.now()).all()
        for entry in expired_entries:
            db.session.delete(entry)
        db.session.commit()
        return "success!"
    except Exception as e:
        print(e)

@shared_task(ignore_result=False)
def remainder():
    try:
        one_day_ago = datetime.now() - timedelta(days=1)    
        inactive_users = User.query.filter(User.last_active < one_day_ago).all()
        for user in inactive_users:
            message = f"""Hello {user.username},
                    \nIt's been a while since we've seen you on [Library]. We miss having you around!

                    \nRemember, there are plenty of exciting updates, new features, and valuable content waiting for you. Don't miss out on the latest opportunities to [mention some key benefits or features of your application].

                    \nLog in now to e Library and rediscover what you've been missing!

                    \nBest regards,
                    \nLibrary"""
            subject = "We Miss You!"
            remainder_mail(user.email,subject,message)
        return "success!"

    except Exception as e:
        print(e)


@shared_task(ignore_result=False)
def report():
    try:
        # Get all users who are users
        users = User.query.join(User.roles).filter(Role.name == 'user').all()
    
        # Get the current month and year for the report
        report_month = datetime.now().strftime('%B')
        report_year = datetime.now().strftime('%Y')

        # email subject
        email_subject = f'Monthly Report for {report_month} {report_year}'
    
        # path to the HTML template file
        template_file = os.path.join(os.path.dirname(__file__), "../templates", 'report.html')
    
        # Iterating over each user to generate and send the report
        for user in users:
            with open(template_file, 'r') as file:
                report_template = Template(file.read())

                # Query the database for book lending details of the customer for the current month
                user_books_lended = BookLended.query.filter(
                    BookLended.user_id == user.id,
                    extract('month', BookLended.lend_date) == datetime.now().month
                ).all()

                # Prepare the book lending details to be rendered in the HTML template
                book_lend_details = []
                if user_books_lended:
                    for book_lended in user_books_lended:
                        # Strip time from lend date
                        lend_date = book_lended.lend_date.date()
                        # If return date is available, strip time from it as well
                        return_date = book_lended.return_date.date() if book_lended.return_date else 'Not returned yet'
                        book_lend_details.append({
                            'id': book_lended.id,
                            'name': book_lended.book.name,
                            'lend_date': lend_date,
                            'return_date': return_date
                        })

                # Render the HTML template with the book lending details
                report_email(
                    user.email, 
                    email_subject, 
                    report_template.render(
                        user=user, 
                        user_books=book_lend_details, 
                        month=report_month, 
                        year=report_year
                    )
                )
        
        return "success"

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return None
