import * as React from "react";
import { cn } from "@/utils/cn";
import { AlertCircle } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string | boolean;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, label, error, helperText, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || (label ? generatedId : undefined);
    const hasError = Boolean(error);
    const errorId = `${inputId || generatedId}-error`;
    const helperId = `${inputId || generatedId}-helper`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <div
              className="absolute left-3.5 text-[var(--color-text-muted)] pointer-events-none flex items-center justify-center"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={
              hasError && typeof error === "string"
                ? errorId
                : helperText
                ? helperId
                : undefined
            }
            className={cn(
              "flex h-11 w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-200 outline-none",
              "hover:border-[var(--color-border-active)]",
              "focus:border-[#dfff00] focus:ring-1 focus:ring-[#dfff00]",
              hasError && "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-11",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {hasError && typeof error === "string" && (
          <p
            id={errorId}
            className="flex items-center gap-1.5 text-xs text-[#ef4444] font-medium pt-0.5"
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
        {!hasError && helperText && (
          <p id={helperId} className="text-xs text-[var(--color-text-muted)] pt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
