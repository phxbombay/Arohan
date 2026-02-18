-- ============================================
-- AROHAN HEALTH CARE SOLUTIONS (MySQL Version)
-- Complete Database Schema (Unified)
-- Version: 2.0 (MySQL optimized)
-- ============================================

-- Enable UUID functions if available, otherwise we use application-level UUIDs
-- Note: MySQL 8+ supports BINARY(16) for UUIDs, but VARCHAR(36) is easier for manual management

-- 1. USERS TABLE
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS push_subscriptions;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS webhook_logs;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS early_access_leads;
DROP TABLE IF EXISTS emergency_contacts;
DROP TABLE IF EXISTS emergency_alerts;
DROP TABLE IF EXISTS health_simulations;
DROP TABLE IF EXISTS health_vitals;
DROP TABLE IF EXISTS user_devices;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('patient', 'caregiver', 'doctor', 'admin', 'physician', 'hospital_admin', 'partner') NOT NULL,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    phone_number VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    permissions JSON,
    account_locked_until DATETIME,
    last_login DATETIME
);

-- 1.5 REFRESH TOKENS
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE INDEX idx_refresh_token_hash ON refresh_tokens(token_hash);

-- 1.6 OTP CODES
CREATE TABLE IF NOT EXISTS user_otps (
    otp_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    purpose VARCHAR(20) DEFAULT 'login',
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE INDEX idx_otp_user ON user_otps(user_id);

-- 2. DEVICES TABLE
CREATE TABLE IF NOT EXISTS devices (
    device_id VARCHAR(36) PRIMARY KEY,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    model_version VARCHAR(20),
    firmware_version VARCHAR(20),
    manufactured_date DATE,
    status ENUM('inventory', 'active', 'inactive', 'maintenance')
);

-- 3. USER_DEVICES
CREATE TABLE IF NOT EXISTS user_devices (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    device_id VARCHAR(36),
    is_primary BOOLEAN DEFAULT TRUE,
    paired_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

-- 4. HEALTH_VITALS
CREATE TABLE IF NOT EXISTS health_vitals (
    record_id VARCHAR(36),
    user_id VARCHAR(36),
    device_id VARCHAR(36),
    recorded_at DATETIME NOT NULL,
    heart_rate INT,
    steps INT,
    oxygen_level INT,
    body_temp DECIMAL(4,1),
    battery_level INT,
    raw_data JSON,
    PRIMARY KEY (user_id, recorded_at),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (device_id) REFERENCES devices(device_id)
);

-- 5. HEALTH SIMULATIONS
CREATE TABLE IF NOT EXISTS health_simulations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    snapshot_data JSON NOT NULL,
    analysis_data JSON NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 6. EMERGENCY_ALERTS
CREATE TABLE IF NOT EXISTS emergency_alerts (
    alert_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    type ENUM('fall_detected', 'cardiac_arrest', 'manual_sos', 'abnormal_vitals'),
    status ENUM('triggered', 'acknowledged', 'resolved', 'false_alarm') DEFAULT 'triggered',
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 7. EMERGENCY_CONTACTS
CREATE TABLE IF NOT EXISTS emergency_contacts (
    contact_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    relation VARCHAR(50),
    priority INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 7.5 MARKETING & LEADS
CREATE TABLE IF NOT EXISTS early_access_leads (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    city VARCHAR(100),
    use_case TEXT,
    status VARCHAR(20) DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_early_access_email ON early_access_leads(email);

-- 8. SHOPPING CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    image_url VARCHAR(500),
    features JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_product (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 9. AUDIT_LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id VARCHAR(36) PRIMARY KEY,
    actor_user_id VARCHAR(36),
    action VARCHAR(255) NOT NULL,
    target_record_id VARCHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_user_id) REFERENCES users(user_id)
);

-- 10. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(36),
    amount INTEGER NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    receipt VARCHAR(50),
    status VARCHAR(20) DEFAULT 'start',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 11. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    payment_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50),
    signature VARCHAR(255),
    amount INTEGER NOT NULL,
    method VARCHAR(50),
    transaction_fee INTEGER,
    tax INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- 12. WEBHOOK LOGS
CREATE TABLE IF NOT EXISTS webhook_logs (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(50),
    event_type VARCHAR(50),
    payload JSON,
    processed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_webhook_event_id ON webhook_logs(event_id);

-- 13. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 14. BLOGS
CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    category VARCHAR(50) DEFAULT 'Healthcare',
    tags JSON,
    author_name VARCHAR(100) DEFAULT 'Arohan Team',
    status VARCHAR(20) DEFAULT 'draft',
    view_count INTEGER DEFAULT 0,
    publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    external_source JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);

-- 15. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(50),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_details JSON,
    items JSON,
    pricing JSON,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20),
    status VARCHAR(20) DEFAULT 'issued',
    pdf_path VARCHAR(500),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- 16. PUSH SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    endpoint VARCHAR(512) NOT NULL,
    p256dh VARCHAR(255) NOT NULL,
    auth VARCHAR(255) NOT NULL,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_endpoint (user_id, endpoint),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE INDEX idx_push_user ON push_subscriptions(user_id);
