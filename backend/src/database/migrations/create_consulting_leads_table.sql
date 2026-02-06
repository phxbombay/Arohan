-- Consulting Leads Table
CREATE TABLE IF NOT EXISTS consulting_leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    service_type VARCHAR(100) NOT NULL,
    budget VARCHAR(100),
    timeline VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'converted', 'rejected')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_consulting_leads_status ON consulting_leads(status);
CREATE INDEX IF NOT EXISTS idx_consulting_leads_created_at ON consulting_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consulting_leads_email ON consulting_leads(email);

-- Add comments
COMMENT ON TABLE consulting_leads IS 'Stores consulting and project inquiry submissions';
COMMENT ON COLUMN consulting_leads.status IS 'Lead status: new, contacted, in_progress, converted, rejected';
