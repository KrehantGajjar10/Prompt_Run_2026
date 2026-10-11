# Broke But Functional — Survive the Month

A personal-finance web application designed to help users manage a ₹10,000 budget across 30 days, track spending and upcoming bills, protect savings, and evaluate financial decisions before applying them to their ledger.

---

## Overview

Sticking to a strict ₹10,000 monthly budget is challenging when daily expenses, upcoming mandatory bills, subscriptions, savings targets, and sudden costs all compete for the same cash pool. Most budgeting tools fail because they only track past expenses rather than showing what is safe to spend today.

**Broke But Functional** centers on financial clarity and forward planning. Users can instantly assess their true available balance, understand their safe daily spending limit, and test potential purchases in a real-time simulator before committing their money.

---

## Key Features

- **Financial Dashboard & Budget Overview**: Instant visibility into total budget, safe available balance, total spending, and ring-fenced funds.
- **Safe Daily Allowance & Pacing**: Live calculation of daily safe spending limits alongside a 30-day timeline and budget pacing comparisons.
- **Income & Expense Tracking**: Full transaction management with support for categories, payment methods (UPI, debit card, cash), dates, merchants, and notes.
- **Category-Wise Spending Breakdown**: Visual breakdown and percentage distribution of expenses across categories (Food & Dining, Groceries, Transport, Utilities, Entertainment, Shopping, and Health).
- **Upcoming Commitments & Subscriptions**: Dedicated tracker for bills and subscriptions with the ability to mark bills as paid or cancel subscriptions to release reserved funds.
- **Savings Goals with Deposits & Withdrawals**: Ring-fence funds for target goals with flexible transfer controls to deposit from or withdraw back to the available balance.
- **“Can I Afford This?” Decision Simulator**: Sandbox environment to test prospective expenses, bill payments, new commitments, or savings changes before making them.
- **Before-and-After Comparisons & Forecasts**: Side-by-side analysis of how a decision alters daily allowances, available balances, and month-end financial projections.
- **Persistent Local Data & Demo Reset**: Automatic state persistence in the browser, complete with a confirmation dialog to restore the clean demo dataset at any time.

---

## How It Works

1. **Review Financial Overview**: Check current available balance, reserved mandatory bills, locked savings, and today's safe daily spending limit on the dashboard.
2. **Record Income and Expenses**: Log daily cash inflows or expenses with category, payment method, and merchant details.
3. **Track Commitments and Savings**: Manage upcoming bills so funds are ring-fenced in advance, and allocate money toward designated savings goals.
4. **Simulate a Decision**: Open the simulator to test a prospective purchase, emergency expense, or subscription change.
5. **Review Impact and Apply**: Compare projected daily allowances and month-end balances before choosing to apply the decision directly to the ledger or discard it.

---

## Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (bundled with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate into the project directory:
   ```bash
   cd broke-but-functional
   ```

3. Install project dependencies:
   ```bash
   npm install
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## Available Scripts

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Type-checks TypeScript files and compiles an optimized production build into `dist/`.
- `npm run lint`: Runs ESLint across project files to check for syntax and style issues.
- `npm test`: Runs the Vitest test suite to verify financial calculation logic.
- `npm run preview`: Starts a local web server to preview the built application from the `dist/` folder.

---

## Data and Privacy

- **Local Storage**: All application data is stored purely on the client side using browser `localStorage` (`broke_but_functional_state_v1`).
- **Device Isolation**: Data persists within the specific browser and device used; it is not sent to any external server or synchronized across devices.
- **No Remote Backend**: There are no remote databases, third-party user tracking scripts, or authentication requirements.
- **Demo State & Reset**: The application initializes with a realistic demo dataset. Users can reset back to this pristine state at any point using the reset button in the navigation bar.

---

## Design and Accessibility

- **Theme**: Near-black and charcoal palette accented with purposeful lime green highlights for key financial indicators and active elements.
- **Visual Hierarchy**: Structured layout utilizing clear typography, tabular numerals for currency figures, and readable contrast against dark surfaces.
- **Responsive Layout**: Designed to adapt fluidly across mobile phones, tablets, laptops, and desktop screens.
- **Keyboard Navigation**: Interactive buttons, modals, and input fields support standard keyboard navigation and clear focus rings.

---

## Production Build and Deployment

### Creating and Previewing a Production Build

To generate the production bundle:
```bash
npm run build
```

To test the generated build locally:
```bash
npm run preview
```

### Deploying to Vercel

The application is configured for deployment on [Vercel](https://vercel.com/):

1. Import the repository into your Vercel account.
2. Select **Vite** as the framework preset (or keep the default settings).
3. Ensure the project settings specify:
   - **Root Directory**: `.` (repository root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy the project. Once complete, copy and add your live production URL to the repository description.

---

## Project Status

The core application is fully implemented, verified with passing unit tests and lint checks, and ready for use.
