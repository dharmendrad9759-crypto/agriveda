import type { FC } from "react";
import type { AgriIconProps } from "./types";

/**
 * AgriWeatherSparkleIcon — Precision Agricultural Weather & Spray Window
 * Replaces generic tech sparkles with a micro-climate cloud + sunbeam nurturing a seedling.
 * Used in: Weather advisory cards, spray window checks, rain/wind alerts.
 */
export const AgriWeatherSparkleIcon: FC<AgriIconProps> = ({
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
      {/* Weather Cloud */}
      <path d="M15.5 13H7A3.5 3.5 0 0 1 6.2 6.1A4.5 4.5 0 0 1 14.5 8A3.5 3.5 0 0 1 15.5 13Z" />
      {/* Sun Rays & Golden Weather Radiance */}
      <path d="M17 4A3 3 0 0 1 20 7" />
      <path d="M19.5 2.5L20.8 1.2" />
      <path d="M22 6H23" />
      {/* Gentle Nurturing Rain/Dew Droplet */}
      <path d="M8.5 16.5L8 18.5" />
      <path d="M12 16.5L11.5 18.5" />
      {/* Weather-Responsive Young Shoot */}
      <path d="M17.5 21V16" />
      <path d="M17.5 18C15.8 18 15 17 15 15.8C16.2 15.8 17.2 16.6 17.5 18Z" />
      <path d="M17.5 17C19.2 17 20 16 20 14.8C18.8 14.8 17.8 15.6 17.5 17Z" />
    </svg>
  );
};

export default AgriWeatherSparkleIcon;
