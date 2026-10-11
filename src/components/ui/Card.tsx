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
    default: 'bg-[#121620] border-[#1f2737]',
    elevated: 'bg-[#161b27] border-[#263145] shadow-lg shadow-black/40',
    accent: 'bg-[#13191d] border-[#bef264]/30',
    subtle: 'bg-[#0e121a] border-[#18202d]',
  }[variant];

  const hoverStyles = hoverEffect
    ? 'transition-all duration-200 hover:border-[#2f3d56] hover:bg-[#151b27]'
    : '';

  const glowStyles = glow ? 'shadow-[0_0_25px_rgba(190,242,100,0.08)]' : '';

  return (
    <div
      className={`rounded-xl border p-5 text-[#E6EDF3] ${variantStyles} ${hoverStyles} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
