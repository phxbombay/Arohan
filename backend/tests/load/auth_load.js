import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp up to 20 users
        { duration: '1m', target: 50 },  // Stay at 50 users
        { duration: '30s', target: 0 },  // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:5000/v1';

export default function () {
    const loginRes = http.post(`${BASE_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'Password123!',
    });

    check(loginRes, {
        'login successful': (r) => r.status === 200,
    });

    if (loginRes.status === 200) {
        const token = loginRes.json('token');
        const params = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // metrics check
        const metricsRes = http.get(`${BASE_URL}/metrics/health/detailed`, params);
        check(metricsRes, {
            'metrics loaded': (r) => r.status === 200,
        });
    }

    sleep(1);
}
