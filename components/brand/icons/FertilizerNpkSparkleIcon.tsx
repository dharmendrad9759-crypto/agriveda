import type { FC } from "react";
import type { AgriIconProps } from "./types";

/**
 * FertilizerNpkSparkleIcon — Soil Nutrition & Balanced NPK Calculator
 * Replaces generic tech sparkles with a mineral nutrient crystal feeding into deep soil roots.
 * Used in: Fertilizer Calculator, NPK ratio recommendations, nano-fertilizer dosing, soil health.
 */
export const FertilizerNpkSparkleIcon: FC<AgriIconProps> = ({
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
      {/* Mineral Nutrient Crystal (N-P-K Molecule) */}
      <path d="M12 2.5L18 6L12 9.5L6 6L12 2.5Z" />
      <path d="M12 2.5V9.5" />
      {/* Soil Horizon Line */}
      <path d="M3.5 14H20.5" />
      {/* Soil Absorption Feed */}
      <path d="M12 9.5V14" />
      {/* Root Uptake System Below Ground */}
      <path d="M12 14V21.5" />
      <path d="M9.5 16C8 18 6.5 19.2 5 20" />
      <path d="M14.5 16C16 18 17.5 19.2 19 20" />
      {/* Micronutrient Radiance */}
      <path d="M20 3.5V6M18.8 4.8H21.2" />
      <circle cx="4" cy="5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
};

export default FertilizerNpkSparkleIcon;
