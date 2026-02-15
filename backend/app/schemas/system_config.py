"""
System config schemas for validation
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SystemConfigUpdate(BaseModel):
    config_value: str


class SystemConfigResponse(BaseModel):
    id: str
    config_key: str
    config_value: str
    config_type: str
    description: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
