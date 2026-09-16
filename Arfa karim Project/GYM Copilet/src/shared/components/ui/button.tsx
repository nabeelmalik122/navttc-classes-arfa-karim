import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1E27] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507] disabled:pointer-events-none disabled:opacity-40 select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-[#FF1E27] text-white hover:bg-[#E50914] shadow-[0_8px_24px_-4px_rgba(255,30,39,0.45)] hover:shadow-[0_12px_28px_-4px_rgba(255,30,39,0.6)] border border-[#FF1E27]',
        secondary:
          'bg-[#121217] text-[#F5F5F7] border border-[#22222B] hover:border-[#FF1E27]/50 hover:bg-[#1A1A22] hover:text-white shadow-sm',
        glass:
          'bg-[#0B0B0E]/70 backdrop-blur-xl text-white border border-white/10 hover:border-white/20 hover:bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
        outline:
          'border border-[#FF1E27] text-[#FF1E27] hover:bg-[#FF1E27] hover:text-white shadow-[0_0_15px_rgba(255,30,39,0.15)]',
        ghost:
          'text-[#A1A1A6] hover:text-white hover:bg-white/5',
        destructive:
          'bg-gradient-to-r from-[#FF1E27] to-[#8A0B10] text-white hover:opacity-90 shadow-[0_0_20px_rgba(255,30,39,0.3)]',
      },
      size: {
        sm: 'h-9 px-3.5 text-xs rounded-lg uppercase tracking-wider',
        default: 'h-11 px-5 text-sm uppercase tracking-wider font-bold',
        lg: 'h-13 px-8 text-sm uppercase tracking-wider font-bold rounded-xl',
        icon: 'h-11 w-11 p-0 rounded-xl',
        'icon-sm': 'h-9 w-9 p-0 rounded-lg',
      },
      glow: {
        true: 'shadow-[0_0_25px_rgba(255,30,39,0.5)] hover:shadow-[0_0_35px_rgba(255,30,39,0.7)]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      glow: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, glow, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, glow, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
