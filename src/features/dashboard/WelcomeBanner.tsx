import React from 'react';
import { Calendar, AlertCircle, ArrowUpRight, PiggyBank } from 'lucide-react';
import type { FinancialSummary } from '../../types/budget';
import { formatINR } from '../../lib/currency';

export interface WelcomeBannerProps {
  summary: FinancialSummary;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ summary }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#222c3d] bg-linear-to-r from-[#111622] via-[#141b27] to-[#121824] p-5 sm:p-6 mb-6 shadow-md">
      {/* Subtle background glow effect */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent-lime/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Main context text */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-accent-lime/10 text-accent-lime border border-accent-lime/20">
              <Calendar className="w-3.5 h-3.5" />
              Day {summary.currentDay} of {summary.totalDays}
            </span>
            <span className="text-xs text-[#94a3b8] font-medium">
              {summary.daysRemaining} days remaining in cycle
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f8fafc]">
            Survive the Month Challenge
          </h2>
          <p className="mt-1 text-sm text-[#94a3b8] leading-relaxed">
            You started with <strong className="text-[#f1f5f9]">{formatINR(summary.startingBudget)}</strong> for the 30-day period. 
            After <strong className="text-[#f1f5f9]">{formatINR(summary.totalSpent)}</strong> spent, 
            <strong className="text-[#f1f5f9]"> {formatINR(summary.reservedCommitments)}</strong> reserved for upcoming bills, 
            and <strong className="text-[#f1f5f9]"> {formatINR(summary.savingsLocked)}</strong> set aside in savings, 
            you have <strong className="text-accent-lime">{formatINR(summary.availableBalance)}</strong> safe discretionary balance left.
          </p>
        </div>

        {/* Quick Context Metric Pill */}
        <div className="shrink-0 flex sm:flex-row lg:flex-col gap-3 justify-start sm:justify-end">
          <div className="bg-[#18202d] border border-[#28354b] rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-lime/10 flex items-center justify-center text-accent-lime shrink-0">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#94a3b8]">Daily Safe Allowance</div>
              <div className="text-lg font-bold text-accent-lime tabular-nums">
                {formatINR(summary.dailySafeAllowance)} <span className="text-xs font-normal text-[#94a3b8]">/ day</span>
              </div>
            </div>
          </div>

          <div className="bg-[#18202d] border border-[#28354b] rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#38bdf8]/10 flex items-center justify-center text-[#38bdf8] shrink-0">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#94a3b8]">Locked in Savings</div>
              <div className="text-lg font-bold text-[#f1f5f9] tabular-nums">
                {formatINR(summary.savingsLocked)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Burn rate notification banner */}
      {summary.burnRateStatus !== 'on_track' && (
        <div className="mt-4 pt-3.5 border-t border-[#1c2433] flex items-center gap-2 text-xs text-[#fbbf24]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            {summary.burnRateStatus === 'caution'
              ? 'Pacing Notice: Early-month bulk purchases (groceries & transit) lowered daily safe allowance below the initial ₹333/day baseline. Keep discretionary spend around ₹171/day to finish without debt.'
              : 'Warning: Spending is accelerating faster than normal. Avoid non-essential outings to protect upcoming bill payments.'}
          </span>
        </div>
      )}
    </div>
  );
};
