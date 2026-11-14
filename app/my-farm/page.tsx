"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  Pencil,
  Mic,
  Plus,
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
  daysAfterSowingISO,
  fieldStageLabel,
  formatSowingDisplay,
  parseSowingISO,
  todayISO,
} from "@/lib/farm/fieldStatus";
import { cn } from "@/lib/cn";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { track } from "@/lib/analytics";
import { suggestFieldName } from "@/lib/farm/fieldName";
import { getBighaInfo } from "@/lib/bighaConversion";
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

const AREA_PRESETS = ["1", "2", "5", "10"];
const JUST_ADDED_KEY = "agriveda-field-just-added";
const POPULAR_SLUGS = ["wheat", "mustard", "paddy", "potato", "chana", "tomato", "onion", "maize", "cotton"];

type AreaUnitPick = "bigha" | "acre" | "kanal" | "hectare";

type SavedFieldCard = {
  id: string;
  cropHi: string;
  slug: string;
  variety: string;
  stage: string;
  areaLabel: string;
  acresLabel: string;
  place: string;
};

function unitForState(state: string): AreaUnitPick {
  const s = state.trim().toLowerCase();
  if (/haryana|हरियाणा|punjab|पंजाब/.test(s)) return "kanal";
  if (/rajasthan|राजस्थान|uttar pradesh|उत्तर प्रदेश/.test(s)) return "bigha";
  return "acre";
}

function unitShort(unit: AreaUnitPick, hi: boolean): string {
  if (unit === "bigha") return hi ? "बीघा" : "bigha";
  if (unit === "kanal") return hi ? "कनाल" : "kanal";
  if (unit === "hectare") return hi ? "हेक्टेयर" : "ha";
  return hi ? "एकड़" : "acre";
}

