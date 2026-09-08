import React from "react";
import { cn } from "@/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[#121217] border border-[#1f1f26]/60",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
};
