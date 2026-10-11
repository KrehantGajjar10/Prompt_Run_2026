import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Info,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import type { FinancialSummary } from '../../types/budget';
import { formatINR } from '../../lib/currency';

export interface BudgetPacingForecastProps {
  summary: FinancialSummary;
}

export const BudgetPacingForecast: React.FC<BudgetPacingForecastProps> = ({ summary }) => {
  const [activeScenario, setActiveScenario] = useState<'current_pace' | 'safe_allowance' | 'baseline'>('current_pace');

  const {
    totalFunds,
    totalSpent,
    reservedCommitments,
    savingsLocked,
    availableBalance,
    currentDay,
    totalDays,
    daysRemaining,
    dailySafeAllowance,
    baselineDailyAllowance,
    dailyAverageBurnRate,
    monthElapsedPercent,
    budgetSpentPercent,
    projectedMonthEndBalance,
  } = summary;

  // Pace metrics
  const paceDiff = monthElapsedPercent - budgetSpentPercent;
  const isUnderPace = paceDiff >= 0;
  const headroomAmount = Math.round(
    ((monthElapsedPercent - budgetSpentPercent) / 100) * totalFunds
  );

  // Proportional allocation percentages of totalFunds (accounting stack)
  const spentPct = totalFunds > 0 ? (totalSpent / totalFunds) * 100 : 0;
  const reservedPct = totalFunds > 0 ? (reservedCommitments / totalFunds) * 100 : 0;
  const savingsPct = totalFunds > 0 ? (savingsLocked / totalFunds) * 100 : 0;
  const availablePct = totalFunds > 0 ? (availableBalance / totalFunds) * 100 : 0;

  // Scenario forecasting
  // Scenario 1: Current Run-Rate (actual average pace)
  const futureSpendAtCurrentPace = Math.round(dailyAverageBurnRate * Math.max(0, daysRemaining - 1));
  const monthEndAtCurrentPace = projectedMonthEndBalance;

  // Scenario 2: Strict Safe Allowance (spend exactly safe daily allowance)
  const futureSpendAtSafeQuota = Math.round(dailySafeAllowance * daysRemaining);
  const monthEndAtSafeQuota = Math.round(availableBalance - futureSpendAtSafeQuota); // ~ 0

  // Scenario 3: Baseline Rate (spend at starting ₹333/day baseline)
  const futureSpendAtBaseline = Math.round(baselineDailyAllowance * daysRemaining);
  const monthEndAtBaseline = Math.round(availableBalance - futureSpendAtBaseline);

  const selectedScenarioData = {
    current_pace: {
      label: 'Current Run-Rate',
      dailyRate: Math.round(dailyAverageBurnRate),
      futureSpend: futureSpendAtCurrentPace,
      projectedBalance: monthEndAtCurrentPace,
      explanation: `If you continue spending at your 12-day average rate of ${formatINR(Math.round(dailyAverageBurnRate))}/day.`,
    },
    safe_allowance: {
      label: 'Safe Daily Quota',
      dailyRate: Math.round(dailySafeAllowance),
      futureSpend: futureSpendAtSafeQuota,
      projectedBalance: monthEndAtSafeQuota,
      explanation: `If you spend exactly your dynamic safe allowance of ${formatINR(Math.round(dailySafeAllowance))}/day every day.`,
    },
    baseline: {
      label: 'Baseline Rate',
      dailyRate: Math.round(baselineDailyAllowance),
      futureSpend: futureSpendAtBaseline,
      projectedBalance: monthEndAtBaseline,
      explanation: `If you spend at the original starting rate of ${formatINR(Math.round(baselineDailyAllowance))}/day without adjusting for reserved bills.`,
    },
  }[activeScenario];

  return (
    <Card variant="default" className="mb-6 overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg bg-zinc-800 border shrink-0 ${isUnderPace ? 'text-accent-lime border-zinc-700/60' : 'text-amber-400 border-amber-500/30'}`}>
            {isUnderPace ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-100 font-sans">
              Budget Pace & Month-End Forecast
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Live pacing analysis vs. mathematical survival projections
            </p>
          </div>
        </div>

        {/* Pacing Verdict Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge
            variant={isUnderPace ? 'lime' : 'warning'}
            size="md"
            className="flex items-center gap-1.5 font-mono text-xs"
          >
            {isUnderPace ? (
              <ShieldCheck className="w-3.5 h-3.5 text-accent-lime" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>
              {isUnderPace
                ? `Under Budget Pace (+${Math.abs(paceDiff)}% buffer)`
                : `Over Budget Pace (${paceDiff}% accelerated burn)`}
            </span>
          </Badge>
        </div>
      </div>

      {/* 1. Dual Pacing Comparison Trackers */}
      <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 sm:p-5 mb-5 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
          <span className="font-semibold text-zinc-200">
            Pacing Comparison: Days Elapsed vs. Budget Consumed
          </span>
          <span className="text-[11px] text-zinc-400">
            Day {currentDay} of {totalDays}
          </span>
        </div>

        {/* Bar 1: Days Elapsed */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              Time Elapsed in Cycle:
            </span>
            <span className="font-bold text-zinc-200 font-mono tabular-nums">
              {monthElapsedPercent}% ({currentDay} of {totalDays} days)
            </span>
          </div>
          <ProgressBar value={monthElapsedPercent} colorVariant="neutral" size="sm" />
        </div>

        {/* Bar 2: Budget Spent */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-accent-lime" />
              Budget Consumed so far:
            </span>
            <span
              className={`font-bold font-mono tabular-nums ${
                isUnderPace ? 'text-accent-lime' : 'text-amber-400'
              }`}
            >
              {budgetSpentPercent}% ({formatINR(totalSpent)} of {formatINR(totalFunds)})
            </span>
          </div>
          <ProgressBar
            value={budgetSpentPercent}
            colorVariant={isUnderPace ? 'lime' : 'amber'}
            size="sm"
          />
        </div>

        {/* Textual accessibility summary of pacing */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-400 gap-2 font-mono">
          <p>
            {isUnderPace ? (
              <span>
                Positive Pace: You have spent{' '}
                <strong className="text-accent-lime">{budgetSpentPercent}%</strong> of funds while{' '}
                <strong className="text-zinc-200">{monthElapsedPercent}%</strong> of the cycle has passed. You hold approximately{' '}
                <strong className="text-accent-lime">{formatINR(headroomAmount)}</strong> in spending headroom.
              </span>
            ) : (
              <span>
                Caution Pace: Spending rate (<strong className="text-amber-400">{budgetSpentPercent}%</strong>) exceeds time elapsed (<strong className="text-zinc-200">{monthElapsedPercent}%</strong>). Slow discretionary spending to avoid month-end shortfall.
              </span>
            )}
          </p>

          <div className="shrink-0 flex items-center gap-3 text-[11px]">
            <span>Actual Burn: <strong className="text-zinc-200">{formatINR(Math.round(dailyAverageBurnRate))}/d</strong></span>
            <span>•</span>
            <span>Target Quota: <strong className="text-accent-lime">{formatINR(Math.round(dailySafeAllowance))}/d</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Visual Proportional Allocation Stack (Runway Breakdown) */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-zinc-300 font-semibold">
            ₹{totalFunds.toLocaleString('en-IN')} Total Funds Allocation Stack
          </span>
          <span className="text-[11px] text-zinc-400">
            Real Application State
          </span>
        </div>

        {/* Multi-segmented proportional bar */}
        <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-zinc-950 border border-zinc-800">
          <div
            style={{ width: `${Math.max(spentPct, 1)}%` }}
            title={`Actual Spent: ${formatINR(totalSpent)} (${Math.round(spentPct)}%)`}
            className="h-full bg-zinc-600 transition-all duration-300 hover:opacity-90"
          />
          <div
            style={{ width: `${Math.max(reservedPct, 1)}%` }}
            title={`Reserved Bills: ${formatINR(reservedCommitments)} (${Math.round(reservedPct)}%)`}
            className="h-full bg-amber-400/80 transition-all duration-300 hover:opacity-90"
          />
          <div
            style={{ width: `${Math.max(savingsPct, 1)}%` }}
            title={`Locked Savings: ${formatINR(savingsLocked)} (${Math.round(savingsPct)}%)`}
            className="h-full bg-emerald-400 transition-all duration-300 hover:opacity-90"
          />
          <div
            style={{ width: `${Math.max(availablePct, 1)}%` }}
            title={`Available Balance: ${formatINR(availableBalance)} (${Math.round(availablePct)}%)`}
            className="h-full bg-accent-lime transition-all duration-300 hover:opacity-90"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2.5 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 shrink-0" />
            <span className="text-zinc-300">Spent:</span>
            <strong className="text-zinc-200 tabular-nums">{formatINR(totalSpent)}</strong>
            <span className="text-zinc-500 text-[11px]">({Math.round(spentPct)}%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 shrink-0" />
            <span className="text-zinc-300">Reserved Bills:</span>
            <strong className="text-zinc-200 tabular-nums">{formatINR(reservedCommitments)}</strong>
            <span className="text-zinc-500 text-[11px]">({Math.round(reservedPct)}%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-zinc-300">Locked Savings:</span>
            <strong className="text-emerald-400 tabular-nums">{formatINR(savingsLocked)}</strong>
            <span className="text-zinc-500 text-[11px]">({Math.round(savingsPct)}%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-lime shrink-0" />
            <span className="text-zinc-300">Safe Available:</span>
            <strong className="text-accent-lime tabular-nums">{formatINR(availableBalance)}</strong>
            <span className="text-zinc-500 text-[11px]">({Math.round(availablePct)}%)</span>
          </div>
        </div>
      </div>

      {/* 3. Month-End Forecast Scenarios & Projection */}
      <div className="pt-4 border-t border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-300 font-mono">
              Month-End Balance Forecast (Day 30 Projection)
            </span>
            <p className="text-[11px] text-zinc-500 font-mono">
              Clearly distinguishes current actuals from projected future spending
            </p>
          </div>

          {/* Scenario Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800 text-[11px] font-mono self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveScenario('current_pace')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeScenario === 'current_pace'
                  ? 'bg-zinc-800 text-accent-lime font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Current Pace
            </button>
            <button
              type="button"
              onClick={() => setActiveScenario('safe_allowance')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeScenario === 'safe_allowance'
                  ? 'bg-zinc-800 text-accent-lime font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Safe Quota
            </button>
            <button
              type="button"
              onClick={() => setActiveScenario('baseline')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeScenario === 'baseline'
                  ? 'bg-zinc-800 text-accent-lime font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Baseline
            </button>
          </div>
        </div>

        {/* Projection Outcome Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4">
          <div>
            <span className="text-[11px] font-mono text-zinc-500 uppercase">
              Assumed Future Daily Burn
            </span>
            <div className="text-xl font-bold font-mono text-zinc-200 tabular-nums mt-0.5">
              {formatINR(selectedScenarioData.dailyRate)} <span className="text-xs font-normal text-zinc-500">/ day</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">
              Across remaining {daysRemaining} days
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-zinc-500 uppercase">
              Projected Future Outflow
            </span>
            <div className="text-xl font-bold font-mono text-zinc-300 tabular-nums mt-0.5">
              {formatINR(selectedScenarioData.futureSpend)}
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">
              Discretionary spend (Bills reserved separately)
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-zinc-500 uppercase">
              Projected Day 30 Net Buffer
            </span>
            <div
              className={`text-xl font-extrabold font-mono tabular-nums mt-0.5 flex items-center gap-1 ${
                selectedScenarioData.projectedBalance > 0
                  ? 'text-accent-lime'
                  : selectedScenarioData.projectedBalance < 0
                  ? 'text-red-400'
                  : 'text-zinc-200'
              }`}
            >
              {selectedScenarioData.projectedBalance > 0 ? '+' : ''}
              {formatINR(selectedScenarioData.projectedBalance)}
            </div>
            <span className="text-[10px] font-mono">
              {selectedScenarioData.projectedBalance > 0 ? (
                <span className="text-emerald-400">Surplus + ₹{savingsLocked} savings intact</span>
              ) : selectedScenarioData.projectedBalance < 0 ? (
                <span className="text-red-400">Shortfall / Overdraft risk</span>
              ) : (
                <span className="text-zinc-400">Exact break-even, ₹0 debt</span>
              )}
            </span>
          </div>
        </div>

        {/* Explicitly Documented Assumptions */}
        <div className="mt-3.5 flex items-start gap-2 text-[11px] text-zinc-400 bg-zinc-900/60 border border-zinc-800/60 rounded-lg p-3 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-accent-lime shrink-0 mt-0.5" />
          <div>
            <strong className="text-zinc-300 font-mono">Forecast Assumptions ({selectedScenarioData.label}): </strong>
            <span>
              {selectedScenarioData.explanation} Assumes all {formatINR(reservedCommitments)} of upcoming reserved bills are honored, {formatINR(savingsLocked)} remains untouched in savings goals, and no unanticipated unbudgeted emergencies arise before Day 30.
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
