"""
Contact Log schemas for buyer-SHG communication
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class InquiryBase(BaseModel):
    name: str
    email: EmailStr
    location: str
    phone: Optional[str] = None
    product_id: str
    ip_address: Optional[str] = None  # Optional - backend will capture from request


class InquiryCreate(InquiryBase):
    pass


class InquiryUpdate(BaseModel):
    pass


class InquiryResponse(BaseModel):
    id: str
    buyer_id: str
    product_id: str
    shg_id: str
    ip_address: str
    created_at: datetime

    class Config:
        from_attributes = True
