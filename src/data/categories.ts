import type { CategoryInfo, TransactionCategory } from '../types/transaction';

export const CATEGORIES: Record<TransactionCategory, CategoryInfo> = {
  food_dining: {
    id: 'food_dining',
    name: 'Food & Groceries',
    shortName: 'Food',
    colorHex: '#bef264', // Accent Lime
    badgeBg: 'rgba(190, 242, 100, 0.1)',
    badgeText: '#bef264',
    description: 'Chai, Blinkit groceries, mess fees, quick bites',
    iconName: 'Utensils',
  },
  transit_commute: {
    id: 'transit_commute',
    name: 'Transit & Commute',
    shortName: 'Transit',
    colorHex: '#a1a1aa', // Neutral Zinc
    badgeBg: 'rgba(161, 161, 170, 0.1)',
    badgeText: '#d4d4d8',
    description: 'Metro smart card, Rapido, shared autos, bus passes',
    iconName: 'Compass',
  },
  utilities_bills: {
    id: 'utilities_bills',
    name: 'Bills & Subscriptions',
    shortName: 'Bills',
    colorHex: '#e4e4e7', // Light Zinc
    badgeBg: 'rgba(228, 228, 231, 0.1)',
    badgeText: '#f4f4f5',
    description: 'Mobile data recharge, Wi-Fi split, OTT subscriptions',
    iconName: 'Zap',
  },
  personal_essentials: {
    id: 'personal_essentials',
    name: 'Personal & Care',
    shortName: 'Personal',
    colorHex: '#fb923c', // Orange
    badgeBg: 'rgba(251, 146, 60, 0.1)',
    badgeText: '#fb923c',
    description: 'Toiletries, stationery, haircut, laundry supplies',
    iconName: 'Sparkles',
  },
  entertainment_social: {
    id: 'entertainment_social',
    name: 'Social & Fun',
    shortName: 'Social',
    colorHex: '#f472b6', // Muted Pink
    badgeBg: 'rgba(244, 114, 182, 0.1)',
    badgeText: '#f472b6',
    description: 'Weekend hangout, cinema ticket, split munchies',
    iconName: 'PartyPopper',
  },
  emergency_health: {
    id: 'emergency_health',
    name: 'Health & Medical',
    shortName: 'Health',
    colorHex: '#34d399', // Emerald
    badgeBg: 'rgba(52, 211, 153, 0.1)',
    badgeText: '#34d399',
    description: 'Medicines, clinic visits, emergency supplies',
    iconName: 'HeartPulse',
  },
  income_deposit: {
    id: 'income_deposit',
    name: 'Income & Deposits',
    shortName: 'Income',
    colorHex: '#bef264', // Lime
    badgeBg: 'rgba(190, 242, 100, 0.12)',
    badgeText: '#bef264',
    description: 'Stipend, freelance, parent allowance, refunds',
    iconName: 'ArrowDownLeft',
  },
};
