import type { FC } from "react";
import type { AgriIconProps } from "./types";

/**
 * GovtSchemeSparkleIcon — Government Krishi Schemes, Subsidies & Grants
 * Replaces generic tech sparkles with golden ears of wheat framing a subsidy prosperity seal.
 * Used in: PM-Kisan & state schemes, eligibility badges, subsidy grant amounts.
 */
export const GovtSchemeSparkleIcon: FC<AgriIconProps> = ({
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
      {/* Central Prosperity / Grant Star */}
      <path d="M12 2.5L13.2 5.5L16.5 6L14 8.2L14.7 11.5L12 9.8L9.3 11.5L10 8.2L7.5 6L10.8 5.5L12 2.5Z" />
      {/* Left Golden Wheat Ear */}
      <path d="M6 21.5C6.8 17.5 8.5 13.5 10 11" />
      <path d="M6.2 16.5C4.8 15.8 4.8 14.5 6 13.8C7 14.8 7 15.8 6.2 16.5Z" />
      <path d="M7.8 12.8C6.5 12.2 6.5 11 7.6 10.4C8.5 11.2 8.5 12.2 7.8 12.8Z" />
      {/* Right Golden Wheat Ear */}
      <path d="M18 21.5C17.2 17.5 15.5 13.5 14 11" />
      <path d="M17.8 16.5C19.2 15.8 19.2 14.5 18 13.8C17 14.8 17 15.8 17.8 16.5Z" />
      <path d="M16.2 12.8C17.5 12.2 17.5 11 16.4 10.4C15.5 11.2 15.5 12.2 16.2 12.8Z" />
      {/* Golden Kisan Benefit Emblem */}
      <circle cx="12" cy="16.5" r="2.8" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
};

export default GovtSchemeSparkleIcon;
