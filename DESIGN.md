# 🎨 TRIBES INDIA MARKETPLACE PORTAL
## Design Specification Document

---

## TABLE OF CONTENTS
1. UI/UX Design
2. Theme Specifications
3. Database Schema
4. API Architecture
5. System Architecture
6. Folder Structure
7. Security Design

---

## 1. UI/UX DESIGN

### 1.1 Design Principles
- **Visual Excellence**: Premium, elegant, and modern aesthetic
- **Cultural Authenticity**: Tribal patterns, earthy tones, handcrafted feel
- **Simplicity with Artistry**: Clean layouts with artistic tribal accents
- **Accessibility**: WCAG 2.1 AA compliant
- **Mobile-First**: Fully responsive across all devices
- **Performance**: Fast loading with smooth animations and transitions
- **Engaging Experience**: Hover effects, micro-interactions, stunning product displays
- **Professional**: Government-grade quality with modern e-commerce feel

### 1.2 Page Layouts & User Journeys

#### 1.2.1 GUEST USER JOURNEY

**A. Home Page**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Tribes India Marketplace    [Language] [Theme] [🔍] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Hero Section:                                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  "Discover Authentic Tribal Products"                  │  │
│  │  [Browse Products Button]                              │  │
│  │  Background: Tribal art pattern                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  Featured Categories (Grid 3x2):                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                        │
│  │ [Icon]  │ │ [Icon]  │ │ [Icon]  │                        │
│  │Handicraft│ │ Textiles│ │ Jewelry │                        │
│  └─────────┘ └─────────┘ └─────────┘                        │
│                                                               │
│  Top Viewed Products (Carousel):                              │
│  ← [Product Card] [Product Card] [Product Card] →            │
│                                                               │
│  About Tribes India Section                                   │
│  Footer (Custom + Fixed "Powered by DataLegos...")           │
└─────────────────────────────────────────────────────────────┘
```

**B. Products Listing Page**
```
┌─────────────────────────────────────────────────────────────┐
│  Header (same as home)                                        │
├─────────────────────────────────────────────────────────────┤
│  Breadcrumb: Home > Products                                  │
│                                                               │
│  ┌─────────────┐  ┌──────────────────────────────────────┐  │
│  │  FILTERS    │  │  PRODUCTS GRID                        │  │
│  │             │  │                                        │  │
│  │ Category ▼  │  │  ┌────────┐ ┌────────┐ ┌────────┐   │  │
│  │ □ Handicraft│  │  │ [Img]  │ │ [Img]  │ │ [Img]  │   │  │
│  │ □ Textiles  │  │  │ Name   │ │ Name   │ │ Name   │   │  │
│  │             │  │  │ Tribe  │ │ Tribe  │ │ Tribe  │   │  │
│  │ Tribe ▼     │  │  │ 👁 123  │ │ 👁 456  │ │ 👁 789  │   │  │
│  │ □ Tribe A   │  │  └────────┘ └────────┘ └────────┘   │  │
│  │ □ Tribe B   │  │                                        │  │
│  │             │  │  [Load More] or [Pagination]          │  │
│  │ State ▼     │  │                                        │  │
│  │ □ AP        │  │                                        │  │
│  │             │  │                                        │  │
│  │ [Clear All] │  │                                        │  │
│  └─────────────┘  └──────────────────────────────────────┘  │
│                                                               │
│  Footer                                                       │
└─────────────────────────────────────────────────────────────┘
```

**C. Product Detail Page**
```
┌─────────────────────────────────────────────────────────────┐
│  Header                                                       │
├─────────────────────────────────────────────────────────────┤
│  Breadcrumb: Home > Products > Category > Product Name       │
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │                      │  │  Product Name                 │ │
│  │   Main Image         │  │  Category > Subcategory       │ │
│  │   (Large)            │  │  Tribe: [Tribe Name]          │ │
│  │                      │  │  State: [State]               │ │
│  │                      │  │                               │ │
│  ├──────────────────────┤  │  Description:                 │ │
│  │ [Thumb] [Thumb]      │  │  Lorem ipsum dolor sit amet   │ │
│  │ [Thumb] [Thumb]      │  │  consectetur adipiscing...    │ │
│  └──────────────────────┘  │                               │ │
│                             │  📺 [YouTube Link]            │ │
│                             │  📷 [Instagram Link]          │ │
│                             │                               │ │
│                             │  👁 Views: 1,234              │ │
│                             │                               │ │
│                             │  [📞 Contact Vendor]          │ │
│                             │  (Triggers registration)      │ │
│                             └──────────────────────────────┘ │
│                                                               │
│  Related Products Section                                     │
│  Footer                                                       │
└─────────────────────────────────────────────────────────────┘
```

**D. Contact Vendor Modal (Buyer Registration)**
```
┌─────────────────────────────────────────────────────────────┐
│  ✕                    Contact Vendor                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  To contact the vendor, please provide your details:          │
│                                                               │
│  Name: *                                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [Enter your name]                                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  Email: *                                                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [Enter your email]                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  Location: *                                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [Enter your location]                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  Phone: (Optional)                                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [Enter your phone]                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  [CAPTCHA Image/Challenge]                                    │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐                           │
│  │   Cancel    │  │   Submit    │                           │
│  └─────────────┘  └─────────────┘                           │
│                                                               │
│  After submission: Vendor contact details sent to your email │
└─────────────────────────────────────────────────────────────┘
```


#### 1.2.2 ADMIN USER JOURNEY

**A. Admin Login Page**
```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                    [Logo]                                     │
│              Tribes India Admin Portal                        │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Email:                                                │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ [admin@example.com]                              │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  Password:                                             │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ [••••••••]                                       │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              Login                               │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  Powered by DataLegos Tech Solutions Pvt. Ltd.               │
└─────────────────────────────────────────────────────────────┘
```

**B. Admin Dashboard**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Admin Dashboard          [Admin Name ▼] [Logout]     │
├──────────┬──────────────────────────────────────────────────┤
│          │  Dashboard Overview                               │
│ 📊 Dash  │                                                   │
│ 👥 Super │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│   Admins │  │ Products │ │  Tribes  │ │ Vendors  │         │
│ ⚙️ Config│  │   1,234  │ │    45    │ │   678    │         │
│   • Brand│  └──────────┘ └──────────┘ └──────────┘         │
│   • Categ│                                                   │
│   • Pages│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ 📝 Audit │  │  Buyers  │ │ Contacts │ │  Views   │         │
│ 📈 Report│  │   2,345  │ │   5,678  │ │  12,345  │         │
│          │  └──────────┘ └──────────┘ └──────────┘         │
│          │                                                   │
│          │  Top Viewed Products (Chart)                     │
│          │  ┌────────────────────────────────────────────┐ │
│          │  │ [Bar Chart]                                 │ │
│          │  └────────────────────────────────────────────┘ │
│          │                                                   │
│          │  Contact Trends (Line Chart)                     │
│          │  ┌────────────────────────────────────────────┐ │
│          │  │ [Line Chart]                                │ │
│          │  └────────────────────────────────────────────┘ │
├──────────┴──────────────────────────────────────────────────┤
│  Powered by DataLegos Tech Solutions Pvt. Ltd.               │
└─────────────────────────────────────────────────────────────┘
```

