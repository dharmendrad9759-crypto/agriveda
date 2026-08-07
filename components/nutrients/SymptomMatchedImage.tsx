"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { getSymptomImageCandidates } from "@/lib/nutrients/symptomVisuals";

interface Props {
  cropSlug?: string;
  cropLabel?: string;
  nutrient: string;
  slot: number;
  symptomText?: string;
  alt?: string;
  className?: string;
}

/** Falls through symptom-specific → visual key → crop×nutrient → shared. */
export default function SymptomMatchedImage({
  cropSlug,
  cropLabel,
  nutrient,
  slot,
  symptomText,
  alt = "",
  className,
}: Props) {
  const candidates = getSymptomImageCandidates({
    cropSlug,
    cropLabel,
    nutrient,
    slot,
    symptomText,
  });
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [candidates.join("|")]);

  const src = candidates[Math.min(idx, candidates.length - 1)] ?? candidates[0];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || symptomText || nutrient}
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
      onError={() => {
        if (idx < candidates.length - 1) setIdx((i) => i + 1);
      }}
    />
  );
}
