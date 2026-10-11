import React, { useState } from 'react';
import {
  Plus,
  Check,
  Ban,
  Lock,
  CheckCircle2,
  Trash2,
  Edit2,
  Info,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useFinance } from '../../context/useFinance';
import { formatINR } from '../../lib/currency';
import type { UpcomingCommitment } from '../../types/commitment';

export interface CommitmentsViewProps {
  onOpenAddModal: () => void;
  onEditCommitment: (item: UpcomingCommitment) => void;
}

export const CommitmentsView: React.FC<CommitmentsViewProps> = ({
  onOpenAddModal,
  onEditCommitment,
}) => {
  const finance = useFinance();
  const [statusFilter, setStatusFilter] = useState<'all' | 'reserved' | 'paid' | 'cancelled'>('all');

  const filtered = finance.commitments.filter((c) => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const activeReserved = finance.commitments.filter((c) => c.status === 'reserved');
  const paidCommitments = finance.commitments.filter((c) => c.status === 'paid');
  const cancelledCommitments = finance.commitments.filter((c) => c.status === 'cancelled');

  const totalReserved = activeReserved.reduce((sum, c) => sum + c.amount, 0);
  const totalPaid = paidCommitments.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 font-sans">
            Bills & Subscriptions
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Manage mandatory commitments, recurring payments, and protection pools
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenAddModal}
          icon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Add Bill / Subscription
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="subtle" className="p-4">
          <span className="text-[11px] font-mono uppercase text-zinc-400">Reserved (Protected Pool)</span>
          <div className="text-2xl font-bold text-accent-lime font-mono tabular-nums mt-1">
            {formatINR(totalReserved)}
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            {activeReserved.length} pending bill{activeReserved.length === 1 ? '' : 's'} walled off
          </span>
        </Card>

        <Card variant="subtle" className="p-4">
          <span className="text-[11px] font-mono uppercase text-zinc-400">Paid This Cycle</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
            {formatINR(totalPaid)}
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            {paidCommitments.length} bill{paidCommitments.length === 1 ? '' : 's'} cleared into expenses
          </span>
        </Card>

        <Card variant="subtle" className="p-4">
          <span className="text-[11px] font-mono uppercase text-zinc-400">Cancelled / Released</span>
          <div className="text-2xl font-bold text-zinc-300 font-mono tabular-nums mt-1">
            {cancelledCommitments.length}
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            Subscriptions successfully avoided
          </span>
        </Card>
      </div>

      {/* Accounting Explainer Banner */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-accent-lime shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-zinc-200">How Commitment Accounting Operates:</div>
          <p className="leading-relaxed">
            • <strong>Reserved bills</strong> reduce your daily safe allowance upfront so you cannot accidentally spend rent or phone recharge money.
            <br />
            • <strong>Marking a bill as paid</strong> transfers its amount to actual recorded spending, reducing reserved commitments by the exact same amount. Your daily safe allowance does <em>not</em> drop again.
            <br />
            • <strong>Cancelling a subscription</strong> immediately frees its reserved funds back into your available discretionary balance.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-lg border border-zinc-800 w-fit text-xs font-mono">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          All ({finance.commitments.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('reserved')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            statusFilter === 'reserved'
              ? 'bg-accent-lime text-zinc-950 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Reserved ({activeReserved.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('paid')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            statusFilter === 'paid'
              ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Paid ({paidCommitments.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('cancelled')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            statusFilter === 'cancelled'
              ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Cancelled ({cancelledCommitments.length})
        </button>
      </div>

      {/* Commitments Table / List */}
      <Card variant="default" className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4 text-xs text-zinc-400 font-mono">
            No commitments found in this filter category.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {filtered.map((item) => {
              const isReserved = item.status === 'reserved';
              const isPaid = item.status === 'paid';
              const isCancelled = item.status === 'cancelled';
              const daysUntil = item.dueDay - finance.currentDay;

              return (
                <div
                  key={item.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isPaid
                      ? 'bg-zinc-950/40 opacity-75'
                      : isCancelled
                      ? 'bg-zinc-950/20 opacity-50 line-through'
                      : 'hover:bg-zinc-800/30'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0">
                      <Lock className={`w-4 h-4 ${isReserved ? 'text-accent-lime' : 'text-zinc-400'}`} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-zinc-100">
                          {item.title}
                        </span>
                        {item.isSubscription && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                            Subscription
                          </span>
                        )}
                        {item.autoDebit && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-accent-lime border border-accent-lime/20">
                            Auto-Debit
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-400 font-mono mt-0.5">
                        {item.provider} • Due {item.dueDateLabel}
                      </div>
                      {item.notes && (
                        <div className="text-xs text-zinc-400 italic mt-0.5">
                          "{item.notes}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-end gap-3 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                      <span className="text-base font-bold text-zinc-100 font-mono tabular-nums">
                        {formatINR(item.amount)}
                      </span>
                      <span className="text-xs font-mono ml-2 sm:ml-0">
                        {isReserved && (
                          <span className="text-accent-lime font-medium">
                            {daysUntil > 0 ? `Due in ${daysUntil} days` : 'Due today'}
                          </span>
                        )}
                        {isPaid && (
                          <span className="text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cleared in expenses
                          </span>
                        )}
                        {isCancelled && (
                          <span className="text-zinc-400">Released</span>
                        )}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {isReserved && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => finance.payCommitment(item.id)}
                            icon={<Check className="w-3.5 h-3.5" />}
                          >
                            Mark Paid
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => finance.cancelCommitment(item.id)}
                            icon={<Ban className="w-3.5 h-3.5" />}
                            title="Cancel subscription and release reserved funds"
                          >
                            Cancel
                          </Button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => onEditCommitment(item)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        title="Edit commitment"
                        aria-label={`Edit ${item.title}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => finance.deleteCommitment(item.id)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 cursor-pointer"
                        title="Delete commitment"
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
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
