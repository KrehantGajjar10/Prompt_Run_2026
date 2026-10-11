import { getFreshMockData } from '../data/mockData';
import type { Transaction } from '../types/transaction';
import type { UpcomingCommitment } from '../types/commitment';
import type { SavingsGoal } from '../types/savings';

export const STORAGE_KEY = 'broke_but_functional_state_v1';

export interface StoredFinanceState {
  version: number;
  startingBudget: number;
  additionalIncome: number;
  totalDays: number;
  currentDay: number;
  transactions: Transaction[];
  commitments: UpcomingCommitment[];
  savingsGoals: SavingsGoal[];
}

/**
 * Loads financial state from localStorage with safe validation and automatic fallback to demo data.
 */
export function loadStoredFinanceState(): StoredFinanceState {
  if (typeof window === 'undefined') {
    return createInitialDefaultState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialDefaultState();
      saveStoredFinanceState(initial);
      return initial;
    }

    const parsed = JSON.parse(raw);
    if (!isValidStoredState(parsed)) {
      console.warn('Stored finance state invalid or outdated. Restoring defaults.');
      const fallback = createInitialDefaultState();
      saveStoredFinanceState(fallback);
      return fallback;
    }

    return parsed;
  } catch (err) {
    console.error('Failed to load stored finance state:', err);
    return createInitialDefaultState();
  }
}

/**
 * Saves financial state safely to localStorage.
 */
export function saveStoredFinanceState(state: StoredFinanceState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save finance state to localStorage:', err);
  }
}

/**
 * Clears stored finance state and restores pristine demo dataset.
 */
export function resetStoredFinanceState(): StoredFinanceState {
  const fresh = createInitialDefaultState();
  saveStoredFinanceState(fresh);
  return fresh;
}

/**
 * Creates default state using mock dataset.
 */
export function createInitialDefaultState(): StoredFinanceState {
  const fresh = getFreshMockData();
  return {
    version: 1,
    startingBudget: fresh.startingBudget,
    additionalIncome: fresh.additionalIncome,
    totalDays: fresh.totalDays,
    currentDay: fresh.currentDay,
    transactions: fresh.transactions,
    commitments: fresh.commitments,
    savingsGoals: fresh.savingsGoals,
  };
}

/**
 * Runtime schema validator for persisted state.
 */
function isValidStoredState(obj: unknown): obj is StoredFinanceState {
  if (!obj || typeof obj !== 'object') return false;
  const s = obj as Record<string, unknown>;

  return (
    typeof s.version === 'number' &&
    typeof s.startingBudget === 'number' &&
    s.startingBudget > 0 &&
    typeof s.totalDays === 'number' &&
    typeof s.currentDay === 'number' &&
    Array.isArray(s.transactions) &&
    Array.isArray(s.commitments) &&
    Array.isArray(s.savingsGoals)
  );
}
