"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import AppLink from "@/components/ui/AppLink";
import { useToast } from "@/components/ui/Toast";
import { useFarmData } from "@/hooks/useFarmData";
import { useDashboardAlerts } from "@/hooks/useDashboardAlerts";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { categoryOrder, cropCatalog } from "@/data/crop-catalog";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calculator,
  CalendarDays,
  Check,
  CloudSun,
  FlaskConical,
  Leaf,
  MapPin,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Sprout,
  TrendingUp,
  type LucideIcon,
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

function totalAreaLabel(fields: { area: string }[]) {
  const acres = fields.reduce((sum, f) => {
    const match = f.area.match(/([\d.]+)/);
    return sum + (match ? parseFloat(match[1]) : 0);
  }, 0);
  return acres > 0 ? `${acres.toFixed(1)} एकड़` : "—";
}

function ownershipLabel(ownership: string) {
  return ownership === "Owned" ? "अपनी ज़मीन" : "बटाई / किराया";
}

function fieldStatusLabel(status: string) {
  if (status === "Active") return "सक्रिय";
  return status;
}

const FARM_LINKS: {
  id: string;
  hi: string;
  en: string;
  href: string;
  icon3d?: string;
  icon: LucideIcon;
}[] = [
  { id: "advisor", hi: "खेत सलाह", en: "Advice", href: "/field-advisor", icon3d: "/images/icons/3d/my-farm.jpg", icon: Sprout },
  { id: "fertilizer", hi: "खाद कैलकुलेटर", en: "Fertilizer", href: "/services/fertilizer-calculator", icon3d: "/images/icons/3d/fertilizer.jpg", icon: Calculator },
  { id: "doctor", hi: "फसल डॉक्टर", en: "Crop Doctor", href: "/ai-doctor", icon3d: "/images/icons/3d/crop-doctor.jpg", icon: ShieldAlert },
  { id: "weather", hi: "मौसम सलाह", en: "Weather", href: "/weather", icon3d: "/images/icons/3d/weather.jpg", icon: CloudSun },
  { id: "mandi", hi: "मंडी भाव", en: "Mandi", href: "/mandi", icon3d: "/images/icons/3d/mandi.jpg", icon: TrendingUp },
  { id: "mix", hi: "दवा मिश्रण जांच", en: "Tank Mix", href: "/mix-advisor", icon: FlaskConical },
];

