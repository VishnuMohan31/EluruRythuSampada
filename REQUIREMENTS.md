# 🏛 TRIBES INDIA MARKETPLACE PORTAL
## Requirements Specification Document

---

## 1. PROJECT OVERVIEW

### 1.1 Project Information
- **Project Name**: Tribes India Marketplace Portal
- **Initiative**: TRIFED "Tribes Andhra Pradesh" Government Program by Eluru Collector
- **Target Region**: Andhra Pradesh, India
- **Platform Type**: Web Application Only (No Mobile App)

### 1.2 Project Objective
Develop a government-supported web application to promote and showcase tribal products with the following goals:
- Connect buyers with tribal vendors
- Enable communication between buyers and vendors
- Provide analytics for government decision-making
- Support configurable branding for government use
- **NO payment processing** - communication platform only

### 1.3 Core Principles
- Simple, maintainable architecture
- No microservices complexity
- No payment gateway integration
- Clean, accessible UI/UX
- Configurable by government administrators
- Scalable but minimal approach

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 User Roles & Permissions

#### 2.1.1 Admin (Full System Control)
**Capabilities:**
- Create, modify, and delete Super Admin accounts
- Configure application branding (logo, name, colors)
- Configure product categories and subcategories
- Configure header and footer content
- Access complete audit logs
- View all analytics and reports
- Manage system-wide settings
- Set default theme for application

#### 2.1.2 Super Admin (Content Management)
**Capabilities:**
- Register and manage tribes
- Register and manage vendors
- Register and manage products
- Approve or reject product submissions
- Upload and manage product images
- Manage categories and subcategories
- Edit header and footer content
- View analytics and reports

#### 2.1.3 Buyer (Light Registration)
**Registration Fields:**
- Name (required)
- Email (required, no verification needed)
- Location (required)
- Phone (optional)

**Capabilities:**
- Browse all products
- Search and filter products
- Contact vendors for products
- Information stored for analytics and autofill on future visits

**Limitations:**
- No password-based login
- Light registration only when contacting vendor
- Rate limited to 10 vendor contacts per hour per IP

#### 2.1.4 Guest (Anonymous Browsing)
**Capabilities:**
- Browse all approved products
- Search and filter products
- View product details

**Limitations:**
- Cannot contact vendors
- Must register as Buyer to contact vendors

### 2.2 Core Functional Modules

#### 2.2.1 Tribe Management
**Fields:**
- Tribe Name (required)
- State (required)
- Description (optional)
- Tribe Image (uploaded to S3)
- is_active (soft delete flag)
- deleted_at (timestamp)
- deleted_by (admin ID)

**Operations:**
- Create new tribe (Super Admin/Admin)
- Edit tribe details (Super Admin/Admin)
- Soft delete tribe (Super Admin/Admin)
- View tribe list with filters
- Associate vendors with tribes

#### 2.2.2 Vendor Management
**Fields:**
- Vendor Name (required)
- Tribe Reference (foreign key)
- Phone Number (required)
- Email (optional)
- Approval Status (Pending/Approved/Rejected)
- is_active (soft delete flag)
- deleted_at (timestamp)
- deleted_by (admin ID)

**Operations:**
- Register new vendor (Super Admin/Admin)
- Edit vendor details (Super Admin/Admin)
- Approve/reject vendor (Super Admin/Admin)
- Soft delete vendor (Super Admin/Admin)
- View vendor list with filters
- Link vendors to products

#### 2.2.3 Product Management
**Fields:**
- Product Name (required)
- Category (required, foreign key)
- Subcategory (required, foreign key)
- Tribe (required, foreign key)
- Vendor (required, foreign key)
- Description (required)
- Product Images (multiple, stored in S3)
- YouTube Link (optional)
- Instagram Link (optional)
- Status (Draft/Pending/Approved/Rejected)
- View Count (auto-incremented)
- is_active (soft delete flag)
- deleted_at (timestamp)
- deleted_by (admin ID)

**Operations:**
- Create product (Super Admin/Admin)
- Edit product details (Super Admin/Admin)
- Upload multiple images (Super Admin/Admin)
- Change product status (Super Admin/Admin)
- Soft delete product (Super Admin/Admin)
- Track product views automatically
- Display products based on approval status

