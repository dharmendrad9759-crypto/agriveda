"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  Leaf,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Zap,
  Target,
  TrendingUp,
  Droplets,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { tf } from "@/lib/i18n/farmer-ui";
import { crops } from "@/data/crops";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropHindiName, getCropImageUrl } from "@/lib/crops/crop-display";
import { cn } from "@/lib/cn";
import type { NutrientDeficiency } from "@/types/crop-management";

const NUTRIENT_FILTERS = [
  { id: "all", label: "All", hindi: "सब" },
  { id: "N", label: "N", hindi: "नाइट्रो" },
  { id: "P", label: "P", hindi: "फास्फो" },
  { id: "K", label: "K", hindi: "पोटैश" },
  { id: "S", label: "S", hindi: "सल्फर" },
  { id: "Zn", label: "Zn", hindi: "जिंक" },
  { id: "Fe", label: "Fe", hindi: "आयरन" },
  { id: "Mn", label: "Mn", hindi: "मैंगनीज" },
  { id: "Cu", label: "Cu", hindi: "कॉपर" },
  { id: "B", label: "B", hindi: "बोरॉन" },
  { id: "Mo", label: "Mo", hindi: "मॉली" },
] as const;

const NUTRIENT_IMAGES: Record<string, string> = {
  nitrogen: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=280&fit=crop",
  phosphorus: "https://images.unsplash.com/photo-1466692476867-aef1dfb1e735?w=400&h=280&fit=crop",
  potassium: "https://images.unsplash.com/photo-1592155931584-901ac15363c7?w=400&h=280&fit=crop",
  zinc: "https://images.unsplash.com/photo-1592840067980-057d97d26f4a?w=400&h=280&fit=crop",
  iron: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=280&fit=crop",
  default: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=280&fit=crop",
};

const BALANCED_TABLE = [
  { nutrient: "N (Nitrogen)", hindi: "नाइट्रोजन", basal: "20 kg", topDress: "40 kg (2 splits)", foliar: "Urea 2%" },
  { nutrient: "P₂O₅ (Phosphorus)", hindi: "फास्फोरस", basal: "25 kg", topDress: "—", foliar: "DAP foliar" },
  { nutrient: "K₂O (Potassium)", hindi: "पोटैश", basal: "20 kg", topDress: "20 kg", foliar: "MOP foliar" },
  { nutrient: "S (Sulphur)", hindi: "सल्फर", basal: "10 kg", topDress: "—", foliar: "Gypsum spray" },
  { nutrient: "Zn (Zinc)", hindi: "जिंक", basal: "5 kg", topDress: "—", foliar: "ZnSO₄ 0.5%" },
  { nutrient: "Fe (Iron)", hindi: "आयरन", basal: "—", topDress: "—", foliar: "FeSO₄ + citric" },
  { nutrient: "B (Boron)", hindi: "बोरॉन", basal: "—", topDress: "—", foliar: "Borax 0.2%" },
];

const FALLBACK_DEFICIENCIES: NutrientDeficiency[] = [
  {
    name: "Nitrogen",
    role: "Essential for vegetative growth",
    deficiencySymptoms: ["Older leaves turn light green to yellow", "Stunted plant growth", "Reduced tillering"],
    excessSymptoms: [],
    management: ["Apply Urea @ 40–60 kg/acre in split doses"],
    recommendedFertilizers: ["Urea 2% foliar spray", "Split top-dress at tillering"],
  },
  {
    name: "Phosphorus",
    role: "Root and flower development",
    deficiencySymptoms: ["Purple tint on older leaves", "Poor root development", "Delayed maturity"],
    excessSymptoms: [],
    management: ["Apply DAP @ 50 kg/acre at basal"],
    recommendedFertilizers: ["DAP basal application", "SSP where available"],
  },
  {
    name: "Potassium",
    role: "Grain filling and stem strength",
    deficiencySymptoms: ["Brown leaf margins", "Lodging", "Poor grain filling"],
    excessSymptoms: [],
    management: ["Apply MOP @ 20 kg/acre at panicle initiation"],
    recommendedFertilizers: ["MOP split application", "Potassium nitrate foliar"],
  },
  {
    name: "Zinc",
    role: "Enzyme activation and tillering",
    deficiencySymptoms: ["Khaira disease — dusty brown spots", "Stunted tillers", "Bronze patches"],
    excessSymptoms: [],
    management: ["ZnSO₄ @ 5 kg/acre or 0.5% foliar"],
    recommendedFertilizers: ["Zinc sulphate soil/foliar", "Apply at tillering"],
  },
];

