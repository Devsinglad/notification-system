import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import logging

logger = logging.getLogger(__name__)

SERVICE_ACCOUNT_PATH = "mindful-torus-458106-p9-firebase-adminsdk-fbsvc-4309b262d6.json"
PROJECT_ID = "mindful-torus-458106-p9"

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_PATH,
    scopes=["https://www.googleapis.com/auth/cloud-platform"]
)

def get_access_token() -> str:
    credentials.refresh(Request())
    return credentials.token

def send_fcm_notification(token: str, title: str, body: str, image: str = None, link: str = None):
    access_token = get_access_token()
    url = f"https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send"
    
    message = {
        "message": {
            "token": token,
            "notification": {
                "title": title,
                "body": body,
                "image": image
            },
            "webpush": {
                "fcm_options": {
                    "link": link or ""
                }
            }
        }
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json; UTF-8",
    }

    logger.info(f"Sending notification: {message}")
    response = requests.post(url, headers=headers, json=message)
    logger.info(f"FCM Response: {response.status_code}, {response.text}")
    return response
