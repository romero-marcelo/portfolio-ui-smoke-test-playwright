import { test, expect } from '@playwright/test';
import { DashboardPage, LoginPage } from '../../pageObjectModel/pages/index.js';
import { HeaderSection } from '../../pageObjectModel/sections/index.js';
import { logoutUser } from '../../test-data/users.js';
import dotenv from 'dotenv';
dotenv.config();

test('Logout successful', async ({ page }) => {
  
  const loginPage = new LoginPage(page);
  const headerSection = new HeaderSection(page);
  const dashboardPage = new DashboardPage(page);

  // Act
  await loginPage.goto();
  await loginPage.enterUserCredentials(logoutUser.email, logoutUser.password);
  await loginPage.clickLoginButton();

  // Assert
  
  expect(page).toHaveURL(/.*dashboard.*/);

  await headerSection.userGreeting().waitFor({ state: 'visible' });
  await expect(headerSection.userGreeting()).toHaveText(`Hey, ${logoutUser.name}`);

  await headerSection.clickLogoutButton();
  await expect(page).toHaveURL(/.*login.*/);
  await expect(page.getByRole('heading', { name: 'Log In to Your Account' })).toBeVisible();

  await dashboardPage.goto();
  await expect(page).toHaveURL(/.*login.*/);
});
