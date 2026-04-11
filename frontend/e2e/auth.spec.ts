import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    const password = 'Password@123';

    test('should register a new user', async ({ page }) => {
        await page.goto('/signin');
        
        // Toggle to Register mode
        await page.click('button:has-text("create a new account")');

        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', uniqueEmail);
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="contact"]', '9876543210');
        await page.fill('input[name="dob"]', '1990-01-01');

        await page.click('button[type="submit"]');

        // Should redirect to dashboard
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should login with existing user', async ({ page }) => {
        await page.goto('/signin');

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
        await page.goto('/signin');
        await page.fill('input[name="email"]', uniqueEmail);
        await page.fill('input[name="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForURL(/.*dashboard/);

        // Click logout
        await page.click('button:has-text("Logout"), [aria-label="logout"]'); 

        // Verify redirect to signin
        await expect(page).toHaveURL(/.*signin/);
    });
});
