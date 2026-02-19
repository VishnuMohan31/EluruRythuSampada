# API Endpoints Documentation

## Base URL
`http://localhost:8000`

## Authentication
All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### POST /api/auth/login
Login with email and password
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: `{ "access_token": "string", "token_type": "bearer", "user": {...} }`
- **Public**: Yes

---

## User Management Endpoints

### GET /api/users/?role=super_admin
Get all users by role
- **Query Params**: `role` (optional)
- **Auth**: Required (admin or super_admin)
- **Response**: Array of user objects

### POST /api/users
Create new user
- **Body**: `{ "name": "string", "email": "string", "password": "string", "role": "super_admin", "mobile_number": "string" }`
- **Auth**: Required (admin or super_admin)
- **Response**: User object

### PUT /api/users/{id}
Update user
- **Body**: `{ "name": "string", "email": "string", "mobile_number": "string" }`
- **Auth**: Required (admin or super_admin)
- **Response**: User object

### PUT /api/users/{id}/deactivate
Deactivate user (soft delete)
- **Auth**: Required (admin or super_admin)
- **Response**: `{ "message": "User deactivated successfully" }`

### PUT /api/users/{id}/reactivate
Reactivate user
- **Auth**: Required (admin or super_admin)
- **Response**: `{ "message": "User reactivated successfully" }`

### PUT /api/users/me/change-password
Change current user's password
- **Body**: `{ "current_password": "string", "new_password": "string" }`
- **Auth**: Required
- **Response**: `{ "message": "Password changed successfully" }`

---

## Category Management Endpoints

### GET /api/categories
Get all categories
- **Query Params**: `include_inactive` (boolean, default: false)
- **Auth**: Not required for active categories
- **Response**: Array of category objects

### GET /api/categories/{id}
Get category by ID
- **Auth**: Not required
- **Response**: Category object

### POST /api/categories
Create new category
- **Body**: `{ "name": "string", "description": "string", "image_url": "string" }`
- **Auth**: Required (admin or super_admin)
- **Response**: Category object

### PUT /api/categories/{id}
Update category
- **Body**: `{ "name": "string", "description": "string", "image_url": "string", "is_active": boolean }`
- **Auth**: Required (admin or super_admin)
- **Response**: Category object

### PUT /api/categories/{id}/deactivate
Deactivate category (soft delete)
- **Auth**: Required (admin or super_admin)
- **Response**: `{ "message": "Category deactivated successfully", "category": {...} }`

### PUT /api/categories/{id}/reactivate
Reactivate category
- **Auth**: Required (admin or super_admin)
- **Response**: `{ "message": "Category reactivated successfully", "category": {...} }`

---

## SHG Management Endpoints

### GET /api/shgs
Get all SHGs
- **Query Params**: `include_inactive` (boolean, default: false)
- **Auth**: Not required for active SHGs
- **Response**: Array of SHG objects

### GET /api/shgs/{id}
Get SHG by ID
- **Auth**: Not required
- **Response**: SHG object

### POST /api/shgs
Create new SHG
- **Body**: `{ "name": "string", "contact_person": "string", "mobile_number": "string", "state": "string", "district": "string", "mandal": "string", "village": "string", "description": "string" }`
- **Auth**: Required (admin or super_admin)
- **Response**: SHG object

### PUT /api/shgs/{id}
Update SHG
- **Body**: `{ "name": "string", "contact_person": "string", "mobile_number": "string", "mandal": "string", "village": "string", "description": "string", "is_active": boolean }`
- **Auth**: Required (admin or super_admin)
- **Response**: SHG object

### PUT /api/shgs/{id}/deactivate
Deactivate SHG (soft delete)
- **Auth**: Required (admin or super_admin)
- **Response**: `{ "message": "SHG deactivated successfully", "shg": {...} }`

### PUT /api/shgs/{id}/reactivate
Reactivate SHG
- **Auth**: Required (admin or super_admin)
- **Response**: `{ "message": "SHG reactivated successfully", "shg": {...} }`

