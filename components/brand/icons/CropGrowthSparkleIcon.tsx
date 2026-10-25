import type { FC } from "react";
import type { AgriIconProps } from "./types";

/**
 * CropGrowthSparkleIcon — Crop Stage & Vigor Milestone Icon
 * Replaces generic sparkles with an active growing plant shoot + growth energy vitality rings.
 * Used in: Crop status cards, growth stage milestones, tillering & flowering tracking.
 */
export const CropGrowthSparkleIcon: FC<AgriIconProps> = ({
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
      {/* Soil Baseline */}
      <path d="M8 21H16" />
      {/* Central Crop Stalk */}
      <path d="M12 21V8" />
      {/* Lower Vegetative Leaf */}
      <path d="M12 16C8.8 16 7.2 14 7.2 11.8C9.6 11.8 11.5 13.6 12 16Z" />
      {/* Upper Flourishing Leaf */}
      <path d="M12 13C15.2 13 16.8 11 16.8 8.8C14.4 8.8 12.5 10.6 12 13Z" />
      {/* Budding Grain Stalk Apex */}
      <path d="M12 8C11 6 12 3.5 12 3.5S13 6 12 8Z" />
      {/* Dynamic Growth Vitality Ring */}
      <path d="M8.5 5A5 5 0 0 1 15.5 5" />
      <circle cx="19.5" cy="5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
};

export default CropGrowthSparkleIcon;
