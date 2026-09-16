import * as React from 'react';
import { cn } from '@/shared/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, suffix, error, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#63636E]">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-11 w-full rounded-xl bg-[#0B0B0E] border border-[#22222B] px-4 py-2 text-sm text-white placeholder:text-[#63636E] transition-all duration-200',
              'focus-visible:outline-none focus-visible:border-[#FF1E27] focus-visible:ring-2 focus-visible:ring-[#FF1E27]/25 focus-visible:bg-[#121217]',
              'disabled:cursor-not-allowed disabled:opacity-40',
              icon && 'pl-10',
              suffix && 'pr-12',
              error && 'border-[#FF1E27] focus-visible:ring-[#FF1E27]/40',
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3.5 flex items-center text-xs text-[#A1A1A6] font-mono">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-[#FF1E27] font-medium tracking-wide">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
