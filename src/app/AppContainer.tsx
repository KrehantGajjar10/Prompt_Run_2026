import React, { useState, useMemo } from 'react';
import { Header, type DemoStateMode } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Footer } from '../components/layout/Footer';
import { DashboardView } from '../features/dashboard/DashboardView';
import {
  INITIAL_BUDGET_CONFIG,
  MOCK_TRANSACTIONS,
  MOCK_UPCOMING_COMMITMENTS,
  MOCK_SAVINGS_GOALS,
  EMPTY_DEMO_DATA,
} from '../data/mockData';
import {
  calculateFinancialSummary,
  calculateCategoryBreakdown,
} from '../lib/calculations';

export const AppContainer: React.FC = () => {
  const [demoMode, setDemoMode] = useState<DemoStateMode>('active');

  // Derive active dataset depending on selected demo scenario
  const currentData = useMemo(() => {
    if (demoMode === 'empty') {
      return {
        startingBudget: EMPTY_DEMO_DATA.startingBudget,
        totalDays: EMPTY_DEMO_DATA.totalDays,
        currentDay: EMPTY_DEMO_DATA.currentDay,
        transactions: EMPTY_DEMO_DATA.transactions,
        commitments: EMPTY_DEMO_DATA.commitments,
        savingsGoals: EMPTY_DEMO_DATA.savingsGoals,
      };
    }

    // Default: 'active' or 'loading' (data used for header summary calculation)
    return {
      startingBudget: INITIAL_BUDGET_CONFIG.startingBudget,
      totalDays: INITIAL_BUDGET_CONFIG.totalDays,
      currentDay: INITIAL_BUDGET_CONFIG.currentDay,
      transactions: MOCK_TRANSACTIONS,
      commitments: MOCK_UPCOMING_COMMITMENTS,
      savingsGoals: MOCK_SAVINGS_GOALS,
    };
  }, [demoMode]);

  // Pure financial calculations
  const summary = useMemo(() => {
    return calculateFinancialSummary({
      startingBudget: currentData.startingBudget,
      totalDays: currentData.totalDays,
      currentDay: currentData.currentDay,
      transactions: currentData.transactions,
      commitments: currentData.commitments,
      savingsGoals: currentData.savingsGoals,
    });
  }, [currentData]);

  // Category breakdown calculation
  const categoryBreakdown = useMemo(() => {
    return calculateCategoryBreakdown(currentData.transactions);
  }, [currentData.transactions]);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-[#E6EDF3]">
      <Header
        summary={summary}
        demoMode={demoMode}
        onSelectDemoMode={setDemoMode}
      />

      <PageContainer className="flex-1">
        <DashboardView
          summary={summary}
          transactions={currentData.transactions}
          commitments={currentData.commitments}
          savingsGoals={currentData.savingsGoals}
          categoryBreakdown={categoryBreakdown}
          isLoading={demoMode === 'loading'}
        />
      </PageContainer>

      <Footer />
    </div>
  );
};
