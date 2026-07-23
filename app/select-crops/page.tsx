"use client";

import { useState } from "react";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { categoryOrder, getCropsByCategory, type CatalogCrop } from "@/data/crop-catalog";
import { useMyCrops, MAX_MY_CROPS } from "@/hooks/useMyCrops";
import { useToast } from "@/components/ui/Toast";
import { AV } from "@/lib/design/tokens";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function SelectCropsPage() {
  const navigate = useAppNavigate();
  const { showToast } = useToast();
  const { t } = useLocale();
  const { crops, isSelected, toggleCrop, canAddMore, addCustomCrop } = useMyCrops();
  const grouped = getCropsByCategory();
  const [customName, setCustomName] = useState("");

  const handleAddCustom = () => {
    const result = addCustomCrop({ name: customName, emoji: "🌱" });
    if (!result.ok) {
      showToast(result.reason, "error");
      return;
    }
    setCustomName("");
    showToast(`${result.crop.emoji} ${result.crop.name} Home पर जोड़ दी`);
  };

  return (
    <AppShell
      title={t("selectCropsTitle")}
      subtitle={`Maximum ${MAX_MY_CROPS} · ${crops.length}/${MAX_MY_CROPS}`}
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("selectCropsTitle") }]}
    >
      {!canAddMore && (
        <DarkCard className="border-amber-500/30 bg-amber-500/10">
          <p className="text-sm font-medium text-amber-600">
            Maximum {MAX_MY_CROPS} crops selected. Deselect one to add another.
          </p>
        </DarkCard>
      )}

      <DarkCard className="mb-4 border-emerald-500/20">
        <p className="text-xs font-bold text-[var(--av-text-primary)]">Custom crop (Home के लिए)</p>
        <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">
          सूची में नहीं है तो नाम लिखकर जोड़ें
        </p>
        <div className="mt-2 flex gap-2">
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="फसल का नाम…"
            className="min-w-0 flex-1 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-sm outline-none focus:border-[var(--av-accent)]"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!canAddMore || customName.trim().length < 2}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-[var(--av-accent)] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
        {crops.some((c) => c.custom) && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {crops
              .filter((c) => c.custom)
              .map((c) => (
                <li
                  key={c.slug}
                  className="rounded-full bg-[var(--av-accent-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--av-accent)]"
                >
                  {c.emoji} {c.name}
                </li>
              ))}
          </ul>
        )}
      </DarkCard>

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