**C. System Configuration - Branding**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Admin Dashboard          [Admin Name ▼] [Logout]     │
├──────────┬──────────────────────────────────────────────────┤
│          │  System Configuration > Branding                  │
│ Sidebar  │                                                   │
│ (same)   │  Application Name:                                │
│          │  ┌─────────────────────────────────────────────┐ │
│          │  │ Tribes India Marketplace                     │ │
│          │  └─────────────────────────────────────────────┘ │
│          │                                                   │
│          │  Logo:                                            │
│          │  ┌─────────────┐                                 │
│          │  │  [Preview]  │  [Upload New Logo]              │
│          │  │   Image     │  (Max 5MB, PNG/JPG)             │
│          │  └─────────────┘                                 │
│          │                                                   │
│          │  Default Theme:                                   │
│          │  ┌─────────────────────────────────────────────┐ │
│          │  │ Government Heritage              ▼          │ │
│          │  └─────────────────────────────────────────────┘ │
│          │                                                   │
│          │  ┌──────────┐  ┌──────────┐                     │
│          │  │  Cancel  │  │   Save   │                     │
│          │  └──────────┘  └──────────┘                     │
├──────────┴──────────────────────────────────────────────────┤
│  Powered by DataLegos Tech Solutions Pvt. Ltd.               │
└─────────────────────────────────────────────────────────────┘
```

#### 1.2.3 SUPER ADMIN USER JOURNEY

**A. Super Admin Dashboard**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Super Admin Dashboard    [Name ▼] [Logout]           │
├──────────┬──────────────────────────────────────────────────┤
│          │  Dashboard Overview                               │
│ 📊 Dash  │                                                   │
│ 🏛 Tribes│  Quick Stats + Charts (similar to Admin)         │
│ 🏪 Vendor│                                                   │
│ 📦 Produc│  Recent Activities:                               │
│ 🏷 Catego│  ┌────────────────────────────────────────────┐ │
│ 📈 Report│  │ • Product "XYZ" approved - 2 hours ago     │ │
│          │  │ • Vendor "ABC" registered - 5 hours ago    │ │
│          │  │ • Tribe "DEF" updated - 1 day ago          │ │
│          │  └────────────────────────────────────────────┘ │
├──────────┴──────────────────────────────────────────────────┤
│  Powered by DataLegos Tech Solutions Pvt. Ltd.               │
└─────────────────────────────────────────────────────────────┘
```

**B. Manage Products**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Super Admin Dashboard    [Name ▼] [Logout]           │
├──────────┬──────────────────────────────────────────────────┤
│          │  Manage Products                                  │
│ Sidebar  │                                                   │
│ (same)   │  [+ Add New Product]  [🔍 Search] [Filter ▼]     │
│          │                                                   │
│          │  ┌────────────────────────────────────────────┐ │
│          │  │ Product List (Table)                        │ │
│          │  ├──────┬────────┬────────┬────────┬─────────┤ │
│          │  │ Image│ Name   │ Tribe  │ Status │ Actions │ │
│          │  ├──────┼────────┼────────┼────────┼─────────┤ │
│          │  │ [img]│ Prod A │Tribe X │Approved│ ✏️ 🗑️   │ │
│          │  │ [img]│ Prod B │Tribe Y │Pending │ ✅ ❌ ✏️│ │
│          │  │ [img]│ Prod C │Tribe Z │Draft   │ ✏️ 🗑️   │ │
│          │  └────────────────────────────────────────────┘ │
│          │                                                   │
│          │  [Pagination: 1 2 3 ... 10]                      │
├──────────┴──────────────────────────────────────────────────┤
│  Powered by DataLegos Tech Solutions Pvt. Ltd.               │
└─────────────────────────────────────────────────────────────┘
```

**C. Add/Edit Product Form**
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Super Admin Dashboard    [Name ▼] [Logout]           │
├──────────┬──────────────────────────────────────────────────┤
│          │  Add New Product                                  │
│ Sidebar  │                                                   │
│ (same)   │  Product Name: *                                  │
│          │  ┌─────────────────────────────────────────────┐ │
│          │  │ [Enter product name]                         │ │
│          │  └─────────────────────────────────────────────┘ │
│          │                                                   │
│          │  Category: *          Subcategory: *              │
│          │  ┌──────────────┐    ┌──────────────┐           │
│          │  │ Select ▼     │    │ Select ▼     │           │
│          │  └──────────────┘    └──────────────┘           │
│          │                                                   │
│          │  Tribe: *             Vendor: *                   │
│          │  ┌──────────────┐    ┌──────────────┐           │
│          │  │ Select ▼     │    │ Select ▼     │           │
│          │  └──────────────┘    └──────────────┘           │
│          │                                                   │
│          │  Description: *                                   │
│          │  ┌─────────────────────────────────────────────┐ │
│          │  │ [Text area for description]                  │ │
│          │  │                                               │ │
│          │  └─────────────────────────────────────────────┘ │
│          │                                                   │
│          │  Product Images: * (Max 5 images)                │
│          │  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                 │
│          │  │ + │ │img│ │img│ │   │ │   │                 │
│          │  └───┘ └───┘ └───┘ └───┘ └───┘                 │
│          │                                                   │
│          │  YouTube Link: (Optional)                         │
│          │  ┌─────────────────────────────────────────────┐ │
│          │  │ https://youtube.com/...                      │ │
│          │  └─────────────────────────────────────────────┘ │
│          │                                                   │
│          │  Instagram Link: (Optional)                       │
│          │  ┌─────────────────────────────────────────────┐ │
│          │  │ https://instagram.com/...                    │ │
│          │  └─────────────────────────────────────────────┘ │
│          │                                                   │
│          │  Status:                                          │
│          │  ○ Draft  ○ Pending  ○ Approved  ○ Rejected     │
│          │                                                   │
│          │  ┌──────────┐  ┌──────────┐                     │
│          │  │  Cancel  │  │   Save   │                     │
│          │  └──────────┘  └──────────┘                     │
├──────────┴──────────────────────────────────────────────────┤
│  Powered by DataLegos Tech Solutions Pvt. Ltd.               │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Navigation Patterns

#### 1.3.1 Public Site Navigation (Guest/Buyer)
```
Header Navigation:
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Tribes India    Home | Products | About | Contact    │
│                        [Language: EN/TE] [Theme] [Search]    │
└─────────────────────────────────────────────────────────────┘
```

#### 1.3.2 Admin Navigation
```
Sidebar Navigation (Collapsible):
├─ 📊 Dashboard
├─ 👥 Manage Super Admins
├─ ⚙️ System Configuration
│  ├─ Branding
│  ├─ Categories
│  ├─ Header/Footer
│  └─ Content Pages
├─ 📝 Audit Logs
└─ 📈 Reports
```

#### 1.3.3 Super Admin Navigation
```
Sidebar Navigation (Collapsible):
├─ 📊 Dashboard
├─ 🏛 Manage Tribes
├─ 🏪 Manage Vendors
├─ 📦 Manage Products
├─ 🏷 Manage Categories
└─ 📈 Reports
```

### 1.4 Component Library

#### 1.4.1 Reusable Components

**Button Variants:**
- Primary: Main actions (Submit, Save, Approve)
- Secondary: Cancel, Back actions
- Danger: Delete, Reject actions
- Ghost: Subtle actions

**Form Components:**
- Text Input (with validation states)
- Text Area
- Select Dropdown (searchable)
- Multi-select
- File Upload (drag & drop)
- Date Picker
- Checkbox
- Radio Button
- Toggle Switch

**Feedback Components:**
- Toast Notifications (success, error, warning, info)
- Modal Dialogs
- Confirmation Dialogs
- Loading Spinners
- Progress Bars
- Skeleton Loaders

**Data Display:**
- Data Tables (sortable, filterable, paginated)
- Cards (Product Card, Stat Card)
- Badges (Status badges)
- Tooltips
- Breadcrumbs
- Tabs

**Charts (for Analytics):**
- Line Chart (trends over time)
- Bar Chart (comparisons)
- Pie Chart (category distribution)
- Simple statistics cards

### 1.5 Responsive Breakpoints

```
Mobile:    < 768px   (1 column layout)
Tablet:    768-1024px (2 column layout)
Desktop:   > 1024px   (3-4 column layout)
```

**Mobile Adaptations:**
- Hamburger menu for navigation
- Stacked filters (collapsible)
- Single column product grid
- Touch-friendly buttons (min 44x44px)
- Simplified tables (card view)

### 1.6 Loading States & Empty States

**Loading States:**
- Skeleton loaders for product cards
- Spinner for form submissions
- Progress bar for image uploads

**Empty States:**
- No products found: "No products match your filters. Try adjusting your search."
- No results: "No results found. Browse all products instead."
- Empty dashboard: "No data available yet. Start by adding products."

### 1.7 Error States

**Form Validation:**
- Inline error messages below fields
- Red border on invalid fields
- Clear error text

**Page Errors:**
- 404: "Page not found. Return to home."
- 500: "Something went wrong. Please try again later."
- Network error: "Connection lost. Check your internet."

---

## 2. THEME SPECIFICATIONS

### 2.1 Theme Color Palettes

#### Theme 1: Government Heritage
```
Primary:     #1E3A8A (Deep Blue)
Secondary:   #F59E0B (Amber)
Accent:      #DC2626 (Red)
Background:  #F9FAFB (Light Gray)
Text:        #111827 (Dark Gray)
Border:      #D1D5DB (Gray)

