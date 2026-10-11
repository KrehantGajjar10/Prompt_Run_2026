import type { FinancialSummary, BurnRateStatus } from '../types/budget';
import type { Transaction, TransactionCategory } from '../types/transaction';
import type { UpcomingCommitment } from '../types/commitment';
import type { SavingsGoal } from '../types/savings';

export interface CalculationInput {
  startingBudget: number;
  additionalIncome?: number;
  totalDays: number;
  currentDay: number;
  transactions: Transaction[];
  commitments: UpcomingCommitment[];
  savingsGoals: SavingsGoal[];
}

export interface CategorySpendingSummary {
  category: TransactionCategory;
  totalSpent: number;
  transactionCount: number;
  percentageOfTotalSpend: number;
}

/**
 * Calculates the complete financial state for the 30-day budgeting challenge.
 * Strictly adheres to:
 * 1. Total Funds = startingBudget + additionalIncome (or income transactions)
 * 2. Actual Spending = expenses posted + paid commitments (deduped)
 * 3. Locked Savings = sum of currentAmount in locked savings goals
 * 4. Reserved Commitments = unpaid mandatory commitments (status === 'reserved')
 * 5. Safe Available Balance = Total Funds - Actual Spending - Locked Savings - Reserved Commitments
 * 6. Safe Daily Allowance = max(0, Safe Available Balance) / Days Remaining
 */
export function calculateFinancialSummary(input: CalculationInput): FinancialSummary {
  const {
    startingBudget,
    additionalIncome: explicitIncome = 0,
    totalDays,
    currentDay,
    transactions,
    commitments,
    savingsGoals,
  } = input;

  const safeTotalDays = Math.max(1, totalDays || 30);
  const clampedCurrentDay = Math.min(Math.max(1, currentDay || 1), safeTotalDays);
  // Definition of remaining days: inclusive of current day (from currentDay to totalDays)
  const daysRemaining = Math.max(1, safeTotalDays - clampedCurrentDay + 1);

  // 1. Additional income from transactions (type === 'income') + explicit income
  const transactionIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((acc, tx) => acc + Math.max(0, tx.amount), 0);
  const additionalIncome = explicitIncome + transactionIncome;
  const totalFunds = Math.max(0, startingBudget + additionalIncome);

  // 2. Actual posted expense transactions
  const expenseTransactions = transactions.filter((tx) => tx.type !== 'income');
  const transactionExpenseTotal = expenseTransactions.reduce(
    (acc, tx) => acc + Math.max(0, tx.amount),
    0
  );

  // Count paid commitments that do NOT already have a matching transaction linked in expenseTransactions
  const linkedTxIds = new Set(
    expenseTransactions
      .map((tx) => tx.relatedCommitmentId)
      .filter((id): id is string => Boolean(id))
  );

  const unlinkedPaidCommitmentsTotal = commitments
    .filter((c) => c.status === 'paid' && !linkedTxIds.has(c.id) && !c.paidTransactionId)
    .reduce((acc, c) => acc + Math.max(0, c.amount), 0);

  const totalSpent = transactionExpenseTotal + unlinkedPaidCommitmentsTotal;

  // 3. Reserved upcoming commitments (bills not yet paid, actively walled off)
  const reservedCommitments = commitments
    .filter((c) => c.status === 'reserved' && c.isReserved)
    .reduce((acc, c) => acc + Math.max(0, c.amount), 0);

  // 4. Locked savings set aside from discretionary spending
  const savingsLocked = savingsGoals
    .filter((g) => g.isLocked)
    .reduce((acc, g) => acc + Math.max(0, g.currentAmount), 0);

  // 5. Truly safe available discretionary balance
  const rawAvailable = totalFunds - totalSpent - reservedCommitments - savingsLocked;
  const availableBalance = Math.max(0, rawAvailable);

  // 6. Daily allowances
  const baselineDailyAllowance = totalDays > 0 ? totalFunds / totalDays : 0;
  const dailySafeAllowance = daysRemaining > 0 ? availableBalance / daysRemaining : 0;

  // 7. Spending today (expense transactions recorded on clampedCurrentDay)
  const spentToday = expenseTransactions
    .filter((tx) => tx.day === clampedCurrentDay)
    .reduce((acc, tx) => acc + Math.max(0, tx.amount), 0);

  // 8. Progress percentages
  const monthElapsedPercent = Math.min(
    100,
    Math.round((clampedCurrentDay / totalDays) * 100)
  );
  const budgetSpentPercent = Math.min(
    100,
    Math.round((totalSpent / (totalFunds || 1)) * 100)
  );

  // 9. Burn rate metrics
  const dailyAverageBurnRate =
    clampedCurrentDay > 0 ? totalSpent / clampedCurrentDay : 0;

  // Projection: if user continues spending at current daily average for remaining days
  const projectedFutureDiscretionarySpend =
    dailyAverageBurnRate * Math.max(0, daysRemaining - 1);
  const rawProjectedMonthEnd = availableBalance - projectedFutureDiscretionarySpend;
  const projectedMonthEndBalance = Math.round(rawProjectedMonthEnd);

  // 10. Deterministic burn rate status
  const burnRateStatus = determineBurnRateStatus({
    dailySafeAllowance,
    baselineDailyAllowance,
    monthElapsedPercent,
    budgetSpentPercent,
    availableBalance,
  });

  return {
    startingBudget,
    additionalIncome,
    totalFunds,
    totalDays: safeTotalDays,
    currentDay: clampedCurrentDay,
    totalSpent,
    reservedCommitments,
    savingsLocked,
    availableBalance,
    daysRemaining,
    dailySafeAllowance,
    baselineDailyAllowance,
    spentToday,
    monthElapsedPercent,
    budgetSpentPercent,
    burnRateStatus,
    projectedMonthEndBalance,
    dailyAverageBurnRate,
  };
}

