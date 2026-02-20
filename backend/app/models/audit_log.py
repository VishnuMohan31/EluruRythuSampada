"""
Audit log model for tracking all admin/super admin actions
"""
from sqlalchemy import Column, String, Text, DateTime, Integer, JSON
from sqlalchemy.sql import func
from ..database import Base


class AuditLog(Base):
    """Comprehensive audit trail for all administrative actions"""
    __tablename__ = "audit_logs"

    # Primary key with formatted ID (AUD001)
    id = Column(String(20), primary_key=True, index=True, nullable=False)
    
    user_id = Column(String, nullable=False, index=True)  # Admin or Super Admin ID
    action_type = Column(String(50), nullable=False, index=True)  # CREATE, UPDATE, DELETE, etc.
    resource_type = Column(String(50), nullable=False, index=True)  # Product, Vendor, SHG, etc.
    resource_id = Column(String, nullable=True, index=True)  # ID of affected resource
    
    old_value = Column(JSON, nullable=True)  # Previous state (for updates/deletes)
    new_value = Column(JSON, nullable=True)  # New state (for creates/updates)
    
    ip_address = Column(String(45), nullable=False)
    user_agent = Column(String(500), nullable=True)
    
    description = Column(Text, nullable=True)  # Human-readable description
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
