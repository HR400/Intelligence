from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
from backend.app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class Database:
    client: Optional[AsyncIOMotorClient] = None
    db = None


db = Database()


async def connect_to_mongo():
    try:
        db.client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=2000)
        db.db = db.client[settings.DATABASE_NAME]
        logger.info(f"Connected to MongoDB: {settings.DATABASE_NAME}")
    except Exception as e:
        logger.warning(f"Could not connect to MongoDB: {e}. Running in offline/mock mode.")


async def close_mongo_connection():
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed.")
