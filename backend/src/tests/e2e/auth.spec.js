import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should register a new user successfully', async ({ page }) => {
        await page.goto('/');

        // Click register link
        await page.click('text=Register');

        // Fill registration form
        await page.fill('[name="full_name"]', 'Test User');
        await page.fill('[name="email"]', `test${Date.now()}@example.com`);
        await page.fill('[name="password"]', 'SecurePass123');

        // Submit form
        await page.click('button[type="submit"]');

        // Verify redirect to dashboard
        await expect(page).toHaveURL(/\/dashboard/);

        // Verify user is logged in
        await expect(page.locator('text=Test User')).toBeVisible();
    });

    test('should login existing user', async ({ page }) => {
        await page.goto('/login');

        // Fill login form
        await page.fill('[name="email"]', 'test@example.com');
        await page.fill('[name="password"]', 'SecurePass123');

        // Submit
        await page.click('button[type="submit"]');

        // Verify success
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.fill('[name="email"]', 'wrong@example.com');
        await page.fill('[name="password"]', 'wrongpass');
        await page.click('button[type="submit"]');

        // Verify error message
        await expect(page.locator('text=/invalid credentials/i')).toBeVisible();
    });

    test('should logout user', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('[name="email"]', 'test@example.com');
        await page.fill('[name="password"]', 'SecurePass123');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/\/dashboard/);

        // Logout
        await page.click('button:has-text("Logout")');

        // Verify redirect to home/login
        await expect(page).toHaveURL(/\/(login)?$/);
    });
});
