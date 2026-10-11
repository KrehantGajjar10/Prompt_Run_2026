import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bef264] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#bef264] text-zinc-950 hover:bg-[#d9f99d] active:bg-[#a3e635] font-semibold shadow-sm shadow-[#bef264]/10',
    secondary:
      'bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700/70 hover:text-zinc-100 active:bg-zinc-800',
    outline:
      'bg-transparent text-zinc-200 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 text-zinc-200',
    ghost:
      'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80',
    danger:
      'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 active:bg-red-500/30',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
