-- Migration: Create user_otps table
-- Purpose: Store verification codes for registration and other security features

CREATE TABLE IF NOT EXISTS user_otps (
    otp_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    purpose ENUM('registration', 'password_reset', 'mfa') DEFAULT 'registration',
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_user_otp_user ON user_otps(user_id);
CREATE INDEX idx_user_otp_code ON user_otps(otp_code);
