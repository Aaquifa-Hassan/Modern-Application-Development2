from smtplib import SMTP
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart



SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'library@ebooks.com'
SENDER_PASSWORD = ''

def report_email(to,subject,content_body):
    message = MIMEMultipart()
    message['To'] = to
    message['Subject'] = subject
    message['From'] =  SENDER_EMAIL
    message.attach(MIMEText(content_body,'html'))
    client = SMTP(host = SMTP_HOST,port=SMTP_PORT)
    client.send_message(msg=message)
    client.quit()

def remainder_mail(to,subject,content_body):
    message = MIMEMultipart()
    message['To'] = to
    message['Subject'] = subject
    message['From'] =  SENDER_EMAIL
    message.attach(MIMEText(content_body,'plain'))
    client = SMTP(host = SMTP_HOST,port=SMTP_PORT)
    client.send_message(msg=message)
    client.quit()