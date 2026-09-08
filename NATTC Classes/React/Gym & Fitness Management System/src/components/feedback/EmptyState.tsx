import React from "react";
import { type LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#1f1f26] bg-[#121217] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-[#0d0d11] border border-[#1f1f26] flex items-center justify-center text-[#71717a] shadow-inner">
        <Icon className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white uppercase font-['Outfit'] tracking-wide">
          {title}
        </h3>
        <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <Button variant="volt" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
