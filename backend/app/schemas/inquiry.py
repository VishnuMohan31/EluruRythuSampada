"""
Inquiry schemas for validation
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class InquiryBase(BaseModel):
    product_id: str
    buyer_name: str
    buyer_email: EmailStr
    buyer_phone: Optional[str] = None
    message: str


class InquiryCreate(InquiryBase):
    pass


class InquiryUpdate(BaseModel):
    status: Optional[str] = None
    admin_notes: Optional[str] = None


class InquiryResponse(InquiryBase):
    id: str
    status: str
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
