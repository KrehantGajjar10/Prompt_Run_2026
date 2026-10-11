import React from 'react';
import { Calendar, CheckCircle2, Lock, Info } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import type { UpcomingCommitment } from '../../types/commitment';
import { formatINR } from '../../lib/currency';

export interface UpcomingCommitmentsProps {
  commitments: UpcomingCommitment[];
  currentDay: number;
}

export const UpcomingCommitments: React.FC<UpcomingCommitmentsProps> = ({
  commitments,
  currentDay,
}) => {
  const totalReserved = commitments
    .filter((c) => c.isReserved && c.status === 'reserved')
    .reduce((acc, c) => acc + c.amount, 0);

  return (
    <Card variant="default" className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#1f2838] text-[#38bdf8]">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f1f5f9]">
              Upcoming Commitments & Bills
            </h3>
            <span className="text-xs text-[#94a3b8]">
              Walled off from daily spending pool
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#94a3b8]">Total Reserved:</span>
          <span className="text-xs font-bold text-[#38bdf8] tabular-nums">
            {formatINR(totalReserved)}
          </span>
        </div>
      </div>

      {/* Accounting protection explainer note */}
      <div className="p-2.5 rounded-lg bg-[#0e141f] border border-[#1b2638] text-[11px] text-[#94a3b8] flex items-start gap-2 mb-4">
        <Info className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
        <span>
          <strong className="text-[#cbd5e1]">Zero-Surprise Protection:</strong> These bills haven't been charged yet, but the full ₹{totalReserved} is deducted from your daily allowance now. You will never accidentally spend rent or phone recharge money on coffee.
        </span>
      </div>

      {/* Commitments List */}
      {commitments.length === 0 ? (
        <div className="text-center py-6 text-xs text-[#94a3b8]">
          No upcoming bills reserved for this cycle.
        </div>
      ) : (
        <div className="space-y-3">
          {commitments.map((item) => {
            const daysUntil = item.dueDay - currentDay;

            return (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-[#111621] border border-[#1d2737] hover:border-[#2a384f] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#182130] border border-[#233147] flex items-center justify-center text-[#38bdf8] shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-[#f1f5f9] truncate">
                        {item.title}
                      </span>
                      {item.autoDebit && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20 font-medium">
                          Auto-Debit
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#64748b] mt-0.5">
                      {item.provider} • Due {item.dueDateLabel}
                    </div>
                    {item.notes && (
                      <div className="text-[10px] text-[#94a3b8] mt-1 italic">
                        "{item.notes}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1a2332]">
                  <div className="flex flex-col sm:items-end">
                    <span className="text-xs sm:text-sm font-bold text-[#f1f5f9] tabular-nums">
                      {formatINR(item.amount)}
                    </span>
                    <span className="text-[10px] text-[#34d399] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Locked in pool
                    </span>
                  </div>

                  <Badge variant="outline" size="sm" className="shrink-0">
                    {daysUntil > 0 ? `in ${daysUntil} days` : 'Due today'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
