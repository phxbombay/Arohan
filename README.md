# 🏥 Arohan Health - AI-Powered Wearable Emergency Detection Platform

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)
[![MySQL](https://img.shields.io/badge/mysql-8.0-orange.svg)](https://www.mysql.com/)

> **Enterprise-grade health monitoring platform with wearable device integration, emergency detection, and first aid guidance.**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Quick Start (Docker)](#-quick-start-docker)
- [Manual Setup](#-manual-setup)
- [Features & API](#-features--api)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Production Deployment](#-production-deployment)
- [Default Credentials](#-default-credentials)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

Arohan Health is a comprehensive healthcare platform that combines wearable device monitoring, AI-powered emergency detection, and real-time first aid guidance. It seamlessly connects patients, doctors, and hospital administrators.

### Technology Stack
- **Frontend:** React 18, TypeScript, Vite, Material-UI, Zustand, i18n
- **Backend:** Node.js, Express, MySQL 8.0, Zod, JWT
- **Communication:** Nodemailer (Email), Twilio (SMS), WhatsApp Business API
- **Payments:** Razorpay, Stripe, PhonePe
- **Infrastructure:** Docker, Nginx (Reverse Proxy)

---

## �️ Architecture

```mermaid
graph TD
    User[User / Client] -->|HTTPS| Nginx[Nginx Reverse Proxy]
    
    subgraph "Docker Network"
        Nginx -->|Static Assets| React[React Frontend]
        Nginx -->|API Requests /v1| Express[Express Backend]
        
        Express -->|SQL| MySQL[(MySQL 8.0)]
        Express -->|SMTP| MailHog[MailHog (Dev Email)]
    end
    
    subgraph "External Services"
        Express -->|SMS| Twilio
        Express -->|Email| Gmail/SendGrid
        Express -->|Payment| Razorpay/PhonePe
        Express -->|Chat| WhatsAppAPI
    end
```

---

## 🚀 Quick Start (Docker)

The application is fully containerized. You do not need Node.js or MySQL installed locally.

### 1. Prerequisites
- **Docker Desktop** (Running)
- **Git**

### 2. Clone Repository
```bash
git clone https://github.com/yourusername/arohan-health.git
cd arohan-health
```

### 3. Environment Setup
The project includes default configurations for development. For production, create a `.env` file based on `.env.example`.

### 4. Run Application
```bash
# Build and start all services
docker compose up -d --build
```
*Note: The initial build may take a few minutes as it compiles the frontend and backend.*

### 5. Access Points
| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | [http://localhost:8080](http://localhost:8080) | Main Application |
| **Backend API** | [http://localhost:8080/v1](http://localhost:8080/v1) | API Endpoints |
| **Admin Dashboard** | [http://localhost:8080/admin](http://localhost:8080/admin) | System Administration |
| **MailHog** | [http://localhost:8025](http://localhost:8025) | View Test Emails |
| **Database** | `localhost:3306` | MySQL (User: root) |

---

## 🛠️ Manual Setup (Without Docker)

If you prefer running locally without Docker:

### Backend
```bash
cd backend
npm install
# Ensure MySQL is running locally and update .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## ✨ Features & API

The platform exposes a RESTful API at `/v1`.

### Key Modules
- **Authentication**: JWT-based auth with Refresh Tokens & RBAC.
- **Emergency Alerts**: `/v1/alerts` - Trigger SOS, notifying via SMS/Email/WhatsApp.
- **Vitals Monitoring**: `/v1/vitals` - Track Heart Rate, SpO2, BP.
- **Consulting**: `/v1/consulting` - Lead generation for B2B services.
- **E-Commerce**: `/v1/orders`, `/v1/cart`, `/v1/payment` - Health product store.
- **Blog/CMS**: `/v1/blog` - Health articles and detailed content.
- **Internationalization**: Support for English, Hindi, and Kannada.

---

## 📁 Project Structure

```
arohan-health/
├── backend/
│   ├── src/
│   │   ├── config/            # DB, Logger, Swagger config
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, Validation, Security
│   │   ├── models/            # Data models
│   │   ├── routes/            # API Route definitions
│   │   ├── services/          # Business logic (Alerts, Email, Payment)
│   │   ├── utils/             # Helper functions
│   │   ├── validators/        # Zod/Express validators
│   │   └── index.js           # Entry point
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── app/               # App routing and pages
│   │   ├── features/          # Feature-based modules (Auth, Admin, Vitals)
│   │   ├── shared/            # Reusable UI components
│   │   ├── services/          # API services
│   │   ├── context/           # React Context (Auth, Theme)
│   │   └── main.tsx           # Entry point
│   ├── nginx.conf             # Nginx configuration
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml         # Container orchestration
└── README.md                  # This file
```

---

## 🧪 Testing

The backend includes comprehensive test suites using **Vitest** and **Playwright**.

### Running Tests in Docker
You can run tests directly inside the running backend container:

```bash
# Unit & Integration Tests (Vitest)
docker exec arohan-backend npm test

# Load Testing
docker exec arohan-backend npm run test:load
```

### Manual Verification
1.  **Trigger SOS**: Log in as Patient -> Click CLI SOS -> Check MailHog ([http://localhost:8025](http://localhost:8025)) for the alert email.
2.  **API Docs**: Visit `/api-docs` (if enabled) or use Postman collection.

---

## 🚀 Production Deployment

### 1. Security Checklist
-   [ ] **Change Secrets**: Update `JWT_SECRET`, `DB_PASSWORD` in `.env`.
-   [ ] **HTTPS**: Configure SSL in Nginx or external load balancer.
-   [ ] **Disable MailHog**: Remove MailHog service from production `docker-compose.yml`.
-   [ ] **Environment**: Set `NODE_ENV=production`.

### 2. Environment Variables (.env)
Create a production `.env` file with real credentials:

```ini
NODE_ENV=production
PORT=5000
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=strong_password
DB_NAME=arohan_health_db
JWT_SECRET=complex_random_string
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_key
TWILIO_SID=your_sid
TWILIO_TOKEN=your_token
APP_URL=https://yourdomain.com
```

---

## 🔐 Default Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@arohanhealth.com` | `Admin123!` | Full System Access |
| **Doctor** | `doctor@arohanhealth.com` | `Doctor123!` | Patient Data, Alerts |
| **Hospital** | `hospital@arohanhealth.com` | `Hospital123!` | Staff, Bed Management |
| **Patient** | `patient@test.com` | `Patient123!` | Personal Vitals, SOS |

---

## ❓ Troubleshooting

### Backend Fails to Start
-   **Check Logs**: `docker logs arohan-backend`
-   **Database**: Ensure MySQL is healthy (`docker ps`). The backend waits for it.
-   **Permissions**: If you see `EACCES` errors, ensure the Dockerfile user has permissions (already handled in default setup).

### Frontend Not Updating
-   **Browser Cache**: Hard refresh (Ctrl+F5).
-   **Rebuild**: `docker compose up -d --build frontend` to force a re-compile.

### Email Not Received
-   **Dev Mode**: Check MailHog at http://localhost:8025. Emails are trapped there by default.
-   **Prod Mode**: Check SMTP credentials in `.env`.

---

## 📄 License
Proprietary - All Rights Reserved © 2026 Arohan Health
