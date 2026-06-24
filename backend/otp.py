import requests
import random

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_sms(phone, otp):
    url = "https://www.fast2sms.com/dev/bulkV2"
    
    payload = {
        "route": "otp",
        "variables_values": otp,
        "numbers": phone,  # e.g. "9876543210"
    }
    
    headers = {
        "authorization": "QJhAPgZiY5uKOMmepENB6d4zvy7t3cLC2XUbaSx8jnVkGqrDFl68dNp70lwRe5c3qB2gofnUC4MLuWiA",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

# Usage
otp = generate_otp()
result = send_otp_sms("9724372117", otp)
print(result)