import React, { useState, useMemo } from 'react';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useFinance } from '../../context/useFinance';
import {
  simulateDecision,
  type DecisionType,
  type SimulationResult,
} from '../../lib/calculations';
import { formatINR } from '../../lib/currency';

export const DecisionSimulatorView: React.FC = () => {
  const finance = useFinance();

  // Scenario input state
  const [scenarioType, setScenarioType] = useState<DecisionType>('discretionary_expense');
  const [title, setTitle] = useState('Weekend Hangout with Friends');
  const [amountStr, setAmountStr] = useState('350');
  const [targetId, setTargetId] = useState<string>('');
  const [hasSimulated, setHasSimulated] = useState(true);
  const [applySuccessMessage, setApplySuccessMessage] = useState<string | null>(null);

  // Compute simulation result safely
  const simulationResult = useMemo<SimulationResult | null>(() => {
    if (!hasSimulated) return null;
    const amount = parseFloat(amountStr) || 0;

    const input = {
      startingBudget: finance.startingBudget,
      additionalIncome: finance.additionalIncome,
      totalDays: finance.totalDays,
      currentDay: finance.currentDay,
      transactions: finance.transactions,
      commitments: finance.commitments,
      savingsGoals: finance.savingsGoals,
    };

    let resolvedTargetId = targetId;
    if (!resolvedTargetId) {
      if (scenarioType === 'savings_allocation' || scenarioType === 'savings_withdrawal') {
        resolvedTargetId = finance.savingsGoals[0]?.id || '';
      } else if (scenarioType === 'cancel_subscription' || scenarioType === 'pay_bill_early') {
        resolvedTargetId = finance.commitments.find((c) => c.status === 'reserved')?.id || '';
      }
    }

    return simulateDecision(input, {
      type: scenarioType,
      title: title.trim() || 'Simulated Decision',
      amount,
      targetId: resolvedTargetId,
    });
  }, [
    hasSimulated,
    scenarioType,
    title,
    amountStr,
    targetId,
    finance.startingBudget,
    finance.additionalIncome,
    finance.totalDays,
    finance.currentDay,
    finance.transactions,
    finance.commitments,
    finance.savingsGoals,
  ]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: {
    type: DecisionType;
    title: string;
    amount: number;
    targetId?: string;
  }) => {
    setScenarioType(preset.type);
    setTitle(preset.title);
    setAmountStr(preset.amount.toString());
    if (preset.targetId) setTargetId(preset.targetId);
    setHasSimulated(true);
    setApplySuccessMessage(null);
  };

  // Handle Applying Decision to Real State
  const handleApplyDecision = () => {
    if (!simulationResult) return;
    const { scenario } = simulationResult;

    let success = false;
    switch (scenario.type) {
      case 'discretionary_expense':
      case 'unexpected_emergency':
        success = finance.addTransaction({
          title: scenario.title,
          amount: scenario.amount,
          type: 'expense',
          category: scenario.type === 'unexpected_emergency' ? 'emergency_health' : 'entertainment_social',
          paymentMethod: 'UPI (GPay)',
        });
        break;

      case 'savings_allocation':
        if (scenario.targetId) {
          success = finance.depositToGoal(scenario.targetId, scenario.amount);
        }
        break;

      case 'savings_withdrawal':
        if (scenario.targetId) {
          success = finance.withdrawFromGoal(scenario.targetId, scenario.amount);
        }
        break;

      case 'cancel_subscription':
        if (scenario.targetId) {
          success = finance.cancelCommitment(scenario.targetId);
        }
        break;

      case 'pay_bill_early':
        if (scenario.targetId) {
          success = finance.payCommitment(scenario.targetId);
        }
        break;
    }

    if (success) {
      setApplySuccessMessage(`Decision applied successfully: "${scenario.title}" recorded in ledger.`);
      setTimeout(() => setApplySuccessMessage(null), 5000);
    }
  };

  const handleDiscard = () => {
    setTitle('');
    setAmountStr('');
    setHasSimulated(false);
    setApplySuccessMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header briefing */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-zinc-800 text-accent-lime border border-zinc-700/60">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 font-sans">
              Financial Decision Simulator
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Safe Sandbox Environment • Zero ledger mutations until you confirm
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed mt-2">
          Wondering if you can afford an upcoming purchase, an emergency expense, or an early bill payment? Test any financial scenario here to see an exact before-and-after comparison of your safe daily allowance, reserved funds, and month-end trajectory.
        </p>

        {/* Quick Scenario Presets */}
        <div className="mt-4 pt-4 border-t border-zinc-800/80">
          <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider block mb-2">
            Try a Realistic Scenario:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                handleSelectPreset({
                  type: 'discretionary_expense',
                  title: 'Weekend Biryani & Cinema Outing',
                  amount: 450,
                })
              }
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
            >
              Weekend Outing (₹450)
            </button>
            <button
              type="button"
              onClick={() =>
                handleSelectPreset({
                  type: 'unexpected_emergency',
                  title: 'Clinic Visit & Antibiotics',
                  amount: 600,
                })
              }
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
            >
              Unexpected Medical (₹600)
            </button>
            <button
              type="button"
              onClick={() =>
                handleSelectPreset({
                  type: 'savings_allocation',
                  title: 'Add to Emergency Cushion',
                  amount: 300,
                  targetId: finance.savingsGoals[0]?.id,
                })
              }
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
            >
              Extra Savings (+₹300)
            </button>
            {finance.commitments.find((c) => c.status === 'reserved') && (
              <button
                type="button"
                onClick={() => {
                  const comm = finance.commitments.find((c) => c.status === 'reserved')!;
                  handleSelectPreset({
                    type: 'cancel_subscription',
                    title: `Cancel ${comm.title}`,
                    amount: comm.amount,
                    targetId: comm.id,
                  });
                }}
                className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-amber-400 border border-zinc-700 transition-colors cursor-pointer"
              >
                Cancel Subscription (Save ₹{finance.commitments.find((c) => c.status === 'reserved')?.amount})
              </button>
            )}
            {finance.commitments.find((c) => c.status === 'reserved') && (
              <button
                type="button"
                onClick={() => {
                  const comm = finance.commitments.find((c) => c.status === 'reserved')!;
                  handleSelectPreset({
                    type: 'pay_bill_early',
                    title: `Pay ${comm.title} Early`,
                    amount: comm.amount,
                    targetId: comm.id,
                  });
                }}
                className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-accent-lime border border-zinc-700 transition-colors cursor-pointer"
              >
                Pay Bill Early (₹{finance.commitments.find((c) => c.status === 'reserved')?.amount})
              </button>
            )}
          </div>
        </div>
      </div>

      {applySuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{applySuccessMessage}</span>
        </div>
      )}

      {/* Simulator Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Decision Builder Form */}
        <Card variant="default" className="lg:col-span-5">
          <h3 className="text-sm font-semibold text-zinc-100 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-lime" />
            Configure Scenario
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Decision Type
              </label>
              <select
                value={scenarioType}
                onChange={(e) => {
                  setScenarioType(e.target.value as DecisionType);
                  setHasSimulated(true);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-accent-lime transition-colors"
              >
                <option value="discretionary_expense" className="bg-zinc-900">Discretionary Purchase (Food, Outing, Gear)</option>
                <option value="unexpected_emergency" className="bg-zinc-900">Unexpected Emergency (Medical, Repair)</option>
                <option value="savings_allocation" className="bg-zinc-900">Allocate Funds to Savings Goal</option>
                <option value="savings_withdrawal" className="bg-zinc-900">Withdraw from Savings Goal</option>
                <option value="cancel_subscription" className="bg-zinc-900">Cancel Upcoming Subscription</option>
                <option value="pay_bill_early" className="bg-zinc-900">Pay Upcoming Bill Early</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Description / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setHasSimulated(true);
                }}
                placeholder="e.g. Shopping, Dinner with gang"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-accent-lime transition-colors"
              />
            </div>

            {scenarioType !== 'cancel_subscription' && scenarioType !== 'pay_bill_early' && (
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={amountStr}
                    onChange={(e) => {
                      setAmountStr(e.target.value);
                      setHasSimulated(true);
                    }}
                    placeholder="0"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-3 py-2 text-sm text-zinc-100 font-mono tabular-nums focus:outline-none focus:border-accent-lime transition-colors"
                  />
                </div>
              </div>
            )}

            {(scenarioType === 'savings_allocation' || scenarioType === 'savings_withdrawal') && (
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Target Savings Goal
                </label>
                <select
                  value={targetId || finance.savingsGoals[0]?.id || ''}
                  onChange={(e) => {
                    setTargetId(e.target.value);
                    setHasSimulated(true);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-accent-lime transition-colors"
                >
                  {finance.savingsGoals.map((g) => (
                    <option key={g.id} value={g.id} className="bg-zinc-900">
                      {g.name} (Saved: {formatINR(g.currentAmount)} / {formatINR(g.targetAmount)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(scenarioType === 'cancel_subscription' || scenarioType === 'pay_bill_early') && (
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Select Bill / Subscription
                </label>
                <select
                  value={targetId || finance.commitments.find((c) => c.status === 'reserved')?.id || ''}
                  onChange={(e) => {
                    setTargetId(e.target.value);
                    const comm = finance.commitments.find((c) => c.id === e.target.value);
                    if (comm) {
                      setAmountStr(comm.amount.toString());
                      setTitle(scenarioType === 'cancel_subscription' ? `Cancel ${comm.title}` : `Pay ${comm.title}`);
                    }
                    setHasSimulated(true);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-accent-lime transition-colors"
                >
                  {finance.commitments
                    .filter((c) => c.status === 'reserved')
                    .map((c) => (
                      <option key={c.id} value={c.id} className="bg-zinc-900">
                        {c.title} — {formatINR(c.amount)} (Due {c.dueDateLabel})
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Preview updates automatically as you type</span>
              <button
                type="button"
                onClick={handleDiscard}
                className="text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        </Card>

        {/* Right Col: Simulation Results & Before/After Comparison */}
        <div className="lg:col-span-7 space-y-4">
          {simulationResult ? (
            <>
              {/* Verdict Alert Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  simulationResult.riskLevel === 'danger'
                    ? 'bg-red-500/10 border-red-500/30'
                    : simulationResult.riskLevel === 'caution'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-emerald-500/10 border-emerald-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {simulationResult.riskLevel === 'danger' ? (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    ) : simulationResult.riskLevel === 'caution' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-accent-lime shrink-0" />
                    )}
                    <div>
                      <h4
                        className={`text-sm font-bold font-sans ${
                          simulationResult.riskLevel === 'danger'
                            ? 'text-red-400'
                            : simulationResult.riskLevel === 'caution'
                            ? 'text-amber-400'
                            : 'text-accent-lime'
                        }`}
                      >
                        {simulationResult.verdictTitle}
                      </h4>
                      <p className="text-xs text-zinc-300 mt-0.5">
                        {simulationResult.verdictDescription}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={
                      simulationResult.riskLevel === 'danger'
                        ? 'danger'
                        : simulationResult.riskLevel === 'caution'
                        ? 'warning'
                        : 'lime'
                    }
                    size="sm"
                  >
                    {simulationResult.riskLevel}
                  </Badge>
                </div>

                {/* Consequences / Observations */}
                <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 text-xs text-zinc-300 font-mono">
                  {simulationResult.consequences.map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-zinc-400">•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side-by-Side Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Available Balance Comparison */}
                <Card variant="subtle" className="p-3.5 flex flex-col justify-between">
                  <div className="text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Safe Available Balance
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-zinc-400 font-mono">Before</div>
                      <div className="text-base font-bold text-zinc-300 font-mono tabular-nums">
                        {formatINR(simulationResult.before.availableBalance)}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 shrink-0" />
                    <div className="text-right">
                      <div className="text-xs text-zinc-400 font-mono">Simulated</div>
                      <div
                        className={`text-base font-bold font-mono tabular-nums ${
                          simulationResult.after.availableBalance < 0
                            ? 'text-red-400'
                            : 'text-accent-lime'
                        }`}
                      >
                        {formatINR(simulationResult.after.availableBalance)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-zinc-400 border-t border-zinc-800 pt-1.5 flex justify-between">
                    <span>Net Change:</span>
                    <span
                      className={`font-semibold tabular-nums ${
                        simulationResult.diff.availableBalance < 0
                          ? 'text-red-400'
                          : simulationResult.diff.availableBalance > 0
                          ? 'text-emerald-400'
                          : 'text-zinc-400'
                      }`}
                    >
                      {simulationResult.diff.availableBalance >= 0 ? '+' : ''}
                      {formatINR(simulationResult.diff.availableBalance)}
                    </span>
                  </div>
                </Card>

                {/* Safe Daily Allowance Comparison */}
                <Card variant="subtle" className="p-3.5 flex flex-col justify-between">
                  <div className="text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Safe Daily Allowance
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-zinc-400 font-mono">Before</div>
                      <div className="text-base font-bold text-zinc-300 font-mono tabular-nums">
                        {formatINR(simulationResult.before.dailySafeAllowance)}/d
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 shrink-0" />
                    <div className="text-right">
                      <div className="text-xs text-zinc-400 font-mono">Simulated</div>
                      <div
                        className={`text-base font-bold font-mono tabular-nums ${
                          simulationResult.after.dailySafeAllowance < 100
                            ? 'text-amber-400'
                            : 'text-accent-lime'
                        }`}
                      >
                        {formatINR(simulationResult.after.dailySafeAllowance)}/d
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-zinc-400 border-t border-zinc-800 pt-1.5 flex justify-between">
                    <span>Daily Impact:</span>
                    <span
                      className={`font-semibold tabular-nums ${
                        simulationResult.diff.dailySafeAllowance < 0
                          ? 'text-amber-400'
                          : simulationResult.diff.dailySafeAllowance > 0
                          ? 'text-emerald-400'
                          : 'text-zinc-400'
                      }`}
                    >
                      {simulationResult.diff.dailySafeAllowance >= 0 ? '+' : ''}
                      {formatINR(simulationResult.diff.dailySafeAllowance)}/d
                    </span>
                  </div>
                </Card>

                {/* Reserved Commitments Comparison */}
                <Card variant="subtle" className="p-3.5 flex flex-col justify-between">
                  <div className="text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Reserved Bills Pool
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-zinc-400 font-mono">Before</div>
                      <div className="text-sm font-bold text-zinc-300 font-mono tabular-nums">
                        {formatINR(simulationResult.before.reservedCommitments)}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 shrink-0" />
                    <div className="text-right">
                      <div className="text-xs text-zinc-400 font-mono">Simulated</div>
                      <div className="text-sm font-bold text-zinc-100 font-mono tabular-nums">
                        {formatINR(simulationResult.after.reservedCommitments)}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Savings Cushion Comparison */}
                <Card variant="subtle" className="p-3.5 flex flex-col justify-between">
                  <div className="text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Locked Savings Cushion
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-zinc-400 font-mono">Before</div>
                      <div className="text-sm font-bold text-zinc-300 font-mono tabular-nums">
                        {formatINR(simulationResult.before.savingsLocked)}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 shrink-0" />
                    <div className="text-right">
                      <div className="text-xs text-zinc-400 font-mono">Simulated</div>
                      <div className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                        {formatINR(simulationResult.after.savingsLocked)}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Projected Month-End Net Balance Comparison */}
                <Card variant="subtle" className="p-3.5 flex flex-col justify-between sm:col-span-2">
                  <div className="text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Projected Month-End Net Balance
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-zinc-400 font-mono">Before</div>
                      <div className="text-sm sm:text-base font-bold text-zinc-300 font-mono tabular-nums">
                        {simulationResult.before.projectedMonthEndBalance > 0 ? '+' : ''}
                        {formatINR(simulationResult.before.projectedMonthEndBalance)}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 shrink-0" />
                    <div className="text-right">
                      <div className="text-xs text-zinc-400 font-mono">Simulated</div>
                      <div
                        className={`text-sm sm:text-base font-bold font-mono tabular-nums ${
                          simulationResult.after.projectedMonthEndBalance < 0
                            ? 'text-red-400'
                            : 'text-accent-lime'
                        }`}
                      >
                        {simulationResult.after.projectedMonthEndBalance > 0 ? '+' : ''}
                        {formatINR(simulationResult.after.projectedMonthEndBalance)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-zinc-400 border-t border-zinc-800 pt-1.5 flex justify-between">
                    <span>Net Runway Impact:</span>
                    <span
                      className={`font-semibold tabular-nums ${
                        simulationResult.diff.projectedMonthEnd < 0
                          ? 'text-red-400'
                          : simulationResult.diff.projectedMonthEnd > 0
                          ? 'text-emerald-400'
                          : 'text-zinc-400'
                      }`}
                    >
                      {simulationResult.diff.projectedMonthEnd >= 0 ? '+' : ''}
                      {formatINR(simulationResult.diff.projectedMonthEnd)}
                    </span>
                  </div>
                </Card>
              </div>

              {/* Action Bar */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-zinc-400 font-mono text-center sm:text-left">
                  Ready to make this real? Applying will record this change in your active ledger.
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDiscard}
                    className="w-full sm:w-auto justify-center"
                  >
                    Discard
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleApplyDecision}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    disabled={simulationResult.hasShortfall}
                    className="w-full sm:w-auto justify-center"
                  >
                    Apply Decision to Ledger
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <Card variant="default" className="text-center py-12">
              <Compass className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-xs font-mono text-zinc-400">
                Configure a scenario on the left or select a preset to generate a live sandbox forecast.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
