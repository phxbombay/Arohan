import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    const password = 'Password@123';

    test('should register a new user', async ({ page }) => {
        await page.goto('/register');

        await page.fill('input[name="full_name"]', 'Test User');
        await page.fill('input[name="email"]', uniqueEmail);
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password);

        await page.click('button[type="submit"]');

        // Should redirect to dashboard or login
        await expect(page).toHaveURL(/\/dashboard|login/);
    });

    test('should login with existing user', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[name="email"]', uniqueEmail);
        await page.fill('input[name="password"]', password);

        await page.click('button[type="submit"]');

        // Wait for navigation to dashboard
        await expect(page).toHaveURL(/.*dashboard/);

        // Verify user name is displayed
        await expect(page.getByText('Test User')).toBeVisible();
    });

    test('should logout', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[name="email"]', uniqueEmail);
        await page.fill('input[name="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForURL(/.*dashboard/);

        // Click logout
        await page.click('button:has-text("Logout"), [aria-label="logout"]'); // Adjust selector as needed

        // Verify redirect to login
        await expect(page).toHaveURL(/.*login/);
    });
});
