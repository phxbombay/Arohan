import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 1,
    workers: undefined,
    reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
    ],
    // Docker is already running — connect to it, don't start a dev server
    webServer: {
        command: 'echo "Docker server already running"',
        url: process.env.BASE_URL || 'http://localhost',
        reuseExistingServer: true,
        timeout: 30000,
    },
});
