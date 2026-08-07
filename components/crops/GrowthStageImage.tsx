"use client";

import { useState } from "react";
import {
  getGrowthStageFallback,
  getGrowthStageKind,
  type GrowthStageKind,
} from "@/lib/crops/growthStageImages";
import { cn } from "@/lib/cn";

interface Props {
  src: string;
  kind: GrowthStageKind;
  alt?: string;
  className?: string;
}

/** Tries crop-specific stage photo, then shared stage scene. */
export default function GrowthStageImage({ src, kind, alt = "", className }: Props) {
  const [failed, setFailed] = useState(false);
  const resolved = failed ? getGrowthStageFallback(kind) : src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}

export function growthKindFromStage(title: string, period?: string): GrowthStageKind {
  return getGrowthStageKind(title, period);
}