function nutrientSymbol(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("nitrogen") || n.startsWith("n ")) return "N";
  if (n.includes("phosph")) return "P";
  if (n.includes("potassium") || n.includes("potash")) return "K";
  if (n.includes("sulphur") || n.includes("sulfur")) return "S";
  if (n.includes("zinc")) return "Zn";
  if (n.includes("iron")) return "Fe";
  if (n.includes("manganese")) return "Mn";
  if (n.includes("copper")) return "Cu";
  if (n.includes("boron")) return "B";
  if (n.includes("molybdenum")) return "Mo";
  return name.slice(0, 2);
}

function nutrientImage(name: string): string {
  const key = name.toLowerCase().split(" ")[0];
  return NUTRIENT_IMAGES[key] ?? NUTRIENT_IMAGES.default;
}

function slugForNutrient(name: string): string {
  const map: Record<string, string> = {
    N: "nitrogen",
    P: "phosphorus",
    K: "potassium",
    S: "sulphur",
    Zn: "zinc",
    Fe: "iron",
    Mn: "manganese",
    Cu: "copper",
    B: "boron",
    Mo: "molybdenum",
  };
  const sym = nutrientSymbol(name);
  return map[sym] ?? name.toLowerCase().replace(/\s+/g, "-");
}

function cropShortName(name: string) {
  return name.split("(")[0]?.trim() || name;
}

