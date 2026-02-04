const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Enable console logging
    page.on('console', msg => {
        console.log('BROWSER CONSOLE:', msg.text());
    });

    try {
        console.log('Navigating to login page...');
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });

        // Wait for and click sign in
        await page.waitForSelector('button:has-text("Sign In"), a:has-text("Sign In")', { timeout: 5000 });
        await page.click('button:has-text("Sign In"), a:has-text("Sign In")');
        await page.waitForTimeout(2000);

        // Enter credentials
        console.log('Entering credentials...');
        await page.type('input[type="email"], input[name="email"]', 'admin@arohanhealth.com');
        await page.type('input[type="password"], input[name="password"]', 'Admin123!');

        // Click login button
        await page.click('button[type="submit"]');

        // Wait for navigation
        await page.waitForTimeout(5000);

        console.log('Current URL:', page.url());
        console.log('Page title:', await page.title());

        // Take screenshot
        await page.screenshot({ path: '/tmp/admin_login.png', fullPage: true });
        console.log('Screenshot saved to /tmp/admin_login.png');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await browser.close();
    }
})();
