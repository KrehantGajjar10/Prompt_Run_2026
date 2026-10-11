# Broke But Functional — Survive the Month

> A high-performance, responsive personal-finance web application tailored for Gen Z users navigating a fixed **₹10,000 budget across 30 days**.

---

## 1. Product Overview

Managing a strict ₹10,000 monthly budget requires making intentional spending choices every single day. **Broke But Functional** replaces generic spreadsheets with an interactive, deterministic survival ledger. It ring-fences non-negotiable upcoming commitments, safeguards savings goals, computes a live daily safe-to-spend allowance, and provides a sandbox Decision Simulator so users know the exact financial impact of a purchase before swiping or scanning UPI.

---

## 2. Core Accounting Principles

The application runs on a strict, mathematical non-duplicative accounting engine:

$$\text{Total Funds} = \text{Starting Budget} + \text{Inflows} = \text{Spent} + \text{Reserved Bills} + \text{Locked Savings} + \text{Available Balance}$$

### Key Rules:
1. **Starting Baseline**: Default starting budget of ₹10,000 over 30 days (baseline timeline starts on Day 12 with 19 days remaining).
2. **Safe Available Balance**: Calculated as `Total Funds - (Total Spent + Reserved Commitments + Locked Savings)`. Unreserved money is the only money safe for discretionary spending.
3. **Daily Safe Allowance**: Derived as $\max(0, \text{Available Balance}) / \text{Days Remaining}$. This dynamically recalculates every time an expense, income, bill payment, or savings transfer is registered.
4. **Commitment Lifecycle (Zero Double-Counting)**:
   - *Reserved*: An upcoming bill is held in reserve and deducted from safe available balance.
   - *Marked as Paid*: The bill transitions to `paid`, creating a recorded transaction under the bill's category. The reservation is simultaneously released so the amount is never deducted twice.
   - *Cancelled*: Cancelling an upcoming commitment immediately releases its reserved funds back to the user's available balance and boosts the daily allowance.
5. **Savings Discipline**: Savings are treated as owned assets ring-fenced from daily spending. Depositing money locks it away from the daily allowance; withdrawing returns it to the liquid available pool.

---

## 3. Visual Identity & Design System

Inspired by the dark-mode aesthetic of *Life in Receipts* (`https://web-rush-project.vercel.app/`):
- **Base Canvas**: Near-black zinc foundation (`#09090b` / `zinc-950`).
- **Surfaces**: Layered charcoal containers (`#121215`, `#18181b` / `zinc-900`) with subtle neutral borders (`zinc-800` / `zinc-700/60`).
- **Primary Accent**: Energetic lime green (`#bef264` / `accent-lime`) reserved for financial KPIs, active navigation states, primary buttons, and positive indicators.
- **Semantic Colors**: Reserved emerald for savings/income (`#34d399`), amber for financial caution (`#fbbf24`), and red for budget deficits or destructive actions (`#f87171`).
- **Typography & Layout**: Clean typography with tabular numerals for currency (`tabular-nums font-mono`) and fluid responsive layouts adapted for mobile, tablet, and wide desktop screens.

---

## 4. Key Features & Modules

### Overview & Dashboard
- **Financial KPI Cards**: Instant visibility into Total Funds, Safe Available Balance, Actual Spent, and Ring-Fenced Reserves.
- **30-Day Survival Timeline**: Visual day-by-day progress tracker with dynamic bill due markers and today's milestone.
- **Budget Pace Comparison**: Dual calibrated progress bars comparing proportion of days elapsed with proportion of budget consumed, with headroom calculation and pacing status verdict.
- **Proportional Funds Allocation Runway**: Stacked visual breakdown dividing total funds into Spent, Reserved Mandatory Bills, Locked Savings, and Discretionary Buffer.
- **Month-End Forecast Engine**: Day 30 projection modeling actual historical spending vs. future run-rate across three transparent scenarios (Current Run-Rate, Safe Daily Quota, and Baseline Pace) with documented assumptions.
- **Live Safe Daily Allowance**: Prominent metric displaying safe spending per day alongside target vs. actual burn rate.
- **Spending by Category**: Detailed distribution breakdown by category with rupee values, percentages, and visual bars.
- **Recent Transactions & Upcoming Bills**: Fast at-a-glance cards with quick-action triggers for instant adjustments.

### Transactions & Income Ledger
- Full CRUD operations for expense and income records.
- Support for Title, Amount, Category, Payment Method (UPI apps, cards, cash), Merchant, Date/Day, and Notes.
- Comprehensive search and filtering by transaction type, category, and payment method.
- Multi-criteria sorting (by latest date, earliest date, highest amount, lowest amount).
- Built-in validation guarding against empty titles, zero amounts, and invalid inputs.
- Responsive mobile list layout with touch targets and clear data hierarchy.

### Bills & Recurring Subscriptions
- Manage recurring payments (Wi-Fi, OTT subscriptions, room rent, electricity).
- Status toggles to **Mark as Paid** (instant non-duplicative conversion to expense) or **Cancel Subscription** (immediate fund release).
- Detailed metadata including provider, due date, auto-debit indicator, and billing notes.
- Mobile-optimized action buttons with flexible wrapping.

### Savings Goals & Transfers
- Goal management with target amounts, current progress, priority levels, and category badges.
- In-place deposit and withdrawal modal enabling transfers between liquid funds and savings reserves.

### Decision Simulator ("Can I Afford This?")
- Interactive sandbox allowing users to test hypothetical financial scenarios before logging them.
- Immediate before-and-after side-by-side comparison:
  - Projected Safe Available Balance
  - Projected Daily Safe Allowance
  - Reserved Bills Pool & Locked Savings Cushion
  - Projected Month-End Net Balance & Net Runway Impact
  - Risk Level Verdict (Safe, Caution, Danger / Deficit)
- Built-in presets for common Gen Z scenarios (Weekend party, Swiggy binge, extra savings, cancelling subscriptions).
- One-click **Apply Decision to Ledger** action to commit the scenario directly to the live state, or **Discard**.

### Local Persistence & Demo Reset
- Automated client-side persistence via `localStorage` with runtime schema validation.
- Reset modal with confirmation prompt to safely restore baseline demo figures at any time.

---

## 5. Responsive Design & Viewport Targets

The application is engineered with fluid containers, content-driven breakpoints, and touch accessibility tested across:
- **Small mobile**: 320 × 568 (iPhone SE)
- **Standard mobile**: 375 × 667 (iPhone 8)
- **Large mobile**: 430 × 932 (iPhone 14/15 Pro Max)
- **Tablet**: 768 × 1024 (iPad Portrait)
- **Laptop**: 1024 × 768 (Small laptop / iPad Landscape)
- **Desktop**: 1440 × 900 (MacBook Pro / Desktop)
- **Wide desktop**: 1920 × 1080 (Full HD Monitor)

---

## 6. Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 7. Getting Started

### Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- npm or yarn

### Installation
```bash
git clone <repository-url>
cd broke-but-functional
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Run Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Production Build
```bash
npm run build
```
The optimized production bundle will be output to the `dist/` directory.
