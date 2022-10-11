import smtplib,ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import sys



currentDate = str(datetime.now().date())+'T'+str(datetime.now().time())[:8]

f = open("./emailBody", "r")
html = str(f.read())
context = ssl.create_default_context()
message = MIMEMultipart("alternative")

message["Subject"] = str( sys.argv[2])+" CheckList Report "+currentDate
message["From"] = '@outlook.com'
print(str( sys.argv[1]))
messsageTo=str( sys.argv[1]).split(",")
print(str( sys.argv[1]).split(","))

message.attach(MIMEText(html, "html"))
















    


with smtplib.SMTP("smtp.office365.com", 587,timeout=120) as server:
    server.ehlo()  # Can be omitted
    server.starttls(context=context)
    server.ehlo()  # Can be omitted
    server.login('@outlook.com', "")
    server.sendmail('@outlook.com',messsageTo, message.as_string())
print("dddd")
sys.stdout.flush()
