"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import AppLink from "@/components/ui/AppLink";
import { useToast } from "@/components/ui/Toast";
import { useFarmData } from "@/hooks/useFarmData";
import { useDashboardAlerts } from "@/hooks/useDashboardAlerts";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { categoryOrder, cropCatalog } from "@/data/crop-catalog";
import {
  ArrowRight,
  Check,
  Compass,
  Pencil,
  Plus,
  Radio,
  Ruler,
  Search,
  Sprout,
  Trash2,
  X,
} from "lucide-react";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { getVarietiesForCrop } from "@/lib/crops/cropVarieties";
import {
  fieldStageLabel,
  formatSowingDisplay,
  parseSowingISO,
  todayISO,
} from "@/lib/farm/fieldStatus";
import { cn } from "@/lib/cn";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { track } from "@/lib/analytics";
import { suggestFieldName } from "@/lib/farm/fieldName";
import { useActiveField } from "@/hooks/useActiveField";
import MeasureFieldButton, { measureFieldHref } from "@/components/farm/MeasureFieldButton";
import MeasureAfterAddPrompt from "@/components/farm/MeasureAfterAddPrompt";

const CATEGORY_HI: Record<string, string> = {
  Cereals: "अनाज",
  Millets: "मिलेट",
  Vegetables: "सब्ज़ी",
  "Cash Crops": "नकदी",
  Fruits: "फल",
  Pulses: "दाल",
  Oilseeds: "तिलहन",
  Spices: "मसाले",
};

const POPULAR_VARIETIES: Record<string, string[]> = {
  wheat: ["DBW 187", "HD 2967", "HD 3086", "DBW 222", "PBW 373"],
  gehu: ["DBW 187", "HD 2967", "HD 3086", "DBW 222", "PBW 373"],
  paddy: ["पूसा 1121", "पूसा 1509", "PR 126", "सरबती", "IR 64"],
  dhan: ["पूसा 1121", "पूसा 1509", "PR 126", "सरबती", "IR 64"],
  mustard: ["पूसा मस्टर्ड 25", "गिरिराज", "RH 725", "वरुणा"],
  sarson: ["पूसा मस्टर्ड 25", "गिरिराज", "RH 725", "वरुणा"],
  tomato: ["अभिनव", "साहो 3251", "हिमसोना", "आर्यमान"],
  potato: ["कुफरी ख्याति", "कुफरी पुखराज", "कुफरी बहार", "कुफरी ज्योति"],
  chilli: ["वीएनआर 332", "तेजा 4", "आर्मर", "सितारा"],
  maize: ["पायनियर 3396", "डीकेसी 9108", "गंगा 11", "सरताज"],
  cotton: ["रासी 659", "अंकुर 3028", "कावेरी जादू", "अजीत 155"],
  onion: ["एग्रीफाउंड डार्क रेड", "भीमा सुपर", "पुणे फुरसुंगी", "भीमा रेड"],
  garlic: ["G-282", "यमुना सफेद (G-1)", "भीमा ओंकार"],
  pea: ["आर्केल", "GS-10", "आजाद पी-1", "काशी नंदिनी"],
  chana: ["पूसा 372", "जेजी 11", "जाकी 9218", "पूसा 362"],
  soybean: ["JS 20-34", "JS 95-60", "JS 20-29", "NRC 37"],
};

