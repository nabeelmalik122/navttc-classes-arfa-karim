import React from 'react';
import { cn } from '@/shared/utils/cn';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatusBadgeProps {
  label: string;
  tone?: BadgeTone;
  pulse?: boolean;
  className?: string;
}

const toneStyles: Record<BadgeTone, { bg: string; text: string; dot: string }> = {
  success: { bg: 'bg-[#CCFF00]/10', text: 'text-[#CCFF00]', dot: 'bg-[#CCFF00]' },
  warning: { bg: 'bg-[#FF6B00]/10', text: 'text-[#FF6B00]', dot: 'bg-[#FF6B00]' },
  danger: { bg: 'bg-[#FF3366]/10', text: 'text-[#FF3366]', dot: 'bg-[#FF3366]' },
  info: { bg: 'bg-[#00F0FF]/10', text: 'text-[#00F0FF]', dot: 'bg-[#00F0FF]' },
  neutral: { bg: 'bg-white/10', text: 'text-[#9EA3B5]', dot: 'bg-[#9EA3B5]' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  tone = 'neutral',
  pulse = false,
  className,
}) => {
  const styles = toneStyles[tone];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium',
        styles.bg,
        styles.text,
        className
      )}
    >
      <span
        className={cn('w-1.5 h-1.5 rounded-full', styles.dot, pulse && 'animate-ping')}
      />
      {label}
    </span>
  );
};