#### 2.2.4 Product Display & Search
**Guest/Buyer Features:**
- Browse all approved products
- Filter by:
  - Category
  - Subcategory
  - Tribe
  - State
- Search functionality:
  - PostgreSQL ILIKE search
  - Search across product name, description
  - Indexed fields for performance
  - Basic optimized search (no complex full-text)

**Product Card Display:**
- Product image (primary)
- Product name
- Category/Subcategory
- Tribe name
- View count
- "Contact Vendor" button (Buyers only)

#### 2.2.5 Contact Vendor Flow
**User Journey:**
1. Guest browses products
2. Guest clicks "Contact Vendor" on a product
3. Registration form appears (if not already registered):
   - Name
   - Email
   - Location
   - Phone (optional)
   - CAPTCHA verification
4. Upon form submission:
   - Buyer information saved
   - Vendor contact details sent to buyer's email
   - Contact log created in database
5. Rate limiting applied: 10 contacts per hour per IP

**Data Tracked:**
- Buyer ID
- Product ID
- Vendor ID
- Timestamp
- IP Address (for rate limiting)

**Security:**
- CAPTCHA to prevent bots
- Rate limiting per IP
- Email validation
- Input sanitization

### 2.3 Configuration Management

#### 2.3.1 Configurable Elements (Admin/Super Admin)
All stored in `system_config` table:

1. **Application Branding:**
   - Application Name
   - Logo (uploaded to S3)
   - Default Theme

2. **Categories & Subcategories:**
   - Add/Edit/Delete categories
   - Add/Edit/Delete subcategories
   - Link subcategories to categories

3. **Content Pages:**
   - Header Content (HTML supported, sanitized)
   - Footer Content (HTML supported, sanitized)
   - Terms & Conditions Page
   - Privacy Policy Page
   - Disclaimer Page

#### 2.3.2 Fixed Footer (Non-Configurable)
**Mandatory Footer Text:**
```
Powered by DataLegos Tech Solutions Pvt. Ltd.
```
- Small font size
- Displayed at bottom of every page
- Cannot be removed or edited
- Always visible regardless of custom footer content

### 2.4 Multi-Language Support

#### 2.4.1 Supported Languages
- English (default)
- Telugu

#### 2.4.2 Translation Rules
- All UI labels, buttons, navigation: Bilingual (English + Telugu)
- User-generated content (product descriptions, tribe info): Displayed as entered
- No automatic translation of content
- Language preference stored in browser localStorage
- Language switcher available on all pages

#### 2.4.3 Implementation
- Use i18next library
- Translation files for UI elements
- Language toggle in header
- Persistent language selection

### 2.5 Theme System

#### 2.5.1 Available Themes (6 Total)
1. **Government Heritage** - Traditional government colors
2. **Tribal Earth** - Earthy, natural tones
3. **Modern Marketplace** - Clean, contemporary design
4. **Vibrant Festival** - Bright, celebratory colors
5. **Eco Sustainable** - Green, environmental theme
6. **Dark Theme (Dracula)** - Dark mode for accessibility

#### 2.5.2 Theme Behavior
- Theme selection stored in browser localStorage
- Admin can set default theme for new visitors
- Theme switcher available in header/settings
- All themes must maintain WCAG accessibility standards
- Smooth theme transitions

---

## 3. NON-FUNCTIONAL REQUIREMENTS

### 3.1 Performance Requirements
- Page load time: < 3 seconds on 4G connection
- Search results: < 1 second
- Image loading: Progressive/lazy loading
- Database queries: Optimized with proper indexing
- Scalable to handle high traffic during government campaigns

### 3.2 Security Requirements

#### 3.2.1 Authentication & Authorization
- JWT-based authentication
- Short-lived access tokens (15 minutes)
- Refresh token mechanism
- Role-Based Access Control (RBAC)
- Bcrypt password hashing for Admin/Super Admin

#### 3.2.2 Data Security
- HTTPS enforced (no HTTP access)
- Input validation on all forms
- HTML sanitization for user-generated content
- SQL injection prevention (ORM parameterized queries)
- XSS protection
- CSRF protection

#### 3.2.3 S3 Security
- Private S3 bucket
- IAM role-based access (EC2 instance role)
- Bucket policy restricts access to specific IAM role only
- Server-side encryption enabled (AES-256)
- Application cannot access other S3 buckets
- Signed URLs for image access

