-- Migration: Add early_access_leads table
CREATE TABLE IF NOT EXISTS early_access_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    use_case TEXT,
    status VARCHAR(20) DEFAULT 'new', -- new, contacted, converted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
