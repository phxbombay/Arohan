import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

console.log('Testing SMTP connection for Arohan Health...');
console.log(`Host: ${process.env.SMTP_HOST}`);
console.log(`User: ${process.env.SMTP_USER}`);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    connectionTimeout: 10000
});

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP connection failed!');
        console.error('Error details:', error.message);
        console.log('\nPossible reasons:');
        console.log('1. Domain email not yet verified via Resellerclub.');
        console.log('2. SMTP port 587 is blocked on this network.');
        console.log('3. Credentials need 5-10 minutes to propagate after registration.');
        process.exit(1);
    } else {
        console.log('✅ SMTP server is ready to send emails!');
        console.log('Setup is successful.');
        process.exit(0);
    }
});
