"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import {
  getCropDeficiencyImage,
  getSharedDeficiencyImage,
  nutrientNameToSlug,
} from "@/lib/nutrients/deficiencyImages";

interface Props {
  cropSlug?: string;
  nutrient: string;
  alt?: string;
  className?: string;
}

/** Crop-specific deficiency photo → shared nutrient photo → yellow leaf. */
export default function DeficiencySymptomImage({
  cropSlug,
  nutrient,
  alt = "",
  className,
}: Props) {
  const primary = cropSlug
    ? getCropDeficiencyImage(cropSlug, nutrient)
    : getSharedDeficiencyImage(nutrient);
  const fallbackShared = getSharedDeficiencyImage(nutrient);
  const ultimate = "/images/home/home-job-yellow-leaf.jpg";

  const [src, setSrc] = useState(primary);

  useEffect(() => {
    setSrc(primary);
  }, [primary]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || nutrient}
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
      onError={() => {
        if (src !== fallbackShared && nutrientNameToSlug(nutrient)) {
          setSrc(fallbackShared);
        } else if (src !== ultimate) {
          setSrc(ultimate);
        }
      }}
    />
  );
}
