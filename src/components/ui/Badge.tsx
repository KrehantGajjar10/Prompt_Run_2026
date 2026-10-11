import React from 'react';

export type BadgeVariant = 'lime' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    lime: 'bg-[#bef264]/10 text-[#bef264] border-[#bef264]/25',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    danger: 'bg-red-500/10 text-red-400 border-red-500/25',
    neutral: 'bg-zinc-800 text-zinc-300 border-zinc-700/80',
    outline: 'bg-transparent text-zinc-300 border-zinc-700',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-mono',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium font-mono',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded border tracking-wide uppercase font-semibold ${sizeStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
