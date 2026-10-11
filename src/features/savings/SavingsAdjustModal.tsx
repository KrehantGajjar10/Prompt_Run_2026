import React, { useState } from 'react';
import { AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import type { SavingsGoal } from '../../types/savings';
import { formatINR } from '../../lib/currency';

export interface SavingsAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal | null;
  availableBalance: number;
  onDeposit: (goalId: string, amount: number) => boolean;
  onWithdraw: (goalId: string, amount: number) => boolean;
}

export const SavingsAdjustModal: React.FC<SavingsAdjustModalProps> = ({
  isOpen,
  onClose,
  goal,
  availableBalance,
  onDeposit,
  onWithdraw,
}) => {
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [amountStr, setAmountStr] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount <= 0) {
      setValidationError('Please enter a valid amount greater than ₹0.');
      return;
    }

    if (mode === 'deposit') {
      if (amount > availableBalance) {
        setValidationError(`Cannot deposit ${formatINR(amount)}. You only have ${formatINR(availableBalance)} available to spend.`);
        return;
      }
      const success = onDeposit(goal.id, amount);
      if (success) onClose();
    } else {
      if (amount > goal.currentAmount) {
        setValidationError(`Cannot withdraw ${formatINR(amount)}. This goal only has ${formatINR(goal.currentAmount)} saved.`);
        return;
      }
      const success = onWithdraw(goal.id, amount);
      if (success) onClose();
    }
  };

  const remainingToTarget = Math.max(0, goal.targetAmount - goal.currentAmount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${mode === 'deposit' ? 'Deposit into' : 'Withdraw from'} ${goal.name}`}
      subtitle={`Currently saved: ${formatINR(goal.currentAmount)} of ${formatINR(goal.targetAmount)} target`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setMode('deposit');
              setValidationError(null);
            }}
            className={`py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              mode === 'deposit'
                ? 'bg-accent-lime text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Deposit
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('withdraw');
              setValidationError(null);
            }}
            className={`py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              mode === 'withdraw'
                ? 'bg-zinc-800 text-zinc-100 font-bold shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Withdraw
          </button>
        </div>

        {/* Input Amount */}
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Transfer Amount (₹)</span>
            <span>
              {mode === 'deposit'
                ? `Available: ${formatINR(availableBalance)}`
                : `In goal: ${formatINR(goal.currentAmount)}`}
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">
              ₹
            </span>
            <input
              type="number"
              step="any"
              min="1"
              required
              placeholder="0"
              value={amountStr}
              onChange={(e) => {
                setAmountStr(e.target.value);
                if (validationError) setValidationError(null);
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-accent-lime font-mono tabular-nums transition-colors"
            />
          </div>
        </div>

        {/* Quick Amount Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-zinc-400">Quick:</span>
          {mode === 'deposit' ? (
            <>
              <button
                type="button"
                onClick={() => setAmountStr('100')}
                className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer"
              >
                ₹100
              </button>
              <button
                type="button"
                onClick={() => setAmountStr('250')}
                className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer"
              >
                ₹250
              </button>
              {remainingToTarget > 0 && remainingToTarget <= availableBalance && (
                <button
                  type="button"
                  onClick={() => setAmountStr(remainingToTarget.toString())}
                  className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-accent-lime border border-zinc-700 cursor-pointer"
                >
                  Fill Goal (₹{remainingToTarget})
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setAmountStr('100')}
                className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer"
              >
                ₹100
              </button>
              <button
                type="button"
                onClick={() => setAmountStr(goal.currentAmount.toString())}
                className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer"
              >
                All (₹{goal.currentAmount})
              </button>
            </>
          )}
        </div>

        {/* Consequence note */}
        <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-400">
          {mode === 'deposit' ? (
            <span>
              Moving funds into this goal locks them safely from daily spending, reducing your safe daily allowance accordingly.
            </span>
          ) : (
            <span>
              Withdrawing money releases it back into your discretionary pool, increasing your daily safe-to-spend allowance immediately.
            </span>
          )}
        </div>

        {validationError && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-zinc-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto justify-center"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="w-full sm:w-auto justify-center"
          >
            {mode === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
