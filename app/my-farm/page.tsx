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
  CalendarDays,
  CloudSun,
  Heart,
  Leaf,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Sprout,
  type LucideIcon,
  X,
} from "lucide-react";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { cn } from "@/lib/cn";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { track } from "@/lib/analytics";

const CATEGORY_HI: Record<string, string> = {
  Cereals: "अनाज",
  Vegetables: "सब्ज़ी",
  "Cash Crops": "नकदी",
  Fruits: "फल",
  Pulses: "दाल",
  Oilseeds: "तिलहन",
  Spices: "मसाले",
};

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

function healthTone(score: number) {
  if (score >= 75) {
    return {
      label: `स्वास्थ्य ${score}%`,
      tone: "border-emerald-500/25 bg-emerald-50/90 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200",
    };
  }
  if (score >= 50) {
    return {
      label: `स्वास्थ्य ${score}%`,
      tone: "border-amber-500/30 bg-amber-50/90 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200",
    };
  }
  return {
    label: `स्वास्थ्य ${score}%`,
    tone: "border-rose-500/30 bg-rose-50/90 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200",
  };
}

const FARM_LINKS: {
  id: string;
  hi: string;
  en: string;
  href: string;
  icon: LucideIcon;
}[] = [
  { id: "advisor", hi: "सलाह", en: "Advice", href: "/field-advisor", icon: Sprout },
  { id: "weather", hi: "मौसम", en: "Weather", href: "/weather", icon: CloudSun },
  { id: "calendar", hi: "कैलेंडर", en: "Calendar", href: "/crop-calendar", icon: CalendarDays },
  { id: "alerts", hi: "अलर्ट", en: "Alerts", href: "/alerts", icon: Bell },
  { id: "nutrients", hi: "पोषक", en: "Nutrients", href: "/deficiencies", icon: Leaf },
  { id: "crops", hi: "गाइड", en: "Guide", href: "/crops", icon: BookOpen },
];

