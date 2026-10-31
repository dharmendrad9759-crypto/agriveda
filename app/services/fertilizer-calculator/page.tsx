"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Package,
  Share2,
  Send,
  X,
  Plus,
  Minus,
  CheckCircle2,
  FileText,
  Clock,
  Lightbulb,
  ShieldCheck,
  Ruler,
  MapPin,
} from "lucide-react";
import { FertilizerNpkSparkleIcon } from "@/components/brand/icons";
import Agriveda2Shell from "@/components/agriveda2/Agriveda2Shell";
import { cropCatalog } from "@/data/crop-catalog";
import {
  buildFertilizerPlan,
  listFertilizerCrops,
  type SoilTestLevels,
} from "@/lib/agriveda2/fertilizerEngine";
import {
  fertilizerAmountParts,
  fertilizerBagPurposeHi,
  fertilizerPackHi,
  GOLDEN_FIELD_RULES_HI,
} from "@/data/agriveda2/fertilizer-data";
import { convertToAcres, type AreaUnit } from "@/lib/agriveda2/seedCalculatorEngine";
import { EASE_OUT } from "@/lib/motion/variants";
import { normalizeCropSlug, resolveCropImage } from "@/lib/crops/cropImages";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { sortCropsByCurrentSeason } from "@/lib/crops/seasonalCropEngine";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";
import SoilTestInputs from "@/components/fertilizer/SoilTestInputs";
import { useToast } from "@/components/ui/Toast";
import { useFarmData } from "@/hooks/useFarmData";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type Step = "ask" | "plan";

function parseAcresParam(raw: string | null): string | null {
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return String(Math.min(50, Math.max(0.1, n)));
}

