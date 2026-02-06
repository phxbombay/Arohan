-- ============================================
-- AROHAN HEALTH CARE SOLUTIONS (MySQL Version)
-- Optimized for conversion from PostgreSQL
-- ============================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(36) PRIMARY KEY, -- Converted from UUID
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('patient', 'caregiver', 'doctor', 'admin') NOT NULL, -- Converted from CHECK
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Converted from TIMESTAMPTZ
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    phone_number VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    permissions JSON, -- Converted from TEXT[]
    account_locked_until DATETIME,
    last_login DATETIME
);

-- 2. DEVICES TABLE
CREATE TABLE IF NOT EXISTS devices (
    device_id VARCHAR(36) PRIMARY KEY, -- Converted from UUID
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    model_version VARCHAR(20),
    firmware_version VARCHAR(20),
    manufactured_date DATE,
    status ENUM('inventory', 'active', 'inactive', 'maintenance')
);

-- Note: This is an example of the first two tables. 
-- To complete the migration, all UUIDs must become VARCHAR(36) 
-- and all JSONB must become JSON or LONGTEXT.
