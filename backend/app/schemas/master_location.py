"""
Master Location schemas for validation
"""
from pydantic import BaseModel
from typing import List


class MandalResponse(BaseModel):
    """Response schema for unique mandals"""
    mandals: List[str]


class VillageResponse(BaseModel):
    """Response schema for villages"""
    id: int
    village: str
    mandal: str
    district: str
    state: str

    class Config:
        from_attributes = True


class VillageListResponse(BaseModel):
    """Response schema for list of villages"""
    villages: List[VillageResponse]
