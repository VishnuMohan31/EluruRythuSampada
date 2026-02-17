# 🏛 SWAYAM ELURU MARKET PLACE - COMPLETE APPLICATION FLOW

## **OVERVIEW OF THE SYSTEM**

This is a **government-backed tribal products communication platform** for Andhra Pradesh. It's NOT an e-commerce site - there's NO payment processing. It's purely a platform to connect buyers with tribal vendors.

---

## **1. USER ROLES & HIERARCHY**

### **Role Hierarchy (Top to Bottom):**
```
ADMIN (Highest Authority)
    ↓
SUPER ADMIN (Content Manager)
    ↓
BUYER (Registered User)
    ↓
GUEST (Anonymous Visitor)
```

---

## **2. DETAILED FLOW FOR EACH USER ROLE**

### **🔴 ADMIN FLOW (Full System Control)**

**Who is Admin?**
- Government officials with highest authority
- Only 1-2 admins typically exist
- Created manually in database (not through UI)

**What Admin Can Do:**

#### **A. Manage Super Admins**
1. Admin logs in at `/admin/login`
2. Goes to "Manage Super Admins" section
3. Can CREATE new Super Admin accounts:
   - Enter name, email, password
   - Super Admin gets login credentials
4. Can EDIT Super Admin details
5. Can DELETE Super Admin accounts
6. Can view all Super Admin activities in audit logs

#### **B. System Configuration**
1. **Branding Configuration:**
   - Change application name (currently "Swayam Eluru Market Place")
   - Upload new logo (stored in S3)
   - Set default theme for new visitors

2. **Category Management:**
   - Create product categories (e.g., Handicrafts, Textiles, Pottery)
   - Create subcategories under each category
   - Edit/Delete categories
   - All products must belong to a category

3. **Content Management:**
   - Edit header content (HTML supported)
   - Edit footer content (HTML supported)
   - Edit Terms & Conditions page
   - Edit Privacy Policy page
   - Edit Disclaimer page
   - **Note:** "Powered by DataLegos" footer is FIXED and cannot be removed

4. **Theme Management:**
   - Set default theme from 6 available themes:
     - Government Heritage
     - Tribal Earth
     - Modern Marketplace
     - Vibrant Festival
     - Eco Sustainable
     - Dark Theme (Dracula)

#### **C. Analytics & Reports**
1. View complete dashboard with:
   - Total products, tribes, vendors, buyers
   - Product view statistics
   - Vendor contact trends
   - Category performance
2. Export reports as CSV
3. View detailed analytics charts

#### **D. Audit Logs**
1. View ALL actions performed by:
   - Super Admins
   - Other Admins
2. Each log entry shows:
   - Who did what
   - When they did it
   - What was changed (old value → new value)
   - IP address
3. Cannot be deleted (permanent record)

---

### **🟠 SUPER ADMIN FLOW (Content Management)**

**Who is Super Admin?**
- Content managers created by Admin
- Multiple Super Admins can exist
- Manage day-to-day content operations

**What Super Admin Can Do:**

#### **A. Tribe Management**
1. Super Admin logs in at `/super-admin/login`
2. Goes to "Manage Tribes" section
3. **Create New Tribe:**
   - Enter tribe name (e.g., "Lambadi", "Toda", "Chenchu")
   - Select state (Andhra Pradesh)
   - Add description about the tribe
   - Upload tribe image (stored in S3)
   - Save → Tribe gets unique ID (e.g., TRB001)
4. **Edit Tribe:**
   - Update any tribe details
   - Change image
5. **Delete Tribe (Soft Delete):**
   - Tribe is marked as inactive (is_active = FALSE)
   - Not actually deleted from database
   - Can be restored later
   - Tracks who deleted it and when

#### **B. Vendor Management**
1. Goes to "Manage Vendors" section
2. **Register New Vendor:**
   - Enter vendor name
   - Select which tribe they belong to
   - Enter phone number (required)
   - Enter email (optional)
   - Status starts as "Pending"
3. **Approve/Reject Vendor:**
   - Review vendor details
   - Click "Approve" → Vendor becomes active
   - Click "Reject" → Vendor cannot be contacted
4. **Edit Vendor:**
   - Update contact details
   - Change tribe association
5. **Delete Vendor (Soft Delete):**
   - Vendor marked inactive
   - Their products also become inactive

#### **C. Product Management**
1. Goes to "Manage Products" section
2. **Create New Product:**
   - Enter product name (e.g., "Bamboo Tokri", "Toda Poothkuli")
   - Select category (e.g., Handicrafts)
   - Select subcategory (e.g., Baskets)
   - Select tribe
   - Select vendor
   - Write description (10-5000 characters)
   - Upload multiple images (max 5MB each, JPEG/PNG/WebP)
   - Add YouTube link (optional)
   - Add Instagram link (optional)
   - Set status: Draft/Pending/Approved/Rejected
