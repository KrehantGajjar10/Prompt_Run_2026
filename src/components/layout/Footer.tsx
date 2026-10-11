import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/80 text-zinc-400 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <p className="font-mono text-zinc-300">
            Broke But Functional — Digital Survival Ledger
          </p>
          <p className="text-[11px] text-zinc-400 max-w-lg text-center sm:text-left">
            Strict Non-Duplicative Formula: Starting Budget (₹10k) + Inflows = Spent + Reserved Bills + Locked Savings + Available Balance.
          </p>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400 flex-wrap justify-center sm:justify-end">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-lime" />
            Zero Double-Counting
          </span>
          <span className="text-zinc-700">•</span>
          <span>Verified Client Persistence</span>
          <span className="text-zinc-700">•</span>
          <span>30-Day Budget Engine</span>
        </div>
      </div>
    </footer>
  );
};
