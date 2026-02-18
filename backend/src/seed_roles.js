import bcrypt from 'bcryptjs';
import pool from './config/db.js';
import crypto from 'crypto';

/**
 * seed_roles.js
 * Populates the system with default accounts for each role:
 * 1. Admin (System)
 * 2. Physician (Doctor)
 * 3. Hospital Admin
 * 4. Patient (Test)
 */

const users = [
    {
        full_name: 'System Admin',
        email: 'admin@arohanhealth.com',
        password: 'Admin123!',
        role: 'admin'
    },
    {
        full_name: 'Dr. Smith',
        email: 'doctor@arohanhealth.com',
        password: 'Doctor123!',
        role: 'physician'
    },
    {
        full_name: 'Hospital Administrator',
        email: 'hospital@arohanhealth.com',
        password: 'Hospital123!',
        role: 'hospital_admin'
    },
    {
        full_name: 'janardhan Patient',
        email: 'patient@test.com',
        password: 'Patient123!',
        role: 'patient'
    }
];

const seedRoles = async () => {
    console.log('🚀 Starting Role Seeding...');

    try {
        for (const user of users) {
            // Check if user already exists
            const [existing] = await pool.query('SELECT user_id FROM users WHERE email = ?', [user.email]);

            if (existing.length > 0) {
                console.log(`ℹ️  User ${user.email} already exists. Skipping.`);
                continue;
            }

            const user_id = crypto.randomUUID();
            const hashedPassword = await bcrypt.hash(user.password, 10);

            const query = `
                INSERT INTO users (user_id, full_name, email, password_hash, role, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            `;

            await pool.query(query, [
                user_id,
                user.full_name,
                user.email,
                hashedPassword,
                user.role,
                true
            ]);

            console.log(`✅ Created ${user.role}: ${user.email}`);
        }

        console.log('🎉 Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        if (error.sql) console.error('SQL:', error.sql);
        if (error.message) console.error('Message:', error.message);
        process.exit(1);
    }
};

seedRoles();
