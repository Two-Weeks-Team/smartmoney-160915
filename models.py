import os
from sqlalchemy import Column, Integer, String, Float, DateTime, func, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Resolve DATABASE URL with auto‑fixes
_raw_url = os.getenv("DATABASE_URL", os.getenv("POSTGRES_URL", "sqlite:///./app.db"))
if _raw_url.startswith("postgresql+asyncpg://"):
    _raw_url = _raw_url.replace("postgresql+asyncpg://", "postgresql+psycopg://")
elif _raw_url.startswith("postgres://"):
    _raw_url = _raw_url.replace("postgres://", "postgresql+psycopg://")

# Add SSL for non‑localhost PostgreSQL URLs
if _raw_url.startswith("postgresql+psycopg://") and "localhost" not in _raw_url:
    engine = create_engine(_raw_url, connect_args={"sslmode": "require"})
else:
    engine = create_engine(_raw_url)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# Table name prefix to avoid collisions in shared DB
TABLE_PREFIX = "smartmoney_160915_"


class Transaction(Base):
    __tablename__ = f"{TABLE_PREFIX}transaction"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    date = Column(DateTime, default=func.now())
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=True)
    # No type annotation on relationship per constraints
    # Example relationship to a future User model could be added here


class Goal(Base):
    __tablename__ = f"{TABLE_PREFIX}goal"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    deadline = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

# Create tables if they don't exist (useful for quick demo runs)
Base.metadata.create_all(bind=engine)
