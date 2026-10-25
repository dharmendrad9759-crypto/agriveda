import type { FC } from "react";
import type { AgriIconProps } from "./types";

/**
 * SprayRotationSparkleIcon — Anti-Resistance Spray Schedule & Precision Protection
 * Replaces generic sparkles with a precision agricultural spray nozzle atomizing onto a protected crop shield.
 * Used in: Suggested Spray Cards, Spray rotation planner, pest resistance management.
 */
export const SprayRotationSparkleIcon: FC<AgriIconProps> = ({
  className = "",
  size = 24,
  strokeWidth = 2,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Precision Spray Nozzle */}
      <rect x="9.5" y="2.5" width="5" height="2.5" rx="0.8" />
      <path d="M12 5V7.5" />
      {/* Atomized Spray Mist Cone */}
      <path d="M10 8L6 13.5" />
      <path d="M12 8V14" />
      <path d="M14 8L18 13.5" />
      <circle cx="8.5" cy="11.2" r="0.65" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="11.2" r="0.65" fill="currentColor" stroke="none" />
      {/* Protected Leaf Foliage Shield */}
      <path d="M5.5 16.5C8 15.2 16 15.2 18.5 16.5C17.5 19.5 14.8 21.5 12 21.5C9.2 21.5 6.5 19.5 5.5 16.5Z" />
      <path d="M12 16V20.5" />
      {/* Safe Precision Sparkle */}
      <path d="M20 3V6M18.5 4.5H21.5" />
    </svg>
  );
};

export default SprayRotationSparkleIcon;
