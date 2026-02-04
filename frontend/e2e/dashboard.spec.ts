import { test, expect } from '@playwright/test';

test.describe('Dashboard Functionality', () => {
    // Helper to login before tests
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        // Use a known seed user or register fresh if needed. 
        // ideally use a global setup, but for now we register one on fly or assume one exists.
        // Let's use the one from auth spec if order matters, or creating a new one.
        const email = `dashboard${Date.now()}@test.com`;
        const password = 'Password@123';

        // Register quickly via API or UI? UI is safer for full flow
        await page.goto('/register');
        await page.fill('input[name="full_name"]', 'Dashboard User');
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password);
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
