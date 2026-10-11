import React, { useState } from 'react';
import {
  RotateCcw,
  Menu,
  X,
  CreditCard,
  Calendar,
  PiggyBank,
  Compass,
  LayoutDashboard,
} from 'lucide-react';
import type { FinancialSummary } from '../../types/budget';

export type NavigationTab = 'overview' | 'transactions' | 'commitments' | 'savings' | 'simulator';

export interface HeaderProps {
  summary: FinancialSummary;
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenResetModal: () => void;
  onOpenAddExpense: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  summary,
  activeTab,
  onSelectTab,
  onOpenResetModal,
  onOpenAddExpense,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', shortLabel: 'Overview', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
    { id: 'transactions', label: 'Transactions', shortLabel: 'Ledger', icon: <CreditCard className="w-4 h-4 shrink-0" /> },
    { id: 'commitments', label: 'Bills & Subscriptions', shortLabel: 'Bills', icon: <Calendar className="w-4 h-4 shrink-0" /> },
    { id: 'savings', label: 'Savings', shortLabel: 'Savings', icon: <PiggyBank className="w-4 h-4 shrink-0" /> },
    { id: 'simulator', label: 'Decision Simulator', shortLabel: 'Simulator', icon: <Compass className="w-4 h-4 shrink-0" /> },
  ];

  const handleTabClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Identity (Reference style) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => handleTabClick('overview')}
              className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none focus:ring-2 focus:ring-accent-lime/50 rounded-md p-1 group cursor-pointer min-w-0"
            >
              <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-accent-lime group-hover:border-accent-lime/50 transition-colors shrink-0">
                <span className="font-mono font-bold text-sm">₹B</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-100 uppercase font-mono group-hover:text-accent-lime transition-colors truncate">
                  Broke But Functional
                </span>
                <span className="text-[10px] text-zinc-400 tracking-tight font-mono hidden sm:block truncate">
                  Digital Survival Ledger
                </span>
              </div>
            </button>
          </div>

          {/* Desktop & Tablet Navigation */}
          <nav className="hidden md:flex items-center gap-1 shrink-0" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`px-2.5 lg:px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-zinc-800 text-accent-lime border border-zinc-700/80 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="inline lg:hidden">{item.shortLabel}</span>
                </button>
              );
            })}

            {/* Live Indicator */}
            <div className="ml-2 lg:ml-3 pl-2 lg:pl-3 border-l border-zinc-800 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-lime opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-lime" />
              </span>
              <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded whitespace-nowrap">
                Day {summary.currentDay}/30
              </span>
            </div>

            {/* Reset / Demo restore action */}
            <button
              type="button"
              onClick={onOpenResetModal}
              title="Reset state to pristine demo dataset"
              className="ml-1.5 p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer"
              aria-label="Reset simulation data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Mobile Menu Button (< 768px) */}
          <div className="flex items-center gap-2 md:hidden shrink-0">
            <span className="text-[11px] font-mono text-accent-lime bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded whitespace-nowrap">
              D{summary.currentDay}/30
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-accent-lime cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-zinc-800/80 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-mono font-medium transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-zinc-800 text-accent-lime border border-zinc-700'
                      : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between px-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResetModal();
                }}
                className="text-xs font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo Data
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAddExpense();
                }}
                className="text-xs font-mono text-accent-lime font-semibold py-1"
              >
                + Record Transaction
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
