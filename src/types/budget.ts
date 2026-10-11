export type BurnRateStatus = 'on_track' | 'caution' | 'critical';

export interface FinancialSummary {
  /** The total starting budget for the 30-day month (e.g. 10000) */
  startingBudget: number;
  /** Total days in the budgeting cycle (typically 30) */
  totalDays: number;
  /** Current day within the 30-day cycle (e.g. 12) */
  currentDay: number;
  /** Total posted expenses incurred so far */
  totalSpent: number;
  /** Total money reserved for mandatory upcoming bills */
  reservedCommitments: number;
  /** Total money locked in savings goals */
  savingsLocked: number;
  /** Truly available discretionary balance = startingBudget - totalSpent - reservedCommitments - savingsLocked */
  availableBalance: number;
  /** Number of days remaining in the cycle, including today */
  daysRemaining: number;
  /** Daily safe-to-spend allowance = availableBalance / daysRemaining */
  dailySafeAllowance: number;
  /** Starting baseline allowance per day = startingBudget / totalDays */
  baselineDailyAllowance: number;
  /** Spending recorded for the current day */
  spentToday: number;
  /** Percentage of the total month elapsed */
  monthElapsedPercent: number;
  /** Percentage of the total budget spent */
  budgetSpentPercent: number;
  /** Budget survival status based on spending pace */
  burnRateStatus: BurnRateStatus;
}
