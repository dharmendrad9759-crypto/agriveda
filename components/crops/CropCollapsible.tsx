"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

/** Compact collapsible block for long crop-tab sections */
export default function CropCollapsible({
  title,
  subtitle,
  defaultOpen = false,
  children,
  className,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-[var(--av-text-primary)]">{title}</p>
          {subtitle ? (
            <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">{subtitle}</p>
          ) : null}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--av-text-muted)] transition",
            open && "rotate-180"
          )}
        />
      </button>
      {open ? (
        <div className="border-t border-[var(--av-border-subtle)] px-3.5 py-3">{children}</div>
      ) : null}
    </div>
  );
}
