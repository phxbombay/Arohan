-- Migration: Add RBAC permissions and session management
-- Version: 1.0
-- Date: 2026-02-06

-- Add permissions column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP;

-- Create roles table for better role management
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (role_name, display_name, description, permissions) VALUES
('admin', 'Administrator', 'Full system access', '["*"]'),
('physician', 'Physician', 'Medical professional with full patient access', '["view_patients", "view_vitals", "view_alerts", "manage_prescriptions", "view_analytics", "schedule_appointments", "view_medical_history", "update_patient_notes"]'),
('doctor', 'Doctor', 'Medical professional with limited access', '["view_patients", "view_vitals", "view_alerts", "view_medical_history"]'),
('patient', 'Patient', 'Patient user with access to own data', '["view_own_data", "view_own_vitals", "view_own_alerts", "update_profile", "manage_emergency_contacts", "view_prescriptions"]'),
('caregiver', 'Caregiver', 'Caregiver with access to assigned patients', '["view_assigned_patients", "view_patient_vitals", "receive_alerts", "update_care_notes", "view_medication_schedule"]'),
('hospital_admin', 'Hospital Administrator', 'Hospital-level administrative access', '["view_hospital_patients", "view_hospital_analytics", "manage_staff", "view_billing", "manage_departments", "view_audit_logs"]'),
('partner', 'Partner/Vendor', 'Third-party integration access', '["view_api_docs", "manage_integrations", "view_device_data", "submit_vitals", "receive_webhooks"]')
ON CONFLICT (role_name) DO NOTHING;

-- Create user_sessions table for session management
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_activity TIMESTAMP DEFAULT NOW()
);

-- Create index on user_sessions for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_token ON user_sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Create patient_assignments table for physician/caregiver assignments
CREATE TABLE IF NOT EXISTS patient_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    assigned_user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    assignment_type VARCHAR(50) NOT NULL, -- 'physician', 'doctor', 'caregiver'
    assigned_by UUID REFERENCES users(user_id),
    is_primary BOOLEAN DEFAULT false,
    assigned_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    notes TEXT,
    UNIQUE(patient_id, assigned_user_id, assignment_type)
);

-- Create index on patient_assignments
CREATE INDEX IF NOT EXISTS idx_patient_assignments_patient ON patient_assignments(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_assignments_assigned_user ON patient_assignments(assigned_user_id);

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on password_reset_tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);

-- Update existing users to have default permissions based on their role
UPDATE users SET permissions = '["*"]' WHERE role = 'admin' AND permissions = '[]';
UPDATE users SET permissions = '["view_patients", "view_vitals", "view_alerts", "view_medical_history"]' WHERE role = 'doctor' AND permissions = '[]';
UPDATE users SET permissions = '["view_own_data", "view_own_vitals", "view_own_alerts", "update_profile", "manage_emergency_contacts", "view_prescriptions"]' WHERE role = 'patient' AND permissions = '[]';

-- Add comments for documentation
COMMENT ON TABLE roles IS 'Defines available user roles and their permissions';
COMMENT ON TABLE user_sessions IS 'Tracks active user sessions with refresh tokens';
COMMENT ON TABLE patient_assignments IS 'Maps physicians/caregivers to their assigned patients';
COMMENT ON TABLE password_reset_tokens IS 'Stores password reset tokens for account recovery';

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
    DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used = true;
END;
$$ LANGUAGE plpgsql;

-- Create function to update last_activity on sessions
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for session activity updates
CREATE TRIGGER trigger_update_session_activity
    BEFORE UPDATE ON user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_session_activity();
