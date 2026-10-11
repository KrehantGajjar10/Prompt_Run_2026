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
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bef264] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#bef264] text-[#090a0f] hover:bg-[#d9f99d] active:bg-[#a3e635] font-semibold shadow-[0_0_15px_rgba(190,242,100,0.2)]',
    secondary:
      'bg-[#19212f] text-[#f1f5f9] border border-[#273549] hover:bg-[#222c3e] hover:border-[#384964] active:bg-[#151c28]',
    outline:
      'bg-transparent text-[#cbd5e1] border border-[#273549] hover:border-[#3b4c68] hover:bg-[#161f2e] text-[#e2e8f0]',
    ghost:
      'bg-transparent text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#17202d]',
    danger:
      'bg-[#f87171]/15 text-[#f87171] border border-[#f87171]/30 hover:bg-[#f87171]/25 active:bg-[#f87171]/35',
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
