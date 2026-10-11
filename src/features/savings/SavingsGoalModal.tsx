import React, { useState } from 'react';
import { AlertCircle, PiggyBank } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import type { SavingsGoal, SavingsPriority } from '../../types/savings';
import { formatINR } from '../../lib/currency';

export interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    targetAmount: number;
    initialDeposit?: number;
    category: string;
    priority: SavingsPriority;
    notes?: string;
  }) => boolean;
  initialData?: SavingsGoal | null;
  availableBalance: number;
}

interface SavingsGoalFormInnerProps {
  initialData?: SavingsGoal | null;
  availableBalance: number;
  onSave: SavingsGoalModalProps['onSave'];
  onClose: () => void;
}

const SavingsGoalFormInner: React.FC<SavingsGoalFormInnerProps> = ({
  initialData,
  availableBalance,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [targetAmountStr, setTargetAmountStr] = useState(initialData?.targetAmount ? initialData.targetAmount.toString() : '');
  const [initialDepositStr, setInitialDepositStr] = useState('0');
  const [category, setCategory] = useState(initialData?.category || 'Emergency Cushion');
  const [priority, setPriority] = useState<SavingsPriority>(initialData?.priority || 'essential');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const targetAmount = parseFloat(targetAmountStr);
    const initialDeposit = parseFloat(initialDepositStr) || 0;

    if (!cleanName) {
      setValidationError('Please enter a goal name.');
      return;
    }

    if (isNaN(targetAmount) || targetAmount <= 0) {
      setValidationError('Please enter a target amount greater than ₹0.');
      return;
    }

    if (!initialData && initialDeposit > availableBalance) {
      setValidationError(`Initial deposit (${formatINR(initialDeposit)}) cannot exceed your current available balance (${formatINR(availableBalance)}).`);
      return;
    }

    const success = onSave({
      name: cleanName,
      targetAmount,
      initialDeposit,
      category: category.trim() || 'General Savings',
      priority,
      notes: notes.trim() || undefined,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Goal Name */}
      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1">
          Goal Name <span className="text-accent-lime">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Month-End Buffer, Diwali Train Ticket"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-accent-lime transition-colors"
        />
      </div>

      {/* Target Amount & Initial Deposit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Target Amount (₹) <span className="text-accent-lime">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">
              ₹
            </span>
            <input
              type="number"
              min="1"
              required
              placeholder="1000"
              value={targetAmountStr}
              onChange={(e) => setTargetAmountStr(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-accent-lime font-mono tabular-nums transition-colors"
            />
          </div>
        </div>

        {!initialData && (
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Initial Deposit (Max {formatINR(availableBalance)})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                max={availableBalance}
                placeholder="0"
                value={initialDepositStr}
                onChange={(e) => setInitialDepositStr(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-accent-lime font-mono tabular-nums transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* Priority & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as SavingsPriority)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-accent-lime transition-colors"
          >
            <option value="essential" className="bg-zinc-900 text-zinc-100">Essential (Must Protect)</option>
            <option value="goal" className="bg-zinc-900 text-zinc-100">Goal (Planned Target)</option>
            <option value="wishlist" className="bg-zinc-900 text-zinc-100">Wishlist (If Leftover)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Category Tag
          </label>
          <input
            type="text"
            placeholder="e.g. Emergency, Travel, Gadgets"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-accent-lime transition-colors"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1">
          Notes / Milestones (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g. Safety net in case medical issue arises"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-accent-lime transition-colors"
        />
      </div>

      {/* Accounting Rule Clarification */}
      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2">
        <PiggyBank className="w-4 h-4 text-accent-lime shrink-0 mt-0.5" />
        <span>
          Money in savings goals belongs to you. It is shielded from your daily discretionary quota so you do not spend it on casual takeout, but can be withdrawn if needed.
        </span>
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
          {initialData ? 'Save Changes' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
};

export const SavingsGoalModal: React.FC<SavingsGoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  availableBalance,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Savings Goal' : 'Create Savings Goal'}
      subtitle="Savings are ring-fenced from daily spending, keeping your money safe."
      maxWidth="md"
    >
      <SavingsGoalFormInner
        key={initialData?.id || (isOpen ? 'new' : 'closed')}
        initialData={initialData}
        availableBalance={availableBalance}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
};
