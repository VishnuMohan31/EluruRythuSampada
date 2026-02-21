"""
Analytics and reporting routes
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional

from ..core.deps import get_db, get_current_admin
from ..models.product import Product
from ..models.shg import SHG
from ..models.inquiry import ContactLog
from ..models.product_view import ProductView

router = APIRouter()


@router.get("/stats")
async def get_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Get dashboard statistics"""
    
    total_products = db.query(Product).filter(Product.is_active == True).count()
    total_shgs = db.query(SHG).filter(SHG.is_active == True).count()
    total_contacts = db.query(ContactLog).count()
    total_views = db.query(ProductView).count()
    
    return {
        "totalProducts": total_products,
        "totalSHGs": total_shgs,
        "totalContacts": total_contacts
    }


@router.get("/metrics")
async def get_metrics(
    type: str = "shg",
    period: str = "30",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Get performance metrics (top/least SHGs or products)"""
    
    # For now, return empty arrays since we don't have inquiry tracking yet
    return {
        "topSHGs": [],
        "leastSHGs": [],
        "topProducts": [],
        "leastProducts": []
    }