Use Case: Traditional government look, professional, trustworthy
```

#### Theme 2: Tribal Earth (DEFAULT RECOMMENDED)
```
Primary:     #8B4513 (Saddle Brown)
Secondary:   #D2691E (Chocolate)
Accent:      #CD853F (Peru/Terracotta)
Accent2:     #228B22 (Forest Green)
Background:  #FAF8F3 (Warm Cream)
Surface:     #FFFFFF (White)
Text:        #3E2723 (Dark Brown)
TextLight:   #6D4C41 (Medium Brown)
Border:      #D7CCC8 (Light Brown)
Overlay:     rgba(139, 69, 19, 0.05) (Subtle Brown)

Use Case: Natural, earthy, premium handcrafted marketplace feel
Perfect for: Showcasing tribal products with cultural authenticity
```

#### Theme 3: Modern Marketplace
```
Primary:     #0891B2 (Cyan)
Secondary:   #8B5CF6 (Purple)
Accent:      #EC4899 (Pink)
Background:  #FFFFFF (White)
Text:        #0F172A (Slate)
Border:      #E2E8F0 (Light Slate)

Use Case: Contemporary, clean, e-commerce feel
```

#### Theme 4: Vibrant Festival
```
Primary:     #DC2626 (Red)
Secondary:   #F59E0B (Orange)
Accent:      #10B981 (Green)
Background:  #FFF7ED (Light Orange)
Text:        #1F2937 (Dark)
Border:      #FED7AA (Peach)

Use Case: Celebratory, energetic, festive occasions
```

#### Theme 5: Eco Sustainable
```
Primary:     #059669 (Green)
Secondary:   #84CC16 (Lime)
Accent:      #0891B2 (Teal)
Background:  #F0FDF4 (Light Green)
Text:        #14532D (Dark Green)
Border:      #BBF7D0 (Mint)

Use Case: Environmental focus, sustainability
```

#### Theme 6: Dark Theme (Dracula)
```
Primary:     #BD93F9 (Purple)
Secondary:   #FF79C6 (Pink)
Accent:      #50FA7B (Green)
Background:  #282A36 (Dark Gray)
Text:        #F8F8F2 (Off White)
Border:      #44475A (Gray)

Use Case: Dark mode, reduced eye strain, modern
```

### 2.2 Typography

**Font Family:**
- Primary: 'Inter', 'Segoe UI', sans-serif
- Headings: 'Poppins', sans-serif
- Monospace: 'Fira Code', monospace (for codes/IDs)

**Font Sizes:**
```
h1: 2.5rem (40px)
h2: 2rem (32px)
h3: 1.5rem (24px)
h4: 1.25rem (20px)
h5: 1rem (16px)
body: 1rem (16px)
small: 0.875rem (14px)
```

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### 2.3 Spacing System
```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
```

### 2.4 Border Radius
```
sm: 4px (buttons, inputs)
md: 8px (cards)
lg: 12px (modals)
full: 9999px (pills, avatars)
```

### 2.5 Shadows
```
sm:  0 1px 2px rgba(0,0,0,0.05)
md:  0 4px 6px rgba(0,0,0,0.1)
lg:  0 10px 15px rgba(0,0,0,0.1)
xl:  0 20px 25px rgba(0,0,0,0.15)
```

---

## 3. DATABASE SCHEMA

### 3.1 Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   tribes    │────────<│   vendors   │────────<│  products   │
└─────────────┘         └─────────────┘         └─────────────┘
                                                       │
                                                       │
                        ┌──────────────────────────────┤
                        │                              │
                        ▼                              ▼
                 ┌─────────────┐              ┌──────────────┐
                 │ categories  │              │product_images│
                 └─────────────┘              └──────────────┘
                        │
                        ▼
                 ┌─────────────┐
                 │subcategories│
                 └─────────────┘

┌─────────────┐         ┌─────────────┐
│   buyers    │────────<│contact_logs │
└─────────────┘         └─────────────┘
                               │
                               │ (references products)
                               │
                        ┌─────────────┐
                        │product_views│
                        └─────────────┘

┌─────────────┐         ┌─────────────┐
│    users    │────────<│ audit_logs  │
│(Admin/Super)│         └─────────────┘
└─────────────┘

┌─────────────┐
│system_config│
└─────────────┘
```



### 3.2 Detailed Table Schemas

#### 3.2.1 users (Admin & Super Admin)
```sql
CREATE TABLE users (
    id VARCHAR(20) PRIMARY KEY,              -- Format: USR001, USR002
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,     -- Bcrypt hashed
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,               -- 'admin' or 'super_admin'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP NULL,
    deleted_by VARCHAR(20),
    last_login TIMESTAMP NULL,
    
    CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
    CONSTRAINT fk_users_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(id),
    CONSTRAINT chk_role CHECK (role IN ('admin', 'super_admin'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
```

#### 3.2.2 tribes
```sql
CREATE TABLE tribes (
    id VARCHAR(20) PRIMARY KEY,              -- Format: TRB001, TRB002
    name VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),                  -- S3 URL
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP NULL,
    deleted_by VARCHAR(20),
    
    CONSTRAINT fk_tribes_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_tribes_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
    CONSTRAINT fk_tribes_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(id)
);

CREATE INDEX idx_tribes_name ON tribes(name);
CREATE INDEX idx_tribes_state ON tribes(state);
CREATE INDEX idx_tribes_is_active ON tribes(is_active);
```

#### 3.2.3 vendors
```sql
CREATE TABLE vendors (
    id VARCHAR(20) PRIMARY KEY,              -- Format: VND001, VND002
    name VARCHAR(100) NOT NULL,
    tribe_id VARCHAR(20) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    approval_status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP NULL,
    deleted_by VARCHAR(20),
    
    CONSTRAINT fk_vendors_tribe FOREIGN KEY (tribe_id) REFERENCES tribes(id),
    CONSTRAINT fk_vendors_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_vendors_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
    CONSTRAINT fk_vendors_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(id),
    CONSTRAINT chk_approval_status CHECK (approval_status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX idx_vendors_tribe ON vendors(tribe_id);
CREATE INDEX idx_vendors_approval_status ON vendors(approval_status);
CREATE INDEX idx_vendors_is_active ON vendors(is_active);
```

#### 3.2.4 categories
```sql
CREATE TABLE categories (
    id VARCHAR(20) PRIMARY KEY,              -- Format: CAT001, CAT002
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP NULL,
    deleted_by VARCHAR(20),
    
    CONSTRAINT fk_categories_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_categories_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
    CONSTRAINT fk_categories_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(id)
);

CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_display_order ON categories(display_order);
```

#### 3.2.5 subcategories
```sql
CREATE TABLE subcategories (
    id VARCHAR(20) PRIMARY KEY,              -- Format: SUB001, SUB002
    category_id VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP NULL,
    deleted_by VARCHAR(20),
    
    CONSTRAINT fk_subcategories_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_subcategories_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_subcategories_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
    CONSTRAINT fk_subcategories_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(id)
);

CREATE INDEX idx_subcategories_category ON subcategories(category_id);
CREATE INDEX idx_subcategories_name ON subcategories(name);
CREATE INDEX idx_subcategories_is_active ON subcategories(is_active);
```

