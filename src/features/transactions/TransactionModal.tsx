import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { CATEGORIES } from '../../data/categories';
import type { Transaction, TransactionCategory, PaymentMethod, TransactionType } from '../../types/transaction';
import { formatINR } from '../../lib/currency';

export interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    paymentMethod: PaymentMethod;
    merchant?: string;
    description?: string;
    day?: number;
  }) => boolean;
  initialData?: Transaction | null;
  currentDay: number;
  totalDays: number;
  availableBalance: number;
}

interface FormInnerProps {
  initialData?: Transaction | null;
  currentDay: number;
  totalDays: number;
  availableBalance: number;
  onSave: TransactionModalProps['onSave'];
  onClose: () => void;
}

const TransactionFormInner: React.FC<FormInnerProps> = ({
  initialData,
  currentDay,
  totalDays,
  availableBalance,
  onSave,
  onClose,
}) => {
  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
  const [title, setTitle] = useState(initialData?.title || '');
  const [amountStr, setAmountStr] = useState(initialData?.amount ? initialData.amount.toString() : '');
  const [category, setCategory] = useState<TransactionCategory>(
    initialData?.category || (initialData?.type === 'income' ? 'income_deposit' : 'food_dining')
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialData?.paymentMethod || 'UPI (GPay)');
  const [merchant, setMerchant] = useState(initialData?.merchant || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [day, setDay] = useState<number>(initialData?.day || currentDay);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanAmount = parseFloat(amountStr);

    if (!cleanTitle) {
      setValidationError('Please enter a transaction title or description.');
      return;
    }

    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      setValidationError('Please enter a valid amount greater than ₹0.');
      return;
    }

    const success = onSave({
      title: cleanTitle,
      amount: cleanAmount,
      type,
      category: type === 'income' ? 'income_deposit' : category,
      paymentMethod,
      merchant: merchant.trim() || undefined,
      description: description.trim() || undefined,
      day,
    });

    if (success) {
      onClose();
    }
  };

  const parsedAmount = parseFloat(amountStr);
  const isOverBudget = type === 'expense' && !isNaN(parsedAmount) && parsedAmount > availableBalance;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle: Expense vs Income */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
        <button
          type="button"
          onClick={() => {
            setType('expense');
            if (category === 'income_deposit') setCategory('food_dining');
          }}
          className={`py-1.5 px-3 rounded text-xs font-semibold transition-colors cursor-pointer ${
            type === 'expense'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Expense (-)
        </button>
        <button
          type="button"
          onClick={() => {
            setType('income');
            setCategory('income_deposit');
          }}
          className={`py-1.5 px-3 rounded text-xs font-semibold transition-colors cursor-pointer ${
            type === 'income'
              ? 'bg-accent-lime text-zinc-950 font-bold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Income / Deposit (+)
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1">
          {type === 'income' ? 'Income Source / Title' : 'What did you buy?'} <span className="text-accent-lime">*</span>
        </label>
        <input
          type="text"
          required
          placeholder={type === 'income' ? 'e.g. Freelance stipend, Parent allowance' : 'e.g. Tapri Chai, Blinkit pantry'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-accent-lime transition-colors"
        />
      </div>

      {/* Amount & Day */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-accent-lime font-mono tabular-nums transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Day of Month (1 - {totalDays})
          </label>
          <input
            type="number"
            min="1"
            max={totalDays}
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value) || currentDay)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 font-mono tabular-nums focus:outline-none focus:border-accent-lime transition-colors"
          />
        </div>
      </div>

      {/* Category (if expense) */}
      {type === 'expense' && (
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
                  {meta.name} ({meta.description.slice(0, 32)}...)
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Payment Method */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-accent-lime transition-colors"
          >
            <option value="UPI (GPay)" className="bg-zinc-900 text-zinc-100">UPI (GPay)</option>
            <option value="UPI (PhonePe)" className="bg-zinc-900 text-zinc-100">UPI (PhonePe)</option>
            <option value="UPI (Paytm)" className="bg-zinc-900 text-zinc-100">UPI (Paytm)</option>
            <option value="Debit Card" className="bg-zinc-900 text-zinc-100">Debit Card</option>
            <option value="Bank Transfer" className="bg-zinc-900 text-zinc-100">Bank Transfer</option>
            <option value="Cash" className="bg-zinc-900 text-zinc-100">Cash</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Merchant / Payee (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Local Kirana, Rapido"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-accent-lime transition-colors"
          />
        </div>
      </div>

      {/* Optional Description / Notes */}
      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1">
          Notes / Details (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g. Split with roomie, monthly recharge"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-accent-lime transition-colors"
        />
      </div>

      {/* Validation warnings */}
      {validationError && (
        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {isOverBudget && (
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Warning: This purchase of {formatINR(parsedAmount)} exceeds your current safe available balance of {formatINR(availableBalance)}. Logging this will create a deficit.
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 border-t border-zinc-800 flex items-center justify-end gap-2.5">
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm">
          {initialData ? 'Save Changes' : type === 'income' ? 'Record Income' : 'Record Expense'}
        </Button>
      </div>
    </form>
  );
};

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  currentDay,
  totalDays,
  availableBalance,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Transaction' : 'Record Transaction'}
      subtitle={
        initialData
          ? 'Modify posted ledger record'
          : 'Log an immediate expense or incoming stipend/allowance'
      }
      maxWidth="md"
    >
      <TransactionFormInner
        key={initialData?.id || (isOpen ? 'new' : 'closed')}
        initialData={initialData}
        currentDay={currentDay}
        totalDays={totalDays}
        availableBalance={availableBalance}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
};
