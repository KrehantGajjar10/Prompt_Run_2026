export type TransactionCategory =
  | 'food_dining'
  | 'transit_commute'
  | 'utilities_bills'
  | 'personal_essentials'
  | 'entertainment_social'
  | 'emergency_health';

export type PaymentMethod =
  | 'UPI (GPay)'
  | 'UPI (PhonePe)'
  | 'UPI (Paytm)'
  | 'Debit Card'
  | 'Cash';

export interface Transaction {
  id: string;
  title: string;
  description?: string;
  amount: number;
  category: TransactionCategory;
  /** Day of the 30-day budget cycle (1 to 30) */
  day: number;
  date: string;
  time: string;
  paymentMethod: PaymentMethod;
  merchant?: string;
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