/**
 * Deterministic classifier for financial survival pace.
 */
function determineBurnRateStatus(params: {
  dailySafeAllowance: number;
  baselineDailyAllowance: number;
  monthElapsedPercent: number;
  budgetSpentPercent: number;
  availableBalance: number;
}): BurnRateStatus {
  const {
    dailySafeAllowance,
    baselineDailyAllowance,
    monthElapsedPercent,
    budgetSpentPercent,
    availableBalance,
  } = params;

  if (availableBalance <= 0) {
    return 'critical';
  }

  // Critical: budget spent % drastically exceeds elapsed time, or allowance compressed < 45% of baseline
  if (
    budgetSpentPercent > monthElapsedPercent + 18 ||
    dailySafeAllowance < baselineDailyAllowance * 0.45
  ) {
    return 'critical';
  }

  // Caution: budget spent % somewhat higher than elapsed, or allowance compressed < 75%
  if (
    budgetSpentPercent > monthElapsedPercent + 5 ||
    dailySafeAllowance < baselineDailyAllowance * 0.75
  ) {
    return 'caution';
  }

  return 'on_track';
}

/**
 * Aggregates transactions by category for expense transactions only.
 */
export function calculateCategoryBreakdown(transactions: Transaction[]): CategorySpendingSummary[] {
  const expenseTxs = transactions.filter((tx) => tx.type !== 'income');
  const totalSpent = expenseTxs.reduce((acc, tx) => acc + tx.amount, 0);
  const categoryMap = new Map<TransactionCategory, { total: number; count: number }>();

  for (const tx of expenseTxs) {
    const existing = categoryMap.get(tx.category) || { total: 0, count: 0 };
    categoryMap.set(tx.category, {
      total: existing.total + tx.amount,
      count: existing.count + 1,
    });
  }

  const results: CategorySpendingSummary[] = [];

  categoryMap.forEach((val, category) => {
    results.push({
      category,
      totalSpent: val.total,
      transactionCount: val.count,
      percentageOfTotalSpend: totalSpent > 0 ? (val.total / totalSpent) * 100 : 0,
    });
  });

  return results.sort((a, b) => b.totalSpent - a.totalSpent);
}

