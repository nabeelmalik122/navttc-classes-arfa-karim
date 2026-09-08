import React from "react";

interface IronyxLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export const IronyxLogo: React.FC<IronyxLogoProps> = ({
  className = "w-5 h-5",
  size = 24,
  color = "#dfff00",
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M50 8 A42 42 0 1 1 8 50"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <polyline
        points="22,50 36,50 43,32 55,68 62,50 78,50"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const IronxLogo = IronyxLogo;
export default IronyxLogo;
