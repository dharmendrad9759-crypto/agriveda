"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";

/**
 * Language-aware heading:
 * - English → English only
 * - Hindi → Hindi primary
 * - Hinglish → Hindi primary + English subtitle
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

  if (locale === "en") {
    return (
      <div className="min-w-0">
        <Tag className={cn(className)}>{en}</Tag>
      </div>
    );
  }

  if (locale === "hi") {
    return (
      <div className="min-w-0">
        <Tag className={cn(className)}>{hi}</Tag>
      </div>
    );
  }

  // hinglish — Hindi primary, English as quiet subtitle
  return (
    <div className="min-w-0">
      <Tag className={cn(className)}>{hi}</Tag>
      <p className={cn("mt-0.5 text-[11px] font-medium text-[var(--av-text-muted)]", hiClassName)}>
        {en}
      </p>
    </div>
  );
}
