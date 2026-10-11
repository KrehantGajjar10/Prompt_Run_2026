import React from 'react';
import type { FinancialSummary } from '../../types/budget';
import type { Transaction } from '../../types/transaction';
import type { UpcomingCommitment } from '../../types/commitment';
import type { SavingsGoal } from '../../types/savings';
import type { CategorySpendingSummary } from '../../lib/calculations';
import { WelcomeBanner } from './WelcomeBanner';
import { BudgetSummaryCards } from './BudgetSummaryCards';
import { MonthProgressBar } from './MonthProgressBar';
import { BudgetPacingForecast } from './BudgetPacingForecast';
import { DailyAllowanceCard } from './DailyAllowanceCard';
import { CategoryBreakdown } from './CategoryBreakdown';
import { RecentTransactions } from './RecentTransactions';
import { UpcomingCommitments } from './UpcomingCommitments';
import { SavingsGoals } from './SavingsGoals';
import { DashboardLoadingSkeleton } from './DashboardLoadingSkeleton';

export interface DashboardViewProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  commitments: UpcomingCommitment[];
  savingsGoals: SavingsGoal[];
  categoryBreakdown: CategorySpendingSummary[];
  isLoading?: boolean;
  onOpenAddExpense: () => void;
  onOpenAddCommitment: () => void;
  onOpenAddGoal: () => void;
  onOpenAdjustGoal: (goal: SavingsGoal) => void;
  onOpenSimulator: () => void;
  onNavigateToTransactions: () => void;
  onNavigateToCommitments: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onPayCommitment: (id: string) => void;
  onCancelCommitment: (id: string) => void;
  onDeleteCommitment: (id: string) => void;
  onEditCommitment: (item: UpcomingCommitment) => void;
  onDeleteGoal: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  transactions,
  commitments,
  savingsGoals,
  categoryBreakdown,
  isLoading = false,
  onOpenAddExpense,
  onOpenAddCommitment,
  onOpenAddGoal,
  onOpenAdjustGoal,
  onOpenSimulator,
  onNavigateToTransactions,
  onNavigateToCommitments,
  onEditTransaction,
  onDeleteTransaction,
  onPayCommitment,
  onCancelCommitment,
  onDeleteCommitment,
  onEditCommitment,
  onDeleteGoal,
}) => {
  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Contextual Welcome Banner */}
      <WelcomeBanner
        summary={summary}
        onOpenAddExpense={onOpenAddExpense}
        onOpenSimulator={onOpenSimulator}
      />

      {/* 2. Primary 4 KPI Financial Cards */}
      <BudgetSummaryCards
        summary={summary}
        onNavigateToTransactions={onNavigateToTransactions}
        onNavigateToCommitments={onNavigateToCommitments}
      />

      {/* 3. 30-Day Survival Timeline */}
      <MonthProgressBar
        summary={summary}
        commitments={commitments}
      />

      {/* 4. Budget Pace & Month-End Forecast Visualizer */}
      <BudgetPacingForecast
        summary={summary}
      />

      {/* 5. Safe Daily Allowance + Instant Decision Affordability Checker */}
      <DailyAllowanceCard
        summary={summary}
        onOpenFullSimulator={onOpenSimulator}
      />

      {/* 5. Two-column Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Spending Breakdown & Transactions */}
        <div className="lg:col-span-7 space-y-6">
          <RecentTransactions
            transactions={transactions}
            currentDay={summary.currentDay}
            onOpenAddModal={onOpenAddExpense}
            onEditTransaction={onEditTransaction}
            onDeleteTransaction={onDeleteTransaction}
          />
          <CategoryBreakdown
            categories={categoryBreakdown}
            totalSpent={summary.totalSpent}
          />
        </div>

        {/* Right Column: Protected Bills & Savings Goals */}
        <div className="lg:col-span-5 space-y-6">
          <UpcomingCommitments
            commitments={commitments}
            currentDay={summary.currentDay}
            onOpenAddModal={onOpenAddCommitment}
            onPayCommitment={onPayCommitment}
            onCancelCommitment={onCancelCommitment}
            onDeleteCommitment={onDeleteCommitment}
            onEditCommitment={onEditCommitment}
          />
          <SavingsGoals
            goals={savingsGoals}
            onOpenAddModal={onOpenAddGoal}
            onOpenAdjustModal={onOpenAdjustGoal}
            onDeleteGoal={onDeleteGoal}
          />
        </div>
      </div>
    </div>
  );
};
