import { test, expect } from '@playwright/test';

test('Partner with us button working', async ({ page }) => {
    await page.goto('/');

    // Scroll to the button in the Hero section
    const partnerBtn = page.getByRole('link', { name: /Partner with Us/i });
    await expect(partnerBtn).toBeVisible();

    // Click and verify navigation
    await partnerBtn.click();
    await expect(page).toHaveURL(/.*partners/);
    
    // Verify the Partners page loads content
    await expect(page.locator('h1, h2')).toContainText(/Partner|Collaboration/i);
});
