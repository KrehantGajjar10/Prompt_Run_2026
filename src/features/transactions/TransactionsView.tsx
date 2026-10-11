import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  X,
  ArrowDownRight,
  ArrowUpRight,
  Edit2,
  Trash2,
  Tag,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useFinance } from '../../context/useFinance';
import { CATEGORIES } from '../../data/categories';
import type { Transaction, TransactionCategory, PaymentMethod } from '../../types/transaction';
import { formatINR } from '../../lib/currency';

export interface TransactionsViewProps {
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onOpenAddModal,
  onEditTransaction,
}) => {
  const finance = useFinance();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Filtered & sorted records
  const filtered = useMemo(() => {
    return finance.transactions
      .filter((tx) => {
        const matchesSearch =
          tx.title.toLowerCase().includes(search.toLowerCase()) ||
          (tx.description && tx.description.toLowerCase().includes(search.toLowerCase())) ||
          (tx.merchant && tx.merchant.toLowerCase().includes(search.toLowerCase()));

        const matchesType = typeFilter === 'all' || tx.type === typeFilter;
        const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter;
        const matchesPayment = paymentFilter === 'all' || tx.paymentMethod === paymentFilter;

        return matchesSearch && matchesType && matchesCategory && matchesPayment;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return b.day - a.day;
        if (sortBy === 'date_asc') return a.day - b.day;
        if (sortBy === 'amount_desc') return b.amount - a.amount;
        if (sortBy === 'amount_asc') return a.amount - b.amount;
        return 0;
      });
  }, [finance.transactions, search, typeFilter, categoryFilter, paymentFilter, sortBy]);

  // Aggregate stats
  const totalExpense = finance.transactions
    .filter((tx) => tx.type !== 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalIncome = finance.transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 font-sans">
            Transactions & Income
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Full ledger history for the 30-day survival period
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenAddModal}
          icon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Record Transaction
        </Button>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="subtle" className="p-4">
          <span className="text-[11px] font-mono uppercase text-zinc-400">Total Spent</span>
          <div className="text-2xl font-bold text-zinc-100 font-mono tabular-nums mt-1">
            {formatINR(totalExpense)}
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            {finance.transactions.filter((t) => t.type !== 'income').length} expense entries
          </span>
        </Card>

        <Card variant="subtle" className="p-4">
          <span className="text-[11px] font-mono uppercase text-zinc-400">Additional Inflows</span>
          <div className="text-2xl font-bold text-accent-lime font-mono tabular-nums mt-1">
            +{formatINR(totalIncome)}
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            {finance.transactions.filter((t) => t.type === 'income').length} income deposits
          </span>
        </Card>

        <Card variant="subtle" className="p-4">
          <span className="text-[11px] font-mono uppercase text-zinc-400">Net Survival Margin</span>
          <div className="text-2xl font-bold text-zinc-100 font-mono tabular-nums mt-1">
            {formatINR(finance.summary.availableBalance)}
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            Discretionary pool remaining
          </span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="default" className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, description, or merchant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-8 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-accent-lime transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Type Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({finance.transactions.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                typeFilter === 'expense'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Expenses
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                typeFilter === 'income'
                  ? 'bg-accent-lime text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Dropdown Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-zinc-800/80 text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as TransactionCategory | 'all')}
            className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-accent-lime"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORIES).map(([catId, meta]) => (
              <option key={catId} value={catId}>
                {meta.name}
              </option>
            ))}
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as PaymentMethod | 'all')}
            className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-accent-lime"
          >
            <option value="all">All Payment Methods</option>
            <option value="UPI (GPay)">UPI (GPay)</option>
            <option value="UPI (PhonePe)">UPI (PhonePe)</option>
            <option value="UPI (Paytm)">UPI (Paytm)</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-accent-lime ml-auto font-mono"
          >
            <option value="date_desc">Latest Day First</option>
            <option value="date_asc">Earliest Day First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
        </div>
      </Card>

      {/* Transactions List */}
      <Card variant="default" className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Tag className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400 font-mono">
              No transactions match your current search and filter settings.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {filtered.map((tx) => {
              const meta = CATEGORIES[tx.category];
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-zinc-800/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                        isIncome
                          ? 'bg-emerald-500/10 text-accent-lime border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700/60'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-semibold text-zinc-100 truncate">
                          {tx.title}
                        </span>
                        {tx.relatedCommitmentId && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                            Bill Paid
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>{tx.date} • {tx.time}</span>
                        <span>•</span>
                        <span className="text-zinc-400">{tx.paymentMethod}</span>
                        {tx.merchant && (
                          <>
                            <span>•</span>
                            <span className="text-zinc-400">{tx.merchant}</span>
                          </>
                        )}
                        {tx.description && (
                          <>
                            <span>•</span>
                            <span className="text-zinc-500 italic truncate max-w-xs">{tx.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: meta?.badgeBg || 'rgba(255,255,255,0.05)',
                        borderColor: meta?.colorHex ? `${meta.colorHex}30` : '#3f3f46',
                        color: meta?.badgeText || '#d4d4d8',
                      }}
                    >
                      {meta?.shortName || tx.category}
                    </span>

                    <div className="text-right">
                      <div
                        className={`text-sm sm:text-base font-bold font-mono tabular-nums ${
                          isIncome ? 'text-accent-lime' : 'text-zinc-100'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatINR(tx.amount)}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        Day {tx.day} of 30
                      </div>
                    </div>

                    {/* Edit & Delete actions */}
                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onEditTransaction(tx)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        title="Edit transaction"
                        aria-label={`Edit ${tx.title}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => finance.deleteTransaction(tx.id)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 cursor-pointer"
                        title="Delete transaction"
                        aria-label={`Delete ${tx.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