export default function MyFarmPage() {
  const { showToast } = useToast();
  const { t, locale } = useLocale();
  const isHi = locale === "hi";
  const reduced = useReducedMotion();
  const { profile } = useFarmerProfile();
  const { data, stats, addField, addActivity, addNote } = useFarmData();
  const farmAlerts = useDashboardAlerts(3);
  const { weather, loading: weatherLoading } = useLiveWeather();

  const [showAddField, setShowAddField] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);

  const [fieldName, setFieldName] = useState("");
  const [fieldArea, setFieldArea] = useState("");
  const [fieldCrop, setFieldCrop] = useState("");
  const [fieldCropSlug, setFieldCropSlug] = useState("");
  const [fieldOwnership, setFieldOwnership] = useState<"Owned" | "Leased">("Owned");
  const [cropQuery, setCropQuery] = useState("");
  const [cropCategory, setCropCategory] = useState<(typeof categoryOrder)[number] | "all">("all");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [activityTask, setActivityTask] = useState("");
  const [activityField, setActivityField] = useState("");
  const [activityDate, setActivityDate] = useState("");

  const popularCrops = useMemo(
    () =>
      ["paddy", "wheat", "soybean", "maize", "tomato", "potato", "chilli", "mango"]
        .map((slug) => cropCatalog.find((c) => c.slug === slug))
        .filter(Boolean) as typeof cropCatalog,
    []
  );

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

  const greetName = profile.name.trim()
    ? profile.name.trim().charAt(0).toUpperCase() + profile.name.trim().slice(1)
    : isHi
      ? "किसान"
      : "Farmer";

  const place = [profile.village, profile.district].filter(Boolean).join(", ");
  const hasFields = data.fields.length > 0;
  const health = healthTone(stats.healthScore);
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
    if (!fieldName.trim() || !fieldArea.trim()) {
      showToast("खेत का नाम और रकबा भरें", "error");
      return;
    }
    const areaNum = parseFloat(fieldArea);
    if (!Number.isFinite(areaNum) || areaNum <= 0) {
      showToast("सही रकबा (एकड़) भरें", "error");
      return;
    }
    const catalog = cropCatalog.find((c) => c.slug === fieldCropSlug);
    const cropLabel = fieldCrop.trim() || catalog?.name || "";
    if (!cropLabel) {
      showToast("फसल चुनें या लिखें", "error");
      return;
    }
    addField({
      name: fieldName.trim(),
      area: `${areaNum.toFixed(2)} Acre`,
      ownership: fieldOwnership,
      crop: cropLabel,
      cropSlug: fieldCropSlug || undefined,
      status: "Active",
      sowingDate: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      emoji: catalog?.emoji ?? "🌾",
      health: 78,
      stage: "Active growth",
    });
    setFieldName("");
    setFieldArea("");
    setFieldCrop("");
    setFieldCropSlug("");
    setFieldOwnership("Owned");
    setCropQuery("");
    setCropCategory("all");
    setShowAddField(false);
    showToast("खेत सेव हो गया ✓");
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
    <div className="relative mx-auto min-w-0 max-w-lg overflow-x-hidden pb-8 sm:max-w-2xl">
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
              <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold", health.tone)}>
                <Heart className="h-3 w-3 shrink-0" />
                {health.label}
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

        {/* Empty → photo CTA | Filled → primary jobs */}
        {!hasFields ? (
          <motion.section {...fade(0.03)}>
            <button
              type="button"
              onClick={() => setShowAddField(true)}
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
                <span className="mt-2 text-[13px] font-medium text-white/85">
                  {isHi ? "नाम · रकबा · फसल — एक टैप से शुरू" : "Name · area · crop — start in one tap"}
                </span>
                <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-extrabold text-emerald-900">
                  <Plus className="h-4 w-4" />
                  {isHi ? "अभी जोड़ो" : "Add now"}
                </span>
              </span>
            </button>
          </motion.section>
        ) : (
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
                    ? `${stats.activeFields} सक्रिय खेत · स्वास्थ्य ${stats.healthScore}%`
                    : `${stats.activeFields} active · health ${stats.healthScore}%`}
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
        )}

        {/* Advice strip */}
        {hasFields ? (
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
              onClick={() => setShowAddField((v) => !v)}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-emerald-700/20 active:scale-[0.98]"
            >
              {showAddField ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showAddField ? (isHi ? "बंद" : "Close") : isHi ? "खेत जोड़ो" : "Add field"}
            </button>
          </div>

          {showAddField ? (
            <div className="overflow-hidden rounded-2xl border border-emerald-500/25 bg-[var(--av-surface)] shadow-[var(--av-shadow-md)]">
              <div className="relative h-24 overflow-hidden">
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
                <span className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-end p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200/90">
                    {isHi ? "नया खेत" : "New field"}
                  </p>
                  <p className="font-display text-[1.15rem] font-bold text-white">
                    {selectedCrop
                      ? isHi
                        ? getCropHindiName(selectedCrop.slug) ||
                          selectedCrop.nameHi ||
                          selectedCrop.name
                        : selectedCrop.name
                      : isHi
                        ? "नाम · रकबा · फसल"
                        : "Name · area · crop"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 p-3.5">
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-[10px] font-bold text-[var(--av-text-muted)]">
                      {isHi ? "खेत का नाम" : "Field name"}
                    </span>
                    <input
                      value={fieldName}
                      onChange={(e) => setFieldName(e.target.value)}
                      placeholder={isHi ? "जैसे मुख्य खेत" : "e.g. Main field"}
                      className="av-input text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[10px] font-bold text-[var(--av-text-muted)]">
                      {isHi ? "रकबा (एकड़)" : "Area (acres)"}
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={fieldArea}
                      onChange={(e) => setFieldArea(e.target.value)}
                      placeholder="2.0"
                      className="av-input text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[10px] font-bold text-[var(--av-text-muted)]">
                      {isHi ? "मालिकाना" : "Ownership"}
                    </span>
                    <select
                      value={fieldOwnership}
                      onChange={(e) => setFieldOwnership(e.target.value as "Owned" | "Leased")}
                      className="av-input text-sm"
                    >
                      <option value="Owned">{isHi ? "अपनी ज़मीन" : "Owned"}</option>
                      <option value="Leased">{isHi ? "बटाई / किराया" : "Leased"}</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[10px] font-bold text-[var(--av-text-muted)]">
                      {isHi ? "वैरायटी (वैकल्पिक)" : "Variety (optional)"}
                    </span>
                    <input
                      value={fieldCrop}
                      onChange={(e) => setFieldCrop(e.target.value)}
                      placeholder={selectedCrop?.name ?? "—"}
                      className="av-input text-sm"
                    />
                  </label>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                      {isHi ? "फसल चुनें" : "Pick crop"}
                    </p>
                    {selectedCrop ? (
                      <button
                        type="button"
                        onClick={() => {
                          setFieldCropSlug("");
                          setFieldCrop("");
                        }}
                        className="text-[10px] font-bold text-rose-600"
                      >
                        {isHi ? "साफ़" : "Clear"}
                      </button>
                    ) : null}
                  </div>

                  {!cropQuery && cropCategory === "all" ? (
                    <div className="mb-2 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {popularCrops.map((crop) => {
                        const hi = getCropHindiName(crop.slug);
                        const active = fieldCropSlug === crop.slug;
                        return (
                          <button
                            key={crop.slug}
                            type="button"
                            onClick={() => {
                              setFieldCropSlug(crop.slug);
                              setFieldCrop(crop.name);
                            }}
                            className={cn(
                              "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-bold transition",
                              active
                                ? "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
                                : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)]"
                            )}
                          >
                            <span>{crop.emoji}</span>
                            {isHi ? hi || crop.nameHi || crop.name : crop.name}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="relative mb-2">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--av-text-muted)]" />
                    <input
                      value={cropQuery}
                      onChange={(e) => setCropQuery(e.target.value)}
                      placeholder={isHi ? "खोजें: आम, धान, tomato…" : "Search: mango, paddy…"}
                      className="av-input w-full py-2.5 pl-9 text-sm"
                    />
                  </div>

                  <div className="mb-2 flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <button
                      type="button"
                      onClick={() => setCropCategory("all")}
                      className={cn(
                        "shrink-0 rounded-md px-2.5 py-1 text-[10px] font-bold",
                        cropCategory === "all"
                          ? "bg-emerald-700 text-white"
                          : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
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
                          "shrink-0 rounded-md px-2.5 py-1 text-[10px] font-bold",
                          cropCategory === cat
                            ? "bg-emerald-700 text-white"
                            : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
                        )}
                      >
                        {isHi ? CATEGORY_HI[cat] ?? cat : cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid max-h-52 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2 sm:grid-cols-4">
                    {filteredCrops.length === 0 ? (
                      <p className="col-span-full py-6 text-center text-[12px] text-[var(--av-text-muted)]">
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
                              setFieldCrop(crop.name);
                            }}
                            className={cn(
                              "overflow-hidden rounded-xl border text-left transition active:scale-[0.98]",
                              active
                                ? "border-emerald-500 ring-2 ring-emerald-500/35"
                                : "border-[var(--av-border)] bg-[var(--av-surface)]"
                            )}
                          >
                            <span className="relative block h-16 w-full overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={resolveCropImage({ slug: crop.slug, name: crop.name })}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                              {active ? <span className="absolute inset-0 bg-emerald-600/25" /> : null}
                            </span>
                            <span className="block truncate px-1.5 py-1.5 text-[10px] font-bold text-[var(--av-text-primary)]">
                              {isHi ? hi || crop.nameHi || crop.name : crop.name}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddField}
                  disabled={!fieldName.trim() || !fieldArea.trim() || !fieldCropSlug}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-3 text-[14px] font-bold text-white shadow-md shadow-emerald-800/20 active:scale-[0.99] disabled:opacity-45"
                >
                  <Plus className="h-4 w-4" />
                  {isHi ? "खेत सेव करें" : "Save field"}
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
                  ? `/crops/${f.cropSlug}?tab=nutrients`
                  : "/deficiencies";
                const healthPct = Math.max(0, Math.min(100, f.health ?? 75));
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
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                            <Heart className="h-3 w-3 text-rose-300" />
                            {healthPct}%
                          </span>
                        </div>
                        <div>
                          <p className="font-display text-[1.25rem] font-bold leading-tight text-white drop-shadow-sm">
                            {f.name}
                          </p>
                          <p className="mt-0.5 text-[13px] font-semibold text-emerald-100">
                            <span className="mr-1">{f.emoji}</span>
                            {hi}
                          </p>
                          <p className="mt-1 text-[11px] font-medium text-white/80">
                            {f.area.replace(/\s*Acre$/i, " एकड़")} · {ownershipLabel(f.ownership)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 p-3">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-[var(--av-text-muted)]">
                          <span>{isHi ? "स्वास्थ्य" : "Health"}</span>
                          <span className="text-[var(--av-text-primary)]">{healthPct}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--av-surface-inset)]">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              healthPct >= 75
                                ? "bg-emerald-500"
                                : healthPct >= 50
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                            )}
                            style={{ width: `${healthPct}%` }}
                          />
                        </div>
                        {f.stage || f.sowingDate ? (
                          <p className="mt-1.5 text-[11px] text-[var(--av-text-muted)]">
                            {[
                              f.stage,
                              f.sowingDate
                                ? `${isHi ? "बुवाई" : "Sown"} ${f.sowingDate}`
                                : "",
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        <AppLink
                          href={cropHref}
                          className="flex flex-col items-center gap-1 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-1 py-2 text-center active:scale-[0.98]"
                        >
                          <BookOpen className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" />
                          <span className="text-[10px] font-bold text-[var(--av-text-primary)]">
                            {isHi ? "गाइड" : "Guide"}
                          </span>
                        </AppLink>
                        <AppLink
                          href={nutrientHref}
                          className="flex flex-col items-center gap-1 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-1 py-2 text-center active:scale-[0.98]"
                        >
                          <Leaf className="h-3.5 w-3.5 text-lime-700 dark:text-lime-300" />
                          <span className="text-[10px] font-bold text-[var(--av-text-primary)]">
                            {isHi ? "पोषक" : "Nutrients"}
                          </span>
                        </AppLink>
                        <AppLink
                          href="/field-advisor"
                          className="flex flex-col items-center gap-1 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-1 py-2 text-center active:scale-[0.98]"
                        >
                          <Sprout className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" />
                          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-200">
                            {isHi ? "सलाह" : "Advice"}
                          </span>
                        </AppLink>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : !showAddField ? (
            <p className="px-0.5 text-[12px] text-[var(--av-text-muted)]">
              {isHi
                ? "ऊपर टैप करके पहला खेत जोड़ें।"
                : "Tap above to add your first field."}
            </p>
          ) : null}
        </motion.section>

        {/* Compact farm shortcuts — not home photo tiles */}
        <motion.section {...fade(0.09)} className="space-y-2">
          <AppLink
            href="/weather"
            onClick={() => track("tool_open", { href: "/weather", label: "farm_weather_strip" })}
            className="flex items-center gap-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3.5 py-3 active:scale-[0.99]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/12 text-sky-700 dark:text-sky-300">
              <CloudSun className="h-5 w-5" />
            </span>
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
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-2 py-2.5 text-center active:scale-[0.98]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-bold text-[var(--av-text-primary)]">
                    {isHi ? link.hi : link.en}
                  </span>
                </AppLink>
              );
            })}
          </div>
        </motion.section>

        {/* Tasks + notes — one secondary interaction section */}
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
                {isHi ? "कार्य सेव करें" : "Save task"}
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
                {isHi ? "नोट सेव करें" : "Save note"}
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
                        {n.pinned ? " 📌" : ""}
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

        {/* Ask CTA */}
        <motion.section {...fade(0.15)}>
          <AppLink
            href="/kisan-saathi"
            onClick={() => track("tool_open", { href: "/kisan-saathi", label: "farm_saathi" })}
            className="flex min-h-[52px] w-full items-center justify-between gap-2 rounded-xl border border-emerald-700/30 bg-gradient-to-r from-emerald-900 to-emerald-800 px-4 py-3 text-white shadow-md shadow-emerald-900/20 active:scale-[0.99]"
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 shrink-0 text-emerald-200" />
              <span>
                <span className="block text-[14px] font-bold leading-tight">
                  {isHi ? "किसान साथी से पूछो" : "Ask Kisan Saathi"}
                </span>
                <span className="block text-[11px] font-medium text-emerald-100/90">
                  {isHi ? "खेत के लिए तुरंत सलाह" : "Instant farm advice"}
                </span>
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-emerald-200" />
          </AppLink>
        </motion.section>
      </div>
    </div>
  );
}
