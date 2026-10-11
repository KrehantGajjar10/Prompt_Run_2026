import React from 'react';
import { ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#1a2230] bg-[#090c12] py-8 text-xs text-[#64748b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#94a3b8]">
            <ShieldCheck className="w-4 h-4 text-accent-lime" />
            <span className="font-medium text-[#cbd5e1]">
              Strict Accounting Rule:
            </span>
            <span>
              Starting Budget (₹10,000) = Spent + Reserved Bills + Locked Savings + Available Balance.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#94a3b8]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-lime" />
              Chapter 1: Foundation & Dashboard
            </span>
            <span className="text-[#334155]">•</span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#38bdf8]" />
              Tailwind CSS v4 + React + TypeScript
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#141b27] text-center text-[#475569]">
          Broke But Functional — Designed for Gen Z survival on a tight monthly budget. No double-counting, no surprise overdrafts.
        </div>
      </div>
    </footer>
  );
};
