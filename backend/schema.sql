-- ============================================
-- AROHAN HEALTH CARE SOLUTIONS
-- Complete Database Schema (Unified)
-- Version: 2.0
-- Date: 2026-01-19
-- ============================================

-- Enable UUID extension for secure IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES (User Management & Devices)
-- ============================================

-- 1. USERS TABLE (Role-Based Access Control)
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Bcrypt/Argon2 hash
    full_name VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('patient', 'caregiver', 'doctor', 'admin')) NOT NULL,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255), -- Encrypted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    phone_number VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(20)
);

-- 1.5 REFRESH TOKENS (Session Management)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_refresh_token_hash ON refresh_tokens(token_hash);

-- 2. DEVICES TABLE (Inventory & Pairing)
CREATE TABLE IF NOT EXISTS devices (
    device_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    model_version VARCHAR(20),
    firmware_version VARCHAR(20),
    manufactured_date DATE,
    status VARCHAR(20) CHECK (status IN ('inventory', 'active', 'inactive', 'maintenance'))
);

-- 3. USER_DEVICES (Many-to-Many: Linking Users to Devices)
CREATE TABLE IF NOT EXISTS user_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(device_id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT TRUE,
    paired_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- HEALTH MONITORING TABLES
-- ============================================

-- 4. HEALTH_VITALS (Time-Series Data)
-- Note: In production, consider using TimescaleDB hypertable here
CREATE TABLE IF NOT EXISTS health_vitals (
    record_id UUID DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    device_id UUID REFERENCES devices(device_id),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    heart_rate INT,
    steps INT,
    oxygen_level INT,
    body_temp DECIMAL(4,1),
    battery_level INT,
    raw_data JSONB, -- For AI analysis later
    PRIMARY KEY (user_id, recorded_at) -- Partition key
);

-- 5. HEALTH SIMULATIONS (Dashboard Data - NEW)
CREATE TABLE IF NOT EXISTS health_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    snapshot_data JSONB NOT NULL,
    analysis_data JSONB NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- EMERGENCY & SAFETY TABLES
-- ============================================

-- 6. EMERGENCY_ALERTS (Critical Events)
CREATE TABLE IF NOT EXISTS emergency_alerts (
    alert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    type VARCHAR(50) CHECK (type IN ('fall_detected', 'cardiac_arrest', 'manual_sos', 'abnormal_vitals')),
    status VARCHAR(20) DEFAULT 'triggered' CHECK (status IN ('triggered', 'acknowledged', 'resolved', 'false_alarm')),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 7. EMERGENCY_CONTACTS
CREATE TABLE IF NOT EXISTS emergency_contacts (
    contact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    relation VARCHAR(50),
    priority INT DEFAULT 1 -- 1 gets called first
);

-- 7.5 MARKETING & LEADS (Early Access)
CREATE TABLE IF NOT EXISTS early_access_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    city VARCHAR(100),
    use_case TEXT,
    status VARCHAR(20) DEFAULT 'new', -- new, contacted, converted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_early_access_email ON early_access_leads(email);

-- ============================================
-- E-COMMERCE TABLES (Shopping Cart - NEW)
-- ============================================

-- 8. SHOPPING CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    image_url VARCHAR(500),
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_product UNIQUE(user_id, product_id)
);

-- ============================================
-- COMPLIANCE & AUDIT TABLES
-- ============================================

-- 9. AUDIT_LOGS (HIPAA Requirement)
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES users(user_id),
    action VARCHAR(255) NOT NULL,
    target_record_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_vitals_user_time ON health_vitals (user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON emergency_alerts (status);
CREATE INDEX IF NOT EXISTS idx_health_sim_user_time ON health_simulations(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);

-- ============================================
-- PAYMENT GATEWAY TABLES (Razorpay)
-- ============================================

-- 10. ORDERS (Intent to pay)
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY, -- razorpay_order_id
    user_id UUID REFERENCES users(user_id),
    amount INTEGER NOT NULL, -- in paise
    currency VARCHAR(10) DEFAULT 'INR',
    receipt VARCHAR(50),
    status VARCHAR(20) DEFAULT 'start', -- start, attempt, paid
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. PAYMENTS (Successful transactions)
CREATE TABLE IF NOT EXISTS payments (
    payment_id VARCHAR(50) PRIMARY KEY, -- razorpay_payment_id
    order_id VARCHAR(50) REFERENCES orders(order_id),
    signature VARCHAR(255),
    amount INTEGER NOT NULL,
    method VARCHAR(50), -- card, upi, netbanking
    transaction_fee INTEGER,
    tax INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. WEBHOOK LOGS (Audit Trail)
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(50),
    event_type VARCHAR(50),
    payload JSONB,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_webhook_event_id ON webhook_logs(event_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to update cart items timestamp
CREATE OR REPLACE FUNCTION update_cart_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cart_items_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_cart_timestamp();

-- ============================================
-- SAMPLE DATA (Optional - Uncomment to use)
-- ============================================

/*
-- Sample admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role)
VALUES (
    'admin@arohanhealth.com',
    '$2a$10$XYZ...', -- Bcrypt hash
    'Admin User',
    'admin'
);

-- Sample device
INSERT INTO devices (serial_number, model_version, firmware_version, status)
VALUES ('ARO-SN-00001', 'v2.0', '2.1.0', 'inventory');
*/

-- ============================================
-- SUMMARY
-- ============================================
-- Tables Created: 9
-- - users (authentication)
-- - devices (hardware inventory)
-- - user_devices (pairings)
-- - health_vitals (sensor data)
-- - health_simulations (dashboard) [NEW]
-- - emergency_alerts (incidents)
-- - emergency_contacts (safety)
-- - cart_items (e-commerce) [NEW]
-- - audit_logs (compliance)
--
-- Indexes: 4
-- Triggers: 1
-- ============================================

-- 13. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread', -- unread, read, replied
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. BLOGS (CMS)
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    category VARCHAR(50) DEFAULT 'Healthcare',
    tags TEXT[], -- Array of strings
    author_name VARCHAR(100) DEFAULT 'Arohan Team',
    status VARCHAR(20) DEFAULT 'draft', -- draft, published
    view_count INTEGER DEFAULT 0,
    publish_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);

-- 15. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50) REFERENCES orders(order_id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_details JSONB, -- store snapshot of customer info
    items JSONB, -- store snapshot of items
    pricing JSONB, -- store snapshot of pricing
    payment_method VARCHAR(50),
    payment_status VARCHAR(20),
    status VARCHAR(20) DEFAULT 'issued',
    pdf_path VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. PUSH SUBSCRIPTIONS (PWA Notifications)
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh VARCHAR(255) NOT NULL,
    auth VARCHAR(255) NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_endpoint UNIQUE(user_id, endpoint)
);
CREATE INDEX IF NOT EXISTS idx_push_user ON push_subscriptions(user_id);
