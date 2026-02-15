"""
Tribe schemas for validation
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TribeBase(BaseModel):
    name: str
    region: Optional[str] = None
    description: Optional[str] = None
    specialization: Optional[str] = None


class TribeCreate(TribeBase):
    pass


class TribeUpdate(BaseModel):
    name: Optional[str] = None
    region: Optional[str] = None
    description: Optional[str] = None
    specialization: Optional[str] = None
    is_active: Optional[bool] = None


class TribeResponse(TribeBase):
    id: str
    product_count: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
