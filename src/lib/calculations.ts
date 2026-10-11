import type { FinancialSummary, BurnRateStatus } from '../types/budget';
import type { Transaction, TransactionCategory } from '../types/transaction';
import type { UpcomingCommitment } from '../types/commitment';
import type { SavingsGoal } from '../types/savings';

export interface CalculationInput {
  startingBudget: number;
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
 * Follows strict non-duplicative accounting rules:
 * Starting Budget = Total Spent + Reserved Commitments + Locked Savings + Available Balance.
 */
export function calculateFinancialSummary(input: CalculationInput): FinancialSummary {
  const {
    startingBudget,
    totalDays,
    currentDay,
    transactions,
    commitments,
    savingsGoals,
  } = input;

  // 1. Total posted expenses
  const totalSpent = transactions.reduce((acc, tx) => acc + tx.amount, 0);

  // 2. Reserved upcoming commitments (bills not yet paid, but walled off)
  const reservedCommitments = commitments
    .filter((c) => c.status === 'reserved' && c.isReserved)
    .reduce((acc, c) => acc + c.amount, 0);

  // 3. Locked savings set aside from discretionary spending
  const savingsLocked = savingsGoals
    .filter((g) => g.isLocked)
    .reduce((acc, g) => acc + g.currentAmount, 0);

  // 4. Truly available balance
  const rawAvailable = startingBudget - totalSpent - reservedCommitments - savingsLocked;
  const availableBalance = Math.max(0, rawAvailable);

  // 5. Timeline tracking: days remaining including current day
  const clampedCurrentDay = Math.min(Math.max(1, currentDay), totalDays);
  const daysRemaining = Math.max(1, totalDays - clampedCurrentDay + 1);

  // 6. Allowances
  const baselineDailyAllowance = startingBudget / totalDays;
  const dailySafeAllowance = daysRemaining > 0 ? availableBalance / daysRemaining : 0;

  // 7. Spending today (transactions with day === currentDay)
  const spentToday = transactions
    .filter((tx) => tx.day === clampedCurrentDay)
    .reduce((acc, tx) => acc + tx.amount, 0);

  // 8. Progress percentages
  const monthElapsedPercent = Math.min(100, Math.round((clampedCurrentDay / totalDays) * 100));
  const budgetSpentPercent = Math.min(
    100,
    Math.round((totalSpent / (startingBudget || 1)) * 100)
  );

  // 9. Burn rate assessment
  const burnRateStatus = determineBurnRateStatus({
    dailySafeAllowance,
    baselineDailyAllowance,
    monthElapsedPercent,
    budgetSpentPercent,
  });

  return {
    startingBudget,
    totalDays,
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
  };
}

/**
 * Pure helper to classify survival burn rate health.
 */
function determineBurnRateStatus(params: {
  dailySafeAllowance: number;
  baselineDailyAllowance: number;
  monthElapsedPercent: number;
  budgetSpentPercent: number;
}): BurnRateStatus {
  const { dailySafeAllowance, baselineDailyAllowance, monthElapsedPercent, budgetSpentPercent } = params;

  // If budget spent percentage significantly exceeds time elapsed
  if (budgetSpentPercent > monthElapsedPercent + 20 || dailySafeAllowance < baselineDailyAllowance * 0.45) {
    return 'critical';
  }

  // If daily safe allowance is moderately compressed compared to starting baseline
  if (budgetSpentPercent > monthElapsedPercent + 5 || dailySafeAllowance < baselineDailyAllowance * 0.75) {
    return 'caution';
  }

  return 'on_track';
}

/**
 * Aggregates transactions by category.
 */
export function calculateCategoryBreakdown(transactions: Transaction[]): CategorySpendingSummary[] {
  const totalSpent = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const categoryMap = new Map<TransactionCategory, { total: number; count: number }>();

  for (const tx of transactions) {
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

  // Sort descending by highest spend
  return results.sort((a, b) => b.totalSpent - a.totalSpent);
}
