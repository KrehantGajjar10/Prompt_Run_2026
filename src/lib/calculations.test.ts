import { describe, it, expect } from 'vitest';
import {
  calculateFinancialSummary,
  calculateCategoryBreakdown,
  simulateDecision,
} from './calculations';
import {
  INITIAL_BUDGET_CONFIG,
  MOCK_TRANSACTIONS,
  MOCK_UPCOMING_COMMITMENTS,
  MOCK_SAVINGS_GOALS,
} from '../data/mockData';
import type { UpcomingCommitment } from '../types/commitment';

describe('Financial Accounting Calculations', () => {
  it('correctly calculates baseline demo financial state', () => {
    const summary = calculateFinancialSummary({
      startingBudget: INITIAL_BUDGET_CONFIG.startingBudget,
      totalDays: INITIAL_BUDGET_CONFIG.totalDays,
      currentDay: INITIAL_BUDGET_CONFIG.currentDay,
      transactions: MOCK_TRANSACTIONS,
      commitments: MOCK_UPCOMING_COMMITMENTS,
      savingsGoals: MOCK_SAVINGS_GOALS,
    });

    expect(summary.startingBudget).toBe(10000);
    expect(summary.totalFunds).toBe(10000);
    expect(summary.totalSpent).toBe(4250);
    expect(summary.reservedCommitments).toBe(1500);
    expect(summary.savingsLocked).toBe(1000);
    // Strict non-duplicative equation: 10,000 - 4,250 - 1,500 - 1,000 = 3,250
    expect(summary.availableBalance).toBe(3250);
    // Day 12 of 30 => 19 days remaining (Days 12 to 30)
    expect(summary.daysRemaining).toBe(19);
    // 3250 / 19 ≈ 171.05
    expect(Math.round(summary.dailySafeAllowance)).toBe(171);
  });

  it('handles income transactions by increasing total funds and available balance', () => {
    const transactionsWithIncome = [
      ...MOCK_TRANSACTIONS,
      {
        id: 'inc-01',
        title: 'Freelance Design Stipend',
        amount: 2000,
        type: 'income' as const,
        category: 'income_deposit' as const,
        day: 12,
        date: 'Oct 12',
        time: '02:00 PM',
        paymentMethod: 'Bank Transfer' as const,
      },
    ];

    const summary = calculateFinancialSummary({
      startingBudget: 10000,
      totalDays: 30,
      currentDay: 12,
      transactions: transactionsWithIncome,
      commitments: MOCK_UPCOMING_COMMITMENTS,
      savingsGoals: MOCK_SAVINGS_GOALS,
    });

    expect(summary.additionalIncome).toBe(2000);
    expect(summary.totalFunds).toBe(12000);
    expect(summary.availableBalance).toBe(3250 + 2000);
    expect(summary.dailySafeAllowance).toBe((3250 + 2000) / 19);
  });

  it('transfers paid commitments from reserved to spent without double-counting', () => {
    // Simulate paying the Airtel bill (₹399)
    const updatedCommitments: UpcomingCommitment[] = MOCK_UPCOMING_COMMITMENTS.map((c) =>
      c.id === 'com-01'
        ? { ...c, status: 'paid' as const, isReserved: false }
        : c
    );

    // Add corresponding expense transaction linked to commitment
    const updatedTransactions = [
      ...MOCK_TRANSACTIONS,
      {
        id: 'tx-airtel-paid',
        title: 'Airtel 5G Recharge (Bill Paid)',
        amount: 399,
        type: 'expense' as const,
        category: 'utilities_bills' as const,
        day: 12,
        date: 'Oct 12',
        time: '12:00 PM',
        paymentMethod: 'UPI (GPay)' as const,
        relatedCommitmentId: 'com-01',
      },
    ];

    const summary = calculateFinancialSummary({
      startingBudget: 10000,
      totalDays: 30,
      currentDay: 12,
      transactions: updatedTransactions,
      commitments: updatedCommitments,
      savingsGoals: MOCK_SAVINGS_GOALS,
    });

    // Reserved dropped from 1500 to 1101
    expect(summary.reservedCommitments).toBe(1500 - 399);
    // Total spent increased from 4250 to 4649
    expect(summary.totalSpent).toBe(4250 + 399);
    // Crucial check: Available balance stays EXACTLY 3,250! No double-deduction!
    expect(summary.availableBalance).toBe(3250);
  });

  it('releases funds when an unpaid commitment is cancelled', () => {
    const updatedCommitments: UpcomingCommitment[] = MOCK_UPCOMING_COMMITMENTS.map((c) =>
      c.id === 'com-04' // Cult.fit ₹151
        ? { ...c, status: 'cancelled' as const, isReserved: false }
        : c
    );

    const summary = calculateFinancialSummary({
      startingBudget: 10000,
      totalDays: 30,
      currentDay: 12,
      transactions: MOCK_TRANSACTIONS,
      commitments: updatedCommitments,
      savingsGoals: MOCK_SAVINGS_GOALS,
    });

    // Reserved dropped by 151
    expect(summary.reservedCommitments).toBe(1500 - 151);
    // Discretionary available balance INCREASES by 151
    expect(summary.availableBalance).toBe(3250 + 151);
    expect(summary.dailySafeAllowance).toBe((3250 + 151) / 19);
  });

  it('accurately previews decisions in simulator without mutating inputs', () => {
    const input = {
      startingBudget: 10000,
      totalDays: 30,
      currentDay: 12,
      transactions: MOCK_TRANSACTIONS,
      commitments: MOCK_UPCOMING_COMMITMENTS,
      savingsGoals: MOCK_SAVINGS_GOALS,
    };

    const initialTxCount = input.transactions.length;

    const result = simulateDecision(input, {
      type: 'discretionary_expense',
      title: 'Concert Merch Hoodie',
      amount: 500,
      category: 'personal_essentials',
    });

    // Check immutability
    expect(input.transactions.length).toBe(initialTxCount);
    expect(result.before.availableBalance).toBe(3250);
    expect(result.after.availableBalance).toBe(3250 - 500);
    expect(result.diff.availableBalance).toBe(-500);
    expect(result.hasShortfall).toBe(false);
    expect(result.riskLevel).toBe('danger');
  });

  it('detects shortfall when simulated expense exceeds available balance', () => {
    const input = {
      startingBudget: 10000,
      totalDays: 30,
      currentDay: 12,
      transactions: MOCK_TRANSACTIONS,
      commitments: MOCK_UPCOMING_COMMITMENTS,
      savingsGoals: MOCK_SAVINGS_GOALS,
    };

    const result = simulateDecision(input, {
      type: 'unexpected_emergency',
      title: 'Laptop Screen Repair',
      amount: 4500, // Available is only 3250
    });

    expect(result.hasShortfall).toBe(true);
    expect(result.shortfallAmount).toBe(4500 - 3250);
    expect(result.riskLevel).toBe('danger');
    expect(result.after.availableBalance).toBe(0);
  });

  it('correctly calculates category spending breakdown and sorts descending', () => {
    const breakdown = calculateCategoryBreakdown(MOCK_TRANSACTIONS);
    expect(breakdown.length).toBeGreaterThan(0);
    expect(breakdown[0].category).toBe('food_dining');
    expect(breakdown[0].totalSpent).toBeGreaterThan(0);
  });

  it('safely handles empty lists, zero balances, and boundary day inputs', () => {
    const summary = calculateFinancialSummary({
      startingBudget: 0,
      totalDays: 0,
      currentDay: 0,
      transactions: [],
      commitments: [],
      savingsGoals: [],
    });

    expect(summary.startingBudget).toBe(0);
    expect(summary.totalFunds).toBe(0);
    expect(summary.totalSpent).toBe(0);
    expect(summary.availableBalance).toBe(0);
    expect(summary.dailySafeAllowance).toBe(0);
    expect(summary.daysRemaining).toBeGreaterThanOrEqual(1);
    expect(summary.totalDays).toBeGreaterThanOrEqual(1);

    const emptyBreakdown = calculateCategoryBreakdown([]);
    expect(emptyBreakdown).toEqual([]);
  });

  it('handles negative remaining balance gracefully without negative allowance', () => {
    const heavySpending = [
      {
        id: 'tx-heavy',
        title: 'Unexpected Heavy Cost',
        amount: 15000,
        type: 'expense' as const,
        category: 'personal_essentials' as const,
        day: 1,
        date: 'Oct 01',
        time: '10:00 AM',
        paymentMethod: 'Debit Card' as const,
      },
    ];

    const summary = calculateFinancialSummary({
      startingBudget: 10000,
      totalDays: 30,
      currentDay: 1,
      transactions: heavySpending,
      commitments: [],
      savingsGoals: [],
    });

    expect(summary.availableBalance).toBe(0);
    expect(summary.dailySafeAllowance).toBe(0);
    expect(summary.totalSpent).toBe(15000);
    expect(summary.burnRateStatus).toBe('critical');
  });
});
