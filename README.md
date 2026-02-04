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

## 🆕 What's New

### Recently Implemented (February 2026)

✅ **Frontend Updates (Live)**
- **Hero Image**: Updated to `hero_new_1.jpg` (Happy Elderly Couple).
- **Statistics**: Removed "50K+ Lives Saved" section from Home page.
- **Linting**: Fixed TypeScript errors in `HeroSection.tsx`.

✅ **Deployment & Management**
- **New Scripts**: Added `deploy.js` for FTP upload and `ssh_restart.js` for server control.
- **Documentation**: Added `SERVER_MANAGEMENT.md` and `DEPLOYMENT_LOG.md`.

---

## 🚀 Live Deployment Guide

The production website (`haspranahealth.com`) is a Static React App served via FTP.

### How to Deploy Updates
1.  **Build**: `npm run build` (in `frontend/` folder).
2.  **Deploy**: `node deploy.js` (in root folder).
    - *Uploads `frontend/dist` to `public_html`.*

### ⚠️ Important: "I can't see my changes!"
The site uses a **Service Worker (PWA)** which caches files aggressively.
- **Symptoms**: You deploy, but Chrome still shows the old version.
- **Fix**:
    1.  Test in **Incognito Mode** (If it works there, deployment is fine).
    2.  **Clear Cache**: `Ctrl + F5` or `Ctrl + Shift + Delete`.
    3.  **Unregister Worker**: DevTools (F12) -> Application -> Service Workers -> Unregister.

For detailed server commands (Restart, SSH, etc.), see **[SERVER_MANAGEMENT.md](./SERVER_MANAGEMENT.md)**.

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
*   **Backend API**: http://localhost:8080/v1
*   **Database**: localhost:5435

---

## 🔐 Default Credentials

### Admin Dashboard Access

**URL:** http://localhost:8080/admin

**Login Credentials:**
- **Email:** `admin@arohanhealth.com`
- **Password:** `Admin123!`

> ⚠️ **IMPORTANT**: Change these credentials in production for security.

---

## 📧 Alert System Configuration

### Email Alerts (✅ Operational)

**Service:** Ethereal Email (Test SMTP)
- **Status:** ✅ Configured and working
- **Purpose:** Development and testing
- **View Sent Emails:** https://ethereal.email/messages
- **Test Inbox Login:**
  - Email: `g5sqk4lva5kkhkzs@ethereal.email`
  - Password: `xcgDwhT8E5MvxTJASd`

**Features:**
- ✅ Emergency alert emails with HTML templates
- ✅ Contact form notifications
- ✅ Location links (Google Maps)
- ✅ Alert priority indicators

**Test Email Delivery:**
```bash
docker exec arohan-backend node /app/test_email_alert.js
```

**For Production:**
Replace Ethereal with:
- **Gmail** (with App Password) - Recommended for small scale
- **SendGrid** - 100 emails/day free tier
- **AWS SES** - $0.10 per 1,000 emails

See `gmail_smtp_setup.md` for detailed instructions.

---

### SMS Alerts (✅ Operational)

**Service:** Twilio
- **Status:** ✅ Configured and working
- **From Number:** `+17407933749` (US Trial Number)
- **Account:** Arohan Health / info@haspranahealth.com

**Features:**
- ✅ Rate limiting: 10 SMS per phone number per minute
- ✅ International phone number support (auto E.164 formatting)
- ✅ Emergency alerts bypass rate limits
- ✅ Cost protection safeguards
- ✅ Phone number masking in logs (privacy)

**Supported Formats (Auto-converted):**
- `9876543210` → `+919876543210` (India)
- `09876543210` → `+919876543210` (India)
- `+14155551234` → USA
- `+442012345678` → UK
- All E.164 international formats

**Test SMS Delivery:**
```bash
# Replace with your verified phone number
docker exec -e TEST_PHONE_NUMBER=+919876543210 arohan-backend node /app/test_sms.js
```

**Trial Account Limitations:**
- Can only send SMS to verified phone numbers
- SMS includes "Sent from Twilio trial account" footer
- $15.50 USD free credit (~500+ messages)

**For Production:**
- Upgrade Twilio account (pay-as-you-go)
- India SMS: ₹0.50 - ₹2 per message
- USA SMS: $0.0079 per message
- Set spending limits in Twilio Console

See `twilio_sms_setup.md` for detailed instructions.

---

## ✨ Features

### For Patients
- ✅ **Authentication**: Register/Login with JWT
- ✅ **Dashboard**: Real-time health vitals (Heart rate, SpO2, etc.)
- ✅ **Emergency Alerts**: 
  - Manual SOS button
  - Fall detection alerts
  - Heart rate abnormality alerts
  - Low SpO2 alerts
  - Email + SMS notifications to emergency contacts
- ✅ **First Aid Guidance**: Step-by-step instructions
- ✅ **Contact Form**: Submit inquiries to admin
- ✅ **Shop**: Product listing and Cart (E-commerce)

### For Admins
- ✅ **Admin Dashboard**: User management and statistics
- ✅ **RBAC**: Role-Based Access Control (Patient vs Doctor vs Admin)
- ✅ **Contact Messages**: View, search, and export submissions
- ✅ **User Management**: Create and manage user accounts
- ✅ **Audit Logs**: System activity tracking
- ✅ **Analytics**: Dashboard metrics and insights

### Emergency Alert Flow
```
User Triggers Emergency (SOS/Fall/Abnormal Vitals)
           ↓
Backend API /v1/alerts/trigger
           ↓
Fetch Emergency Contacts from Database
           ↓
For Each Contact:
  ├─→ Send Email (HTML template with location)
  └─→ Send SMS (if phone number exists)
           ↓
Log Delivery Status
           ↓
Return Success/Failure to User
```

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

### Authentication
*   **POST** `/v1/auth/register` - Create account
*   **POST** `/v1/auth/login` - Login (Returns JWT)
*   **POST** `/v1/auth/logout` - Logout
*   **GET** `/v1/auth/profile` - Get current user profile

### Users (Protected)
*   **GET** `/v1/users/me` - Get own profile
*   **PUT** `/v1/users/me` - Update own profile

### Emergency Alerts (Protected)
*   **POST** `/v1/alerts/trigger` - Trigger emergency alert
*   **GET** `/v1/alerts/active` - Get active alerts
*   **PUT** `/v1/alerts/:id/resolve` - Resolve an alert

### Contact
*   **POST** `/v1/contact` - Submit contact form

### Admin (Protected - Admin Only)
*   **GET** `/v1/admin/stats` - Dashboard statistics
*   **GET** `/v1/admin/users` - List all users
*   **POST** `/v1/admin/users` - Create user
*   **GET** `/v1/admin/messages` - List contact messages
*   **GET** `/v1/admin/logs` - System audit logs

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

