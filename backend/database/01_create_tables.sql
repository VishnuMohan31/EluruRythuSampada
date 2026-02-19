-- ============================================
-- SHG India Marketplace Portal
-- Database Schema - PostgreSQL 14+
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================
-- DROP EXISTING TABLES (for clean setup)
-- ============================================

DROP TABLE IF EXISTS daily_analytics CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS system_config CASCADE;
DROP TABLE IF EXISTS product_views CASCADE;
DROP TABLE IF EXISTS contact_logs CASCADE;
DROP TABLE IF EXISTS buyers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS shgs CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS generate_user_id CASCADE;
DROP FUNCTION IF EXISTS generate_category_id CASCADE;
DROP FUNCTION IF EXISTS generate_subcategory_id CASCADE;
DROP FUNCTION IF EXISTS generate_shg_id CASCADE;
DROP FUNCTION IF EXISTS generate_vendor_id CASCADE;
DROP FUNCTION IF EXISTS generate_product_id CASCADE;
DROP FUNCTION IF EXISTS generate_buyer_id CASCADE;
DROP FUNCTION IF EXISTS generate_contact_id CASCADE;
DROP FUNCTION IF EXISTS generate_product_view_id CASCADE;
DROP FUNCTION IF EXISTS generate_audit_id CASCADE;
DROP FUNCTION IF EXISTS generate_config_id CASCADE;
DROP FUNCTION IF EXISTS generate_analytics_id CASCADE;

-- ============================================
-- ID GENERATION FUNCTIONS
-- ============================================

-- Users: ADM001 (Admin) or SAD001 (Super Admin)
CREATE OR REPLACE FUNCTION generate_user_id()
RETURNS TRIGGER AS $$
DECLARE
    prefix VARCHAR(3);
    next_num INTEGER;
BEGIN
    IF NEW.role = 'admin' THEN
        prefix := 'ADM';
    ELSE
        prefix := 'SAD';
    END IF;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM users
    WHERE id LIKE prefix || '%';
    
    NEW.id := prefix || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Categories: CAT001
CREATE OR REPLACE FUNCTION generate_category_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM categories;
    
    NEW.id := 'CAT' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Subcategories: SUB001
CREATE OR REPLACE FUNCTION generate_subcategory_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM subcategories;
    
    NEW.id := 'SUB' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- SHGs: SHG001
CREATE OR REPLACE FUNCTION generate_shg_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM shgs;
    
    NEW.id := 'SHG' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Vendors: VND001
CREATE OR REPLACE FUNCTION generate_vendor_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM vendors;
    
    NEW.id := 'VND' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Products: PRD001
CREATE OR REPLACE FUNCTION generate_product_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM products;
    
    NEW.id := 'PRD' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Buyers: BYR001
CREATE OR REPLACE FUNCTION generate_buyer_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM buyers;
    
    NEW.id := 'BYR' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Contact Logs: CNT001
CREATE OR REPLACE FUNCTION generate_contact_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM contact_logs;
    
    NEW.id := 'CNT' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Product Views: PVW001
CREATE OR REPLACE FUNCTION generate_product_view_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM product_views;
    
    NEW.id := 'PVW' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Audit Logs: AUD001
CREATE OR REPLACE FUNCTION generate_audit_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM audit_logs;
    
    NEW.id := 'AUD' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- System Config: CFG001
CREATE OR REPLACE FUNCTION generate_config_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM system_config;
    
    NEW.id := 'CFG' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Daily Analytics: DAN001
CREATE OR REPLACE FUNCTION generate_analytics_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM daily_analytics;
    
    NEW.id := 'DAN' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABLE DEFINITIONS
-- ============================================

