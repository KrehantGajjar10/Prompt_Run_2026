import React, { useState, useMemo } from 'react';
import { History, Search, Filter, X, ArrowDownRight, ArrowUpRight, Tag, Plus, Trash2, Edit2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { Transaction, TransactionCategory } from '../../types/transaction';
import { CATEGORIES } from '../../data/categories';
import { formatINR } from '../../lib/currency';

export interface RecentTransactionsProps {
  transactions: Transaction[];
  currentDay: number;
  onOpenAddModal: () => void;
  onEditTransaction?: (tx: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  currentDay,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | 'all'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.description && tx.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.merchant && tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || tx.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchQuery, selectedCategory]);

  const categoriesList: { id: TransactionCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'food_dining', label: 'Food' },
    { id: 'transit_commute', label: 'Transit' },
    { id: 'utilities_bills', label: 'Bills' },
    { id: 'personal_essentials', label: 'Personal' },
    { id: 'entertainment_social', label: 'Social' },
    { id: 'emergency_health', label: 'Health' },
  ];

  return (
    <Card variant="default" className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-zinc-800 text-accent-lime border border-zinc-700/60">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Recent Transactions
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {transactions.length} recorded entries
            </span>
          </div>
        </div>

        {/* Quick Add Button & Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search transactions"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-8 py-1.5 text-xs text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-accent-lime transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddModal}
            icon={<Plus className="w-3.5 h-3.5" />}
            className="shrink-0"
          >
            Add
          </Button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none text-xs">
        <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0 mr-1 hidden sm:inline" />
        {categoriesList.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedCategory(item.id)}
            className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === item.id
                ? 'bg-accent-lime text-zinc-950 font-bold'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Transactions Table / List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60">
          <Tag className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-xs text-zinc-400 font-medium">
            {transactions.length === 0
              ? 'No transactions recorded yet in this cycle.'
              : 'No transactions match your current search or category filter.'}
          </p>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs text-accent-lime hover:underline cursor-pointer font-mono"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/80 -mx-4 sm:-mx-5 px-4 sm:px-5">
          {filteredTransactions.slice(0, 10).map((tx) => {
            const meta = CATEGORIES[tx.category];
            const isToday = tx.day === currentDay;
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 hover:bg-zinc-800/30 -mx-2 px-2 rounded-lg transition-colors group"
              >
                {/* Left: Info */}
                <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 sm:mt-0 ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700/60'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-4 h-4 text-accent-lime" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-semibold text-zinc-100 wrap-break-word">
                        {tx.title}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent-lime/10 text-accent-lime font-semibold border border-accent-lime/20">
                          Today
                        </span>
                      )}
                      <span
                        className="sm:hidden text-[10px] font-mono px-1.5 py-0.2 rounded border"
                        style={{
                          backgroundColor: meta?.badgeBg || 'rgba(255,255,255,0.05)',
                          borderColor: meta?.colorHex ? `${meta.colorHex}30` : '#3f3f46',
                          color: meta?.badgeText || '#d4d4d8',
                        }}
                      >
                        {meta?.shortName || tx.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-zinc-400 flex-wrap font-mono">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="text-zinc-300">{tx.paymentMethod}</span>
                      {tx.merchant && (
                        <>
                          <span>•</span>
                          <span className="text-zinc-300 truncate max-w-30 sm:max-w-none">{tx.merchant}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Category badge + Amount + Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                  <span
                    className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: meta?.badgeBg || 'rgba(255,255,255,0.05)',
                      borderColor: meta?.colorHex ? `${meta.colorHex}30` : '#3f3f46',
                      color: meta?.badgeText || '#d4d4d8',
                    }}
                  >
                    {meta?.shortName || tx.category}
                  </span>

                  <div className="text-left sm:text-right">
                    <div
                      className={`text-xs sm:text-sm font-bold font-mono tabular-nums ${
                        isIncome ? 'text-accent-lime' : 'text-zinc-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatINR(tx.amount)}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      Day {tx.day} of 30
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {onEditTransaction && (
                      <button
                        type="button"
                        onClick={() => onEditTransaction(tx)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        title="Edit transaction"
                        aria-label={`Edit ${tx.title}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDeleteTransaction && (
                      <button
                        type="button"
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 cursor-pointer"
                        title="Delete transaction"
                        aria-label={`Delete ${tx.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {transactions.length > 10 && (
        <div className="mt-3 pt-3 border-t border-zinc-800 text-center">
          <span className="text-xs font-mono text-zinc-400">
            Showing latest 10 of {transactions.length} records.
          </span>
        </div>
      )}
    </Card>
  );
};