#### 3.2.4 Rate Limiting
- Vendor contact: 10 per hour per IP
- API endpoints: Configurable rate limits
- Login attempts: 5 per 15 minutes per IP

#### 3.2.5 Audit Logging
- All admin actions logged
- All Super Admin actions logged
- Log fields:
  - User ID
  - Action type
  - Timestamp
  - IP address
  - Resource affected
  - Old value / New value

### 3.3 Availability & Reliability
- 99.5% uptime target
- Health check endpoint for monitoring
- Automated weekly backups
- Disaster recovery plan
- Graceful error handling

### 3.4 Usability Requirements
- Responsive design (mobile, tablet, desktop)
- Accessible (WCAG 2.1 Level AA compliance goal)
- Clear tooltips and guidance messages
- Intuitive navigation for all user roles
- Consistent UI patterns across pages
- Loading indicators for async operations
- Clear error messages

### 3.5 Maintainability
- Clean, documented code
- Modular architecture
- Consistent naming conventions
- Centralized configuration
- Comprehensive logging
- Easy deployment process

---

## 4. TECHNICAL REQUIREMENTS

### 4.1 Technology Stack (Mandatory)

#### 4.1.1 Frontend
- **Framework**: React (latest stable version)
- **Language**: JavaScript/TypeScript
- **Internationalization**: i18next
- **State Management**: React Context API or Redux (if needed)
- **HTTP Client**: Axios
- **Styling**: CSS Modules or Styled Components
- **Form Handling**: React Hook Form
- **Routing**: React Router

#### 4.1.2 Backend
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy
- **Authentication**: JWT (PyJWT)
- **Validation**: Pydantic
- **CORS**: FastAPI CORS middleware
- **Rate Limiting**: slowapi or custom middleware

#### 4.1.3 Database
- **RDBMS**: PostgreSQL (version 14+)
- **Connection Pooling**: SQLAlchemy pool
- **Migrations**: Alembic

#### 4.1.4 Storage
- **Object Storage**: AWS S3
- **Access Method**: IAM role (no access keys)
- **Bucket Type**: Private
- **Encryption**: Server-side (AES-256)

#### 4.1.5 Web Server
- **Reverse Proxy**: NGINX
- **SSL/TLS**: Let's Encrypt (Certbot)
- **HTTP/2**: Enabled

#### 4.1.6 Containerization
- **Container Runtime**: Docker
- **Orchestration**: Docker Compose
- **Services**:
  - frontend (React app)
  - backend (FastAPI)
  - postgres (PostgreSQL)
  - nginx (Reverse proxy)
  - backup-service (Python script)

#### 4.1.7 Deployment Automation
- **Tool**: Ansible
- **Tasks**:
  - Install Docker & Docker Compose
  - Configure NGINX
  - Setup SSL certificates
  - Configure IAM role
  - Setup S3 bucket
  - Deploy containers
  - Setup backup cron job
  - Health verification

#### 4.1.8 Hosting
- **Provider**: Hostinger VPS
- **OS**: Ubuntu 22.04 LTS
- **Requirements**: Minimum 4GB RAM, 2 CPU cores

### 4.2 Database Design Requirements

#### 4.2.1 Primary Key Strategy
- Use sequential auto-incremented integers
- Store as string type in application layer
- Format: "TRB001", "VND001", "PRD001" etc.

#### 4.2.2 Soft Delete Implementation
All tables with user-generated content must include:
- `is_active` (BOOLEAN, default TRUE)
- `deleted_at` (TIMESTAMP, nullable)
- `deleted_by` (STRING, foreign key to user ID)

All queries must filter by `is_active = TRUE` by default.

#### 4.2.3 Audit Trail
- `created_at` (TIMESTAMP, auto)
- `created_by` (STRING, foreign key)
- `updated_at` (TIMESTAMP, auto)
- `updated_by` (STRING, foreign key)

#### 4.2.4 Indexing Strategy
Index the following fields:
- All foreign keys
- Search fields (product name, description)
- Filter fields (category, tribe, status)
- Timestamp fields for analytics

### 4.3 API Design Requirements

