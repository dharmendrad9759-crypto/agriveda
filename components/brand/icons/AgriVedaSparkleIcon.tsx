import type { FC } from "react";
import type { AgriIconProps } from "./types";

/**
 * AgriVedaSparkleIcon — Custom Agricultural Brand Hallmark
 * Replaces generic 4-pointed tech sparkle with a bespoke Vedic Sprout + Radiant Star.
 * Symbolizes Vedic agricultural wisdom ("Veda") rooted in nature and modern intelligence.
 */
export const AgriVedaSparkleIcon: FC<AgriIconProps> = ({
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
      {/* Upper Radiant Vedic Star (Wisdom / AI) */}
      <path d="M12 2L13.6 5.8L17.5 7.2L13.6 8.8L12 12.5L10.4 8.8L6.5 7.2L10.4 5.8L12 2Z" />
      {/* Sprout Stem */}
      <path d="M12 12.5V21" />
      {/* Left Sprout Leaf */}
      <path d="M12 16.5C9 16.5 7.5 15 7 13C9 13 11 14.5 12 16.5Z" />
      {/* Right Sprout Leaf */}
      <path d="M12 18C15 18 16.5 16.5 17 14.5C15 14.5 13 16 12 18Z" />
      {/* Diagonal Wisdom Sparks */}
      <circle cx="19" cy="4" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="19.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
};

export default AgriVedaSparkleIcon;
