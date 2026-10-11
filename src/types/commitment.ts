import type { TransactionCategory } from './transaction';

export type CommitmentStatus = 'reserved' | 'paid' | 'cancelled';

export interface UpcomingCommitment {
  id: string;
  title: string;
  provider: string;
  amount: number;
  category: TransactionCategory;
  /** Day of the 30-day budget cycle when payment is due (e.g. 18) */
  dueDay: number;
  dueDateLabel: string;
  /** Whether the funds have been walled off in the current budget (true if active & reserved) */
  isReserved: boolean;
  status: CommitmentStatus;
  autoDebit: boolean;
  isSubscription?: boolean;
  notes?: string;
  paidAtDay?: number;
  paidTransactionId?: string;
  cancelledAtDay?: number;
}
