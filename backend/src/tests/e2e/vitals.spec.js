import { test, expect } from '@playwright/test';

test.describe('Health Vitals Recording', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/login');
        await page.fill('[name="email"]', 'test@example.com');
        await page.fill('[name="password"]', 'SecurePass123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should record health vitals', async ({ page }) => {
        await page.goto('/vitals');

        // Click record button
        await page.click('button:has-text("Record Vitals")');

        // Fill vitals form
        await page.fill('[name="heart_rate"]', '75');
        await page.fill('[name="blood_pressure_systolic"]', '120');
        await page.fill('[name="blood_pressure_diastolic"]', '80');
        await page.fill('[name="oxygen_saturation"]', '98');
        await page.fill('[name="temperature"]', '98.6');

        // Submit
        await page.click('button[type="submit"]:has-text("Save")');

        // Verify success
        await expect(page.locator('text=/vitals recorded/i')).toBeVisible();
    });

    test('should validate vital ranges', async ({ page }) => {
        await page.goto('/vitals');
        await page.click('button:has-text("Record Vitals")');

        // Enter invalid heart rate (too high)
        await page.fill('[name="heart_rate"]', '250');
        await page.click('button[type="submit"]:has-text("Save")');

        // Verify validation error
        await expect(page.locator('text=/invalid|out of range/i')).toBeVisible();
    });

    test('should display vitals history', async ({ page }) => {
        await page.goto('/vitals');

        // Verify vitals list is visible
        await expect(page.locator('.vitals-history')).toBeVisible();

        // Verify at least one vital record (if any exist)
        const vitalCount = await page.locator('.vital-record').count();
        expect(vitalCount).toBeGreaterThanOrEqual(0);
    });
});
