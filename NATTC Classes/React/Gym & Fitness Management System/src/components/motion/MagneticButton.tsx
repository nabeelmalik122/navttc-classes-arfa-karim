import React from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
}

/**
 * Standardized Button Wrapper.
 * 
 * In accordance with Phase 3.4 motion guidelines, aggressive magnetic pull
 * is neutralized in favor of restrained Level 1 micro-interaction press feedback.
 * API is preserved for 100% backwards compatibility.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = "",
  onClick,
}) => {
  return (
    <div
      className={`inline-block active:scale-[0.98] transition-transform duration-150 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
