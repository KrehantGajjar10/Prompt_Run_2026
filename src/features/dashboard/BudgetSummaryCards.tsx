import React from 'react';
import { Wallet, ShieldCheck, CreditCard, Lock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import type { FinancialSummary } from '../../types/budget';
import { formatINR } from '../../lib/currency';

export interface BudgetSummaryCardsProps {
  summary: FinancialSummary;
  onNavigateToCommitments?: () => void;
  onNavigateToTransactions?: () => void;
}

export const BudgetSummaryCards: React.FC<BudgetSummaryCardsProps> = ({
  summary,
  onNavigateToCommitments,
  onNavigateToTransactions,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Starting Budget / Total Funds */}
      <Card variant="default" className="flex flex-col justify-between" hoverEffect>
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
            <span className="uppercase tracking-wider">Total Funds</span>
            <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 font-mono tabular-nums">
            {formatINR(summary.totalFunds)}
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            {summary.additionalIncome > 0
              ? `₹10,000 base + ₹${summary.additionalIncome} income`
              : 'Fixed 30-day survival pool'}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Starting baseline:</span>
          <span className="font-semibold text-zinc-200 font-mono tabular-nums">
            {formatINR(summary.baselineDailyAllowance)} / day
          </span>
        </div>
      </Card>

      {/* 2. Available to Spend (Hero Lime Card) */}
      <Card
        variant="accent"
        glow
        className="flex flex-col justify-between relative overflow-hidden bg-zinc-900 border-accent-lime/40"
        hoverEffect
      >
        <div>
          <div className="flex items-center justify-between text-xs mb-2 font-mono">
            <span className="uppercase tracking-wider text-accent-lime font-semibold">
              Available to Spend
            </span>
            <div className="p-1.5 rounded-lg bg-zinc-800 text-accent-lime border border-accent-lime/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-accent-lime font-mono tabular-nums">
            {formatINR(summary.availableBalance)}
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            Truly safe discretionary cash left
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-400">True daily quota:</span>
          <span className="font-bold text-accent-lime font-mono tabular-nums">
            {formatINR(summary.dailySafeAllowance)} / day
          </span>
        </div>
      </Card>

      {/* 3. Total Spending */}
      <Card
        variant="default"
        className="flex flex-col justify-between cursor-pointer"
        hoverEffect
        onClick={onNavigateToTransactions}
      >
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
            <span className="uppercase tracking-wider">Total Spent</span>
            <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 font-mono tabular-nums">
            {formatINR(summary.totalSpent)}
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            {summary.budgetSpentPercent}% of available pool consumed
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Spent today (Day {summary.currentDay}):</span>
          <span className="font-semibold text-zinc-200 font-mono tabular-nums">
            {formatINR(summary.spentToday)}
          </span>
        </div>
      </Card>

      {/* 4. Reserved Commitments */}
      <Card
        variant="default"
        className="flex flex-col justify-between cursor-pointer"
        hoverEffect
        onClick={onNavigateToCommitments}
      >
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
            <span className="uppercase tracking-wider">Reserved Bills</span>
            <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 font-mono tabular-nums">
            {formatINR(summary.reservedCommitments)}
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            Protected for upcoming mandatory bills
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Protected from overdraft</span>
          <span className="text-accent-lime font-medium text-[11px] font-mono flex items-center gap-1">
            View bills &rarr;
          </span>
        </div>
      </Card>
    </div>
  );
};
