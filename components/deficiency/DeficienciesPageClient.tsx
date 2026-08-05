"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Camera,
  ChevronRight,
  MessageCircle,
  Search,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { crops } from "@/data/crops";
import { getCropManagementProfile } from "@/data/crop-management";
import { allNutrientDeficiencies } from "@/lib/nutrients/nutrientDeficiencyBridge";
import { getCropHindiName, getCropImageUrl } from "@/lib/crops/crop-display";
import { cn } from "@/lib/cn";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

/** Farmer look-and-tap problem cards → nutrient slug */
const PROBLEMS: {
  id: string;
  hi: string;
  en: string;
  hintHi: string;
  hintEn: string;
  slug: string;
  tone: string;
}[] = [
  {
    id: "yellow_old",
    hi: "पुरानी पत्ती पीली",
    en: "Old leaves yellow",
    hintHi: "नीचे से पीलापन",
    hintEn: "Yellow from bottom",
    slug: "nitrogen",
    tone: "border-amber-400/40 bg-amber-50 dark:bg-amber-950/30",
  },
  {
    id: "purple_small",
    hi: "पौधा छोटा / बैंगनी",
    en: "Small / purple plant",
    hintHi: "जड़-वृद्धि कम",
    hintEn: "Poor root growth",
    slug: "phosphorus",
    tone: "border-violet-400/40 bg-violet-50 dark:bg-violet-950/30",
  },
  {
    id: "burn_edge",
    hi: "किनारे जलते जैसे",
    en: "Leaf edges burn",
    hintHi: "सूखे भूरे किनारे",
    hintEn: "Brown dry edges",
    slug: "potassium",
    tone: "border-orange-400/40 bg-orange-50 dark:bg-orange-950/30",
  },
  {
    id: "new_pale",
    hi: "नई पत्ती सफ़ेद-पीली",
    en: "New leaves pale",
    hintHi: "ऊपर की पत्ती फीकी",
    hintEn: "Top leaves faded",
    slug: "iron",
    tone: "border-lime-400/40 bg-lime-50 dark:bg-lime-950/25",
  },
  {
    id: "stunted_zn",
    hi: "छोटे पत्ते / झाड़ी जैसे",
    en: "Tiny / bushy leaves",
    hintHi: "अक्सर जस्ता कमी",
    hintEn: "Often zinc lack",
    slug: "zinc",
    tone: "border-sky-400/40 bg-sky-50 dark:bg-sky-950/30",
  },
  {
    id: "fruit_drop",
    hi: "फल / फूल झड़ना",
    en: "Fruit / flower drop",
    hintHi: "सेटिंग खराब",
    hintEn: "Poor setting",
    slug: "boron",
    tone: "border-rose-400/40 bg-rose-50 dark:bg-rose-950/25",
  },
];

const SYM_TILE: Record<string, string> = {
  N: "bg-emerald-600 text-white",
  P: "bg-teal-600 text-white",
  K: "bg-lime-700 text-white",
  Ca: "bg-stone-600 text-white",
  Mg: "bg-green-700 text-white",
  S: "bg-amber-600 text-white",
  Fe: "bg-orange-600 text-white",
  Zn: "bg-sky-600 text-white",
  Mn: "bg-cyan-700 text-white",
  Cu: "bg-rose-700 text-white",
  B: "bg-emerald-700 text-white",
  Mo: "bg-indigo-600 text-white",
};

function cropShort(name: string) {
  return name.split("(")[0]?.trim() || name;
}

function resolveDeficiencySlug(name: string) {
  const hit = allNutrientDeficiencies.find(
    (n) =>
      n.name.toLowerCase() === name.toLowerCase() ||
      n.symbol.toLowerCase() === name.slice(0, 2).toLowerCase() ||
      name.toLowerCase().includes(n.name.toLowerCase()) ||
      n.name.toLowerCase().includes(name.toLowerCase().split(" ")[0] ?? "")
  );
  return hit?.slug ?? name.toLowerCase().replace(/\s+/g, "-");
}

