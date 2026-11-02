"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, ChevronLeft, ChevronRight, MapPin, ZoomIn } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox";
import { getThreatGalleryPhotos, type ThreatPhotoItem } from "@/lib/crops/threatGalleryManifest";

interface Props {
  primaryImage: string;
  title: string;
  subtitle?: string;
  cropLabel?: string;
  tagLabel?: string;
  cropSlug?: string;
  threatId?: string;
  hi?: boolean;
  className?: string;
}

export default function ThreatPhotoGallery({
  primaryImage,
  title,
  subtitle,
  cropLabel,
  tagLabel,
  cropSlug,
  threatId,
  hi = true,
  className = "",
}: Props) {
  const photos = getThreatGalleryPhotos(primaryImage, cropSlug, threatId);
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
    <div className={`space-y-3 ${className}`}>
      {/* Main Image Frame */}
      <div
        onClick={() => setLightboxSrc(activePhoto.url)}
        className="group relative aspect-[16/9] sm:aspect-[2/1] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-[#D8E8DE] bg-neutral-950 shadow-sm transition hover:shadow-md"
      >
        <Image
          src={activePhoto.url}
          alt={title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />

        {/* Gradient Overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45 pointer-events-none" />

        {/* Top Badges (Stage & Plant Location) */}
        <div className="absolute top-3 left-3 right-14 z-10 pointer-events-none flex flex-wrap items-center gap-1.5">
          {/* Active Stage Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md border border-emerald-500/30 shadow-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate max-w-[190px]">
              {hi ? activePhoto.badgeHi : activePhoto.badgeEn}
            </span>
          </span>

          {/* Plant Location Pill (e.g. तने के अंदर, पत्ती के नीचे) */}
          {activePhoto.locationHi && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[11px] font-medium text-emerald-200 backdrop-blur-md border border-emerald-400/20 shadow-xs">
              <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[160px]">{activePhoto.locationHi}</span>
            </span>
          )}
        </div>

        {/* Bottom diagnostic caption overlay */}
        <div className="absolute bottom-2.5 left-3 right-12 z-10 pointer-events-none">
          <p className="text-xs font-medium text-white/95 drop-shadow-md line-clamp-2 leading-relaxed">
            {hi ? activePhoto.captionHi : activePhoto.captionEn}
          </p>
        </div>

        {/* Top Zoom Control */}
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxSrc(activePhoto.url);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/90 backdrop-blur-xs transition hover:bg-black/80 hover:scale-105 shadow-sm border border-white/10"
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
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-xs transition hover:bg-black/80 hover:scale-110 active:scale-95 border border-white/10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-xs transition hover:bg-black/80 hover:scale-110 active:scale-95 border border-white/10"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Multi-Stage Photo Selector with Stage Badges */}
      {hasMultiple && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p, idx) => {
            const isActive = idx === activeIndex;
            const badgeText = hi ? p.badgeHi : p.badgeEn;
            return (
              <button
                key={p.url + idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`group relative flex flex-col overflow-hidden rounded-xl border-2 transition-all active:scale-95 text-left shadow-xs ${
                  isActive
                    ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/30"
                    : "border-slate-200 bg-white hover:border-emerald-300 opacity-85 hover:opacity-100"
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                  <Image
                    src={p.url}
                    alt={badgeText}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="150px"
                  />
                  {/* Step Number Tag */}
                  <div className="absolute top-1 left-1.5 z-10">
                    <span
                      className={`inline-flex items-center justify-center h-4 w-4 rounded-full text-[10px] font-bold shadow-xs ${
                        isActive
                          ? "bg-emerald-600 text-white"
                          : "bg-black/65 text-white/95 backdrop-blur-xs"
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </div>
                </div>

                {/* Stage Label Strip */}
                <div
                  className={`px-1.5 py-1 text-center text-[11px] leading-tight transition ${
                    isActive
                      ? "bg-emerald-700 text-white font-semibold"
                      : "bg-slate-50 text-slate-700 font-medium group-hover:text-emerald-800"
                  }`}
                >
                  <span className="line-clamp-1">{badgeText}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 🌾 Kisan Pehchan Sutra (Practical Farmer Identification Rule) */}
      {activePhoto.thumbRuleHi && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-500/35 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-emerald-50 p-3 shadow-xs">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white text-xs shadow-xs font-bold">
            🌾
          </div>
          <div className="space-y-0.5 text-xs">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <span>किसान पहचान सूत्र</span>
              {activePhoto.locationHi && (
                <span className="font-normal text-[10.5px] text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full border border-emerald-300/60">
                  {activePhoto.locationHi}
                </span>
              )}
            </span>
            <p className="text-emerald-900 leading-relaxed font-medium">
              {activePhoto.thumbRuleHi}
            </p>
          </div>
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
