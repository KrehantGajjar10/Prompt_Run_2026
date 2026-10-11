import React from 'react';
import { PieChart, Utensils, Compass, Zap, Sparkles, PartyPopper, HeartPulse, HelpCircle } from 'lucide-react';
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
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  if (categories.length === 0 || totalSpent === 0) {
    return (
      <Card variant="default" className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-[#1f2838] text-accent-lime">
            <PieChart className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-[#f1f5f9]">
            Spending by Category
          </h3>
        </div>
        <div className="text-center py-8 text-[#94a3b8] text-xs">
          No expenses recorded yet. Your ₹10,000 budget is completely untouched!
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#1f2838] text-accent-lime">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f1f5f9]">
              Spending by Category
            </h3>
            <span className="text-xs text-[#94a3b8]">
              Where your ₹4,250 went this month
            </span>
          </div>
        </div>
        <span className="text-xs font-semibold text-accent-lime tabular-nums">
          {formatINR(totalSpent)} total
        </span>
      </div>

      {/* Visual Stacked Multi-Segment Bar */}
      <div className="mb-6">
        <div className="h-3 w-full rounded-full overflow-hidden flex bg-[#161d28]">
          {categories.map((item) => {
            const meta = CATEGORIES[item.category];
            const width = Math.max(item.percentageOfTotalSpend, 2);
            return (
              <div
                key={item.category}
                title={`${meta?.name || item.category}: ${Math.round(item.percentageOfTotalSpend)}% (${formatINR(item.totalSpent)})`}
                style={{
                  width: `${width}%`,
                  backgroundColor: meta?.colorHex || '#94a3b8',
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
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: meta?.colorHex || '#94a3b8' }}
                />
                <span className="text-[#cbd5e1] font-medium">
                  {meta?.shortName || item.category}
                </span>
                <span className="text-[#64748b] tabular-nums">
                  {Math.round(item.percentageOfTotalSpend)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Category Table / Cards */}
      <div className="space-y-3">
        {categories.map((item) => {
          const meta = CATEGORIES[item.category];
          const pct = Math.round(item.percentageOfTotalSpend);

          return (
            <div
              key={item.category}
              className="p-3 rounded-lg bg-[#111621] border border-[#1d2737] hover:border-[#2b3a52] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="p-1.5 rounded-lg shrink-0"
                    style={{
                      backgroundColor: meta?.badgeBg || 'rgba(255,255,255,0.05)',
                      color: meta?.colorHex || '#94a3b8',
                    }}
                  >
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#f1f5f9]">
                      {meta?.name || item.category}
                    </div>
                    <div className="text-[11px] text-[#64748b]">
                      {meta?.description || ''} • {item.transactionCount} transactions
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-[#f8fafc] tabular-nums">
                    {formatINR(item.totalSpent)}
                  </div>
                  <div className="text-[11px] font-medium text-[#94a3b8] tabular-nums">
                    {pct}% of spend
                  </div>
                </div>
              </div>

              {/* Individual progress track */}
              <div className="w-full bg-[#18212e] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: meta?.colorHex || '#94a3b8',
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