#### 3.2.6 products
```sql
CREATE TABLE products (
    id VARCHAR(20) PRIMARY KEY,              -- Format: PRD001, PRD002
    name VARCHAR(200) NOT NULL,
    category_id VARCHAR(20) NOT NULL,
    subcategory_id VARCHAR(20) NOT NULL,
    tribe_id VARCHAR(20) NOT NULL,
    vendor_id VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    youtube_link VARCHAR(500),
    instagram_link VARCHAR(500),
    status VARCHAR(20) DEFAULT 'draft',      -- 'draft', 'pending', 'approved', 'rejected'
    view_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(20),
    deleted_at TIMESTAMP NULL,
    deleted_by VARCHAR(20),
    
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_products_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories(id),
    CONSTRAINT fk_products_tribe FOREIGN KEY (tribe_id) REFERENCES tribes(id),
    CONSTRAINT fk_products_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    CONSTRAINT fk_products_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_products_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
    CONSTRAINT fk_products_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(id),
    CONSTRAINT chk_status CHECK (status IN ('draft', 'pending', 'approved', 'rejected'))
);

CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_tribe ON products(tribe_id);
CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_view_count ON products(view_count DESC);

-- Full-text search index for product name and description
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || description));
```

#### 3.2.7 product_images
```sql
CREATE TABLE product_images (
    id VARCHAR(20) PRIMARY KEY,              -- Format: IMG001, IMG002
    product_id VARCHAR(20) NOT NULL,
    image_url VARCHAR(500) NOT NULL,         -- S3 URL
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_display_order ON product_images(display_order);
```

#### 3.2.8 buyers
```sql
CREATE TABLE buyers (
    id VARCHAR(20) PRIMARY KEY,              -- Format: BYR001, BYR002
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    location VARCHAR(200) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_buyers_email ON buyers(email);
CREATE INDEX idx_buyers_location ON buyers(location);
```

#### 3.2.9 contact_logs
```sql
CREATE TABLE contact_logs (
    id VARCHAR(20) PRIMARY KEY,              -- Format: CNT001, CNT002
    buyer_id VARCHAR(20) NOT NULL,
    product_id VARCHAR(20) NOT NULL,
    vendor_id VARCHAR(20) NOT NULL,
    ip_address VARCHAR(45),                  -- IPv4 or IPv6
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_contact_logs_buyer FOREIGN KEY (buyer_id) REFERENCES buyers(id),
    CONSTRAINT fk_contact_logs_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_contact_logs_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE INDEX idx_contact_logs_buyer ON contact_logs(buyer_id);
CREATE INDEX idx_contact_logs_product ON contact_logs(product_id);
CREATE INDEX idx_contact_logs_vendor ON contact_logs(vendor_id);
CREATE INDEX idx_contact_logs_created_at ON contact_logs(created_at DESC);
CREATE INDEX idx_contact_logs_ip ON contact_logs(ip_address, created_at);
```

#### 3.2.10 product_views
```sql
CREATE TABLE product_views (
    id VARCHAR(20) PRIMARY KEY,              -- Format: VIW001, VIW002
    product_id VARCHAR(20) NOT NULL,
    session_id VARCHAR(100),                 -- Browser session ID
    ip_address VARCHAR(45),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_product_views_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX idx_product_views_product ON product_views(product_id);
CREATE INDEX idx_product_views_viewed_at ON product_views(viewed_at DESC);
CREATE INDEX idx_product_views_session ON product_views(session_id, product_id);
```

