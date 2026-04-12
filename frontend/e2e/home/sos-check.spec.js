import { test, expect } from '@playwright/test';

test('SOS button working check', async ({ page }) => {
    await page.goto('/');

    // Check if the floating SOS button is visible
    const sosButton = page.getByTestId('sos-button');
    await expect(sosButton).toBeVisible();

    // Click the button
    await sosButton.click();

    // Verify the emergency dialog appears
    const dialogTitle = page.locator('h5');
    await expect(dialogTitle).toContainText(/Emergency Services Alerted/i);
    
    // Verify the disclaimer is present
    await expect(page.locator('text=/This feature will be enabled soon/i')).toBeVisible();

    // Close the dialog
    await page.keyboard.press('Escape');
    await expect(dialogTitle).not.toBeVisible();
});
