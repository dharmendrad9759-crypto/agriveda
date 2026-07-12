"use client";

import { cn } from "@/lib/cn";
import {
  SERVICE_ICON_ASPECT,
  serviceSpriteStyle,
  type AgrivedaServiceIconItem,
} from "@/lib/services/agrivedaServiceIcons";

interface AgrivedaServiceIconProps {
  item: Pick<AgrivedaServiceIconItem, "col" | "row" | "labelHi" | "labelEn">;
  className?: string;
  /** Show Hindi label from sprite only (default) or add accessible text for screen readers */
  showAccessibleLabel?: boolean;
}

/** Single cell from the Agriveda 3×6 service icon sprite sheet. */
export default function AgrivedaServiceIcon({
  item,
  className,
  showAccessibleLabel = false,
}: AgrivedaServiceIconProps) {
  return (
    <div className={cn("w-full", className)}>
      <div
        className="w-full overflow-hidden rounded-2xl shadow-[var(--av-shadow-sm)] ring-1 ring-[var(--av-border-subtle)] transition-transform duration-150 group-hover:scale-[1.02] group-active:scale-[0.98]"
        style={{
          aspectRatio: String(SERVICE_ICON_ASPECT),
          ...serviceSpriteStyle(item.col, item.row),
        }}
        role="img"
        aria-label={item.labelHi}
      />
      {showAccessibleLabel && (
        <span className="sr-only">
          {item.labelHi} ({item.labelEn})
        </span>
      )}
    </div>
  );
}
