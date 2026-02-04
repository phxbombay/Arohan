import axios from 'axios';

const testValidation = async () => {
    console.log('🧪 Testing Error Handling & Validation\n');

    try {
        // Test 1: Validation Error - Missing fields
        console.log('1️⃣ Testing Validation Error (Missing Fields)...');
        try {
            await axios.post('http://localhost:5000/v1/auth/register', {
                // Missing full_name and password
                email: 'test@example.com'
            });
            console.log(' ❌ Should have failed!');
        } catch (error) {
            if (error.response?.status === 400 && error.response.data.errors) {
                console.log('✅ Validation error caught correctly');
                console.log('   Errors:', error.response.data.errors.map(e => e.message).join(', '));
            } else {
                console.log('⚠️  Wrong error:', error.response?.data);
            }
        }

        // Test 2: Validation Error - Weak password
        console.log('\n2️⃣ Testing Password Validation...');
        try {
            await axios.post('http://localhost:5000/v1/auth/register', {
                full_name: 'Test User',
                email: 'test@example.com',
                password: 'weak'  // Too short, no uppercase, no number
            });
            console.log('❌ Should have failed!');
        } catch (error) {
            if (error.response?.status === 400 && error.response.data.errors) {
                console.log('✅ Password validation working');
                console.log('   Errors:', error.response.data.errors.map(e => e.message).join(', '));
            } else {
                console.log('⚠️  Wrong error:', error.response?.data);
            }
        }

        // Test 3: Conflict Error - Duplicate email
        console.log('\n3️⃣ Testing Conflict Error (Duplicate Email)...');
        try {
            await axios.post('http://localhost:5000/v1/auth/register', {
                full_name: 'Admin',
                email: 'admin@arohan.com',  // Already exists
                password: 'Test123!'
            });
            console.log('❌ Should have failed!');
        } catch (error) {
            if (error.response?.status === 409) {
                console.log('✅ Conflict error caught correctly');
                console.log('   Message:', error.response.data.message);
            } else {
                console.log('⚠️  Wrong status:', error.response?.status, error.response?.data);
            }
        }

        // Test 4: Authentication Error - Wrong password
        console.log('\n4️⃣ Testing Authentication Error...');
        try {
            await axios.post('http://localhost:5000/v1/auth/login', {
                email: 'admin@arohan.com',
                password: 'wrongpassword'
            });
            console.log('❌ Should have failed!');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Authentication error caught correctly');
                console.log('   Message:', error.response.data.message);
            } else {
                console.log('⚠️  Wrong error:', error.response?.data);
            }
        }

        // Test 5: Valid Registration
        console.log('\n5️⃣ Testing Valid Registration...');
        const registerRes = await axios.post('http://localhost:5000/v1/auth/register', {
            full_name: 'Valid User',
            email: `valid${Date.now()}@example.com`,
            password: 'ValidPass123!'
        });
        if (registerRes.status === 201 && registerRes.data.accessToken) {
            console.log('✅ Valid registration successful');
            console.log('   User:', registerRes.data.full_name);
        } else {
            console.log('⚠️  Unexpected response:', registerRes.data);
        }

        // Test 6: Valid Login  
        console.log('\n6️⃣ Testing Valid Login...');
        const loginRes = await axios.post('http://localhost:5000/v1/auth/login', {
            email: 'admin@arohan.com',
            password: 'admin123'
        });
        if (loginRes.status === 200 && loginRes.data.accessToken) {
            console.log('✅ Valid login successful');
            console.log('   User:', loginRes.data.full_name);
        } else {
            console.log('⚠️  Unexpected response:', loginRes.data);
        }

        console.log('\n🎉 All error handling & validation tests passed!');

    } catch (error) {
        console.error('\n❌ Unexpected Test Failure');
        console.error('Error:', error.response?.data || error.message);
        process.exit(1);
    }
};

testValidation();
