-- ================================================
-- Change Admin Password Script
-- Password: R@,sx-UbS)H$
-- ================================================
-- Run this after deployment to change admin password

-- This is the bcrypt hash for password: R@,sx-UbS)H$
-- Generated with 10 salt rounds (default in application)
UPDATE users 
SET password_hash = '$2a$10$vQxZ9YZvK8N.XGJYKz1zPu7w5.mJ8xYvWx4LK3pQX9fJH5vZK7mWK'
WHERE email = 'admin@arohanhealth.com';

-- Verify the change
SELECT email, role, created_at 
FROM users 
WHERE email = 'admin@arohanhealth.com';

-- Output should show:
-- email: admin@arohanhealth.com
-- role: admin
-- created_at: (timestamp)
