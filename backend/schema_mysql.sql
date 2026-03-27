-- ============================================
-- AROHAN HEALTH CARE SOLUTIONS (MySQL Version)
-- Complete Database Schema (Unified & Optimized)
-- Version: 3.0 (MySQL 8.0 Optimized)
-- ============================================

-- SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SET time_zone = "+00:00";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('patient', 'caregiver', 'doctor', 'admin', 'physician', 'hospital_admin', 'partner') NOT NULL,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    phone_number VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    account_locked_until DATETIME,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_active (is_active),
    INDEX idx_user_email (email)
);

-- 1.5 REFRESH TOKENS
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_refresh_token_hash (token_hash),
    INDEX idx_refresh_user_id (user_id)
);

-- 1.6 OTP CODES
CREATE TABLE IF NOT EXISTS user_otps (
    otp_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    purpose VARCHAR(20) DEFAULT 'login',
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_otp_user (user_id),
    INDEX idx_otp_code (otp_code)
);

-- 2. DEVICES TABLE
CREATE TABLE IF NOT EXISTS devices (
    device_id VARCHAR(36) PRIMARY KEY,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    model_version VARCHAR(20),
    firmware_version VARCHAR(20),
    manufactured_date DATE,
    status ENUM('inventory', 'active', 'inactive', 'maintenance') DEFAULT 'inventory',
    INDEX idx_device_status (status)
);

-- 3. USER_DEVICES
CREATE TABLE IF NOT EXISTS user_devices (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    device_id VARCHAR(36) NOT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    paired_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
    INDEX idx_user_device_user (user_id),
    INDEX idx_user_device_device (device_id)
);

-- 4. HEALTH_VITALS (Optimized Data Types)
CREATE TABLE IF NOT EXISTS health_vitals (
    record_id VARCHAR(36),
    user_id VARCHAR(36) NOT NULL,
    device_id VARCHAR(36),
    recorded_at DATETIME NOT NULL,
    heart_rate SMALLINT UNSIGNED,
    steps MEDIUMINT UNSIGNED,
    oxygen_level TINYINT UNSIGNED,
    body_temp DECIMAL(4,1),
    battery_level TINYINT UNSIGNED,
    raw_data JSON,
    PRIMARY KEY (user_id, recorded_at),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE SET NULL,
    INDEX idx_vitals_recorded_at (recorded_at)
);

-- 5. HEALTH SIMULATIONS
CREATE TABLE IF NOT EXISTS health_simulations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    snapshot_data JSON NOT NULL,
    analysis_data JSON NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_sim_user (user_id),
    INDEX idx_sim_recorded_at (recorded_at)
);

-- 6. EMERGENCY_ALERTS
CREATE TABLE IF NOT EXISTS emergency_alerts (
    alert_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type ENUM('fall_detected', 'cardiac_arrest', 'manual_sos', 'abnormal_vitals') NOT NULL,
    status ENUM('triggered', 'acknowledged', 'resolved', 'false_alarm') DEFAULT 'triggered',
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_alerts_user (user_id),
    INDEX idx_alerts_status (status),
    INDEX idx_alerts_triggered_at (triggered_at)
);

-- 7. EMERGENCY_CONTACTS
CREATE TABLE IF NOT EXISTS emergency_contacts (
    contact_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL, -- Larger for encryption
    relation VARCHAR(50),
    priority TINYINT UNSIGNED DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_emergency_contact_user (user_id)
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_leads_email (email),
    INDEX idx_leads_status (status)
);

-- 8. SHOPPING CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price INT UNSIGNED NOT NULL, -- Stored in paise/cents
    quantity SMALLINT UNSIGNED NOT NULL DEFAULT 1,
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
    FOREIGN KEY (actor_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_audit_actor (actor_user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_timestamp (timestamp)
);

-- 10. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    amount INT UNSIGNED NOT NULL, -- Stored in paise/cents
    currency VARCHAR(10) DEFAULT 'INR',
    receipt VARCHAR(50),
    status VARCHAR(20) DEFAULT 'created',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created_at (created_at)
);

-- 11. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    payment_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    signature VARCHAR(255),
    amount INT UNSIGNED NOT NULL, -- Stored in paise/cents
    method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    transaction_fee INT UNSIGNED,
    tax INT UNSIGNED,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_payments_order (order_id),
    INDEX idx_payments_created_at (created_at)
);

-- 12. WEBHOOK LOGS
CREATE TABLE IF NOT EXISTS webhook_logs (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(50) UNIQUE NOT NULL,
    event_type VARCHAR(50),
    payload JSON,
    processed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_webhook_event_type (event_type)
);

-- 13. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contact_email (email),
    INDEX idx_contact_status (status)
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
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    view_count INT UNSIGNED DEFAULT 0,
    publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_blogs_status (status),
    INDEX idx_blogs_category (category),
    INDEX idx_blogs_publish_date (publish_date)
);

-- 15. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
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
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_invoice_order (order_id),
    INDEX idx_invoice_number (invoice_number)
);

-- 16. PUSH SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    endpoint VARCHAR(512) NOT NULL,
    p256dh VARCHAR(255) NOT NULL,
    auth VARCHAR(255) NOT NULL,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_endpoint (user_id, endpoint),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_push_user (user_id)
);

-- 17. CHATS
CREATE TABLE IF NOT EXISTS chats (
    chat_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) DEFAULT 'New Chat',
    status VARCHAR(50) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_chats_user (user_id),
    INDEX idx_chats_status (status)
);

-- 18. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS chat_messages (
    message_id VARCHAR(36) PRIMARY KEY,
    chat_id VARCHAR(36) NOT NULL,
    sender ENUM('user', 'bot', 'agent') NOT NULL,
    content TEXT NOT NULL,
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE,
    INDEX idx_chat_msg_chat (chat_id),
    INDEX idx_chat_msg_created (created_at)
);

-- COMMIT;
