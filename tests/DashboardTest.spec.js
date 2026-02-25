import{test,expect} from '@playwright/test'

test('Verify dashboard elements after login',async({page})=>{
    // Navigate to Orange HRM login page
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');

    // Fill in username field
    const usernameInput = page.locator('input[name="username"]');
    await usernameInput.fill('Admin');

    // Fill in password field
    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill('admin123');

    // Click login button
    const loginButton = page.locator('button[type="submit"]');
    await loginButton.click();

    // Wait for navigation after login
    await page.waitForLoadState('networkidle');

    // Verify the presence of the main dashboard heading
    const dashboardHeading = page.locator('h6:has-text("Dashboard")');  
    await expect(dashboardHeading).toBeVisible();

    // Verify the user menu is visible (indicates logged-in state)
    const userDropdown = page.locator('img[alt="profile image"]');
    await expect(userDropdown).toBeVisible();

    // Take a screenshot of the dashboard for verification
    await page.screenshot({ path: 'dashboard-elements.png' });
})