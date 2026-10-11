import React, { useState, useMemo } from 'react';
import { History, Search, Filter, X, ArrowDownRight, Tag } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import type { Transaction, TransactionCategory } from '../../types/transaction';
import { CATEGORIES } from '../../data/categories';
import { formatINR } from '../../lib/currency';

export interface RecentTransactionsProps {
  transactions: Transaction[];
  currentDay: number;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  currentDay,
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
          <div className="p-1.5 rounded-lg bg-[#1f2838] text-accent-lime">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f1f5f9]">
              Recent Transactions
            </h3>
            <span className="text-xs text-[#94a3b8]">
              {transactions.length} posted expenses this month
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search transactions"
            className="w-full bg-[#111621] border border-[#202b3d] rounded-lg pl-8 pr-8 py-1.5 text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-accent-lime transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#f8fafc] cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none text-xs">
        <Filter className="w-3.5 h-3.5 text-[#64748b] shrink-0 mr-1 hidden sm:inline" />
        {categoriesList.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedCategory(item.id)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === item.id
                ? 'bg-accent-lime text-canvas font-semibold'
                : 'bg-[#111621] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e2738]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Transactions Table / List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-[#222d3f] bg-[#0e121a]">
          <Tag className="w-8 h-8 text-[#475569] mx-auto mb-2" />
          <p className="text-xs text-[#94a3b8] font-medium">
            {transactions.length === 0
              ? 'No transactions recorded in this cycle yet.'
              : 'No transactions match your current search or category filter.'}
          </p>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs text-accent-lime hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-[#18212e] -mx-5 px-5">
          {filteredTransactions.map((tx) => {
            const meta = CATEGORIES[tx.category];
            const isToday = tx.day === currentDay;

            return (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-[#111622]/60 -mx-3 px-3 rounded-lg transition-colors"
              >
                {/* Left: Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#18202d] border border-[#253245] flex items-center justify-center text-[#f87171] shrink-0">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-[#f1f5f9] truncate">
                        {tx.title}
                      </span>
                      {isToday && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-accent-lime/15 text-accent-lime font-semibold border border-accent-lime/30">
                          Today
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#64748b] flex-wrap">
                      <span>{tx.date} • {tx.time}</span>
                      <span>•</span>
                      <span className="text-[#94a3b8]">{tx.paymentMethod}</span>
                      {tx.merchant && (
                        <>
                          <span>•</span>
                          <span className="text-[#64748b] truncate">{tx.merchant}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Category badge + Amount */}
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: meta?.badgeBg || 'rgba(255,255,255,0.05)',
                      color: meta?.colorHex || '#94a3b8',
                    }}
                  >
                    {meta?.shortName || tx.category}
                  </span>

                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-bold text-[#f1f5f9] tabular-nums">
                      -{formatINR(tx.amount)}
                    </div>
                    <div className="text-[10px] text-[#64748b]">
                      Day {tx.day} of 30
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
