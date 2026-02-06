# 🏥 Arohan Health - AI-Powered Wearable Emergency Detection Platform

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)

> **Enterprise-grade health monitoring platform with wearable device integration, emergency detection, and first aid guidance.**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [What's New](#-whats-new)
- [Quick Start](#-quick-start)
- [Default Credentials](#-default-credentials)
- [Alert System Configuration](#-alert-system-configuration)
- [Features](#-features)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Production Deployment](#-production-deployment)

---

## 🎯 Overview

Arohan Health is a comprehensive healthcare platform that combines wearable device monitoring, AI-powered emergency detection, and real-time first aid guidance.

### Technology Stack
- **Frontend:** React 18, TypeScript, Vite, Material-UI, Zustand
- **Backend:** Node.js, Express, PostgreSQL 15, Zod, JWT
- **Alerts:** Nodemailer (Email), Twilio (SMS)
- **Infrastructure:** Docker, Nginx (Proxy)

---

## 🆕 What's New (February 2026 Sprint)

### ✅ Core Features Completed
- **Role-Based Dashboards**: Customized views for `/hospital/dashboard`, `/physician/dashboard`, and `/patient/dashboard`.
- **Deep Compliance Module**: `/compliance` - HIPAA, GDPR, DPDPA 2023, ISO 27001 documentation.
- **Consulting Services**: `/consulting` - Service showcase, case studies, and lead generation form.
- **Multi-Channel Support**: WhatsApp Business API integration & Social Media sharing.
- **Internationalization (i18n)**: Full support for English, Hindi (हिन्दी), and Kannada (ಕನ್ನಡ).
- **Payment & Integrations**: `/integrations` - Payment gateway (Razorpay/Stripe) and device SDK docs.

### ✅ Security & Performance
- **Authentication**: JWT Refresh Token rotation, "Remember Me" session management, and Account Lockout policies.
- **Infrastructure Security**: AWS WAF rules, Security Groups (IaC), and Secrets configuration.
- **Advanced Security**: SQL Injection protection, XSS filtering, Rate Limiting, CAPTCHA v3, Helmet, and CSP.
- **Performance Monitoring**: Prometheus metrics collection & Admin Dashboard (`/admin/metrics`).
- **SEO Engines**: Open Graph, Twitter Cards, JSON-LD, and XML Sitemap generation.

---

## 🚀 Quick Start (Docker Only)

The entire application is containerized. You do not need Node.js or PostgreSQL installed locally.

### 1. Prerequisites
- **Docker Desktop** (Running)
- **Git**

### 2. Clone Repository
```bash
git clone https://github.com/yourusername/arohan-health.git
cd arohan-health
```

### 3. Run Application
```bash
docker-compose up -d --build
```
This single command builds the images, sets up the database, and starts the proxy.

### 4. Access Points
*   **Frontend**: http://localhost:8080
*   **Admin Dashboard**: http://localhost:8080/admin
*   **Performance Metrics**: http://localhost:8080/admin/metrics
*   **Backend API**: http://localhost:8080/v1
*   **Database**: localhost:5435
*   **MailHog/Ethereal**: Check logs for URL

---

## 🔐 Default Credentials

Use these credentials to test different role-based access controls (RBAC).

### 1. System Admin
*   **URL**: http://localhost:8080/admin
*   **Email**: `admin@arohanhealth.com`
*   **Password**: `Admin123!`
*   **Access**: Full system control, User Management, Logs, Metrics, CMS.

### 2. Physician / Doctor
*   **URL**: http://localhost:8080/dashboard
*   **Email**: `doctor@arohanhealth.com` (Create if not exists)
*   **Password**: `Doctor123!`
*   **Access**: Patient Vitals, Emergency Alerts, Prescriptions.

### 3. Hospital Administrator
*   **URL**: http://localhost:8080/dashboard
*   **Email**: `hospital@arohanhealth.com` (Create if not exists)
*   **Password**: `Hospital123!`
*   **Access**: Staff management, Department stats.

### 4. Patient
*   **URL**: http://localhost:8080/login
*   **Email**: `patient@test.com` (Create via Register)
*   **Password**: `Patient123!`
*   **Access**: Personal Vitals, Shop, Emergency SOS.

> ⚠️ **IMPORTANT**: These are development credentials. Change immediately in production.

---

## ✨ Features

### 🏢 Corporate & Consulting (`/consulting`)
- **Services Showcase**: Web/App Development, AI/ML Integrations, Cloud Infrastructure.
- **Case Studies**: Real-world success stories with metrics.
- **Lead Generation**: Smart inquiry form with budget estimator.
- **Tech Stack**: Visual display of Arohan's technology expertise.

### ⚖️ Compliance & Privacy (`/compliance`)
- **Regulatory Frameworks**: 
  - **HIPAA** (USA) - PHI Security
  - **GDPR** (EU) - Data Privacy Rights
  - **DPDPA 2023** (India) - Data Fiduciary obligations
- **Certifications**: Status tracking for ISO 27001, SOC 2.
- **Security Transparency**: Encryption standards (AES-256), Access Controls.

### 🌐 Internationalization (i18n)
- **Language Switcher**: Seamless toggling between languages in Header.
- **Supported Languages**:
  - English (Default)
  - Hindi (हिन्दी)
  - Kannada (ಕನ್ನಡ)
- **Auto-Detection**: Browser language detection with persistence.

### 💬 Multi-Channel Engagement
- **Social Sharing**: Share products/articles to WhatsApp, Facebook, LinkedIn, Twitter.
- **WhatsApp Integration**:
  - Emergency Alerts to family via WhatsApp.
  - Appointment reminders and health reports.
  - Social sharing directly to WhatsApp contacts.

### 📊 Role-Based Analytics
- **Hospital Admin**: Bed occupancy tracking, physician availability, and critical alert monitoring.
- **Physician**: Patient vitals overview, active alerts list, and patient search.
- **Patient**: Personal health stats, daily activity logs, and quick actions (SOS).

### 💳 Integrations & Payments (`/integrations`)
- **Payment Gateways**: Documentation for Razorpay, Stripe, PayPal.
- **Device SDK**: Guide for connecting wearables (BLE/Smartwatches).
- **API Docs**: Developer resources for partners.

### 📊 Admin Power Tools
- **Performance Dashboard**: Real-time request tracking, error rates, system health.
- **Audit Logs**: Deep tracking of who did what and when.
- **Message Center**: Centralized management of contact inquiries.

---

## 🏗️ Architecture

### System Components

```
┌─────────────────┐
│   React App     │  (Port 8080)
│   (Frontend)    │
└────────┬────────┘
         │
    ┌────▼─────┐
    │  Nginx   │  (Reverse Proxy)
    │  Proxy   │
    └────┬─────┘
         │
    ┌────▼──────────┐
    │  Express API  │  (Port 5000)
    │  (Backend)    │
    └────┬──────────┘
         │
    ┌────▼──────────┐
    │  PostgreSQL   │  (Port 5435)
    │  Database     │
    └───────────────┘

External Services:
├─→ Ethereal Email (SMTP)
└─→ Twilio (SMS)
```

### Database Schema

**Key Tables:**
- `users` - Authentication and profiles
- `emergency_contacts` - Patient emergency contact information
- `emergency_alerts` - Alert history and status
- `contact_messages` - Contact form submissions (encrypted)
- `audit_logs` - System activity tracking
- `push_subscriptions` - Browser push notifications

---

## 📁 Project Structure

```
arohan-health/
├── backend/                    # Node.js API
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   │   ├── emergencyAlertService.js  # Email alerts
│   │   │   ├── smsService.js            # SMS alerts
│   │   │   └── notificationService.js   # Push notifications
│   │   ├── middleware/        # Auth, RBAC, rate limiting
│   │   ├── config/            # Email, DB, logger
│   │   └── utils/             # Helpers, encryption
│   ├── schema.sql             # Database schema
│   ├── test_email_alert.js    # Email testing script
│   ├── test_sms.js           # SMS testing script
│   ├── package.json
│   └── Dockerfile
│
├── frontend/                   # React App
│   ├── src/
│   │   ├── app/               # Pages and layouts
│   │   │   ├── pages/
│   │   │   │   ├── SignInPage.tsx
│   │   │   │   └── admin/     # Admin dashboard pages
│   │   │   │       └── MessagesPage.jsx
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── health/        # Health monitoring
│   │   │   └── admin/         # Admin features
│   │   ├── shared/            # Shared components
│   │   └── core/              # API client, config
│   ├── nginx.conf             # Nginx proxy config
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml         # Container orchestration
├── README.md                  # This file
└── .env                       # Environment variables
```

---

## 📚 API Documentation

## 📚 API Documentation

### Authentication & Access
*   **POST** `/v1/auth/register` - Create account
*   **POST** `/v1/auth/login` - Login (Returns JWT + Refresh Token)
*   **POST** `/v1/auth/logout` - Logout
*   **GET** `/v1/auth/profile` - Get current user profile

### Consulting & Leads
*   **POST** `/v1/leads/consulting` - Submit consulting project inquiry

### Multi-Channel
*   **POST** `/v1/whatsapp/send` - Send WhatsApp notification (Protected)
*   **GET** `/v1/whatsapp/webhook` - Webhook verification
*   **POST** `/v1/whatsapp/webhook` - Receive incoming messages

### Admin & Monitoring (Admin Only)
*   **GET** `/v1/admin/stats` - Main Dashboard statistics
*   **GET** `/v1/admin/metrics` - **[NEW]** Prometheus Performance Metrics
*   **GET** `/v1/admin/users` - List all users with RBAC
*   **GET** `/v1/admin/logs` - detailed system audit logs

### Emergency Alerts (Protected)
*   **POST** `/v1/alerts/trigger` - Trigger emergency alert (SOS/Fall)
*   **GET** `/v1/alerts/active` - Get active alerts
*   **PUT** `/v1/alerts/:id/resolve` - Resolve an alert

---

## 🧪 Testing

### Test Email System
```bash
# Sends a test emergency alert email
docker exec arohan-backend node /app/test_email_alert.js

# View the sent email at:
# https://ethereal.email/messages
# Login: g5sqk4lva5kkhkzs@ethereal.email / xcgDwhT8E5MvxTJASd
```

### Test SMS System
```bash
# Replace +919876543210 with YOUR verified Twilio phone number
docker exec -e TEST_PHONE_NUMBER=+919876543210 arohan-backend node /app/test_sms.js

# You should receive an SMS within seconds
```

### Test Emergency Alert Flow
```bash
# Use Postman or curl to trigger an alert
curl -X POST http://localhost:8080/v1/alerts/trigger \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "manual_sos",
    "location": {
      "lat": 12.9716,
      "lng": 77.5946
    }
  }'

# Check Ethereal inbox for email AND your phone for SMS
```

### Manual Testing Checklist
- [ ] Admin login with `admin@arohanhealth.com` / `Admin123!`
- [ ] Navigate to `/admin` - should work without errors
- [ ] Submit contact form - check admin Messages page
- [ ] Trigger emergency alert - verify email + SMS received
- [ ] Check Ethereal inbox - verify HTML formatting
- [ ] Verify SMS received on verified phone number
- [ ] Test CSV export from Messages page
- [ ] Check admin dashboard statistics

---

## 🚀 Production Deployment

### 1. Environment Variables

**Critical Changes Required:**

```yaml
# In docker-compose.yml or backend/.env

# Database (use strong password)
DB_PASSWORD: <generate-secure-password>

# JWT (generate random 64-char string)
JWT_SECRET: <generate-random-secret>

# Email - Replace with production SMTP
SMTP_HOST: smtp.gmail.com  # or smtp.sendgrid.net
SMTP_PORT: 587
SMTP_USER: <your-production-email>
SMTP_PASSWORD: <gmail-app-password or sendgrid-api-key>
ADMIN_EMAIL: info@haspranahealth.com

# SMS - Update if needed
TWILIO_ACCOUNT_SID: <your-twilio-account-sid>
TWILIO_AUTH_TOKEN: <your-twilio-auth-token>
TWILIO_PHONE_NUMBER: <your-twilio-number>

# Security
NODE_ENV: production
ALLOWED_ORIGINS: https://yourdomain.com
```

### 2. Security Hardening

- [ ] Change admin password from `Admin123!`
- [ ] Enable HTTPS (SSL/TLS certificates)
- [ ] Set up firewall rules
- [ ] Configure rate limiting (already enabled)
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Review and rotate secret keys monthly

### 3. Email Service Upgrade

**Option A: Gmail**
- Generate App Password: https://myaccount.google.com/apppasswords
- Cost: Free (500 emails/day limit)
- See: `gmail_smtp_setup.md`

**Option B: SendGrid** (Recommended)
- Sign up: https://sendgrid.com/
- Free tier: 100 emails/day
- Better deliverability than Gmail

**Option C: AWS SES**
- Cost: $0.10 per 1,000 emails
- Best for high-volume production

### 4. SMS Service Upgrade

- [ ] Upgrade Twilio account from trial
- [ ] Set spending limits in Twilio Console
- [ ] Buy local phone numbers for each market
- [ ] Enable Twilio webhook signatures
- [ ] Monitor SMS delivery logs

### 5. Monitoring

**Backend Logs:**
```bash
docker logs arohan-backend -f
```

**Database Connection:**
```bash
docker exec -it arohan-db psql -U postgres -d arohan_health_db
```

**Email Delivery:** Check SMTP provider dashboard

**SMS Delivery:** https://console.twilio.com/monitor/logs/sms

---

## 📞 Support

**Company:** Arohan Health / Hasprana Health  
**Email:** info@haspranahealth.com  
**Website:** haspranahealth.com

---

## 📄 License

Proprietary - All Rights Reserved

