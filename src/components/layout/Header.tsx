import React from 'react';
import { ShieldAlert, Flame, CheckCircle2, RotateCcw, Loader2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { FinancialSummary } from '../../types/budget';

export type DemoStateMode = 'active' | 'empty' | 'loading';

export interface HeaderProps {
  summary: FinancialSummary;
  demoMode: DemoStateMode;
  onSelectDemoMode: (mode: DemoStateMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  summary,
  demoMode,
  onSelectDemoMode,
}) => {
  const statusConfig = {
    on_track: {
      label: 'Pace: On Track',
      variant: 'lime' as const,
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    caution: {
      label: 'Pace: Caution',
      variant: 'warning' as const,
      icon: <Flame className="w-3.5 h-3.5" />,
    },
    critical: {
      label: 'Pace: Critical',
      variant: 'danger' as const,
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
    },
  }[summary.burnRateStatus];

  return (
    <header className="border-b border-[#1c2433] bg-[#0c0f16]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Brand & Context */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#17202d] border border-[#2b394f] flex items-center justify-center shrink-0 shadow-inner">
              <span className="font-black text-lg text-accent-lime tracking-tighter">
                ₹B
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#f8fafc]">
                  Broke But Functional
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#16202e] text-accent-lime font-medium border border-accent-lime/20">
                  Survive the Month
                </span>
                <span className="text-xs text-[#64748b] hidden sm:inline">
                  Chapter 1
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] flex items-center gap-2 mt-0.5">
                <span>₹10,000 / 30-Day Budget Challenge</span>
                <span className="text-[#334155]">•</span>
                <span className="text-[#cbd5e1] font-medium">
                  Day {summary.currentDay} of {summary.totalDays} ({summary.daysRemaining} days left)
                </span>
              </p>
            </div>
          </div>

          {/* Controls & Quick State Switchers */}
          <div className="flex items-center gap-2.5 flex-wrap justify-between md:justify-end">
            <Badge variant={statusConfig.variant} size="md" icon={statusConfig.icon}>
              {statusConfig.label}
            </Badge>

            {/* State Preview Switcher for evaluation */}
            <div className="flex items-center bg-[#131924] p-1 rounded-lg border border-[#202b3d] text-xs">
              <span className="text-[#64748b] px-2 font-medium hidden lg:inline">
                View:
              </span>
              <button
                type="button"
                onClick={() => onSelectDemoMode('active')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  demoMode === 'active'
                    ? 'bg-accent-lime text-canvas font-semibold'
                    : 'text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                Day 12 Active
              </button>
              <button
                type="button"
                onClick={() => onSelectDemoMode('empty')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  demoMode === 'empty'
                    ? 'bg-accent-lime text-canvas font-semibold'
                    : 'text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                Day 1 Empty
              </button>
              <button
                type="button"
                onClick={() => onSelectDemoMode('loading')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  demoMode === 'loading'
                    ? 'bg-accent-lime text-canvas font-semibold'
                    : 'text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                <Loader2 className="w-3 h-3" />
                Loading State
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
