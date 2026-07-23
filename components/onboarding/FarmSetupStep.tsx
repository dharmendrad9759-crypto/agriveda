"use client";

import { useMemo, useState } from "react";
import { Loader2, MapPin, Plus, Sprout, Trash2 } from "lucide-react";
import { cropCatalog } from "@/data/crop-catalog";
import {
  buildFarmFieldFromInput,
  initializeFarmData,
  type OnboardingFieldInput,
  totalAreaAcres,
} from "@/lib/farm/farmInit";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/i18n/LocaleProvider";

const POPULAR_CROP_SLUGS = ["paddy", "wheat", "soybean", "maize", "cotton", "tomato", "potato", "chilli"];

interface DraftField {
  name: string;
  areaAcres: string;
  cropSlug: string;
  ownership: "Owned" | "Leased";
}

const emptyDraft = (): DraftField => ({
  name: "",
  areaAcres: "",
  cropSlug: "",
  ownership: "Owned",
});

interface FarmSetupStepProps {
  farmerName?: string;
  onComplete: (totalAcres: number) => void;
  loading?: boolean;
}

export default function FarmSetupStep({ farmerName, onComplete, loading }: FarmSetupStepProps) {
  const { t, tf } = useLocale();
  const [fields, setFields] = useState<DraftField[]>([emptyDraft()]);
  const [error, setError] = useState<string | null>(null);

  const popularCrops = useMemo(
    () => POPULAR_CROP_SLUGS.map((slug) => cropCatalog.find((c) => c.slug === slug)).filter(Boolean),
    []
  );

  const otherCrops = useMemo(
    () => cropCatalog.filter((c) => !POPULAR_CROP_SLUGS.includes(c.slug)),
    []
  );

  const updateField = (index: number, patch: Partial<DraftField>) => {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const addField = () => {
    setFields((prev) => [...prev, emptyDraft()]);
  };

  const removeField = (index: number) => {
    if (fields.length <= 1) return;
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const previewAcres = useMemo(() => {
    const built = fields
      .filter((f) => f.areaAcres && parseFloat(f.areaAcres) > 0)
      .map((f) => ({ area: `${f.areaAcres} Acre` }));
    return totalAreaAcres(built);
  }, [fields]);

  const handleSubmit = () => {
    setError(null);

    const inputs: OnboardingFieldInput[] = [];
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      const area = parseFloat(f.areaAcres);
      if (!f.name.trim()) {
        setError(tf("farmErrName", { n: i + 1 }));
        return;
      }
      if (!Number.isFinite(area) || area <= 0) {
        setError(tf("farmErrArea", { n: i + 1 }));
        return;
      }
      if (!f.cropSlug) {
        setError(tf("farmErrCrop", { n: i + 1 }));
        return;
      }
      inputs.push({
        name: f.name.trim(),
        areaAcres: area,
        cropSlug: f.cropSlug,
        ownership: f.ownership,
      });
    }

    const built = inputs.map((input, index) => buildFarmFieldFromInput(input, index));
    initializeFarmData(built);
    onComplete(totalAreaAcres(built));
  };

  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-200">
        {farmerName
          ? tf("farmSetupIntroNamed", { name: farmerName })
          : t("farmSetupIntro")}
      </p>

      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-4 py-3 text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
          {t("farmTotalArea")}
        </p>
        <p className="mt-1 text-2xl font-black text-[var(--av-accent)]">
          {previewAcres > 0
            ? `${previewAcres.toFixed(2)} ${t("acresLabel")}`
            : "—"}
        </p>
      </div>

      {fields.map((field, index) => (
        <div
          key={index}
          className="space-y-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-4"
        >
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs font-bold text-[var(--av-text-primary)]">
              <MapPin className="h-4 w-4 text-emerald-500" />
              {tf("farmFieldLabel", { n: index + 1 })}
            </p>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => removeField(index)}
                className="rounded-lg p-1 text-red-400 hover:bg-red-500/10"
                aria-label={t("dismissLabel")}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <input
            value={field.name}
            onChange={(e) => updateField(index, { name: e.target.value })}
            placeholder={t("farmNamePlaceholder")}
            className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={field.areaAcres}
              onChange={(e) => updateField(index, { areaAcres: e.target.value })}
              placeholder={t("farmAreaPlaceholder")}
              className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
            <select
              value={field.ownership}
              onChange={(e) =>
                updateField(index, { ownership: e.target.value as "Owned" | "Leased" })
              }
              className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="Owned">{t("farmOwned")}</option>
              <option value="Leased">{t("farmLeased")}</option>
            </select>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold text-[var(--av-text-muted)]">
              <Sprout className="h-4 w-4" />
              {t("farmSelectCrop")}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {popularCrops.map((crop) =>
                crop ? (
                  <button
                    key={crop.slug}
                    type="button"
                    onClick={() => updateField(index, { cropSlug: crop.slug })}
                    className={cn(
                      "rounded-xl border px-1 py-2 text-center text-[10px] font-bold transition",
                      field.cropSlug === crop.slug
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : "border-[var(--av-border)] bg-[var(--background)] text-[var(--av-text-muted)]"
                    )}
                  >
                    <span className="block text-lg">{crop.emoji}</span>
                    {crop.name}
                  </button>
                ) : null
              )}
            </div>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold text-[var(--av-accent)]">
                {t("farmMoreCrops")}
              </summary>
              <div className="mt-2 grid max-h-32 grid-cols-4 gap-2 overflow-y-auto">
                {otherCrops.map((crop) => (
                  <button
                    key={crop.slug}
                    type="button"
                    onClick={() => updateField(index, { cropSlug: crop.slug })}
                    className={cn(
                      "rounded-lg border px-1 py-1.5 text-center text-[9px] font-bold",
                      field.cropSlug === crop.slug
                        ? "border-emerald-500 bg-emerald-500/15"
                        : "border-[var(--av-border)]"
                    )}
                  >
                    <span className="block text-base">{crop.emoji}</span>
                    {crop.name}
                  </button>
                ))}
              </div>
            </details>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addField}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-400/50 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-300"
      >
        <Plus className="h-4 w-4" />
        {t("farmAddField")}
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006432] py-3.5 text-sm font-black text-white disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {t("farmStart")}
      </button>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm font-semibold text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
