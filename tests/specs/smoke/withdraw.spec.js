import { test, expect } from '@playwright/test';
import { paymentUser } from '../../test-data/users.js';
import { LoginPage, Verify2FAPage, DashboardPage, WithdrawPage } from '../../pageObjectModel/pages/index.js';
import { getOtpfromAPP } from '../../helpers/index.js';
import dotenv from 'dotenv';
dotenv.config();

test('Withdraw flow and Payment Gateway handshake', async ({ page }) => {
  
  const loginPage = new LoginPage(page);
  const verify2FAPage = new Verify2FAPage(page);
  const dashboardPage = new DashboardPage(page);
  const withdrawPage = new WithdrawPage(page);
  let otp;

  
  await loginPage.goto();
  await loginPage.enterUserCredentials(paymentUser.withdraw.email, paymentUser.withdraw.password);
  await loginPage.clickLoginButton();
  otp = getOtpfromAPP(paymentUser.withdraw);
  await verify2FAPage.enterOTP(otp);

  await dashboardPage.clickWithdrawActionCard();
  await withdrawPage.clickWithdrawTypeDropdown();
  await withdrawPage.selectBitcoinCurrency();
  await withdrawPage.clickSelectWalletDropdown();
  await withdrawPage.selectUsdWallet();
  await withdrawPage.selectAmount();
  await withdrawPage.enterAmount();
  await withdrawPage.clickRequestWithdrawal();
  await withdrawPage.clickNormalWithdrawalCard();
  await withdrawPage.clickWithdraw();

  // Assert: Payment Gateway connection
  await withdrawPage.gatewayPaymentTitle().waitFor({ state: 'visible' });
  await expect(withdrawPage.gatewayPaymentTitle()).toContainText('Enter  address you wish to withdraw funds to');
  await expect(page).toHaveURL(/.*payments-gateway\.crmdevz\.com\/withdraw.*/);
});
