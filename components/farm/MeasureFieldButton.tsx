"use client";

import { Ruler } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { cn } from "@/lib/cn";

export const MEASURE_FIELD_HREF = "/my-farm/measure";

export function measureFieldHref(editId?: string) {
  if (!editId) return MEASURE_FIELD_HREF;
  return `${MEASURE_FIELD_HREF}?editId=${encodeURIComponent(editId)}`;
}

const LABELS = {
  compact: "नापें",
  default: "खेत नापें",
  add: "नया खेत नापें",
  edit: "सीमा बदलें",
} as const;

export type MeasureFieldKind = keyof typeof LABELS;
export type MeasureFieldVariant = "primary" | "chip" | "ghost" | "link" | "block";

const VARIANT_CLASS: Record<MeasureFieldVariant, string> = {
  primary:
    "inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-[12px] font-bold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.98]",
  chip: "inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-2.5 py-1.5 text-[10.5px] font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-95",
  ghost:
    "inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-bold text-emerald-900 transition hover:bg-emerald-500/20 dark:text-emerald-100",
  link: "inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline dark:text-emerald-300",
  block:
    "flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-800",
};

const ICON_CLASS: Record<MeasureFieldVariant, string> = {
  primary: "h-3.5 w-3.5",
  chip: "h-3.5 w-3.5",
  ghost: "h-3 w-3",
  link: "h-3 w-3",
  block: "h-3.5 w-3.5",
};

export default function MeasureFieldButton({
  kind = "default",
  variant = "primary",
  editId,
  onClick,
  className,
  title = "उपग्रह या GPS से खेत नापें",
}: {
  kind?: MeasureFieldKind;
  variant?: MeasureFieldVariant;
  editId?: string;
  onClick?: () => void;
  className?: string;
  title?: string;
}) {
  const label = LABELS[kind];
  const href = measureFieldHref(editId);
  const classNames = cn(VARIANT_CLASS[variant], className);
  const inner = (
    <>
      <Ruler className={cn("shrink-0", ICON_CLASS[variant])} />
      <span>{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classNames} title={title}>
        {inner}
      </button>
    );
  }

  return (
    <AppLink href={href} className={classNames} title={title}>
      {inner}
    </AppLink>
  );
}
