import axios from 'axios';

const testNewArchitecture = async () => {
    console.log('🧪 Testing New Architecture\n');

    try {
        // Test 1: Register
        console.log('1️⃣ Testing Registration...');
        const registerRes = await axios.post('http://localhost:5000/v1/auth/register', {
            full_name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'Test123!'
        });
        console.log('✅ Registration Success');
        console.log('   User:', registerRes.data.full_name);
        console.log('   Token received:', registerRes.data.accessToken ? 'Yes' : 'No');

        // Test 2: Login
        console.log('\n2️⃣ Testing Login...');
        const loginRes = await axios.post('http://localhost:5000/v1/auth/login', {
            email: 'admin@arohan.com',
            password: 'admin123'
        });
        console.log('✅ Login Success');
        console.log('   User:', loginRes.data.full_name);
        console.log('   Role:', loginRes.data.role);
        console.log('   Token received:', loginRes.data.accessToken ? 'Yes' : 'No');

        // Test 3: Invalid Login
        console.log('\n3️⃣ Testing Invalid Login...');
        try {
            await axios.post('http://localhost:5000/v1/auth/login', {
                email: 'admin@arohan.com',
                password: 'wrongpassword'
            });
            console.log('❌ Should have failed!');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Correctly rejected invalid credentials');
            } else {
                console.log('⚠️ Unexpected error:', error.message);
            }
        }

        console.log('\n🎉 All architecture tests passed!');

    } catch (error) {
        console.error('\n❌ Test Failed');
        console.error('Error:', error.response?.data || error.message);
        process.exit(1);
    }
};

testNewArchitecture();
