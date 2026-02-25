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
from ..models.category import Category
from ..models.user import User

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
    total_categories = db.query(Category).filter(Category.is_active == True).count()
    total_super_admins = db.query(User).filter(User.role == 'super_admin', User.is_active == True).count()
    
    return {
        "totalProducts": total_products,
        "totalSHGs": total_shgs,
        "totalContacts": total_contacts,
        "totalCategories": total_categories,
        "totalSuperAdmins": total_super_admins
    }


@router.get("/metrics")
async def get_metrics(
    type: str = "shg",
    period: str = "30",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """
    Get performance metrics (top/least SHGs or products)
    
    type: 'shg' for inquiry metrics, 'product' for product count metrics
    period: '7', '30', '90', 'all' (only applies to 'shg' type)
    """
    from datetime import datetime, timedelta
    
    if type == "shg":
        # SHG/Farmer Inquiries Metrics
        # Calculate date filter based on period
        date_filter = None
        if period != "all":
            days = int(period)
            date_filter = datetime.utcnow() - timedelta(days=days)
        
        # Query to get inquiry counts per SHG
        query = db.query(
            SHG.id,
            SHG.name,
            SHG.state,
            SHG.district,
            SHG.type,
            func.count(ContactLog.id).label('inquiry_count')
        ).outerjoin(
            ContactLog, SHG.id == ContactLog.shg_id
        ).filter(
            SHG.is_active == True
        )
        
        # Apply date filter if not "all time"
        if date_filter:
            query = query.filter(ContactLog.created_at >= date_filter)
        
        # Group by SHG
        query = query.group_by(SHG.id, SHG.name, SHG.state, SHG.district, SHG.type)
        
        # Get all results
        all_shgs = query.all()
        
        # Sort for top 10 (most inquiries)
        top_shgs = sorted(all_shgs, key=lambda x: x.inquiry_count, reverse=True)[:10]
        
        # Sort for least 10 (least inquiries, but only SHGs with at least 1 product)
        # Filter SHGs that have products
        shgs_with_products = db.query(SHG.id).join(Product).filter(
            SHG.is_active == True,
            Product.is_active == True
        ).distinct().all()
        shg_ids_with_products = {shg.id for shg in shgs_with_products}
        
        # Filter to only include SHGs with products
        shgs_with_products_list = [shg for shg in all_shgs if shg.id in shg_ids_with_products]
        least_shgs = sorted(shgs_with_products_list, key=lambda x: x.inquiry_count)[:10]
        
        return {
            "topSHGs": [
                {
                    "id": shg.id,
                    "name": shg.name,
                    "state": shg.state or "N/A",
                    "district": shg.district or "N/A",
                    "type": shg.type,
                    "inquiries": shg.inquiry_count
                }
                for shg in top_shgs
            ],
            "leastSHGs": [
                {
                    "id": shg.id,
                    "name": shg.name,
                    "state": shg.state or "N/A",
                    "district": shg.district or "N/A",
                    "type": shg.type,
                    "inquiries": shg.inquiry_count
                }
                for shg in least_shgs
            ],
            "topProducts": [],
            "leastProducts": []
        }
    
    elif type == "product":
        # Number of Products Metrics (always all time)
        # Query to get product counts per SHG
        query = db.query(
            SHG.id,
            SHG.name,
            SHG.state,
            SHG.district,
            SHG.type,
            func.count(Product.id).label('product_count')
        ).outerjoin(
            Product, SHG.id == Product.shg_id
        ).filter(
            SHG.is_active == True
        ).group_by(
            SHG.id, SHG.name, SHG.state, SHG.district, SHG.type
        )
        
        # Get all results
        all_shgs = query.all()
        
        # Filter to only include SHGs with at least 1 product
        shgs_with_products = [shg for shg in all_shgs if shg.product_count > 0]
        
        # Sort for top 10 (most products)
        top_products = sorted(shgs_with_products, key=lambda x: x.product_count, reverse=True)[:10]
        
        # Sort for least 10 (least products, but at least 1)
        least_products = sorted(shgs_with_products, key=lambda x: x.product_count)[:10]
        
        return {
            "topSHGs": [],
            "leastSHGs": [],
            "topProducts": [
                {
                    "id": shg.id,
                    "name": shg.name,
                    "state": shg.state or "N/A",
                    "district": shg.district or "N/A",
                    "type": shg.type,
                    "inquiries": shg.product_count  # Frontend expects 'inquiries' field
                }
                for shg in top_products
            ],
            "leastProducts": [
                {
                    "id": shg.id,
                    "name": shg.name,
                    "state": shg.state or "N/A",
                    "district": shg.district or "N/A",
                    "type": shg.type,
                    "inquiries": shg.product_count  # Frontend expects 'inquiries' field
                }
                for shg in least_products
            ]
        }
    
    # Default fallback
    return {
        "topSHGs": [],
        "leastSHGs": [],
        "topProducts": [],
        "leastProducts": []
    }
