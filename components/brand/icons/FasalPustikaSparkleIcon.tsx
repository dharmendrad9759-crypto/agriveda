import type { FC } from "react";
import type { AgriIconProps } from "./types";

/**
 * FasalPustikaSparkleIcon — Package of Practices & Crop Guide Handbook
 * Replaces generic tech sparkles with an open agricultural manuscript blossoming into botanical leaves.
 * Used in: Fasal Pustika (Crop Guide), Package of Practices, stage-by-stage agronomic handbook.
 */
export const FasalPustikaSparkleIcon: FC<AgriIconProps> = ({
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
      {/* Open Agricultural Handbook Pages */}
      <path d="M2 8.5C5.5 7 9 7 12 8.5C15 7 18.5 7 22 8.5V20.5C18.5 19 15 19 12 20.5C9 19 5.5 19 2 20.5V8.5Z" />
      <path d="M12 8.5V20.5" />
      {/* Blooming Knowledge Shoot from the Book Spine */}
      <path d="M12 8.5V3" />
      <path d="M12 6.5C10 6.5 9 5.2 9 3.8C10.5 3.8 11.5 4.8 12 6.5Z" />
      <path d="M12 4.8C14 4.8 15 3.5 15 2.2C13.5 2.2 12.5 3.2 12 4.8Z" />
      {/* Enlightenment Wisdom Rays */}
      <path d="M6 3.5L7.8 5.2" />
      <path d="M18 3.5L16.2 5.2" />
    </svg>
  );
};

export default FasalPustikaSparkleIcon;
