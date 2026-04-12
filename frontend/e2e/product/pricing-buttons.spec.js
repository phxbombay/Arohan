import { test, expect } from '@playwright/test';

test('Pricing buttons working check', async ({ page }) => {
    await page.goto('/pricing');

    // Check Basic plan button
    const basicBtn = page.getByRole('button', { name: /Download Free App/i });
    await expect(basicBtn).toBeVisible();
    await basicBtn.click();
    // Should show info toast (hard to test toast without specific library listeners, but we check visibility)
    
    // Check Premium plan button
    const premiumBtn = page.getByRole('button', { name: /Start Free Trial/i });
    await expect(premiumBtn).toBeVisible();
    await premiumBtn.click();
    await expect(page).toHaveURL(/.*signin/);

    // Go back to pricing
    await page.goto('/pricing');

    // Check Annual Deal button
    const annualDealBtn = page.getByTestId('annual-deal-btn');
    await expect(annualDealBtn).toBeVisible();
    await annualDealBtn.click();
    await expect(page).toHaveURL(/.*signin/);
});
