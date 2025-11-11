"""Manages Redis Instance"""

import os
import asyncio
from typing import Awaitable, cast
from redis.asyncio import Redis
from redis.exceptions import RedisError

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
# REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)

redis_client: Redis | None = None


def init_redis() -> None:
    """Initialize the Redis client."""
    global redis_client
    if redis_client is None:
        redis_client = Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            db=REDIS_DB,
            decode_responses=True,
            socket_connect_timeout=2.0,
            socket_timeout=2.0,
        )


async def test_redis(timeout: float = 2.0) -> bool:
    """Ping Redis with a timeout. Returns True if connected, False otherwise."""
    if redis_client is None:
        raise RuntimeError("Redis client is not initialized")

    try:
        pong = await asyncio.wait_for(
            cast(Awaitable[bool], redis_client.ping()), timeout=timeout
        )
        print("Connected to Redis:", pong)
        return True
    except asyncio.TimeoutError:
        print(f"Redis ping timed out after {timeout}s")
    except RedisError as exc:
        print("Could not connect to Redis:", exc)
    except Exception as exc:
        print("Unexpected error when pinging Redis:", exc)
    return False


async def get_redis() -> Redis:
    """Return the Redis client. Raise if not connected."""
    if redis_client is None:
        raise RuntimeError("Redis client is not initialized")
    if not await test_redis():
        raise RuntimeError("Redis is not available")
    return redis_client


async def close_redis() -> None:
    """Close Redis connection on shutdown."""
    global redis_client
    if redis_client:
        await redis_client.close()
        redis_client = None
        print("Redis connection closed")
