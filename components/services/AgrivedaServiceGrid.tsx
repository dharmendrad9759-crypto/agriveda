"use client";

import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import AgrivedaServiceIcon from "@/components/services/AgrivedaServiceIcon";
import { AGRIVEDA_SERVICE_ICONS } from "@/lib/services/agrivedaServiceIcons";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";

interface AgrivedaServiceGridProps {
  title?: string;
  titleHi?: string;
  className?: string;
  /** Wrap in DarkCard with section header */
  variant?: "card" | "plain";
  columns?: "3" | "4" | "6";
  onItemClick?: () => void;
}

export default function AgrivedaServiceGrid({
  title = "All Services",
  titleHi = "सभी सेवाएं",
  className,
  variant = "card",
  columns = "3",
  onItemClick,
}: AgrivedaServiceGridProps) {
  const { locale } = useLocale();
  const heading = locale === "en" ? title : titleHi;

  const gridCols =
    columns === "6"
      ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
      : columns === "4"
        ? "grid-cols-4"
        : "grid-cols-3 sm:grid-cols-4 md:grid-cols-6";

  const grid = (
    <div className={cn("grid gap-2 sm:gap-2.5", gridCols, variant === "card" && "mt-3")}>
      {AGRIVEDA_SERVICE_ICONS.map((item) => (
        <AppLink
          key={item.id}
          href={item.href}
          onClick={onItemClick}
          className="group min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--av-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          aria-label={`${item.labelHi} — ${item.labelEn}`}
        >
          <AgrivedaServiceIcon item={item} showAccessibleLabel />
        </AppLink>
      ))}
    </div>
  );

  if (variant === "plain") {
    return <div className={cn("min-w-0", className)}>{grid}</div>;
  }

  return (
    <DarkCard hover className={cn("min-w-0", className)}>
      <SectionHeader title={heading} />
      {grid}
    </DarkCard>
  );
}
