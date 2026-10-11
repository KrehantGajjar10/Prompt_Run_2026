export type BurnRateStatus = 'on_track' | 'caution' | 'critical';

export interface FinancialSummary {
  /** The starting budget allocation (default ₹10,000) */
  startingBudget: number;
  /** Additional income deposited this month */
  additionalIncome: number;
  /** Total funds pool = startingBudget + additionalIncome */
  totalFunds: number;
  /** Total days in the budgeting cycle (typically 30) */
  totalDays: number;
  /** Current day within the 30-day cycle (e.g. 12) */
  currentDay: number;
  /** Total expenses and paid commitments incurred so far */
  totalSpent: number;
  /** Total money reserved for upcoming mandatory unpaid bills */
  reservedCommitments: number;
  /** Total funds currently locked in savings goals */
  savingsLocked: number;
  /** Truly safe available balance = totalFunds - totalSpent - reservedCommitments - savingsLocked */
  availableBalance: number;
  /** Number of days remaining in the cycle, including today */
  daysRemaining: number;
  /** Daily safe-to-spend allowance = max(0, availableBalance) / daysRemaining */
  dailySafeAllowance: number;
  /** Starting baseline allowance per day = totalFunds / totalDays */
  baselineDailyAllowance: number;
  /** Discretionary + bill spending recorded on the current day */
  spentToday: number;
  /** Percentage of the total month elapsed */
  monthElapsedPercent: number;
  /** Percentage of total funds spent */
  budgetSpentPercent: number;
  /** Budget survival status based on spending pace */
  burnRateStatus: BurnRateStatus;
  /** Projected month-end balance if current daily pace continues */
  projectedMonthEndBalance: number;
  /** Average actual burn rate per day so far */
  dailyAverageBurnRate: number;
}
