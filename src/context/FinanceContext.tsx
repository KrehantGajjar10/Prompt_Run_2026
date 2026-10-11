import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FinanceContext } from './financeContextDef';
import {
  loadStoredFinanceState,
  saveStoredFinanceState,
  resetStoredFinanceState,
  createInitialDefaultState,
  type StoredFinanceState,
} from '../lib/storage';
import {
  calculateFinancialSummary,
  calculateCategoryBreakdown,
  type CategorySpendingSummary,
} from '../lib/calculations';
import type { FinancialSummary } from '../types/budget';
import type { Transaction, TransactionCategory, PaymentMethod, TransactionType } from '../types/transaction';
import type { UpcomingCommitment } from '../types/commitment';
import type { SavingsGoal, SavingsPriority } from '../types/savings';

export interface FinanceContextType {
  // State
  startingBudget: number;
  additionalIncome: number;
  totalDays: number;
  currentDay: number;
  transactions: Transaction[];
  commitments: UpcomingCommitment[];
  savingsGoals: SavingsGoal[];
  summary: FinancialSummary;
  categoryBreakdown: CategorySpendingSummary[];

  // Transaction Actions
  addTransaction: (data: {
    title: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    paymentMethod: PaymentMethod;
    merchant?: string;
    description?: string;
    day?: number;
  }) => boolean;
  editTransaction: (id: string, updates: Partial<Transaction>) => boolean;
  deleteTransaction: (id: string) => void;

