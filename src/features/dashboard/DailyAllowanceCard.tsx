import React, { useState } from 'react';
import { Target, TrendingDown, CheckCircle2, AlertTriangle, XCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import type { FinancialSummary } from '../../types/budget';
import { formatINR, parseINR } from '../../lib/currency';

export interface DailyAllowanceCardProps {
  summary: FinancialSummary;
  onOpenFullSimulator?: () => void;
}

export const DailyAllowanceCard: React.FC<DailyAllowanceCardProps> = ({
  summary,
  onOpenFullSimulator,
}) => {
  const [testAmountStr, setTestAmountStr] = useState<string>('');
  const [testedAmount, setTestedAmount] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Today's numbers
  const dailyAllowance = Math.round(summary.dailySafeAllowance);
  const spentToday = summary.spentToday;
  const cushionLeftToday = Math.max(0, dailyAllowance - spentToday);
  const todayProgressPercent = dailyAllowance > 0 ? (spentToday / dailyAllowance) * 100 : 0;

  // Handle calculation check
  const handleCheckAffordability = (amountToTest?: number) => {
    const rawVal = amountToTest !== undefined ? amountToTest : parseINR(testAmountStr);

    if (isNaN(rawVal) || rawVal <= 0) {
      setValidationError('Please enter a valid amount greater than ₹0.');
      setTestedAmount(null);
      return;
    }

    setValidationError(null);
    setTestedAmount(rawVal);
    if (amountToTest !== undefined) {
      setTestAmountStr(amountToTest.toString());
    }
  };

  const handleResetCheck = () => {
    setTestAmountStr('');
    setTestedAmount(null);
    setValidationError(null);
  };

  // Evaluate tested amount
  const evaluation = testedAmount !== null ? evaluateExpense(testedAmount, cushionLeftToday, summary) : null;

  return (
    <Card variant="elevated" className="mb-6 relative overflow-hidden border-zinc-700/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Daily Allowance Pulse */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-zinc-800 text-accent-lime border border-zinc-700/60">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-zinc-100 font-sans">
                Safe Daily Spending Allowance
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 font-medium border border-zinc-700">
              Recalculated Daily
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-accent-lime tracking-tight font-mono tabular-nums">
              {formatINR(dailyAllowance)}
              <span className="text-xs sm:text-sm font-normal text-zinc-400 ml-1.5 font-sans">
                / day
              </span>
            </div>
            <div className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono">
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Baseline was <strong className="text-zinc-200">{formatINR(summary.baselineDailyAllowance)}/day</strong>
              </span>
            </div>
          </div>

          {/* Today's Tracker */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-zinc-300">
                Today's Spending (Day {summary.currentDay})
              </span>
              <span className="text-zinc-400 font-mono">
                <strong className="text-zinc-100 tabular-nums">{formatINR(spentToday)}</strong> of{' '}
                <strong className="text-zinc-300 tabular-nums">{formatINR(dailyAllowance)}</strong> safe limit
              </span>
            </div>

            <ProgressBar
              value={todayProgressPercent}
              colorVariant={todayProgressPercent > 100 ? 'rose' : todayProgressPercent > 80 ? 'amber' : 'lime'}
              size="md"
            />

            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-800/80 text-xs font-mono">
              <span className="text-zinc-400">
                Remaining cushion today:
              </span>
              <span
                className={`font-semibold tabular-nums ${
                  cushionLeftToday > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {cushionLeftToday > 0 ? `+${formatINR(cushionLeftToday)} remaining` : 'Limit reached for today'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Instant "Can I Afford This?" Micro-Tool */}
        <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-4.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-lime" />
              <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-200 font-mono">
                Quick Affordability Check
              </h4>
            </div>
            {onOpenFullSimulator && (
              <button
                type="button"
                onClick={onOpenFullSimulator}
                className="text-[11px] text-accent-lime hover:underline font-mono flex items-center gap-1 cursor-pointer"
              >
                Full Simulator <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
            Thinking of buying something right now? Check if it fits today's limit without borrowing from tomorrow.
          </p>

          {/* Input & Form */}
          <div className="space-y-2.5">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-mono">
                  ₹
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 150"
                  value={testAmountStr}
                  onChange={(e) => {
                    setTestAmountStr(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCheckAffordability();
                  }}
                  aria-label="Enter expense amount in rupees"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-7 pr-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-accent-lime font-mono tabular-nums transition-colors"
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleCheckAffordability()}
                className="shrink-0"
              >
                Check
              </Button>
              {testedAmount !== null && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetCheck}
                  className="shrink-0 text-xs px-2"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-zinc-400 font-mono">Quick:</span>
              <button
                type="button"
                onClick={() => handleCheckAffordability(40)}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer"
              >
                Chai (₹40)
              </button>
              <button
                type="button"
                onClick={() => handleCheckAffordability(150)}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer"
              >
                Meal (₹150)
              </button>
              <button
                type="button"
                onClick={() => handleCheckAffordability(350)}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer"
              >
                Outing (₹350)
              </button>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div
                role="alert"
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/25 text-xs text-red-400 flex items-center gap-2"
              >
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Result Verdict Box */}
            {evaluation && (
              <div
                role="status"
                aria-live="polite"
                className={`p-3 rounded-lg border text-xs transition-all ${evaluation.bgClass}`}
              >
                <div className="flex items-center gap-2 font-semibold mb-1">
                  {evaluation.icon}
                  <span className={evaluation.titleClass}>{evaluation.title}</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  {evaluation.description}
                </p>
                {evaluation.impactNote && (
                  <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-zinc-400 font-mono">
                    {evaluation.impactNote}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

interface AffordabilityEvaluation {
  title: string;
  titleClass: string;
  description: string;
  impactNote?: string;
  icon: React.ReactNode;
  bgClass: string;
}

function evaluateExpense(
  amount: number,
  cushionToday: number,
  summary: FinancialSummary
): AffordabilityEvaluation {
  if (amount > summary.availableBalance) {
    return {
      title: 'Danger: Exceeds Available Funds!',
      titleClass: 'text-red-400',
      description: `This purchase of ${formatINR(amount)} exceeds your entire remaining discretionary pool of ${formatINR(summary.availableBalance)}.`,
      impactNote: 'Would force you into debt or tapping locked savings.',
      icon: <XCircle className="w-4 h-4 text-red-400" />,
      bgClass: 'bg-red-500/10 border-red-500/30',
    };
  }

  if (amount <= cushionToday) {
    const remainingAfter = cushionToday - amount;
    return {
      title: 'Safe to Spend!',
      titleClass: 'text-[#bef264]',
      description: `Fits comfortably inside today's allowance. You will still have ${formatINR(remainingAfter)} cushion left today.`,
      impactNote: 'Zero impact on tomorrow’s daily quota.',
      icon: <CheckCircle2 className="w-4 h-4 text-accent-lime" />,
      bgClass: 'bg-[#bef264]/10 border-[#bef264]/30',
    };
  }

  const excess = amount - cushionToday;
  const newDaysRemaining = Math.max(1, summary.daysRemaining - 1);
  const newBalance = Math.max(0, summary.availableBalance - amount);
  const futureDaily = Math.round(newBalance / newDaysRemaining);

  return {
    title: 'Tight Squeeze: Borrows from Tomorrow',
    titleClass: 'text-amber-400',
    description: `Exceeds today's cushion by ${formatINR(excess)}. If spent, your future daily allowance drops from ${formatINR(summary.dailySafeAllowance)} to ~${formatINR(futureDaily)}/day for the remaining ${newDaysRemaining} days.`,
    impactNote: 'Survivable, but tomorrow will require strict belt-tightening.',
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    bgClass: 'bg-amber-500/10 border-amber-500/30',
  };
}
