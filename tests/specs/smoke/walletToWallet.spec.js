import { test, expect } from '@playwright/test';
import { paymentUser } from '../../test-data/users.js';
import { LoginPage, Verify2FAPage, DashboardPage, TransfersPage } from '../../pageObjectModel/pages/index.js';
import { getOtpfromAPP } from '../../helpers/index.js';
import { AdminApi } from '../../helpers/adminHelper.js';
import dotenv from 'dotenv';
dotenv.config();

test('wallet to wallet transfer (USD to EUR)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const verify2FAPage = new Verify2FAPage(page);
  const dashboardPage = new DashboardPage(page);
  const transferPage = new TransfersPage(page);
  const amount = '1';
  let otp;

  await loginPage.goto();
  await loginPage.enterUserCredentials(paymentUser.transfers.email, paymentUser.transfers.password);
  await loginPage.clickLoginButton();
  otp = getOtpfromAPP(paymentUser.transfers);
  await verify2FAPage.enterOTP(otp);

  // USD Wallet to EUR Wallet Transfer flow
  await dashboardPage.transferActionCard().waitFor({ state: 'visible' });
  await dashboardPage.clickTransferActionCard();
  await transferPage.clickTransferTypeDropdown();
  await transferPage.selectWalletToWalletOption();
  await transferPage.clickTransferFromDropdown();
  await transferPage.selectUsdWalletOption();
  await transferPage.clickTransferToDropdown();
  await transferPage.selectEurWalletOption();
  await transferPage.amountToTransferInput().click();
  await transferPage.amountToTransferInput().fill(amount);
  await transferPage.requestTransferButton().click();

  // Transfer and Exchange Rate confirmation (rate given by TradrAPI)
  await transferPage.transferConfirmationHeader().waitFor({ state: 'visible' });
  await expect(transferPage.transferConfirmationHeader()).toHaveText('Transfer Confirmation');
  await transferPage.transferConfirmationParagraph().waitFor({ state: 'visible' });
  await expect(transferPage.transferConfirmationParagraph()).toContainText(
    /Send \$\d+(?:\.\d+)? from your USD wallet and get €(?!0(?:\.0+)?$)[\d.]+(?!\d) in your EUR wallet/,
  ); //Regex to match any amount of euro received, greater than 0
  await transferPage.clickTransferButton();

  await transferPage.confirmationMessage().waitFor({ state: 'visible' });
  await expect(transferPage.confirmationMessage()).toContainText('Transfer completed!');
});