3. **Product Status Flow:**
   ```
   Draft → Pending → Approved (visible to public)
                  → Rejected (not visible)
   ```
4. **Edit Product:**
   - Update any product details
   - Add/remove images
   - Change status
5. **Delete Product (Soft Delete):**
   - Product marked inactive
   - Not visible to public
   - Can be restored

#### **D. Category Management**
1. Goes to "Manage Categories" section
2. Create/Edit/Delete categories
3. Create/Edit/Delete subcategories
4. Link subcategories to parent categories

#### **E. Analytics & Reports**
1. View dashboard with:
   - Product statistics
   - Vendor contact trends
   - Most viewed products
   - Most contacted products
2. Export reports

---

### **🟢 BUYER FLOW (Registered User)**

**Who is Buyer?**
- Anyone who wants to contact vendors
- Light registration (no password needed)
- Registration happens when first contacting a vendor

**Complete Buyer Journey:**

#### **Step 1: Browsing (As Guest)**
1. Buyer visits homepage at `/`
2. Sees:
   - Hero banner with tribal heritage message
   - Browse by Category section (8 categories with images)
   - Top Viewed Products (4 products)
   - Most Contacted Products (4 products)
   - Recently Added Products (4 products)
   - Tribal Heritage section (3 images)

#### **Step 2: Exploring Products**
1. Clicks on a category (e.g., "Handicrafts")
2. Redirected to `/products?category=1`
3. Products page shows:
   - All products in that category
   - Filters on left side:
     - Category dropdown
     - Subcategory dropdown
     - Tribe dropdown
     - State dropdown
   - Search bar at top
   - Product grid (4 columns on desktop)

#### **Step 3: Viewing Product Details**
1. Clicks on a product card
2. Redirected to `/products/:id`
3. Product detail page shows:
   - Product images (carousel if multiple)
   - Product name
   - Category & Subcategory
   - Tribe name
   - Description
   - YouTube video (if available)
   - Instagram link (if available)
   - View count (auto-incremented)
   - **"Contact Vendor" button** (prominent)

#### **Step 4: Contacting Vendor (Registration Happens Here)**
1. Clicks "Contact Vendor" button
2. **If NOT registered yet:**
   - Registration modal appears
   - Form fields:
     - Name (required)
     - Email (required)
     - Location (required)
     - Phone (optional)
     - CAPTCHA (to prevent bots)
   - Submits form
   - Buyer information saved to database
   - Buyer gets unique ID (e.g., BYR001)

3. **If ALREADY registered:**
   - System recognizes buyer (via browser localStorage or session)
   - Form auto-fills with saved information
   - Buyer can update details if needed

4. **After Registration/Confirmation:**
   - System checks rate limit (10 contacts per hour per IP)
   - If within limit:
     - Contact log created in database
     - Email sent to buyer with vendor contact details:
       ```
       Vendor Name: [Name]
       Phone: [Phone]
       Email: [Email]
       Product: [Product Name]
       ```
     - Success message shown
     - Buyer can now call/email vendor directly
   - If rate limit exceeded:
     - Error message: "You've reached the maximum contacts per hour. Please try again later."

#### **Step 5: Future Visits**
1. Buyer returns to site
2. System recognizes them (localStorage)
3. Can contact vendors immediately (no re-registration)
4. Information auto-fills on contact forms

