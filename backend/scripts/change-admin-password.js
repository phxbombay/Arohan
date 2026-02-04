#!/usr/bin/env node
/**
 * Change Admin Password Script
 * Usage: node change-admin-password.js
 * 
 * This script updates the admin password to: R@,sx-UbS)H$
 */

import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

// Load environment variables
dotenv.config();

const newPassword = 'R@,sx-UbS)H$';
const adminEmail = 'admin@arohanhealth.com';

async function changeAdminPassword() {
    console.log('🔐 Changing Admin Password...\n');

    // Create database connection
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    try {
        // Generate password hash
        console.log('⏳ Generating password hash...');
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);
        
        // Update password in database
        console.log('⏳ Updating database...');
        const result = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING email, role',
            [passwordHash, adminEmail]
        );

        if (result.rowCount === 0) {
            console.error('❌ ERROR: Admin user not found!');
            console.error('Make sure the admin user exists in the database first.');
            process.exit(1);
        }

        console.log('✅ Admin password updated successfully!\n');
        console.log('📧 Email:', result.rows[0].email);
        console.log('👤 Role:', result.rows[0].role);
        console.log('🔑 New Password: R@,sx-UbS)H$\n');
        
        console.log('⚠️  IMPORTANT: Save this password securely!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run the script
changeAdminPassword();
