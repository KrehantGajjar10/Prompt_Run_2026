import React from 'react';
import { Calendar, AlertCircle, ArrowUpRight, PiggyBank, PlusCircle, Compass } from 'lucide-react';
import type { FinancialSummary } from '../../types/budget';
import { formatINR } from '../../lib/currency';
import { Button } from '../../components/ui/Button';

export interface WelcomeBannerProps {
  summary: FinancialSummary;
  onOpenAddExpense: () => void;
  onOpenSimulator: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  summary,
  onOpenAddExpense,
  onOpenSimulator,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-6 mb-6 shadow-sm">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Main context text */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-zinc-800 text-accent-lime border border-zinc-700">
              <Calendar className="w-3.5 h-3.5" />
              Day {summary.currentDay} of {summary.totalDays}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {summary.daysRemaining} days remaining in cycle
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 font-sans">
            Survive the Month Challenge
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Starting pool of <strong className="text-zinc-200 font-mono">{formatINR(summary.startingBudget)}</strong>
            {summary.additionalIncome > 0 && (
              <span> (+{formatINR(summary.additionalIncome)} income)</span>
            )}. 
            After <strong className="text-zinc-200 font-mono">{formatINR(summary.totalSpent)}</strong> spent, 
            <strong className="text-zinc-200 font-mono"> {formatINR(summary.reservedCommitments)}</strong> reserved for upcoming bills, 
            and <strong className="text-zinc-200 font-mono"> {formatINR(summary.savingsLocked)}</strong> in savings, 
            you have <strong className="text-accent-lime font-mono">{formatINR(summary.availableBalance)}</strong> safe discretionary balance left.
          </p>

          {/* Quick Action buttons */}
          <div className="mt-4 flex items-center gap-2.5 flex-wrap">
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAddExpense}
              icon={<PlusCircle className="w-3.5 h-3.5" />}
            >
              Record Transaction
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenSimulator}
              icon={<Compass className="w-3.5 h-3.5" />}
            >
              Test in Simulator
            </Button>
          </div>
        </div>

        {/* Quick Context Metric Pills */}
        <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center gap-3 w-full sm:w-auto min-w-0 sm:min-w-42.5">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-accent-lime shrink-0">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-mono uppercase text-zinc-400">Daily Safe Limit</div>
              <div className="text-base sm:text-lg font-bold text-accent-lime font-mono tabular-nums">
                {formatINR(summary.dailySafeAllowance)} <span className="text-[11px] font-normal text-zinc-500">/ day</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center gap-3 w-full sm:w-auto min-w-0 sm:min-w-42.5">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 shrink-0">
              <PiggyBank className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-mono uppercase text-zinc-400">Total Saved</div>
              <div className="text-base sm:text-lg font-bold text-zinc-100 font-mono tabular-nums">
                {formatINR(summary.savingsLocked)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Burn rate notification banner */}
      {summary.burnRateStatus !== 'on_track' && (
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-amber-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            {summary.burnRateStatus === 'caution'
              ? `Pacing Notice: Daily safe allowance (${formatINR(summary.dailySafeAllowance)}/day) is below starting baseline (${formatINR(summary.baselineDailyAllowance)}/day). Keep daily discretionary spend tight.`
              : 'Warning: Budget burn pace is critical. Limit non-essential spending immediately to protect mandatory bills.'}
          </span>
        </div>
      )}
    </div>
  );
};