#### 3.2.11 audit_logs
```sql
CREATE TABLE audit_logs (
    id VARCHAR(20) PRIMARY KEY,              -- Format: AUD001, AUD002
    user_id VARCHAR(20) NOT NULL,
    action VARCHAR(50) NOT NULL,             -- 'create', 'update', 'delete', 'approve', 'reject'
    resource_type VARCHAR(50) NOT NULL,      -- 'product', 'vendor', 'tribe', 'category', etc.
    resource_id VARCHAR(20) NOT NULL,
    old_value TEXT,                          -- JSON string of old values
    new_value TEXT,                          -- JSON string of new values
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

#### 3.2.12 system_config
```sql
CREATE TABLE system_config (
    id VARCHAR(20) PRIMARY KEY,              -- Format: CFG001, CFG002
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    config_type VARCHAR(20) NOT NULL,        -- 'string', 'json', 'boolean', 'integer'
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(20),
    
    CONSTRAINT fk_system_config_updated_by FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE INDEX idx_system_config_key ON system_config(config_key);

-- Pre-populate with default configs
INSERT INTO system_config (id, config_key, config_value, config_type, description) VALUES
('CFG001', 'app_name', 'Tribes India Marketplace', 'string', 'Application name'),
('CFG002', 'app_logo_url', '', 'string', 'Application logo S3 URL'),
('CFG003', 'default_theme', 'government-heritage', 'string', 'Default theme for new visitors'),
('CFG004', 'header_content', '', 'string', 'Custom header HTML content'),
('CFG005', 'footer_content', '', 'string', 'Custom footer HTML content'),
('CFG006', 'terms_page', '', 'string', 'Terms and conditions content'),
('CFG007', 'privacy_page', '', 'string', 'Privacy policy content'),
('CFG008', 'disclaimer_page', '', 'string', 'Disclaimer content');
```

### 3.3 Database Indexes Summary

**Performance Optimization:**
- All foreign keys indexed
- Search fields (product name, description) indexed
- Filter fields (category, tribe, status, state) indexed
- Timestamp fields for analytics indexed
- Composite indexes for common query patterns

**Full-Text Search:**
- PostgreSQL `gin` index on products for text search
- ILIKE queries on indexed fields

---

## 4. API ARCHITECTURE

### 4.1 API Base Structure

**Base URL:** `https://api.tribesindiamarketplace.com/api/v1`

**Authentication:** JWT Bearer Token (for Admin/Super Admin endpoints)

**Response Format:**
```json
{
  "success": true/false,
  "data": { ... } or null,
  "error": { "code": "...", "message": "...", "details": null } or null
}
```

### 4.2 API Endpoints

#### 4.2.1 Authentication Endpoints

**POST /auth/login**
```
Description: Admin/Super Admin login
Request Body:
{
  "email": "admin@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "user": {
      "id": "USR001",
      "email": "admin@example.com",
      "full_name": "Admin User",
      "role": "admin"
    }
  }
}

Errors:
- AUTH_401_001: Invalid credentials
- AUTH_403_001: Account inactive
- AUTH_429_001: Too many login attempts
```

**POST /auth/refresh**
```
Description: Refresh access token
Request Body:
{
  "refresh_token": "eyJhbGc..."
}

Response (200):
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc..."
  }
}

Errors:
- AUTH_401_002: Invalid refresh token
- AUTH_401_003: Refresh token expired
```

**POST /auth/logout**
```
Description: Logout (invalidate tokens)
Headers: Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": null
}
```

#### 4.2.2 Public Endpoints (No Auth Required)

**GET /products**
```
Description: Get all approved products with filters
Query Parameters:
  - page: integer (default: 1)
  - limit: integer (default: 20, max: 100)
  - category_id: string (optional)
  - subcategory_id: string (optional)
  - tribe_id: string (optional)
  - state: string (optional)
  - search: string (optional)
  - sort_by: string (default: 'created_at', options: 'view_count', 'name')
  - sort_order: string (default: 'desc', options: 'asc')

Response (200):
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "PRD001",
        "name": "Handwoven Basket",
        "category": { "id": "CAT001", "name": "Handicrafts" },
        "subcategory": { "id": "SUB001", "name": "Baskets" },
        "tribe": { "id": "TRB001", "name": "Gond", "state": "Andhra Pradesh" },
        "description": "Beautiful handwoven basket...",
        "images": [
          { "id": "IMG001", "url": "https://s3...", "is_primary": true }
        ],
        "youtube_link": "https://youtube.com/...",
        "instagram_link": "https://instagram.com/...",
        "view_count": 123,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "total_pages": 8
    }
  }
}

Errors:
- PRD_400_001: Invalid query parameters
```

**GET /products/{product_id}**
```
Description: Get single product details (increments view count)
Path Parameters:
  - product_id: string

Response (200):
{
  "success": true,
  "data": {
    "id": "PRD001",
    "name": "Handwoven Basket",
    "category": { "id": "CAT001", "name": "Handicrafts" },
    "subcategory": { "id": "SUB001", "name": "Baskets" },
    "tribe": {
      "id": "TRB001",
      "name": "Gond",
      "state": "Andhra Pradesh",
      "description": "The Gond tribe...",
      "image_url": "https://s3..."
    },
    "vendor": {
      "id": "VND001",
      "name": "Vendor Name"
    },
    "description": "Beautiful handwoven basket...",
    "images": [
      { "id": "IMG001", "url": "https://s3...", "is_primary": true, "display_order": 0 },
      { "id": "IMG002", "url": "https://s3...", "is_primary": false, "display_order": 1 }
    ],
    "youtube_link": "https://youtube.com/...",
    "instagram_link": "https://instagram.com/...",
    "view_count": 124,
    "created_at": "2024-01-15T10:30:00Z"
  }
}

Errors:
- PRD_404_001: Product not found
- PRD_403_001: Product not approved
```

**GET /categories**
```
Description: Get all active categories with subcategories
Response (200):
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "CAT001",
        "name": "Handicrafts",
        "description": "Traditional handicrafts",
        "subcategories": [
          { "id": "SUB001", "name": "Baskets" },
          { "id": "SUB002", "name": "Pottery" }
        ]
      }
    ]
  }
}
```

**GET /tribes**
```
Description: Get all active tribes
Query Parameters:
  - state: string (optional)

Response (200):
{
  "success": true,
  "data": {
    "tribes": [
      {
        "id": "TRB001",
        "name": "Gond",
        "state": "Andhra Pradesh",
        "description": "The Gond tribe...",
        "image_url": "https://s3..."
      }
    ]
  }
}
```

**POST /contact-vendor**
```
Description: Register buyer and send vendor contact info
Request Body:
{
  "product_id": "PRD001",
  "buyer": {
    "name": "John Doe",
    "email": "john@example.com",
    "location": "Hyderabad",
    "phone": "9876543210"
  },
  "captcha_token": "captcha_token_here"
}

Response (200):
{
  "success": true,
  "data": {
    "message": "Vendor contact details sent to your email",
    "buyer_id": "BYR001"
  }
}

Errors:
- CNT_400_001: Invalid input data
- CNT_400_002: Invalid captcha
- CNT_404_001: Product not found
- CNT_429_001: Rate limit exceeded (10 per hour)
```

**GET /config**
```
Description: Get public system configuration
Response (200):
{
  "success": true,
  "data": {
    "app_name": "Tribes India Marketplace",
    "app_logo_url": "https://s3...",
    "default_theme": "government-heritage",
    "header_content": "<div>...</div>",
    "footer_content": "<div>...</div>"
  }
}
```



#### 4.2.3 Admin Endpoints (Requires Admin Role)

**User Management:**
- POST /admin/users - Create Super Admin
- GET /admin/users - List all Super Admins
- PUT /admin/users/{id} - Update Super Admin
- DELETE /admin/users/{id} - Soft delete Super Admin

**System Configuration:**
- GET /admin/config - Get all configurations
- PUT /admin/config/branding - Update branding (name, logo, theme)
- PUT /admin/config/categories - Manage categories
- PUT /admin/config/content - Update header/footer/pages

**Analytics & Reports:**
- GET /admin/analytics/overview - Dashboard statistics
- GET /admin/analytics/products - Product analytics
- GET /admin/analytics/engagement - Engagement metrics
- GET /admin/reports/inquiries - Export inquiry reports (CSV)

**Audit Logs:**
- GET /admin/audit-logs - Get audit logs with filters

#### 4.2.4 Super Admin Endpoints (Requires Super Admin Role)

**Tribe Management:**
- POST /super-admin/tribes - Create tribe
- GET /super-admin/tribes - List tribes
- GET /super-admin/tribes/{id} - Get tribe details
- PUT /super-admin/tribes/{id} - Update tribe
- DELETE /super-admin/tribes/{id} - Soft delete tribe

**Vendor Management:**
- POST /super-admin/vendors - Create vendor
- GET /super-admin/vendors - List vendors
- GET /super-admin/vendors/{id} - Get vendor details
- PUT /super-admin/vendors/{id} - Update vendor
- PUT /super-admin/vendors/{id}/approve - Approve vendor
- PUT /super-admin/vendors/{id}/reject - Reject vendor
- DELETE /super-admin/vendors/{id} - Soft delete vendor

**Product Management:**
- POST /super-admin/products - Create product
- GET /super-admin/products - List all products (including drafts)
- GET /super-admin/products/{id} - Get product details
- PUT /super-admin/products/{id} - Update product
- PUT /super-admin/products/{id}/status - Change product status
- POST /super-admin/products/{id}/images - Upload product images
- DELETE /super-admin/products/{id}/images/{image_id} - Delete image
- DELETE /super-admin/products/{id} - Soft delete product

**Category Management:**
- POST /super-admin/categories - Create category
- PUT /super-admin/categories/{id} - Update category
- DELETE /super-admin/categories/{id} - Soft delete category
- POST /super-admin/subcategories - Create subcategory
- PUT /super-admin/subcategories/{id} - Update subcategory
- DELETE /super-admin/subcategories/{id} - Soft delete subcategory

**Analytics:**
- GET /super-admin/analytics/overview - Dashboard statistics
- GET /super-admin/reports/inquiries - Export inquiry reports

#### 4.2.5 Health Check Endpoint

**GET /health**
```
Description: System health check
Response (200):
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-02-14T10:30:00Z"
}
```

### 4.3 Error Code Reference

**Format:** `<MODULE>_<HTTP_STATUS>_<SEQUENCE>`

**Authentication (AUTH):**
- AUTH_401_001: Invalid credentials
- AUTH_401_002: Invalid refresh token
- AUTH_401_003: Token expired
- AUTH_403_001: Account inactive
- AUTH_403_002: Insufficient permissions
- AUTH_429_001: Too many login attempts

**Products (PRD):**
- PRD_400_001: Invalid query parameters
- PRD_400_002: Invalid product data
- PRD_404_001: Product not found
- PRD_403_001: Product not approved

**Vendors (VND):**
- VND_400_001: Invalid vendor data
- VND_404_001: Vendor not found
- VND_403_001: Vendor not approved

**Tribes (TRB):**
- TRB_400_001: Invalid tribe data
- TRB_404_001: Tribe not found

**Categories (CAT):**
- CAT_400_001: Invalid category data
- CAT_404_001: Category not found
- CAT_409_001: Category name already exists

**Contact (CNT):**
- CNT_400_001: Invalid input data
- CNT_400_002: Invalid captcha
- CNT_404_001: Product not found
- CNT_429_001: Rate limit exceeded

**System (SYS):**
- SYS_500_001: Internal server error
- SYS_503_001: Service unavailable

### 4.4 Rate Limiting Strategy

**Endpoint-Specific Limits:**
- POST /auth/login: 5 requests per 15 minutes per IP
- POST /contact-vendor: 10 requests per hour per IP
- GET /products: 100 requests per minute per IP
- Admin/Super Admin endpoints: 1000 requests per hour per user

**Implementation:**
- Use Redis or in-memory cache for rate limit tracking
- Return HTTP 429 with Retry-After header
- Log rate limit violations

---

## 5. SYSTEM ARCHITECTURE

### 5.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    HOSTINGER VPS                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  NGINX (Reverse Proxy)                 │  │
│  │  - SSL/TLS Termination (Let's Encrypt)                │  │
│  │  - Static file serving                                 │  │
│  │  - Rate limiting                                       │  │
│  │  - Gzip compression                                    │  │
│  └────────────┬──────────────────────────┬────────────────┘  │
│               │                          │                    │
│               ▼                          ▼                    │
│  ┌────────────────────┐    ┌────────────────────────┐       │
│  │  React Frontend    │    │  FastAPI Backend       │       │
│  │  (Docker)          │    │  (Docker)              │       │
│  │  - Port: 3000      │    │  - Port: 8000          │       │
│  │  - Static build    │    │  - JWT auth            │       │
│  │  - i18next         │    │  - SQLAlchemy ORM      │       │
│  └────────────────────┘    └──────────┬─────────────┘       │
│                                        │                      │
│                                        ▼                      │
│                          ┌────────────────────────┐          │
│                          │  PostgreSQL            │          │
│                          │  (Docker)              │          │
│                          │  - Port: 5432          │          │
│                          │  - Persistent volume   │          │
│                          └────────────────────────┘          │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Backup Service (Docker)                              │  │
│  │  - Cron job (weekly)                                  │  │
│  │  - pg_dump to S3                                      │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │      AWS S3          │
              │  - Product images    │
              │  - Tribe images      │
              │  - Logo              │
              │  - Database backups  │
              │  (Separate buckets)  │
              └──────────────────────┘
```

### 5.2 Component Interaction Flow

**Guest Browsing Products:**
```
Browser → NGINX → React App → FastAPI → PostgreSQL
                                    ↓
                              (Product images from S3)
```

**Buyer Contacting Vendor:**
```
Browser → NGINX → React App → FastAPI → PostgreSQL
                                    ↓
                              Rate Limiter Check
                                    ↓
                              CAPTCHA Validation
                                    ↓
                              Save Buyer + Contact Log
                                    ↓
                              Send Email with Vendor Info
```

**Admin/Super Admin Managing Content:**
```
Browser → NGINX → React App → FastAPI (JWT Auth) → PostgreSQL
                                    ↓
                              Upload to S3 (images)
                                    ↓
                              Audit Log Entry
```

**Automated Backup:**
```
Cron Job → Backup Service → pg_dump → Compress → Upload to S3
                                                      ↓
                                                Auto-prune old backups
```

### 5.3 Security Architecture

**Authentication Flow:**
```
1. Admin/Super Admin enters credentials
2. Backend validates against database (bcrypt)
3. Generate JWT access token (15 min expiry)
4. Generate JWT refresh token (7 day expiry)
5. Return both tokens to frontend
6. Frontend stores in httpOnly cookies (preferred) or localStorage
7. Every API request includes access token in Authorization header
8. Backend validates token and extracts user role
9. Check RBAC permissions for endpoint
10. Process request if authorized
```

**S3 Access Security:**
```
1. EC2 instance has IAM role attached
2. IAM role has policy allowing access ONLY to specific S3 bucket
3. Backend uses boto3 with IAM role (no access keys)
4. S3 bucket is private (no public access)
5. Images served via signed URLs (time-limited)
6. Server-side encryption enabled (AES-256)
```

**Rate Limiting:**
```
1. NGINX level: Basic rate limiting per IP
2. Application level: Endpoint-specific limits
3. Redis/in-memory cache for tracking
4. Return 429 with Retry-After header
```

### 5.4 Data Flow Diagrams

**Product View Tracking:**
```
User views product detail page
    ↓
Frontend sends GET /products/{id}
    ↓
Backend checks if product exists and is approved
    ↓
Increment view_count in products table
    ↓
Create entry in product_views table (session_id, ip, timestamp)
    ↓
Return product details with images
    ↓
Frontend displays product
```

**Contact Vendor Flow:**
```
User clicks "Contact Vendor"
    ↓
Modal opens with registration form + CAPTCHA
    ↓
User fills form and submits
    ↓
Frontend validates input
    ↓
POST /contact-vendor with buyer data + captcha token
    ↓
Backend validates CAPTCHA
    ↓
Backend checks rate limit (10 per hour per IP)
    ↓
Check if buyer email exists, if yes reuse buyer_id
    ↓
If new, create buyer record
    ↓
Create contact_log entry
    ↓
Fetch vendor contact details
    ↓
Send email to buyer with vendor info
    ↓
Return success message
    ↓
Frontend shows success notification
```

---

## 6. FOLDER STRUCTURE

### 6.1 Backend Structure (FastAPI)

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                      # FastAPI app initialization
│   ├── config.py                    # Configuration settings
│   ├── database.py                  # Database connection
│   │
│   ├── models/                      # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── tribe.py
│   │   ├── vendor.py
│   │   ├── product.py
│   │   ├── category.py
│   │   ├── buyer.py
│   │   ├── contact_log.py
│   │   ├── product_view.py
│   │   ├── audit_log.py
│   │   └── system_config.py
│   │
│   ├── schemas/                     # Pydantic schemas (request/response)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── tribe.py
│   │   ├── vendor.py
│   │   ├── product.py
│   │   ├── category.py
│   │   ├── buyer.py
│   │   └── common.py
│   │
│   ├── api/                         # API routes
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── products.py
│   │   │   ├── categories.py
│   │   │   ├── tribes.py
│   │   │   ├── contact.py
│   │   │   ├── config.py
│   │   │   ├── admin/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── users.py
│   │   │   │   ├── config.py
│   │   │   │   ├── analytics.py
│   │   │   │   └── audit_logs.py
│   │   │   └── super_admin/
│   │   │       ├── __init__.py
│   │   │       ├── tribes.py
│   │   │       ├── vendors.py
│   │   │       ├── products.py
│   │   │       ├── categories.py
│   │   │       └── analytics.py
│   │
│   ├── services/                    # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── product_service.py
│   │   ├── vendor_service.py
│   │   ├── tribe_service.py
│   │   ├── category_service.py
│   │   ├── contact_service.py
│   │   ├── s3_service.py
│   │   ├── email_service.py
│   │   └── analytics_service.py
│   │
│   ├── middleware/                  # Custom middleware
│   │   ├── __init__.py
│   │   ├── auth_middleware.py
│   │   ├── rate_limiter.py
│   │   └── error_handler.py
│   │
│   ├── utils/                       # Utility functions
│   │   ├── __init__.py
│   │   ├── jwt_utils.py
│   │   ├── password_utils.py
│   │   ├── validators.py
│   │   ├── error_codes.py
│   │   └── id_generator.py
│   │
│   └── tests/                       # Unit tests
│       ├── __init__.py
│       ├── test_auth.py
│       ├── test_products.py
│       └── test_services.py
│
├── alembic/                         # Database migrations
│   ├── versions/
│   └── env.py
│
├── requirements.txt
├── Dockerfile
└── .env.example
```

### 6.2 Frontend Structure (React)

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── locales/                     # i18next translation files
│       ├── en/
│       │   └── translation.json
│       └── te/
│           └── translation.json
│
├── src/
│   ├── App.js
│   ├── index.js
│   │
│   ├── components/                  # Reusable components
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Select.js
│   │   │   ├── Modal.js
│   │   │   ├── Toast.js
│   │   │   ├── Loader.js
│   │   │   ├── Card.js
│   │   │   └── Tooltip.js
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── Sidebar.js
│   │   │   └── Breadcrumb.js
│   │   │
│   │   └── product/
│   │       ├── ProductCard.js
│   │       ├── ProductGrid.js
│   │       ├── ProductDetail.js
│   │       ├── ProductFilters.js
│   │       └── ProductSearch.js
│   │
│   ├── pages/                       # Page components
│   │   ├── public/
│   │   │   ├── HomePage.js
│   │   │   ├── ProductsPage.js
│   │   │   ├── ProductDetailPage.js
│   │   │   ├── AboutPage.js
│   │   │   ├── TermsPage.js
│   │   │   ├── PrivacyPage.js
│   │   │   └── DisclaimerPage.js
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminLogin.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── ManageSuperAdmins.js
│   │   │   ├── SystemConfig.js
│   │   │   ├── AuditLogs.js
│   │   │   └── Reports.js
│   │   │
│   │   └── super-admin/
│   │       ├── SuperAdminLogin.js
│   │       ├── SuperAdminDashboard.js
│   │       ├── ManageTribes.js
│   │       ├── ManageVendors.js
│   │       ├── ManageProducts.js
│   │       ├── ManageCategories.js
│   │       └── Reports.js
│   │
│   ├── services/                    # API service calls
│   │   ├── api.js                   # Axios instance
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── categoryService.js
│   │   ├── tribeService.js
│   │   ├── vendorService.js
│   │   └── configService.js
│   │
│   ├── context/                     # React Context
│   │   ├── AuthContext.js
│   │   ├── ThemeContext.js
│   │   └── LanguageContext.js
│   │
│   ├── hooks/                       # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   ├── useLanguage.js
│   │   └── useDebounce.js
│   │
│   ├── utils/                       # Utility functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   │
│   ├── styles/                      # CSS/SCSS files
│   │   ├── themes/
│   │   │   ├── government-heritage.css
│   │   │   ├── tribal-earth.css
│   │   │   ├── modern-marketplace.css
│   │   │   ├── vibrant-festival.css
│   │   │   ├── eco-sustainable.css
│   │   │   └── dark-dracula.css
│   │   ├── global.css
│   │   └── variables.css
│   │
│   └── assets/                      # Static assets
│       ├── images/
│       └── icons/
│
├── package.json
├── Dockerfile
└── .env.example
```

### 6.3 DevOps Structure

```
devops/
├── docker/
│   ├── docker-compose.yml           # All services orchestration
│   ├── docker-compose.prod.yml      # Production overrides
│   ├── nginx/
│   │   ├── Dockerfile
│   │   ├── nginx.conf
│   │   └── ssl/                     # SSL certificates
│   ├── backend/
│   │   └── Dockerfile
│   ├── frontend/
│   │   └── Dockerfile
│   └── backup/
│       ├── Dockerfile
│       └── backup.py
│
├── ansible/
│   ├── inventory/
│   │   ├── hosts.ini
│   │   └── group_vars/
│   │       └── all.yml
│   ├── playbooks/
│   │   ├── setup.yml                # Initial server setup
│   │   ├── deploy.yml               # Deploy application
│   │   ├── backup.yml               # Setup backup service
│   │   └── ssl.yml                  # Setup SSL certificates
│   ├── roles/
│   │   ├── docker/
│   │   ├── nginx/
│   │   ├── app/
│   │   ├── database/
│   │   └── backup/
│   └── ansible.cfg
│
└── scripts/
    ├── backup.sh                    # Manual backup script
    ├── restore.sh                   # Manual restore script
    └── health-check.sh              # Health check script
```

---

## 7. SECURITY DESIGN

### 7.1 Authentication & Authorization Design

**JWT Token Strategy:**
- Access Token: 15 minutes expiry, contains user_id and role
- Refresh Token: 7 days expiry, stored securely
- Tokens signed with HS256 algorithm
- Secret key stored in environment variables

**Password Security:**
- Bcrypt hashing with salt rounds: 12
- Minimum password length: 8 characters
- Password complexity requirements (optional but recommended)
- No password storage in plain text anywhere

**Role-Based Access Control (RBAC):**
- Middleware checks JWT token validity
- Extract user role from token
- Match role against endpoint permissions
- Deny access if role insufficient

### 7.2 Data Security Design

**Input Validation:**
- All user inputs validated on backend (Pydantic schemas)
- Email format validation
- Phone number format validation
- URL validation for YouTube/Instagram links
- File type and size validation for uploads

**Output Sanitization:**
- HTML content (header/footer) sanitized using bleach library
- Whitelist allowed HTML tags: `<p>, <a>, <div>, <span>, <br>, <strong>, <em>`
- Strip all JavaScript and dangerous attributes
- Escape user-generated content in responses

**SQL Injection Prevention:**
- SQLAlchemy ORM with parameterized queries
- No raw SQL queries with user input
- Input validation before database operations

**XSS Prevention:**
- React automatically escapes content
- Sanitize HTML content before rendering
- Content Security Policy (CSP) headers in NGINX

**CSRF Protection:**
- SameSite cookie attribute
- CSRF tokens for state-changing operations
- Verify Origin/Referer headers

### 7.3 S3 Security Design

**Bucket Configuration:**
- Private bucket (no public access)
- Block all public access settings enabled
- Bucket policy restricts access to specific IAM role only
- Server-side encryption (SSE-S3 or SSE-KMS)
- Versioning enabled for backup bucket

**IAM Role Policy:**
```
Permissions:
- s3:PutObject (upload images)
- s3:GetObject (retrieve images)
- s3:DeleteObject (delete images)
- s3:ListBucket (list objects)

Resource:
- arn:aws:s3:::tribes-india-images/*
- arn:aws:s3:::tribes-india-backups/*

Conditions:
- Restrict to specific EC2 instance
```

**Image Access:**
- Generate signed URLs with 1-hour expiry
- URLs generated on-demand when product is viewed
- No direct S3 URLs exposed to frontend

### 7.4 Network Security Design

**HTTPS Enforcement:**
- All traffic over HTTPS (TLS 1.2+)
- HTTP requests redirected to HTTPS
- HSTS header enabled
- Let's Encrypt SSL certificates (auto-renewal)

**NGINX Security Headers:**
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
```

**Firewall Rules:**
- Allow: 80 (HTTP), 443 (HTTPS), 22 (SSH - restricted IPs)
- Deny: All other ports
- PostgreSQL port (5432) not exposed externally

### 7.5 Rate Limiting Design

**Implementation Layers:**

**Layer 1: NGINX Rate Limiting**
- Limit: 100 requests per minute per IP
- Burst: 20 requests
- Return 429 on limit exceeded

**Layer 2: Application Rate Limiting**
- Login endpoint: 5 attempts per 15 minutes per IP
- Contact vendor: 10 requests per hour per IP
- API endpoints: 1000 requests per hour per authenticated user

**Storage:**
- Use in-memory cache or Redis for tracking
- Store: IP address, endpoint, timestamp, count
- Auto-expire entries after time window

### 7.6 Audit Logging Design

**What to Log:**
- All admin/super admin actions (create, update, delete, approve, reject)
- Login attempts (success and failure)
- Configuration changes
- Failed authorization attempts
- Rate limit violations

**Log Fields:**
- User ID
- Action type
- Resource type and ID
- Old value (JSON)
- New value (JSON)
- IP address
- Timestamp
- User agent

**Log Storage:**
- Database table: audit_logs
- Retention: 1 year
- Indexed for fast querying
- Export capability for compliance

### 7.7 Backup Security Design

**Backup Encryption:**
- Database dumps compressed with gzip
- Encrypted before upload to S3
- Encryption key stored securely (AWS KMS or environment variable)

**Backup Access:**
- Separate S3 bucket for backups
- Restricted IAM permissions
- Only backup service can write
- Only admins can read/restore

**Backup Integrity:**
- Checksum verification after upload
- Test restore monthly
- Alert on backup failure

---

**Document Version**: 1.0  
**Last Updated**: February 14, 2026  
**Status**: Ready for Implementation Planning


---

## 8. PREMIUM UI/UX ENHANCEMENTS

### 8.1 Visual Design Enhancements

#### 8.1.1 Tribal Pattern Integration
**Usage Areas:**
- Hero section background (subtle tribal patterns)
- Section dividers (decorative tribal borders)
- Card corners (small tribal motifs)
- Loading animations (tribal-inspired spinners)
- Page transitions (pattern reveals)

**Pattern Library:**
- Warli art patterns (geometric, minimalist)
- Gond art patterns (dots and lines)
- Madhubani patterns (floral, geometric)
- Tribal textile patterns (weaving motifs)

**Implementation:**
- SVG patterns for scalability
- Subtle opacity (10-20%) for backgrounds
- Full opacity for decorative elements
- Animated patterns on hover/scroll

#### 8.1.2 Typography System (Premium)
**Font Pairing:**
- **Headings**: 'Playfair Display' (elegant serif) or 'Cormorant Garamond'
- **Body**: 'Inter' (clean sans-serif) or 'Source Sans Pro'
- **Accents**: 'Cinzel' (for special headings) or 'Lora'

**Font Hierarchy:**
```
Hero Heading:     3.5rem (56px) - Bold
Section Heading:  2.5rem (40px) - Semibold
Card Heading:     1.5rem (24px) - Medium
Body Large:       1.125rem (18px) - Regular
Body:             1rem (16px) - Regular
Caption:          0.875rem (14px) - Regular
```

#### 8.1.3 Spacing & Layout (Premium)
**Generous Whitespace:**
- Section padding: 80px (desktop), 48px (mobile)
- Card padding: 32px (desktop), 24px (mobile)
- Element spacing: 24px, 32px, 48px, 64px
- Breathing room around all elements

**Grid System:**
- 12-column grid (desktop)
- 8-column grid (tablet)
- 4-column grid (mobile)
- Asymmetric layouts for visual interest

### 8.2 Product Display Enhancements

#### 8.2.1 Product Card Design (Premium)
```
┌─────────────────────────────────────┐
│                                     │
│     [High-Quality Image]            │
│     (Hover: Zoom + Secondary Image) │
│                                     │
├─────────────────────────────────────┤
│  Tribe Badge (with icon)            │
│  Product Name (elegant typography)  │
│  Category • Subcategory             │
│  👁 123 views                        │
│                                     │
│  [View Details] (hover: slide up)   │
└─────────────────────────────────────┘

Hover Effects:
- Image zoom (1.05x scale)
- Subtle shadow elevation
- "View Details" button slides up
- Tribal pattern overlay (subtle)
```

**Card Variations:**
- Standard Grid Card
- Featured Card (larger, hero position)
- List View Card (horizontal layout)
- Carousel Card (for top products)

#### 8.2.2 Product Detail Page (Premium)
**Image Gallery:**
- Large main image with zoom on hover
- Thumbnail carousel below
- Lightbox for full-screen view
- Smooth transitions between images
- Lazy loading for performance

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Breadcrumb with tribal pattern divider                  │
├────────────────────────┬─────────────────────────────────┤
│                        │  Product Name (Large, Elegant)  │
│   Image Gallery        │  Tribe Badge • State            │
│   (60% width)          │  Category > Subcategory         │
│                        │                                 │
│   [Main Image]         │  Description (readable)         │
│                        │                                 │
│   [Thumbnails]         │  Artisan Story (if available)   │
│                        │                                 │
│                        │  📺 YouTube  📷 Instagram       │
│                        │                                 │
│                        │  👁 1,234 views                 │
│                        │                                 │
│                        │  [Contact Vendor] (prominent)   │
└────────────────────────┴─────────────────────────────────┘
│                                                           │
│  Related Products (Carousel with tribal divider)          │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### 8.3 Animation & Interaction Design

#### 8.3.1 Micro-Interactions
**Hover Effects:**
- Product cards: Lift + shadow
- Buttons: Scale + color shift
- Images: Zoom + overlay
- Links: Underline slide-in
- Icons: Bounce or rotate

**Scroll Animations:**
- Fade in on scroll (stagger for cards)
- Slide up on scroll (sections)
- Parallax for hero sections
- Sticky navigation with shadow on scroll

**Loading States:**
- Skeleton loaders (tribal pattern pulse)
- Smooth fade-in for images
- Progress indicators with tribal motifs
- Shimmer effects

#### 8.3.2 Page Transitions
- Smooth fade between pages
- Slide transitions for modals
- Scale transitions for images
- Tribal pattern wipe transitions

### 8.4 Hero Section Design (Premium)

**Home Page Hero:**
```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  Background: Subtle tribal pattern + gradient overlay    │
│                                                           │
│         Discover Authentic Tribal Heritage               │
│         (Large, elegant typography)                       │
│                                                           │
│         Handcrafted products from India's tribal          │
│         artisans, preserving culture and empowering       │
│         communities                                       │
│                                                           │
│         [Explore Products] [Learn More]                   │
│         (Prominent CTAs with hover effects)               │
│                                                           │
│  Decorative tribal pattern elements on sides              │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Full-width, tall hero (70vh)
- Subtle parallax scroll effect
- Animated tribal patterns
- Gradient overlay for text readability
- Smooth scroll to content

### 8.5 Category Display (Premium)

**Featured Categories Grid:**
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│             │  │             │  │             │
│  [Icon]     │  │  [Icon]     │  │  [Icon]     │
│             │  │             │  │             │
│ Handicrafts │  │  Textiles   │  │  Jewelry    │
│             │  │             │  │             │
│ 234 Products│  │ 156 Products│  │ 89 Products │
│             │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘

Hover: Card lifts, icon animates, tribal pattern overlay
```

**Category Cards:**
- Large, beautiful icons (custom tribal-inspired)
- Product count
- Hover effects (lift + pattern reveal)
- Smooth transitions

### 8.6 Filter Sidebar (Premium)

**Design:**
- Sticky sidebar on desktop
- Slide-out drawer on mobile
- Collapsible sections with smooth animations
- Checkbox/radio with custom tribal-inspired design
- Clear visual hierarchy
- "Clear All" with undo option
- Active filter badges at top

**Visual Treatment:**
- Subtle background color
- Tribal pattern dividers between sections
- Custom checkbox design (tribal motif)
- Smooth expand/collapse animations

### 8.7 Search Experience (Premium)

**Search Bar:**
- Prominent placement in header
- Instant search suggestions (dropdown)
- Recent searches
- Popular searches
- Tribal pattern loading indicator
- Smooth animations

**Search Results:**
- Highlighted search terms
- Filter by relevance/date/views
- "Did you mean?" suggestions
- Empty state with helpful suggestions

### 8.8 Footer Design (Premium)

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Tribal pattern divider (decorative)                      │
├──────────────┬──────────────┬──────────────┬─────────────┤
│              │              │              │             │
│  About       │  Quick Links │  Categories  │  Contact    │
│  Tribes India│  - Home      │  - Handicraft│  Email      │
│  (Logo)      │  - Products  │  - Textiles  │  Phone      │
│              │  - About     │  - Jewelry   │  Address    │
│  Mission     │  - Terms     │  - Pottery   │             │
│  statement   │  - Privacy   │              │  Social     │
│              │              │              │  Icons      │
│              │              │              │             │
└──────────────┴──────────────┴──────────────┴─────────────┘
│  Powered by DataLegos Tech Solutions Pvt. Ltd.           │
│  (Small, subtle, non-removable)                           │
└──────────────────────────────────────────────────────────┘
```

**Visual Treatment:**
- Earthy background color
- Tribal pattern accents
- Elegant typography
- Generous spacing
- Social icons with hover effects

### 8.9 Mobile Experience (Premium)

**Mobile-Specific Enhancements:**
- Bottom navigation bar (sticky)
- Swipeable product cards
- Pull-to-refresh
- Touch-friendly buttons (min 48x48px)
- Optimized images for mobile
- Hamburger menu with smooth slide-in
- Mobile-optimized filters (full-screen drawer)

**Performance:**
- Lazy loading images
- Progressive image loading (blur-up)
- Optimized bundle size
- Service worker for offline support (optional)

### 8.10 Accessibility Enhancements

**Visual Accessibility:**
- High contrast ratios (WCAG AAA where possible)
- Focus indicators (tribal-themed)
- Skip to content link
- Keyboard navigation support
- Screen reader friendly

**Interactive Accessibility:**
- ARIA labels on all interactive elements
- Semantic HTML
- Alt text for all images
- Form labels and error messages
- Accessible modals and dropdowns

### 8.11 Loading & Performance

**Optimization Strategies:**
- Image optimization (WebP with fallbacks)
- Lazy loading (images, components)
- Code splitting (route-based)
- CDN for static assets
- Gzip compression
- Browser caching
- Minified CSS/JS

**Loading Experience:**
- Skeleton loaders with tribal patterns
- Progressive image loading
- Smooth transitions
- No layout shifts (CLS optimization)

### 8.12 Premium UI Components

**Custom Components:**
- Tribal-themed buttons (with pattern accents)
- Custom checkboxes/radios (tribal motifs)
- Elegant dropdowns (smooth animations)
- Beautiful modals (with pattern overlays)
- Toast notifications (tribal-themed)
- Progress bars (tribal pattern fill)
- Badges (with tribal borders)
- Tooltips (elegant, informative)

**Consistency:**
- Design system documentation
- Reusable component library
- Consistent spacing, colors, typography
- Unified interaction patterns

---

**Design Philosophy Summary:**

This is not just a marketplace - it's a **digital gallery** showcasing India's tribal heritage. Every element should feel:
- **Premium**: High-quality, polished, professional
- **Cultural**: Authentic tribal aesthetics without being kitsch
- **Modern**: Contemporary UI/UX with smooth interactions
- **Accessible**: Usable by everyone, everywhere
- **Fast**: Optimized for performance
- **Beautiful**: Visually stunning, memorable experience

The website should make visitors feel they're discovering something special - authentic, handcrafted treasures from India's tribal communities, presented with the respect and elegance they deserve.

---

**Document Version**: 1.1  
**Last Updated**: February 15, 2026  
**Status**: Enhanced for Premium UI/UX - Ready for Implementation
