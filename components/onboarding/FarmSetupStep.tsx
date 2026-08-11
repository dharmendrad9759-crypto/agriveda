"use client";

import { useMemo, useState } from "react";
import { Loader2, MapPin, Plus, Sprout, Trash2 } from "lucide-react";
import { categoryOrder, cropCatalog, getCropsByCategory } from "@/data/crop-catalog";
import {
  buildFarmFieldFromInput,
  initializeFarmData,
  type OnboardingFieldInput,
  totalAreaAcres,
} from "@/lib/farm/farmInit";
import { cn } from "@/lib/cn";

const CATEGORY_HI: Record<string, string> = {
  Cereals: "अनाज",
  Vegetables: "सब्ज़ी",
  "Cash Crops": "नकदी फसल",
  Fruits: "फल",
  Pulses: "दाल",
  Oilseeds: "तिलहन",
  Spices: "मसाले",
};

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
  const [fields, setFields] = useState<DraftField[]>([emptyDraft()]);
  const [error, setError] = useState<string | null>(null);

  const byCategory = useMemo(() => getCropsByCategory(), []);

  const updateField = (index: number, patch: Partial<DraftField>) => {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const addField = () => setFields((prev) => [...prev, emptyDraft()]);

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const previewAcres = useMemo(() => {
    return fields.reduce((sum, f) => {
      const n = Number.parseFloat(f.areaAcres);
      return sum + (Number.isFinite(n) && n > 0 ? n : 0);
    }, 0);
  }, [fields]);

  const handleSubmit = () => {
    setError(null);
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      if (!f.areaAcres || Number.parseFloat(f.areaAcres) <= 0) {
        setError(`खेत ${i + 1}: रकबा भरें`);
        return;
      }
      if (!f.cropSlug) {
        setError(`खेत ${i + 1}: फसल चुनें`);
        return;
      }
    }

    const inputs: OnboardingFieldInput[] = fields.map((f, i) => ({
      name: f.name.trim() || `खेत ${i + 1}`,
      areaAcres: Number.parseFloat(f.areaAcres),
      cropSlug: f.cropSlug,
      ownership: f.ownership,
    }));

    const built = inputs.map((input, i) => buildFarmFieldFromInput(input, i));
    initializeFarmData(built);
    onComplete(totalAreaAcres(built));
  };

  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-200">
        {farmerName ? `${farmerName} जी, ` : ""}
        अपनी ज़मीन की जानकारी भरें — कुल रकबा, खेत और फसलें।
      </p>

      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-4 py-3 text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
          कुल रकबा
        </p>
        <p className="mt-1 text-2xl font-black text-[var(--av-accent)]">
          {previewAcres > 0 ? `${previewAcres.toFixed(2)} एकड़` : "—"}
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
              खेत {index + 1}
            </p>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => removeField(index)}
                className="rounded-lg p-1 text-red-400 hover:bg-red-500/10"
                aria-label="Remove field"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <input
            value={field.name}
            onChange={(e) => updateField(index, { name: e.target.value })}
            placeholder="खेत का नाम (जैसे मुख्य खेत, उत्तर वाला)"
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
              placeholder="रकबा (एकड़)"
              className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
            <select
              value={field.ownership}
              onChange={(e) =>
                updateField(index, { ownership: e.target.value as "Owned" | "Leased" })
              }
              className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="Owned">अपनी ज़मीन</option>
              <option value="Leased">बटाई / किराया</option>
            </select>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold text-[var(--av-text-muted)]">
              <Sprout className="h-4 w-4" />
              फसल चुनें
              <span className="font-semibold text-[var(--av-text-muted)]">
                ({cropCatalog.length})
              </span>
            </p>
            <div className="max-h-56 space-y-3 overflow-y-auto rounded-xl border border-[var(--av-border)] bg-[var(--background)] p-2.5">
              {categoryOrder.map((cat) => {
                const list = byCategory[cat];
                if (!list?.length) return null;
                return (
                  <div key={cat}>
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                      {CATEGORY_HI[cat] ?? cat}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {list.map((crop) => (
                        <button
                          key={crop.slug}
                          type="button"
                          onClick={() => updateField(index, { cropSlug: crop.slug })}
                          className={cn(
                            "rounded-xl border px-1 py-2 text-center text-[10px] font-bold transition",
                            field.cropSlug === crop.slug
                              ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
                          )}
                        >
                          <span className="block text-lg">{crop.emoji}</span>
                          {crop.nameHi ?? crop.name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addField}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-400/50 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-300"
      >
        <Plus className="h-4 w-4" />
        एक और खेत जोड़ें
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006432] py-3.5 text-sm font-black text-white disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        शुरू करें
      </button>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm font-semibold text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
