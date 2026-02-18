# Database Schema Documentation
## SHG India Marketplace Portal

---

## Overview

This document describes the complete database schema for the SHG India Marketplace Portal.

**Database Type:** PostgreSQL 14+  
**Total Tables:** 12  
**Primary Key Strategy:** Auto-incrementing integers with formatted string IDs  
**Soft Delete:** Implemented on all user-generated content tables  

---

## Schema Principles

1. **Primary Keys**: Auto-incrementing integers (`_id`) with formatted string IDs (`id`) for application use
2. **Soft Deletes**: All user-generated content tables include `is_active`, `deleted_at`, `deleted_by`
3. **Audit Trail**: All tables include `created_at`, `created_by`, `updated_at`, `updated_by`
4. **Indexing**: Strategic indexes on foreign keys, search fields, and filter fields
5. **No UUIDs**: Sequential integer primary keys only

---

## Tables

### 1. users
**Purpose:** Store Admin and Super Admin accounts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| _id | SERIAL | PRIMARY KEY | Internal primary key |
| id | VARCHAR(20) | UNIQUE, NOT NULL | Format: ADM001, SAD001 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| full_name | VARCHAR(100) | NOT NULL | User's full name |
| hashed_password | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| role | VARCHAR(20) | NOT NULL | admin or super_admin |
| state | VARCHAR(100) | NULLABLE | Fixed for Super Admin, null for Admin |
| district | VARCHAR(100) | NULLABLE | Fixed for Super Admin, null for Admin |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Soft delete flag |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| created_by | VARCHAR(20) | NULLABLE | User ID who created this user |
| updated_at | TIMESTAMP | NULLABLE | Last update timestamp |
| updated_by | VARCHAR(20) | NULLABLE | User ID who last updated |
| last_login | TIMESTAMP | NULLABLE | Last login timestamp |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete timestamp |
| deleted_by | VARCHAR(20) | NULLABLE | User ID who deleted |

**Indexes:** id, email, role, state, district, is_active

**Business Rules:**
- Only ONE Admin exists in the system
- Admin can create Super Admins
- Super Admin is assigned to specific State + District (immutable)
- Super Admin can only access data within their district

---

### 2. categories
**Purpose:** Product category management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| _id | SERIAL | PRIMARY KEY | Internal primary key |
| id | VARCHAR(20) | UNIQUE, NOT NULL | Format: CAT001 |
| name | VARCHAR(200) | NOT NULL | Category name |
| description | TEXT | NULLABLE | Category description |
| icon | VARCHAR(50) | NULLABLE | Emoji or icon identifier |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Soft delete flag |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| created_by | VARCHAR(20) | NOT NULL | User ID who created |
| updated_at | TIMESTAMP | NULLABLE | Last update timestamp |
| updated_by | VARCHAR(20) | NULLABLE | User ID who last updated |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete timestamp |
| deleted_by | VARCHAR(20) | NULLABLE | User ID who deleted |

**Indexes:** id, name, is_active

**Relationships:**
- One-to-Many with subcategories
- One-to-Many with products

---

### 3. subcategories
**Purpose:** Product subcategory management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| _id | SERIAL | PRIMARY KEY | Internal primary key |
| id | VARCHAR(20) | UNIQUE, NOT NULL | Format: SUB001 |
| category_id | VARCHAR(20) | FOREIGN KEY, NOT NULL | References categories.id |
| name | VARCHAR(200) | NOT NULL | Subcategory name |
| description | TEXT | NULLABLE | Subcategory description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Soft delete flag |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| created_by | VARCHAR(20) | NOT NULL | User ID who created |
| updated_at | TIMESTAMP | NULLABLE | Last update timestamp |
| updated_by | VARCHAR(20) | NULLABLE | User ID who last updated |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete timestamp |
| deleted_by | VARCHAR(20) | NULLABLE | User ID who deleted |

**Indexes:** id, category_id, name, is_active

**Relationships:**
- Many-to-One with categories
- One-to-Many with products

---

### 4. shgs
**Purpose:** Self Help Group management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| _id | SERIAL | PRIMARY KEY | Internal primary key |
| id | VARCHAR(20) | UNIQUE, NOT NULL | Format: SHG001 |
| name | VARCHAR(100) | NOT NULL | SHG name |
| state | VARCHAR(100) | NOT NULL | State location |
| district | VARCHAR(100) | NOT NULL | District location |
| mandal | VARCHAR(100) | NOT NULL | Mandal location |
| village | VARCHAR(100) | NOT NULL | Village location |
| description | TEXT | NULLABLE | SHG description |
| image_url | VARCHAR(500) | NULLABLE | S3 URL for SHG image |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Soft delete flag |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| created_by | VARCHAR(20) | NOT NULL | User ID who created |
| updated_at | TIMESTAMP | NULLABLE | Last update timestamp |
| updated_by | VARCHAR(20) | NULLABLE | User ID who last updated |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete timestamp |
| deleted_by | VARCHAR(20) | NULLABLE | User ID who deleted |

