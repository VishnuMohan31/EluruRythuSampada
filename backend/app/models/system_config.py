"""
System configuration model for app settings
"""
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.sql import func
from ..database import Base


class SystemConfig(Base):
    __tablename__ = "system_config"

    id = Column(String, primary_key=True, index=True)
    config_key = Column(String, unique=True, nullable=False, index=True)
    config_value = Column(Text)
    config_type = Column(String)  # string, number, boolean, json
    description = Column(Text)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
