import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./src/tests/setup.js'],
        coverage: {
            provider: 'c8',
            reporter: ['text', 'json', 'html', 'lcov'],
            exclude: [
                'node_modules/',
                'src/tests/',
                '**/*.test.js',
                '**/*.spec.js',
                'src/config/swagger.js',
                'migrations/',
            ],
            all: true,
            lines: 80,
            functions: 80,
            branches: 75,
            statements: 80,
        },
        testTimeout: 10000,
        hookTimeout: 10000,
    },
});
