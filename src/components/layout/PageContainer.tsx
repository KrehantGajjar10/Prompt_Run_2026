import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <main id="main-content" tabIndex={-1} className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 w-full min-w-0 overflow-x-hidden focus:outline-none ${className}`}>
      {children}
    </main>
  );
};