#### 4.3.1 Response Format
**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "PRD_404_001",
    "message": "Product not found",
    "details": null
  }
}
```

#### 4.3.2 Error Code Format
```
<MODULE>_<HTTP_STATUS>_<SEQUENCE>
```

Examples:
- `PRD_404_001` - Product not found
- `VND_403_001` - Vendor access denied
- `AUTH_401_001` - Invalid token

#### 4.3.3 Centralized Exception Handling
- All exceptions caught at middleware level
- Structured error responses
- No stack traces in production
- All errors logged with context

### 4.4 Backup & Restore Requirements

#### 4.4.1 Backup Strategy
- **Frequency**: Weekly (every Sunday at 2 AM)
- **Method**: pg_dump
- **Format**: Compressed SQL (.sql.gz)
- **Storage**: Dedicated S3 bucket (separate from images)
- **Retention**: Last 5 backups
- **Auto-pruning**: Delete backups older than 5 weeks

#### 4.4.2 Backup Contents
- Complete PostgreSQL database dump
- All tables including audit logs
- Database schema and data

#### 4.4.3 Restore Process
- Manual restore script provided
- Documented step-by-step process
- Tested restore procedure

#### 4.4.4 Backup Service
- Dockerized Python service
- Cron job scheduled
- Logs backup status
- Alerts on failure

---

## 5. ANALYTICS & REPORTING REQUIREMENTS

### 5.1 Dashboard Metrics (Admin/Super Admin)

#### 5.1.1 Overview Statistics
- Total Products (Approved/Pending/Rejected/Draft)
- Total Tribes (Active)
- Total Vendors (Active/Pending)
- Total Buyers Registered
- Total Vendor Contacts (Today/Week/Month)

#### 5.1.2 Product Analytics
- Top 10 Most Viewed Products
- Product Views Over Time (line chart)
- Products by Category (pie chart)
- Products by Tribe (bar chart)
- Products by State (map visualization)

#### 5.1.3 Engagement Analytics
- Vendor Contact Trends (line chart)
- Category Traction (which categories get most contacts)
- Time-based Engagement (peak hours/days)
- Buyer Location Distribution

#### 5.1.4 Raw Reports
- Complete inquiry report (CSV export)
- Fields: Buyer Name, Email, Phone, Product, Vendor, Timestamp
- Filterable by date range
- Downloadable

### 5.2 Tracking Requirements

#### 5.2.1 Product Views
- Auto-increment view count on product detail page view
- Track unique views per session
- Store in `product_views` table for detailed analytics

#### 5.2.2 Contact Logs
- Every vendor contact logged
- Store in `contact_logs` table
- Fields: buyer_id, product_id, vendor_id, timestamp, ip_address

---

## 6. USER INTERFACE REQUIREMENTS

### 6.1 Navigation Structure

#### 6.1.1 Public Pages (Guest/Buyer)
- Home Page
- Products Listing Page
- Product Detail Page
- About Tribes India
- Terms & Conditions
- Privacy Policy
- Disclaimer

#### 6.1.2 Admin Dashboard Pages
- Dashboard (Analytics)
- Manage Super Admins
- System Configuration
  - Branding
  - Categories
  - Header/Footer
  - Content Pages
- Audit Logs
- Reports

#### 6.1.3 Super Admin Dashboard Pages
- Dashboard (Analytics)
- Manage Tribes
- Manage Vendors
- Manage Products
- Manage Categories
- Reports

### 6.2 Responsive Design Requirements
- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- Touch-friendly buttons (min 44x44px)
- Readable font sizes (min 16px body text)

### 6.3 Accessibility Requirements
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Alt text for all images
- Color contrast ratios (WCAG AA)
- Screen reader friendly

### 6.4 User Guidance
- Clear tooltips on all form fields
- Inline validation messages
- Breadcrumb navigation
- Loading states for async operations
- Empty states with helpful messages
- Success/error notifications (toast messages)

---

## 7. DATA VALIDATION REQUIREMENTS

### 7.1 Input Validation Rules

#### 7.1.1 Email
- Valid email format
- Max length: 255 characters

#### 7.1.2 Phone
- Indian phone number format
- 10 digits
- Optional country code

#### 7.1.3 URLs (YouTube, Instagram)
- Valid URL format
- HTTPS only
- Domain whitelist (youtube.com, instagram.com)

#### 7.1.4 Images
- Formats: JPEG, PNG, WebP
- Max size: 5MB per image
- Max dimensions: 2000x2000px
- Automatic resizing/compression

#### 7.1.5 Text Fields
- Product Name: 3-200 characters
- Description: 10-5000 characters
- Tribe Name: 3-100 characters
- Vendor Name: 3-100 characters

### 7.2 Sanitization
- HTML content (header/footer): Whitelist allowed tags
- User input: Strip dangerous characters
- SQL: Parameterized queries (ORM handles this)

---

## 8. MONITORING & HEALTH CHECK

### 8.1 Health Check Endpoint
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-02-14T10:30:00Z"
}
```