export default function DeficienciesPageClient() {
  const { t, locale } = useLocale();
  const [cropSlug, setCropSlug] = useState("paddy");
  const [filter, setFilter] = useState<(typeof NUTRIENT_FILTERS)[number]["id"]>("all");
  const [showAll, setShowAll] = useState(false);

  const crop = crops.find((c) => c.slug === cropSlug) ?? crops[0];
  const hindi = getCropHindiName(crop.slug);
  const displayName = cropShortName(crop.name);
  const profile = getCropManagementProfile(crop.slug);

  const hooks = useMemo(
    () =>
      [
        { icon: AlertTriangle, title: t("nutrientsHookSpot"), text: t("nutrientsHookSpotDesc") },
        { icon: ShieldCheck, title: t("nutrientsHookFix"), text: t("nutrientsHookFixDesc") },
        { icon: TrendingUp, title: t("nutrientsHookAcre"), text: t("nutrientsHookAcreDesc") },
      ] as const,
    [t]
  );

  const tips = useMemo(
    () =>
      [
        { title: t("nutrientsTipSoilTitle"), text: t("nutrientsTipSoil") },
        { title: t("nutrientsTipSplitTitle"), text: t("nutrientsTipSplit") },
        { title: t("nutrientsTipFoliarTitle"), text: t("nutrientsTipFoliar") },
        { title: t("nutrientsTip4rTitle"), text: t("nutrientsTip4r") },
        { title: t("nutrientsTipRainTitle"), text: t("nutrientsTipRain") },
      ] as const,
    [t]
  );

  const deficiencies = useMemo(() => {
    const fromProfile = profile?.nutrientDeficiencies ?? [];
    return fromProfile.length > 0 ? fromProfile : FALLBACK_DEFICIENCIES;
  }, [profile]);

  const filtered = useMemo(() => {
    if (filter === "all") return deficiencies;
    return deficiencies.filter((d) => nutrientSymbol(d.name) === filter);
  }, [deficiencies, filter]);

  const visible = showAll ? filtered : filtered.slice(0, 8);
  const topSymptom = deficiencies[0]?.deficiencySymptoms[0] ?? "—";

  return (
    <div className="space-y-5">
      {/* Marketing hero */}
      <section className="relative overflow-hidden rounded-[1.85rem] border border-amber-500/25 bg-gradient-to-br from-stone-950 via-amber-950 to-emerald-950 text-white shadow-[0_24px_60px_-24px_rgba(120,53,15,0.65)]">
        <div className="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rounded-full bg-amber-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-6 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-100">
              <FlaskConical className="h-3 w-3 text-amber-300" />
              {t("nutrientsHeroBadge")}
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[1.65rem] font-bold leading-tight tracking-tight sm:text-3xl">
              {t("nutrientsHeroLine1a")}{" "}
              <span className="text-amber-300">{t("nutrientsHeroLine1b")}</span>
              <br />
              {t("nutrientsHeroLine2a")} <span className="text-rose-300">{t("nutrientsHeroLine2b")}</span>
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-amber-50/80">
              {t("nutrientsHeroDesc")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {hooks.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex min-w-[9.5rem] flex-1 items-start gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2.5 backdrop-blur-md"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-200">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-white">{title}</p>
                    <p className="text-[10px] leading-snug text-white/60">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto h-36 w-36 shrink-0 overflow-hidden rounded-[1.75rem] border border-white/20 shadow-2xl sm:mx-0 sm:h-40 sm:w-40">
            <Image
              src={getCropImageUrl(crop)}
              alt={displayName}
              fill
              className="object-cover"
              sizes="160px"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
              <p className="text-xs font-bold text-white">{displayName}</p>
              {hindi ? <p className="text-[10px] text-amber-200">{hindi}</p> : null}
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { n: "01", label: t("nutrientsStepCrop"), done: true },
          { n: "02", label: t("nutrientsStepFilter"), done: filter !== "all" || deficiencies.length > 0 },
          { n: "03", label: t("nutrientsStepFix"), done: false },
        ].map((s) => (
          <div
            key={s.n}
            className={cn(
              "rounded-2xl border px-3 py-2.5",
              s.done
                ? "border-amber-500/35 bg-amber-500/10"
                : "border-[var(--av-border)] bg-[var(--av-surface)]"
            )}
          >
            <p className="text-[10px] font-black text-amber-700 dark:text-amber-300">{s.n}</p>
            <p className="text-xs font-bold text-[var(--av-text-primary)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Crop picker */}
      <section className="rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-300">
              {t("nutrientsStep1")}
            </p>
            <h3 className="text-base font-bold text-[var(--av-text-primary)]">{t("nutrientsWhichCrop")}</h3>
          </div>
          <AppLink
            href="/library"
            className="inline-flex items-center gap-1 rounded-full border border-[var(--av-border)] px-3 py-1.5 text-[10px] font-bold text-[var(--av-accent)]"
          >
            <BookOpen className="h-3.5 w-3.5" />
            {t("nutrientsGuide")}
          </AppLink>
        </div>

        <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2 scrollbar-hide">
          {crops.map((c) => {
            const active = c.slug === cropSlug;
            const h = getCropHindiName(c.slug);
            const short = cropShortName(c.name);
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => {
                  setCropSlug(c.slug);
                  setShowAll(false);
                }}
                className={cn(
                  "group relative w-[5.6rem] shrink-0 overflow-hidden rounded-2xl border text-left transition active:scale-[0.98]",
                  active
                    ? "border-amber-500 ring-2 ring-amber-500/35 shadow-[0_12px_28px_-12px_rgba(245,158,11,0.55)]"
                    : "border-[var(--av-border)] opacity-90 hover:opacity-100"
                )}
              >
                <div className="relative h-16 w-full">
                  <Image
                    src={getCropImageUrl(c)}
                    alt={short}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="90px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {active ? (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                  ) : null}
                </div>
                <div className="bg-[var(--av-surface-inset)] px-2 py-2">
                  <p className="truncate text-[11px] font-bold text-[var(--av-text-primary)]">{short}</p>
                  {h ? <p className="truncate text-[9px] text-[var(--av-text-muted)]">{h}</p> : null}
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">
          {tf(locale, "nutrientsWatchSign", { sign: topSymptom })}
        </p>
      </section>

      {/* Nutrient filters */}
      <section className="rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-300">
          {t("nutrientsStep2")}
        </p>
        <h3 className="mt-0.5 text-base font-bold text-[var(--av-text-primary)]">{t("nutrientsWhichNutrient")}</h3>
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
          {NUTRIENT_FILTERS.map((f) => {
            const active = filter === f.id;
            const primaryLabel = f.id === "all" ? t("nutrientsAll") : f.label;
            const secondaryLabel = f.hindi;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFilter(f.id);
                  setShowAll(false);
                }}
                className={cn(
                  "min-w-[3.4rem] shrink-0 rounded-2xl border px-2.5 py-2.5 text-center transition",
                  active
                    ? "border-amber-500 bg-amber-500 text-white shadow-[0_10px_24px_-10px_rgba(245,158,11,0.7)]"
                    : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
                )}
              >
                <p className="text-sm font-black leading-none">{primaryLabel}</p>
                <p className={cn("mt-1 text-[9px] font-semibold", active ? "text-amber-50/90" : "")}>
                  {secondaryLabel}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sticky CTA strip */}
      <section className="sticky bottom-24 z-20 overflow-hidden rounded-[1.75rem] border border-amber-500/30 bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500 p-4 text-white shadow-[0_18px_40px_-16px_rgba(245,158,11,0.65)] lg:static">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-50/90">
              <Zap className="h-3 w-3 text-white" />
              {tf(locale, "nutrientsStickyHint", { n: filtered.length, crop: displayName })}
            </p>
            <p className="mt-1 text-sm font-bold leading-snug">{t("nutrientsStickyDesc")}</p>
          </div>
          <AppLink
            href="/ai-doctor"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-amber-900 shadow-lg"
          >
            <Target className="h-4 w-4" />
            {t("nutrientsPhotoDiagnose")}
          </AppLink>
        </div>
      </section>

      {/* Deficiency cards */}
      <section>
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--av-accent)]">
              {t("nutrientsStep3")}
            </p>
            <h3 className="text-base font-bold text-[var(--av-text-primary)]">
              {displayName}
              {hindi ? ` (${hindi})` : ""} — {t("nutrientsDeficiencies")}
            </h3>
          </div>
          <span className="rounded-full border border-[var(--av-border)] px-2.5 py-1 text-[10px] font-bold text-[var(--av-text-muted)]">
            {tf(locale, "nutrientsFound", { n: filtered.length })}
          </span>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[var(--av-border)] bg-[var(--av-surface)] p-8 text-center">
            <Leaf className="mx-auto h-8 w-8 text-[var(--av-text-muted)]" />
            <p className="mt-2 text-sm font-bold text-[var(--av-text-primary)]">{t("nutrientsNoFilter")}</p>
            <p className="mt-1 text-xs text-[var(--av-text-muted)]">{t("nutrientsNoFilterHint")}</p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="mt-3 rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-white"
            >
              {t("nutrientsShowAll")}
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map((d) => {
              const sym = nutrientSymbol(d.name);
              const fix = d.management[0] ?? d.recommendedFertilizers[0] ?? "—";
              const foliar =
                d.recommendedFertilizers.find((r) => /foliar|spray|%/i.test(r)) ?? "—";
              return (
                <article
                  key={d.name}
                  className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)] transition hover:border-amber-500/40 hover:shadow-[0_16px_36px_-18px_rgba(245,158,11,0.45)]"
                >
                  <div className="relative h-28 w-full">
                    <Image
                      src={nutrientImage(d.name)}
                      alt={d.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute left-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-white shadow-lg">
                      {sym}
                    </span>
                    <p className="absolute bottom-2.5 left-3 right-3 text-sm font-black text-white">
                      {d.name} · {t("nutrientsKami")}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col p-3.5">
                    <p className="line-clamp-2 text-[11px] leading-snug text-[var(--av-text-muted)]">
                      {d.deficiencySymptoms[0] ?? d.role}
                    </p>
                    <div className="mt-2.5 space-y-1.5 rounded-xl bg-[var(--av-surface-inset)] p-2.5 text-[10px]">
                      <p className="flex gap-1.5">
                        <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                        <span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-300">
                            {t("nutrientsFix")}:
                          </span>{" "}
                          <span className="text-[var(--av-text-secondary)]">{fix}</span>
                        </span>
                      </p>
                      <p className="flex gap-1.5">
                        <Droplets className="mt-0.5 h-3 w-3 shrink-0 text-sky-500" />
                        <span>
                          <span className="font-bold text-sky-600 dark:text-sky-300">
                            {t("nutrientsFoliar")}:
                          </span>{" "}
                          <span className="text-[var(--av-text-secondary)]">{foliar}</span>
                        </span>
                      </p>
                    </div>
                    <AppLink
                      href={`/deficiencies/${slugForNutrient(d.name)}`}
                      className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-amber-500 py-2.5 text-xs font-black text-white transition hover:bg-amber-600"
                    >
                      {t("nutrientsViewDetails")}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </AppLink>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {filtered.length > 8 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] py-3 text-xs font-bold text-amber-700 dark:text-amber-300"
          >
            {showAll ? t("nutrientsViewLess") : tf(locale, "nutrientsViewAllN", { n: filtered.length })}
            <ChevronDown className={cn("h-4 w-4 transition", showAll && "rotate-180")} />
          </button>
        )}
      </section>

      {/* Balanced table + tips */}
      <div className="grid gap-4 xl:grid-cols-12">
        <section className="overflow-hidden rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)] xl:col-span-7">
          <div className="border-b border-emerald-500/15 bg-gradient-to-r from-emerald-500/10 via-transparent to-amber-500/5 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
              {t("nutrientsCheatSheet")}
            </p>
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--av-text-primary)]">
              {t("nutrientsBalanced")} — {displayName}
            </h3>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="min-w-[520px] w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--av-border)] text-[10px] uppercase tracking-wide text-[var(--av-text-muted)]">
                  <th className="pb-2 pr-3 font-bold">{t("nutrientsTitle")}</th>
                  <th className="pb-2 pr-3 font-bold">{t("nutrientsBasal")}</th>
                  <th className="pb-2 pr-3 font-bold">{t("nutrientsTopDress")}</th>
                  <th className="pb-2 font-bold">{t("nutrientsFoliar")}</th>
                </tr>
              </thead>
              <tbody>
                {BALANCED_TABLE.map((row) => (
                  <tr key={row.nutrient} className="border-b border-[var(--av-border)]/70 last:border-0">
                    <td className="py-2.5 pr-3">
                      <p className="font-bold text-[var(--av-text-primary)]">{row.hindi}</p>
                      <p className="text-[10px] text-[var(--av-text-muted)]">{row.nutrient}</p>
                    </td>
                    <td className="py-2.5 pr-3 font-semibold text-[var(--av-text-secondary)]">{row.basal}</td>
                    <td className="py-2.5 pr-3 font-semibold text-[var(--av-text-secondary)]">{row.topDress}</td>
                    <td className="py-2.5 font-semibold text-sky-700 dark:text-sky-300">{row.foliar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[10px] text-[var(--av-text-muted)]">{t("nutrientsNote")}</p>
          </div>
        </section>

        <div className="space-y-4 xl:col-span-5">
          <section className="rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{t("nutrientsFarmerRules")}</h3>
            </div>
            <ul className="space-y-2">
              {tips.map((tip) => (
                <li
                  key={tip.title}
                  className="rounded-xl border border-amber-500/15 bg-amber-500/5 px-3 py-2.5"
                >
                  <p className="text-[11px] font-black text-amber-800 dark:text-amber-200">{tip.title}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-[var(--av-text-secondary)]">{tip.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="relative overflow-hidden rounded-[1.85rem] border border-emerald-500/25 bg-gradient-to-br from-stone-950 via-emerald-950 to-stone-900 p-5 text-white">
            <div className="pointer-events-none absolute -right-6 top-0 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="relative">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
                <Stethoscope className="h-5 w-5" />
              </span>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                {t("nutrientsNextUnlock")}
              </p>
              <p className="mt-1 text-base font-bold">{t("nutrientsAiTitle")}</p>
              <p className="mt-0.5 text-xs text-white/65">{t("nutrientsAiDesc")}</p>
              <AppLink
                href="/ai-doctor"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-black text-emerald-950"
              >
                {t("nutrientsAiCta")}
                <ChevronRight className="h-4 w-4" />
              </AppLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
