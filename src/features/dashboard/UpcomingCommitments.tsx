import React from 'react';
import { Calendar, CheckCircle2, Lock, Info, Plus, Check, Ban, Trash2, Edit2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { UpcomingCommitment } from '../../types/commitment';
import { formatINR } from '../../lib/currency';

export interface UpcomingCommitmentsProps {
  commitments: UpcomingCommitment[];
  currentDay: number;
  onOpenAddModal?: () => void;
  onPayCommitment?: (id: string) => void;
  onCancelCommitment?: (id: string) => void;
  onDeleteCommitment?: (id: string) => void;
  onEditCommitment?: (item: UpcomingCommitment) => void;
}

export const UpcomingCommitments: React.FC<UpcomingCommitmentsProps> = ({
  commitments,
  currentDay,
  onOpenAddModal,
  onPayCommitment,
  onCancelCommitment,
  onDeleteCommitment,
  onEditCommitment,
}) => {
  const activeReserved = commitments.filter((c) => c.status === 'reserved' && c.isReserved);
  const totalReserved = activeReserved.reduce((acc, c) => acc + c.amount, 0);

  return (
    <Card variant="default" className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
            <Calendar className="w-4 h-4 text-accent-lime" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Upcoming Bills & Commitments
            </h3>
            <span className="text-xs text-zinc-400">
              Reserved & walled off from daily spending
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-zinc-500">Reserved:</span>
            <span className="font-bold text-zinc-100 tabular-nums">
              {formatINR(totalReserved)}
            </span>
          </div>
          {onOpenAddModal && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAddModal}
              icon={<Plus className="w-3.5 h-3.5" />}
              className="py-1 px-2 text-xs"
            >
              Add Bill
            </Button>
          )}
        </div>
      </div>

      {/* Accounting explanation note */}
      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2 mb-4 leading-relaxed">
        <Info className="w-4 h-4 text-accent-lime shrink-0 mt-0.5" />
        <span>
          <strong className="text-zinc-200">Zero-Surprise Protection:</strong> These {activeReserved.length} bills are not charged yet, but the full ₹{totalReserved} is deducted from your daily allowance now. Marking one as paid transfers it to recorded spending without reducing your remaining allowance.
        </span>
      </div>

      {/* Commitments List */}
      {commitments.length === 0 ? (
        <div className="text-center py-6 text-xs text-zinc-500 font-mono">
          No bills or subscriptions registered.
        </div>
      ) : (
        <div className="space-y-2.5">
          {commitments.map((item) => {
            const isReserved = item.status === 'reserved';
            const isPaid = item.status === 'paid';
            const isCancelled = item.status === 'cancelled';

            return (
              <div
                key={item.id}
                className={`p-3 rounded-lg border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isPaid
                    ? 'bg-zinc-950/40 border-zinc-800/50 opacity-70'
                    : isCancelled
                    ? 'bg-zinc-950/30 border-zinc-800/40 opacity-50 line-through'
                    : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0">
                    <Lock className={`w-3.5 h-3.5 ${isReserved ? 'text-accent-lime' : 'text-zinc-500'}`} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-zinc-100 truncate">
                        {item.title}
                      </span>
                      {item.isSubscription && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                          Subscription
                        </span>
                      )}
                      {item.autoDebit && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-accent-lime border border-accent-lime/20">
                          Auto-Debit
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5 font-mono">
                      {item.provider} • Due {item.dueDateLabel}
                      {isReserved && (
                        <span className="text-zinc-400 ml-1">
                          ({item.dueDay === currentDay ? 'today' : item.dueDay > currentDay ? `in ${item.dueDay - currentDay}d` : 'overdue'})
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <div className="text-[10px] text-zinc-400 mt-0.5 italic">
                        "{item.notes}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                  <div className="flex flex-col sm:items-end">
                    <span className="text-xs sm:text-sm font-bold text-zinc-100 font-mono tabular-nums">
                      {formatINR(item.amount)}
                    </span>
                    <span className="text-[10px] font-mono font-medium flex items-center gap-1">
                      {isReserved && (
                        <span className="text-accent-lime">Locked in pool</span>
                      )}
                      {isPaid && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Paid & cleared
                        </span>
                      )}
                      {isCancelled && (
                        <span className="text-zinc-500">Cancelled / Released</span>
                      )}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {isReserved && onPayCommitment && (
                      <button
                        type="button"
                        onClick={() => onPayCommitment(item.id)}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-accent-lime hover:text-zinc-950 text-zinc-200 border border-zinc-700 text-[11px] font-mono font-medium transition-colors cursor-pointer flex items-center gap-1"
                        title="Mark bill as paid"
                        aria-label={`Mark ${item.title} as paid`}
                      >
                        <Check className="w-3 h-3" />
                        Pay
                      </button>
                    )}

                    {isReserved && onCancelCommitment && (
                      <button
                        type="button"
                        onClick={() => onCancelCommitment(item.id)}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer"
                        title="Cancel subscription (releases reserved funds)"
                        aria-label={`Cancel ${item.title}`}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onEditCommitment && (
                      <button
                        type="button"
                        onClick={() => onEditCommitment(item)}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
                        title="Edit commitment"
                        aria-label={`Edit ${item.title}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onDeleteCommitment && (
                      <button
                        type="button"
                        onClick={() => onDeleteCommitment(item.id)}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete record"
                        aria-label={`Delete ${item.title}`}
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
    </Card>
  );
};
