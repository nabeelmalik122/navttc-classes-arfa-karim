import React, { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, glow = false }) => {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-300',
        glow ? 'glass-panel-glow' : 'glass-panel',
        className
      )}
    >
      {children}
    </div>
  );
};
