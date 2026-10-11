import React from 'react';
import { CalendarClock, CheckCircle, Flag, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import type { FinancialSummary } from '../../types/budget';

export interface MonthProgressBarProps {
  summary: FinancialSummary;
}

export const MonthProgressBar: React.FC<MonthProgressBarProps> = ({ summary }) => {
  const milestoneDays = [
    { day: 1, label: 'Day 1: Start', type: 'start' },
    { day: 12, label: 'Day 12: Today', type: 'current' },
    { day: 18, label: 'Day 18: Airtel', type: 'bill' },
    { day: 22, label: 'Day 22: Wi-Fi', type: 'bill' },
    { day: 25, label: 'Day 25: Power', type: 'bill' },
    { day: 28, label: 'Day 28: Gym', type: 'bill' },
    { day: 30, label: 'Day 30: Goal', type: 'end' },
  ];

  return (
    <Card variant="default" className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#1f2838] text-accent-lime">
            <CalendarClock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f1f5f9]">
              30-Day Survival Timeline
            </h3>
            <span className="text-xs text-[#94a3b8]">
              Pacing analysis: Days Elapsed vs Budget Spent
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#cbd5e1]">
            <Clock className="w-3.5 h-3.5 text-accent-lime" />
            <span>Time Elapsed: </span>
            <strong className="text-[#f8fafc] font-semibold tabular-nums">
              {summary.monthElapsedPercent}%
            </strong>
          </div>
          <span className="text-[#334155]">•</span>
          <div className="flex items-center gap-1.5 text-[#cbd5e1]">
            <span>Budget Spent: </span>
            <strong
              className={`font-semibold tabular-nums ${
                summary.budgetSpentPercent > summary.monthElapsedPercent
                  ? 'text-[#fbbf24]'
                  : 'text-[#34d399]'
              }`}
            >
              {summary.budgetSpentPercent}%
            </strong>
          </div>
        </div>
      </div>

      {/* Main 30-Day Segmented / Continuous Bar */}
      <div className="relative pt-2 pb-6">
        <ProgressBar
          value={summary.monthElapsedPercent}
          colorVariant="lime"
          size="md"
        />

        {/* Milestone Pin Indicators */}
        <div className="relative w-full mt-2 hidden sm:block">
          {milestoneDays.map((m) => {
            const leftPercent = ((m.day - 1) / 29) * 100;
            const isPassed = m.day < summary.currentDay;
            const isToday = m.day === summary.currentDay;

            return (
              <div
                key={m.day}
                className="absolute -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${leftPercent}%` }}
              >
                <div
                  className={`w-2 h-2 rounded-full mb-1 transition-transform ${
                    isToday
                      ? 'bg-accent-lime ring-4 ring-accent-lime/20 scale-125'
                      : isPassed
                      ? 'bg-[#64748b]'
                      : m.type === 'bill'
                      ? 'bg-[#38bdf8]'
                      : 'bg-[#334155]'
                  }`}
                />
                <span
                  className={`text-[11px] whitespace-nowrap font-medium ${
                    isToday
                      ? 'text-accent-lime font-bold'
                      : isPassed
                      ? 'text-[#64748b]'
                      : m.type === 'bill'
                      ? 'text-[#7dd3fc]'
                      : 'text-[#475569]'
                  }`}
                >
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Narrative Footer */}
      <div className="mt-2 pt-3 border-t border-[#1a2332] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#94a3b8] gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-[#34d399] shrink-0" />
          <span>
            {summary.daysRemaining} days left. 4 scheduled bills protected between Day 18 and Day 28.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[#cbd5e1] font-medium shrink-0">
          <Flag className="w-3.5 h-3.5 text-accent-lime" />
          <span>Target: Reach Day 30 with ₹0 debt and savings intact</span>
        </div>
      </div>
    </Card>
  );
};
