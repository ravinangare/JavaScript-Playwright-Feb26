import { test, expect } from '@playwright/test';
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const AdminPage = require('../pages/AdminPage');

// Helper for login
async function login(page) {
  const loginPage = new LoginPage(page);
  await loginPage.navigate('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.waitForLoadState('networkidle');
  await loginPage.login('Admin', 'admin123');
  await page.waitForLoadState('networkidle');
}

test.describe('Dashboard Page Tests', () => {
  test('Dashboard header is visible', async ({ page }) => {
    test.slow();
    await login(page);
    const dashboardPage = new DashboardPage(page);
    await expect(page.locator('h6:has-text("Dashboard")')).toBeVisible();
    // or: expect(await dashboardPage.isDashboardVisible()).toBeTruthy();
  });

  test('Dashboard page title is correct', async ({ page }) => {
    test.slow();
    await login(page);
    const dashboardPage = new DashboardPage(page);
    await expect(await dashboardPage.getTitle()).toContain('OrangeHRM');
  });
});

test.describe('Admin Page Tests', () => {
  test('Navigate to Admin tab and check User Management', async ({ page }) => {
    test.slow();
    await login(page);
    const adminPage = new AdminPage(page);
    await adminPage.goToAdminTab();
    console.log('Admin tab clicked, checking User Management visibility...');
    await expect(page.locator(adminPage.userManagementHeader)).toBeVisible();
  });

  test('Search for a user in Admin page', async ({ page }) => {
    test.slow();
    await login(page);
    const adminPage = new AdminPage(page);
    await adminPage.goToAdminTab();
    await adminPage.searchUser('Admin');
    // Add assertion for search result if needed
    await expect(page.locator(adminPage.adminusernameField)).toBeVisible();
  });
  test.only('Create new User in Admin Page',async({page})=>{
    test.slow();
    await login(page);
    const adminPage = new AdminPage(page);
    await adminPage.goToAdminTab();
    await adminPage.clickonAddButton();
    await adminPage.selectUserRoleAsAdmin();
    await adminPage.SelectUserStatusAsEnabled();
    await adminPage.clickonSearchEmp();
    await adminPage.SearchEmployee('ravi');
    await adminPage.EnterUsername('abhin');
    await adminPage.EnterPassword('Admin123');
    await adminPage.EnterConfirmPassword('Admin123');
    await adminPage.ClickonSaveButton();
    await page.waitForTimeout(5000);
  })
});
