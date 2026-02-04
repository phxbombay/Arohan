// Test setup file
import { beforeAll, afterAll, afterEach } from 'vitest';

// Mock logger to avoid console spam during tests
vi.mock('../config/logger.js', () => ({
    default: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
    },
}));

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
process.env.DATABASE_URL = 'postgresql://postgres:test@localhost:5432/arohan_test';

// Global test hooks
beforeAll(() => {
    console.log('🧪 Starting test suite...');
});

afterAll(() => {
    console.log('✅ Test suite complete');
});

afterEach(() => {
    // Clear all mocks after each test
    vi.clearAllMocks();
});
