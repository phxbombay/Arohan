import axios from 'axios';

const API_URL = 'http://localhost:5000/v1';

async function verify() {
    try {
        console.log('🔄 1. Attempting Admin Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@arohan.com',
            password: 'admin123'
        });

        if (loginRes.status === 200) {
            console.log('✅ Login Successful');
            const token = loginRes.data.accessToken; // Fixed: Backend returns accessToken

            // Allow for cookie-based auth if token isn't in body (though previous code suggested it might be)
            const headers = {
                'Authorization': `Bearer ${token || ''}`,
                'Cookie': loginRes.headers['set-cookie']
            };

            console.log('\n🔄 2. Fetching Leads...');
            try {
                const leadsRes = await axios.get(`${API_URL}/admin/leads`, { headers });
                console.log(`✅ Leads Fetched: ${leadsRes.data.data.leads.length} found.`);
            } catch (err) {
                console.log(`❌ Failed to fetch leads: ${err.message}`);
                console.log(err.response?.data);
            }

            console.log('\n🔄 3. Fetching Orders...');
            try {
                // Determine correct endpoint from previous analysis (adminRoutes.js)
                const ordersRes = await axios.get(`${API_URL}/admin/orders`, { headers });
                console.log(`✅ Orders Fetched: ${ordersRes.data.data.length} found.`);
            } catch (err) {
                console.log(`❌ Failed to fetch orders: ${err.message}`);
                console.log(err.response?.data);
            }

        } else {
            console.log('❌ Login Failed', loginRes.status);
        }

    } catch (error) {
        console.error('❌ Critical Error:', error.code || error.message);
        console.error(error.stack);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
}

verify();
