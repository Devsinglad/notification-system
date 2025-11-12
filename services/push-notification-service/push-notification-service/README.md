# Push Notification Service

A production-ready push notification service with RabbitMQ, Redis, PostgreSQL, and Firebase Cloud Messaging.

## Quick Start

```bash
# Start services
docker-compose up -d

# Check health
curl http://localhost:8001/health

# View logs
docker-compose logs -f push_service
```

## API Endpoints

- `POST /api/notifications/send` - Queue notification
- `POST /api/notifications/send-immediate` - Send immediately
- `GET /health` - Health check
- `GET /docs` - API documentation

## Management UIs

- RabbitMQ: http://localhost:15672 (guest/guest)
- API Docs: http://localhost:8001/docs

## Testing

```bash
curl -X POST http://localhost:8001/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "body": "Hello World",
    "token": "YOUR_DEVICE_TOKEN"
  }'
```

## Scaling

```bash
# Scale to 5 workers
docker-compose up -d --scale push_service=5
```

## Documentation

See the complete documentation in the artifacts or contact the development team.
