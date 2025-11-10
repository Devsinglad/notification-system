from pydantic import BaseModel

class PushNotificationPayload(BaseModel):
    title: str
    body: str
    token: str
    image: str = None
    link: str = None
    request_id: str = None  # for idempotency
