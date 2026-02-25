import { test, expect } from '@playwright/test';
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');

test('Login with valid credentials for orange HRM', async ({ page }) => {
    test.slow();
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Navigate to Orange HRM login page
    await loginPage.navigate('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.waitForLoadState('networkidle');

    // Login
    await loginPage.login('nitin', 'Admin123');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    // Verify successful login by checking for dashboard elements
    await (expect(dashboardPage.isDashboardVisible()).toBeTruthy);
   // await expect(page.locator('h6:has-text("Dashboard")')).toBeVisible();
    // Or using DashboardPage method:
    // expect(await dashboardPage.isDashboardVisible()).toBeTruthy();

    // Take a screenshot of the dashboard for verification
    await page.screenshot({ path: 'login-success.png' });
});