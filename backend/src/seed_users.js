import bcrypt from 'bcryptjs';
import pool from './config/db.js';
import crypto from 'crypto';

const users = [
    { email: 'doctor@arohanhealth.com', password: 'Doctor123!', full_name: 'Test Doctor', role: 'doctor' },
    { email: 'hospital@arohanhealth.com', password: 'Hospital123!', full_name: 'Test Hospital', role: 'hospital_admin' },
    { email: 'patient@test.com', password: 'Patient123!', full_name: 'Test Patient', role: 'patient' }
];

const seedUsers = async () => {
    try {
        for (const u of users) {
             const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [u.email]);
             if (rows.length === 0) {
                 const user_id = crypto.randomUUID();
                 const hash = await bcrypt.hash(u.password, 10);
                 await pool.query(
                     "INSERT INTO users (user_id, email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)",
                     [user_id, u.email, hash, u.full_name, u.role, true]
                 );
                 console.log(`✅ Seeded: ${u.email} (${u.role})`);
             } else {
                 console.log(`⚠️ Exists: ${u.email}`);
             }
        }
    } catch (e) {
        console.error("Error seeding users:", e);
    }
    process.exit(0);
};

seedUsers();
