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
            try {
                // Step 1: Find existing user_id (needed to clean refresh_tokens FK first)
                const [existing] = await pool.query(
                    'SELECT user_id FROM users WHERE email = ?',
                    [user.email]
                );

                if (existing.length > 0) {
                    const existingId = existing[0].user_id;
                    // Step 2: Delete FK-dependent refresh_tokens FIRST
                    await pool.query(
                        'DELETE FROM refresh_tokens WHERE user_id = ?',
                        [existingId]
                    );
                    console.log(`🧹 Cleared tokens for: ${user.email}`);

                    // Step 3: Now safe to delete user
                    await pool.query('DELETE FROM users WHERE user_id = ?', [existingId]);
                    console.log(`🧹 Deleted existing user: ${user.email}`);
                }

                // Step 4: Re-create with fresh credentials
                const user_id = crypto.randomUUID();
                const hashedPassword = await bcrypt.hash(user.password, 10);

                await pool.query(
                    `INSERT INTO users (user_id, full_name, email, password_hash, role, is_active, created_at)
                     VALUES (?, ?, ?, ?, ?, TRUE, NOW())`,
                    [user_id, user.full_name, user.email, hashedPassword, user.role]
                );

                console.log(`✅ Created ${user.role}: ${user.email} (password: ${user.password})`);
            } catch (userErr) {
                console.error(`❌ Failed for ${user.email}:`, userErr.message);
            }
        }

        console.log('\n🎉 Seeding complete!');
        console.log('\n📋 Test Credentials:');
        users.forEach(u => console.log(`   ${u.role.padEnd(15)} | ${u.email} | ${u.password}`));
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedRoles();
