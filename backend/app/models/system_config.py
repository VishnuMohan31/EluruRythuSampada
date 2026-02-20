"""
System configuration model for app settings
"""
from sqlalchemy import Column, String, Text, DateTime, Integer
from sqlalchemy.sql import func
from ..database import Base


class SystemConfig(Base):
    """Store all configurable system settings"""
    __tablename__ = "system_config"

    # Primary key with formatted ID (CFG001)
    id = Column(String(20), primary_key=True, index=True, nullable=False)
    
    config_key = Column(String(100), unique=True, nullable=False, index=True)
    config_value = Column(Text, nullable=True)
    config_type = Column(String(20), nullable=False)  # string, number, boolean, json, url
    description = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    updated_by = Column(String, nullable=True)  # User ID who last updated


# Configurable keys:
# - app_name: Application name
# - app_logo_url: S3 URL for logo
# - default_theme: Default theme name
# - header_content: HTML content for header
# - footer_content: HTML content for footer
# - terms_content: Terms & Conditions page content
# - privacy_content: Privacy Policy page content
# - disclaimer_content: Disclaimer page content
