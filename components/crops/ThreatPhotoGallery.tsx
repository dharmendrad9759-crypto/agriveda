"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox";
import { getThreatGalleryPhotos, type ThreatPhotoItem } from "@/lib/crops/threatGalleryManifest";

interface Props {
  primaryImage: string;
  title: string;
  subtitle?: string;
  cropLabel?: string;
  tagLabel?: string;
  hi?: boolean;
  className?: string;
}

export default function ThreatPhotoGallery({
  primaryImage,
  title,
  subtitle,
  cropLabel,
  tagLabel,
  hi = true,
  className = "",
}: Props) {
  const photos = getThreatGalleryPhotos(primaryImage);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const activePhoto = photos[activeIndex] || photos[0] || {
    url: primaryImage,
    badgeHi: "मुख्य लक्षण",
    badgeEn: "Primary",
    captionHi: "खेत लक्षण",
    captionEn: "Field symptom",
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const hasMultiple = photos.length > 1;

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Main Image Frame */}
      <div
        onClick={() => setLightboxSrc(activePhoto.url)}
        className="group relative aspect-[16/9] sm:aspect-[2/1] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-[#D8E8DE] bg-neutral-900 shadow-sm transition hover:shadow-md"
      >
        <Image
          src={activePhoto.url}
          alt={title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />

        {/* Gradient Overlay for bottom text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

        {/* Top Zoom Control */}
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxSrc(activePhoto.url);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur-xs transition hover:bg-black/75 hover:scale-105 shadow-sm"
            title={hi ? "बड़ा करके देखें" : "Zoom view"}
            aria-label={hi ? "बड़ा करके देखें" : "Zoom view"}
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        {/* Arrow Navigation (if multiple) */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-xs transition hover:bg-black/75 hover:scale-110 active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-xs transition hover:bg-black/75 hover:scale-110 active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Multi-Photo Thumbnails Selector — clean photos without text labels */}
      {hasMultiple && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={p.url + idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`group relative aspect-[16/10] overflow-hidden rounded-xl border-2 transition active:scale-95 ${
                  isActive
                    ? "border-emerald-600 ring-2 ring-emerald-500/30 shadow-sm"
                    : "border-slate-200 hover:border-emerald-400 opacity-80 hover:opacity-100"
                }`}
              >
                <Image
                  src={p.url}
                  alt=""
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="120px"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Portal */}
      <ImageLightbox
        src={lightboxSrc}
        onClose={() => setLightboxSrc(null)}
        closeLabel={hi ? "बंद करें" : "Close"}
      />
    </div>
  );
}
