import React, { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  isPositive,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden p-5 rounded-2xl bg-[#0D0E12] border border-[#232533] transition-all hover:border-[#CCFF00]/40',
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-[#9EA3B5] font-medium">{label}</span>
        {icon && <div className="text-[#CCFF00]">{icon}</div>}
      </div>
      <div className="text-2xl font-bold tracking-tight text-[#F5F6FA] font-mono">{value}</div>
      {change && (
        <div className="mt-2 text-xs flex items-center space-x-1">
          <span className={isPositive ? 'text-[#CCFF00]' : 'text-[#FF3366]'}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
          <span className="text-[#5E6377]">vs last period</span>
        </div>
      )}
    </div>
  );
};
