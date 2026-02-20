"""
Pydantic schemas for request/response validation
"""
from .user import UserCreate, UserUpdate, UserResponse, Token
from .product import ProductCreate, ProductUpdate, ProductResponse
from .category import CategoryCreate, CategoryUpdate, CategoryResponse
from .shg import SHGCreate, SHGUpdate, SHGResponse
from .inquiry import InquiryCreate, InquiryUpdate, InquiryResponse
from .analytics import AnalyticsResponse
from .system_config import SystemConfigUpdate, SystemConfigResponse

__all__ = [
    "UserCreate", "UserUpdate", "UserResponse", "Token",
    "ProductCreate", "ProductUpdate", "ProductResponse",
    "CategoryCreate", "CategoryUpdate", "CategoryResponse",
    "SHGCreate", "SHGUpdate", "SHGResponse",
    "InquiryCreate", "InquiryUpdate", "InquiryResponse",
    "AnalyticsResponse",
    "SystemConfigUpdate", "SystemConfigResponse"
]
