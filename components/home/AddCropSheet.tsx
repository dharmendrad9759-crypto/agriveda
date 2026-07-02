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
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg animate-sheet-up">
        <div className="agriveda-glass-strong rounded-t-[2rem] px-5 pb-8 pt-3 shadow-2xl">
          {/* Handle */}
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300" />

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Manage My Crops</h3>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Tap to add or remove crops from your home screen
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
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
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
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
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-transform active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function CropTile({
  crop,
  selected,
  onToggle,
}: {
  crop: CatalogCrop;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="group relative flex flex-col items-center gap-1.5"
    >
      <div
        className={cn(
          "relative flex h-[72px] w-full items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-sm transition-all duration-200",
          crop.gradient,
          selected
            ? "ring-2 ring-emerald-500 ring-offset-2 scale-105"
            : "hover:scale-105 hover:shadow-md opacity-90 hover:opacity-100"
        )}
      >
        {crop.emoji}
        {selected && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
            <Check className="h-3 w-3" strokeWidth={3} />
          </div>
        )}
      </div>
      <span
        className={cn(
          "max-w-full truncate text-center text-[10px] font-bold leading-tight",
          selected ? "text-emerald-700" : "text-slate-600"
        )}
      >
        {crop.name}
      </span>
    </button>
  );
}
