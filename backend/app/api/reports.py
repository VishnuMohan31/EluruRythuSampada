"""
Reports routes for exporting data
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
import csv
import io
from datetime import datetime

from ..core.deps import get_db, get_current_admin
from ..models.inquiry import ContactLog, Buyer
from ..models.product import Product
from ..models.shg import SHG
from ..models.category import Category

router = APIRouter()


@router.get("/inquiries/export")
async def export_inquiries(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Export all inquiries to CSV"""
    # Fetch all contact logs with related data
    contact_logs = db.query(ContactLog).all()
    
    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        'Contact ID',
        'Date',
        'Buyer Name',
        'Buyer Email',
        'Buyer Phone',
        'Buyer Location',
        'Product Name',
        'Product ID',
        'SHG Name',
        'SHG ID',
        'IP Address'
    ])
    
    # Write data rows
    for log in contact_logs:
        buyer = db.query(Buyer).filter(Buyer.id == log.buyer_id).first()
        product = db.query(Product).filter(Product.id == log.product_id).first()
        shg = db.query(SHG).filter(SHG.id == log.shg_id).first()
        
        writer.writerow([
            log.id,
            log.created_at.strftime('%Y-%m-%d %H:%M:%S') if log.created_at else '',
            buyer.name if buyer else '',
            buyer.email if buyer else '',
            buyer.phone if buyer else '',
            buyer.location if buyer else '',
            product.name if product else '',
            product.id if product else '',
            shg.name if shg else '',
            shg.id if shg else '',
            log.ip_address or ''
        ])
    
    # Prepare response
    output.seek(0)
    filename = f"inquiries_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/analytics/export")
async def export_analytics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Export analytics data to CSV"""
    # Fetch all products with analytics
    products = db.query(Product).all()
    
    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        'Product ID',
        'Product Name',
        'Category',
        'SHG Name',
        'View Count',
        'Contact Count',
        'Status',
        'Created Date'
    ])
    
    # Write data rows
    for product in products:
        category = db.query(Category).filter(Category.id == product.category_id).first()
        shg = db.query(SHG).filter(SHG.id == product.shg_id).first()
        contact_count = db.query(ContactLog).filter(ContactLog.product_id == product.id).count()
        
        writer.writerow([
            product.id,
            product.name,
            category.name if category else '',
            shg.name if shg else '',
            product.view_count,
            contact_count,
            'Active' if product.is_active else 'Inactive',
            product.created_at.strftime('%Y-%m-%d') if product.created_at else ''
        ])
    
    # Prepare response
    output.seek(0)
    filename = f"analytics_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/products/export")
async def export_products(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Export all products to CSV"""
    products = db.query(Product).all()
    
    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        'Product ID',
        'Product Name',
        'Description',
        'Category',
        'Subcategory',
        'SHG Name',
        'SHG Contact Person',
        'SHG Mobile',
        'Mandal',
        'Village',
        'View Count',
        'Status',
        'Created Date',
        'Image URL',
        'YouTube Link',
        'Instagram Link'
    ])
    
    # Write data rows
    for product in products:
        category = db.query(Category).filter(Category.id == product.category_id).first()
        shg = db.query(SHG).filter(SHG.id == product.shg_id).first()
        
        writer.writerow([
            product.id,
            product.name,
            product.description,
            category.name if category else '',
            '',  # subcategory
            shg.name if shg else '',
            shg.contact_person if shg else '',
            shg.mobile_number if shg else '',
            shg.mandal if shg else '',
            shg.village if shg else '',
            product.view_count,
            'Active' if product.is_active else 'Inactive',
            product.created_at.strftime('%Y-%m-%d') if product.created_at else '',
            product.image_url or '',
            product.youtube_link or '',
            product.instagram_link or ''
        ])
    
    # Prepare response
    output.seek(0)
    filename = f"products_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
