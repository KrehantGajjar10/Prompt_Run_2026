export type TransactionCategory =
  | 'food_dining'
  | 'transit_commute'
  | 'utilities_bills'
  | 'personal_essentials'
  | 'entertainment_social'
  | 'emergency_health'
  | 'income_deposit';

export type TransactionType = 'expense' | 'income';

export type PaymentMethod =
  | 'UPI (GPay)'
  | 'UPI (PhonePe)'
  | 'UPI (Paytm)'
  | 'Debit Card'
  | 'Bank Transfer'
  | 'Cash';

export interface Transaction {
  id: string;
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  /** Day of the 30-day budget cycle (1 to 30) */
  day: number;
  date: string;
  time: string;
  paymentMethod: PaymentMethod;
  merchant?: string;
  relatedCommitmentId?: string;
}

export interface CategoryInfo {
  id: TransactionCategory;
  name: string;
  shortName: string;
  colorHex: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  iconName: string;
}
