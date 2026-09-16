import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfff00] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-canvas)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-interactive)] hover:border-[var(--color-border-active)] hover:-translate-y-[1px] shadow-sm",
        volt:
          "bg-[#dfff00] text-[#08080a] hover:bg-[#ebff33] hover:-translate-y-[1px] font-bold tracking-tight shadow-[0_0_20px_rgba(223,255,0,0.22)] hover:shadow-[0_0_26px_rgba(223,255,0,0.35)]",
        blue:
          "bg-[#4f9dff] text-[#08080a] hover:bg-[#6baeff] hover:-translate-y-[1px] font-bold tracking-tight shadow-[0_0_18px_rgba(79,157,255,0.22)] hover:shadow-[0_0_24px_rgba(79,157,255,0.35)]",
        secondary:
          "bg-[var(--color-surface-card)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-border-active)] hover:-translate-y-[1px]",
        outline:
          "border border-[var(--color-border-subtle)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-card)] hover:border-[var(--color-border-active)] hover:-translate-y-[1px]",
        ghost:
          "hover:bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
        destructive:
          "bg-red-950/80 text-[#ef4444] border border-red-900/60 hover:bg-red-900/80 hover:text-red-300 hover:-translate-y-[1px]",
        glass:
          "glass-panel text-[var(--color-text-primary)] hover:bg-white/10 border-white/10 hover:border-white/20 hover:-translate-y-[1px]",
      },
      size: {
        default: "h-11 min-h-[44px] px-5 py-2.5",
        sm: "h-9 min-h-[36px] rounded-lg px-3.5 text-xs",
        lg: "h-13 min-h-[48px] rounded-xl px-8 text-base font-bold",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
  ({ className, variant, size, fullWidth, isLoading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading ? "true" : undefined}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
