"use client";

import { useState, useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowDown,
  Share2,
  Search,
  Check,
  ShieldAlert,
  ChevronRight,
  Filter,
} from "lucide-react";
import { GovtSchemeSparkleIcon } from "@/components/brand/icons";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropCommonMistakes, type CropMistake, type MistakeWhen } from "@/lib/crops/cropCommonMistakes";
import { getCropHindiName } from "@/lib/crops/crop-display";
import type { Crop } from "@/types/crop";
import { cn } from "@/lib/cn";

const STAGE_FILTERS: { id: MistakeWhen; hi: string; en: string; icon: string }[] = [
  { id: "before", hi: "बुवाई से पहले", en: "Before Sowing", icon: "🌱" },
  { id: "after", hi: "खड़ी फसल में", en: "Standing Crop", icon: "🌾" },
  { id: "other", hi: "कटाई व भंडारण", en: "Harvest & Storage", icon: "📦" },
];

export default function CropMistakesSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const cropTitle = hi ? getCropHindiName(crop.slug) : crop.name;

  const allMistakes = useMemo(() => getCropCommonMistakes(crop.slug), [crop.slug]);

  const [activeStage, setActiveStage] = useState<MistakeWhen>("before");
  const [learnedMap, setLearnedMap] = useState<Record<number, boolean>>({});

  // Filter by stage
  const filtered = useMemo(() => {
    return allMistakes
      .map((item, originalIndex) => ({ ...item, originalIndex }))
      .filter((item) => item.when === activeStage);
  }, [allMistakes, activeStage]);

  const toggleLearned = (idx: number) => {
    setLearnedMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleShare = (item: CropMistake) => {
    const text = `🌾 *${cropTitle} की खेती में यह गलती न करें!*\n\n❌ *गलती:* ${item.wrong}\n\n✅ *सही उपाय:* ${item.right}\n\n📲 *AgriVeda App* पर पूरी जानकारी देखें।`;
    if (navigator.share) {
      navigator.share({ title: `${cropTitle} - सावधानियां`, text }).catch(() => {});
    } else {
      const url = `https://wa.me/?text=${encodeURI(text)}`;
      window.open(url, "_blank");
    }
  };

  const stageBadgeInfo = (when: MistakeWhen) => {
    switch (when) {
      case "before":
        return { labelHi: "🌱 बुवाई पूर्व सावधानी", labelEn: "Before Sowing", cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20" };
      case "after":
        return { labelHi: "🌾 खड़ी फसल सुरक्षा", labelEn: "Standing Crop", cls: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" };
      case "other":
        return { labelHi: "📦 कटाई व भंडारण उपाय", labelEn: "Harvest & Storage", cls: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20" };
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Clean Premium Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/40 via-emerald-950/60 to-slate-950 p-4 text-white shadow-md">
        <h1 className="relative z-10 text-base sm:text-lg font-black leading-tight text-white">
          {hi
            ? `${cropTitle} में आम गलतियाँ व सही उपाय`
            : `Common Pitfalls & Right Practices in ${cropTitle}`}
        </h1>

        <p className="relative z-10 mt-1 text-xs sm:text-[13px] leading-relaxed text-emerald-100/90">
          {hi
            ? "छोटी-छोटी गलतियों से पैदावार पर बड़ा असर पड़ता है। नीचे चरण अनुसार सही उपाय देखें:"
            : "Avoid common pitfalls at every stage to protect your crop and yield:"}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {STAGE_FILTERS.map((tab) => {
          const count = allMistakes.filter((m) => m.when === tab.id).length;
          const active = activeStage === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveStage(tab.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-black transition active:scale-95",
                active
                  ? "bg-emerald-700 text-white shadow-md shadow-emerald-800/30 ring-2 ring-emerald-500/40"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800"
              )}
            >
              <span>{tab.icon}</span>
              <span>{hi ? tab.hi : tab.en}</span>
              <span
                className={cn(
                  "ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-extrabold",
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
          <p className="text-sm font-bold text-slate-500">
            {hi ? "कोई परिणाम नहीं मिला।" : "No matches found."}
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveStage("before");
            }}
            className="mt-2 text-xs font-black text-emerald-600 underline"
          >
            {hi ? "फ़िल्टर रीसेट करें" : "Reset filters"}
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((item, index) => {
            const badge = stageBadgeInfo(item.when);
            const isLearned = learnedMap[item.originalIndex] || false;

            return (
              <div
                key={`${item.wrong}-${index}`}
                className={cn(
                  "group relative overflow-hidden rounded-[22px] border bg-white p-3.5 sm:p-4.5 shadow-sm transition hover:shadow-md dark:bg-slate-900/90",
                  isLearned
                    ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20"
                    : "border-slate-200/90 dark:border-slate-800"
                )}
              >
                {/* Header: Stage Badge */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider",
                        badge.cls
                      )}
                    >
                      {hi ? badge.labelHi : badge.labelEn}
                    </span>
                  </div>

                  {/* WhatsApp Share Button */}
                  <button
                    type="button"
                    onClick={() => handleShare(item)}
                    title={hi ? "किसान भाई को शेयर करें" : "Share with farmers"}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 active:scale-95 dark:bg-emerald-950/50 dark:text-emerald-300"
                  >
                    <Share2 className="h-3 w-3" />
                    <span>{hi ? "शेयर" : "Share"}</span>
                  </button>
                </div>

                {/* The Comparison Duo: Wrong vs Right */}
                <div className="mt-3 space-y-2.5">
                  {/* WRONG: Red Alert Box */}
                  <div className="relative rounded-2xl border border-rose-300/60 bg-rose-50/70 p-3 text-slate-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-100">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-white shadow-xs">
                        <XCircle className="h-4 w-4" strokeWidth={2.4} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-black uppercase tracking-wide text-rose-700 dark:text-rose-300">
                            {hi ? "❌ क्या न करें" : "❌ Common Mistake"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs sm:text-[14px] font-bold leading-snug text-rose-950 dark:text-rose-100">
                          {item.wrong}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transition Indicator */}
                  <div className="flex items-center justify-center gap-2 py-0.5">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <ArrowDown className="h-3 w-3 text-emerald-600" />
                      {hi ? "सही उपाय" : "Right Practice"}
                    </span>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  </div>

                  {/* RIGHT: Emerald Solution Box */}
                  <div className="relative rounded-2xl border border-emerald-300/80 bg-emerald-50/80 p-3 text-slate-900 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                        <CheckCircle2 className="h-4 w-4" strokeWidth={2.4} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                            {hi ? "✅ सही तरीका व वैज्ञानिक उपाय" : "✅ Correct Method"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs sm:text-[14px] font-bold leading-snug text-emerald-950 dark:text-emerald-100">
                          {item.right}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Checklist & Impact Marker */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <GovtSchemeSparkleIcon className="h-3 w-3 text-amber-500" />
                    {hi ? "समय व पैसे की बचत" : "Saves time & inputs"}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleLearned(item.originalIndex)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-extrabold transition active:scale-95",
                      isLearned
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    )}
                  >
                    <Check className={cn("h-3.5 w-3.5", isLearned ? "text-white" : "text-slate-400")} />
                    <span>{isLearned ? (hi ? "समझ लिया ✓" : "Understood ✓") : (hi ? "याद रखें" : "Remember")}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