function confirmStage(slug: string, iso: string, hi: boolean): string {
  const days = daysAfterSowingISO(iso);
  if (slug === "wheat" && days != null && days >= 18 && days <= 30) {
    return hi ? `${days} दिन · पहली सिंचाई` : `Day ${days} · first irrigation`;
  }
  return fieldStageLabel(iso, hi);
}

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
  const router = useRouter();
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
  const [addStep, setAddStep] = useState<1 | 2 | 3>(1);
  const [areaUnit, setAreaUnit] = useState<AreaUnitPick>("acre");
  const [showCalendar, setShowCalendar] = useState(false);
  const [savedCard, setSavedCard] = useState<SavedFieldCard | null>(null);
  const [cropPickerOpen, setCropPickerOpen] = useState(false);
  const [cropQuery, setCropQuery] = useState("");
  const [cropCategory, setCropCategory] = useState<(typeof categoryOrder)[number] | "all">("all");

  const filteredCrops = useMemo(() => {
    const q = cropQuery.trim().toLowerCase();
    const list = cropCatalog.filter((c) => {
      if (cropCategory !== "all" && c.category !== cropCategory) return false;
      if (!q) return true;
      const hay = `${c.name} ${c.nameHi ?? ""} ${c.slug}`.toLowerCase();
      return hay.includes(q);
    });
    if (q || cropCategory !== "all") return list;
    const rank = (slug: string) => {
      const i = POPULAR_SLUGS.indexOf(slug);
      return i === -1 ? POPULAR_SLUGS.length : i;
    };
    return [...list].sort((a, b) => rank(a.slug) - rank(b.slug));
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

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(JUST_ADDED_KEY);
      if (!raw) return;
      sessionStorage.removeItem(JUST_ADDED_KEY);
      const card = JSON.parse(raw) as SavedFieldCard;
      if (card?.id && card.cropHi) {
        setSavedCard(card);
        setAddStep(3);
        setShowAddField(true);
      }
    } catch {
      /* ignore a bad card */
    }
  }, []);

  const place = [profile.village, profile.district].filter(Boolean).join(", ");

  const acresFromEntry = (raw: string) => {
    const n = parseFloat(raw);
    if (!Number.isFinite(n) || n <= 0) return 0;
    if (areaUnit === "bigha") return Math.round(n * getBighaInfo(profile.state, profile.district).acresPerBigha * 100) / 100;
    if (areaUnit === "kanal") return Math.round(n * 0.125 * 100) / 100;
    if (areaUnit === "hectare") return Math.round(n * 2.471 * 100) / 100;
    return Math.round(n * 100) / 100;
  };

  const listenForCrop = () => {
    const w = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        start: () => void;
        onresult: ((event: { results: { 0: { 0: { transcript?: string } } } }) => void) | null;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        start: () => void;
        onresult: ((event: { results: { 0: { 0: { transcript?: string } } } }) => void) | null;
      };
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      showToast(isHi ? "इस फोन पर बोलकर खोज नहीं चलेगी — नाम लिखें" : "Voice search is not available", "error");
      return;
    }
    const recognition = new Ctor();
    recognition.lang = "hi-IN";
    recognition.onresult = (event) => {
      const said = event.results[0]?.[0]?.transcript?.trim();
      if (said) setCropQuery(said);
    };
    recognition.start();
  };
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

  const openAddField = () => {
    setSavedCard(null);
    setAddStep(1);
    setShowCalendar(false);
    setAreaUnit(unitForState(profile.state || ""));
    setShowAddField(true);
    if (!fieldCropSlug) setCropPickerOpen(true);
  };

  const commitField = (goMeasure: boolean) => {
    const catalog = cropCatalog.find((c) => c.slug === fieldCropSlug);
    if (!catalog && !fieldCropSlug) {
      showToast(isHi ? "पहले फसल चुनें" : "Select a crop first", "error");
      return;
    }
    const sowingIso = parseSowingISO(fieldSowing);
    if (!sowingIso) {
      showToast(isHi ? "बुवाई का समय चुनें — तभी दिन सही बनेंगे" : "Pick when you sowed", "error");
      setAddStep(1);
      return;
    }
    const entered = parseFloat(fieldArea);
    const acres = acresFromEntry(fieldArea);
    if (!Number.isFinite(entered) || entered <= 0 || acres <= 0) {
      showToast(isHi ? "रकबा भरें" : "Enter the area", "error");
      return;
    }

    const cropHindi = catalog ? (getCropHindiName(catalog.slug) || catalog.nameHi || catalog.name) : "";
    const cropLabel = isHi ? (cropHindi || catalog?.name || "") : (catalog?.name || cropHindi || "");
    const finalFieldName = fieldName.trim() || suggestFieldName({
      existing: data.fields,
      cropHi: cropHindi || catalog?.name,
      village: profile.village,
    });
    const stage = confirmStage(fieldCropSlug, sowingIso, isHi);
    const localLabel = `${entered} ${unitShort(areaUnit, true)}`;
    const newId = addField({
      name: finalFieldName,
      area: `${acres.toFixed(2)} Acre`,
      areaAcres: acres,
      bighaDisplay: areaUnit === "acre" ? undefined : localLabel,
      ownership: "Owned",
      crop: cropLabel,
      cropSlug: fieldCropSlug || undefined,
      variety: fieldVariety.trim() || undefined,
      status: "Active",
      sowingDate: formatSowingDisplay(sowingIso, isHi),
      sowingDateIso: sowingIso,
      emoji: catalog?.emoji ?? "🌾",
      stage,
      placeState: profile.state || undefined,
      placeDistrict: profile.district || undefined,
      village: profile.village || undefined,
      measurementMethod: "manual_entry",
    });
    setActiveField(newId);
    if (fieldCropSlug) setSowingDate(fieldCropSlug, sowingIso);
    const card: SavedFieldCard = {
      id: newId,
      cropHi: cropHindi || cropLabel,
      slug: fieldCropSlug,
      variety: fieldVariety.trim(),
      stage,
      areaLabel: localLabel,
      acresLabel: `${acres} एकड़`,
      place: [profile.village, profile.district].filter(Boolean).join(", "),
    };
    try {
      sessionStorage.setItem(JUST_ADDED_KEY, JSON.stringify(card));
    } catch {
      /* private mode */
    }
    setSavedCard(card);
    setFieldName("");
    setFieldArea("");
    setFieldVariety("");
    setFieldCropSlug("");
    setFieldSowing("");
    setCropQuery("");
    setShowCalendar(false);
    if (goMeasure) {
      router.push(`/my-farm/measure?editId=${encodeURIComponent(newId)}&return=${encodeURIComponent("/my-farm")}`);
      return;
    }
    setAddStep(3);
    setShowAddField(true);
    showToast(isHi ? "खेत जुड़ गया ✓" : "Field added ✓");
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
        <motion.section {...fade(0)} className="flex items-end justify-between gap-3 px-0.5">
          <div className="min-w-0">
            <h1 className="font-display text-[1.15rem] font-bold leading-tight text-[var(--av-text-primary)]">
              {isHi ? "मेरा खेत" : "My farm"}
            </h1>
            <p className="mt-0.5 truncate text-[13px] font-medium text-[var(--av-text-secondary)]">
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
                  if (showAddField) {
                    setShowAddField(false);
                    setSavedCard(null);
                    setAddStep(1);
                    return;
                  }
                  openAddField();
                }}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-700 px-3.5 py-2 text-[12px] font-bold text-white shadow-sm shadow-emerald-900/20 active:scale-[0.97]"
              >
                {showAddField ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {showAddField ? (isHi ? "बंद" : "Close") : isHi ? "खेत जोड़ो" : "Add field"}
              </button>
        </motion.section>

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
                {addStep === 3 && savedCard ? (
                  <div className="space-y-3 rounded-xl border border-emerald-200 bg-[#F6F9F7] p-4">
                    <p className="text-[16px] font-bold text-[#14532D]">आपका खेत जुड़ गया है</p>
                    <p className="text-[15px] font-semibold text-[var(--av-text-primary)]">
                      फसल: {savedCard.cropHi}
                      {savedCard.variety ? ` (${savedCard.variety})` : ""}
                    </p>
                    <p className="text-[14px] text-[var(--av-text-secondary)]">अवस्था: {savedCard.stage}</p>
                    <p className="text-[14px] text-[var(--av-text-secondary)]">
                      रकबा: {savedCard.areaLabel} ({savedCard.acresLabel})
                    </p>
                    {savedCard.place ? (
                      <p className="text-[14px] text-[var(--av-text-secondary)]">स्थान: {savedCard.place}</p>
                    ) : null}
                    <AppLink
                      href={savedCard.slug ? `/crops/${savedCard.slug}` : "/crops"}
                      className="flex w-full items-center justify-center rounded-xl bg-[#15803D] py-3 text-[15px] font-bold text-white"
                    >
                      मेरी फसल की सलाह देखें
                    </AppLink>
                  </div>
                ) : null}

                {addStep === 1 ? (
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
                          placeholder={isHi ? "बोलकर या लिखकर फसल खोजें" : "Search a crop"}
                          className="av-input av-input--icon w-full py-2.5 text-base"
                        />
                        <button
                          type="button"
                          onClick={listenForCrop}
                          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-700 text-white"
                          aria-label={isHi ? "बोलकर फसल खोजें" : "Speak crop name"}
                        >
                          <Mic className="h-4 w-4" />
                        </button>
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
                                  setFieldSowing("");
                                  setShowCalendar(false);
                                  setCropPickerOpen(false);
                                  setAddStep(1);
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
                  {fieldCropSlug ? (
                    <div className="space-y-2 rounded-xl border border-emerald-200 bg-white p-3">
                      <p className="text-[13px] font-bold text-[#14532D]">बुवाई कब हुई?</p>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { label: "आज / कल बोई है", days: 1 },
                          { label: "लगभग 1 हफ़्ता पहले", days: 7 },
                          { label: "लगभग 15 दिन पहले", days: 15 },
                        ].map((opt) => (
                          <button
                            key={opt.days}
                            type="button"
                            onClick={() => {
                              setSowingDaysAgo(opt.days);
                              setShowCalendar(false);
                            }}
                            className="rounded-xl border border-[#d5eadc] bg-[#F6F9F7] px-3 py-2.5 text-left text-[14px] font-semibold text-[var(--av-text-primary)]"
                          >
                            {opt.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setShowCalendar(true)}
                          className="rounded-xl border border-[#d5eadc] bg-white px-3 py-2.5 text-left text-[14px] font-semibold"
                        >
                          तारीख चुनें
                        </button>
                      </div>
                      {showCalendar ? (
                        <input
                          type="date"
                          max={todayISO()}
                          value={fieldSowing}
                          onChange={(e) => setFieldSowing(e.target.value)}
                          className="av-input text-base"
                        />
                      ) : null}
                      {fieldSowing ? (
                        <p className="text-[12px] font-semibold text-emerald-800">
                          {formatSowingDisplay(fieldSowing, isHi)} · {confirmStage(fieldCropSlug, fieldSowing, isHi)}
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          if (!parseSowingISO(fieldSowing)) {
                            showToast(isHi ? "बुवाई का समय चुनें" : "Pick sowing time", "error");
                            return;
                          }
                          setAddStep(2);
                        }}
                        className="w-full rounded-xl bg-[#15803D] py-3 text-[15px] font-bold text-white"
                      >
                        रकबा भरें
                      </button>
                    </div>
                  ) : null}
                </div>
                ) : null}

                {addStep === 2 ? (
                <div className="space-y-3 rounded-xl border border-[var(--av-border)] bg-white p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-bold text-[#14532D]">रकबा</p>
                    <button type="button" onClick={() => setAddStep(1)} className="text-[12px] font-bold text-emerald-800">
                      फसल बदलें
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(["bigha", "acre", "kanal", "hectare"] as const).map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => setAreaUnit(unit)}
                        className={cn(
                          "rounded-lg py-2 text-[12px] font-bold",
                          areaUnit === unit ? "bg-[#15803D] text-white" : "border border-[#d5eadc] bg-[#F6F9F7]"
                        )}
                      >
                        {unitShort(unit, true)}
                      </button>
                    ))}
                  </div>
                  {areaUnit === "bigha" ? (
                    <p className="text-[12px] text-[var(--av-text-muted)]">{getBighaInfo(profile.state, profile.district).label}</p>
                  ) : areaUnit === "kanal" ? (
                    <p className="text-[12px] text-[var(--av-text-muted)]">8 कनाल = 1 एकड़</p>
                  ) : null}
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    value={fieldArea}
                    onChange={(e) => setFieldArea(e.target.value)}
                    placeholder={`जैसे: 4 ${unitShort(areaUnit, true)}`}
                    className="av-input text-base font-bold"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {AREA_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFieldArea(preset)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-[13px] font-bold",
                          fieldArea === preset ? "bg-[#15803D] text-white" : "border border-[#d5eadc] bg-[#F6F9F7]"
                        )}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  {fieldArea && acresFromEntry(fieldArea) > 0 ? (
                    <p className="text-[12px] font-semibold text-emerald-800">
                      {fieldArea} {unitShort(areaUnit, true)} = {acresFromEntry(fieldArea)} एकड़
                    </p>
                  ) : null}

                  {varietyChips.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {varietyChips.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setFieldVariety(fieldVariety === v ? "" : v)}
                          className={cn(
                            "rounded-lg px-2.5 py-1 text-[12px] font-semibold",
                            fieldVariety === v ? "bg-[#15803D] text-white" : "border border-[#d5eadc] bg-[#F6F9F7]"
                          )}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => commitField(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#15803D] py-3.5 text-[15px] font-bold text-white"
                  >
                    आगे बढ़ें
                  </button>
                  <button
                    type="button"
                    onClick={() => commitField(true)}
                    className="w-full rounded-xl border border-[#15803D] py-3 text-[14px] font-bold text-[#14532D]"
                  >
                    नक्शे पर खेत की मेड़ जोड़ें (वैकल्पिक)
                  </button>
                </div>
                ) : null}
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
                const days = daysAfterSowingISO(sowingIso);
                const phase = stageNow.includes("·")
                  ? stageNow.split("·").pop()?.trim() || stageNow
                  : stageNow;
                const areaText = f.areaAcres
                  ? `${Number(f.areaAcres).toFixed(f.areaAcres % 1 === 0 ? 0 : 2)} एकड़`
                  : f.area
                    ? String(f.area).replace(/\s*Acre$/i, " एकड़")
                    : "—";
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
                    className="relative overflow-hidden rounded-[1.35rem] border border-emerald-900/10 bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)] dark:border-emerald-500/15"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(isHi ? `क्या आप '${displayName}' हटाएँगे?` : `Delete '${displayName}'?`)) {
                          deleteField(f.id);
                          showToast(isHi ? "खेत हटा दिया गया" : "Field deleted", "success");
                        }
                      }}
                      className="absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white active:scale-95"
                      title={isHi ? "खेत हटाएं" : "Delete field"}
                      aria-label={isHi ? "खेत हटाएं" : "Delete field"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <AppLink href={`/my-farm/${f.id}`} className="flex gap-3 p-3 pr-12">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt=""
                        className="h-[92px] w-[92px] shrink-0 rounded-2xl object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[16px] font-bold leading-tight text-[var(--av-text-primary)]">
                          {hi}
                          {f.variety ? ` · ${f.variety}` : ""}
                        </span>
                        <span className="mt-1 block truncate text-[13px] font-medium text-[var(--av-text-secondary)]">
                          {(() => {
                            const placeLabel = (f.village || profile.village || "").trim();
                            const nameBit = (displayName || "").trim();
                            const placeAndName =
                              placeLabel && nameBit && nameBit.includes(placeLabel)
                                ? nameBit
                                : [placeLabel, nameBit].filter(Boolean).join(" · ");
                            return [placeAndName, areaText].filter(Boolean).join(" · ");
                          })()}
                        </span>
                        {days != null && days >= 0 ? (
                          <span className="mt-1.5 block text-[13px] font-bold text-emerald-800 dark:text-emerald-200">
                            {isHi ? `${days} दिन` : `Day ${days}`}
                            {phase ? ` · ${phase}` : ""}
                          </span>
                        ) : (
                          <span className="mt-1.5 block text-[13px] font-bold text-[#8a5a12]">
                            {isHi ? "बुवाई की तारीख डालें" : "Add sowing date"}
                          </span>
                        )}
                        {sowingLabel ? (
                          <span className="mt-0.5 block text-[12px] text-[var(--av-text-muted)]">
                            {isHi ? `${sowingLabel} को बोया` : `Sown ${sowingLabel}`}
                          </span>
                        ) : null}
                      </span>
                    </AppLink>

                    {!showAddField && topAlert ? (
                      <AppLink
                        href={topAlert.actionHref ?? "/field-advisor"}
                        onClick={() =>
                          track("tool_open", {
                            href: topAlert.actionHref ?? "/field-advisor",
                            label: "farm_alert",
                          })
                        }
                        className="mx-3 mb-2 flex items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2.5 text-white active:scale-[0.99]"
                      >
                        <span className="min-w-0 flex-1 text-[13px] font-bold leading-snug">
                          {topAlert.title}
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </AppLink>
                    ) : null}

                    <div className="flex gap-2 px-3 pb-3">
                      <AppLink
                        href={`/my-farm/${f.id}`}
                        className="notranslate inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-[#059669] text-[13px] font-bold text-white active:scale-[0.98]"
                        translate="no"
                      >
                        {isHi ? "खेत खोलो" : "Open field"}
                      </AppLink>
                      <AppLink
                        href={measureFieldHref(f.id)}
                        className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-emerald-800/20 px-3 text-[13px] font-bold text-emerald-900 active:scale-[0.98] dark:text-emerald-100"
                      >
                        <Ruler className="h-3.5 w-3.5" />
                        {f.boundary?.length
                          ? isHi
                            ? "सीमा"
                            : "Boundary"
                          : isHi
                            ? "नापें"
                            : "Measure"}
                      </AppLink>
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
