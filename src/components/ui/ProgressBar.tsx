import React from 'react';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  colorVariant?: 'lime' | 'emerald' | 'amber' | 'rose' | 'neutral' | 'dynamic';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  sublabel?: string;
  showPercent?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  colorVariant = 'lime',
  size = 'md',
  label,
  sublabel,
  showPercent = false,
  className = '',
  ...props
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  // Determine color dynamically if requested based on value
  const resolvedColor =
    colorVariant === 'dynamic'
      ? clampedValue > 85
        ? 'rose'
        : clampedValue > 65
        ? 'amber'
        : 'lime'
      : colorVariant;

  const colorStyles = {
    lime: 'bg-[#bef264]',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-red-400',
    neutral: 'bg-zinc-400',
  }[resolvedColor];

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3.5',
  }[size];

  return (
    <div className={`w-full ${className}`} {...props}>
      {(label || showPercent || sublabel) && (
        <div className="flex items-center justify-between text-xs mb-1.5 text-zinc-400">
          <span className="font-medium text-zinc-300">{label}</span>
          <div className="flex items-center gap-2">
            {sublabel && <span className="text-zinc-400 font-mono text-[11px]">{sublabel}</span>}
            {showPercent && (
              <span className="font-semibold text-zinc-100 font-mono text-xs tabular-nums">
                {Math.round(clampedValue)}%
              </span>
            )}
          </div>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(clampedValue)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
        className={`w-full bg-zinc-800 rounded-full overflow-hidden ${heightStyles}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
