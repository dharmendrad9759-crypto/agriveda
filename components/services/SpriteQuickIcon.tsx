"use client";

import { Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  SERVICE_SPRITE_COLS,
  SERVICE_SPRITE_ROWS,
  SERVICE_SPRITE_URL,
} from "@/lib/services/agrivedaServiceIcons";

interface SpriteQuickIconProps {
  col: number;
  row: number;
  className?: string;
  label: string;
}

/** Icon-only crop from sprite — centered in round quick-action buttons (Hindi label strip hidden). */
export function SpriteQuickIcon({ col, row, className, label }: SpriteQuickIconProps) {
  const x = (col / (SERVICE_SPRITE_COLS - 1)) * 100;
  const y = ((row + 0.2) / (SERVICE_SPRITE_ROWS - 1)) * 100;

  return (
    <span
      className={cn("absolute inset-1 overflow-hidden rounded-full", className)}
      style={{
        backgroundImage: `url('${SERVICE_SPRITE_URL}')`,
        backgroundSize: `${SERVICE_SPRITE_COLS * 100}% ${SERVICE_SPRITE_ROWS * 168}%`,
        backgroundPosition: `${x}% ${y}%`,
        backgroundRepeat: "no-repeat",
      }}
      role="img"
      aria-label={label}
    />
  );
}

export function QuickActionIcon({
  label,
  col,
  row,
  lucide: Lucide,
  imageSrc,
}: {
  label: string;
  col?: number;
  row?: number;
  lucide?: LucideIcon;
  imageSrc?: string;
}) {
  return (
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--av-border)] bg-[var(--av-surface-muted)] shadow-sm transition group-hover:border-[var(--av-accent)]/40 group-hover:bg-[var(--av-accent-soft)] sm:h-12 sm:w-12">
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={label}
          className="absolute inset-0 h-full w-full scale-[1.35] object-cover object-[center_18%]"
          draggable={false}
        />
      ) : col !== undefined && row !== undefined ? (
        <SpriteQuickIcon col={col} row={row} label={label} />
      ) : Lucide ? (
        <Lucide className="h-5 w-5 text-[var(--av-accent)]" aria-hidden />
      ) : (
        <Plus className="h-5 w-5 text-[var(--av-accent)]" aria-hidden />
      )}
    </span>
  );
}
