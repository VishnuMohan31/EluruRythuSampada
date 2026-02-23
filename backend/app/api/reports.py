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
    start_date: str = None,
    end_date: str = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Export all inquiries to CSV with optional date filtering"""
    # Build query
    query = db.query(ContactLog)
    
    # Apply date filters if provided
    if start_date:
        from datetime import datetime
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
        query = query.filter(ContactLog.created_at >= start_dt)
    
    if end_date:
        from datetime import datetime, timedelta
        end_dt = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)  # Include entire end date
        query = query.filter(ContactLog.created_at < end_dt)
    
    contact_logs = query.all()
    
    print(f"📊 Exporting {len(contact_logs)} inquiries (start_date={start_date}, end_date={end_date})")
    
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
        'Product Description',
        'SHG Name',
        'SHG ID',
        'SHG Contact Person',
        'SHG Mobile Number',
        'SHG Mandal',
        'SHG Village'
    ])
    
    # Write data rows
    for log in contact_logs:
        buyer = db.query(Buyer).filter(Buyer.id == log.buyer_id).first()
        product = db.query(Product).filter(Product.id == log.product_id).first()
        shg = db.query(SHG).filter(SHG.id == log.shg_id).first()
        
        # Convert to IST (UTC+5:30)
        from datetime import timedelta
        ist_time = log.created_at + timedelta(hours=5, minutes=30) if log.created_at else None
        
        writer.writerow([
            log.id,
            ist_time.strftime('%d/%m/%Y %H:%M:%S') if ist_time else '',
            buyer.name if buyer else '',
            buyer.email if buyer else '',
            buyer.phone if buyer else '',
            buyer.location if buyer else '',
            product.name if product else '',
            product.id if product else '',
            product.description if product else '',
            shg.name if shg else '',
            shg.id if shg else '',
            shg.contact_person if shg else '',
            shg.mobile_number if shg else '',
            shg.mandal if shg else '',
            shg.village if shg else ''
        ])
    
    # Prepare response
    output.seek(0)
    date_range = f"_{start_date}_to_{end_date}" if start_date and end_date else ""
    filename = f"inquiries_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}{date_range}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/analytics/export")
async def export_analytics(
    start_date: str = None,
    end_date: str = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Export analytics data to CSV with optional date filtering"""
    # Build query
    query = db.query(Product)
    
    # Apply date filters if provided
    if start_date:
        from datetime import datetime
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
        query = query.filter(Product.created_at >= start_dt)
    
    if end_date:
        from datetime import datetime, timedelta
        end_dt = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
        query = query.filter(Product.created_at < end_dt)
    
    products = query.all()
    
    print(f"📊 Exporting analytics for {len(products)} products (start_date={start_date}, end_date={end_date})")
    
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
        
        # Convert to IST (UTC+5:30)
        from datetime import timedelta
        ist_time = product.created_at + timedelta(hours=5, minutes=30) if product.created_at else None
        
        writer.writerow([
            product.id,
            product.name,
            category.name if category else '',
            shg.name if shg else '',
            product.view_count,
            contact_count,
            'Active' if product.is_active else 'Inactive',
            ist_time.strftime('%d/%m/%Y') if ist_time else ''
        ])
    
    # Prepare response
    output.seek(0)
    date_range = f"_{start_date}_to_{end_date}" if start_date and end_date else ""
    filename = f"analytics_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}{date_range}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/products/export")
async def export_products(
    start_date: str = None,
    end_date: str = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Export all products to CSV with optional date filtering"""
    # Build query
    query = db.query(Product)
    
    # Apply date filters if provided
    if start_date:
        from datetime import datetime
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
        query = query.filter(Product.created_at >= start_dt)
    
    if end_date:
        from datetime import datetime, timedelta
        end_dt = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
        query = query.filter(Product.created_at < end_dt)
    
    products = query.all()
    
    print(f"📊 Exporting {len(products)} products (start_date={start_date}, end_date={end_date})")
    
    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        'Product ID',
        'Product Name',
        'Description',
        'Category',
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
        
        # Convert to IST (UTC+5:30)
        from datetime import timedelta
        ist_time = product.created_at + timedelta(hours=5, minutes=30) if product.created_at else None
        
        writer.writerow([
            product.id,
            product.name,
            product.description,
            category.name if category else '',
            shg.name if shg else '',
            shg.contact_person if shg else '',
            shg.mobile_number if shg else '',
            shg.mandal if shg else '',
            shg.village if shg else '',
            product.view_count,
            'Active' if product.is_active else 'Inactive',
            ist_time.strftime('%d/%m/%Y') if ist_time else '',
            product.image_url or '',
            product.youtube_link or '',
            product.instagram_link or ''
        ])
    
    # Prepare response
    output.seek(0)
    date_range = f"_{start_date}_to_{end_date}" if start_date and end_date else ""
    filename = f"products_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}{date_range}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
