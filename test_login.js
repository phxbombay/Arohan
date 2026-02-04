
import axios from 'axios';

const testLogin = async () => {
    try {
        console.log('Testing Login...');
        const response = await axios.post('http://localhost:5000/v1/auth/login', {
            email: 'admin@arohan.com',
            password: 'admin123'
        });
        console.log('✅ Login SUCCESS!');
        console.log('Full Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log('❌ Login FAILED');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
    }
};

testLogin();
