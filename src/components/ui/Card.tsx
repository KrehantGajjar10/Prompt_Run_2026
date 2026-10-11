import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'accent' | 'subtle';
  hoverEffect?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hoverEffect = false,
  glow = false,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-zinc-900/50 border-zinc-800/80',
    elevated: 'bg-zinc-900 border-zinc-700/80 shadow-md shadow-black/30',
    accent: 'bg-zinc-900/80 border-[#bef264]/30',
    subtle: 'bg-zinc-950/50 border-zinc-800/60',
  }[variant];

  const hoverStyles = hoverEffect
    ? 'transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80'
    : '';

  const glowStyles = glow ? 'shadow-[0_0_20px_rgba(190,242,100,0.06)]' : '';

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 text-zinc-100 ${variantStyles} ${hoverStyles} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
