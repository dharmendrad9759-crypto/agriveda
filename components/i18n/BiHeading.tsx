"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";

/**
 * Language-aware heading:
 * - English locale → English only
 * - Hindi / Hinglish → English + Hindi subtitle
 */
export default function BiHeading({
  en,
  hi,
  as: Tag = "h2",
  className,
  hiClassName,
}: {
  en: string;
  hi: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  hiClassName?: string;
}) {
  const { locale } = useLocale();
  const showHi = locale === "hi" || locale === "hinglish";

  return (
    <div className="min-w-0">
      <Tag className={cn(className)}>{en}</Tag>
      {showHi && (
        <p className={cn("mt-0.5 text-[11px] font-medium text-[var(--av-text-muted)]", hiClassName)}>
          {hi}
        </p>
      )}
    </div>
  );
}