**Indexes:** id, name, state, district, mandal, village, is_active

**Location Hierarchy:** State → District → Mandal → Village → SHG

**Relationships:**
- One-to-Many with vendors
- One-to-Many with products

---

### 5. vendors
**Purpose:** Vendor/artisan management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| _id | SERIAL | PRIMARY KEY | Internal primary key |
| id | VARCHAR(20) | UNIQUE, NOT NULL | Format: VND001 |
| name | VARCHAR(100) | NOT NULL | Vendor name |
| shg_id | VARCHAR(20) | FOREIGN KEY, NOT NULL | References shgs.id |
| state | VARCHAR(100) | NOT NULL | State location |
| district | VARCHAR(100) | NOT NULL | District location |
| mandal | VARCHAR(100) | NOT NULL | Mandal location |
| village | VARCHAR(100) | NOT NULL | Village location |
| phone | VARCHAR(20) | NOT NULL | Contact phone |
| email | VARCHAR(255) | NULLABLE | Contact email |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'Pending' | Pending/Approved/Rejected |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Soft delete flag |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| created_by | VARCHAR(20) | NOT NULL | User ID who created |
| updated_at | TIMESTAMP | NULLABLE | Last update timestamp |
| updated_by | VARCHAR(20) | NULLABLE | User ID who last updated |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete timestamp |
| deleted_by | VARCHAR(20) | NULLABLE | User ID who deleted |

**Indexes:** id, name, shg_id, state, district, email, status, is_active

**Relationships:**
- Many-to-One with shgs
- One-to-Many with products
- One-to-Many with contact_logs

---

### 6. products
**Purpose:** Product catalog management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| _id | SERIAL | PRIMARY KEY | Internal primary key |
| id | VARCHAR(20) | UNIQUE, NOT NULL | Format: PRD001 |
| name | VARCHAR(200) | NOT NULL | Product name (can duplicate) |
| description | TEXT | NOT NULL | Product description |
| category_id | VARCHAR(20) | FOREIGN KEY, NOT NULL | References categories.id |
| subcategory_id | VARCHAR(20) | FOREIGN KEY, NOT NULL | References subcategories.id |
| shg_id | VARCHAR(20) | FOREIGN KEY, NOT NULL | References shgs.id |
| vendor_id | VARCHAR(20) | FOREIGN KEY, NOT NULL | References vendors.id |
| images | JSONB | NULLABLE | Array of S3 image URLs |
| youtube_link | VARCHAR(500) | NULLABLE | YouTube video URL |
| instagram_link | VARCHAR(500) | NULLABLE | Instagram link |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'Draft' | Draft/Pending/Approved/Rejected |
| view_count | INTEGER | NOT NULL, DEFAULT 0 | Total view count |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Soft delete flag |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| created_by | VARCHAR(20) | NOT NULL | User ID who created |
| updated_at | TIMESTAMP | NULLABLE | Last update timestamp |
| updated_by | VARCHAR(20) | NULLABLE | User ID who last updated |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete timestamp |
| deleted_by | VARCHAR(20) | NULLABLE | User ID who deleted |

**Indexes:** id, name, category_id, subcategory_id, shg_id, vendor_id, status, is_active, created_at

**Full-text Search Indexes:** name (gin_trgm_ops), description (gin_trgm_ops)

**Business Rules:**
- Product names MAY duplicate across vendors
- Product ID is UNIQUE across entire system
- Only Approved products visible to public

**Relationships:**
- Many-to-One with categories
- Many-to-One with subcategories
- Many-to-One with shgs
- Many-to-One with vendors
- One-to-Many with product_views
- One-to-Many with contact_logs

---

### 7. buyers
**Purpose:** Light registration for buyers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| _id | SERIAL | PRIMARY KEY | Internal primary key |
| id | VARCHAR(20) | UNIQUE, NOT NULL | Format: BYR001 |
| name | VARCHAR(100) | NOT NULL | Buyer name |
| email | VARCHAR(255) | NOT NULL | Buyer email |
| location | VARCHAR(200) | NOT NULL | Buyer location |
| phone | VARCHAR(20) | NULLABLE | Buyer phone (optional) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Registration timestamp |
| last_contact_at | TIMESTAMP | NULLABLE | Last vendor contact timestamp |

