"""
Analytics and reporting routes
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional

from ..core.deps import get_db, get_current_admin
from ..models.product import Product
from ..models.farmer import Farmer
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
    total_shgs = db.query(Farmer).filter(Farmer.is_active == True).count()
    total_contacts = db.query(ContactLog).count()
    total_categories = db.query(Category).filter(Category.is_active == True).count()
    total_super_admins = db.query(User).filter(User.role == 'super_admin', User.is_active == True).count()
    
    return {
        "totalProducts": total_products,
        "totalFarmers": total_shgs,
        "totalContacts": total_contacts,
        "totalCategories": total_categories,
        "totalSuperAdmins": total_super_admins
    }


@router.get("/metrics")
async def get_metrics(
    type: str = "farmer",
    period: str = "30",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """
    Get performance metrics (top/least Farmers or products)
    
    type: 'farmer' for inquiry metrics, 'product' for product count metrics
    period: '7', '30', '90', 'all' (only applies to 'farmer' type)
    """
    from datetime import datetime, timedelta
    
    if type == "farmer":
        # Farmer/Farmer Inquiries Metrics
        # Calculate date filter based on period
        date_filter = None
        if period != "all":
            days = int(period)
            date_filter = datetime.utcnow() - timedelta(days=days)
        
        # Query to get inquiry counts per Farmer
        query = db.query(
            Farmer.id,
            Farmer.name,
            Farmer.state,
            Farmer.district,
            Farmer.type,
            func.count(ContactLog.id).label('inquiry_count')
        ).outerjoin(
            ContactLog, Farmer.id == ContactLog.farmer_id
        ).filter(
            Farmer.is_active == True
        )
        
        # Apply date filter if not "all time"
        if date_filter:
            query = query.filter(ContactLog.created_at >= date_filter)
        
        # Group by Farmer
        query = query.group_by(Farmer.id, Farmer.name, Farmer.state, Farmer.district, Farmer.type)
        
        # Get all results
        all_shgs = query.all()
        
        # Sort for top 10 (most inquiries)
        top_farmers = sorted(all_shgs, key=lambda x: x.inquiry_count, reverse=True)[:10]
        
        # Sort for least 10 (least inquiries, but only Farmers with at least 1 product)
        # Filter Farmers that have products
        shgs_with_products = db.query(Farmer.id).join(Product).filter(
            Farmer.is_active == True,
            Product.is_active == True
        ).distinct().all()
        shg_ids_with_products = {farmer.id for farmer in shgs_with_products}
        
        # Filter to only include Farmers with products
        shgs_with_products_list = [farmer for farmer in all_shgs if farmer.id in shg_ids_with_products]
        least_shgs = sorted(shgs_with_products_list, key=lambda x: x.inquiry_count)[:10]
        
        return {
            "topFarmers": [
                {
                    "id": farmer.id,
                    "name": farmer.name,
                    "state": farmer.state or "N/A",
                    "district": farmer.district or "N/A",
                    "type": farmer.type,
                    "inquiries": farmer.inquiry_count
                }
                for farmer in top_farmers
            ],
            "leastFarmers": [
                {
                    "id": farmer.id,
                    "name": farmer.name,
                    "state": farmer.state or "N/A",
                    "district": farmer.district or "N/A",
                    "type": farmer.type,
                    "inquiries": farmer.inquiry_count
                }
                for farmer in least_shgs
            ],
            "topProducts": [],
            "leastProducts": []
        }
    
    elif type == "product":
        # Number of Products Metrics (always all time)
        # Query to get product counts per Farmer
        query = db.query(
            Farmer.id,
            Farmer.name,
            Farmer.state,
            Farmer.district,
            Farmer.type,
            func.count(Product.id).label('product_count')
        ).outerjoin(
            Product, Farmer.id == Product.farmer_id
        ).filter(
            Farmer.is_active == True
        ).group_by(
            Farmer.id, Farmer.name, Farmer.state, Farmer.district, Farmer.type
        )
        
        # Get all results
        all_shgs = query.all()
        
        # Filter to only include Farmers with at least 1 product
        shgs_with_products = [farmer for farmer in all_shgs if farmer.product_count > 0]
        
        # Sort for top 10 (most products)
        top_products = sorted(shgs_with_products, key=lambda x: x.product_count, reverse=True)[:10]
        
        # Sort for least 10 (least products, but at least 1)
        least_products = sorted(shgs_with_products, key=lambda x: x.product_count)[:10]
        
        return {
            "topFarmers": [],
            "leastFarmers": [],
            "topProducts": [
                {
                    "id": farmer.id,
                    "name": farmer.name,
                    "state": farmer.state or "N/A",
                    "district": farmer.district or "N/A",
                    "type": farmer.type,
                    "inquiries": farmer.product_count  # Frontend expects 'inquiries' field
                }
                for farmer in top_products
            ],
            "leastProducts": [
                {
                    "id": farmer.id,
                    "name": farmer.name,
                    "state": farmer.state or "N/A",
                    "district": farmer.district or "N/A",
                    "type": farmer.type,
                    "inquiries": farmer.product_count  # Frontend expects 'inquiries' field
                }
                for farmer in least_products
            ]
        }
    
    # Default fallback
    return {
        "topFarmers": [],
        "leastFarmers": [],
        "topProducts": [],
        "leastProducts": []
    }
