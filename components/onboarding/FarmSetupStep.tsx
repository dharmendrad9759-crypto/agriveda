"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Compass,
  Crop,
  Layers,
  Loader2,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Sprout,
  Tractor,
  Trash2,
} from "lucide-react";
import {
  categoryOrder,
  cropCatalog,
  getCropsByCategory,
  type CatalogCrop,
  type CropCategory,
} from "@/data/crop-catalog";
import {
  buildFarmFieldFromInput,
  initializeFarmData,
  type OnboardingFieldInput,
  totalAreaAcres,
} from "@/lib/farm/farmInit";
import { cn } from "@/lib/cn";

const CATEGORY_HI: Record<string, string> = {
  Cereals: "अनाज",
  Millets: "मिलेट",
  Vegetables: "सब्ज़ी",
  "Cash Crops": "नकदी फसल",
  Fruits: "फल",
  Pulses: "दालें",
  Oilseeds: "तिलहन",
  Spices: "मसाले",
};

interface DraftField {
  name: string;
  areaAcres: string;
  cropSlug: string;
  ownership: "Owned" | "Leased";
}

const emptyDraft = (index: number): DraftField => ({
  name: `खेत ${index + 1}`,
  areaAcres: "2.0",
  cropSlug: index === 0 ? "wheat" : "",
  ownership: "Owned",
});

interface FarmSetupStepProps {
  farmerName?: string;
  onComplete: (totalAcres: number) => void;
  loading?: boolean;
}