// -------------------------------------------------------------
// Decision Simulation Types & Engine
// -------------------------------------------------------------

export type DecisionType =
  | 'discretionary_expense'
  | 'unexpected_emergency'
  | 'savings_allocation'
  | 'savings_withdrawal'
  | 'cancel_subscription'
  | 'pay_bill_early';

export interface DecisionScenario {
  type: DecisionType;
  title: string;
  amount: number;
  category?: TransactionCategory;
  targetId?: string; // commitmentId or goalId
}

export interface SimulationResult {
  scenario: DecisionScenario;
  before: FinancialSummary;
  after: FinancialSummary;
  diff: {
    availableBalance: number;
    dailySafeAllowance: number;
    reservedCommitments: number;
    savingsLocked: number;
    totalFunds: number;
    totalSpent: number;
    projectedMonthEnd: number;
  };
  hasShortfall: boolean;
  shortfallAmount: number;
  riskLevel: 'safe' | 'caution' | 'danger';
  verdictTitle: string;
  verdictDescription: string;
  consequences: string[];
}

/**
 * Pure simulation evaluator. Does NOT mutate the input dataset.
 */
export function simulateDecision(
  input: CalculationInput,
  scenario: DecisionScenario
): SimulationResult {
  const before = calculateFinancialSummary(input);

  // Clone datasets for pure sandbox preview
  const simulatedTransactions = [...input.transactions];
  const simulatedCommitments = input.commitments.map((c) => ({ ...c }));
  const simulatedGoals = input.savingsGoals.map((g) => ({ ...g }));
  const simulatedAdditionalIncome = input.additionalIncome || 0;

  const { type, amount, title, targetId } = scenario;
  const safeAmount = Math.max(0, amount);

  switch (type) {
    case 'discretionary_expense':
    case 'unexpected_emergency': {
      simulatedTransactions.push({
        id: 'sim-temp-expense',
        title: title || 'Simulated Expense',
        amount: safeAmount,
        type: 'expense',
        category: scenario.category || (type === 'unexpected_emergency' ? 'emergency_health' : 'food_dining'),
        day: before.currentDay,
        date: 'Simulated',
        time: 'Now',
        paymentMethod: 'UPI (GPay)',
      });
      break;
    }

    case 'savings_allocation': {
      const targetGoal = simulatedGoals.find((g) => g.id === targetId) || simulatedGoals[0];
      if (targetGoal) {
        targetGoal.currentAmount += safeAmount;
      }
      break;
    }

    case 'savings_withdrawal': {
      const targetGoal = simulatedGoals.find((g) => g.id === targetId) || simulatedGoals[0];
      if (targetGoal) {
        targetGoal.currentAmount = Math.max(0, targetGoal.currentAmount - safeAmount);
      }
      break;
    }

    case 'cancel_subscription': {
      const targetComm = simulatedCommitments.find((c) => c.id === targetId);
      if (targetComm && targetComm.status === 'reserved') {
        targetComm.status = 'cancelled';
        targetComm.isReserved = false;
      }
      break;
    }

    case 'pay_bill_early': {
      const targetComm = simulatedCommitments.find((c) => c.id === targetId);
      if (targetComm && targetComm.status === 'reserved') {
        targetComm.status = 'paid';
        targetComm.isReserved = false;
        // Linked transaction
        simulatedTransactions.push({
          id: 'sim-bill-paid',
          title: `Bill Paid: ${targetComm.title}`,
          amount: targetComm.amount,
          type: 'expense',
          category: targetComm.category,
          day: before.currentDay,
          date: 'Simulated',
          time: 'Now',
          paymentMethod: 'UPI (GPay)',
          relatedCommitmentId: targetComm.id,
        });
      }
      break;
    }
  }

  const after = calculateFinancialSummary({
    ...input,
    additionalIncome: simulatedAdditionalIncome,
    transactions: simulatedTransactions,
    commitments: simulatedCommitments,
    savingsGoals: simulatedGoals,
  });

  const diff = {
    availableBalance: after.availableBalance - before.availableBalance,
    dailySafeAllowance: after.dailySafeAllowance - before.dailySafeAllowance,
    reservedCommitments: after.reservedCommitments - before.reservedCommitments,
    savingsLocked: after.savingsLocked - before.savingsLocked,
    totalFunds: after.totalFunds - before.totalFunds,
    totalSpent: after.totalSpent - before.totalSpent,
    projectedMonthEnd: after.projectedMonthEndBalance - before.projectedMonthEndBalance,
  };

  // Determine shortfall
  const hasShortfall = after.availableBalance <= 0 && safeAmount > before.availableBalance;
  const shortfallAmount = hasShortfall ? safeAmount - before.availableBalance : 0;

  // Determine risk level & deterministic explanations
  let riskLevel: 'safe' | 'caution' | 'danger' = 'safe';
  let verdictTitle = 'Safe to Proceed';
  let verdictDescription = 'This decision fits comfortably within your current budget.';
  const consequences: string[] = [];

  if (hasShortfall) {
    riskLevel = 'danger';
    verdictTitle = 'Critical Budget Shortfall!';
    verdictDescription = `Exceeds your available discretionary funds by ₹${shortfallAmount.toLocaleString('en-IN')}.`;
    consequences.push(
      `Forces your safe daily allowance to ₹0/day for the remaining ${after.daysRemaining} days.`,
      `To execute this in real life, you would have to break ₹${shortfallAmount.toLocaleString('en-IN')} of locked savings or default on an upcoming bill.`
    );
  } else if (after.dailySafeAllowance < before.baselineDailyAllowance * 0.5) {
    riskLevel = 'danger';
    verdictTitle = 'Severe Allowance Squeeze';
    verdictDescription = `Your safe daily allowance drops to ₹${Math.round(after.dailySafeAllowance)}/day.`;
    consequences.push(
      `Compresses daily discretionary spending by ₹${Math.abs(Math.round(diff.dailySafeAllowance))}/day.`,
      `Leaves very little room for daily chai, transport, or unexpected snacks.`
    );
  } else if (diff.dailySafeAllowance < -20 || (type === 'savings_allocation' && safeAmount > before.dailySafeAllowance * 2)) {
    riskLevel = 'caution';
    verdictTitle = 'Noticeable Belt-Tightening';
    verdictDescription = `Survivable, but noticeably lowers your future daily spending room.`;
    consequences.push(
      `Daily quota decreases from ₹${Math.round(before.dailySafeAllowance)} to ₹${Math.round(after.dailySafeAllowance)}/day.`,
      `You will need to compensate with frugal days later in the month.`
    );
  } else if (type === 'cancel_subscription') {
    riskLevel = 'safe';
    verdictTitle = 'Positive: Released Locked Funds!';
    verdictDescription = `Cancelling this bill releases ₹${safeAmount} back into your discretionary spending pool.`;
    consequences.push(
      `Increases your safe daily allowance by +₹${Math.round(diff.dailySafeAllowance)}/day!`,
      `Improves your buffer against month-end financial stress.`
    );
  } else if (type === 'pay_bill_early') {
    riskLevel = 'safe';
    verdictTitle = 'Zero Discretionary Impact!';
    verdictDescription = `This bill was already walled off in reserved funds. Paying it does not reduce your daily safe allowance.`;
    consequences.push(
      `Reserved commitments decrease by ₹${safeAmount}, while recorded expenses increase by the same amount.`,
      `Your available balance (₹${after.availableBalance}) and daily quota (₹${Math.round(after.dailySafeAllowance)}/day) remain identical.`
    );
  } else {
    consequences.push(
      `Remaining cushion today adjusts by ₹${Math.round(diff.availableBalance)}.`,
      `Zero debt risk detected.`
    );
  }

  return {
    scenario,
    before,
    after,
    diff,
    hasShortfall,
    shortfallAmount,
    riskLevel,
    verdictTitle,
    verdictDescription,
    consequences,
  };
}
