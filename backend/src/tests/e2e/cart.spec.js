import { test, expect } from '@playwright/test';

test.describe('Cart Operations', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/login');
        await page.fill('[name="email"]', 'test@example.com');
        await page.fill('[name="password"]', 'SecurePass123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should add item to cart', async ({ page }) => {
        await page.goto('/products');

        // Click first product
        await page.click('.product-card:first-child');

        // Add to cart
        await page.click('button:has-text("Add to Cart")');

        // Verify success notification
        await expect(page.locator('text=/added to cart/i')).toBeVisible();

        // Go to cart
        await page.click('[href="/cart"]');

        // Verify item in cart
        await expect(page.locator('.cart-item')).toHaveCount(1);
    });

    test('should update item quantity', async ({ page }) => {
        await page.goto('/cart');

        // Increase quantity
        await page.click('[aria-label="Increase quantity"]');

        // Wait for update
        await page.waitForTimeout(500);

        // Verify quantity changed
        const quantity = await page.locator('.quantity-value').textContent();
        expect(parseInt(quantity)).toBeGreaterThan(1);
    });

    test('should remove item from cart', async ({ page }) => {
        await page.goto('/cart');

        const initialCount = await page.locator('.cart-item').count();

        // Remove first item
        await page.click('.cart-item:first-child button:has-text("Remove")');

        // Confirm if modal appears
        const confirmButton = page.locator('button:has-text("Confirm")');
        if (await confirmButton.isVisible()) {
            await confirmButton.click();
        }

        // Wait for removal
        await page.waitForTimeout(500);

        // Verify count decreased
        const newCount = await page.locator('.cart-item').count();
        expect(newCount).toBe(initialCount - 1);
    });
});
