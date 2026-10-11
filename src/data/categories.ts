import type { CategoryInfo, TransactionCategory } from '../types/transaction';

export const CATEGORIES: Record<TransactionCategory, CategoryInfo> = {
  food_dining: {
    id: 'food_dining',
    name: 'Food & Groceries',
    shortName: 'Food',
    colorHex: '#bef264', // Accent Lime
    badgeBg: 'rgba(190, 242, 100, 0.12)',
    badgeText: '#bef264',
    description: 'Chai, Blinkit groceries, mess fees, quick bites',
    iconName: 'Utensils',
  },
  transit_commute: {
    id: 'transit_commute',
    name: 'Transit & Commute',
    shortName: 'Transit',
    colorHex: '#38bdf8', // Sky blue
    badgeBg: 'rgba(56, 189, 248, 0.12)',
    badgeText: '#38bdf8',
    description: 'Metro smart card, Rapido, shared autos, bus passes',
    iconName: 'Compass',
  },
  utilities_bills: {
    id: 'utilities_bills',
    name: 'Bills & Subscriptions',
    shortName: 'Bills',
    colorHex: '#a78bfa', // Purple / Violet
    badgeBg: 'rgba(167, 139, 250, 0.12)',
    badgeText: '#a78bfa',
    description: 'Mobile data recharge, Wi-Fi split, OTT subscriptions',
    iconName: 'Zap',
  },
  personal_essentials: {
    id: 'personal_essentials',
    name: 'Personal & Care',
    shortName: 'Personal',
    colorHex: '#fb923c', // Orange
    badgeBg: 'rgba(251, 146, 60, 0.12)',
    badgeText: '#fb923c',
    description: 'Toiletries, stationery, haircut, laundry supplies',
    iconName: 'Sparkles',
  },
  entertainment_social: {
    id: 'entertainment_social',
    name: 'Social & Fun',
    shortName: 'Social',
    colorHex: '#f472b6', // Pink
    badgeBg: 'rgba(244, 114, 182, 0.12)',
    badgeText: '#f472b6',
    description: 'Weekend hangout, cinema ticket, split munchies',
    iconName: 'PartyPopper',
  },
  emergency_health: {
    id: 'emergency_health',
    name: 'Health & Medical',
    shortName: 'Health',
    colorHex: '#34d399', // Emerald
    badgeBg: 'rgba(52, 211, 153, 0.12)',
    badgeText: '#34d399',
    description: 'Medicines, clinic visits, emergency supplies',
    iconName: 'HeartPulse',
  },
};
