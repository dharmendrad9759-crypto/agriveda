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

        {/* Top Badges */}
        <div className="absolute left-3 top-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5">
            {cropLabel && (
              <span className="rounded-full bg-emerald-700/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-xs">
                {cropLabel} {tagLabel ? `· ${tagLabel}` : ""}
              </span>
            )}
            {hasMultiple && (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-white/95 shadow-sm backdrop-blur-xs">
                <Camera className="h-3 w-3 text-emerald-400" />
                <span>
                  {hi
                    ? `तस्वीर ${activeIndex + 1}/${photos.length}`
                    : `Photo ${activeIndex + 1}/${photos.length}`}
                </span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxSrc(activePhoto.url);
            }}
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur-xs transition hover:bg-black/75 hover:scale-105"
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

        {/* Bottom Current Photo Caption */}
        <div className="absolute inset-x-0 bottom-0 px-3.5 pb-3 pointer-events-none">
          <div className="flex items-end justify-end gap-3">
            <span className="shrink-0 rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white/95 backdrop-blur-xs">
              {hi ? activePhoto.captionHi : activePhoto.captionEn}
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Photo Thumbnails Selector */}
      {hasMultiple && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={p.url + idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative flex items-center gap-2 overflow-hidden rounded-xl border p-1.5 text-left transition ${
                  isActive
                    ? "border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/30"
                    : "border-[#DCE8E0] bg-white hover:border-emerald-300 hover:bg-emerald-50/30"
                }`}
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-neutral-200">
                  <Image
                    src={p.url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0 flex-1 pr-1">
                  <p
                    className={`truncate text-[11px] font-extrabold leading-tight ${
                      isActive ? "text-emerald-900" : "text-neutral-700"
                    }`}
                  >
                    {hi ? `फोटो ${idx + 1}` : `Photo ${idx + 1}`}
                  </p>
                  <p
                    className={`truncate text-[10px] font-semibold ${
                      isActive ? "text-emerald-700" : "text-neutral-500"
                    }`}
                  >
                    {hi ? p.badgeHi : p.badgeEn}
                  </p>
                </div>
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
