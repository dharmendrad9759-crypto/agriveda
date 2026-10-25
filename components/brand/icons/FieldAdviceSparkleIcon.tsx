import type { FC } from "react";
import type { AgriIconProps } from "./types";

/**
 * FieldAdviceSparkleIcon — Farm Agronomy Advisory & Daily Tips
 * Replaces generic sparkles with a morning sunrise over farmland furrows with wisdom rays.
 * Used in: "मेरी खेत सलाह" (Field Advice Hero Banner), daily agronomy tips, field advisor.
 */
export const FieldAdviceSparkleIcon: FC<AgriIconProps> = ({
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
      {/* Farmland Furrow Rows (Plowed Field Curves) */}
      <path d="M3 19.5C7.5 18 16.5 18 21 19.5" />
      <path d="M4.5 16C8 14.8 16 14.8 19.5 16" />
      {/* Rising Sun of Agricultural Wisdom */}
      <path d="M8 14A4 4 0 0 1 16 14" />
      {/* Central Wisdom Sprout-Ray */}
      <path d="M12 3V7" />
      {/* Sunrise Beams */}
      <path d="M6 7L8.5 9.5" />
      <path d="M18 7L15.5 9.5" />
      {/* Golden Grain Spark at Dawn */}
      <circle cx="12" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <path d="M20 4V6.5M18.8 5.2H21.2" />
    </svg>
  );
};

export default FieldAdviceSparkleIcon;
