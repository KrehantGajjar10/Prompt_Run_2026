export type SavingsPriority = 'essential' | 'goal' | 'wishlist';

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  priority: SavingsPriority;
  /** True if these funds are segregated from the daily spending pool */
  isLocked: boolean;
  notes: string;
  targetDay?: number;
}
