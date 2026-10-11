import React, { useState } from 'react';
import { FinanceProvider } from '../context/FinanceContext';
import { useFinance } from '../context/useFinance';
import { Header, type NavigationTab } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Footer } from '../components/layout/Footer';
import { DashboardView } from '../features/dashboard/DashboardView';
import { TransactionsView } from '../features/transactions/TransactionsView';
import { CommitmentsView } from '../features/commitments/CommitmentsView';
import { SavingsView } from '../features/savings/SavingsView';
import { DecisionSimulatorView } from '../features/simulator/DecisionSimulatorView';
import { TransactionModal } from '../features/transactions/TransactionModal';
import { CommitmentModal } from '../features/commitments/CommitmentModal';
import { SavingsGoalModal } from '../features/savings/SavingsGoalModal';
import { SavingsAdjustModal } from '../features/savings/SavingsAdjustModal';
import { ConfirmResetModal } from '../components/common/ConfirmResetModal';
import type { Transaction } from '../types/transaction';
import type { UpcomingCommitment } from '../types/commitment';
import type { SavingsGoal } from '../types/savings';

const InnerApp: React.FC = () => {
  const finance = useFinance();
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');

  // Modal states
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [editingComm, setEditingComm] = useState<UpcomingCommitment | null>(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustingGoal, setAdjustingGoal] = useState<SavingsGoal | null>(null);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Transaction Modal Handlers
  const handleOpenAddTx = () => {
    setEditingTx(null);
    setIsTxModalOpen(true);
  };

  const handleOpenEditTx = (tx: Transaction) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  // Commitment Modal Handlers
  const handleOpenAddComm = () => {
    setEditingComm(null);
    setIsCommModalOpen(true);
  };

  const handleOpenEditComm = (comm: UpcomingCommitment) => {
    setEditingComm(comm);
    setIsCommModalOpen(true);
  };

  // Goal Modal Handlers
  const handleOpenAddGoal = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleOpenAdjustGoal = (goal: SavingsGoal) => {
    setAdjustingGoal(goal);
    setIsAdjustModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Header
        summary={finance.summary}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onOpenAddExpense={handleOpenAddTx}
      />

      <PageContainer className="flex-1">
        {activeTab === 'overview' && (
          <DashboardView
            summary={finance.summary}
            transactions={finance.transactions}
            commitments={finance.commitments}
            savingsGoals={finance.savingsGoals}
            categoryBreakdown={finance.categoryBreakdown}
            onOpenAddExpense={handleOpenAddTx}
            onOpenAddCommitment={handleOpenAddComm}
            onOpenAddGoal={handleOpenAddGoal}
            onOpenAdjustGoal={handleOpenAdjustGoal}
            onOpenSimulator={() => setActiveTab('simulator')}
            onNavigateToTransactions={() => setActiveTab('transactions')}
            onNavigateToCommitments={() => setActiveTab('commitments')}
            onEditTransaction={handleOpenEditTx}
            onDeleteTransaction={finance.deleteTransaction}
            onPayCommitment={finance.payCommitment}
            onCancelCommitment={finance.cancelCommitment}
            onDeleteCommitment={finance.deleteCommitment}
            onEditCommitment={handleOpenEditComm}
            onDeleteGoal={finance.deleteSavingsGoal}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            onOpenAddModal={handleOpenAddTx}
            onEditTransaction={handleOpenEditTx}
          />
        )}

        {activeTab === 'commitments' && (
          <CommitmentsView
            onOpenAddModal={handleOpenAddComm}
            onEditCommitment={handleOpenEditComm}
          />
        )}

        {activeTab === 'savings' && (
          <SavingsView
            onOpenAddModal={handleOpenAddGoal}
            onOpenAdjustModal={handleOpenAdjustGoal}
            onEditGoal={handleOpenEditGoal}
          />
        )}

        {activeTab === 'simulator' && <DecisionSimulatorView />}
      </PageContainer>

      <Footer />

      {/* Reusable Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        initialData={editingTx}
        currentDay={finance.currentDay}
        totalDays={finance.totalDays}
        availableBalance={finance.summary.availableBalance}
        onSave={(data) => {
          if (editingTx) {
            return finance.editTransaction(editingTx.id, data);
          }
          return finance.addTransaction(data);
        }}
      />

      <CommitmentModal
        isOpen={isCommModalOpen}
        onClose={() => setIsCommModalOpen(false)}
        initialData={editingComm}
        currentDay={finance.currentDay}
        totalDays={finance.totalDays}
        onSave={(data) => {
          if (editingComm) {
            return finance.editCommitment(editingComm.id, data);
          }
          return finance.addCommitment(data);
        }}
      />

      <SavingsGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        initialData={editingGoal}
        availableBalance={finance.summary.availableBalance}
        onSave={(data) => {
          if (editingGoal) {
            return finance.editSavingsGoal(editingGoal.id, data);
          }
          return finance.addSavingsGoal(data);
        }}
      />

      <SavingsAdjustModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        goal={adjustingGoal}
        availableBalance={finance.summary.availableBalance}
        onDeposit={finance.depositToGoal}
        onWithdraw={finance.withdrawFromGoal}
      />

      <ConfirmResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset to Demo State?"
        description="This will restore the pristine 30-day budget challenge demo dataset (₹10k budget, Day 12 baseline). Any custom transactions or bills you added will be reset."
        confirmLabel="Reset to Demo"
        onConfirm={finance.resetToDemoData}
      />
    </div>
  );
};

export const AppContainer: React.FC = () => {
  return (
    <FinanceProvider>
      <InnerApp />
    </FinanceProvider>
  );
};
