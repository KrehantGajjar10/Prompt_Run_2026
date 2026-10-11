import { createContext } from 'react';
import type { FinanceContextType } from './FinanceContext';

export const FinanceContext = createContext<FinanceContextType | null>(null);
