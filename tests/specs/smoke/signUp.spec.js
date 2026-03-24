import { test, expect } from '@playwright/test';
import { signUpUser } from '../../test-data/users.js';
import { LoginPage, SignUpPageForm1, SignUpPageForm2 } from '../../pageObjectModel/pages/index.js';
import { HeaderSection } from '../../pageObjectModel/sections/index.js';
import { getSignUpLinkFromMongo } from '../../helpers/mongoHelper.js';

test.describe('Sign Up Tests', () => {
  test('Regular User Sign Up', async ({ page }) => {
    //   Arrange
    const loginPage = new LoginPage(page);
    const signUpPage1 = new SignUpPageForm1(page);
    const signUpPage2 = new SignUpPageForm2(page);
    const headerSection = new HeaderSection(page);

    //  Act - Form 1
    await loginPage.goto();
    await loginPage.clickSignUpLink();

    await signUpPage1.enterNewUserDetails(
      signUpUser.user.form1.firstName,
      signUpUser.user.form1.lastName,
      signUpUser.user.form1.middleName,
      signUpUser.user.form1.emailAddress,
      signUpUser.user.form1.password,
    );
    await signUpPage1.checkTermsCheckbox();
    await signUpPage1.clickSignUpButton();
    await expect(signUpPage1.emailSentConfirmationMessage()).toBeVisible();

    // Fetch the sign Up Link code from MongoDB
    const signUpLink = await getSignUpLinkFromMongo(signUpUser.user.form1.emailAddress);

    //  Act - Form 2
    await page.goto(signUpLink);
    await signUpPage2.headerTitle().waitFor({ state: 'visible' });
    await expect(signUpPage2.headerTitle()).toHaveText('Sign Up Now');

    await signUpPage2.enterPhoneNumber(signUpUser.user.form2.phoneNumber);
    await signUpPage2.enterDateOfBirth(...signUpUser.user.form2.dateOfBirth);
    await signUpPage2.enterGender(signUpUser.user.form2.gender);
    await signUpPage2.enterCurrency(signUpUser.user.form2.preferredCurrency);
    await signUpPage2.enterPreferredLanguage(signUpUser.user.form2.preferredLanguage);
    await signUpPage2.enterCountry(signUpUser.user.form2.country);
    await signUpPage2.enterAddress(...signUpUser.user.form2.address);
    await signUpPage2.clickCreateYourAccountButton();

    // Assert
    await headerSection.userGreeting().waitFor({ state: 'visible' });
    await expect(headerSection.userGreeting()).toHaveText(`Hey, ${signUpUser.user.form1.firstName}`);
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});
