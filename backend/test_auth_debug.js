import axios from 'axios';

const CREDENTIALS = {
    email: 'admin@arohan.com',
    password: 'admin123'
};

const ROUTES = [
    // { name: 'Direct Backend', url: 'http://localhost:5000/v1/auth/login' },
    { name: 'Nginx Proxy', url: 'http://localhost:8080/v1/auth/login' }
];

async function testLogin() {
    console.log('🧪 Starting Auth Connectivity Test...');

    for (const route of ROUTES) {
        console.log(`\nTesting ${route.name} (${route.url})...`);
        try {
            const response = await axios.post(route.url, CREDENTIALS);
            console.log(`✅ Success! Status: ${response.status}`);
            console.log('   Response Data:', JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.log(`❌ Failed!`);
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Data:`, error.response.data);
            } else if (error.request) {
                console.log(`   No response received (Network Error)`);
                console.log(`   Code: ${error.code}`);
            } else {
                console.log(`   Error: ${error.message}`);
            }
        }
    }
}

// Check Health
async function checkHealth() {
    console.log('\n🏥 Checking Health Endpoints...');
    const healthUrls = [
        'http://localhost:5000/health',
        'http://localhost:8080/v1/health' // Nginx maps /v1/ to backend root? No, /v1/ maps to backend:5000. Backend has /health at root. 
        // Wait, app.use('/v1/auth', authRoutes)
        // app.get('/health') is separate.
        // Nginx location /v1/ proxy_pass http://backend:5000;
        // So http://localhost:8080/v1/health -> http://backend:5000/health ??
        // Let's check nginx.conf again carefully.
        // location /v1/ { proxy_pass http://backend:5000; }
        // If I request /v1/health, it goes to http://backend:5000/health
    ];

    try {
        const res = await axios.get('http://localhost:5000/health');
        console.log(`✅ Backend Health (Direct): ${res.status} - ${res.data.database}`);
    } catch (e) { console.log(`❌ Backend Health (Direct) Failed: ${e.message}`); }
}

await checkHealth();
await testLogin();
