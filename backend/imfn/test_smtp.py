import smtplib
import os
from dotenv import load_dotenv

load_dotenv()

user = os.getenv('EMAIL_HOST_USER')
password = os.getenv('EMAIL_HOST_PASSWORD')

print(f"Testing SMTP login for user: '{user}'")
print(f"Password starts with: '{password[:2]}' and has length {len(password) if password else 0}")

try:
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.set_debuglevel(1)
    server.login(user, password)
    print("LOGIN SUCCESSFUL!")
    server.quit()
except Exception as e:
    print(f"LOGIN FAILED. Error: {e}")
