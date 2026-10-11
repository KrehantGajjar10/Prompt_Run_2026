import React from 'react';
import {
  Plus,
  Target,
  ArrowDownLeft,
  ShieldCheck,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { useFinance } from '../../context/useFinance';
import { formatINR } from '../../lib/currency';
import type { SavingsGoal } from '../../types/savings';

export interface SavingsViewProps {
  onOpenAddModal: () => void;
  onOpenAdjustModal: (goal: SavingsGoal) => void;
  onEditGoal: (goal: SavingsGoal) => void;
}

export const SavingsView: React.FC<SavingsViewProps> = ({
  onOpenAddModal,
  onOpenAdjustModal,
  onEditGoal,
}) => {
  const finance = useFinance();

  const totalSaved = finance.savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = finance.savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalPercent = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 font-sans">
            Savings & Financial Cushions
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Ring-fence funds for emergencies, travel, and goals without losing track of your money
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenAddModal}
          icon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Create Savings Goal
        </Button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="subtle" className="p-4">
          <span className="text-[11px] font-mono uppercase text-zinc-400">Total Saved Cushion</span>
          <div className="text-2xl font-bold text-accent-lime font-mono tabular-nums mt-1">
            {formatINR(totalSaved)}
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            Across {finance.savingsGoals.length} target goal{finance.savingsGoals.length === 1 ? '' : 's'}
          </span>
        </Card>

        <Card variant="subtle" className="p-4">
          <span className="text-[11px] font-mono uppercase text-zinc-400">Total Savings Target</span>
          <div className="text-2xl font-bold text-zinc-100 font-mono tabular-nums mt-1">
            {formatINR(totalTarget)}
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            {Math.round(totalPercent)}% of target funded
          </span>
        </Card>

        <Card variant="subtle" className="p-4">
          <span className="text-[11px] font-mono uppercase text-zinc-400">Available to Deposit</span>
          <div className="text-2xl font-bold text-zinc-300 font-mono tabular-nums mt-1">
            {formatINR(finance.summary.availableBalance)}
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            Remaining discretionary cash
          </span>
        </Card>
      </div>

      {/* Progress banner */}
      <Card variant="default" className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-zinc-200">Overall Cushion Progress</span>
          <span className="text-sm font-bold font-mono text-accent-lime tabular-nums">
            {Math.round(totalPercent)}% Completed
          </span>
        </div>
        <ProgressBar value={totalPercent} colorVariant="lime" size="md" />
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mt-3 pt-2 border-t border-zinc-800">
          <span>{formatINR(totalSaved)} locked in goals</span>
          <span>{formatINR(Math.max(0, totalTarget - totalSaved))} remaining to target</span>
        </div>
      </Card>

      {/* Accounting Explanation */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-zinc-200">Accounting Rule:</strong> Money in your savings goals belongs strictly to you—it is not an expense that vanishes. Segregating money into goals subtracts it from your daily safe-to-spend allowance so you avoid spending it on non-essentials. If an emergency strikes before Day 30, you can withdraw from these goals back into your discretionary balance at any time.
        </p>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {finance.savingsGoals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / (goal.targetAmount || 1)) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <Card key={goal.id} variant="default" className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-accent-lime" />
                      <h3 className="text-base font-bold text-zinc-100">{goal.name}</h3>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono mt-0.5 block">
                      {goal.category} • Priority: {goal.priority}
                    </span>
                  </div>

                  <Badge
                    variant={goal.priority === 'essential' ? 'lime' : 'neutral'}
                    size="sm"
                  >
                    {goal.priority}
                  </Badge>
                </div>

                {/* Amounts */}
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-bold font-mono text-accent-lime tabular-nums">
                    {formatINR(goal.currentAmount)}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    of {formatINR(goal.targetAmount)} target
                  </span>
                </div>

                <ProgressBar
                  value={pct}
                  colorVariant={goal.priority === 'essential' ? 'lime' : 'neutral'}
                  size="md"
                />

                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mt-2">
                  <span>{pct}% funded</span>
                  <span>{remaining > 0 ? `${formatINR(remaining)} needed` : 'Goal achieved!'}</span>
                </div>

                {goal.notes && (
                  <p className="text-xs text-zinc-400 italic mt-3 pt-2.5 border-t border-zinc-800">
                    "{goal.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3.5 border-t border-zinc-800 flex items-center justify-between gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onOpenAdjustModal(goal)}
                  icon={<ArrowDownLeft className="w-3.5 h-3.5" />}
                  className="text-xs font-mono"
                >
                  Transfer Money
                </Button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditGoal(goal)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    title="Edit goal details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => finance.deleteSavingsGoal(goal.id)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 cursor-pointer"
                    title="Remove goal (releases locked funds back to available balance)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
