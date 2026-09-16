import React from 'react';
import { cn } from '@/shared/utils/cn';

interface KineticLoaderProps {
  label?: string;
  className?: string;
}

export const KineticLoader: React.FC<KineticLoaderProps> = ({
  label = 'Loading GymOS...',
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 space-y-4', className)}>
      <div className="w-10 h-10 border-2 border-[#232533] border-t-[#CCFF00] rounded-full animate-spin" />
      <span className="text-xs uppercase tracking-widest text-[#9EA3B5] font-mono">{label}</span>
    </div>
  );
};
