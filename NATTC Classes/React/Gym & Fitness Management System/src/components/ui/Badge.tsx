import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "border-[#1f1f26] bg-[#121217] text-[#a1a1aa]",
        neutral: "border-[#1f1f26] bg-[#121217] text-[#a1a1aa]",
        volt: "border-[#dfff00]/40 bg-[#dfff00]/10 text-[#dfff00] shadow-[0_0_12px_rgba(223,255,0,0.15)]",
        active: "border-[#dfff00]/40 bg-[#dfff00]/10 text-[#dfff00] shadow-[0_0_12px_rgba(223,255,0,0.15)]",
        secondary: "border-transparent bg-[#0d0d11] text-[#a1a1aa]",
        destructive: "border-red-900/50 bg-red-950/40 text-[#ef4444]",
        danger: "border-red-900/50 bg-red-950/40 text-[#ef4444]",
        outline: "border-[#1f1f26] bg-transparent text-[#71717a]",
        success: "border-emerald-800/50 bg-emerald-950/40 text-[#10b981]",
        warning: "border-amber-800/50 bg-amber-950/40 text-[#f59e0b]",
        info: "border-blue-800/50 bg-blue-950/40 text-[#3b82f6]",
        purple: "border-purple-800/50 bg-purple-950/40 text-purple-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const dotColors: Record<string, string> = {
  default: "bg-[#71717a]",
  neutral: "bg-[#71717a]",
  volt: "bg-[#dfff00]",
  active: "bg-[#dfff00]",
  secondary: "bg-[#71717a]",
  destructive: "bg-[#ef4444]",
  danger: "bg-[#ef4444]",
  outline: "bg-[#71717a]",
  success: "bg-[#10b981]",
  warning: "bg-[#f59e0b]",
  info: "bg-[#3b82f6]",
  purple: "bg-purple-400"
};

function Badge({ className, variant = "default", dot = false, children, ...props }: BadgeProps) {
  const currentVariant = variant || "default";
  return (
    <div className={cn(badgeVariants({ variant: currentVariant }), className)} {...props}>
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full mr-1.5 shrink-0", dotColors[currentVariant] || "bg-[#71717a]")}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
