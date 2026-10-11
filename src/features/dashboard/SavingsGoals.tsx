import React from 'react';
import { PiggyBank, Target, ShieldCheck, Plus, ArrowDownLeft, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { SavingsGoal } from '../../types/savings';
import { formatINR } from '../../lib/currency';

export interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onOpenAddModal?: () => void;
  onOpenAdjustModal?: (goal: SavingsGoal) => void;
  onDeleteGoal?: (id: string) => void;
}

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({
  goals,
  onOpenAddModal,
  onOpenAdjustModal,
  onDeleteGoal,
}) => {
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalProgressPercent = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <Card variant="default" className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
            <PiggyBank className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Savings & Cushion Goals
            </h3>
            <span className="text-xs text-zinc-400">
              Ring-fenced from daily spending
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-zinc-400">Saved:</span>
            <span className="font-bold text-accent-lime tabular-nums">
              {formatINR(totalSaved)}
            </span>
            <span className="text-zinc-400">/ {formatINR(totalTarget)}</span>
          </div>
          {onOpenAddModal && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAddModal}
              icon={<Plus className="w-3.5 h-3.5" />}
              className="py-1 px-2 text-xs"
            >
              New Goal
            </Button>
          )}
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
        <div className="text-center py-6 text-xs text-zinc-400 font-mono">
          No savings goals created yet.
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
                className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-accent-lime shrink-0" />
                    <span className="text-xs font-semibold text-zinc-100">
                      {goal.name}
                    </span>
                    <Badge
                      variant={goal.priority === 'essential' ? 'lime' : 'neutral'}
                      size="sm"
                    >
                      {goal.category}
                    </Badge>
                  </div>

                    <div className="flex items-center gap-2.5">
                    <div className="text-xs font-mono tabular-nums text-zinc-300">
                      <strong className="text-accent-lime">{formatINR(goal.currentAmount)}</strong>
                      <span className="text-zinc-400"> / {formatINR(goal.targetAmount)}</span>
                    </div>

                    {/* Deposit / Withdraw Action Button */}
                    {onOpenAdjustModal && (
                      <button
                        type="button"
                        onClick={() => onOpenAdjustModal(goal)}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[11px] font-mono cursor-pointer flex items-center gap-1"
                        title="Deposit or withdraw"
                      >
                        <ArrowDownLeft className="w-3 h-3 text-accent-lime" />
                        Transfer
                      </button>
                    )}

                    {onDeleteGoal && (
                      <button
                        type="button"
                        onClick={() => onDeleteGoal(goal.id)}
                        className="p-1 rounded text-zinc-400 hover:text-red-400 cursor-pointer"
                        title="Remove goal (releases locked funds)"
                        aria-label={`Delete ${goal.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <ProgressBar
                  value={goalPercent}
                  colorVariant={goal.priority === 'essential' ? 'lime' : 'neutral'}
                  size="sm"
                />

                <div className="mt-2 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
                  <span>{goal.notes}</span>
                  <span className="font-semibold text-zinc-300 tabular-nums">
                    {goalPercent}% reached
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Accounting Rule Clarification */}
      <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-2 text-[11px] text-zinc-400 leading-relaxed">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          Savings belong to you and are not an expense. Ring-fencing money here safeguards it from impulsive spending, but can be unlocked anytime if emergencies strike.
        </span>
      </div>
    </Card>
  );
};
