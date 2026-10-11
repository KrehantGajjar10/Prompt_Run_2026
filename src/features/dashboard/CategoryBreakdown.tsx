import React from 'react';
import { PieChart, Utensils, Compass, Zap, Sparkles, PartyPopper, HeartPulse, HelpCircle, ArrowDownLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import type { CategorySpendingSummary } from '../../lib/calculations';
import { CATEGORIES } from '../../data/categories';
import { formatINR } from '../../lib/currency';
import type { TransactionCategory } from '../../types/transaction';

export interface CategoryBreakdownProps {
  categories: CategorySpendingSummary[];
  totalSpent: number;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categories,
  totalSpent,
}) => {
  const getCategoryIcon = (catId: TransactionCategory) => {
    switch (catId) {
      case 'food_dining':
        return <Utensils className="w-4 h-4" />;
      case 'transit_commute':
        return <Compass className="w-4 h-4" />;
      case 'utilities_bills':
        return <Zap className="w-4 h-4" />;
      case 'personal_essentials':
        return <Sparkles className="w-4 h-4" />;
      case 'entertainment_social':
        return <PartyPopper className="w-4 h-4" />;
      case 'emergency_health':
        return <HeartPulse className="w-4 h-4" />;
      case 'income_deposit':
        return <ArrowDownLeft className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  if (categories.length === 0 || totalSpent === 0) {
    return (
      <Card variant="default" className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-zinc-800 text-accent-lime border border-zinc-700/60">
            <PieChart className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-100">
            Spending by Category
          </h3>
        </div>
        <div className="text-center py-8 text-zinc-400 text-xs font-mono">
          No expenses recorded yet. Your budget is completely untouched!
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-zinc-800 text-accent-lime border border-zinc-700/60">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Spending by Category
            </h3>
            <span className="text-xs text-zinc-400">
              Where your expenses went this cycle
            </span>
          </div>
        </div>
        <span className="text-xs font-semibold text-accent-lime font-mono tabular-nums">
          {formatINR(totalSpent)} total
        </span>
      </div>

      {/* Stacked Multi-Segment Bar */}
      <div className="mb-6">
        <div className="h-3 w-full rounded-full overflow-hidden flex bg-zinc-800">
          {categories.map((item) => {
            const meta = CATEGORIES[item.category];
            const width = Math.max(item.percentageOfTotalSpend, 2);
            return (
              <div
                key={item.category}
                title={`${meta?.name || item.category}: ${Math.round(item.percentageOfTotalSpend)}% (${formatINR(item.totalSpent)})`}
                style={{
                  width: `${width}%`,
                  backgroundColor: meta?.colorHex || '#a1a1aa',
                }}
                className="h-full transition-all duration-300 hover:opacity-85"
              />
            );
          })}
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs">
          {categories.map((item) => {
            const meta = CATEGORIES[item.category];
            return (
              <div key={item.category} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: meta?.colorHex || '#a1a1aa' }}
                />
                <span className="text-zinc-300 font-medium text-xs">
                  {meta?.shortName || item.category}
                </span>
                <span className="text-zinc-400 font-mono text-[11px] tabular-nums">
                  {Math.round(item.percentageOfTotalSpend)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Category Items */}
      <div className="space-y-2.5">
        {categories.map((item) => {
          const meta = CATEGORIES[item.category];
          const pct = Math.round(item.percentageOfTotalSpend);

          return (
            <div
              key={item.category}
              className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="p-1.5 rounded-lg shrink-0 border border-zinc-800"
                    style={{
                      backgroundColor: meta?.badgeBg || 'rgba(255,255,255,0.05)',
                      color: meta?.colorHex || '#a1a1aa',
                    }}
                  >
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-zinc-100 truncate">
                      {meta?.name || item.category}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {item.transactionCount} transaction{item.transactionCount === 1 ? '' : 's'}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-zinc-100 font-mono tabular-nums">
                    {formatINR(item.totalSpent)}
                  </div>
                  <div className="text-[11px] font-medium text-zinc-400 font-mono tabular-nums">
                    {pct}% of spend
                  </div>
                </div>
              </div>

              {/* Category track */}
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: meta?.colorHex || '#a1a1aa',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
