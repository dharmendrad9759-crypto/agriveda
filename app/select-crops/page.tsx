"use client";

import { useAppNavigate } from "@/hooks/useAppNavigate";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { categoryOrder, getCropsByCategory, type CatalogCrop } from "@/data/crop-catalog";
import { useMyCrops, MAX_MY_CROPS } from "@/hooks/useMyCrops";
import { AV } from "@/lib/design/tokens";

export default function SelectCropsPage() {
  const navigate = useAppNavigate();
  const { crops, isSelected, toggleCrop, canAddMore } = useMyCrops();
  const grouped = getCropsByCategory();

  return (
    <AppShell
      title="Select Your Crops"
      subtitle={`Maximum ${MAX_MY_CROPS} crops · Selected: ${crops.length}/${MAX_MY_CROPS}`}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Select Crops" }]}
    >
      {!canAddMore && (
        <DarkCard className="border-amber-500/30 bg-amber-500/10">
          <p className="text-sm font-medium text-amber-600">
            Maximum {MAX_MY_CROPS} crops selected. Deselect one to add another.
          </p>
        </DarkCard>
      )}

      <div className="space-y-4">
        {categoryOrder.map((category, ci) => {
          const items = grouped[category];
          if (!items.length) return null;
          return (
            <DarkCard key={category} delay={ci % 4}>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--av-accent)]">
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
            </DarkCard>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => navigate("/")}
        className={`mt-4 w-full ${AV.btnPrimary}`}
      >
        Save & Go to Home ({crops.length} selected)
      </button>
    </AppShell>
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
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "relative flex flex-col items-center rounded-xl border p-3 transition",
        selected
          ? "border-[var(--av-accent)] bg-[var(--av-accent-soft)]"
          : "border-[var(--av-border)] bg-[var(--av-surface-inset)] hover:border-[var(--av-accent)]/30",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      {selected && (
        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--av-accent)]">
          <Check className="h-3 w-3 text-white" />
        </span>
      )}
      <span className="text-2xl">{crop.emoji}</span>
      <span className="mt-1 text-center text-[10px] font-semibold leading-tight text-[var(--av-text-primary)]">
        {crop.name}
      </span>
    </button>
  );
}
