import axios from 'axios';

const START_TIME = Date.now();
const EMAIL = `test.user.${START_TIME}@example.com`; // Unique email

const USER_DATA = {
    full_name: 'Test User',
    email: EMAIL,
    password: 'TestPassword123!',
    role: 'patient',
    phone_number: '9876543210' // Matches backend expectation (10 digits)
};

const URL = 'http://localhost:5000/v1/auth/register';

async function testRegistration() {
    console.log(`🧪 Testing Registration Endpoint: ${URL}`);
    console.log(`   Payload:`, USER_DATA);

    try {
        const response = await axios.post(URL, USER_DATA);
        console.log(`✅ Registration Success! Status: ${response.status}`);
        console.log('   Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log(`❌ Registration Failed!`);
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Data:`, JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.log(`   No response received (Network/CORS?)`);
            console.log(`   Code: ${error.code}`);
        } else {
            console.log(`   Error: ${error.message}`);
        }
    }
}

testRegistration();
