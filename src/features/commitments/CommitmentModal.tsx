import React, { useState } from 'react';
import { AlertCircle, Lock } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { CATEGORIES } from '../../data/categories';
import type { UpcomingCommitment } from '../../types/commitment';
import type { TransactionCategory } from '../../types/transaction';

export interface CommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    provider: string;
    amount: number;
    category: TransactionCategory;
    dueDay: number;
    dueDateLabel?: string;
    autoDebit?: boolean;
    isSubscription?: boolean;
    notes?: string;
  }) => boolean;
  initialData?: UpcomingCommitment | null;
  currentDay: number;
  totalDays: number;
}

interface CommitmentFormInnerProps {
  initialData?: UpcomingCommitment | null;
  currentDay: number;
  totalDays: number;
  onSave: CommitmentModalProps['onSave'];
  onClose: () => void;
}

const CommitmentFormInner: React.FC<CommitmentFormInnerProps> = ({
  initialData,
  currentDay,
  totalDays,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [provider, setProvider] = useState(initialData?.provider || '');
  const [amountStr, setAmountStr] = useState(initialData?.amount ? initialData.amount.toString() : '');
  const [category, setCategory] = useState<TransactionCategory>(initialData?.category || 'utilities_bills');
  const [dueDay, setDueDay] = useState<number>(initialData?.dueDay || Math.min(currentDay + 5, totalDays));
  const [isSubscription, setIsSubscription] = useState(initialData ? Boolean(initialData.isSubscription) : true);
  const [autoDebit, setAutoDebit] = useState(initialData ? Boolean(initialData.autoDebit) : false);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanProvider = provider.trim();
    const cleanAmount = parseFloat(amountStr);

    if (!cleanTitle) {
      setValidationError('Please enter a bill or subscription name.');
      return;
    }

    if (!cleanProvider) {
      setValidationError('Please specify the service provider or payee.');
      return;
    }

    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      setValidationError('Please enter a valid amount greater than ₹0.');
      return;
    }

    const success = onSave({
      title: cleanTitle,
      provider: cleanProvider,
      amount: cleanAmount,
      category,
      dueDay,
      autoDebit,
      isSubscription,
      notes: notes.trim() || undefined,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1">
          Bill / Subscription Name <span className="text-accent-lime">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Airtel 5G Prepaid, Room Broadband Split"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-accent-lime transition-colors"
        />
      </div>

      {/* Provider & Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Provider / Creditor <span className="text-accent-lime">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Airtel, ACT Fibernet, Landlord"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-accent-lime transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Amount (₹) <span className="text-accent-lime">*</span>
          </label>
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
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-accent-lime font-mono tabular-nums transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Category & Due Day */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TransactionCategory)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-accent-lime transition-colors"
          >
            {Object.entries(CATEGORIES)
              .filter(([catId]) => catId !== 'income_deposit')
              .map(([catId, meta]) => (
                <option key={catId} value={catId} className="bg-zinc-900 text-zinc-100">
                  {meta.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Due on Day (1 - {totalDays})
          </label>
          <input
            type="number"
            min="1"
            max={totalDays}
            value={dueDay}
            onChange={(e) => setDueDay(parseInt(e.target.value) || currentDay)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 font-mono tabular-nums focus:outline-none focus:border-accent-lime transition-colors"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <label className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isSubscription}
            onChange={(e) => setIsSubscription(e.target.checked)}
            className="rounded accent-accent-lime"
          />
          <span>Recurring monthly subscription</span>
        </label>

        <label className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={autoDebit}
            onChange={(e) => setAutoDebit(e.target.checked)}
            className="rounded accent-accent-lime"
          />
          <span>Auto-debit mandate enabled</span>
        </label>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1">
          Notes / Split details (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g. Split with 2 roommates via GPay"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-accent-lime transition-colors"
        />
      </div>

      {/* Accounting explanation */}
      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2">
        <Lock className="w-4 h-4 text-accent-lime shrink-0 mt-0.5" />
        <span>
          Saving this reserves ₹{amountStr || '0'} from your safe daily allowance pool immediately. Marking it paid later converts it to recorded spending without double-deduction.
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
          {initialData ? 'Save Changes' : 'Reserve & Save Bill'}
        </Button>
      </div>
    </form>
  );
};

export const CommitmentModal: React.FC<CommitmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  currentDay,
  totalDays,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Commitment' : 'Add Upcoming Bill / Subscription'}
      subtitle="Reserved commitments wall off money in your budget so you never default."
      maxWidth="md"
    >
      <CommitmentFormInner
        key={initialData?.id || (isOpen ? 'new' : 'closed')}
        initialData={initialData}
        currentDay={currentDay}
        totalDays={totalDays}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
};
