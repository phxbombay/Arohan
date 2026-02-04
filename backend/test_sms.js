import smsService from './src/services/smsService.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Test SMS Service
 * Verifies Twilio configuration and sends test SMS
 */

const testSMS = async () => {
    try {
        console.log('\n🧪 TESTING SMS SERVICE');
        console.log('================================');

        // Check if Twilio is configured
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
            console.log('❌ Twilio credentials not configured');
            console.log('\n📋 To configure:');
            console.log('1. Get credentials from https://console.twilio.com/');
            console.log('2. Add to docker-compose.yml:');
            console.log('   TWILIO_ACCOUNT_SID: ACxxxxxxxxxxxxx');
            console.log('   TWILIO_AUTH_TOKEN: your_auth_token');
            console.log('   TWILIO_PHONE_NUMBER: +1234567890');
            console.log('3. Restart backend: docker-compose restart backend');
            process.exit(1);
        }

        console.log('✅ Twilio credentials found');
        console.log(`📱 From Number: ${process.env.TWILIO_PHONE_NUMBER || 'Not set'}`);

        // Prompt for test phone number
        const testPhone = process.env.TEST_PHONE_NUMBER || '+911234567890';
        console.log(`\n📤 Sending test SMS to: ${testPhone}`);
        console.log('   (Set TEST_PHONE_NUMBER env var to change)');

        const result = await smsService.sendTestSMS(testPhone);

        console.log('\n✅ TEST RESULT:');
        console.log('================================');
        if (result.success) {
            console.log('✅ SMS sent successfully!');
            console.log(`📬 Message SID: ${result.sid}`);
            console.log(`📊 Status: ${result.status}`);
            console.log(`\n📱 Check your phone: ${testPhone}`);
        } else {
            console.log('❌ SMS failed to send');
            console.log(`❌ Error: ${result.error}`);
            if (result.code) {
                console.log(`❌ Code: ${result.code}`);
            }
            console.log('\n🔧 TROUBLESHOOTING:');
            console.log('   1. Verify Account SID and Auth Token');
            console.log('   2. Check phone number format (+country_code...)');
            console.log('   3. Verify Twilio account is active');
            console.log('   4. Check Twilio console for more details');
        }

        process.exit(result.success ? 0 : 1);
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
};

testSMS();
