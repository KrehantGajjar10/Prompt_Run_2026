import React from 'react';
import { CalendarClock, CheckCircle, Flag, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import type { FinancialSummary } from '../../types/budget';
import type { UpcomingCommitment } from '../../types/commitment';

export interface MonthProgressBarProps {
  summary: FinancialSummary;
  commitments?: UpcomingCommitment[];
}

export const MonthProgressBar: React.FC<MonthProgressBarProps> = ({ summary, commitments = [] }) => {
  // Extract upcoming active commitments to plot dynamically on the timeline
  const activeBills = commitments.filter((c) => c.status === 'reserved' && c.dueDay > 0);

  return (
    <Card variant="default" className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-zinc-800 text-accent-lime border border-zinc-700/60">
            <CalendarClock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              30-Day Survival Timeline
            </h3>
            <span className="text-xs text-zinc-400">
              Pacing analysis: Days Elapsed vs Budget Consumed
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono flex-wrap">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-accent-lime shrink-0" />
            <span>Time Elapsed: </span>
            <strong className="text-zinc-100 tabular-nums">
              {summary.monthElapsedPercent}%
            </strong>
          </div>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span>Budget Spent: </span>
            <strong
              className={`tabular-nums ${
                summary.budgetSpentPercent > summary.monthElapsedPercent
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {summary.budgetSpentPercent}%
            </strong>
          </div>
        </div>
      </div>

      {/* Main 30-Day Segmented Progress Bar */}
      <div className="relative pt-2 pb-2 sm:pb-5">
        <ProgressBar
          value={summary.monthElapsedPercent}
          colorVariant="lime"
          size="md"
        />

        {/* Mobile simple markers row (< sm) */}
        <div className="flex sm:hidden items-center justify-between mt-1.5 text-[10px] font-mono text-zinc-500">
          <span>Day 1</span>
          <span className="text-accent-lime font-bold">
            Day {summary.currentDay} (Today)
          </span>
          <span>Day 30</span>
        </div>

        {/* Dynamic milestone markers (sm and up) */}
        <div className="relative w-full mt-2 hidden sm:block h-6">
          {/* Day 1 marker */}
          <div className="absolute left-0 -translate-x-1/2 flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-zinc-600 mb-0.5" />
            <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap">Day 1</span>
          </div>

          {/* Current Day Marker */}
          <div
            className="absolute -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${Math.min(96, Math.max(4, ((summary.currentDay - 1) / 29) * 100))}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-accent-lime ring-4 ring-accent-lime/20 mb-0.5" />
            <span className="text-[10px] font-mono text-accent-lime font-bold whitespace-nowrap">
              Day {summary.currentDay} (Today)
            </span>
          </div>

          {/* Up to 3 upcoming bill markers */}
          {activeBills.slice(0, 3).map((bill) => {
            const leftPercent = ((bill.dueDay - 1) / 29) * 100;
            if (bill.dueDay <= summary.currentDay) return null;

            return (
              <div
                key={bill.id}
                className="absolute -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${Math.min(95, Math.max(5, leftPercent))}%` }}
              >
                <div className="w-2 h-2 rounded-full bg-zinc-400 mb-0.5" />
                <span className="text-[10px] font-mono text-zinc-400 whitespace-nowrap">
                  D{bill.dueDay}: ₹{bill.amount}
                </span>
              </div>
            );
          })}

          {/* Day 30 finish line */}
          <div className="absolute right-0 translate-x-1/2 flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-zinc-600 mb-0.5" />
            <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap">Day 30</span>
          </div>
        </div>
      </div>

      {/* Narrative Footer */}
      <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-400 gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            {summary.daysRemaining} days left in cycle. {activeBills.length} upcoming bill{activeBills.length === 1 ? '' : 's'} protected from discretionary spend.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-300 font-medium shrink-0">
          <Flag className="w-3.5 h-3.5 text-accent-lime" />
          <span>Survival Goal: Finish Day 30 with ₹0 debt and savings intact</span>
        </div>
      </div>
    </Card>
  );
};
