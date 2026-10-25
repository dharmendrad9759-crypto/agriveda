import type { FC } from "react";
import type { AgriIconProps } from "./types";

/**
 * CropMedicineSparkleIcon — Recommended Field Medicine & Bio-Remedies
 * Replaces generic tech sparkles with a medicinal capsule intertwined with botanical healing shoots.
 * Used in: Field Medicine dosage panels, organic remedies, bio-pesticide timing.
 */
export const CropMedicineSparkleIcon: FC<AgriIconProps> = ({
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
      {/* Medicine Capsule Body */}
      <rect x="8" y="2.5" width="8" height="15" rx="4" />
      <path d="M8 10H16" />
      {/* Clinical Cure Plus inside Upper Dome */}
      <path d="M12 5.5V8.5" />
      <path d="M10.5 7H13.5" />
      {/* Botanical Healing Sprout Rooted from Medicine Base */}
      <path d="M12 17.5V22" />
      <path d="M12 19C10 19 9 20 9 21.2C10.5 21.2 11.5 20.2 12 19Z" />
      <path d="M12 20C14 20 15 20.8 15 22C13.5 22 12.5 21 12 20Z" />
      {/* Remedial Cure Sparkle */}
      <path d="M19.5 2.5V5M18.2 3.8H20.8" />
    </svg>
  );
};

export default CropMedicineSparkleIcon;
