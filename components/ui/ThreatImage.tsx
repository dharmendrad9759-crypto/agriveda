"use client";

import { useState } from "react";
import { Bug, Leaf, ShieldAlert, Sprout } from "lucide-react";
import type { ThreatCategory } from "@/types/pest-disease-ui";
import { cn } from "@/lib/cn";

const GENERIC_STOCK = /unsplash\.com|placeholder|picsum|loremflickr/i;

interface ThreatImageProps {
  src?: string | null;
  alt: string;
  category?: ThreatCategory | "crop";
  className?: string;
}

function CategoryIcon({
  category,
  className,
}: {
  category: ThreatCategory | "crop";
  className?: string;
}) {
  const iconClass = cn("h-10 w-10 opacity-90", className);
  switch (category) {
    case "insect":
      return <Bug className={iconClass} strokeWidth={1.5} />;
    case "fungal":
    case "bacterial":
    case "viral":
    case "other":
      return <ShieldAlert className={iconClass} strokeWidth={1.5} />;
    case "weed":
      return <Leaf className={iconClass} strokeWidth={1.5} />;
    case "crop":
    default:
      return <Sprout className={iconClass} strokeWidth={1.5} />;
  }
}

function ThreatImageFallback({
  alt,
  category = "crop",
  className,
}: {
  alt: string;
  category?: ThreatCategory | "crop";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-emerald-500/15 via-emerald-900/10 to-lime-500/10",
        className
      )}
      aria-label={alt}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
        <CategoryIcon category={category} />
      </div>
      <span className="px-2 text-center text-[9px] font-bold uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
        AgriVeda
      </span>
    </div>
  );
}

export default function ThreatImage({ src, alt, category = "crop", className }: ThreatImageProps) {
  const [broken, setBroken] = useState(false);
  const useFallback = !src || broken || GENERIC_STOCK.test(src);

  if (useFallback) {
    return <ThreatImageFallback alt={alt} category={category} className={className} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}
