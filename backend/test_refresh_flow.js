
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/v1/auth';

// Helper to log steps
const step = (msg) => console.log(`\n[STEP] ${msg}`);
const log = (msg, data) => console.log(`  ${msg}`, data ? JSON.stringify(data, null, 2) : '');

async function runTest() {
    try {
        // 1. Login
        step('Logging in...');
        const loginRes = await axios.post(`${BASE_URL}/login`, {
            email: 'admin@arohan.com',
            password: 'admin123'
        });

        const loginData = loginRes.data;

        log('Login successful. Checking for refreshToken in body...');
        if (!loginData.refreshToken) {
            throw new Error('FAIL: refreshToken not found in login response body!');
        }
        log('SUCCESS: refreshToken found in body.', { token: loginData.refreshToken.substring(0, 10) + '...' });

        // 2. Refresh Token using Body
        step('Refreshing token using body...');
        const refreshRes = await axios.post(`${BASE_URL}/refresh-token`, {
            refreshToken: loginData.refreshToken
        });

        const refreshData = refreshRes.data;

        log('Refresh successful.', {
            newAccessToken: refreshData.accessToken ? 'Present' : 'Missing',
            newRefreshToken: refreshData.refreshToken ? 'Present' : 'Missing'
        });

        if (!refreshData.accessToken) {
            throw new Error('FAIL: No access token returned after refresh.');
        }

        console.log('\n✅ VERIFICATION PASSED: Refresh token flow via body works correctly.');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

runTest();
