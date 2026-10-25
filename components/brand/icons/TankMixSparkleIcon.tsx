import type { FC } from "react";
import type { AgriIconProps } from "./types";

/**
 * TankMixSparkleIcon — Safe Chemical Mixing & Tank Compatibility Icon
 * Replaces generic tech sparkles with an agro-chemical flask + synergy leaf and safety shield.
 * Used in: Tank Mix Advisor, Jar test recommendations, pesticide-fungicide compatibility.
 */
export const TankMixSparkleIcon: FC<AgriIconProps> = ({
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
      {/* Laboratory Flask Contour */}
      <path d="M9 3H15" />
      <path d="M10 3V6.5L5.8 15.5C5 17.2 6.2 19.5 8 19.5H16C17.8 19.5 19 17.2 18.2 15.5L14 6.5V3" />
      {/* Safe Solution Level */}
      <path d="M7.5 12.8C9.5 12.2 14.5 12.2 16.5 12.8" />
      {/* Botanical Synergistic Leaf in Safe Solution */}
      <path d="M12 13.8C10.5 14.6 10 16 10.5 17.2C11.8 17.2 12.8 16.4 13.2 15.2C12.8 14.6 12.4 14.2 12 13.8Z" />
      {/* Chemical Compatibility Sparkle */}
      <path d="M19.5 2.5V5.5M18 4H21" />
      <circle cx="5" cy="5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
};

export default TankMixSparkleIcon;
