import React from "react";
import { cn } from "@/utils/cn";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "default" | "lg" | "xl";
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = "default",
  label
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    default: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
    xl: "w-14 h-14 border-4",
  };

  return (
    <div className={cn("inline-flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "rounded-full border-[#1f1f26] border-t-[#dfff00] animate-spin",
          sizeClasses[size]
        )}
        role="status"
        aria-label={label || "Loading"}
      />
      {label && (
        <span className="text-xs font-mono tracking-widest text-[#a1a1aa] uppercase">
          {label}
        </span>
      )}
    </div>
  );
};
