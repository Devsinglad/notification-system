"""Configuration management"""
import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # RabbitMQ
    rabbitmq_url: str = "amqp://guest:guest@rabbitmq:5672/"
    
    # Redis
    redis_url: str = "redis://redis:6379"
    
    # PostgreSQL
    database_url: str = "postgresql://notif_user:notif_pass@postgres:5432/notifications_db"
    
    # Firebase
    service_account_path: str = "/app/firebase-credentials.json"
    project_id: str = "mindful-torus-458106-p9"
    
    # Firebase Web Config (for client-side token generation)
    firebase_api_key: str = "AIzaSyAhjO0QwwuwnySLBYzGPgPfgPCVpIg-lGg"
    firebase_auth_domain: str = "mindful-torus-458106-p9.firebaseapp.com"
    firebase_storage_bucket: str = "mindful-torus-458106-p9.firebasestorage.app"
    firebase_messaging_sender_id: str = "1073235646116"
    firebase_app_id: str = "1:1073235646116:web:7df2d8ca4d1a3c23fd7831"
    firebase_vapid_key: str = "BHL99TXdSPLmvxRkimYNKoLsjBIMe3TYNb3RPnGEe1M-7e8msvm7n2IVtU48mvDdJ0CO9MpcHBX_PgZYgYsHvL8"
    
    # Service
    log_level: str = "INFO"
    service_port: int = 8001
    max_retries: int = 3
    circuit_breaker_threshold: int = 5
    circuit_breaker_timeout: int = 60
    
    # Rate Limiting
    rate_limit_per_minute: int = 1000
    rate_limit_per_hour: int = 10000
    
    # Worker
    worker_prefetch_count: int = 10
    worker_threads: int = 4
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
