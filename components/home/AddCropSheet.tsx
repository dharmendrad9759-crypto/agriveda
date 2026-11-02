"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  categoryOrder,
  getCropsByCategory,
  type CatalogCrop,
} from "@/data/crop-catalog";

interface AddCropSheetProps {
  open: boolean;
  onClose: () => void;
  isSelected: (slug: string) => boolean;
  onToggle: (slug: string) => void;
}

export default function AddCropSheet({ open, onClose, isSelected, onToggle }: AddCropSheetProps) {
  const grouped = getCropsByCategory();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useBodyScrollLock(open);

  if (!open || !mounted || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        aria-label="Close overlay"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-black/75 backdrop-blur-md"
      />

      <div className="relative z-10 w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200">
        <div className="agriveda-glass-strong rounded-t-[32px] sm:rounded-[28px] border border-emerald-500/30 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sm:pt-5 sm:pb-6 shadow-2xl max-h-[92dvh] sm:max-h-[86vh] flex flex-col text-left">
          {/* Mobile pull indicator */}
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="agriveda-gradient-text text-xl font-black">Crop Matrix</h3>
              <p className="mt-0.5 text-xs font-medium text-emerald-400/60">
                Select crops to deploy on your farm dashboard
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-emerald-500/30 hover:text-emerald-400 active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[62dvh] sm:max-h-[65vh] space-y-5 overflow-y-auto pr-1 scrollbar-hide">
            {categoryOrder.map((category) => {
              const crops = grouped[category];
              if (!crops.length) return null;
              return (
                <div key={category}>
                  <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
                    {category}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    {crops.map((crop) => (
                      <CropTile
                        key={crop.slug}
                        crop={crop}
                        selected={isSelected(crop.slug)}
                        onToggle={() => onToggle(crop.slug)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 py-3.5 text-sm font-black text-white shadow-[0_0_24px_rgba(0,255,136,0.3)] transition-transform active:scale-[0.98]"
          >
            Deploy Selection
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function CropTile({ crop, selected, onToggle }: { crop: CatalogCrop; selected: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="group relative flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
      <div
        className={cn(
          "relative flex h-[68px] sm:h-[72px] w-full items-center justify-center rounded-2xl border text-3xl transition-all duration-200",
          selected
            ? "border-emerald-400/60 bg-emerald-500/15 shadow-[0_0_16px_rgba(0,255,136,0.25)] scale-105"
            : "border-white/8 bg-black/30 hover:border-emerald-500/30 hover:scale-105"
        )}
      >
        <span>{crop.emoji}</span>
        {selected && (
          <div className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-black">
            <Check className="h-2.5 w-2.5 stroke-[3]" />
          </div>
        )}
      </div>
      <span className="line-clamp-1 text-center text-[11px] font-bold text-slate-200">
        {crop.name}
      </span>
    </button>
  );
}
