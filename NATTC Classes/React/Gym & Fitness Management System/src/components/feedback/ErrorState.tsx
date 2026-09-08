import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Telemetry Synchronization Error",
  message = "An unexpected error occurred while communicating with the data engine.",
  onRetry,
  className
}) => {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-2xl border border-red-900/40 bg-red-950/20 p-8 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-900/60 flex items-center justify-center text-[#ef4444]">
        <AlertTriangle className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white uppercase font-['Outfit'] tracking-wide">
          {title}
        </h3>
        <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-xs mx-auto">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" /> Retry Request
        </Button>
      )}
    </div>
  );
};
