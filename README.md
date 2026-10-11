# Broke But Functional — Survive the Month

A personal-finance web application designed to help users manage a strict ₹10,000 budget across 30 days, monitor daily spending and upcoming bills, protect savings cushions, and preview the financial impact of purchasing decisions before committing to them.

**Live Demo**: [https://broke-but-functional-theta.vercel.app/](https://broke-but-functional-theta.vercel.app/)  
**Source Repository**: [https://github.com/KrehantGajjar10/Prompt_Run_2026.git](https://github.com/KrehantGajjar10/Prompt_Run_2026.git)

---

## Overview

Managing a limited ₹10,000 monthly allowance or stipend is notoriously difficult. Daily food orders, transit expenses, rent splits, phone bills, and sudden social invites constantly compete for the same finite pool of cash. Traditional budgeting spreadsheets and banking apps only show past transactions—leaving users guessing whether they can safely afford an impulse purchase without running out of money before Day 30.

**Broke But Functional** bridges this gap by unifying income, spending, upcoming mandatory commitments, ring-fenced savings, and discretionary allowances into a live, interactive dashboard. Rather than relying on static backward-looking ledgers, the application computes an exact, dynamic safe-to-spend daily allowance and features an interactive sandbox simulator to preview the future consequences of financial decisions before swiping or scanning UPI.

---

## Problem Statement and Solution

### The Problem
Students, young professionals, and gig workers managing finite monthly stipends face a common mid-month shortfall. Because upcoming recurring obligations (broadband, recharge, rent splits) are not ring-fenced from liquid bank balances, users frequently experience a false sense of liquidity during the first two weeks of the month, only to discover they have depleted essential funds when fixed bills come due.

### Our Solution
**Broke But Functional** provides a deterministic survival ledger built around five core pillars:
1. **Zero Double-Counting Accounting**: Mandatory commitments are ring-fenced in advance so they cannot be accidentally spent. When marked as paid, they convert into recorded expenses while simultaneously releasing the reservation.
2. **Dynamic Daily Safe Allowance**: Recalculates safe discretionary limits every day based on actual remaining days and uncommitted cash.
3. **Protected Savings Envelopes**: Ring-fences money into goal vaults so it is separated from the daily spending allowance, while remaining withdrawable if genuine emergencies strike.
4. **Transparent Budget Pacing**: Compares the proportion of time elapsed against budget consumed, giving early warnings when spending outpaces the calendar.
5. **Decision Simulation Sandbox**: Enables users to test "What if I buy this right now?" and inspect side-by-side impact metrics before logging the transaction.

---

## Key Features

### Financial Dashboard & Budget Overview
- **Core KPI Summary Cards**: Instant visibility into Total Available Funds, Discretionary Balance, Total Spending, and Reserved Mandatory Commitments.
- **30-Day Survival Timeline**: Visual day-by-day progress tracking showing cycle milestones, current day indicator, and upcoming bill due markers.
- **Daily Spending Allowance**: Live computation of today's safe spending limit alongside actual burn rate versus target burn rate.
- **Daily Affordability Quick-Check**: In-dashboard micro-calculator to quickly test common purchases (e.g., ₹40 chai, ₹150 meal) against today's cushion.

### Income and Expense Tracking
- **Complete Transaction Ledger**: Add, edit, and delete transactions with support for title, amount, category, payment method, date/day, merchant, and notes.
- **Multi-Method Support**: Categorizes transactions across UPI (GPay, PhonePe, Paytm), Debit Cards, Net Banking, and Cash.
- **Search, Filter & Sort**: Search by title, merchant, or notes; filter by transaction type or category; sort by latest date, earliest date, highest amount, or lowest amount.

### Budget Pacing & Month-End Forecasts
- **Dual Pacing Comparisons**: Compares time elapsed against budget consumed, reporting exact rupee headroom or warning over-pace burn rates.
- **Proportional Funds Allocation Runway**: Multi-segmented proportional visual stack dividing total funds into Spent, Reserved Mandatory Bills, Locked Savings, and Discretionary Buffer.
- **Day 30 Forecast Engine**: Models projected month-end balance under three transparent scenarios: Current Burn Rate, Safe Daily Quota, and Baseline Pace.

### Category-Wise Spending Breakdown
- **Distribution Visualization**: Multi-segment visual bar and legend showing proportional spending across seven categories (Food & Dining, Groceries, Transport, Entertainment, Utilities, Shopping, and Health).
- **Per-Category Analytics**: Rupee totals, transaction counts, and percentage share of total expenditure.

### Commitments and Recurring Subscriptions
- **Upcoming Bill Management**: Track utility bills, Wi-Fi splits, rent, and streaming subscriptions with due days and auto-debit mandate indicators.
- **Lifecycle Tracking**:
  - *Reserved*: Automatically walled off from the daily safe allowance to prevent accidental spending.
  - *Mark Paid*: Seamlessly converts into a recorded expense transaction while releasing the reservation—preventing double deductions.
  - *Cancel Subscription*: Instantly releases reserved money back to the discretionary balance and boosts daily allowance.

### Savings Goals & Transfers
- **Goal Envelopes**: Create and track savings targets with custom priority tags (Essential, Goal, Wishlist) and category notes.
- **Interactive Transfer Modal**: Deposit surplus discretionary cash into savings or withdraw funds back to the available pool when needed.

### “Can I Afford This?” Decision Simulator
- **Interactive Sandbox**: Test prospective financial scenarios without immediately modifying active ledger data.
- **Supported Scenario Types**: Discretionary expenses, unexpected emergencies, savings deposits, savings withdrawals, cancelling recurring subscriptions, and paying upcoming bills early.
- **Side-by-Side Before-and-After Analysis**: Compares available balance, daily safe allowance, reserved pool, locked savings, and projected month-end net runway.
- **Risk Verdicts**: Generates structured advice (Safe, Caution, Danger / Overdraft Risk) with explicit consequences.
- **One-Click Commit**: Apply the simulated proposal directly to live ledger records or discard it cleanly.

### Local Persistence & Pristine Demo Reset
- **Browser Persistence**: State automatically persists across page reloads using browser `localStorage`.
- **Demo State & Safe Reset**: Pre-populated with a realistic 30-day starter ledger. Users can restore pristine demo values at any time via a confirmation modal.

---

## How It Works

```
┌────────────────────────────────────────────────────────┐
│ 1. Review Overview & Safe Daily Allowance              │
│    Inspect available balance, reserved bills & cushion │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. Record Inflows & Daily Expenses                     │
│    Log UPI/card transactions, merchants, and categories│
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. Manage Commitments & Ring-Fence Savings             │
│    Walled-off bills guarantee zero surprise shortfalls │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. Simulate Purchases in Sandbox ("Can I Afford This?")│
│    Model prospective expense, bill, or savings changes │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 5. Review Side-by-Side Impact & Commit to Ledger       │
│    Inspect daily quota impact, then Apply or Discard   │
└────────────────────────────────────────────────────────┘
```

1. **Review Dashboard**: Check current available balance, reserved bills, locked savings, and today's safe daily spending limit.
2. **Record Income and Expenses**: Log daily cash inflows or expenses with category, payment method, and merchant details.
3. **Manage Commitments and Savings**: Track upcoming bills so funds are ring-fenced in advance, and allocate money toward designated savings goals.
4. **Simulate a Prospective Decision**: Open the simulator to test a purchase, subscription cancellation, or savings transfer.
5. **Review Impact and Apply**: Compare projected daily allowances and month-end balances before choosing to apply the decision directly to the ledger or discard it.

---

## Technology Stack

| Technology | Purpose | Verified Version |
|---|---|---|
| **React** | Component-based UI library | `19.2.8` |
| **TypeScript** | Strict static typing and financial models | `~6.0.2` |
| **Vite** | Fast build tool and development server | `^8.3.0` |
| **Tailwind CSS** | Utility-first CSS framework with Tailwind v4 engine | `^4.3.3` |
| **Lucide React** | Consistent, accessible UI icon library | `^1.55.0` |
| **Vitest** | Unit test framework for financial calculation engine | `^5.0.3` |
| **ESLint** | Code quality, linting, and static analysis | `^10.10.0` |

---

## Application Architecture

The application is structured into modular feature domains, clear data separation, and a centralized React context backed by deterministic pure calculation functions:

```
src/
├── app/
│   └── AppContainer.tsx          # Top-level layout and navigation tab routing
├── components/
│   ├── common/                   # Shared UI primitives (Badge, Card, Modal, ResetConfirmModal)
│   ├── layout/                   # Global Header, Navigation, and Footer
│   └── ui/                       # Buttons, ProgressBar, and status indicators
├── context/
│   ├── FinanceContext.tsx        # Central state provider, dispatchers, and persistence sync
│   ├── financeContextDef.ts      # Context type definitions
│   └── useFinance.ts             # Custom hook for consuming finance state
├── data/
│   ├── categories.ts             # Category color palettes, labels, and icons
│   └── mockData.ts               # Pristine starter dataset for the 30-day cycle
├── features/
│   ├── commitments/              # Upcoming bills list, status toggles, and add/edit modals
│   ├── dashboard/                # KPI cards, pacing trackers, category breakdown, allowance card
│   ├── savings/                  # Savings goals grid, target progress, deposit/withdrawal modals
│   ├── simulator/                # Decision Simulator sandbox view, presets, and comparison cards
│   └── transactions/             # Transactions table, search/filter controls, add/edit modals
├── lib/
│   ├── calculations.ts           # Pure mathematical engine (summary, pacing, simulation)
│   ├── calculations.test.ts      # Unit test suite verifying accounting invariants
│   ├── currency.ts               # INR currency formatting (₹ / Lakh / tabular numerals)
│   └── storage.ts                # Safe localStorage serializer with validation fallback
└── types/
    ├── budget.ts                 # FinancialSummary, BurnRateStatus, PacingMetrics
    ├── commitment.ts             # UpcomingCommitment, CommitmentStatus
    ├── savings.ts                # SavingsGoal, SavingsPriority
    └── transaction.ts            # Transaction, TransactionCategory, PaymentMethod
```

- **State Management**: [`src/context/FinanceContext.tsx`](src/context/FinanceContext.tsx) maintains the live state (`transactions`, `commitments`, `savingsGoals`, `startingBudget`, `currentDay`). All summary figures and breakdowns are computed on the fly using `useMemo` hooks calling pure functions.
- **Persistence Layer**: [`src/lib/storage.ts`](src/lib/storage.ts) handles saving state to `localStorage` under `broke_but_functional_state_v1` on every mutation, with automatic JSON schema validation and safe fallback to default demo data if corrupted.

---

## Financial Calculations and Decision Simulation

The core accounting engine adheres to a strict invariant to guarantee financial consistency:

$$\text{Total Funds} = \text{Starting Budget} + \text{Inflows} = \text{Spent} + \text{Reserved Bills} + \text{Locked Savings} + \text{Safe Available Balance}$$

### Key Calculations

1. **Total Funds**:
   $$\text{Total Funds} = \text{startingBudget} + \sum \text{incomeTransactions}$$
2. **Recorded Spending**:
   $$\text{Total Spent} = \sum \text{expenseTransactions} + \sum \text{unlinkedPaidCommitments}$$
3. **Reserved Mandatory Commitments**:
   $$\text{Reserved Commitments} = \sum_{\text{status} = \text{'reserved'}} \text{commitmentAmount}$$
4. **Locked Savings**:
   $$\text{Savings Locked} = \sum_{\text{isLocked} = \text{true}} \text{goalCurrentAmount}$$
5. **Safe Available Discretionary Balance**:
   $$\text{Available Balance} = \max(0, \text{Total Funds} - \text{Total Spent} - \text{Reserved Commitments} - \text{Savings Locked})$$
6. **Daily Safe Allowance**:
   $$\text{Daily Safe Allowance} = \frac{\text{Available Balance}}{\text{Days Remaining}}$$
   *(where $\text{Days Remaining} = \max(1, \text{totalDays} - \text{currentDay} + 1)$)*

### Decision Simulation Mechanism
When a scenario is simulated in [`src/features/simulator/DecisionSimulatorView.tsx`](src/features/simulator/DecisionSimulatorView.tsx):
- A cloned, draft copy of the current financial state is passed to `simulateDecision()` in [`src/lib/calculations.ts`](src/lib/calculations.ts).
- The proposal alters the cloned state based on scenario type (e.g., deducting an expense, adding an emergency, marking a bill paid early, or transferring to savings).
- Both `before` and `after` metrics are computed independently, calculating exact differences (`diff`) for available balance, daily quota, reserved pool, and projected month-end balance.
- Active application state remains completely untouched until the user explicitly clicks **"Apply Decision to Ledger"**.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended; Node.js 20+ supported)
- `npm` (bundled with Node.js)

### Local Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/KrehantGajjar10/Prompt_Run_2026.git

# 2. Navigate to the project root
cd broke-but-functional

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

After running `npm run dev`, open your web browser and navigate to the local Vite URL displayed in the terminal (typically `http://localhost:5173`).

---

## Available Scripts

The project includes verified scripts configured in `package.json`:

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR) |
| `npm run build` | Runs TypeScript compilation (`tsc -b`) and bundles production assets into `dist/` |
| `npm run lint` | Executes ESLint to verify code quality, syntax rules, and React hooks conventions |
| `npm test` | Executes the Vitest test runner across calculation unit test suites |
| `npm run preview` | Spins up a local web server to inspect the compiled `dist/` production bundle |