export default function MyFarmPage() {
  const { showToast } = useToast();
  const { t, locale } = useLocale();
  const isHi = locale === "hi";
  const reduced = useReducedMotion();
  const { profile, setSowingDate } = useFarmerProfile();
  const { data, stats, addField, addActivity, addNote } = useFarmData();
  const farmAlerts = useDashboardAlerts(3);
  const { weather, loading: weatherLoading } = useLiveWeather();

  const [showAddField, setShowAddField] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);

  const [fieldName, setFieldName] = useState("");
  const [fieldArea, setFieldArea] = useState("");
  const [fieldCropSlug, setFieldCropSlug] = useState("");
  const [fieldVariety, setFieldVariety] = useState("");
  const [fieldSowing, setFieldSowing] = useState("");
  const [cropPickerOpen, setCropPickerOpen] = useState(false);
  const [cropQuery, setCropQuery] = useState("");
  const [cropCategory, setCropCategory] = useState<(typeof categoryOrder)[number] | "all">("all");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [activityTask, setActivityTask] = useState("");
  const [activityField, setActivityField] = useState("");
  const [activityDate, setActivityDate] = useState("");

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
  const nextTask = data.activities[0];

  const temp = weather?.temp ?? "—";
  const condition = weather?.condition ?? "";
  const tempShort = String(temp).replace(/\s/g, "").replace("°C", "").replace("°", "") || "—";

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
    const autoFieldName = isHi
      ? `खेत ${data.fields.length + 1} (${cropHindi || catalog?.name || ""})`
      : `Field ${data.fields.length + 1} (${catalog?.name || "Crop"})`;
    const finalFieldName = fieldName.trim() || autoFieldName;

    const sowingIso = parseSowingISO(fieldSowing) || undefined;
    const stage = fieldStageLabel(sowingIso, isHi);
    addField({
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

  const handleAddNote = () => {
    if (!noteTitle.trim() || !noteBody.trim()) {
      showToast("नोट का शीर्षक और विवरण भरें", "error");
      return;
    }
    addNote({ title: noteTitle.trim(), body: noteBody.trim(), pinned: false });
    setNoteTitle("");
    setNoteBody("");
    setShowAddNote(false);
    showToast("नोट सेव हो गया ✓");
  };

  const handleAddActivity = () => {
    if (!activityTask.trim() || !activityField.trim()) {
      showToast("कार्य और खेत का नाम भरें", "error");
      return;
    }
    addActivity({
      task: activityTask.trim(),
      field: activityField.trim(),
      date: activityDate.trim() || "इस हफ्ते",
    });
    setActivityTask("");
    setActivityField("");
    setActivityDate("");
    setShowAddActivity(false);
    showToast("कार्य सेव हो गया ✓");
  };

  return (
    <div className="relative mx-auto min-w-0 max-w-lg overflow-x-hidden pb-2 sm:max-w-2xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-20px] top-0 h-[280px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(ellipse_at_90%_10%,rgba(180,140,70,0.1),transparent_45%),linear-gradient(180deg,#e8f6ee_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(180deg,rgba(6,40,24,0.35)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 space-y-4 px-0.5 pt-1">
        {/* Header — home rhythm */}
        <motion.section {...fade(0)} className="px-0.5">
          <p className="text-[13px] font-medium text-[var(--av-text-secondary)]">
            {isHi ? `नमस्ते, ${greetName} जी` : `Namaste, ${greetName}`}
          </p>
          <h1 className="mt-0.5 font-display text-[1.45rem] font-bold leading-tight tracking-tight text-[var(--av-text-primary)]">
            {isHi ? "मेरा खेत" : "My farm"}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-50/90 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
              <Sprout className="h-3 w-3 shrink-0" />
              {hasFields
                ? `${stats.totalFields} ${isHi ? "खेत" : "fields"} · ${totalAreaLabel(data.fields)}`
                : isHi
                  ? "खेत जोड़ो"
                  : "Add a field"}
            </span>
            {hasFields ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-50/90 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
                <Sprout className="h-3 w-3 shrink-0" />
                {isHi
                  ? `${stats.activeFields} सक्रिय`
                  : `${stats.activeFields} active`}
              </span>
            ) : null}
            {place ? (
              <span className="inline-flex max-w-[46%] items-center gap-1 rounded-full border border-[var(--av-border)] bg-[var(--av-surface)]/90 px-2.5 py-1 text-[11px] font-semibold text-[var(--av-text-secondary)]">
                <MapPin className="h-3 w-3 shrink-0 text-sky-600" />
                <span className="truncate">{place}</span>
              </span>
            ) : null}
          </div>
        </motion.section>

        {/* Empty → photo CTA | Filled → primary jobs (hidden when add-field form is open) */}
        {!showAddField && !hasFields ? (
          <motion.section {...fade(0.03)}>
            <button
              type="button"
              onClick={() => {
                setShowAddField(true);
                if (!fieldCropSlug) setCropPickerOpen(true);
              }}
              className="group relative flex min-h-[240px] w-full overflow-hidden rounded-2xl border border-white/20 text-left shadow-[var(--av-shadow-md)] active:scale-[0.99]"
            >
              <Image
                src="/images/jobs/job-my-farm.jpg"
                alt=""
                fill
                sizes="(max-width: 512px) 100vw, 480px"
                className="object-cover transition duration-300 group-hover:scale-105"
                priority
              />
              <span className="absolute inset-0 bg-gradient-to-t from-emerald-950/92 via-emerald-950/45 to-black/20" />
              <span className="relative z-10 flex w-full flex-col justify-end p-5">
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
                  <Plus className="h-6 w-6" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-200/90">
                  {t("myFarm")}
                </span>
                <span className="mt-1 font-display text-[1.55rem] font-bold leading-tight text-white">
                  {isHi ? "पहला खेत जोड़ो" : "Add your first field"}
                </span>
              </span>
            </button>
          </motion.section>
        ) : !showAddField && hasFields ? (
          <motion.section {...fade(0.03)}>
            <AppLink
              href="/field-advisor"
              onClick={() => track("tool_open", { href: "/field-advisor", label: "farm_advisor_cta" })}
              className="group relative flex min-h-[96px] w-full overflow-hidden rounded-2xl border border-emerald-800/20 bg-emerald-950 shadow-lg shadow-emerald-900/25 active:scale-[0.99]"
            >
              <span className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-1.5 bg-emerald-950 px-3.5 py-4 sm:px-5">
                <span className="inline-flex w-fit items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-100/90">
                  <Sprout className="h-3 w-3" />
                  {isHi ? "आज का काम" : "Today"}
                </span>
                <span className="text-[16px] font-bold leading-snug text-white sm:text-[17px]">
                  {isHi ? "खेत सलाह खोलो" : "Open field advice"}
                </span>
                <span className="text-[11px] font-medium leading-snug text-emerald-100/85">
                  {isHi
                    ? `${stats.activeFields} सक्रिय खेत · बुवाई तारीख से अवस्था`
                    : `${stats.activeFields} active · stage from sowing date`}
                </span>
                <span className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-bold text-emerald-200">
                  {isHi ? "सलाह देखें" : "See advice"}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </span>
              <span className="relative w-[42%] min-w-[120px] max-w-[220px] shrink-0 self-stretch">
                <Image
                  src="/images/jobs/job-my-farm.jpg"
                  alt=""
                  fill
                  sizes="220px"
                  className="object-cover object-[center_35%] transition duration-300 group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-emerald-950 via-emerald-950/50 to-transparent"
                />
              </span>
            </AppLink>
          </motion.section>
        ) : null}

        {/* Advice strip (hidden when add-field form is open) */}
        {!showAddField && hasFields ? (
          <motion.section {...fade(0.05)}>
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-[var(--av-surface)] to-amber-50/40 p-3.5 dark:from-emerald-950/40 dark:via-[var(--av-surface)] dark:to-amber-950/20">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700/80 dark:text-emerald-300/80">
                {isHi ? "आज ध्यान दें" : "Watch today"}
              </p>
              {topAlert ? (
                <AppLink href={topAlert.actionHref ?? "/alerts"} className="mt-1.5 block">
                  <p className="text-[14px] font-bold text-[var(--av-text-primary)]">{topAlert.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-[12px] text-[var(--av-text-muted)]">{topAlert.body}</p>
                </AppLink>
              ) : nextTask ? (
                <div className="mt-1.5">
                  <p className="text-[14px] font-bold text-[var(--av-text-primary)]">{nextTask.task}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--av-text-muted)]">
                    {nextTask.field} · {nextTask.date}
                  </p>
                </div>
              ) : (
                <p className="mt-1.5 text-[13px] font-medium text-[var(--av-text-secondary)]">
                  {isHi
                    ? "कोई ज़रूरी अलर्ट नहीं — मौसम और फसल गाइड देखें।"
                    : "No urgent alerts — check weather and crop guides."}
                </p>
              )}
            </div>
          </motion.section>
        ) : null}

        {/* Fields */}
        <motion.section {...fade(0.07)} className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-[14px] font-bold text-[var(--av-text-primary)]">
              {isHi ? "मेरे खेत" : "My fields"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowAddField((v) => {
                  const next = !v;
                  if (next && !fieldCropSlug) {
                    setCropPickerOpen(true);
                  }
                  return next;
                });
              }}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-emerald-700/20 active:scale-[0.98]"
            >
              {showAddField ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showAddField ? (isHi ? "बंद" : "Close") : isHi ? "खेत जोड़ो" : "Add field"}
            </button>
          </div>

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

          {hasFields ? (
            <div className="space-y-3">
              {data.fields.map((f, i) => {
                const img = resolveCropImage({
                  slug: f.cropSlug || "",
                  name: f.crop,
                });
                const hi = getCropHindiName(f.cropSlug || "") || f.crop;
                const cropHref = f.cropSlug ? `/crops/${f.cropSlug}` : "/crops";
                const nutrientHref = f.cropSlug
                  ? `/crops/${f.cropSlug}/care/nutrients`
                  : "/deficiencies";
                const sowingIso =
                  f.sowingDateIso ||
                  parseSowingISO(f.sowingDate) ||
                  (f.cropSlug ? profile.sowingDates?.[f.cropSlug] : undefined);
                const stageNow = fieldStageLabel(sowingIso, isHi);
                const growthHref = f.cropSlug
                  ? `/crops/${f.cropSlug}/care/growth`
                  : "/crops";
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
                    className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]"
                  >
                    <div className="relative h-[148px] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
                      <div className="relative z-10 flex h-full flex-col justify-between p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm",
                              f.status === "Active"
                                ? "bg-emerald-500 text-white"
                                : "bg-amber-500 text-white"
                            )}
                          >
                            {fieldStatusLabel(f.status)}
                          </span>
                          <span className="inline-flex max-w-[55%] items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                            <CalendarDays className="h-3 w-3 shrink-0 text-emerald-200" />
                            <span className="truncate">{stageNow}</span>
                          </span>
                        </div>
                        <div>
                          <p className="font-display text-[1.25rem] font-bold leading-tight text-white drop-shadow-sm">
                            {f.name}
                          </p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-emerald-100">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/20 text-white backdrop-blur-sm">
                              <Sprout className="h-3 w-3" />
                            </span>
                            <span>{hi}</span>
                            {f.variety ? (
                              <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
                                {f.variety}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-[11px] font-medium text-white/80">
                            {f.area.replace(/\s*Acre$/i, " एकड़")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 p-3">
                      <div>
                        <p className="text-[12px] font-bold text-[var(--av-text-primary)]">
                          {stageNow}
                        </p>
                        {sowingIso ? (
                          <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">
                            {isHi ? "बुवाई" : "Sown"}: {formatSowingDisplay(sowingIso, isHi)}
                          </p>
                        ) : (
                          <AppLink
                            href={growthHref}
                            className="mt-1 inline-block text-[11px] font-bold text-emerald-700 dark:text-emerald-300"
                          >
                            {isHi
                              ? "बुवाई तारीख डालो → आज का काम"
                              : "Add sowing date → today’s work"}
                          </AppLink>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <AppLink
                          href={cropHref}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2 py-2 text-center active:scale-[0.98]"
                        >
                          <BookOpen className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" />
                          <span className="text-[11px] font-bold text-[var(--av-text-primary)]">
                            {isHi ? "फसल सुरक्षा गाइड" : "Crop Guide"}
                          </span>
                        </AppLink>
                        <AppLink
                          href={f.cropSlug ? `/crops/${f.cropSlug}/care/fertilizer` : "/crops"}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2 py-2 text-center active:scale-[0.98]"
                        >
                          <Leaf className="h-3.5 w-3.5 text-lime-700 dark:text-lime-300" />
                          <span className="text-[11px] font-bold text-[var(--av-text-primary)]">
                            {isHi ? "खाद-पानी तालिका" : "Fertilizer"}
                          </span>
                        </AppLink>
                      </div>

                      <AppLink
                        href={
                          f.cropSlug
                            ? `/field-advisor?crop=${f.cropSlug}&sowing=${f.sowingDate || ""}&name=${encodeURIComponent(f.name)}`
                            : "/field-advisor"
                        }
                        className="flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[12px] font-bold text-emerald-900 dark:text-emerald-100 transition hover:bg-emerald-500/15"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sprout className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" />
                          {isHi ? "इस अवस्था में आज और इस हफ्ते का काम" : "Today & this week's action"}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" />
                      </AppLink>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : null}
        </motion.section>

        {/* Compact farm shortcuts — not home photo tiles */}
        <motion.section {...fade(0.09)} className="space-y-2">
          <AppLink
            href="/weather"
            onClick={() => track("tool_open", { href: "/weather", label: "farm_weather_strip" })}
            className="flex items-center gap-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3.5 py-3 active:scale-[0.99]"
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-sky-500/20 bg-sky-500/10 shadow-sm">
              <Image
                src="/images/icons/3d/weather.jpg"
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-bold text-[var(--av-text-primary)]">
                {weatherLoading
                  ? isHi
                    ? "मौसम…"
                    : "Weather…"
                  : `${tempShort}° · ${condition || (isHi ? "मौसम" : "Weather")}`}
              </span>
              <span className="block text-[11px] text-[var(--av-text-muted)]">
                {isHi ? "पूर्वानुमान और स्प्रे सलाह" : "Forecast & spray advice"}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--av-text-muted)]" />
          </AppLink>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {FARM_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <AppLink
                  key={link.id}
                  href={link.href}
                  onClick={() => track("tool_open", { href: link.href, label: `farm_${link.id}` })}
                  className="group flex flex-col items-center gap-1.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-2 text-center transition hover:border-emerald-500/40 active:scale-[0.98]"
                >
                  <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-emerald-500/15 bg-emerald-500/10 shadow-sm">
                    {link.icon3d ? (
                      <Image
                        src={link.icon3d}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-[var(--av-text-primary)]">
                    {isHi ? link.hi : link.en}
                  </span>
                </AppLink>
              );
            })}
          </div>
        </motion.section>

        {/* Tasks + notes — one secondary interaction section (hidden when add-field form is open) */}
        {!showAddField ? (
          <motion.section {...fade(0.13)} className="space-y-2.5">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="text-[14px] font-bold text-[var(--av-text-primary)]">
                {isHi ? "कार्य और नोट" : "Tasks & notes"}
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddActivity((v) => !v);
                    setShowAddNote(false);
                  }}
                  className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300"
                >
                  + {isHi ? "कार्य" : "Task"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddNote((v) => !v);
                    setShowAddActivity(false);
                  }}
                  className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300"
                >
                  + {isHi ? "नोट" : "Note"}
                </button>
              </div>
            </div>

            {showAddActivity ? (
              <div className="space-y-2 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3">
                <input
                  value={activityTask}
                  onChange={(e) => setActivityTask(e.target.value)}
                  placeholder={isHi ? "कार्य (जैसे — खाद डालना)" : "Task"}
                  className="av-input text-xs"
                />
                <input
                  value={activityField}
                  onChange={(e) => setActivityField(e.target.value)}
                  placeholder={isHi ? "खेत का नाम" : "Field name"}
                  className="av-input text-xs"
                />
                <input
                  value={activityDate}
                  onChange={(e) => setActivityDate(e.target.value)}
                  placeholder={isHi ? "तारीख (वैकल्पिक)" : "Date (optional)"}
                  className="av-input text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddActivity}
                  className="av-btn av-btn-sm av-btn-primary"
                >
                  {isHi ? "काम सहेजें" : "Save task"}
                </button>
              </div>
            ) : null}

            {showAddNote ? (
              <div className="space-y-2 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3">
                <input
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder={isHi ? "शीर्षक" : "Title"}
                  className="av-input text-xs"
                />
                <textarea
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  placeholder={isHi ? "नोट का विवरण" : "Note details"}
                  rows={2}
                  className="av-input w-full resize-none text-xs"
                />
                <button type="button" onClick={handleAddNote} className="av-btn av-btn-sm av-btn-primary">
                  {isHi ? "नोट सहेजें" : "Save note"}
                </button>
              </div>
            ) : null}

            <ul className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]">
              {data.activities.length === 0 && data.notes.length === 0 ? (
                <li className="px-3.5 py-4 text-center text-[12px] text-[var(--av-text-muted)]">
                  {isHi ? "अभी कोई कार्य या नोट नहीं" : "No tasks or notes yet"}
                </li>
              ) : (
                <>
                  {data.activities.slice(0, 4).map((a) => (
                    <li
                      key={a.id}
                      className="flex items-start gap-2.5 border-b border-[var(--av-border-subtle)] px-3.5 py-3 last:border-0"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-700 dark:text-emerald-300">
                        <CalendarDays className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-bold text-[var(--av-text-primary)]">
                          {a.task}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-[var(--av-text-muted)]">
                          {a.field} · {a.date}
                        </span>
                      </span>
                    </li>
                  ))}
                  {data.notes.slice(0, 3).map((n) => (
                    <li
                      key={n.id}
                      className="flex items-start gap-2.5 border-b border-[var(--av-border-subtle)] px-3.5 py-3 last:border-0"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/12 text-amber-800 dark:text-amber-200">
                        <Bell className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-bold text-[var(--av-text-primary)]">
                          {n.title}
                          {n.pinned ? (
                            <span className="ml-1.5 inline-flex items-center rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 dark:text-amber-200">
                              {isHi ? "पिन" : "PINNED"}
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-[11px] text-[var(--av-text-muted)]">
                          {n.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </motion.section>
        ) : null}

        {/* Ask CTA */}
        <motion.section {...fade(0.15)}>
          <AppLink
            href="/kisan-saathi"
            onClick={() => track("tool_open", { href: "/kisan-saathi", label: "farm_saathi" })}
            className="group flex min-h-[58px] w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border border-emerald-700/30 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 p-3 text-white shadow-md shadow-emerald-900/20 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-emerald-400/30 bg-white/10 shadow-sm">
                <Image
                  src="/images/icons/3d/kisan-saathi.jpg"
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <span className="block text-[14px] font-bold leading-tight">
                  {isHi ? "किसान साथी से पूछो" : "Ask Kisan Saathi"}
                </span>
                <span className="block text-[11px] font-medium text-emerald-100/90">
                  {isHi ? "खेत के लिए 24/7 AI सलाह" : "Instant 24/7 AI farm advice"}
                </span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-emerald-200 transition group-hover:translate-x-0.5" />
          </AppLink>
        </motion.section>
      </div>
    </div>
  );
}
