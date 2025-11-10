import pika
import json
import redis
import time
import logging
from fcm_client import send_fcm_notification

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Redis for caching / idempotency
redis_client = redis.Redis(host="redis", port=6379, db=0)

# RabbitMQ connection
rabbitmq_host = "rabbitmq"
connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host))
channel = connection.channel()
channel.queue_declare(queue='push.queue', durable=True)

MAX_RETRIES = 5

def callback(ch, method, properties, body):
    try:
        payload = json.loads(body)
        request_id = payload.get("request_id")
        
        # Idempotency check
        if request_id and redis_client.get(request_id):
            logger.info(f"Skipping duplicate request {request_id}")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return

        # Send FCM notification
        response = send_fcm_notification(
            token=payload["token"],
            title=payload["title"],
            body=payload["body"],
            image=payload.get("image"),
            link=payload.get("link")
        )

        if response.status_code == 200:
            if request_id:
                redis_client.set(request_id, 1, ex=3600)  # cache 1 hour
            ch.basic_ack(delivery_tag=method.delivery_tag)
        else:
            retry_count = payload.get("retry_count", 0)
            if retry_count < MAX_RETRIES:
                payload["retry_count"] = retry_count + 1
                backoff = 2 ** retry_count
                logger.warning(f"Retrying in {backoff}s: {payload}")
                time.sleep(backoff)
                channel.basic_publish(
                    exchange='',
                    routing_key='push.queue',
                    body=json.dumps(payload),
                    properties=pika.BasicProperties(
                        delivery_mode=2,
                    )
                )
            else:
                logger.error(f"Failed permanently: {payload}")
                channel.basic_publish(
                    exchange='',
                    routing_key='failed.queue',
                    body=json.dumps(payload),
                    properties=pika.BasicProperties(delivery_mode=2),
                )
            ch.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as e:
        logger.exception(f"Error processing message: {e}")
        ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='push.queue', on_message_callback=callback)
logger.info("Push worker started, waiting for messages...")
channel.start_consuming()
