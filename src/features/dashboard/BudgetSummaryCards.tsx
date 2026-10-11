import React from 'react';
import { Wallet, ShieldCheck, CreditCard, Lock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import type { FinancialSummary } from '../../types/budget';
import { formatINR } from '../../lib/currency';

export interface BudgetSummaryCardsProps {
  summary: FinancialSummary;
}

export const BudgetSummaryCards: React.FC<BudgetSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Starting Budget */}
      <Card variant="default" className="flex flex-col justify-between" hoverEffect>
        <div>
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-2 font-medium">
            <span className="uppercase tracking-wider">Starting Budget</span>
            <div className="p-1.5 rounded-lg bg-[#1f2838] text-[#94a3b8]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f8fafc] tabular-nums">
            {formatINR(summary.startingBudget)}
          </div>
          <div className="text-xs text-[#64748b] mt-1">
            Fixed 30-day survival allocation
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1a2332] flex items-center justify-between text-xs text-[#94a3b8]">
          <span>Baseline per day:</span>
          <span className="font-semibold text-[#cbd5e1] tabular-nums">
            {formatINR(summary.baselineDailyAllowance)} / day
          </span>
        </div>
      </Card>

      {/* 2. Available to Spend (Hero Highlight) */}
      <Card
        variant="accent"
        glow
        className="flex flex-col justify-between relative overflow-hidden bg-linear-to-b from-[#141b24] to-[#111720]"
        hoverEffect
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-lime/10 rounded-full blur-xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between text-xs mb-2 font-medium">
            <span className="uppercase tracking-wider text-accent-lime font-semibold">
              Available to Spend
            </span>
            <div className="p-1.5 rounded-lg bg-accent-lime/15 text-accent-lime">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-accent-lime tabular-nums">
            {formatINR(summary.availableBalance)}
          </div>
          <div className="text-xs text-[#94a3b8] mt-1">
            Safe discretionary cash remaining
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-accent-lime/20 flex items-center justify-between text-xs">
          <span className="text-[#94a3b8]">True daily quota:</span>
          <span className="font-bold text-accent-lime tabular-nums">
            {formatINR(summary.dailySafeAllowance)} / day
          </span>
        </div>
      </Card>

      {/* 3. Total Spending */}
      <Card variant="default" className="flex flex-col justify-between" hoverEffect>
        <div>
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-2 font-medium">
            <span className="uppercase tracking-wider">Total Spending</span>
            <div className="p-1.5 rounded-lg bg-[#1f2838] text-[#f87171]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f1f5f9] tabular-nums">
            {formatINR(summary.totalSpent)}
          </div>
          <div className="text-xs text-[#64748b] mt-1">
            {summary.budgetSpentPercent}% of total ₹10k budget
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1a2332] flex items-center justify-between text-xs text-[#94a3b8]">
          <span>Spent today (Day {summary.currentDay}):</span>
          <span className="font-semibold text-[#f87171] tabular-nums">
            {formatINR(summary.spentToday)}
          </span>
        </div>
      </Card>

      {/* 4. Reserved Commitments */}
      <Card variant="default" className="flex flex-col justify-between" hoverEffect>
        <div>
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-2 font-medium">
            <span className="uppercase tracking-wider">Reserved Bills</span>
            <div className="p-1.5 rounded-lg bg-[#1f2838] text-[#38bdf8]">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f1f5f9] tabular-nums">
            {formatINR(summary.reservedCommitments)}
          </div>
          <div className="text-xs text-[#64748b] mt-1">
            Protected for 4 upcoming bills
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1a2332] flex items-center justify-between text-xs text-[#94a3b8]">
          <span>Next due in:</span>
          <span className="font-semibold text-[#38bdf8]">
            6 days (Oct 18)
          </span>
        </div>
      </Card>
    </div>
  );
};
