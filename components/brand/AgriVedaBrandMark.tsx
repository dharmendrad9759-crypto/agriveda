"use client";

import { AgriVedaSparkleIcon } from "@/components/brand/icons";

type Props = {
  /** Tailwind size classes for the outer tile, e.g. h-9 w-9 or h-28 w-28 */
  sizeClassName?: string;
  /** AgriVeda brand icon size classes */
  iconClassName?: string;
  className?: string;
};

/**
 * Brand mark for MobileShellTopBar and splash — emerald→teal tile + bespoke AgriVeda Vedic Sprout.
 */
export default function AgriVedaBrandMark({
  sizeClassName = "h-9 w-9",
  iconClassName = "h-4 w-4",
  className = "",
}: Props) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-[0_6px_16px_rgba(5,150,105,0.35)] ${sizeClassName} ${className}`}
      aria-hidden
    >
      <AgriVedaSparkleIcon className={iconClassName} strokeWidth={2.2} />
    </span>
  );
}
