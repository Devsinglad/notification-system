from fastapi import FastAPI, HTTPException
from models import PushNotificationPayload
import pika, json, logging

app = FastAPI()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

rabbitmq_host = "rabbitmq"
connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host))
channel = connection.channel()
channel.queue_declare(queue='push.queue', durable=True)

@app.get("/health")
def health():
    return {"success": True, "message": "Push service is healthy"}

@app.post("/send-notification")
def enqueue_push(payload: PushNotificationPayload):
    try:
        channel.basic_publish(
            exchange='',
            routing_key='push.queue',
            body=json.dumps(payload.dict()),
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
            )
        )
        return {
            "success": True,
            "message": "Notification queued successfully",
            "meta": {
                "total": 1,
                "limit": 1,
                "page": 1,
                "total_pages": 1,
                "has_next": False,
                "has_previous": False
            }
        }
    except Exception as e:
        logger.exception("Failed to enqueue push notification")
        raise HTTPException(status_code=500, detail=str(e))