  // Commitment Actions
  addCommitment: (data: {
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
  editCommitment: (id: string, updates: Partial<UpcomingCommitment>) => boolean;
  payCommitment: (id: string) => boolean;
  cancelCommitment: (id: string) => boolean;
  deleteCommitment: (id: string) => void;

  // Savings Goal Actions
  addSavingsGoal: (data: {
    name: string;
    targetAmount: number;
    initialDeposit?: number;
    category: string;
    priority: SavingsPriority;
    notes?: string;
  }) => boolean;
  editSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => boolean;
  depositToGoal: (id: string, amount: number) => boolean;
  withdrawFromGoal: (id: string, amount: number) => boolean;
  deleteSavingsGoal: (id: string) => void;

  // Simulation / Demo Controls
  setCurrentDay: (day: number) => void;
  resetToDemoData: () => void;
  clearToFreshStart: () => void;
}

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoredFinanceState>(() => loadStoredFinanceState());

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveStoredFinanceState(state);
  }, [state]);

  // Derived financial summary using centralized pure function
  const summary = useMemo(() => {
    return calculateFinancialSummary({
      startingBudget: state.startingBudget,
      additionalIncome: state.additionalIncome,
      totalDays: state.totalDays,
      currentDay: state.currentDay,
      transactions: state.transactions,
      commitments: state.commitments,
      savingsGoals: state.savingsGoals,
    });
  }, [state]);

  // Derived category breakdown
  const categoryBreakdown = useMemo(() => {
    return calculateCategoryBreakdown(state.transactions);
  }, [state.transactions]);

  // ---------------------------------------------------------
  // Transaction Handlers
  // ---------------------------------------------------------
  const addTransaction = useCallback(
    (data: {
      title: string;
      amount: number;
      type: TransactionType;
      category: TransactionCategory;
      paymentMethod: PaymentMethod;
      merchant?: string;
      description?: string;
      day?: number;
    }) => {
      if (!data.title.trim() || data.amount <= 0 || isNaN(data.amount)) {
        return false;
      }

      const txDay = data.day && data.day >= 1 && data.day <= state.totalDays ? data.day : state.currentDay;
      const newTx: Transaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: data.title.trim(),
        amount: Math.round(data.amount),
        type: data.type,
        category: data.category,
        day: txDay,
        date: `Oct ${txDay}`,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: data.paymentMethod,
        merchant: data.merchant?.trim(),
        description: data.description?.trim(),
      };

      setState((prev) => ({
        ...prev,
        transactions: [newTx, ...prev.transactions],
      }));
      return true;
    },
    [state.currentDay, state.totalDays]
  );

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates, amount: updates.amount !== undefined ? Math.round(Math.max(0, updates.amount)) : tx.amount } : tx
      ),
    }));
    return true;
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setState((prev) => {
      const target = prev.transactions.find((tx) => tx.id === id);
      const remaining = prev.transactions.filter((tx) => tx.id !== id);

      // If this transaction was linked to a paid commitment, restore commitment to reserved status
      let updatedCommitments = prev.commitments;
      if (target?.relatedCommitmentId) {
        updatedCommitments = prev.commitments.map((c) =>
          c.id === target.relatedCommitmentId
            ? { ...c, status: 'reserved' as const, isReserved: true, paidTransactionId: undefined }
            : c
        );
      }

      return {
        ...prev,
        transactions: remaining,
        commitments: updatedCommitments,
      };
    });
  }, []);

  // ---------------------------------------------------------
  // Commitment Handlers
  // ---------------------------------------------------------
  const addCommitment = useCallback(
    (data: {
      title: string;
      provider: string;
      amount: number;
      category: TransactionCategory;
      dueDay: number;
      dueDateLabel?: string;
      autoDebit?: boolean;
      isSubscription?: boolean;
      notes?: string;
    }) => {
      if (!data.title.trim() || data.amount <= 0 || isNaN(data.amount)) {
        return false;
      }

      const dueDay = Math.min(Math.max(1, data.dueDay), state.totalDays);
      const daysUntil = dueDay - state.currentDay;
      const label =
        data.dueDateLabel ||
        `Oct ${dueDay} · ${daysUntil > 0 ? `in ${daysUntil} days` : 'Due today'}`;

      const newCommitment: UpcomingCommitment = {
        id: `com-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: data.title.trim(),
        provider: data.provider.trim() || 'Service Provider',
        amount: Math.round(data.amount),
        category: data.category,
        dueDay,
        dueDateLabel: label,
        isReserved: true,
        status: 'reserved',
        autoDebit: Boolean(data.autoDebit),
        isSubscription: Boolean(data.isSubscription),
        notes: data.notes?.trim(),
      };

      setState((prev) => ({
        ...prev,
        commitments: [...prev.commitments, newCommitment].sort((a, b) => a.dueDay - b.dueDay),
      }));
      return true;
    },
    [state.currentDay, state.totalDays]
  );

  const editCommitment = useCallback((id: string, updates: Partial<UpcomingCommitment>) => {
    setState((prev) => ({
      ...prev,
      commitments: prev.commitments.map((c) =>
        c.id === id ? { ...c, ...updates, amount: updates.amount !== undefined ? Math.round(Math.max(0, updates.amount)) : c.amount } : c
      ),
    }));
    return true;
  }, []);

  const payCommitment = useCallback(
    (id: string) => {
      const commitment = state.commitments.find((c) => c.id === id);
      if (!commitment || commitment.status !== 'reserved') {
        return false;
      }

      const txId = `tx-paid-${Date.now()}`;
      const paymentTx: Transaction = {
        id: txId,
        title: `Bill Paid: ${commitment.title}`,
        amount: commitment.amount,
        type: 'expense',
        category: commitment.category,
        day: state.currentDay,
        date: `Oct ${state.currentDay}`,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: commitment.autoDebit ? 'UPI (PhonePe)' : 'UPI (GPay)',
        merchant: commitment.provider,
        relatedCommitmentId: commitment.id,
      };

      setState((prev) => ({
        ...prev,
        commitments: prev.commitments.map((c) =>
          c.id === id
            ? {
                ...c,
                status: 'paid' as const,
                isReserved: false,
                paidAtDay: prev.currentDay,
                paidTransactionId: txId,
              }
            : c
        ),
        transactions: [paymentTx, ...prev.transactions],
      }));

      return true;
    },
    [state.commitments, state.currentDay]
  );

  const cancelCommitment = useCallback((id: string) => {
    const commitment = state.commitments.find((c) => c.id === id);
    if (!commitment || commitment.status !== 'reserved') {
      return false;
    }

    setState((prev) => ({
      ...prev,
      commitments: prev.commitments.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'cancelled' as const,
              isReserved: false,
              cancelledAtDay: prev.currentDay,
            }
          : c
      ),
    }));
    return true;
  }, [state.commitments]);

  const deleteCommitment = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      commitments: prev.commitments.filter((c) => c.id !== id),
    }));
  }, []);

  // ---------------------------------------------------------
  // Savings Goal Handlers
  // ---------------------------------------------------------
  const addSavingsGoal = useCallback(
    (data: {
      name: string;
      targetAmount: number;
      initialDeposit?: number;
      category: string;
      priority: SavingsPriority;
      notes?: string;
    }) => {
      if (!data.name.trim() || data.targetAmount <= 0) {
        return false;
      }

      const initialDeposit = Math.round(Math.max(0, data.initialDeposit || 0));
      // Ensure initial deposit does not exceed available balance
      const maxAllowed = summary.availableBalance;
      const safeDeposit = Math.min(initialDeposit, maxAllowed);

      const newGoal: SavingsGoal = {
        id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: data.name.trim(),
        targetAmount: Math.round(data.targetAmount),
        currentAmount: safeDeposit,
        category: data.category.trim() || 'General Cushion',
        priority: data.priority,
        isLocked: true,
        notes: data.notes?.trim() || 'Target end of month',
        targetDay: state.totalDays,
      };

      setState((prev) => ({
        ...prev,
        savingsGoals: [...prev.savingsGoals, newGoal],
      }));
      return true;
    },
    [state.totalDays, summary.availableBalance]
  );

  const editSavingsGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    setState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map((g) =>
        g.id === id
          ? {
              ...g,
              ...updates,
              targetAmount: updates.targetAmount !== undefined ? Math.round(Math.max(0, updates.targetAmount)) : g.targetAmount,
            }
          : g
      ),
    }));
    return true;
  }, []);

  const depositToGoal = useCallback(
    (id: string, amount: number) => {
      const goal = state.savingsGoals.find((g) => g.id === id);
      if (!goal || amount <= 0) return false;

      // Cannot deposit more than current safe available balance
      if (amount > summary.availableBalance) {
        return false;
      }

      setState((prev) => ({
        ...prev,
        savingsGoals: prev.savingsGoals.map((g) =>
          g.id === id ? { ...g, currentAmount: g.currentAmount + Math.round(amount) } : g
        ),
      }));
      return true;
    },
    [state.savingsGoals, summary.availableBalance]
  );

  const withdrawFromGoal = useCallback(
    (id: string, amount: number) => {
      const goal = state.savingsGoals.find((g) => g.id === id);
      if (!goal || amount <= 0 || amount > goal.currentAmount) return false;

      setState((prev) => ({
        ...prev,
        savingsGoals: prev.savingsGoals.map((g) =>
          g.id === id ? { ...g, currentAmount: Math.max(0, g.currentAmount - Math.round(amount)) } : g
        ),
      }));
      return true;
    },
    [state.savingsGoals]
  );

  const deleteSavingsGoal = useCallback((id: string) => {
    // When a goal is deleted, its funds are automatically unlocked back to discretionary available balance!
    setState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter((g) => g.id !== id),
    }));
  }, []);

  // ---------------------------------------------------------
  // Simulation Controls
  // ---------------------------------------------------------
  const setCurrentDay = useCallback((day: number) => {
    setState((prev) => ({
      ...prev,
      currentDay: Math.min(Math.max(1, day), prev.totalDays),
    }));
  }, []);

  const resetToDemoData = useCallback(() => {
    const fresh = resetStoredFinanceState();
    setState(fresh);
  }, []);

  const clearToFreshStart = useCallback(() => {
    const fresh = createInitialDefaultState();
    fresh.transactions = [];
    fresh.savingsGoals = fresh.savingsGoals.map((g) => ({ ...g, currentAmount: 0 }));
    saveStoredFinanceState(fresh);
    setState(fresh);
  }, []);

  const contextValue = useMemo(
    () => ({
      startingBudget: state.startingBudget,
      additionalIncome: state.additionalIncome,
      totalDays: state.totalDays,
      currentDay: state.currentDay,
      transactions: state.transactions,
      commitments: state.commitments,
      savingsGoals: state.savingsGoals,
      summary,
      categoryBreakdown,
      addTransaction,
      editTransaction,
      deleteTransaction,
      addCommitment,
      editCommitment,
      payCommitment,
      cancelCommitment,
      deleteCommitment,
      addSavingsGoal,
      editSavingsGoal,
      depositToGoal,
      withdrawFromGoal,
      deleteSavingsGoal,
      setCurrentDay,
      resetToDemoData,
      clearToFreshStart,
    }),
    [
      state,
      summary,
      categoryBreakdown,
      addTransaction,
      editTransaction,
      deleteTransaction,
      addCommitment,
      editCommitment,
      payCommitment,
      cancelCommitment,
      deleteCommitment,
      addSavingsGoal,
      editSavingsGoal,
      depositToGoal,
      withdrawFromGoal,
      deleteSavingsGoal,
      setCurrentDay,
      resetToDemoData,
      clearToFreshStart,
    ]
  );

  return <FinanceContext.Provider value={contextValue}>{children}</FinanceContext.Provider>;
};