**Indexes:** id, email, created_at

**Business Rules:**
- No password (light registration)
- Created when buyer contacts vendor for first time
- Used for analytics and autofill

**Relationships:**
- One-to-Many with contact_logs

---

### 8. contact_logs
**Purpose:** Track all buyer-vendor contacts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| _id | SERIAL | PRIMARY KEY | Internal primary key |
| id | VARCHAR(20) | UNIQUE, NOT NULL | Format: CNT001 |
| buyer_id | VARCHAR(20) | FOREIGN KEY, NOT NULL | References buyers.id |
| product_id | VARCHAR(20) | FOREIGN KEY, NOT NULL | References products.id |
| vendor_id | VARCHAR(20) | FOREIGN KEY, NOT NULL | References vendors.id |
| ip_address | VARCHAR(45) | NOT NULL | IPv4 or IPv6 address |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Contact timestamp |

**Indexes:** id, buyer_id, product_id, vendor_id, ip_address, created_at

**Business Rules:**
- Rate limit: 10 contacts per hour per IP
- Used for analytics and reporting

**Relationships:**
- Many-to-One with buyers
- Many-to-One with products
- Many-to-One with vendors

---

### 9. product_views
**Purpose:** Track individual product views for analytics

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| _id | SERIAL | PRIMARY KEY | Internal primary key |
| id | VARCHAR(20) | UNIQUE, NOT NULL | Format: PVW001 |
| product_id | VARCHAR(20) | FOREIGN KEY, NOT NULL | References products.id |
| session_id | VARCHAR(100) | NULLABLE | Browser session ID |
| ip_address | VARCHAR(45) | NULLABLE | IPv4 or IPv6 address |
| user_agent | VARCHAR(500) | NULLABLE | Browser user agent |
| viewed_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | View timestamp |

**Indexes:** id, product_id, session_id, viewed_at

**Business Rules:**
- Auto-increment product.view_count on product detail page view
- Track unique views per session
- Used for "Top Viewed Products" analytics

**Relationships:**
- Many-to-One with products

---

### 10. audit_logs
**Purpose:** Comprehensive audit trail for all admin actions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| _id | SERIAL | PRIMARY KEY | Internal primary key |
| id | VARCHAR(20) | UNIQUE, NOT NULL | Format: AUD001 |
| user_id | VARCHAR(20) | NOT NULL | Admin/Super Admin ID |
| action_type | VARCHAR(50) | NOT NULL | CREATE/UPDATE/DELETE/etc. |
| resource_type | VARCHAR(50) | NOT NULL | Product/Vendor/SHG/etc. |
| resource_id | VARCHAR(20) | NULLABLE | ID of affected resource |
| old_value | JSONB | NULLABLE | Previous state (updates/deletes) |
| new_value | JSONB | NULLABLE | New state (creates/updates) |
| ip_address | VARCHAR(45) | NOT NULL | IPv4 or IPv6 address |
| user_agent | VARCHAR(500) | NULLABLE | Browser user agent |
| description | TEXT | NULLABLE | Human-readable description |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Action timestamp |

**Indexes:** id, user_id, action_type, resource_type, resource_id, created_at

**Business Rules:**
- All Admin/Super Admin actions logged
- Immutable (no updates/deletes)
- Used for compliance and debugging

---

### 11. system_config
**Purpose:** Store all configurable system settings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| _id | SERIAL | PRIMARY KEY | Internal primary key |
| id | VARCHAR(20) | UNIQUE, NOT NULL | Format: CFG001 |
| config_key | VARCHAR(100) | UNIQUE, NOT NULL | Configuration key |
| config_value | TEXT | NULLABLE | Configuration value |
| config_type | VARCHAR(20) | NOT NULL | string/number/boolean/json/url |
| description | TEXT | NULLABLE | Configuration description |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NULLABLE | Last update timestamp |
| updated_by | VARCHAR(20) | NULLABLE | User ID who last updated |

**Indexes:** id, config_key

**Configurable Keys:**
- app_name: Application name
- app_logo_url: S3 URL for logo
- default_theme: Default theme name
- header_content: HTML content for header
- footer_content: HTML content for footer
- terms_content: Terms & Conditions page content
- privacy_content: Privacy Policy page content
- disclaimer_content: Disclaimer page content

---

