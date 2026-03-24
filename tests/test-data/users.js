import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config();

// Admin Users
const adminUser = {
  email: 'admin@fake.test',
  userId: '6708d4d6f65100b773bcbd90',
  password: process.env.ADMIN_PASSWORD,
  totpSecret: process.env.TOTP_SECRET_ADMIN_USER,
  recaptcha: process.env.ADMIN_RECAPTCHA,
};

// Sign-Up Flow
const allowedCountries = ['Bolivia', 'Germany', 'Singapore', 'Qatar']; 

const signUpUser = {
  user: {
    form1: {
      firstName: 'SignUp_QA',
      middleName: faker.person.middleName(),
      lastName: faker.person.lastName(),
      emailAddress: `user.signup${Date.now()}@fake.test`,      
      password: process.env.SIGNUP_PASSWORD,
      companyName: faker.company.name(),
    },

    form2: {
      phoneNumber: faker.helpers.replaceSymbols('+1#########'),
      dateOfBirth: (() => {
        const date = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
        return [date.getDate(), date.toLocaleString('en', { month: 'short' }), date.getFullYear()];
      })(),                                                   // Formating to: 1, JAN, 2000
      gender: 'Male',                                         // (Male | Female)
      preferredCurrency: 'USD',                               // (USD | EUR | GBP | CAD | BTC)
      preferredLanguage: 'English',                           // (English | Español | Français)
      country: faker.helpers.arrayElement(allowedCountries),  // Randomly select from allowed countries to avoid blacklist rejection
      address: ['123 Main St', 'Apt 4B', 'My City', '10001'], // Format: address1, address2 (optional), city, zipCode
    },
  },
};

//  LOGIN Flow
const loginUser = {
  regular: {
    name: 'Regular User',
    email: 'login.regular@fake.test',
    userId: '6877e323f0401b898caa0e7c',
    password: process.env.LOGIN_REGULAR_PASSWORD,
    totpSecret: process.env.LOGIN_REGULAR_TOTP_SECRET,
  },

  corporate: {
    name: 'Corporate User',
    email: 'login.corporate@fake.test',
    userId: '6874a7e55b717ee1635da31d',
    password: process.env.LOGIN_CORPORATE_PASSWORD,
    totpSecret: process.env.LOGIN_CORPORATE_TOTP_SECRET,
  },
};

//  KYC Verification Flow
const verificationUser = {
  kyc: {
    name: 'KYC User',
    email: 'kyc@fake.test',
    userId: '687e0c64e0d5dc9318a4e718',
    country: 'Iceland',
    password: process.env.KYC_PASSWORD,
    totpSecret: process.env.KYC_TOTP_SECRET,
  },
};

// Payments Flow (Deposit, Transfers, Withdraw)
const paymentUser = {
  deposit: {
    name: 'Deposits',
    email: 'deposits@fake.test',
    userId: '6889eb04e8c55d4bee4b7028',
    password: process.env.DEPOSITS_PASSWORD,
    totpSecret: process.env.DEPOSITS_TOTP_SECRET,
  },
  transfers: {
    name: 'Transfers',
    email: 'transfers@fake.test',
    userId: '688b9afc69b235ce41136e12',
    password: process.env.TRANSFERS_PASSWORD,
    totpSecret: process.env.TRANSFERS_TOTP_SECRET,
  },
  withdraw: {
    name: 'Withdraw',
    email: 'withdraw@fake.test',
    userId: '689092d564d888092e0a0bf2',
    password: process.env.WITHDRAW_PASSWORD,
    totpSecret: process.env.WITHDRAW_TOTP_SECRET,
  },
};

// Logout Flow (has 2FA disabled)
const logoutUser = {
  name: 'Logout',
  email: 'logout@fake.test',
  userId: '68923b0d05e54a066345ea76',
  password: process.env.LOGOUT_PASSWORD,
  recaptcha: process.env.LOGOUT_RECAPTCHA,
};

export { adminUser, signUpUser, loginUser, verificationUser, paymentUser, logoutUser };
