import { test, expect } from '@playwright/test';

test.describe('Multi-User Role Verification', () => {
    
    const users = [
        {
            role: 'Admin',
            email: 'admin@arohanhealth.com',
            password: 'Admin123!',
            expectedPath: /\/admin/
        },
        {
            role: 'Physician/Doctor',
            email: 'doctor@arohanhealth.com',
            password: 'Doctor123!',
            expectedPath: /\/physician\/dashboard/
        },
        {
            role: 'Hospital Admin',
            email: 'hospital@arohanhealth.com',
            password: 'Hospital123!',
            expectedPath: /\/hospital\/dashboard/
        },
        {
            role: 'Patient',
            email: 'patient@test.com',
            password: 'Patient123!',
            expectedPath: /\/(patient\/dashboard|dashboard)/
        }
    ];

    for (const user of users) {
        test(`should login successfully as ${user.role}`, async ({ page }) => {
            // Set a long timeout for the entire test
            test.setTimeout(60000);

            console.log(`Testing login for ${user.role}...`);

            // Go to sign in page
            await page.goto('/signin', { waitUntil: 'networkidle' });

            // Fill login form
            await page.fill('input[name="email"]', user.email);
            await page.fill('input[name="password"]', user.password);
            
            // Wait for navigation and URL change after clicking submit
            await Promise.all([
                page.waitForURL(user.expectedPath, { timeout: 20000 }),
                page.click('button[type="submit"]')
            ]);

            // Verify redirection
            await expect(page).toHaveURL(user.expectedPath);
            console.log(`Successfully reached ${user.role} dashboard`);
            
            // Verify presence of Logout button in Header (which always contains the logout button)
            const logoutBtn = page.locator('button:has-text("Logout"), [aria-label="logout"]');
            await expect(logoutBtn).toBeVisible({ timeout: 15000 });

            console.log(`Success: Logged in and verified for ${user.role}`);
        });
    }
});
