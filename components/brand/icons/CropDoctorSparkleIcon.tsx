import type { FC } from "react";
import type { AgriIconProps } from "./types";

/**
 * CropDoctorSparkleIcon — AI Crop Doctor & Disease Clinic Icon
 * Replaces generic tech sparkles with a medicinal botanical leaf + clinical pulse ray.
 * Used in: Crop Doctor badges, AI disease scanner cards, diagnostic results.
 */
export const CropDoctorSparkleIcon: FC<AgriIconProps> = ({
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
      {/* Medicinal Diagnostic Leaf Contour */}
      <path d="M12 2.5C7.8 5.8 5.5 10.5 7.2 15.2C8.5 18.6 12 20.5 12 20.5S15.5 18.6 16.8 15.2C18.5 10.5 16.2 5.8 12 2.5Z" />
      {/* Clinical Diagnostic Health Pulse along Leaf Spine */}
      <path d="M8.5 12H10.2L11.2 9.5L12.8 14.5L13.8 12H15.5" />
      {/* Diagnostic Laser Sparkle at Apex */}
      <path d="M19 3V6M17.5 4.5H20.5" />
      {/* Healing Dew Point */}
      <circle cx="5" cy="7" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
};

export default CropDoctorSparkleIcon;
