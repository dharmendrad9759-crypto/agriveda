"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import PageBackground from "@/components/ui/PageBackground";
import BottomNav from "@/components/layout/BottomNav";
import { cn } from "@/lib/cn";
import { categoryOrder, getCropsByCategory, type CatalogCrop } from "@/data/crop-catalog";
import { useMyCrops, MAX_MY_CROPS } from "@/hooks/useMyCrops";

export default function SelectCropsPage() {
  const router = useRouter();
  const { crops, isSelected, toggleCrop, canAddMore } = useMyCrops();
  const grouped = getCropsByCategory();

  return (
    <div className="agriveda-page relative min-h-screen pb-28">
      <PageBackground />

      <header className="sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-extrabold theme-text-primary">Select Your Crops</h1>
            <p className="text-[11px] theme-text-muted">
              Maximum {MAX_MY_CROPS} crops · Selected: {crops.length}/{MAX_MY_CROPS}
            </p>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-lg px-4 py-5 space-y-6">
        {!canAddMore && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-400">
            Maximum {MAX_MY_CROPS} crops selected. Deselect one to add another.
          </div>
        )}

        {categoryOrder.map((category) => {
          const items = grouped[category];
          if (!items.length) return null;
          return (
            <section key={category}>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
                {category}
              </p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {items.map((crop) => (
                  <CropSelectTile
                    key={crop.slug}
                    crop={crop}
                    selected={isSelected(crop.slug)}
                    disabled={!isSelected(crop.slug) && !canAddMore}
                    onToggle={() => toggleCrop(crop.slug)}
                  />
                ))}
              </div>
            </section>
          );
        })}

        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full rounded-2xl border border-emerald-500/40 bg-emerald-500/15 py-4 text-sm font-black text-emerald-400 shadow-[0_0_20px_rgba(0,255,136,0.15)] transition-all hover:shadow-[0_0_28px_rgba(0,255,136,0.25)]"
        >
          Save & Go to Home ({crops.length} selected)
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

function CropSelectTile({
  crop,
  selected,
  disabled,
  onToggle,
}: {
  crop: CatalogCrop;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition-all",
        selected
          ? "border-emerald-400/60 bg-emerald-500/15 shadow-[0_0_16px_rgba(0,255,136,0.2)]"
          : disabled
            ? "cursor-not-allowed border-white/5 bg-black/10 opacity-40"
            : "border-white/10 bg-black/20 hover:border-emerald-500/30"
      )}
    >
      <span className="text-3xl">{crop.emoji}</span>
      <span className={cn("text-center text-[10px] font-bold leading-tight", selected ? "text-emerald-400" : "theme-text-muted")}>
        {crop.name}
      </span>
      {selected && (
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-black">
          <Check className="h-3 w-3" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}