**Checks:**
- Database connection
- Application status
- Response time

### 8.2 Logging Requirements
- Application logs: INFO level in production
- Error logs: All exceptions with stack trace
- Access logs: NGINX access logs
- Audit logs: All admin/super admin actions
- Log rotation: Daily, keep 30 days

---

## 9. OUT OF SCOPE

The following are explicitly NOT included in this project:

- Payment gateway integration
- Real-time chat between buyers and vendors
- AI-based product recommendations
- Mobile application (iOS/Android)
- Microservices architecture
- Kubernetes orchestration
- Complex multi-tenant architecture
- Social media integration (beyond links)
- Email marketing campaigns
- Inventory management
- Order management
- Shipping/logistics integration
- Customer reviews/ratings
- Wishlist functionality
- Advanced analytics (ML/AI)

---

## 10. DELIVERABLES

### 10.1 Code Deliverables
1. Frontend React application (source code)
2. Backend FastAPI application (source code)
3. Database migration scripts (Alembic)
4. Docker configuration files
5. Docker Compose configuration
6. Ansible playbooks for deployment
7. NGINX configuration files
8. Backup/restore scripts

### 10.2 Documentation Deliverables
1. Technical Architecture Document
2. API Documentation (Swagger/OpenAPI)
3. Database Schema Documentation
4. Deployment Guide
5. User Manual (Admin/Super Admin)
6. Security Guidelines
7. Backup & Restore Procedures
8. Troubleshooting Guide

### 10.3 Configuration Deliverables
1. Environment configuration templates
2. S3 bucket policies
3. IAM role policies
4. NGINX SSL configuration
5. Database initialization scripts

---

## 11. SUCCESS CRITERIA

The project will be considered successful when:

1. All user roles can perform their designated functions
2. Products can be browsed, searched, and filtered effectively
3. Buyers can contact vendors with rate limiting working
4. Admin can configure all system settings
5. Super Admin can manage all content
6. All 6 themes work correctly
7. Both languages (English/Telugu) display properly
8. S3 integration works securely
9. Backup system runs automatically
10. Application is deployed on Hostinger with HTTPS
11. Health check endpoint responds correctly
12. Analytics dashboard displays accurate data
13. Responsive design works on mobile/tablet/desktop
14. Security requirements are met (JWT, RBAC, rate limiting)
15. Soft delete works across all entities

---

## 12. ASSUMPTIONS & CONSTRAINTS

### 12.1 Assumptions
- Hostinger VPS has sufficient resources (4GB RAM, 2 CPU)
- AWS S3 access is available with IAM role support
- Domain name is available for SSL certificate
- Admin/Super Admin users will be trained on system usage
- Product images will be provided in acceptable formats
- Vendor contact information is accurate and up-to-date

### 12.2 Constraints
- Budget: Government project with cost constraints
- Timeline: To be defined based on resource availability
- Hosting: Must use Hostinger (as specified)
- Technology: Must use specified tech stack
- No payment processing allowed
- Must maintain government branding standards

---

## 13. RISK ASSESSMENT

### 13.1 Technical Risks
- **S3 IAM Configuration**: Mitigate with thorough testing and documentation
- **Rate Limiting Bypass**: Implement multiple layers (IP, session, user)
- **Database Performance**: Proper indexing and query optimization
- **Image Storage Costs**: Implement image compression and size limits

### 13.2 Security Risks
- **Bot Attacks**: CAPTCHA and rate limiting
- **Data Breach**: Encryption, secure authentication, audit logs
- **DDoS**: NGINX rate limiting, Cloudflare (if needed)

### 13.3 Operational Risks
- **Backup Failure**: Monitoring and alerts
- **Server Downtime**: Health checks and monitoring
- **Data Loss**: Regular tested backups

---

**Document Version**: 1.0  
**Last Updated**: February 14, 2026  
**Status**: Approved for Development
