import nodemailer from 'nodemailer';
import fs from 'fs';

/**
 * Automatic SMTP Setup using Ethereal Email (Test Service)
 * This creates temporary test credentials that work immediately
 */

const setupTestSMTP = async () => {
    try {
        console.log('🔧 Generating Ethereal Email test account...');

        // Create test account (automatically)
        const testAccount = await nodemailer.createTestAccount();

        console.log('\n✅ Test SMTP Account Created!');
        console.log('================================');
        console.log('SMTP_HOST:', testAccount.smtp.host);
        console.log('SMTP_PORT:', testAccount.smtp.port);
        console.log('SMTP_USER:', testAccount.user);
        console.log('SMTP_PASSWORD:', testAccount.pass);
        console.log('\n📧 Test Inbox URL:', `https://ethereal.email/messages`);
        console.log('   Login with:', testAccount.user, '/', testAccount.pass);

        // Output credentials for copy-paste
        console.log('\n📋 COPY THESE VALUES:');
        console.log('================================');
        console.log(`SMTP_HOST=${testAccount.smtp.host}`);
        console.log(`SMTP_PORT=${testAccount.smtp.port}`);
        console.log(`SMTP_USER=${testAccount.user}`);
        console.log(`SMTP_PASSWORD=${testAccount.pass}`);

        // Also output as docker-compose format
        console.log('\n📋 Docker Compose Format:');
        console.log('================================');
        console.log(`      SMTP_HOST: ${testAccount.smtp.host}`);
        console.log(`      SMTP_PORT: ${testAccount.smtp.port}`);
        console.log(`      SMTP_USER: ${testAccount.user}`);
        console.log(`      SMTP_PASSWORD: ${testAccount.pass}`);
        console.log(`      ADMIN_EMAIL: info@haspranahealth.com`);

        return testAccount;
    } catch (error) {
        console.error('❌ Error creating test account:', error.message);
        process.exit(1);
    }
};

setupTestSMTP();
