"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <button
        type="button"
        aria-label="Close overlay"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-md"
      />

      <div className="relative z-10 w-full max-w-lg animate-sheet-up">
        <div className="agriveda-glass-strong rounded-t-[2rem] border-t border-emerald-500/20 px-5 pb-8 pt-3 shadow-[0_-8px_40px_rgba(0,255,136,0.15)]">
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-emerald-500/40" />

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="agriveda-gradient-text text-xl font-black">Crop Matrix</h3>
              <p className="mt-0.5 text-xs font-medium text-emerald-400/60">
                Select crops to deploy on your farm dashboard
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-emerald-500/30 hover:text-emerald-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[65vh] space-y-6 overflow-y-auto pr-1 scrollbar-hide">
            {categoryOrder.map((category) => {
              const crops = grouped[category];
              if (!crops.length) return null;
              return (
                <div key={category}>
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
                    {category}
                  </p>
                  <div className="grid grid-cols-4 gap-3">
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
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 py-3.5 text-sm font-black text-white shadow-[0_0_24px_rgba(0,255,136,0.3)] transition-transform active:scale-[0.98]"
          >
            Deploy Selection
          </button>
        </div>
      </div>
    </div>
  );
}

function CropTile({ crop, selected, onToggle }: { crop: CatalogCrop; selected: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="group relative flex flex-col items-center gap-1.5">
      <div
        className={cn(
          "relative flex h-[72px] w-full items-center justify-center rounded-2xl border text-3xl transition-all duration-200",
          selected
            ? "border-emerald-400/60 bg-emerald-500/15 shadow-[0_0_16px_rgba(0,255,136,0.25)] scale-105"
            : "border-white/8 bg-black/30 hover:border-emerald-500/30 hover:scale-105"
        )}
      >
        {crop.emoji}
        {selected && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-black shadow-[0_0_8px_rgba(0,255,136,0.8)]">
            <Check className="h-3 w-3" strokeWidth={3} />
          </div>
        )}
      </div>
      <span className={cn("max-w-full truncate text-center text-[10px] font-bold", selected ? "text-emerald-400" : "text-slate-500")}>
        {crop.name}
      </span>
    </button>
  );
}
