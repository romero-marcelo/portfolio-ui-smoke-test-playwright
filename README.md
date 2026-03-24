# Portfolio: Fintech Broker UI Test Suite

End-to-end **smoke test suite** for a fintech broker platform, built with **Playwright** and **Page Object Model**. Validates critical user journeys using **API** and **DB-backed test data management**.


## What this suite validates

- **Sign-up** — multi-step registration; verification link extracted directly from MongoDB
- **Login** — password + **TOTP (2FA)** for both regular and corporate users
- **KYC** — identity verification flow with **Sumsub** integration handshake
- **Deposits** — payment gateway flow and handshake assertion
- **Internal Transfers** — wallet-to-wallet transfers with exchange rate service integration validation
- **Withdrawals** — payment gateway flow and handshake assertion
- **Logout**

## Architecture & Design Decisions

- **Page Object Model (POM)** — UI structure is decoupled from test logic, making tests easier to maintain and extend.
- **Custom Test Fixtures** — reusable fixtures handle repetive actions like login & authentication, and page object management, reducing repetitive setup code on spec files.
- **API-driven preconditions** — test state (e.g., resetting KYC status) is set via the Admin API, not through the UI. This keeps setup fast, allows reuse of a single user, and eliminates fragile UI-dependent flows.
- **DB-backed verification links** — sign-up links are fetched directly from MongoDB instead of polling an email inbox, removing a common source of flakiness.
- **Real TOTP generation** — 2FA is not mocked. Time-based tokens are generated with `otplib` to exercise the full authentication flow as a real user would.

## Tech stack

| Tool | Purpose |
|---|---|
| **Playwright** | Browser automation and test runner |
| **JavaScript** | Test language |
| **MongoDB driver** | Direct DB reads for verification links |
| **otplib** | TOTP token generation for 2FA |
| **@faker-js/faker** | Dynamic test data generation |

## Repo Structure

```
tests/
├── fixtures/                           # Custom fixtures for login automation
│   └── auth.fixture.js
├── helpers/                           
│   ├── adminHelper.js                 # Admin API auth + KYC reset
│   ├── authenticator.js               # TOTP generation
│   ├── index.js                       # Centralized exports
│   └── mongoHelper.js                 # MongoDB lookup for verification link
├── pageObjectModel/                    
│   ├── pages/                          # Full page objects
│   └── sections/                       # Reusable UI components
├── specs/                              
│   └── smoke/                          # Smoke test specs
└── test-data/                          
    ├── env.js                          # Environment config
    └── users.js                         # User fixtures

.github/workflows/playwright.yml     # CI/CD pipeline
playwright.config.js            
.env.example                         # Environment variables template
```


## Notes for reviewers

- This is a **Smoke Suite** — it targets critical happy paths, not exhaustive coverage. The goal is fast, reliable feedback after every deployment.
- Third-party integrations (payment gateways, KYC provider) are validated by confirming the handshake is reached, not by controlling their responses.

## CI/CD

Automated via **GitHub Actions** on:
- Push or pull request to `main`/`master`
- Daily schedule at 8:00 AM UTC
- Manual trigger

**Includes:** failure email notifications to the QA team inbox · HTML report artifacts (30-day retention) · staging environment with full secret management

## Contact

**LinkedIn:** [Marcelo Romero](https://www.linkedin.com/in/302-romero)