-- 1. USERS TABLE
CREATE TABLE users (
    _id SERIAL PRIMARY KEY,
    id VARCHAR(20) UNIQUE NOT NULL,
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

CREATE INDEX idx_users_id ON users(id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_state ON users(state);
CREATE INDEX idx_users_district ON users(district);
CREATE INDEX idx_users_is_active ON users(is_active);

CREATE TRIGGER trg_users_id BEFORE INSERT ON users
FOR EACH ROW EXECUTE FUNCTION generate_user_id();

-- 2. CATEGORIES TABLE
CREATE TABLE categories (
    _id SERIAL PRIMARY KEY,
    id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(20)
);

CREATE INDEX idx_categories_id ON categories(id);
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_is_active ON categories(is_active);

CREATE TRIGGER trg_categories_id BEFORE INSERT ON categories
FOR EACH ROW EXECUTE FUNCTION generate_category_id();

-- 3. SUBCATEGORIES TABLE
CREATE TABLE subcategories (
    _id SERIAL PRIMARY KEY,
    id VARCHAR(20) UNIQUE NOT NULL,
    category_id VARCHAR(20) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(20),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE INDEX idx_subcategories_id ON subcategories(id);
CREATE INDEX idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX idx_subcategories_name ON subcategories(name);
CREATE INDEX idx_subcategories_is_active ON subcategories(is_active);

CREATE TRIGGER trg_subcategories_id BEFORE INSERT ON subcategories
FOR EACH ROW EXECUTE FUNCTION generate_subcategory_id();

-- 4. SHGS TABLE
CREATE TABLE shgs (
    _id SERIAL PRIMARY KEY,
    id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    mobile_number VARCHAR(20),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    mandal VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(20)
);

CREATE INDEX idx_shgs_id ON shgs(id);
CREATE INDEX idx_shgs_name ON shgs(name);
CREATE INDEX idx_shgs_state ON shgs(state);
CREATE INDEX idx_shgs_district ON shgs(district);
CREATE INDEX idx_shgs_mandal ON shgs(mandal);
CREATE INDEX idx_shgs_village ON shgs(village);
CREATE INDEX idx_shgs_is_active ON shgs(is_active);

CREATE TRIGGER trg_shgs_id BEFORE INSERT ON shgs
FOR EACH ROW EXECUTE FUNCTION generate_shg_id();

-- 5. VENDORS TABLE
CREATE TABLE vendors (
    _id SERIAL PRIMARY KEY,
    id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    shg_id VARCHAR(20) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    mandal VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(20),
    FOREIGN KEY (shg_id) REFERENCES shgs(id) ON DELETE CASCADE
);

CREATE INDEX idx_vendors_id ON vendors(id);
CREATE INDEX idx_vendors_name ON vendors(name);
CREATE INDEX idx_vendors_shg_id ON vendors(shg_id);
CREATE INDEX idx_vendors_state ON vendors(state);
CREATE INDEX idx_vendors_district ON vendors(district);
CREATE INDEX idx_vendors_email ON vendors(email);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_is_active ON vendors(is_active);

CREATE TRIGGER trg_vendors_id BEFORE INSERT ON vendors
FOR EACH ROW EXECUTE FUNCTION generate_vendor_id();

-- 6. PRODUCTS TABLE
CREATE TABLE products (
    _id SERIAL PRIMARY KEY,
    id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id VARCHAR(20) NOT NULL,
    subcategory_id VARCHAR(20),
    shg_id VARCHAR(20) NOT NULL,
    image_url VARCHAR(500),
    youtube_link VARCHAR(500),
    instagram_link VARCHAR(500),
    view_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(20),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
    FOREIGN KEY (shg_id) REFERENCES shgs(id) ON DELETE CASCADE
);

CREATE INDEX idx_products_id ON products(id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX idx_products_shg_id ON products(shg_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at);

-- Full-text search indexes
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops);
CREATE INDEX idx_products_description_trgm ON products USING gin(description gin_trgm_ops);

CREATE TRIGGER trg_products_id BEFORE INSERT ON products
FOR EACH ROW EXECUTE FUNCTION generate_product_id();

-- 7. BUYERS TABLE
CREATE TABLE buyers (
    _id SERIAL PRIMARY KEY,
    id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    location VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_contact_at TIMESTAMP
);

CREATE INDEX idx_buyers_id ON buyers(id);
CREATE INDEX idx_buyers_email ON buyers(email);
CREATE INDEX idx_buyers_created_at ON buyers(created_at);

CREATE TRIGGER trg_buyers_id BEFORE INSERT ON buyers
FOR EACH ROW EXECUTE FUNCTION generate_buyer_id();

-- 8. CONTACT LOGS TABLE
CREATE TABLE contact_logs (
    _id SERIAL PRIMARY KEY,
    id VARCHAR(20) UNIQUE NOT NULL,
    buyer_id VARCHAR(20) NOT NULL,
    product_id VARCHAR(20) NOT NULL,
    vendor_id VARCHAR(20) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

CREATE INDEX idx_contact_logs_id ON contact_logs(id);
CREATE INDEX idx_contact_logs_buyer_id ON contact_logs(buyer_id);
CREATE INDEX idx_contact_logs_product_id ON contact_logs(product_id);
CREATE INDEX idx_contact_logs_vendor_id ON contact_logs(vendor_id);
CREATE INDEX idx_contact_logs_ip_address ON contact_logs(ip_address);
CREATE INDEX idx_contact_logs_created_at ON contact_logs(created_at);

CREATE TRIGGER trg_contact_logs_id BEFORE INSERT ON contact_logs
FOR EACH ROW EXECUTE FUNCTION generate_contact_id();

-- 9. PRODUCT VIEWS TABLE
CREATE TABLE product_views (
    _id SERIAL PRIMARY KEY,
    id VARCHAR(20) UNIQUE NOT NULL,
    product_id VARCHAR(20) NOT NULL,
    session_id VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_views_id ON product_views(id);
CREATE INDEX idx_product_views_product_id ON product_views(product_id);
CREATE INDEX idx_product_views_session_id ON product_views(session_id);
CREATE INDEX idx_product_views_viewed_at ON product_views(viewed_at);

CREATE TRIGGER trg_product_views_id BEFORE INSERT ON product_views
FOR EACH ROW EXECUTE FUNCTION generate_product_view_id();

-- 10. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    _id SERIAL PRIMARY KEY,
    id VARCHAR(20) UNIQUE NOT NULL,
    user_id VARCHAR(20) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(20),
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_id ON audit_logs(id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

CREATE TRIGGER trg_audit_logs_id BEFORE INSERT ON audit_logs
FOR EACH ROW EXECUTE FUNCTION generate_audit_id();

-- 11. SYSTEM CONFIG TABLE
CREATE TABLE system_config (
    _id SERIAL PRIMARY KEY,
    id VARCHAR(20) UNIQUE NOT NULL,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    config_type VARCHAR(20) NOT NULL CHECK (config_type IN ('string', 'number', 'boolean', 'json', 'url')),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    updated_by VARCHAR(20)
);

CREATE INDEX idx_system_config_id ON system_config(id);
CREATE INDEX idx_system_config_key ON system_config(config_key);

CREATE TRIGGER trg_system_config_id BEFORE INSERT ON system_config
FOR EACH ROW EXECUTE FUNCTION generate_config_id();

-- 12. DAILY ANALYTICS TABLE
CREATE TABLE daily_analytics (
    _id SERIAL PRIMARY KEY,
    id VARCHAR(20) UNIQUE NOT NULL,
    date DATE UNIQUE NOT NULL,
    total_product_views INTEGER NOT NULL DEFAULT 0,
    total_vendor_contacts INTEGER NOT NULL DEFAULT 0,
    new_products INTEGER NOT NULL DEFAULT 0,
    new_vendors INTEGER NOT NULL DEFAULT 0,
    new_buyers INTEGER NOT NULL DEFAULT 0,
    top_products JSONB,
    top_categories JSONB,
    top_shgs JSONB,
    metrics JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_daily_analytics_id ON daily_analytics(id);
CREATE INDEX idx_daily_analytics_date ON daily_analytics(date);

CREATE TRIGGER trg_daily_analytics_id BEFORE INSERT ON daily_analytics
FOR EACH ROW EXECUTE FUNCTION generate_analytics_id();

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default admin user
INSERT INTO users (role, email, full_name, hashed_password, is_active)
VALUES (
    'admin',
    'admin@shg.com',
    'System Administrator',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS.sLR1Iu', -- password: admin123
    TRUE
);

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Default Admin Credentials:';
    RAISE NOTICE '  Email: admin@shg.com';
    RAISE NOTICE '  Password: admin123';
    RAISE NOTICE '';
    RAISE NOTICE 'IMPORTANT: Change the default password after first login!';
    RAISE NOTICE '============================================';
END $$;