### 12. daily_analytics
**Purpose:** Daily aggregated analytics for dashboard

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| _id | SERIAL | PRIMARY KEY | Internal primary key |
| id | VARCHAR(20) | UNIQUE, NOT NULL | Format: DAN001 |
| date | DATE | UNIQUE, NOT NULL | Analytics date |
| total_product_views | INTEGER | NOT NULL, DEFAULT 0 | Total product views |
| total_vendor_contacts | INTEGER | NOT NULL, DEFAULT 0 | Total vendor contacts |
| new_products | INTEGER | NOT NULL, DEFAULT 0 | New products added |
| new_vendors | INTEGER | NOT NULL, DEFAULT 0 | New vendors added |
| new_buyers | INTEGER | NOT NULL, DEFAULT 0 | New buyers registered |
| top_products | JSONB | NULLABLE | [{id, name, views}, ...] |
| top_categories | JSONB | NULLABLE | [{id, name, count}, ...] |
| top_shgs | JSONB | NULLABLE | [{id, name, contacts}, ...] |
| metrics | JSONB | NULLABLE | Additional flexible metrics |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:** id, date

**Business Rules:**
- Aggregated daily by background job
- Used for dashboard charts and reports

---

## Auto-Generated ID Formats

| Entity | Prefix | Example | Pattern |
|--------|--------|---------|---------|
| Admin | ADM | ADM001 | ADM + 3 digits |
| Super Admin | SAD | SAD001 | SAD + 3 digits |
| Category | CAT | CAT001 | CAT + 3 digits |
| Subcategory | SUB | SUB001 | SUB + 3 digits |
| SHG | SHG | SHG001 | SHG + 3 digits |
| Vendor | VND | VND001 | VND + 3 digits |
| Product | PRD | PRD001 | PRD + 3 digits |
| Buyer | BYR | BYR001 | BYR + 3 digits |
| Contact Log | CNT | CNT001 | CNT + 3 digits |
| Product View | PVW | PVW001 | PVW + 3 digits |
| Audit Log | AUD | AUD001 | AUD + 3 digits |
| Config | CFG | CFG001 | CFG + 3 digits |
| Analytics | DAN | DAN001 | DAN + 3 digits |

**Note:** IDs are auto-generated by database triggers. Do not provide ID values when inserting data.

---

## Entity Relationships

```
users (Admin/Super Admin)
  ├─> creates/manages ──> categories
  ├─> creates/manages ──> subcategories
  ├─> creates/manages ──> shgs
  ├─> creates/manages ──> vendors
  ├─> creates/manages ──> products
  ├─> configures ──> system_config
  └─> actions logged in ──> audit_logs

categories
  ├─> has many ──> subcategories
  └─> has many ──> products

subcategories
  ├─> belongs to ──> categories
  └─> has many ──> products

shgs
  ├─> has many ──> vendors
  └─> has many ──> products

vendors
  ├─> belongs to ──> shgs
  ├─> has many ──> products
  └─> receives ──> contact_logs

products
  ├─> belongs to ──> categories
  ├─> belongs to ──> subcategories
  ├─> belongs to ──> shgs
  ├─> belongs to ──> vendors
  ├─> has many ──> product_views
  └─> has many ──> contact_logs

buyers
  └─> creates ──> contact_logs

contact_logs
  ├─> belongs to ──> buyers
  ├─> belongs to ──> products
  └─> belongs to ──> vendors

product_views
  └─> belongs to ──> products
```

---

## Data Access Rules

### Admin
- Can access ALL data across all states and districts
- Can create Super Admins
- Can configure system settings
- No location restrictions

### Super Admin
- Can ONLY access data within their assigned district
- All queries automatically filtered by state and district
- Cannot change their assigned state/district
- Cannot access other districts' data

### Public Queries
- All queries must filter by `is_active = TRUE`
- Only show products with `status = 'Approved'`
- Soft-deleted records are hidden

---

## Database Setup

### Prerequisites
- PostgreSQL 14 or higher
- pg_trgm extension for full-text search

### Setup Commands

```bash
# Create database
psql -U postgres -c "CREATE DATABASE shg_marketplace;"

# Run schema script
psql -U postgres -d shg_marketplace -f backend/database/01_create_tables.sql
```

### Default Admin Credentials
- Email: admin@shg.com
- Password: admin123

**⚠️ Change this password immediately after first login!**

---

## Connection String

```
postgresql://username:password@host:port/database_name
```

Example for .env file:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/shg_marketplace
```

---

**Document Version:** 1.0  
**Last Updated:** February 18, 2026  
**PostgreSQL Version:** 14+
