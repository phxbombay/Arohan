
import axios from 'axios';

const API_URL = 'http://localhost:5000/v1';

async function verifyAdminFeatures() {
    console.log('🔍 Verifying ALL Admin Features (Post-Crash Recovery)...');
    let token;

    try {
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@arohan.com',
            password: 'admin123'
        });
        token = loginRes.data.accessToken;
        console.log(`   ✅ Login Success`);

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        const endpoints = [
            { name: 'Stats', url: '/admin/stats' },
            { name: 'Users', url: '/admin/users' },
            { name: 'Leads', url: '/admin/leads' },
            { name: 'Messages', url: '/admin/messages' },
            { name: 'Orders', url: '/admin/orders' },
            { name: 'Logs', url: '/admin/logs' },
            { name: 'Blogs', url: '/blog?status=all' }
        ];

        for (const ep of endpoints) {
            try {
                const res = await axios.get(`${API_URL}${ep.url}`, authHeaders);
                const count = res.data.count || res.data.data?.length || (Array.isArray(res.data.data) ? res.data.data.length : 'OK');
                console.log(`   ✅ ${ep.name}: ${count} items`);
            } catch (err) {
                console.error(`   ❌ ${ep.name} FAILED:`, err.message);
            }
        }

    } catch (error) {
        console.error('\n❌ CRITICAL FAILURE:', error.message);
        if (error.response) console.error(error.response.data);
    }
}

verifyAdminFeatures();
