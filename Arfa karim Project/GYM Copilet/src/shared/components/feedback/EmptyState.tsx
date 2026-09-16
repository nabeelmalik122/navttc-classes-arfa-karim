import React, { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#0D0E12] border border-[#232533]', className)}>
      {icon && <div className="mb-4 text-[#9EA3B5]">{icon}</div>}
      <h3 className="text-lg font-semibold text-[#F5F6FA] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#9EA3B5] max-w-sm mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
