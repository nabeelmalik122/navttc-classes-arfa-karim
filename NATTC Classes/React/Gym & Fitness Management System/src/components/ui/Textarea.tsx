import * as React from "react";
import { cn } from "@/utils/cn";
import { AlertCircle } from "lucide-react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | boolean;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || (label ? generatedId : undefined);
    const hasError = Boolean(error);
    const errorId = `${textareaId || generatedId}-error`;
    const helperId = `${textareaId || generatedId}-helper`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
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
            "flex min-h-[96px] w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-200 outline-none resize-y",
            "hover:border-[var(--color-border-active)]",
            "focus:border-[#dfff00] focus:ring-1 focus:ring-[#dfff00]",
            hasError && "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
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
Textarea.displayName = "Textarea";

export { Textarea };