export default function FarmSetupStep({
  farmerName,
  onComplete,
  loading,
}: FarmSetupStepProps) {
  const [fields, setFields] = useState<DraftField[]>([emptyDraft(0)]);
  const [error, setError] = useState<string | null>(null);
  const [activeCropPickerIndex, setActiveCropPickerIndex] = useState<number | null>(null);
  const [cropCategoryFilter, setCropCategoryFilter] = useState<string>("ALL");
  const [cropSearchQuery, setCropSearchQuery] = useState<string>("");

  const byCategory = useMemo(() => getCropsByCategory(), []);

  const updateField = (index: number, patch: Partial<DraftField>) => {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const addField = () => {
    setFields((prev) => [...prev, emptyDraft(prev.length)]);
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
    if (activeCropPickerIndex === index) {
      setActiveCropPickerIndex(null);
    }
  };

  const previewAcres = useMemo(() => {
    return fields.reduce((sum, f) => {
      const n = Number.parseFloat(f.areaAcres);
      return sum + (Number.isFinite(n) && n > 0 ? n : 0);
    }, 0);
  }, [fields]);

  const filteredCrops = useMemo(() => {
    let list: CatalogCrop[] = cropCatalog;
    if (cropCategoryFilter !== "ALL") {
      list = list.filter((c) => c.category === cropCategoryFilter);
    }
    if (cropSearchQuery.trim()) {
      const q = cropSearchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.nameHi && c.nameHi.includes(q)) ||
          c.slug.includes(q)
      );
    }
    return list;
  }, [cropCategoryFilter, cropSearchQuery]);

  const handleSubmit = () => {
    setError(null);
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      const area = Number.parseFloat(f.areaAcres);
      if (!f.areaAcres || !Number.isFinite(area) || area <= 0) {
        setError(`खेत ${i + 1}: कृपया सही रकबा (एकड़ में) भरें`);
        return;
      }
      if (!f.cropSlug) {
        setError(`खेत ${i + 1}: कृपया मुख्य फसल चुनें`);
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
      {/* Friendly greeting badge */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-600/10 to-teal-500/10 p-3.5 text-xs">
        <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
          <Sparkles className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{farmerName ? `${farmerName} जी, ` : ""}अपनी ज़मीन व फसलें जोड़ें</span>
        </div>
        <p className="mt-1 leading-relaxed text-emerald-950/80 dark:text-emerald-100/80">
          सटीक सिंचाई समय, खाद गणना और मंडी भाव के लिए अपने खेत का रकबा और फसल तय करें।
        </p>
      </div>

      {/* Total Land Summary Metric */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 via-emerald-950/30 to-slate-900/60 p-4 text-center shadow-lg backdrop-blur-md">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/15 blur-2xl" />
        <div className="relative">
          <p className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <Layers className="h-3.5 w-3.5" />
            कुल कृषि रकबा (Total Farm Area)
          </p>
          <div className="mt-1 flex items-baseline justify-center gap-1.5">
            <span className="text-3xl font-black tracking-tight text-white drop-shadow-sm">
              {previewAcres > 0 ? previewAcres.toFixed(1) : "0.0"}
            </span>
            <span className="text-sm font-bold text-emerald-300">एकड़</span>
          </div>
          <p className="mt-1 text-[11px] text-gray-300/80">
            कुल खेत: <strong className="text-white">{fields.length}</strong>
          </p>
        </div>
      </div>

      {/* Field Cards */}
      <div className="space-y-3.5">
        {fields.map((field, index) => {
          const selectedCrop = cropCatalog.find((c) => c.slug === field.cropSlug);
          const isPickerOpen = activeCropPickerIndex === index;

          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all dark:border-white/10 dark:bg-slate-900/70"
            >
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-2.5 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300">
                    <Tractor className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-black text-gray-900 dark:text-white">
                    खेत #{index + 1}
                  </span>
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                    aria-label="Remove field"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>हटाएँ</span>
                  </button>
                )}
              </div>

              {/* Field Name & Area */}
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    खेत का नाम / पहचान
                  </label>
                  <input
                    value={field.name}
                    onChange={(e) => updateField(index, { name: e.target.value })}
                    placeholder={`जैसे: खेत ${index + 1} या ट्यूबवेल वाला`}
                    className="w-full rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-xs font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-gray-600 dark:text-gray-300">
                    रकबा (एकड़ में)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0.1"
                      step="0.1"
                      value={field.areaAcres}
                      onChange={(e) => updateField(index, { areaAcres: e.target.value })}
                      placeholder="2.0"
                      className="w-full rounded-xl border border-gray-200 bg-white/90 px-3 py-2 pr-12 text-xs font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400">
                      एकड़
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Acre Chips */}
              <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[10px] font-bold text-gray-500">त्वरित:</span>
                {["1.0", "2.0", "3.0", "5.0", "10.0"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateField(index, { areaAcres: preset })}
                    className={cn(
                      "rounded-lg px-2 py-0.5 text-[10px] font-bold transition",
                      field.areaAcres === preset
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300"
                    )}
                  >
                    {preset} एकड़
                  </button>
                ))}
              </div>

              {/* Ownership Segmented Control */}
              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-bold text-gray-600 dark:text-gray-300">
                  ज़मीन का स्वामित्व (Ownership)
                </label>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100/90 p-1 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => updateField(index, { ownership: "Owned" })}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition",
                      field.ownership === "Owned"
                        ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-300"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400"
                    )}
                  >
                    <span>🏡 अपनी ज़मीन</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField(index, { ownership: "Leased" })}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition",
                      field.ownership === "Leased"
                        ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-300"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400"
                    )}
                  >
                    <span>📜 बटाई / पट्टा</span>
                  </button>
                </div>
              </div>

              {/* Selected Crop Section */}
              <div className="mt-3">
                <label className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Sprout className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    बोई गई मुख्य फसल
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {selectedCrop ? "चयनित ✓" : "फसल चुनें"}
                  </span>
                </label>

                {selectedCrop ? (
                  <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 dark:bg-emerald-950/30">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xl shadow-xs dark:bg-slate-800">
                        {selectedCrop.emoji}
                      </span>
                      <div>
                        <p className="text-xs font-black text-gray-900 dark:text-white">
                          {selectedCrop.nameHi || selectedCrop.name}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {selectedCrop.name} · {CATEGORY_HI[selectedCrop.category] || selectedCrop.category}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveCropPickerIndex(isPickerOpen ? null : index)
                      }
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                    >
                      {isPickerOpen ? "बंद करें" : "बदलें"}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveCropPickerIndex(index)}
                    className="flex w-full items-center justify-between rounded-xl border-2 border-dashed border-emerald-500/40 bg-emerald-50/50 p-3 text-left transition hover:bg-emerald-50 dark:bg-emerald-950/20"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600">
                        <Crop className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        + फसल चुनें (Select Crop)
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-emerald-600" />
                  </button>
                )}

                {/* Crop Picker Drawer/Inline Area */}
                {isPickerOpen && (
                  <div className="mt-2.5 rounded-2xl border border-emerald-500/30 bg-white/95 p-3 shadow-lg dark:bg-slate-900">
                    {/* Search & Categories */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={cropSearchQuery}
                          onChange={(e) => setCropSearchQuery(e.target.value)}
                          placeholder="फसल खोजें (जैसे: धान, गेहूँ, कपास, टमाटर)..."
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-gray-700 dark:bg-slate-800"
                        />
                      </div>

                      {/* Categories Pill Tabs */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setCropCategoryFilter("ALL")}
                          className={cn(
                            "shrink-0 rounded-full px-2.5 py-1 font-bold transition",
                            cropCategoryFilter === "ALL"
                              ? "bg-emerald-700 text-white"
                              : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300"
                          )}
                        >
                          सभी ({cropCatalog.length})
                        </button>
                        {categoryOrder.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCropCategoryFilter(cat)}
                            className={cn(
                              "shrink-0 rounded-full px-2.5 py-1 font-bold transition",
                              cropCategoryFilter === cat
                                ? "bg-emerald-700 text-white"
                                : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300"
                            )}
                          >
                            {CATEGORY_HI[cat] || cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Crops Grid */}
                    <div className="mt-2.5 max-h-52 space-y-1 overflow-y-auto pr-1">
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {filteredCrops.map((crop) => {
                          const isSelected = field.cropSlug === crop.slug;
                          return (
                            <button
                              key={crop.slug}
                              type="button"
                              onClick={() => {
                                updateField(index, { cropSlug: crop.slug });
                                setActiveCropPickerIndex(null);
                              }}
                              className={cn(
                                "flex flex-col items-center rounded-xl border p-2 text-center transition active:scale-95",
                                isSelected
                                  ? "border-emerald-600 bg-emerald-600/15 text-emerald-800 ring-2 ring-emerald-500 dark:text-emerald-200"
                                  : "border-gray-200 bg-gray-50/70 text-gray-800 hover:border-emerald-400 hover:bg-white dark:border-gray-700 dark:bg-slate-800/80 dark:text-gray-200"
                              )}
                            >
                              <span className="text-2xl drop-shadow-xs">{crop.emoji}</span>
                              <span className="mt-1 line-clamp-1 text-[11px] font-bold leading-tight">
                                {crop.nameHi || crop.name}
                              </span>
                              <span className="text-[9px] text-gray-400">{crop.name}</span>
                            </button>
                          );
                        })}
                      </div>
                      {filteredCrops.length === 0 && (
                        <p className="py-4 text-center text-xs text-gray-500">
                          कोई फसल नहीं मिली — कृपया दूसरा नाम खोजें
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Field Button */}
      <button
        type="button"
        onClick={addField}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 py-3 text-xs font-bold text-emerald-700 transition hover:bg-emerald-500/10 active:scale-[0.99] dark:text-emerald-300"
      >
        <Plus className="h-4 w-4" />
        <span>एक और खेत जोड़ें (+ Add Another Field)</span>
      </button>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-50 p-2.5 text-center text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-700/25 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Check className="h-5 w-5" strokeWidth={3} />
        )}
        <span>खेती शुरू करें (Enter AgriVeda)</span>
      </button>
    </div>
  );
}
