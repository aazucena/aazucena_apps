import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.pool import NullPool
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, String, Text, Integer, DateTime, JSON, MetaData, Table
from pgvector.sqlalchemy import Vector
from datetime import datetime
from contextlib import asynccontextmanager

DATABASE_URL = os.getenv("DATABASE_URL", "")
# Convert standard URL to async driver URL
if DATABASE_URL.startswith("postgresql://"):
    ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://")
else:
    ASYNC_DATABASE_URL = DATABASE_URL

# Main Engine for general SQLAlchemy tasks
engine = create_async_engine(ASYNC_DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Specialized Engine for LangGraph Checkpointing (Pooling enabled)
# LangGraph requires a specific pool setup for reliability
pool_engine = create_async_engine(ASYNC_DATABASE_URL, pool_size=20, max_overflow=0)

Base = declarative_base()
metadata = MetaData()

# Helper to access reflected tables
reflected_tables = {}

async def reflect_db():
    """Reflects all tables in the database into the metadata object."""
    async with engine.begin() as conn:
        # Standard SQLAlchemy reflect is synchronous, so we run it in a thread-safe way
        # or use the engine to perform the heavy lifting.
        # For simplicity and performance, we'll do this once at startup.
        print("🔍 [Database] Reflecting Strapi schema...")
        await conn.run_sync(metadata.reflect)
        for table_name in metadata.tables:
            reflected_tables[table_name] = metadata.tables[table_name]
        print(f"✅ [Database] Reflected {len(reflected_tables)} tables.")

def get_table(name: str) -> Table:
    """Returns a reflected table object by name."""
    return reflected_tables.get(name)

class KnowledgeChunk(Base):
    __tablename__ = "knowledge_items"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String(255), nullable=True) # Strapi v5 document identifier
    title = Column(String, nullable=False)
    slug = Column(String, nullable=False, unique=True)
    content = Column(Text, nullable=False)
    source = Column(String, nullable=False)
    type = Column(String, default="docs")
    extra_metadata = Column(JSON, name="metadata") 
    embedding = Column(Vector(1024)) # Matches voyage-3
    file_hash = Column(String(64), nullable=True) # MD5/SHA hash of the original file
    
    # Strapi v5 Audit & Localization
    locale = Column(String(255), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = Column(DateTime, default=datetime.utcnow)
    created_by_id = Column(Integer, nullable=True)
    updated_by_id = Column(Integer, nullable=True)