---

## Testing and Quality Checks

The accounting and simulation logic is verified using Vitest:

- **Unit Test File**: [`src/lib/calculations.test.ts`](src/lib/calculations.test.ts)
- **Verified Result**: **9 passing tests** verifying:
  - Starting budget initialization and baseline daily allowances
  - Non-duplicative accounting formula integrity
  - Accurate calculation of safe discretionary balance
  - Automatic deduction and isolation of reserved commitments
  - Ring-fencing of locked savings goals
  - Zero double-counting when marking commitments as paid
  - Decision simulation delta calculations and risk level assignments
  - Empty lists, zero balances, and boundary day inputs safety
  - Graceful handling of heavy negative remaining balances without negative daily allowances

To run tests locally:
```bash
npm test
```

To run code quality lint checks:
```bash
npm run lint
```

---

## Data Storage and Privacy

- **Client-Side Storage**: All state is stored locally within the browser using `localStorage` under the key `broke_but_functional_state_v1`.
- **Privacy & Isolation**: No user data, transaction amounts, or personal notes are transmitted to remote servers, external APIs, or analytics trackers.
- **Device Scope**: Data persists only in the specific browser profile and device where it was entered; it does not automatically synchronize across multiple devices.
- **Clearing Data**: Clearing browser website data or cache will reset the application back to its default demo state.
- **Demo Reset**: A dedicated reset button in the header triggers a confirmation dialog that restores the clean starter dataset at any time.

