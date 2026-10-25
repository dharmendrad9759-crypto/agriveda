import type { FC } from "react";
import type { AgriIconProps } from "./types";

/**
 * FarmerTourSparkleIcon — Farmer App Walkthrough & Farm Compass Guide
 * Replaces generic tech sparkles with an agricultural 4-point grain compass guiding the farmer.
 * Used in: Farmer Tour, Onboarding gates, step-by-step guidance highlights.
 */
export const FarmerTourSparkleIcon: FC<AgriIconProps> = ({
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
      {/* North Grain Pointer */}
      <path d="M12 2C10.8 4.2 10.8 6.5 12 8C13.2 6.5 13.2 4.2 12 2Z" />
      {/* South Grain Pointer */}
      <path d="M12 22C10.8 19.8 10.8 17.5 12 16C13.2 17.5 13.2 19.8 12 22Z" />
      {/* East Grain Pointer */}
      <path d="M22 12C19.8 10.8 17.5 10.8 16 12C17.5 13.2 19.8 13.2 22 12Z" />
      {/* West Grain Pointer */}
      <path d="M2 12C4.2 10.8 6.5 10.8 8 12C6.5 13.2 4.2 13.2 2 12Z" />
      {/* Central Compass Pivot & Seed Hub */}
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      {/* Diagonal Guidance Beams */}
      <path d="M6 6L7.8 7.8" />
      <path d="M18 6L16.2 7.8" />
      <path d="M6 18L7.8 16.2" />
      <path d="M18 18L16.2 16.2" />
    </svg>
  );
};

export default FarmerTourSparkleIcon;
