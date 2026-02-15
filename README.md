# 🏛 Tribes India Marketplace Portal

A government-supported web application to promote and showcase tribal products under the TRIFED "Tribes India" initiative for Andhra Pradesh, India.

## 📋 Project Overview

This platform connects buyers with tribal vendors, enabling communication and providing analytics for government decision-making. It features a premium, culturally rich UI/UX design that showcases authentic tribal products with modern e-commerce aesthetics.

## ✨ Key Features

- **Premium UI/UX**: Visually stunning, culturally authentic design
- **Multi-Language**: English and Telugu support
- **6 Themes**: Switchable color themes including Tribal Earth (default)
- **Role-Based Access**: Admin, Super Admin, Buyer, and Guest roles
- **Product Management**: Complete CRUD with image uploads to S3
- **Contact Vendor**: Light buyer registration with CAPTCHA and rate limiting
- **Analytics Dashboard**: Government decision-making insights
- **Configurable Branding**: Admin-controlled application settings
- **Secure**: JWT authentication, RBAC, audit logs, soft deletes
- **Responsive**: Mobile-first design for all devices

## 🛠 Technology Stack

### Frontend
- React (latest)
- i18next (internationalization)
- Axios (HTTP client)
- React Router (navigation)
- CSS Modules (styling)

### Backend
- Python 3.10+
- FastAPI (web framework)
- SQLAlchemy (ORM)
- Alembic (migrations)
- PyJWT (authentication)
- Bcrypt (password hashing)

### Database
- PostgreSQL 14+

### Storage
- AWS S3 (images and backups)

### DevOps
- Docker & Docker Compose
- NGINX (reverse proxy)
- Ansible (deployment automation)
- Let's Encrypt (SSL certificates)

### Hosting
- Hostinger VPS

## 📁 Project Structure

```
tribes-india-marketplace/
├── backend/              # FastAPI backend application
├── frontend/             # React frontend application
├── devops/              # Docker, Ansible, deployment scripts
├── docs/                # Additional documentation
├── REQUIREMENTS.md      # Detailed requirements specification
├── DESIGN.md           # Design specification and architecture
├── TASKS.md            # Implementation roadmap
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose
- AWS Account (for S3)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd tribes-india-marketplace
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
alembic upgrade head
uvicorn app.main:app --reload
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

4. **Database Setup**
```bash
# Create PostgreSQL database
createdb tribes_india_db
# Run migrations
cd backend
alembic upgrade head
```

### Docker Setup

```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 Documentation

- [Requirements Specification](./REQUIREMENTS.md) - Complete functional and technical requirements
- [Design Specification](./DESIGN.md) - UI/UX design, database schema, API architecture
- [Implementation Tasks](./TASKS.md) - Phase-by-phase development roadmap
- [API Documentation](http://localhost:8000/docs) - Swagger UI (when backend is running)

## 🎨 Design Philosophy

This is not just a marketplace - it's a **digital gallery** showcasing India's tribal heritage. The design features:

- **Premium Quality**: High-quality, polished, professional aesthetics
- **Cultural Authenticity**: Tribal patterns, earthy colors, handcrafted feel
- **Modern UX**: Contemporary interactions with smooth animations
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Optimized for fast loading

## 🔐 Security Features

- JWT-based authentication with short-lived tokens
- Role-Based Access Control (RBAC)
- Bcrypt password hashing
- Rate limiting (login, contact vendor)
- CAPTCHA for bot prevention
- Input validation and sanitization
- SQL injection prevention
- XSS and CSRF protection
- Audit logging for all admin actions
- Soft delete (no hard deletes)

## 🌍 Deployment

### Production Deployment with Ansible

```bash
cd devops/ansible

# Setup server (first time only)
ansible-playbook -i inventory/hosts.ini playbooks/setup.yml

# Deploy application
ansible-playbook -i inventory/hosts.ini playbooks/deploy.yml

# Setup SSL certificates
ansible-playbook -i inventory/hosts.ini playbooks/ssl.yml

# Setup backup service
ansible-playbook -i inventory/hosts.ini playbooks/backup.yml
```

### Manual Deployment

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
pytest --cov=app tests/
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

## 📊 Database Backup & Restore

### Automated Backups
- Weekly automated backups to S3
- Retention: Last 5 backups
- Compressed format (.sql.gz)

### Manual Backup
```bash
cd devops/scripts
./backup.sh
```

### Restore
```bash
cd devops/scripts
./restore.sh <backup-file>
```

## 🤝 Contributing

This is a government project. For contributions or issues, please contact the project maintainers.

## 📄 License

Proprietary - Government of Andhra Pradesh, India

## 👥 Team

- **Client**: TRIFED - Tribes India Initiative
- **Region**: Andhra Pradesh, India
- **Development**: DataLegos Tech Solutions Pvt. Ltd.

## 📞 Support

For technical support or questions:
- Email: support@tribesindiamarketplace.com
- Documentation: See docs/ folder

## 🎯 Project Status

**Current Phase**: Phase 1 - Project Setup & Infrastructure  
**Version**: 1.0.0  
**Last Updated**: February 15, 2026

---

**Powered by DataLegos Tech Solutions Pvt. Ltd.**
