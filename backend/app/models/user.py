"""
User model for authentication and authorization
"""
from sqlalchemy import Column, String, Boolean, DateTime, Integer
from sqlalchemy.sql import func
from ..database import Base


class User(Base):
    __tablename__ = "users"

    # Primary key as auto-increment integer
    _id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(String, unique=True, index=True, nullable=False)  # Format: ADM001, SAD001
    
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    mobile_number = Column(String(20), nullable=True)  # Mobile number for super admins
    hashed_password = Column(String, nullable=False)
    role = Column(String(20), nullable=False)  # 'admin' or 'super_admin'
    
    # Super Admin specific fields (null for Admin)
    state = Column(String(100), nullable=True)  # Fixed for Super Admin
    district = Column(String(100), nullable=True)  # Fixed for Super Admin
    
    # Status and audit fields
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_by = Column(String, nullable=True)  # User ID who created this user
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    updated_by = Column(String, nullable=True)  # User ID who last updated
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Soft delete fields
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    deleted_by = Column(String, nullable=True)