function getPopularVarieties(slug: string): string[] {
  if (!slug) return [];
  const s = slug.toLowerCase();
  if (POPULAR_VARIETIES[s]) return POPULAR_VARIETIES[s];
  const list = getVarietiesForCrop(s);
  if (!list || !list.length) return [];
  return list
    .slice(0, 5)
    .map((v) => v.name.split(/[—(]/)[0].trim())
    .filter(Boolean);
}

const ACRE_PRESETS = ["0.5", "1", "2", "3", "5"];

function totalAreaLabel(fields?: { area?: string | number }[]) {
  if (!Array.isArray(fields)) return "—";
  const acres = fields.reduce((sum, f) => {
    const str = typeof f?.area === "string" ? f.area : "";
    const match = str.match(/([\d.]+)/);
    return sum + (match ? parseFloat(match[1]) : 0);
  }, 0);
  return acres > 0 ? `${acres.toFixed(1)} एकड़` : "—";
}

const MiniFieldMap = dynamic(() => import("@/components/farm/MiniFieldMap"), {
  ssr: false,
  loading: () => <div className="h-[140px] w-full bg-slate-800/10 animate-pulse rounded-xl" />,
});

export default function MyFarmPage() {
  const { showToast } = useToast();
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const reduced = useReducedMotion();
  const { profile, setSowingDate } = useFarmerProfile();
  const { data, stats, addField, deleteField, hydrated: farmHydrated } = useFarmData();
  const { activeField, setActiveField } = useActiveField(data.fields, farmHydrated);
  const farmAlerts = useDashboardAlerts(1);

  const [showAddField, setShowAddField] = useState(false);
  const [measurePromptId, setMeasurePromptId] = useState<string | null>(null);
  const selectedFieldId = activeField?.id ?? null;
  const [fieldName, setFieldName] = useState("");
  const [fieldArea, setFieldArea] = useState("");
  const [fieldCropSlug, setFieldCropSlug] = useState("");
  const [fieldVariety, setFieldVariety] = useState("");
  const [fieldSowing, setFieldSowing] = useState("");
  const [cropPickerOpen, setCropPickerOpen] = useState(false);
  const [cropQuery, setCropQuery] = useState("");
  const [cropCategory, setCropCategory] = useState<(typeof categoryOrder)[number] | "all">("all");

  const filteredCrops = useMemo(() => {
    const q = cropQuery.trim().toLowerCase();
    return cropCatalog.filter((c) => {
      if (cropCategory !== "all" && c.category !== cropCategory) return false;
      if (!q) return true;
      const hay = `${c.name} ${c.nameHi ?? ""} ${c.slug}`.toLowerCase();
      return hay.includes(q);
    });
  }, [cropQuery, cropCategory]);

  const selectedCrop = fieldCropSlug
    ? cropCatalog.find((c) => c.slug === fieldCropSlug)
    : undefined;

  const varietyChips = useMemo(() => getPopularVarieties(fieldCropSlug), [fieldCropSlug]);

  const setSowingDaysAgo = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const iso = d.toISOString().split("T")[0];
    setFieldSowing(iso);
  };

  const greetName = profile.name.trim()
    ? profile.name.trim().charAt(0).toUpperCase() + profile.name.trim().slice(1)
    : isHi
      ? "किसान"
      : "Farmer";

  const place = [profile.village, profile.district].filter(Boolean).join(", ");
  const hasFields = data.fields.length > 0;
  const topAlert = farmAlerts[0];

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: MOTION.slow, ease: EASE_OUT, delay },
        };

  const handleAddField = () => {
    const catalog = cropCatalog.find((c) => c.slug === fieldCropSlug);
    if (!catalog && !fieldCropSlug) {
      showToast(isHi ? "कृपया पहले फसल चुनें" : "Please select a crop first", "error");
      return;
    }
    const areaNum = parseFloat(fieldArea);
    if (!Number.isFinite(areaNum) || areaNum <= 0) {
      showToast(isHi ? "कृपया सही रकबा (एकड़) भरें" : "Please enter valid area in acres", "error");
      return;
    }

    const cropHindi = catalog ? (getCropHindiName(catalog.slug) || catalog.nameHi || catalog.name) : "";
    const cropLabel = isHi ? (cropHindi || catalog?.name || "") : (catalog?.name || cropHindi || "");
    const autoFieldName = suggestFieldName({
      existing: data.fields,
      cropHi: cropHindi || catalog?.name,
      village: profile.village,
    });
    const finalFieldName = fieldName.trim() || autoFieldName;

    const sowingIso = parseSowingISO(fieldSowing) || undefined;
    const stage = fieldStageLabel(sowingIso, isHi);
    const newId = addField({
      name: finalFieldName,
      area: `${areaNum.toFixed(1)} Acre`,
      ownership: "Owned",
      crop: cropLabel,
      cropSlug: fieldCropSlug || undefined,
      variety: fieldVariety.trim() || undefined,
      status: "Active",
      sowingDate: sowingIso ? formatSowingDisplay(sowingIso, isHi) : "",
      sowingDateIso: sowingIso,
      emoji: catalog?.emoji ?? "🌾",
      stage,
    });
    setActiveField(newId);
    setMeasurePromptId(newId);
    if (sowingIso && fieldCropSlug) {
      setSowingDate(fieldCropSlug, sowingIso);
    }
    setFieldName("");
    setFieldArea("");
    setFieldVariety("");
    setFieldCropSlug("");
    setFieldSowing("");
    setCropPickerOpen(false);
    setCropQuery("");
    setCropCategory("all");
    setShowAddField(false);
    showToast(
      sowingIso
        ? (isHi ? "खेत सेव · बुवाई तारीख जुड़ गई ✓" : "Field saved · Sowing date attached ✓")
        : (isHi ? "खेत सेव · बाद में बुवाई तारीख डालना न भूलें" : "Field saved · Sowing date can be added later")
    );
  };

  return (
    <div className="relative mx-auto min-w-0 max-w-lg overflow-x-hidden pb-2 sm:max-w-2xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-20px] top-0 h-[280px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(ellipse_at_90%_10%,rgba(180,140,70,0.1),transparent_45%),linear-gradient(180deg,#e8f6ee_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(180deg,rgba(6,40,24,0.35)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 space-y-3 px-1 pt-1">
        <motion.section {...fade(0)} className="flex items-start justify-between gap-3 px-0.5">
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-[var(--av-text-muted)]">
              {isHi ? `नमस्ते, ${greetName} जी` : `Namaste, ${greetName}`}
            </p>
            <h1 className="mt-0.5 font-display text-[1.35rem] font-bold leading-tight tracking-tight text-[var(--av-text-primary)]">
              {isHi ? "मेरा खेत" : "My farm"}
            </h1>
            <p className="mt-0.5 truncate text-[11.5px] font-medium text-[var(--av-text-secondary)]">
              {hasFields
                ? `${stats.totalFields} ${isHi ? "खेत" : "fields"} · ${totalAreaLabel(data.fields)}`
                : isHi
                  ? "अभी खेत नहीं जुड़ा"
                  : "No field yet"}
              {place ? ` · ${place}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowAddField((v) => {
                const next = !v;
                if (next && !fieldCropSlug) setCropPickerOpen(true);
                return next;
              });
            }}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-700 px-3.5 py-2 text-[12px] font-bold text-white shadow-sm shadow-emerald-900/20 active:scale-[0.97]"
          >
            {showAddField ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showAddField ? (isHi ? "बंद" : "Close") : isHi ? "खेत जोड़ो" : "Add field"}
          </button>
        </motion.section>

        {!showAddField && hasFields && topAlert ? (
          <motion.section {...fade(0.03)}>
            <AppLink
              href={topAlert.actionHref ?? "/field-advisor"}
              onClick={() =>
                track("tool_open", { href: topAlert.actionHref ?? "/field-advisor", label: "farm_alert" })
              }
              className="flex items-center gap-2.5 rounded-2xl border border-emerald-900/10 bg-[var(--av-surface)] px-3.5 py-2.5 shadow-[var(--av-shadow-sm)] active:scale-[0.99]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600/12 text-emerald-700 dark:text-emerald-300">
                <Sprout className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-[var(--av-text-primary)]">
                {topAlert.title}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-emerald-600" />
            </AppLink>
          </motion.section>
        ) : null}

        <motion.section {...fade(0.05)} className="space-y-2.5">

          {showAddField ? (
            <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-[var(--av-surface)] shadow-[var(--av-shadow-md)]">
              <div className="relative h-20 overflow-hidden">
                <Image
                  src={
                    selectedCrop
                      ? resolveCropImage({ slug: selectedCrop.slug, name: selectedCrop.name })
                      : "/images/jobs/job-my-farm.jpg"
                  }
                  alt=""
                  fill
                  sizes="480px"
                  className="object-cover"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/50 to-black/20" />
                <div className="relative z-10 flex h-full items-center justify-between px-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200">
                      {isHi ? "नया खेत जोड़ें" : "Add New Field"}
                    </p>
                    <p className="font-display text-[1.15rem] font-bold text-white">
                      {selectedCrop
                        ? isHi
                          ? getCropHindiName(selectedCrop.slug) ||
                            selectedCrop.nameHi ||
                            selectedCrop.name
                          : selectedCrop.name
                        : isHi
                          ? "फसल · रकबा · बुवाई"
                          : "Crop · Area · Sowing"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddField(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                    aria-label={isHi ? "बंद करें" : "Close"}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-4">
                {/* STEP 1: फसल चुनें (Step 1 - सबसे ऊपर) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[var(--av-text-primary)] flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                        1
                      </span>
                      {isHi ? "फसल चुनें" : "Select Crop"}
                      <span className="text-rose-500">*</span>
                    </label>
                  </div>

                  {/* Selected Crop Bar (Collapsed) */}
                  {selectedCrop && !cropPickerOpen ? (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-2.5 dark:bg-emerald-950/30">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-emerald-500/30 shadow-sm">
                          <Image
                            src={resolveCropImage({ slug: selectedCrop.slug, name: selectedCrop.name })}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                            {isHi ? "चुनी गई फसल" : "Selected Crop"}
                          </span>
                          <p className="text-[15px] font-bold text-[var(--av-text-primary)]">
                            {isHi
                              ? getCropHindiName(selectedCrop.slug) ||
                                selectedCrop.nameHi ||
                                selectedCrop.name
                              : selectedCrop.name}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCropPickerOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-[var(--av-surface)] px-2.5 py-1.5 text-xs font-bold text-emerald-700 shadow-sm hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/50 active:scale-95 transition"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        {isHi ? "फसल बदलें" : "Change crop"}
                      </button>
                    </div>
                  ) : (
                    /* Expanded Crop Picker */
                    <div className="space-y-2 rounded-xl border border-emerald-500/25 bg-[var(--av-surface-inset)] p-2.5">
                      {selectedCrop && cropPickerOpen ? (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setCropPickerOpen(false)}
                            className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300"
                          >
                            ✕ {isHi ? "बंद करें" : "Collapse"}
                          </button>
                        </div>
                      ) : null}

                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--av-text-muted)]" />
                        <input
                          value={cropQuery}
                          onChange={(e) => setCropQuery(e.target.value)}
                          placeholder={isHi ? "खोजें: गेहूँ, धान, टमाटर, कपास..." : "Search: wheat, paddy, tomato, cotton..."}
                          className="av-input av-input--icon w-full py-2 text-xs"
                        />
                      </div>

                      <div className="flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <button
                          type="button"
                          onClick={() => setCropCategory("all")}
                          className={cn(
                            "shrink-0 rounded-md px-2.5 py-1 text-[10px] font-bold transition",
                            cropCategory === "all"
                              ? "bg-emerald-700 text-white"
                              : "bg-[var(--av-surface)] text-[var(--av-text-muted)]"
                          )}
                        >
                          {isHi ? "सभी" : "All"}
                        </button>
                        {categoryOrder.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCropCategory(cat)}
                            className={cn(
                              "shrink-0 rounded-md px-2.5 py-1 text-[10px] font-bold transition",
                              cropCategory === cat
                                ? "bg-emerald-700 text-white"
                                : "bg-[var(--av-surface)] text-[var(--av-text-muted)]"
                            )}
                          >
                            {isHi ? CATEGORY_HI[cat] ?? cat : cat}
                          </button>
                        ))}
                      </div>

                      <div className="grid max-h-48 grid-cols-3 gap-2 overflow-y-auto rounded-lg bg-[var(--av-surface)] p-2 sm:grid-cols-4">
                        {filteredCrops.length === 0 ? (
                          <p className="col-span-full py-4 text-center text-xs text-[var(--av-text-muted)]">
                            {isHi ? "कोई फसल नहीं मिली" : "No crops found"}
                          </p>
                        ) : (
                          filteredCrops.map((crop) => {
                            const hi = getCropHindiName(crop.slug);
                            const active = fieldCropSlug === crop.slug;
                            return (
                              <button
                                key={crop.slug}
                                type="button"
                                onClick={() => {
                                  setFieldCropSlug(crop.slug);
                                  setFieldVariety("");
                                  setCropPickerOpen(false);
                                }}
                                className={cn(
                                  "overflow-hidden rounded-xl border text-left transition active:scale-[0.98]",
                                  active
                                    ? "border-emerald-500 ring-2 ring-emerald-500/35"
                                    : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
                                )}
                              >
                                <span className="relative block h-14 w-full overflow-hidden">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={resolveCropImage({ slug: crop.slug, name: crop.name })}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                  {active ? <span className="absolute inset-0 bg-emerald-600/25" /> : null}
                                </span>
                                <span className="block truncate px-1.5 py-1 text-[10px] font-bold text-[var(--av-text-primary)]">
                                  {isHi ? hi || crop.nameHi || crop.name : crop.name}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* STEP 2: रकबा (एकड़) + खेत का नाम (Step 2) */}
                <div className="space-y-3 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]/50 p-3">
                  <label className="text-xs font-bold text-[var(--av-text-primary)] flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                      2
                    </span>
                    {isHi ? "रकबा और खेत का नाम" : "Area & Field Name"}
                  </label>

                  {/* रकबा (एकड़) */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[var(--av-text-secondary)]">
                        {isHi ? "रकबा (एकड़)" : "Area (acres)"} <span className="text-rose-500">*</span>
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      inputMode="decimal"
                      value={fieldArea}
                      onChange={(e) => setFieldArea(e.target.value)}
                      placeholder={isHi ? "जैसे: 2.0" : "e.g. 2.0"}
                      className="av-input text-sm"
                    />
                    {/* Quick select chips */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-[var(--av-text-muted)] mr-0.5">
                        {isHi ? "त्वरित चयन:" : "Quick select:"}
                      </span>
                      {ACRE_PRESETS.map((acre) => {
                        const active = fieldArea === acre;
                        return (
                          <button
                            key={acre}
                            type="button"
                            onClick={() => setFieldArea(acre)}
                            className={cn(
                              "rounded-lg px-2.5 py-1 text-xs font-semibold transition active:scale-95",
                              active
                                ? "bg-emerald-700 text-white shadow-sm"
                                : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)] hover:border-emerald-500/40"
                            )}
                          >
                            {acre} {isHi ? "एकड़" : "acre"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* खेत का नाम (वैकल्पिक) */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[var(--av-text-secondary)]">
                        {isHi ? "खेत का नाम (वैकल्पिक)" : "Field Name (optional)"}
                      </span>
                      <span className="text-[10px] text-[var(--av-text-muted)]">
                        {isHi ? "खाली छोड़ने पर स्वतः नाम बनेगा" : "Auto-generated if empty"}
                      </span>
                    </div>
                    <input
                      value={fieldName}
                      onChange={(e) => setFieldName(e.target.value)}
                      placeholder={
                        selectedCrop
                          ? isHi
                            ? `जैसे: खेत ${data.fields.length + 1} (${getCropHindiName(selectedCrop.slug) || selectedCrop.nameHi || selectedCrop.name})`
                            : `e.g. Field ${data.fields.length + 1} (${selectedCrop.name})`
                          : isHi
                            ? `जैसे: खेत ${data.fields.length + 1}`
                            : `e.g. Field ${data.fields.length + 1}`
                      }
                      className="av-input text-sm"
                    />
                  </div>
                </div>

                {/* STEP 3: बुवाई की तारीख (Step 3) */}
                <div className="space-y-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]/50 p-3">
                  <label className="text-xs font-bold text-[var(--av-text-primary)] flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                      3
                    </span>
                    {isHi ? "बुवाई की तारीख (वैकल्पिक)" : "Sowing Date (optional)"}
                  </label>
                  <input
                    type="date"
                    max={todayISO()}
                    value={fieldSowing}
                    onChange={(e) => setFieldSowing(e.target.value)}
                    className="av-input text-sm"
                  />
                  {/* Date shortcuts */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-[var(--av-text-muted)] mr-0.5">
                      {isHi ? "शॉर्टकट:" : "Shortcuts:"}
                    </span>
                    {[
                      { labelHi: "आज", labelEn: "Today", days: 0 },
                      { labelHi: "10 दिन पहले", labelEn: "10d ago", days: 10 },
                      { labelHi: "20 दिन पहले", labelEn: "20d ago", days: 20 },
                      { labelHi: "30 दिन पहले", labelEn: "30d ago", days: 30 },
                    ].map((s) => (
                      <button
                        key={s.days}
                        type="button"
                        onClick={() => setSowingDaysAgo(s.days)}
                        className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--av-text-secondary)] transition hover:border-emerald-500/40 active:scale-95"
                      >
                        {isHi ? s.labelHi : s.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* STEP 4: किस्म / वैरायटी (वैकल्पिक) (Step 4) */}
                <div className="space-y-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]/50 p-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[var(--av-text-primary)] flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                        4
                      </span>
                      {isHi ? "किस्म / वैरायटी (वैकल्पिक)" : "Variety (optional)"}
                    </label>
                  </div>
                  <input
                    value={fieldVariety}
                    onChange={(e) => setFieldVariety(e.target.value)}
                    placeholder={
                      isHi
                        ? "किस्म चुनें या लिखें (जैसे: HD 2967)"
                        : "Select or type variety (e.g. HD 2967)"
                    }
                    className="av-input text-sm"
                  />
                  {/* Popular variety chips */}
                  {varietyChips.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] font-semibold text-[var(--av-text-muted)] mr-0.5">
                        {isHi ? "लोकप्रिय किस्में:" : "Popular varieties:"}
                      </span>
                      {varietyChips.map((v) => {
                        const active = fieldVariety === v;
                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setFieldVariety(v)}
                            className={cn(
                              "rounded-lg px-2.5 py-1 text-xs font-semibold transition active:scale-95",
                              active
                                ? "bg-emerald-700 text-white shadow-sm"
                                : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)] hover:border-emerald-500/40"
                            )}
                          >
                            {v}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                {/* SAVE BUTTON - Active deep green #15803d */}
                <button
                  type="button"
                  onClick={handleAddField}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#15803d] hover:bg-[#166534] py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-900/30 active:scale-[0.99] transition"
                >
                  <Check className="h-5 w-5" />
                  <span>{isHi ? "खेत सुरक्षित करें" : "Save Field"}</span>
                </button>
              </div>
            </div>
          ) : null}

          {hasFields && !showAddField ? (
            <div className="space-y-3">
              {data.fields.length > 1 ? (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {data.fields.map((f) => {
                    const isSelected = f.id === (selectedFieldId || data.fields[0]?.id);
                    const displayName = f.name?.match(/^\d+$/)
                      ? (isHi ? `खेत ${f.name}` : `Field ${f.name}`)
                      : f.name;
                    const hiCrop = getCropHindiName(f.cropSlug || "") || f.crop;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setActiveField(f.id);
                        }}
                        className={cn(
                          "shrink-0 rounded-2xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 border active:scale-95",
                          isSelected
                            ? "bg-emerald-700 text-white border-emerald-700 shadow-md"
                            : "bg-[var(--av-surface)] text-[var(--av-text-secondary)] border-[var(--av-border)] hover:border-emerald-500/40"
                        )}
                      >
                        <Sprout className={cn("h-3.5 w-3.5", isSelected ? "text-emerald-200" : "text-emerald-600")} />
                        <span>{displayName}</span>
                        {hiCrop ? (
                          <span className={cn("text-[10px] font-medium", isSelected ? "text-emerald-100" : "text-[var(--av-text-secondary)]")}>
                            · {hiCrop}
                          </span>
                        ) : null}
                        <span className={cn("text-[10px] font-semibold", isSelected ? "text-emerald-100" : "text-[var(--av-text-muted)]")}>
                          ({f.areaAcres ? `${f.areaAcres} एकड़` : f.area})
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {data.fields.map((f, i) => {
                const isSelected = f.id === (selectedFieldId || data.fields[0]?.id);
                if (data.fields.length > 1 && !isSelected) {
                  return null; // Show selected field prominently
                }
                const img = resolveCropImage({
                  slug: f.cropSlug || "",
                  name: f.crop,
                });
                const hi = getCropHindiName(f.cropSlug || "") || f.crop;
                const rawName = f.name?.match(/^\d+$/) ? (isHi ? `खेत ${f.name}` : `Field ${f.name}`) : f.name;
                const displayName =
                  hi && rawName.includes(hi)
                    ? rawName.replace(hi, "").replace(/[·•|,]+/g, " ").replace(/\s+/g, " ").trim() || rawName
                    : rawName;
                const sowingIso =
                  parseSowingISO(f.sowingDateIso) ||
                  parseSowingISO(f.sowingDate) ||
                  (f.cropSlug ? parseSowingISO(profile.sowingDates?.[f.cropSlug]) : null);
                const sowingLabel = sowingIso ? formatSowingDisplay(sowingIso, isHi) : "";
                const stageNow = fieldStageLabel(sowingIso, isHi);
                const areaText = f.areaAcres
                  ? `${Number(f.areaAcres).toFixed(f.areaAcres % 1 === 0 ? 0 : 2)} एकड़`
                  : f.area
                    ? String(f.area).replace(/\s*Acre$/i, " एकड़")
                    : "—";
                const tools = [
                  { href: `/my-farm/${f.id}?tab=live`, icon: Compass, hi: "स्थिति", en: "Live" },
                  { href: `/my-farm/${f.id}?tab=radar`, icon: Radio, hi: "सेहत", en: "Health" },
                  { href: `/my-farm/${f.id}?tab=journey`, icon: Sprout, hi: "अवस्था", en: "Stage" },
                  {
                    href: measureFieldHref(f.id),
                    icon: Ruler,
                    hi: f.boundary?.length ? "सीमा" : "नापें",
                    en: f.boundary?.length ? "Edit" : "Measure",
                  },
                ] as const;
                return (
                  <motion.article
                    key={f.id}
                    {...(reduced
                      ? {}
                      : {
                          initial: { opacity: 0, y: 8 },
                          animate: { opacity: 1, y: 0 },
                          transition: {
                            duration: MOTION.slow,
                            ease: EASE_OUT,
                            delay: 0.04 * Math.min(i, 4),
                          },
                        })}
                    className="overflow-hidden rounded-[1.35rem] border border-emerald-900/10 bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)] dark:border-emerald-500/15"
                  >
                    <div className="relative h-[168px] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(isHi ? `क्या आप '${displayName}' हटाएँगे?` : `Delete '${displayName}'?`)) {
                            deleteField(f.id);
                            showToast(isHi ? "खेत हटा दिया गया" : "Field deleted", "success");
                          }
                        }}
                        className="absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white/90 backdrop-blur-sm active:scale-95"
                        title={isHi ? "खेत हटाएं" : "Delete field"}
                        aria-label={isHi ? "खेत हटाएं" : "Delete field"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <AppLink
                        href={`/my-farm/${f.id}`}
                        className="relative z-10 flex h-full flex-col justify-end p-3.5"
                      >
                        <p className="font-display text-[1.35rem] font-bold leading-tight text-white">
                          {hi}
                          {f.variety ? ` · ${f.variety}` : ""}
                        </p>
                        <p className="mt-0.5 text-[12px] font-medium text-white/85">
                          {(() => {
                            const placeLabel = (f.village || profile.village || "").trim();
                            const nameBit = (displayName || "").trim();
                            const placeAndName =
                              placeLabel && nameBit && nameBit.includes(placeLabel)
                                ? nameBit
                                : [placeLabel, nameBit].filter(Boolean).join(" · ");
                            return [placeAndName, areaText].filter(Boolean).join(" · ");
                          })()}
                        </p>
                        {sowingLabel ? (
                          <p className="mt-0.5 text-[11px] text-white/70">
                            {sowingLabel}
                            {stageNow ? ` · ${stageNow}` : ""}
                          </p>
                        ) : (
                          <p className="mt-0.5 text-[11px] font-semibold text-amber-200">
                            {isHi ? "बुवाई तारीख जोड़ें" : "Add sowing date"}
                          </p>
                        )}
                      </AppLink>
                    </div>

                    <div className="grid grid-cols-4 gap-1 p-1.5">
                      {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <AppLink
                            key={tool.href}
                            href={tool.href}
                            className="flex flex-col items-center gap-1 rounded-xl py-2.5 text-[10.5px] font-bold text-[var(--av-text-primary)] active:scale-[0.97] active:bg-emerald-500/10"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-300">
                              <Icon className="h-4 w-4" />
                            </span>
                            {isHi ? tool.hi : tool.en}
                          </AppLink>
                        );
                      })}
                    </div>

                    {f.boundary && f.boundary.length >= 3 ? (
                      <div className="px-1.5 pb-1.5">
                        <MiniFieldMap boundary={f.boundary} height="110px" />
                      </div>
                    ) : null}
                  </motion.article>
                );
              })}
            </div>
          ) : !showAddField ? (
            <div className="rounded-[1.35rem] border border-emerald-900/10 bg-[var(--av-surface)] px-5 py-8 text-center shadow-[var(--av-shadow-sm)] dark:border-emerald-500/15">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-300">
                <Sprout className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-[15px] font-bold text-[var(--av-text-primary)]">
                {isHi ? "पहला खेत जोड़ें" : "Add your first field"}
              </h3>
              <p className="mx-auto mt-1 max-w-[16rem] text-[12px] text-[var(--av-text-muted)]">
                {isHi
                  ? "पहले फसल और रकबा जोड़ें। नापना बाद में भी हो सकता है।"
                  : "Add crop and area first. Measuring can wait."}
              </p>
              <div className="mt-4 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddField(true);
                    if (!fieldCropSlug) setCropPickerOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-md"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {isHi ? "खेत जोड़ें" : "Add field"}
                </button>
                <MeasureFieldButton className="px-5 py-2 text-xs" variant="ghost" />
              </div>
            </div>
          ) : null}
        </motion.section>
      </div>
      <MeasureAfterAddPrompt
        fieldId={measurePromptId}
        isHi={isHi}
        onDismiss={() => setMeasurePromptId(null)}
      />
    </div>
  );
}
