import { test, expect } from '@playwright/test';
import { verificationUser } from '../../test-data/users.js';
import { LoginPage, Verify2FAPage, VerificationPage } from '../../pageObjectModel/pages/index.js';
import { SumSubModal, LetsGetYouVerifiedSection } from '../../pageObjectModel/sections/index.js';
import { getOtpfromAPP, resetKycUser } from '../../helpers/index.js';
import dotenv from 'dotenv';
dotenv.config();

  test('KYC user flow - SumSub hand-shake', async ({ page }) => {
    
  const loginPage = new LoginPage(page);
  const verify2FAPage = new Verify2FAPage(page);
  const letsGetYouVerifiedSection = new LetsGetYouVerifiedSection(page);
  const verificationPage = new VerificationPage(page);
  const sumSubModal = new SumSubModal(page);
  let otp;

  // Preparing user to NOT_VERIFIED state via Admin API
  await resetKycUser(verificationUser.kyc.userId);

  // Act
  await loginPage.goto();
  await loginPage.enterUserCredentials(verificationUser.kyc.email, verificationUser.kyc.password);
  await loginPage.clickLoginButton();

  otp = getOtpfromAPP(verificationUser.kyc);
  await verify2FAPage.enterOTP(otp);

  // CRM Modal Flow
  await letsGetYouVerifiedSection.waitForVisible();
  await expect(letsGetYouVerifiedSection.bodyTitle()).toHaveText("Let's Get You Verified");

  await letsGetYouVerifiedSection.clickVerifyMyIdentity();
  await expect(verificationPage.identityVerificationTitle()).toHaveText('Identity Verification');

  await verificationPage.clickStartVerificationButton();
  await expect(verificationPage.countrySelectionTitle()).toHaveText('Country Selection');

  await verificationPage.selectCountry(verificationUser.kyc.country);
  await verificationPage.clickSaveCountryButton();
  await expect(verificationPage.updateDetailsTitle()).toHaveText('Update Details to Match Document');
  await verificationPage.clickConfirmButton();

  // SumSub Integration Hand-shake
  await sumSubModal.headerTitleOne().waitFor({ state: 'visible' });
  await expect(sumSubModal.headerTitleOne()).toHaveText('Consent to start verification');
});
