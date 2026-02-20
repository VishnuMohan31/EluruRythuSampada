"""
User schemas for validation
"""
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str
    mobile_number: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None


class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    mobile_number: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    
    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
