"use client";

import { useState } from "react";
import type { ThreatCategory } from "@/types/pest-disease-ui";
import { cn } from "@/lib/cn";
import { BRAND } from "@/lib/brand";
import { THREAT_IMAGES } from "@/data/pest-disease-details";

const GENERIC_STOCK = /placeholder|picsum|loremflickr|via\.placeholder|unsplash\.com/i;

interface ThreatImageProps {
  src?: string | null;
  alt: string;
  category?: ThreatCategory | "crop";
  className?: string;
}

function categoryFallbackSrc(category: ThreatCategory | "crop"): string {
  switch (category) {
    case "insect":
      return THREAT_IMAGES.insect;
    case "fungal":
    case "bacterial":
    case "other":
      return THREAT_IMAGES.fungalLeaf;
    case "viral":
      return THREAT_IMAGES.viralPlant;
    case "weed":
      return THREAT_IMAGES.weed;
    case "crop":
    default:
      return THREAT_IMAGES.paddy;
  }
}

export default function ThreatImage({ src, alt, category = "crop", className }: ThreatImageProps) {
  const [broken, setBroken] = useState(false);
  const preferred = src && !GENERIC_STOCK.test(src) ? src : null;
  const resolved = !broken && preferred ? preferred : categoryFallbackSrc(category);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt || BRAND}
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
      onError={() => {
        if (!broken) setBroken(true);
      }}
    />
  );
}