export default function DeficienciesPageClient() {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const reduce = useReducedMotion();
  const [cropSlug, setCropSlug] = useState("paddy");
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");

  const crop = crops.find((c) => c.slug === cropSlug) ?? crops[0];
  const hindiCrop = getCropHindiName(crop.slug);
  const profile = getCropManagementProfile(crop.slug);
  const cropName = isHi && hindiCrop ? hindiCrop : cropShort(crop.name);

  const cropAlerts = useMemo(
    () => (profile?.nutrientDeficiencies ?? []).slice(0, 4),
    [profile]
  );

  const filteredAll = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allNutrientDeficiencies;
    return allNutrientDeficiencies.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.symbol.toLowerCase().includes(q) ||
        n.slug.includes(q)
    );
  }, [query]);

  const fade = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: MOTION.slow,
            ease: EASE_OUT,
            delay: 0.03 * i,
          },
        };

  return (
    <div className="relative mx-auto max-w-lg space-y-5 pb-8 sm:max-w-2xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-4 h-36 w-36 rounded-full bg-emerald-500/15 blur-3xl"
      />

      {/* One job: what do you see? */}
      <motion.header {...fade(0)} className="relative">
        <h1 className="font-display text-[1.65rem] font-bold leading-tight tracking-tight text-[var(--av-text-primary)]">
          {isHi ? "पत्ती में क्या दिख रहा है?" : "What do you see on the leaf?"}
        </h1>
        <p className="mt-1.5 text-[13px] leading-snug text-[var(--av-text-muted)]">
          {isHi
            ? "जो मिलता-जुलता हो — उस पर टैप करें। पढ़ने की ज़रूरत नहीं।"
            : "Tap what looks similar. No need to read long text."}
        </p>
      </motion.header>

      <motion.section {...fade(1)} className="relative grid grid-cols-2 gap-2.5">
        {PROBLEMS.map((p) => (
          <AppLink
            key={p.id}
            href={`/deficiencies/${p.slug}`}
            className={cn(
              "rounded-2xl border p-3.5 text-left transition active:scale-[0.98]",
              p.tone
            )}
          >
            <p className="text-[14px] font-bold leading-snug text-[var(--av-text-primary)]">
              {isHi ? p.hi : p.en}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[var(--av-text-muted)]">
              {isHi ? p.hintHi : p.hintEn}
            </p>
            <span className="mt-2.5 inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-200">
              {isHi ? "देखो" : "See"}
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </AppLink>
        ))}
      </motion.section>

      {/* Big practical CTAs */}
      <motion.section {...fade(2)} className="relative grid grid-cols-2 gap-2.5">
        <AppLink
          href="/ai-doctor"
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-3 py-3.5 text-[13px] font-bold text-white shadow-md shadow-emerald-700/25 active:scale-[0.98]"
        >
          <Camera className="h-4 w-4" />
          {isHi ? "फोटो लो" : "Take photo"}
        </AppLink>
        <AppLink
          href="/ask-query"
          className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-600/35 bg-[var(--av-surface)] px-3 py-3.5 text-[13px] font-bold text-emerald-900 dark:text-emerald-100 active:scale-[0.98]"
        >
          <MessageCircle className="h-4 w-4" />
          {isHi ? "पूछो" : "Ask"}
        </AppLink>
      </motion.section>

      {/* Crop strip — short Hindi labels */}
      <motion.section {...fade(3)} className="relative space-y-2">
        <p className="text-[13px] font-bold text-[var(--av-text-primary)]">
          {isHi ? `आपकी फसल — ${cropName}` : `Your crop — ${cropName}`}
        </p>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {crops.slice(0, 14).map((c) => {
            const active = c.slug === cropSlug;
            const hi = getCropHindiName(c.slug);
            const label = isHi && hi ? hi : cropShort(c.name);
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCropSlug(c.slug)}
                className={cn(
                  "flex shrink-0 flex-col items-center gap-1.5 rounded-2xl border px-2.5 py-2 transition",
                  active
                    ? "border-emerald-500/45 bg-emerald-500/12"
                    : "border-[var(--av-border)] bg-[var(--av-surface)]"
                )}
              >
                <span className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={getCropImageUrl(c)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </span>
                <span className="max-w-[56px] truncate text-[10px] font-bold text-[var(--av-text-primary)]">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {cropAlerts.length > 0 ? (
          <ul className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]">
            {cropAlerts.map((d) => {
              const slug = resolveDeficiencySlug(d.name);
              const meta = allNutrientDeficiencies.find((n) => n.slug === slug);
              const sym = meta?.symbol ?? d.name.slice(0, 1);
              return (
                <li key={d.name} className="border-b border-[var(--av-border-subtle)] last:border-0">
                  <AppLink
                    href={`/deficiencies/${slug}`}
                    className="flex items-center gap-3 px-3.5 py-3 active:bg-emerald-500/8"
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black",
                        SYM_TILE[sym] ?? "bg-emerald-700 text-white"
                      )}
                    >
                      {sym}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-bold text-[var(--av-text-primary)]">
                        {isHi && meta ? meta.name : d.name}
                      </span>
                      <span className="mt-0.5 line-clamp-1 block text-[11px] text-[var(--av-text-muted)]">
                        {d.deficiencySymptoms[0]}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[var(--av-text-muted)]" />
                  </AppLink>
                </li>
              );
            })}
          </ul>
        ) : null}
      </motion.section>

      {/* Secondary: all nutrients — hidden until asked */}
      <motion.section {...fade(4)} className="relative">
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="flex w-full items-center justify-between rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-4 py-3.5 text-left"
        >
          <span>
            <span className="block text-[13px] font-bold text-[var(--av-text-primary)]">
              {isHi ? "सभी पोषक तत्व" : "All nutrients"}
            </span>
            <span className="text-[11px] text-[var(--av-text-muted)]">
              {isHi ? "नाम से खोजें (N, Zn…)" : "Search by name (N, Zn…)"}
            </span>
          </span>
          <ChevronRight
            className={cn(
              "h-4 w-4 text-[var(--av-text-muted)] transition",
              showAll && "rotate-90"
            )}
          />
        </button>

        {showAll ? (
          <div className="mt-3 space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isHi ? "N, Zn, नाइट्रोजन…" : "N, Zn, nitrogen…"}
                className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] py-2.5 pl-9 pr-3 text-sm font-medium outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/25"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {filteredAll.map((n) => (
                <AppLink
                  key={n.slug}
                  href={`/deficiencies/${n.slug}`}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-2 py-3 active:scale-[0.98]"
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black",
                      SYM_TILE[n.symbol] ?? "bg-emerald-700 text-white"
                    )}
                  >
                    {n.symbol}
                  </span>
                  <span className="line-clamp-2 text-center text-[10px] font-bold leading-tight text-[var(--av-text-primary)]">
                    {n.name}
                  </span>
                </AppLink>
              ))}
            </div>
          </div>
        ) : null}
      </motion.section>
    </div>
  );
}
