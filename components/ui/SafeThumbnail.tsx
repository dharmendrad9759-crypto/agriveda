"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/cn";

interface SafeThumbnailProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function SafeThumbnail({ src, alt = "", className }: SafeThumbnailProps) {
  const [broken, setBroken] = useState(false);

  if (broken || !src) {
    return (
      <div
        className={cn(
          "flex flex-shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
          className
        )}
        aria-label={alt || "Image not available"}
      >
        <ImageOff className="h-5 w-5 opacity-70" strokeWidth={1.75} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn("flex-shrink-0 object-cover", className)}
      onError={() => setBroken(true)}
    />
  );
}
