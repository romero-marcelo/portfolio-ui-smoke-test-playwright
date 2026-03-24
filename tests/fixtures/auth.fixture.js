import { test as base } from '@playwright/test';
import { getOtpfromAPP } from '../helpers/index.js';
import { LoginPage, Verify2FAPage, DashboardPage } from '../pageObjectModel/pages/index.js';
import { HeaderSection } from '../pageObjectModel/sections/index.js';

export const test = base.extend({
  pageObjects: async ({ page }, use) => {
    const pageObjects = {
      page,
      loginPage: new LoginPage(page),
      verify2FAPage: new Verify2FAPage(page),
      headerSection: new HeaderSection(page),
      dashboardPage: new DashboardPage(page)
    };
    
    await use(pageObjects);
  },

  performLogin: async ({ pageObjects }, use) => {
    const loginFunction = async (userType) => {

      await pageObjects.loginPage.goto();
      await pageObjects.loginPage.enterUserCredentials(userType.email, userType.password);
      await pageObjects.loginPage.clickLoginButton();

      const otp = getOtpfromAPP(userType);
      await pageObjects.verify2FAPage.enterOTP(otp);

      await pageObjects.headerSection.userGreeting().waitFor({ state: 'visible' });
    };

    await use(loginFunction);
  }
});

export { expect } from '@playwright/test';
