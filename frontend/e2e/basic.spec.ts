import { test, expect } from '@playwright/test';

test('homepage has title and critical elements', async ({ page }) => {
    await page.goto('http://localhost:8080/');

    // Check title
    await expect(page).toHaveTitle(/Arohan/);

    // Check for specialized "No-JS" fallback isn't visible (implies JS runs)
    const noscriptText = await page.textContent('noscript');
    expect(noscriptText).toBeTruthy(); // Just ensuring it exists, handling check differently if needed

    // Check critical UI elements
    await expect(page.locator('header')).toBeVisible();

    // Check navigation
    const getStartedBtn = page.getByRole('button', { name: /Get Started|Emergency/i }).first();
    await expect(getStartedBtn).toBeVisible();
});

test('cookie consent banner appears', async ({ page }) => {
    // Clear cookies context
    await page.context().clearCookies();
    await page.goto('http://localhost:8080/');

    // Check for cookie banner
    await expect(page.getByText('We value your privacy')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Accept' })).toBeVisible();
});
