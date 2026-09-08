import React from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
}

/**
 * Standardized Interactive Card Container.
 * 
 * In accordance with Phase 3.4 motion guidelines, extreme 3D perspective distortion
 * and specular glare are neutralized in favor of restrained Level 1 titanium border
 * illumination. API is preserved for 100% backwards compatibility.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`relative rounded-2xl border border-[#1f1f26] hover:border-[#2e2e38] transition-colors duration-200 ${className}`}
    >
      {children}
    </div>
  );
};