**Important Notes for Buyers:**
- NO password-based login
- NO user dashboard
- NO order history (because no orders - it's not e-commerce)
- Just browse → contact → done
- All contacts tracked for analytics

---

### **⚪ GUEST FLOW (Anonymous Visitor)**

**Who is Guest?**
- Anyone visiting the site without registering
- Can browse everything but cannot contact vendors

**What Guest Can Do:**

1. **Browse Homepage:**
   - View all sections
   - See featured products
   - Browse categories

2. **View Products:**
   - Access products page
   - Use filters and search
   - View product details
   - See product images and descriptions

3. **View Information Pages:**
   - About page
   - Terms & Conditions
   - Privacy Policy
   - Disclaimer

**What Guest CANNOT Do:**
- Contact vendors (must register first)
- Save favorites (no such feature)
- Leave reviews (no such feature)

**Guest to Buyer Conversion:**
- Happens automatically when clicking "Contact Vendor"
- One-time registration
- No password needed

---

## **3. DATA FLOW & RELATIONSHIPS**

### **Database Relationships:**

```
ADMIN
  ↓ creates
SUPER ADMIN
  ↓ creates
TRIBE ←→ VENDOR ←→ PRODUCT
         ↓           ↓
      CATEGORY   BUYER
         ↓           ↓
    SUBCATEGORY  CONTACT_LOG
```

### **Detailed Relationships:**

1. **Admin → Super Admin:**
   - One Admin can create many Super Admins
   - Super Admin belongs to one Admin (created_by)

2. **Tribe → Vendor:**
   - One Tribe can have many Vendors
   - One Vendor belongs to one Tribe

3. **Vendor → Product:**
   - One Vendor can have many Products
   - One Product belongs to one Vendor

4. **Tribe → Product:**
   - One Tribe can have many Products
   - One Product belongs to one Tribe

5. **Category → Product:**
   - One Category can have many Products
   - One Product belongs to one Category

6. **Category → Subcategory:**
   - One Category can have many Subcategories
   - One Subcategory belongs to one Category

7. **Buyer → Contact Log:**
   - One Buyer can have many Contact Logs
   - One Contact Log belongs to one Buyer

8. **Product → Contact Log:**
   - One Product can have many Contact Logs
   - One Contact Log belongs to one Product

9. **Vendor → Contact Log:**
   - One Vendor can have many Contact Logs
   - One Contact Log belongs to one Vendor

---

## **4. COMPLETE USER JOURNEY EXAMPLES**

### **Example 1: New Product Addition Flow**

1. **Super Admin creates Tribe:**
   - Logs in → Manage Tribes → Add New
   - Name: "Lambadi"
   - State: "Andhra Pradesh"
   - Description: "Traditional tribal community..."
   - Upload image
   - Save → TRB001 created

2. **Super Admin registers Vendor:**
   - Manage Vendors → Add New
   - Name: "Rajesh Kumar"
   - Tribe: Lambadi (TRB001)
   - Phone: 9876543210
   - Email: rajesh@example.com
   - Status: Pending
   - Save → VND001 created

3. **Super Admin approves Vendor:**
   - View vendor list
   - Click "Approve" on Rajesh Kumar
   - Status changes to "Approved"

4. **Super Admin adds Product:**
   - Manage Products → Add New
   - Name: "Lambadi Haar"
   - Category: Jewellery
   - Subcategory: Necklaces
   - Tribe: Lambadi
   - Vendor: Rajesh Kumar
   - Description: "Traditional Lambadi necklace..."
   - Upload 3 images
   - YouTube: [link]
   - Status: Approved
   - Save → PRD001 created

5. **Product goes live:**
   - Immediately visible on public site
   - Appears in Jewellery category
   - Shows in "Recently Added Products"
   - Searchable by name

### **Example 2: Buyer Contacts Vendor Flow**

1. **Guest browses site:**
   - Visits homepage
   - Clicks "Jewellery" category
   - Sees "Lambadi Haar" product

2. **Guest views product:**
   - Clicks on product card
   - Views product details
   - Likes the product
   - Clicks "Contact Vendor"

3. **Registration modal appears:**
   - Guest fills form:
     - Name: "Priya Sharma"
     - Email: "priya@example.com"
     - Location: "Hyderabad"
     - Phone: "9123456789"
   - Completes CAPTCHA
   - Submits

4. **System processes:**
   - Creates Buyer record (BYR001)
   - Checks rate limit (OK - first contact)
   - Creates Contact Log:
     - buyer_id: BYR001
     - product_id: PRD001
     - vendor_id: VND001
     - timestamp: 2026-02-16 10:30:00
     - ip_address: 192.168.1.1
   - Sends email to priya@example.com:
     ```
     Subject: Vendor Contact Details for Lambadi Haar
     
     Dear Priya,
     
     Here are the vendor contact details:
     
     Vendor: Rajesh Kumar
     Phone: 9876543210
     Email: rajesh@example.com
     Product: Lambadi Haar
     
     Please contact the vendor directly for inquiries.
     
     Thank you,
     Swayam Eluru Market Place
     ```

5. **Priya contacts vendor:**
   - Calls Rajesh on 9876543210
   - Discusses product details
   - Negotiates price (outside platform)
   - Arranges delivery (outside platform)
   - Makes payment (outside platform - cash/UPI/bank transfer)

6. **Analytics tracked:**
   - Product view count: +1
   - Vendor contact count: +1
   - Category traction: Jewellery +1
   - Buyer location: Hyderabad +1

### **Example 3: Admin Configuration Flow**

1. **Admin wants to rebrand:**
   - Logs in → System Configuration
   - Changes app name to "Tribal Connect AP"
   - Uploads new logo
   - Sets default theme to "Tribal Earth"
   - Saves

2. **Changes reflect immediately:**
   - All pages show new name
   - New logo appears in header
   - New visitors see Tribal Earth theme
   - Existing users keep their chosen theme

3. **Admin adds new category:**
   - Configuration → Categories
   - Add Category: "Natural Products"
   - Add Subcategories:
     - Honey
     - Herbs
     - Spices
   - Save

4. **Super Admin can now:**
   - Create products in "Natural Products" category
   - Select subcategories (Honey/Herbs/Spices)

---

## **5. SECURITY & RATE LIMITING FLOW**

### **Rate Limiting Example:**

**Scenario:** Buyer tries to contact 15 vendors in 1 hour

1. **Contacts 1-10:** ✅ Successful
   - Each contact logged
   - Vendor details sent via email

2. **Contact 11:** ❌ Blocked
   - System checks: 10 contacts in last hour from IP 192.168.1.1
   - Error message: "Rate limit exceeded. Please try again after [time]."
   - Contact NOT logged
   - Email NOT sent

3. **After 1 hour:**
   - Rate limit resets
   - Buyer can contact vendors again

### **Security Measures:**

1. **Authentication:**
   - Admin/Super Admin: JWT tokens (15-minute expiry)
   - Buyer: No authentication (light registration only)

2. **Authorization:**
   - Admin can access `/admin/*` routes
   - Super Admin can access `/super-admin/*` routes
   - Buyer can access `/products/*` routes
   - Guest can access public routes only

3. **Data Protection:**
   - All passwords hashed with bcrypt
   - HTTPS enforced (no HTTP)
   - SQL injection prevented (ORM)
   - XSS protection (input sanitization)
   - CSRF tokens on forms

4. **S3 Security:**
   - Private bucket (not public)
   - IAM role access only
   - Signed URLs for image access
   - Server-side encryption

---

## **6. ANALYTICS & REPORTING FLOW**

### **What Gets Tracked:**

1. **Product Views:**
   - Every time someone views product detail page
   - View count incremented
   - Stored in product_views table

2. **Vendor Contacts:**
   - Every successful contact logged
   - Stored in contact_logs table
   - Includes: buyer, product, vendor, timestamp, IP

3. **Buyer Information:**
   - Name, email, location, phone
   - Used for analytics (location distribution)
   - Used for autofill on future contacts

### **Admin Dashboard Shows:**

1. **Overview Cards:**
   - Total Products: 156
   - Total Tribes: 12
   - Total Vendors: 45
   - Total Buyers: 1,234
   - Total Contacts: 3,456

2. **Charts:**
   - Product views over time (line chart)
   - Products by category (pie chart)
   - Vendor contacts trend (line chart)
   - Buyer location distribution (bar chart)

3. **Top Lists:**
   - Top 10 most viewed products
   - Top 10 most contacted products
   - Most active vendors
   - Most popular categories

4. **Export Reports:**
   - CSV download with all contact logs
   - Filterable by date range
   - Includes buyer details, product, vendor

---

## **7. SOFT DELETE FLOW**

### **Why Soft Delete?**
- Government requirement: Never permanently delete data
- Audit trail: Track who deleted what and when
- Recovery: Can restore deleted items

### **How It Works:**

**Example: Deleting a Product**

1. **Super Admin deletes product:**
   - Clicks "Delete" on product PRD001
   - Confirmation dialog appears
   - Confirms deletion

2. **System updates database:**
   ```sql
   UPDATE products
   SET is_active = FALSE,
       deleted_at = '2026-02-16 10:30:00',
       deleted_by = 'SA001'
   WHERE id = 'PRD001'
   ```

3. **Product becomes invisible:**
   - Not shown on public site
   - Not in search results
   - Not in product listings

4. **But still in database:**
   - Admin can view deleted products
   - Can restore if needed
   - Audit log shows deletion

5. **Cascade Effect:**
   - If Vendor deleted → All their products become inactive
   - If Tribe deleted → All vendors and products become inactive
   - If Category deleted → All products in that category become inactive

---

## **8. MULTI-LANGUAGE FLOW**

### **Language Support:**

1. **Available Languages:**
   - English (default)
   - Telugu

2. **What Gets Translated:**
   - UI labels (buttons, menus, headings)
   - Navigation items
   - Form labels
   - Error messages
   - System messages

3. **What Doesn't Get Translated:**
   - Product names (as entered by Super Admin)
   - Product descriptions (as entered)
   - Tribe names
   - Vendor names
   - User-generated content

### **User Experience:**

1. **First Visit:**
   - Site loads in English (default)
   - Language switcher in header

2. **Switching Language:**
   - User clicks "తెలుగు" button
   - All UI elements change to Telugu
   - Content remains in original language
   - Preference saved in localStorage

3. **Future Visits:**
   - Site loads in last selected language
   - User can switch anytime

---

## **9. THEME SYSTEM FLOW**

### **6 Available Themes:**

1. **Government Heritage** - Traditional government colors (blue, gold)
2. **Tribal Earth** - Earthy tones (brown, green, orange)
3. **Modern Marketplace** - Clean, contemporary (white, gray, blue)
4. **Vibrant Festival** - Bright colors (red, yellow, purple)
5. **Eco Sustainable** - Green theme (various greens)
6. **Dark Theme (Dracula)** - Dark mode (dark gray, purple accents)

### **Theme Flow:**

1. **Admin sets default:**
   - Configuration → Set default theme: "Tribal Earth"
   - All new visitors see this theme

2. **User visits site:**
   - Sees Tribal Earth theme (default)
   - Theme switcher in header

3. **User changes theme:**
   - Clicks theme icon
   - Selects "Dark Theme"
   - Entire site changes to dark mode
   - Preference saved in localStorage

4. **Future visits:**
   - Site loads in Dark Theme (user's choice)
   - Overrides default theme

---

## **10. BACKUP & DISASTER RECOVERY FLOW**

### **Automated Backup:**

1. **Every Sunday at 2 AM:**
   - Backup service runs (Docker container)
   - Creates PostgreSQL dump
   - Compresses to .sql.gz
   - Uploads to S3 backup bucket
   - Deletes backups older than 5 weeks

2. **Backup Contents:**
   - All database tables
   - All data (products, vendors, tribes, buyers, contacts)
   - Audit logs
   - System configuration

3. **Backup Naming:**
   ```
   backup_2026-02-16_02-00-00.sql.gz
   ```

### **Restore Process:**

1. **If disaster occurs:**
   - Admin runs restore script
   - Selects backup file from S3
   - Downloads and extracts
   - Restores to PostgreSQL
   - Verifies data integrity

2. **Data Loss:**
   - Maximum 7 days of data loss (weekly backups)
   - All data before last Sunday is safe

---

## **11. TECHNICAL ARCHITECTURE OVERVIEW**

### **Frontend Architecture:**
```
React Application
├── Public Pages (Guest/Buyer)
│   ├── HomePage
│   ├── ProductsPage (with filters)
│   ├── ProductDetailPage
│   ├── AboutPage
│   └── Legal Pages (Terms, Privacy, Disclaimer)
├── Admin Dashboard
│   ├── Dashboard (Analytics)
│   ├── Manage Super Admins
│   ├── System Configuration
│   ├── Audit Logs
│   └── Reports
└── Super Admin Dashboard
    ├── Dashboard (Analytics)
    ├── Manage Tribes
    ├── Manage Vendors
    ├── Manage Products
    ├── Manage Categories
    └── Reports
```

### **Backend Architecture:**
```
FastAPI Application
├── Authentication (JWT)
├── API Routes
│   ├── /auth (login, logout)
│   ├── /products (CRUD)
│   ├── /tribes (CRUD)
│   ├── /vendors (CRUD)
│   ├── /categories (CRUD)
│   ├── /buyers (registration, contact)
│   ├── /analytics (dashboard data)
│   └── /config (system settings)
├── Database (PostgreSQL)
│   ├── users (Admin, Super Admin)
│   ├── tribes
│   ├── vendors
│   ├── products
│   ├── categories
│   ├── subcategories
│   ├── buyers
│   ├── contact_logs
│   ├── product_views
│   ├── audit_logs
│   └── system_config
└── Storage (AWS S3)
    ├── Product Images
    ├── Tribe Images
    ├── Logo Images
    └── Database Backups
```

---

## **12. API ENDPOINTS OVERVIEW**

### **Authentication Endpoints:**
- `POST /api/auth/login` - Admin/Super Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### **Product Endpoints:**
- `GET /api/products` - List all products (with filters)
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (Super Admin)
- `PUT /api/products/{id}` - Update product (Super Admin)
- `DELETE /api/products/{id}` - Soft delete product (Super Admin)

### **Tribe Endpoints:**
- `GET /api/tribes` - List all tribes
- `GET /api/tribes/{id}` - Get tribe details
- `POST /api/tribes` - Create tribe (Super Admin)
- `PUT /api/tribes/{id}` - Update tribe (Super Admin)
- `DELETE /api/tribes/{id}` - Soft delete tribe (Super Admin)

### **Vendor Endpoints:**
- `GET /api/vendors` - List all vendors
- `GET /api/vendors/{id}` - Get vendor details
- `POST /api/vendors` - Create vendor (Super Admin)
- `PUT /api/vendors/{id}` - Update vendor (Super Admin)
- `PUT /api/vendors/{id}/approve` - Approve vendor (Super Admin)
- `DELETE /api/vendors/{id}` - Soft delete vendor (Super Admin)

### **Category Endpoints:**
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (Admin/Super Admin)
- `PUT /api/categories/{id}` - Update category (Admin/Super Admin)
- `DELETE /api/categories/{id}` - Delete category (Admin/Super Admin)

### **Buyer & Contact Endpoints:**
- `POST /api/buyers/register` - Register buyer (light registration)
- `POST /api/buyers/contact-vendor` - Contact vendor (creates log, sends email)
- `GET /api/contact-logs` - Get all contact logs (Admin/Super Admin)

### **Analytics Endpoints:**
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/product-views` - Product view trends
- `GET /api/analytics/contacts` - Contact trends
- `GET /api/analytics/top-products` - Most viewed/contacted products

### **Configuration Endpoints:**
- `GET /api/config` - Get system configuration
- `PUT /api/config/branding` - Update branding (Admin)
- `PUT /api/config/content` - Update content pages (Admin)
- `PUT /api/config/theme` - Update default theme (Admin)

### **User Management Endpoints:**
- `GET /api/users` - List Super Admins (Admin only)
- `POST /api/users` - Create Super Admin (Admin only)
- `PUT /api/users/{id}` - Update Super Admin (Admin only)
- `DELETE /api/users/{id}` - Delete Super Admin (Admin only)

### **Audit Log Endpoints:**
- `GET /api/audit-logs` - Get audit logs (Admin only)
- `GET /api/audit-logs/export` - Export audit logs as CSV (Admin only)

---

## **13. DATABASE SCHEMA OVERVIEW**

### **users Table:**
```
id (PK, string) - "ADM001", "SA001"
email (unique)
password_hash
full_name
role (Admin/SuperAdmin)
is_active
created_at
updated_at
```

### **tribes Table:**
```
id (PK, string) - "TRB001"
name
state
description
image_url (S3)
is_active
deleted_at
deleted_by
created_at
created_by
updated_at
updated_by
```

### **vendors Table:**
```
id (PK, string) - "VND001"
name
tribe_id (FK)
phone
email
status (Pending/Approved/Rejected)
is_active
deleted_at
deleted_by
created_at
created_by
updated_at
updated_by
```

### **products Table:**
```
id (PK, string) - "PRD001"
name
category_id (FK)
subcategory_id (FK)
tribe_id (FK)
vendor_id (FK)
description
images (JSON array of S3 URLs)
youtube_link
instagram_link
status (Draft/Pending/Approved/Rejected)
view_count
is_active
deleted_at
deleted_by
created_at
created_by
updated_at
updated_by
```

### **categories Table:**
```
id (PK, integer)
name
description
image_url (S3)
created_at
updated_at
```

### **subcategories Table:**
```
id (PK, integer)
category_id (FK)
name
created_at
updated_at
```

### **buyers Table:**
```
id (PK, string) - "BYR001"
name
email
location
phone
created_at
```

### **contact_logs Table:**
```
id (PK, integer)
buyer_id (FK)
product_id (FK)
vendor_id (FK)
ip_address
created_at
```

### **product_views Table:**
```
id (PK, integer)
product_id (FK)
session_id
ip_address
created_at
```

### **audit_logs Table:**
```
id (PK, integer)
user_id (FK)
action_type (CREATE/UPDATE/DELETE)
resource_type (Product/Vendor/Tribe/etc)
resource_id
old_value (JSON)
new_value (JSON)
ip_address
created_at
```

### **system_config Table:**
```
id (PK, integer)
key (unique)
value (JSON)
updated_at
updated_by
```

---

## **14. DEPLOYMENT FLOW**

### **Deployment Architecture:**
```
Hostinger VPS (Ubuntu 22.04)
├── Docker Containers
│   ├── frontend (React - Nginx)
│   ├── backend (FastAPI)
│   ├── postgres (PostgreSQL)
│   ├── nginx (Reverse Proxy + SSL)
│   └── backup-service (Python cron)
├── AWS S3
│   ├── Images Bucket (private)
│   └── Backups Bucket (private)
└── Let's Encrypt SSL
```

### **Deployment Steps:**

1. **Server Setup:**
   - Install Docker & Docker Compose
   - Configure firewall (ports 80, 443)
   - Setup IAM role for S3 access

2. **Application Deployment:**
   - Clone repository
   - Configure environment variables
   - Build Docker images
   - Start containers with docker-compose

3. **SSL Configuration:**
   - Install Certbot
   - Generate SSL certificate
   - Configure Nginx for HTTPS
   - Setup auto-renewal

4. **Database Setup:**
   - Run Alembic migrations
   - Create initial Admin user
   - Seed initial data (categories)

5. **Backup Configuration:**
   - Setup backup cron job
   - Test backup/restore process
   - Configure S3 bucket policies

6. **Monitoring:**
   - Setup health check endpoint
   - Configure logging
   - Setup alerts for failures

---

## **15. WHAT'S CURRENTLY IMPLEMENTED**

### **✅ Frontend (Completed):**
1. **Public Pages:**
   - Homepage with all sections
   - Products page with filters
   - Product detail page
   - About page
   - Terms, Privacy, Disclaimer pages

2. **Admin Dashboard:**
   - Login page
   - Dashboard with stats
   - Manage Super Admins page
   - System Configuration page
   - Audit Logs page
   - Reports page

3. **Super Admin Dashboard:**
   - Login page
   - Dashboard with stats
   - Manage Tribes page
   - Manage Vendors page
   - Manage Products page
   - Manage Categories page
   - Reports page

4. **Features:**
   - Responsive design (mobile/tablet/desktop)
   - Theme system (6 themes)
   - Language switcher (English/Telugu)
   - Navigation with active states
   - Sidebar layouts for admin panels
   - Mock data for demonstration

### **✅ Backend (Completed):**
1. **Database Models:**
   - User model (Admin/Super Admin)
   - Product model
   - Category model
   - Tribe model
   - Vendor model
   - Inquiry model (contact logs)
   - Analytics model
   - SystemConfig model

2. **API Routes:**
   - Authentication routes (login, logout, get user)
   - Product routes (CRUD)
   - Category routes (CRUD)
   - Tribe routes (CRUD)
   - Vendor routes (CRUD)
   - User routes (CRUD for Super Admins)
   - Inquiry routes (contact vendor)

3. **Security:**
   - JWT authentication
   - Password hashing (bcrypt)
   - Role-based access control
   - CORS configuration

4. **Database:**
   - SQLAlchemy ORM setup
   - Pydantic schemas for validation
   - Database configuration

---

## **16. WHAT NEEDS TO BE IMPLEMENTED**

### **🔴 High Priority - Backend:**

1. **S3 Integration:**
   - Image upload functionality
   - Signed URL generation
   - IAM role configuration
   - Image compression/resizing

2. **Email Service:**
   - SMTP configuration
   - Email templates
   - Send vendor contact details to buyers
   - Email notifications

3. **Rate Limiting:**
   - IP-based rate limiting middleware
   - 10 contacts per hour per IP
   - Rate limit tracking in database

4. **CAPTCHA Integration:**
   - Google reCAPTCHA or similar
   - Verify CAPTCHA on buyer registration
   - Prevent bot submissions

5. **Soft Delete Implementation:**
   - Update all delete operations to soft delete
   - Filter queries by is_active
   - Cascade soft delete logic

6. **Analytics Implementation:**
   - Product view tracking
   - Contact log aggregation
   - Dashboard statistics calculation
   - Report generation (CSV export)

7. **Audit Logging:**
   - Middleware to log all admin actions
   - Track old/new values
   - Store IP addresses

8. **Search Functionality:**
   - PostgreSQL ILIKE search
   - Search across product name, description
   - Optimize with indexes

9. **Backup Service:**
   - Docker container for backups
   - Cron job configuration
   - pg_dump automation
   - S3 upload
   - Old backup cleanup

### **🟠 High Priority - Frontend:**

1. **API Integration:**
   - Replace mock data with real API calls
   - Axios interceptors for auth
   - Error handling
   - Loading states

2. **Form Implementations:**
   - All CRUD forms (Tribes, Vendors, Products, Categories)
   - Form validation
   - Image upload UI
   - Multi-image upload for products

3. **Buyer Registration Flow:**
   - Contact vendor modal
   - Registration form
   - CAPTCHA integration
   - Success/error messages

4. **Authentication Flow:**
   - Login functionality
   - Token storage
   - Auto-logout on token expiry
   - Protected routes

5. **Analytics Dashboard:**
   - Charts implementation (Chart.js)
   - Real-time data display
   - Export functionality

6. **Search & Filters:**
   - Product search implementation
   - Filter dropdowns (category, tribe, state)
   - URL parameter handling
   - Clear filters option

7. **Image Handling:**
   - Image upload component
   - Image preview
   - Multiple image upload
   - Image carousel for product details

8. **Pagination:**
   - Product listing pagination
   - Infinite scroll or page numbers
   - Items per page selector

### **🟡 Medium Priority:**

1. **Internationalization:**
   - Complete Telugu translations
   - i18next configuration
   - Translation files for all UI elements

2. **Theme Implementation:**
   - Complete all 6 theme CSS
   - Theme switcher UI
   - localStorage persistence
   - Smooth transitions

3. **Accessibility:**
   - ARIA labels
   - Keyboard navigation
   - Focus indicators
   - Screen reader testing

4. **Performance Optimization:**
   - Lazy loading images
   - Code splitting
   - Bundle optimization
   - Caching strategies

5. **Error Handling:**
   - Global error boundary
   - User-friendly error messages
   - Retry mechanisms
   - Offline detection

### **🟢 Low Priority:**

1. **Documentation:**
   - API documentation (Swagger)
   - User manuals
   - Deployment guide
   - Troubleshooting guide

2. **Testing:**
   - Unit tests
   - Integration tests
   - E2E tests
   - Load testing

3. **Monitoring:**
   - Application monitoring
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

4. **DevOps:**
   - CI/CD pipeline
   - Automated deployments
   - Environment management
   - Rollback procedures

---

## **17. ESTIMATED WORK BREAKDOWN**

### **Backend Remaining Work:**
- S3 Integration: 2-3 days
- Email Service: 1-2 days
- Rate Limiting: 1 day
- CAPTCHA: 1 day
- Soft Delete: 2 days
- Analytics: 2-3 days
- Audit Logging: 1-2 days
- Search: 1 day
- Backup Service: 2 days
- Testing & Bug Fixes: 3-4 days

**Total Backend: ~15-20 days**

### **Frontend Remaining Work:**
- API Integration: 3-4 days
- All CRUD Forms: 4-5 days
- Buyer Registration Flow: 2 days
- Authentication Flow: 2 days
- Analytics Dashboard: 2-3 days
- Search & Filters: 2 days
- Image Handling: 2-3 days
- Pagination: 1 day
- Internationalization: 2-3 days
- Theme Implementation: 2-3 days
- Accessibility: 2 days
- Error Handling: 1-2 days
- Testing & Bug Fixes: 3-4 days

**Total Frontend: ~25-35 days**

### **Deployment & DevOps:**
- Server Setup: 1 day
- Docker Configuration: 1 day
- SSL Setup: 1 day
- Database Migration: 1 day
- Backup Configuration: 1 day
- Monitoring Setup: 1 day
- Documentation: 2-3 days

**Total DevOps: ~8-10 days**

### **GRAND TOTAL: ~48-65 days**

This is approximately **2-3 months** of development work for a single developer, or **1-1.5 months** with a small team (2-3 developers).

---

## **18. CRITICAL SUCCESS FACTORS**

### **Must-Have Features for Launch:**

1. ✅ **User Authentication** (Admin/Super Admin login)
2. ✅ **Product Management** (CRUD operations)
3. ✅ **Tribe Management** (CRUD operations)
4. ✅ **Vendor Management** (CRUD operations)
5. ❌ **Buyer Registration & Contact Flow** (NOT YET IMPLEMENTED)
6. ❌ **Email Notifications** (NOT YET IMPLEMENTED)
7. ❌ **Rate Limiting** (NOT YET IMPLEMENTED)
8. ❌ **S3 Image Storage** (NOT YET IMPLEMENTED)
9. ✅ **Product Display & Filtering** (Frontend ready, needs API)
10. ❌ **Analytics Dashboard** (Partial - needs real data)
11. ❌ **Soft Delete** (NOT YET IMPLEMENTED)
12. ❌ **Audit Logging** (NOT YET IMPLEMENTED)
13. ✅ **Responsive Design** (COMPLETED)
14. ❌ **Multi-Language Support** (Partial - needs translations)
15. ❌ **Theme System** (Partial - needs all themes)

### **Launch Readiness: ~40%**

**Frontend:** ~70% complete (UI done, needs API integration)
**Backend:** ~50% complete (Basic CRUD done, needs advanced features)
**DevOps:** ~0% complete (Not started)

---

## **19. NEXT STEPS RECOMMENDATION**

### **Phase 1: Core Functionality (Weeks 1-2)**
1. Implement S3 integration for image uploads
2. Complete buyer registration and contact vendor flow
3. Implement email service for vendor contact details
4. Add rate limiting middleware
5. Integrate CAPTCHA

### **Phase 2: Data Management (Weeks 3-4)**
1. Implement soft delete across all entities
2. Add audit logging for all admin actions
3. Implement product search functionality
4. Complete analytics dashboard with real data
5. Add pagination to product listings

### **Phase 3: Frontend Integration (Weeks 5-6)**
1. Replace all mock data with API calls
2. Implement all CRUD forms
3. Add authentication flow
4. Implement image upload UI
5. Complete search and filter functionality

### **Phase 4: Polish & Testing (Weeks 7-8)**
1. Complete internationalization (Telugu translations)
2. Implement all 6 themes
3. Accessibility improvements
4. Performance optimization
5. Comprehensive testing
6. Bug fixes

### **Phase 5: Deployment (Week 9)**
1. Server setup and configuration
2. Docker deployment
3. SSL certificate setup
4. Database migration
5. Backup service configuration
6. Monitoring setup
7. Documentation

### **Phase 6: Launch & Support (Week 10+)**
1. Production deployment
2. User training
3. Monitoring and support
4. Bug fixes and improvements
5. Feature enhancements based on feedback

---

## **20. CONCLUSION**

The Swayam Eluru Market Place is a well-designed government platform with clear requirements and a solid foundation. The current implementation has completed the basic structure for both frontend and backend, but significant work remains to make it production-ready.

**Key Strengths:**
- Clear requirements and scope
- Simple, maintainable architecture
- Government-compliant design
- Responsive UI already implemented
- Basic CRUD operations in place

**Key Challenges:**
- S3 integration and image handling
- Email service configuration
- Rate limiting and security features
- Complete API integration
- Deployment and DevOps setup

**Recommendation:**
Focus on Phase 1 (Core Functionality) first, as it includes the most critical features for the platform to function. The buyer registration and contact flow is the heart of the application and should be prioritized.

---

**Document Version**: 1.0  
**Created**: February 16, 2026  
**Last Updated**: February 16, 2026  
**Status**: Complete Application Flow Documentation
