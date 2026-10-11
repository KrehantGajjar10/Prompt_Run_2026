import React from 'react';
import { PiggyBank, Target, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import type { SavingsGoal } from '../../types/savings';
import { formatINR } from '../../lib/currency';

export interface SavingsGoalsProps {
  goals: SavingsGoal[];
}

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({ goals }) => {
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalProgressPercent = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <Card variant="default" className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#1f2838] text-accent-lime">
            <PiggyBank className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f1f5f9]">
              Savings & Cushion Goals
            </h3>
            <span className="text-xs text-[#94a3b8]">
              Protected from daily discretionary spending
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#94a3b8]">Total Saved:</span>
          <span className="font-bold text-accent-lime tabular-nums">
            {formatINR(totalSaved)}
          </span>
          <span className="text-[#64748b]">/ {formatINR(totalTarget)}</span>
        </div>
      </div>

      {/* Aggregate Progress Bar */}
      <div className="mb-4">
        <ProgressBar
          value={totalProgressPercent}
          colorVariant="lime"
          size="sm"
          label="Overall Savings Progress"
          sublabel={`${formatINR(totalSaved)} of ${formatINR(totalTarget)}`}
          showPercent
        />
      </div>

      {/* Goals Preview List */}
      {goals.length === 0 ? (
        <div className="text-center py-6 text-xs text-[#94a3b8]">
          No savings goals created for this cycle.
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const goalPercent = Math.min(
              100,
              Math.round((goal.currentAmount / (goal.targetAmount || 1)) * 100)
            );

            return (
              <div
                key={goal.id}
                className="p-3.5 rounded-lg bg-[#111621] border border-[#1d2737] hover:border-[#2a384f] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-accent-lime shrink-0" />
                    <span className="text-xs font-semibold text-[#f1f5f9]">
                      {goal.name}
                    </span>
                    <Badge
                      variant={goal.priority === 'essential' ? 'lime' : 'neutral'}
                      size="sm"
                    >
                      {goal.category}
                    </Badge>
                  </div>

                  <div className="text-xs font-medium text-[#cbd5e1] tabular-nums">
                    <strong className="text-accent-lime">{formatINR(goal.currentAmount)}</strong>
                    <span className="text-[#64748b]"> / {formatINR(goal.targetAmount)}</span>
                  </div>
                </div>

                <ProgressBar
                  value={goalPercent}
                  colorVariant={goal.priority === 'essential' ? 'lime' : 'sky'}
                  size="sm"
                />

                <div className="mt-2 text-[11px] text-[#64748b] flex items-center justify-between">
                  <span>{goal.notes}</span>
                  <span className="font-semibold text-[#94a3b8] tabular-nums">
                    {goalPercent}% reached
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Accounting Rule Clarification */}
      <div className="mt-4 pt-3 border-t border-[#1a2332] flex items-center gap-2 text-[11px] text-[#64748b]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#34d399] shrink-0" />
        <span>
          Savings are locked so you don't overspend, but remain yours. In an extreme emergency, locked savings can be tapped before borrowing debt.
        </span>
      </div>
    </Card>
  );
};
