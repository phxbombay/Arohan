import { test, expect } from '@playwright/test';

test.describe('Dashboard Functionality', () => {
    // Helper to login before tests
    test.beforeEach(async ({ page }) => {
        await page.goto('/signin');
        
        const email = `dashboard${Date.now()}@test.com`;
        const password = 'Password@123';

        // Register quickly via UI
        await page.click('button:has-text("create a new account")');
        await page.fill('input[name="name"]', 'Dashboard User');
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="contact"]', '9876543210');
        await page.fill('input[name="dob"]', '1990-01-01');
        await page.click('button[type="submit"]');
        await page.waitForURL(/.*dashboard/);
    });

    test('should display dashboard widgets', async ({ page }) => {
        await expect(page.getByText('Welcome to Arohan')).toBeVisible();
        await expect(page.getByText('Quick Stats')).toBeVisible();
        await expect(page.getByText('Recent Activity')).toBeVisible();
    });

    test('should have quick action buttons', async ({ page }) => {
        await expect(page.getByText('Emergency SOS')).toBeVisible();
        await expect(page.getByText('Contact Support')).toBeVisible();
    });

    test('should navigate to products page', async ({ page }) => {
        await page.click('text=View Products');
        await expect(page).toHaveURL(/.*products/);
    });
});
