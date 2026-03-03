-- ============================================
-- Eluru Rythu Sampada - Farmers Marketplace Portal
-- Database Schema - PostgreSQL 14+
-- Simple approach: Auto-increment IDs
-- ============================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Drop existing tables
DROP TABLE IF EXISTS daily_analytics CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS system_config CASCADE;
DROP TABLE IF EXISTS product_views CASCADE;
DROP TABLE IF EXISTS contact_logs CASCADE;
DROP TABLE IF EXISTS buyers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS farmers CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS master_locations CASCADE;

-- ============================================
-- TABLES
-- ============================================

-- 1. USERS
CREATE TABLE users (
    id VARCHAR(20) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(20),
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'super_admin')),
    state VARCHAR(100),
    district VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20),
    updated_at TIMESTAMP,
    updated_by VARCHAR(20),
    last_login TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(20)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. MASTER_LOCATIONS (Mandal and Village master data)
CREATE TABLE master_locations (
    id SERIAL PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    mandal VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_master_locations_state ON master_locations(state);
CREATE INDEX idx_master_locations_district ON master_locations(district);
CREATE INDEX idx_master_locations_mandal ON master_locations(mandal);
CREATE INDEX idx_master_locations_village ON master_locations(village);

-- 3. CATEGORIES
CREATE TABLE categories (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    image VARCHAR(500),
    state VARCHAR(100),
    district VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20),
    updated_at TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(20)
);

CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_state ON categories(state);

-- 4. FARMERS (Farmer Groups)
CREATE TABLE farmers (
    id VARCHAR(20) PRIMARY KEY,
    type VARCHAR(20) NOT NULL DEFAULT 'FARMER' CHECK (type IN ('FARMER')),
    name VARCHAR(200) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL UNIQUE, -- Prevent duplicate mobile numbers
    whatsapp_number VARCHAR(20), -- WhatsApp contact number
    state VARCHAR(100),
    district VARCHAR(100),
    mandal VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    farmer_image VARCHAR(500), -- Farmer photo
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20),
    updated_at TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(20)
);

CREATE INDEX idx_farmers_type ON farmers(type);
CREATE INDEX idx_farmers_state ON farmers(state);
CREATE INDEX idx_farmers_district ON farmers(district);
CREATE INDEX idx_farmers_mobile ON farmers(mobile_number);

-- 5. PRODUCTS
CREATE TABLE products (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id VARCHAR(20) NOT NULL REFERENCES categories(id),
    farmer_id VARCHAR(20) NOT NULL REFERENCES farmers(id),
    price VARCHAR(20), -- Product price (stored as string for flexibility)
    max_quantity VARCHAR(50), -- Maximum quantity available (stored as string for flexibility)
    image_url VARCHAR(500), -- Deprecated: kept for backward compatibility
    images TEXT[] DEFAULT '{}', -- Array of image URLs (up to 5 images)
    main_image_index INTEGER DEFAULT 0, -- Index of main image in images array
    youtube_link VARCHAR(500),
    instagram_link VARCHAR(500),
    view_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20),
    updated_at TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(20)
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_farmer ON products(farmer_id);
CREATE INDEX idx_products_name ON products USING gin(name gin_trgm_ops);
CREATE INDEX idx_products_images ON products USING GIN(images);

-- 6. BUYERS
CREATE TABLE buyers (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    location VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_contact_at TIMESTAMP
);

CREATE INDEX idx_buyers_email ON buyers(email);

-- 7. CONTACT_LOGS
CREATE TABLE contact_logs (
    id VARCHAR(20) PRIMARY KEY,
    buyer_id VARCHAR(20) NOT NULL REFERENCES buyers(id),
    product_id VARCHAR(20) NOT NULL REFERENCES products(id),
    farmer_id VARCHAR(20) NOT NULL REFERENCES farmers(id),
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_logs_buyer ON contact_logs(buyer_id);
CREATE INDEX idx_contact_logs_product ON contact_logs(product_id);
CREATE INDEX idx_contact_logs_farmer ON contact_logs(farmer_id);

-- 8. PRODUCT_VIEWS
CREATE TABLE product_views (
    id VARCHAR(20) PRIMARY KEY,
    product_id VARCHAR(20) NOT NULL REFERENCES products(id),
    session_id VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_views_product ON product_views(product_id);
CREATE INDEX idx_product_views_session ON product_views(session_id);

-- 9. AUDIT_LOGS
CREATE TABLE audit_logs (
    id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(20) REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(50),
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- 10. SYSTEM_CONFIG
CREATE TABLE system_config (
    id VARCHAR(20) PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(20) REFERENCES users(id)
);

CREATE INDEX idx_system_config_key ON system_config(config_key);

-- 11. DAILY_ANALYTICS
CREATE TABLE daily_analytics (
    id VARCHAR(20) PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    total_product_views INTEGER DEFAULT 0,
    total_farmer_contacts INTEGER DEFAULT 0,
    new_products INTEGER DEFAULT 0,
    new_farmers INTEGER DEFAULT 0,
    new_buyers INTEGER DEFAULT 0,
    top_products JSONB,
    top_categories JSONB,
    top_farmers JSONB,
    metrics JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_daily_analytics_date ON daily_analytics(date);

-- ============================================
-- SEQUENCES FOR ID GENERATION
-- ============================================

CREATE SEQUENCE IF NOT EXISTS users_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS categories_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS farmers_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS products_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS buyers_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS contact_logs_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS product_views_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS audit_logs_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS system_config_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS daily_analytics_id_seq START 1;

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Default admin user (password: admin123)
INSERT INTO users (id, email, full_name, hashed_password, role, is_active)
VALUES ('ADM001', 'admin@datalegos.com', 'System Administrator', '$2b$12$DNHMGt4qtjJdCNhf9VDFaO3eaQtgKqPgCDOlt6uTpk1xKGP1FVrhK', 'admin', TRUE);

-- Set sequence to start after default admin
SELECT setval('users_id_seq', 1);
