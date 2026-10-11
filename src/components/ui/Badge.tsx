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
    success: 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/25',
    warning: 'bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/25',
    danger: 'bg-[#f87171]/10 text-[#f87171] border-[#f87171]/25',
    neutral: 'bg-[#1e2534] text-[#94a3b8] border-[#29354a]',
    outline: 'bg-transparent text-[#cbd5e1] border-[#2a364b]',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide uppercase font-semibold ${sizeStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
