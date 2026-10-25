import type { FC } from "react";
import type { AgriIconProps } from "./types";

/**
 * AgriAiQuerySparkleIcon — AI Farmer Voice & Text Query Assistant
 * Replaces generic tech sparkles with an acoustic speech bubble blossoming into an agricultural intelligence flower.
 * Used in: Ask Query / AI Krishi Salah chat, audio voice question input.
 */
export const AgriAiQuerySparkleIcon: FC<AgriIconProps> = ({
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
      {/* Conversational Speech Bubble */}
      <path d="M12 3.5C6.8 3.5 2.5 7.1 2.5 11.5C2.5 13.8 3.6 15.8 5.4 17.2V21L9.3 19.3C10.2 19.8 11.1 20 12 20C17.2 20 21.5 16.4 21.5 11.5C21.5 6.6 17.2 3.5 12 3.5Z" />
      {/* Inner Agricultural Blossom of Intelligence */}
      <path d="M12 7.5C12 9.5 10.5 11 8.5 11C10.5 11 12 12.5 12 14.5C12 12.5 13.5 11 15.5 11C13.5 11 12 9.5 12 7.5Z" />
      <circle cx="12" cy="11" r="0.8" fill="currentColor" stroke="none" />
      {/* AI Acoustic Wave */}
      <path d="M19 3A4 4 0 0 1 22 7" />
    </svg>
  );
};

export default AgriAiQuerySparkleIcon;