---

## Product Management Endpoints

### GET /api/products
Get all products with filters
- **Query Params**: 
  - `include_inactive` (boolean, default: false)
  - `category_id` (string, optional)
  - `shg_id` (string, optional)
  - `search` (string, optional)
  - `is_featured` (boolean, optional)
- **Auth**: Not required for active products
- **Response**: Array of product objects

### GET /api/products/{id}
Get product by ID (increments view count)
- **Auth**: Not required
- **Response**: Product object

### POST /api/products
Create new product
- **Body**: `{ "name": "string", "description": "string", "category_id": "string", "subcategory_id": "string", "shg_id": "string", "image_url": "string", "youtube_link": "string", "instagram_link": "string" }`
- **Auth**: Required (admin or super_admin)
- **Response**: Product object

### PUT /api/products/{id}
Update product
- **Body**: `{ "name": "string", "description": "string", "category_id": "string", "shg_id": "string", "image_url": "string", "youtube_link": "string", "instagram_link": "string", "is_active": boolean }`
- **Auth**: Required (admin or super_admin)
- **Response**: Product object

### PUT /api/products/{id}/deactivate
Deactivate product (soft delete)
- **Auth**: Required (admin or super_admin)
- **Response**: `{ "message": "Product deactivated successfully", "product": {...} }`

### PUT /api/products/{id}/reactivate
Reactivate product
- **Auth**: Required (admin or super_admin)
- **Response**: `{ "message": "Product reactivated successfully", "product": {...} }`

### POST /api/products/upload-image
Upload product image
- **Body**: FormData with `file` field (image file, max 5MB)
- **Auth**: Required (admin or super_admin)
- **Response**: `{ "image_url": "string", "filename": "string" }`

---

## Analytics Endpoints

### GET /api/analytics/stats
Get dashboard statistics
- **Auth**: Required (admin or super_admin)
- **Response**: 
```json
{
  "totalProducts": 0,
  "totalSHGs": 0,
  "totalVendors": 0,
  "totalBuyers": 0,
  "totalContacts": 0,
  "totalViews": 0
}
```

### GET /api/analytics/metrics
Get performance metrics
- **Auth**: Required (admin or super_admin)
- **Response**: 
```json
{
  "topSHGs": [],
  "leastSHGs": [],
  "topProducts": [],
  "leastProducts": []
}
```

---

## Inquiry Endpoints

### GET /api/inquiries
Get all contact logs
- **Auth**: Required (admin or super_admin)
- **Response**: Array of inquiry objects

### GET /api/inquiries/{id}
Get inquiry by ID
- **Auth**: Required (admin or super_admin)
- **Response**: Inquiry object

### POST /api/inquiries
Create new inquiry (public endpoint for buyers)
- **Body**: `{ "name": "string", "email": "string", "phone": "string", "location": "string", "product_id": "string", "ip_address": "string" }`
- **Auth**: Not required
- **Response**: Inquiry object

### DELETE /api/inquiries/{id}
Delete inquiry
- **Auth**: Required (admin or super_admin)
- **Response**: `{ "message": "Contact log deleted successfully" }`

---

## Reports Endpoints

### GET /api/reports/inquiries/export
Export all inquiries to CSV
- **Auth**: Required (admin or super_admin)
- **Response**: CSV file download

### GET /api/reports/analytics/export
Export analytics data to CSV
- **Auth**: Required (admin or super_admin)
- **Response**: CSV file download

### GET /api/reports/products/export
Export all products to CSV
- **Auth**: Required (admin or super_admin)
- **Response**: CSV file download

---

## Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

---

## Notes

1. All timestamps are in UTC format
2. Soft delete is used - records are marked as inactive instead of being deleted
3. File uploads are stored in `/storage/products/` directory
4. Image URLs are relative paths: `/storage/products/{filename}`
5. Default admin credentials: `admin@shg.com` / `admin123`