function FertilizerCalculatorInner() {
  const searchParams = useSearchParams();
  const slugs = useMemo(() => listFertilizerCrops(), []);
  const crops = useMemo(() => {
    const list = cropCatalog.filter((c) => slugs.includes(c.slug));
    return sortCropsByCurrentSeason(list);
  }, [slugs]);
  const { showToast } = useToast();
  const { data: farmData } = useFarmData();
  const savedFields = farmData?.fields ?? [];

  const cropFromUrl = useMemo(() => {
    const raw = searchParams.get("crop");
    if (!raw) return null;
    const key = normalizeCropSlug(raw);
    return slugs.includes(key) ? key : null;
  }, [searchParams, slugs]);

  const acresFromUrl = useMemo(
    () => parseAcresParam(searchParams.get("acres")),
    [searchParams]
  );

  const [step, setStep] = useState<Step>(() => (cropFromUrl ? "plan" : "ask"));
  const [slug, setSlug] = useState<string | null>(() => cropFromUrl);
  const [area, setArea] = useState(() => acresFromUrl ?? "1");
  const [soilTest, setSoilTest] = useState<SoilTestLevels>({});
  const [hasSoilReport, setHasSoilReport] = useState<boolean>(false);
  const [showSoilInPlan, setShowSoilInPlan] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useBodyScrollLock(showBottomSheet);

  useEffect(() => {
    if (!showBottomSheet) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowBottomSheet(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showBottomSheet]);

  useEffect(() => {
    if (!cropFromUrl) return;
    setSlug(cropFromUrl);
    setStep("plan");
    if (acresFromUrl) setArea(acresFromUrl);
  }, [cropFromUrl, acresFromUrl]);

  const acres = useMemo(() => {
    const n = parseFloat(area);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return convertToAcres(n, "acre" satisfies AreaUnit);
  }, [area]);

  const plan = useMemo(() => {
    if (!slug || !acres) return null;
    return buildFertilizerPlan(slug, acres, soilTest);
  }, [slug, acres, soilTest]);

  const cropHi =
    (slug && getCropHindiName(slug)) ||
    cropCatalog.find((c) => c.slug === slug)?.name ||
    slug ||
    "";
  const areaLabel = Number.isInteger(acres) ? String(acres) : acres.toFixed(1);
  const canSeePlan = Boolean(slug && acres > 0);
  const backHref = cropFromUrl
    ? `/crops/${cropFromUrl}/care/fertilizer`
    : "/dashboard";

  const handleCropSelect = (selectedSlug: string) => {
    setSlug(selectedSlug);
    setShowBottomSheet(true);
  };

  const handleViewPlan = () => {
    if (!canSeePlan) return;
    setShowBottomSheet(false);
    setStep("plan");
  };

  const handleShareWhatsApp = () => {
    if (!plan) return;
    const bagLines = plan.bags
      .map((b) => {
        const { num, unit } = fertilizerAmountParts(b.amount);
        const packInfo = fertilizerPackHi(b.name, parseFloat(num) || 0, unit);
        return `• ${b.name}: ${b.amount}${packInfo ? ` (${packInfo})` : ""}`;
      })
      .join("\n");
    const scheduleLines = plan.schedule
      .map((s, i) => {
        const methodPart = s.method ? ` [${s.method}]` : "";
        const benefitPart = s.benefit ? `\n   🎯 फायदा: ${s.benefit}` : "";
        return `${i + 1}. *${s.time}*${methodPart}:\n   ${s.apply}${benefitPart}`;
      })
      .join("\n\n");

    const message =
      `🌾 *खाद की वैज्ञानिक + फील्ड पर्ची — AgriVeda*\n\n` +
      `*फसल:* ${cropHi}\n` +
      `*खेत:* ${areaLabel} एकड़\n` +
      (plan.soilAdjusted ? `*(मिट्टी रिपोर्ट अनुसार संतुलित)*\n\n` : `\n`) +
      `📦 *कुल आवश्यक खाद सामग्री:*\n${bagLines}\n\n` +
      `📅 *अवस्था अनुसार डालने का तरीका:*\n${scheduleLines}\n\n` +
      `💡 *किसान टिप (गोल्डन नियम):*\n` +
      `• DAP/SSP के साथ सामान्य जिंक सल्फेट कभी मिलाकर न डालें (Chelated Zinc EDTA 12% लें या पहली यूरिया के साथ दें)।\n` +
      `• कैल्शियम नाइट्रेट को किसी भी सल्फेट या फॉस्फेट वाले खाद के साथ न मिलाएं, हमेशा अलग चलाएं।\n\n` +
      `_AgriVeda किसान ऐप से तैयार_`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  const handleGenericShare = async () => {
    if (!plan) return;
    const summary = `${cropHi} के लिए ${areaLabel} एकड़ वैज्ञानिक + प्रैक्टिकल खाद योजना — कुल ${plan.bags.length} प्रकार की खाद। AgriVeda`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `खाद योजना - ${cropHi}`,
          text: summary,
        });
      } catch {
        /* canceled */
      }
    } else {
      await navigator.clipboard.writeText(summary);
      showToast("खाद योजना कॉपी हो गई ✓", "success");
    }
  };

  return (
    <Agriveda2Shell
      title="खाद कैलकुलेटर"
      subtitle={step === "ask" ? "फसल चुनें" : `${cropHi} · ${areaLabel} एकड़`}
      backHref={backHref}
      hubTheme="green"
    >
      <div className="mx-auto max-w-lg space-y-3 pb-24">
        <AnimatePresence mode="wait" initial={false}>
          {step === "ask" ? (
            <motion.div
              key="ask"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="space-y-3"
            >
              {/* Header Card */}
              <div
                className="overflow-hidden rounded-[24px] border border-emerald-500/30 !bg-gradient-to-br !from-[#063321] !via-[#042618] !to-[#021810] p-5 !text-white shadow-[0_16px_36px_-18px_rgba(6,78,59,0.5)]"
              >
                <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                  किस फसल की खाद निकालनी है?
                </h1>
              </div>

              {/* Crop Grid */}
              <div
                className={cn(
                  AV.card,
                  "rounded-[22px] border border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 via-[var(--av-surface)] to-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]"
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-black tracking-tight text-emerald-950 dark:text-emerald-200">
                    फसल चुनें
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                  {crops.map((c) => {
                    const active = c.slug === slug;
                    const hi = getCropHindiName(c.slug);
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => handleCropSelect(c.slug)}
                        className={cn(
                          "group relative flex flex-col items-center gap-1.5 rounded-2xl border p-2 text-left transition-all active:scale-[0.96]",
                          active
                            ? "border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-md shadow-emerald-900/10"
                            : "border-[var(--av-border)] bg-[var(--av-surface-inset)] hover:border-emerald-500/40"
                        )}
                      >
                        <span className="relative h-16 w-full overflow-hidden rounded-xl bg-[var(--av-surface)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={resolveCropImage({ slug: c.slug, name: c.name })}
                            alt=""
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                          {active && (
                            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                              <CheckCircle2 className="h-3 w-3" strokeWidth={3} />
                            </span>
                          )}
                        </span>
                        <span className="line-clamp-1 text-center text-xs font-extrabold text-[var(--av-text-primary)]">
                          {hi || c.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3 Golden Field Rules Preview on Ask Screen */}
              <div
                className={cn(
                  AV.card,
                  "rounded-[22px] border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-[var(--av-surface)] to-[var(--av-surface)] p-4 shadow-sm"
                )}
              >
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <Lightbulb className="h-4 w-4" />
                  </span>
                  <h2 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    💡 किसान टिप: 3 गोल्डन फील्ड नियम
                  </h2>
                </div>
                <div className="space-y-2">
                  {GOLDEN_FIELD_RULES_HI.map((rule) => (
                    <div
                      key={rule.id}
                      className="rounded-xl border border-amber-500/20 bg-[var(--av-surface-inset)] p-2.5"
                    >
                      <p className="text-xs font-black text-[var(--av-text-primary)]">
                        {rule.titleHi}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-[var(--av-text-secondary)]">
                        {rule.bodyHi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* =================================================== */
            /* PLAN SCREEN (Ultra-Premium Stage-Wise Timeline UI)  */
            /* =================================================== */
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="space-y-3.5"
            >
              {/* Hero Section */}
              <div className="relative overflow-hidden rounded-[26px] border border-emerald-500/25 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 p-5 text-white shadow-[0_20px_40px_-18px_rgba(6,78,59,0.65)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl"
                />

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/20 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveCropImage({
                          slug: slug!,
                          name: cropCatalog.find((c) => c.slug === slug)?.name ?? slug!,
                        })}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <div>
                      <h1 className="text-xl font-black leading-tight text-white sm:text-2xl">
                        {cropHi} के लिए खाद की मात्रा
                      </h1>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("ask");
                      setShowBottomSheet(true);
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-sm transition active:scale-95 hover:bg-white/20"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    बदलें
                  </button>
                </div>

                {/* Soil adjusted indicator */}
                {plan?.soilAdjusted ? (
                  <div className="relative z-10 mt-3 flex items-center gap-2 rounded-xl bg-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-200 ring-1 ring-amber-500/30">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-300" />
                    <span>मिट्टी जाँच रिपोर्ट के अनुसार मात्रा संतुलित की गई है।</span>
                  </div>
                ) : null}
              </div>

              {!plan ? (
                <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-8 text-center text-sm text-[var(--av-text-muted)]">
                  खाद योजना तैयार नहीं हो सकी। कृपया एकड़ दोबारा भरें।
                </div>
              ) : (
                <>
                  {/* Category Rule Banner (if present) */}
                  {plan.categoryRuleHi && (
                    <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                      <ShieldCheck
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                        aria-hidden
                      />
                      <p className="text-xs font-bold leading-relaxed text-[var(--av-text-primary)]">
                        {plan.categoryRuleHi}
                      </p>
                    </div>
                  )}

                  {/* Stage-Wise Vertical Timeline UI */}
                  {plan.schedule.length > 0 && (
                    <div
                      className={cn(
                        AV.card,
                        "rounded-[24px] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 sm:p-5 shadow-[var(--av-shadow-sm)]"
                      )}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                            <Clock className="h-4 w-4" />
                          </span>
                          <div>
                            <h2 className="text-sm font-extrabold text-[var(--av-text-primary)]">
                              अवस्था अनुसार शेड्यूल (कब, कैसे और क्या डालें)
                            </h2>
                            <p className="text-[11px] font-medium text-[var(--av-text-muted)]">
                              बेसल + टॉप ड्रेसिंग + ड्रेंचिंग + फोलियर स्प्रे कॉम्बिनेशन
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="relative pl-2">
                        {/* Vertical continuous timeline bar */}
                        <div className="absolute bottom-4 left-[21px] top-4 w-0.5 bg-gradient-to-b from-emerald-600 via-teal-500 to-emerald-200 dark:to-emerald-800" />

                        <div className="space-y-4">
                          {plan.schedule.map((s, i) => {
                            const isFirst = i === 0;
                            const isSpray =
                              s.method?.includes("स्प्रे") || s.apply.includes("स्प्रे");
                            const isDrench =
                              s.method?.includes("ड्रेंचिंग") || s.method?.includes("ड्रिप");
                            return (
                              <div key={`${s.time}-${i}`} className="relative flex gap-3.5">
                                {/* Number Badge on line */}
                                <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-xs font-black text-white shadow-md shadow-emerald-900/30 ring-4 ring-[var(--av-surface)]">
                                  {i + 1}
                                </div>

                                {/* Content Card for this stage */}
                                <div className="flex-1 overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3.5 shadow-sm">
                                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                                    <span
                                      className={cn(
                                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold",
                                        isSpray
                                          ? "bg-sky-600/15 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300"
                                          : isDrench
                                          ? "bg-purple-600/15 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300"
                                          : "bg-emerald-600/10 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                                      )}
                                    >
                                      {s.method ||
                                        (isFirst
                                          ? "मिट्टी में (Basal)"
                                          : "सिंचाई / टॉप ड्रेसिंग")}
                                    </span>
                                    <span className="text-xs font-black text-[var(--av-text-primary)]">
                                      {s.time}
                                    </span>
                                  </div>

                                  <p className="mt-2 text-sm font-black leading-snug text-[var(--av-text-primary)]">
                                    {s.apply}
                                  </p>

                                  {s.benefit ? (
                                    <div className="mt-2 flex items-start gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5">
                                      <span className="text-xs leading-none">🎯</span>
                                      <p className="text-[11px] font-bold leading-snug text-emerald-900 dark:text-emerald-200">
                                        मुख्य फायदा: {s.benefit}
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-[var(--av-text-secondary)]">
                                      {isFirst
                                        ? "बुवाई के समय खाद को बीज से 4-5 सेमी नीचे या कतारों में डालें ताकि पौधे की जड़ें मजबूत हों।"
                                        : "सिंचाई के बाद खेत में पैर टिकने पर छिड़कें। पत्तों पर ओस या पानी सूखा होना चाहिए।"}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Soil Test Toggle in Plan screen */}
                  <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setShowSoilInPlan((v) => !v)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-[var(--av-text-primary)]">
                            {hasSoilReport || plan.soilAdjusted
                              ? "मिट्टी रिपोर्ट स्तर (बदलें)"
                              : "क्या आपके पास मिट्टी जाँच रिपोर्ट है?"}
                          </p>
                          <p className="text-[10px] text-[var(--av-text-muted)]">
                            N, P, K के कम/ज़्यादा स्तर के अनुसार खाद घटाएं या बढ़ाएं
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-[var(--av-text-muted)] transition-transform duration-200",
                          showSoilInPlan && "rotate-180"
                        )}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {showSoilInPlan && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-[var(--av-border)]">
                            <SoilTestInputs value={soilTest} onChange={setSoilTest} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 💡 किसान टिप: गोल्डन नियम */}
                  <div
                    className={cn(
                      AV.card,
                      "rounded-[24px] border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-[var(--av-surface)] to-[var(--av-surface)] p-4 shadow-sm"
                    )}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        <Lightbulb className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="text-sm font-black text-[var(--av-text-primary)]">
                          💡 किसान टिप: गोल्डन नियम
                        </h3>
                        <p className="text-[10.5px] font-medium text-[var(--av-text-muted)]">
                          खाद मिलाते और स्प्रे करते समय इन वैज्ञानिक नियमों का हमेशा ध्यान रखें
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {/* Integrated crop-specific field tip */}
                      {(plan.farmerTipHi ||
                        plan.guideNotes.find((n) => !n.includes("मिट्टी जाँच"))) && (
                        <div className="rounded-xl border border-amber-500/40 bg-amber-500/15 p-3">
                          <p className="text-xs font-black text-amber-900 dark:text-amber-300">
                            ⭐ {cropHi} विशेष फील्ड सावधानी
                          </p>
                          <p className="mt-1 text-[11.5px] font-medium leading-relaxed text-[var(--av-text-primary)]">
                            {plan.farmerTipHi ||
                              plan.guideNotes.find((n) => !n.includes("मिट्टी जाँच"))}
                          </p>
                        </div>
                      )}

                      {plan.goldenRulesHi.map((rule) => (
                        <div
                          key={rule.id}
                          className="rounded-xl border border-amber-500/20 bg-[var(--av-surface-inset)] p-3"
                        >
                          <p className="text-xs font-black text-amber-900 dark:text-amber-300">
                            {rule.titleHi}
                          </p>
                          <p className="mt-1 text-[11.5px] font-medium leading-relaxed text-[var(--av-text-primary)]">
                            {rule.bodyHi}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-center text-[10.5px] font-medium text-[var(--av-text-muted)]">
                    यह शेड्यूल ICAR/SAU वैज्ञानिक संस्तुतियों और प्रैक्टिकल हाई-यील्ड फील्ड परीक्षणों पर आधारित है।
                  </p>
                </>
              )}

              {/* ================================================= */}
              {/* STICKY BOTTOM ACTION BAR (Shopkeeper WhatsApp & Share) */}
              {/* ================================================= */}
              <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--av-surface)]/95 border-t border-[var(--av-border)] p-3 shadow-xl backdrop-blur-md">
                <div className="mx-auto flex max-w-lg items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 py-3.5 px-4 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-900/25 transition active:scale-[0.98]"
                  >
                    <Send className="h-4 w-4" />
                    <span>दुकानदार को लिस्ट भेजें (WhatsApp)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenericShare}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-primary)] shadow-sm transition active:scale-95"
                    aria-label="शेयर करें"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================== */}
        {/* DIALOG MODAL (Crop & Acre Selection - Centered via Portal) */}
        {/* ========================================================== */}
        {mounted && typeof document !== "undefined"
          ? createPortal(
              <AnimatePresence>
                {showBottomSheet && slug && (
                  <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${cropHi} खाद कैलकुलेटर`}
                  >
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setShowBottomSheet(false)}
                      className="fixed inset-0 bg-black/75 backdrop-blur-sm"
                    />

                    {/* Dialog Card - Positioned squarely in front of the screen */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94, y: 16 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: 16 }}
                      transition={{ type: "spring", damping: 26, stiffness: 320 }}
                      className="relative z-10 my-auto flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden rounded-[26px] border border-emerald-500/30 bg-[var(--av-surface)] shadow-2xl text-left"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header (Sticky at top of dialog) */}
                      <div className="flex items-center justify-between border-b border-[var(--av-border)] bg-[var(--av-surface)] px-5 py-3.5 shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl ring-2 ring-emerald-500/30">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={resolveCropImage({
                                slug,
                                name: cropCatalog.find((c) => c.slug === slug)?.name ?? slug,
                              })}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </span>
                          <div className="min-w-0">
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" />
                              फसल चुनी गई
                            </span>
                            <h2 className="truncate text-lg font-black text-[var(--av-text-primary)]">
                              {cropHi}
                            </h2>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowBottomSheet(false)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--av-surface-inset)] text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)] active:scale-95"
                          aria-label="बंद करें"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Scrollable Form Body */}
                      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4 scrollbar-hide">
                        {/* Saved Farm Fields Quick Selector */}
                        {savedFields.length > 0 ? (
                          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-3">
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-200 flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                                मेरे सहेजे गए खेत से चुनें:
                              </span>
                              <a
                                href="/my-farm/measure"
                                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-0.5"
                              >
                                <Ruler className="h-3 w-3" />
                                खेत नापें
                              </a>
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                              {savedFields.map((f) => {
                                const fAcres = f.areaAcres ? String(f.areaAcres) : (f.area?.match(/([\d.]+)/)?.[1] ?? "1");
                                const isSelected = area === fAcres;
                                return (
                                  <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => {
                                      setArea(fAcres);
                                      if (f.cropSlug && slugs.includes(f.cropSlug)) {
                                        setSlug(f.cropSlug);
                                      }
                                    }}
                                    className={cn(
                                      "shrink-0 rounded-xl px-3 py-2 text-left text-xs font-bold transition active:scale-95 border",
                                      isSelected
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                        : "bg-[var(--av-surface)] text-[var(--av-text-primary)] border-[var(--av-border)] hover:border-emerald-500/40"
                                    )}
                                  >
                                    <div className="truncate max-w-[130px] font-extrabold">{f.name}</div>
                                    <div
                                      className={cn(
                                        "text-[10px] font-semibold mt-0.5",
                                        isSelected ? "text-emerald-100" : "text-emerald-700 dark:text-emerald-300"
                                      )}
                                    >
                                      {fAcres} एकड़ {f.crop ? `• ${f.crop.split("(")[0].trim()}` : ""}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[11px] text-[var(--av-text-muted)]">
                              खेत का रकबा नहीं पता?
                            </span>
                            <a
                              href="/my-farm/measure"
                              className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1"
                            >
                              <Ruler className="h-3 w-3" />
                              उपग्रह से अपना खेत नापें →
                            </a>
                          </div>
                        )}

                        {/* Acre Input with Stepper */}
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[var(--av-text-muted)]">
                            खेत कितना एकड़?
                          </label>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const cur = Math.max(0.5, parseFloat(area || "1") - 0.5);
                                setArea(String(Math.round(cur * 10) / 10));
                              }}
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-primary)] transition active:scale-95"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <div className="relative flex-1">
                              <input
                                type="number"
                                inputMode="decimal"
                                min="0.1"
                                max="50"
                                step="0.5"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                className="av-input h-12 w-full text-center text-xl font-black text-emerald-700 dark:text-emerald-300"
                                placeholder="1"
                              />
                              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--av-text-muted)]">
                                एकड़
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const cur = Math.min(50, parseFloat(area || "1") + 0.5);
                                setArea(String(Math.round(cur * 10) / 10));
                              }}
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-primary)] transition active:scale-95"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Quick Acre Chips */}
                          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                            {["0.5", "1", "2", "3", "5"].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setArea(val)}
                                className={cn(
                                  "rounded-full px-3 py-1 text-xs font-bold transition active:scale-95",
                                  area === val
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)]"
                                )}
                              >
                                {val} एकड़
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* किसान के लिए 3 जरूरी टिप्स */}
                        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-3.5 space-y-2">
                          <p className="text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                            <Lightbulb className="h-4 w-4 text-emerald-600" />
                            <span>किसान भाइयों के लिए 3 जरूरी टिप्स:</span>
                          </p>
                          <ul className="space-y-1.5 text-[11px] text-[var(--av-text-secondary)] font-medium leading-relaxed">
                            <li className="flex items-start gap-1.5">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                              <span><strong>DAP व जिंक अलग रखें:</strong> DAP बुवाई पर दें और जिंक पहली सिंचाई पर यूरिया के साथ। दोनों कभी एक साथ न मिलाएं।</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                              <span><strong>नमी में ही खाद दें:</strong> यूरिया हमेशा खेत में पर्याप्त नमी होने पर या सिंचाई के तुरंत बाद ही डालें।</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                              <span><strong>स्प्रे में पर्याप्त पानी:</strong> पत्तों पर स्प्रे करते समय प्रति एकड़ 150–200 लीटर साफ पानी अवश्य रखें।</span>
                            </li>
                          </ul>
                        </div>

                        {/* Prompt: Mitti Janch Report Check */}
                        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-3.5">
                          <p className="text-xs font-extrabold text-[var(--av-text-primary)]">
                            क्या आपके पास मिट्टी जाँच रिपोर्ट है?
                          </p>
                          <p className="mt-0.5 text-[10.5px] text-[var(--av-text-muted)]">
                            रिपोर्ट होने पर खाद की मात्रा और भी सटीक हो जाती है
                          </p>

                          <div className="mt-2.5 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setHasSoilReport(false);
                                setSoilTest({});
                              }}
                              className={cn(
                                "flex-1 rounded-xl py-2.5 text-xs font-black transition active:scale-95",
                                !hasSoilReport
                                  ? "bg-emerald-600 text-white shadow-sm"
                                  : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
                              )}
                            >
                              नहीं
                            </button>
                            <button
                              type="button"
                              onClick={() => setHasSoilReport(true)}
                              className={cn(
                                "flex-1 rounded-xl py-2.5 text-xs font-black transition active:scale-95",
                                hasSoilReport
                                  ? "bg-amber-600 text-white shadow-sm"
                                  : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
                              )}
                            >
                              हाँ
                            </button>
                          </div>

                          {hasSoilReport && (
                            <div className="mt-3 pt-3 border-t border-amber-500/20">
                              <SoilTestInputs value={soilTest} onChange={setSoilTest} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sticky Dialog Footer CTA */}
                      <div className="border-t border-[var(--av-border)] bg-[var(--av-surface)] p-4 shrink-0">
                        <button
                          type="button"
                          disabled={!canSeePlan}
                          onClick={handleViewPlan}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-900/30 transition active:scale-[0.98] disabled:opacity-50"
                        >
                          <FertilizerNpkSparkleIcon className="h-4 w-4" />
                          <span>खाद योजना देखें</span>
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>,
              document.body
            )
          : null}
      </div>
    </Agriveda2Shell>
  );
}

export default function FertilizerCalculatorPage() {
  return (
    <Suspense
      fallback={
        <Agriveda2Shell
          title="खाद कैलकुलेटर"
          subtitle="लोड हो रहा है…"
          backHref="/dashboard"
          hubTheme="green"
        >
          <div className="py-12 text-center text-sm text-[var(--av-text-muted)]">
            लोड हो रहा है…
          </div>
        </Agriveda2Shell>
      }
    >
      <FertilizerCalculatorInner />
    </Suspense>
  );
}