---

## Design and Accessibility

- **Visual Identity**: Modern dark-mode aesthetic featuring deep charcoal foundations (`#09090b` canvas and `#18181b` card surfaces) paired with yellow-green lime accents (`#bef264`) for positive metrics, active tabs, and primary actions.
- **Color Independence**: Status changes combine distinct colors with descriptive textual badges and Lucide icons so color is never the sole conveyor of information.
- **Typography & Numeral Formatting**: Clean typography using the Inter font family with monospace tabular numerals (`font-mono tabular-nums`) to ensure financial amounts align neatly across tables and cards.
- **Responsive Fluidity**: Fluid layouts with responsive flexboxes and grids optimized for mobile smartphones (320px–430px), tablets (768px), laptops (1024px), and desktop monitors (1440px+).
- **Interactive Controls**: Keyboard-accessible modals, dropdowns, and buttons with visible outline focus rings (`focus:ring-2 focus:ring-accent-lime`).

---

## Live Application

**Try Broke But Functional — Survive the Month:**  
[**Open the Live App →**](https://broke-but-functional-theta.vercel.app/)

The application is publicly accessible and hosted on Vercel. Open the live app to explore the financial dashboard, manage transactions and savings goals, track upcoming commitments, and simulate financial decisions.

---

## Limitations and Future Scope

The current application focuses on client-side financial planning with browser-based data persistence. The following enhancements could extend its capabilities in future versions:

- **Financial Data Export and Import:** Enable users to download transaction records in CSV or JSON format and restore previously exported data.
- **Flexible Budget Cycles:** Support customizable budget periods, including weekly, biweekly, and user-defined financial cycles.
- **Category-Based Spending Limits:** Allow users to establish individual category budgets and monitor spending against each limit.
- **Receipt Management:** Support attaching receipt images to transactions for more detailed expense records.
- **Cross-Device Synchronization:** Explore optional cloud-based storage so users can access their financial data across multiple devices.

These are potential future enhancements, not features currently promised by the application.