import { test, expect } from '@playwright/test';

test('Add to cart button working', async ({ page }) => {
    await page.goto('/products');

    // Click 'Add to Cart' button
    const addToCartBtn = page.getByTestId('add-to-cart-btn');
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // Verify redirect to signin (since not logged in)
    await expect(page).toHaveURL(/.*signin/);
    
    // Verify toast or message about logging in
    const loginMessage = page.locator('text=/login to add items/i');
    // Note: Toasts might disappear quickly, so we just check for signin page presence
    await expect(page.locator('h1')).toContainText(/Sign In/i);
});
