"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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
  Sparkles,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
} from "lucide-react";
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
} from "@/data/agriveda2/fertilizer-data";
import { convertToAcres, type AreaUnit } from "@/lib/agriveda2/seedCalculatorEngine";
import { EASE_OUT } from "@/lib/motion/variants";
import { normalizeCropSlug, resolveCropImage } from "@/lib/crops/cropImages";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";
import SoilTestInputs from "@/components/fertilizer/SoilTestInputs";
import { useToast } from "@/components/ui/Toast";

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
  const crops = cropCatalog.filter((c) => slugs.includes(c.slug));
  const { showToast } = useToast();

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

  // Calculate approximate total bags from plan.bags
  const totalBagsEstimate = useMemo(() => {
    if (!plan || !plan.bags.length) return 0;
    let total = 0;
    for (const b of plan.bags) {
      const match = b.amount.match(/([\d.]+)\s*बोरी/);
      if (match) {
        total += parseFloat(match[1]);
      } else {
        const kgMatch = b.amount.match(/([\d.]+)\s*किग्रा/);
        if (kgMatch) {
          total += parseFloat(kgMatch[1]) / 45; // average 45kg bag
        }
      }
    }
    return Math.max(1, Math.round(total * 10) / 10);
  }, [plan]);

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
    const bagLines = plan.bags.map((b) => `• ${b.name}: ${b.amount}`).join("\n");
    const scheduleLines = plan.schedule
      .map((s, i) => `${i + 1}. *${s.time}*: ${s.apply}`)
      .join("\n");

    const message =
      `🌾 *खाद की पर्ची — AgriVeda*\n\n` +
      `*फसल:* ${cropHi}\n` +
      `*खेत:* ${areaLabel} एकड़\n` +
      (plan.soilAdjusted ? `*(मिट्टी रिपोर्ट अनुसार संतुलित)*\n\n` : `\n`) +
      `📦 *कुल आवश्यक खाद:*\n${bagLines}\n\n` +
      `📅 *डालने का सही समय:*\n${scheduleLines}\n\n` +
      `_AgriVeda किसान ऐप से तैयार_`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  const handleGenericShare = async () => {
    if (!plan) return;
    const summary = `${cropHi} के लिए ${areaLabel} एकड़ खाद योजना — कुल ${plan.bags.length} प्रकार की खाद। AgriVeda`;
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
                className={cn(
                  AV.card,
                  "overflow-hidden rounded-[24px] border border-emerald-500/20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 p-5 text-white shadow-[0_16px_36px_-18px_rgba(6,78,59,0.5)]"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                    <Package className="h-4 w-4 text-emerald-300" />
                  </span>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                    सटीक खाद खुराक
                  </p>
                </div>
                <h1 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
                  किस फसल की खाद निकालनी है?
                </h1>
                <p className="mt-1 text-xs font-medium leading-relaxed text-emerald-100/85">
                  फसल पर टैप करें — एकड़ डालते ही समय अनुसार खाद की पूरी पर्ची मिल जाएगी।
                </p>
              </div>

              {/* Crop Grid */}
              <div
                className={cn(
                  AV.card,
                  "rounded-[22px] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]"
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                    फसल चुनें ({crops.length})
                  </p>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    टैप करें
                  </span>
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
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                        {areaLabel} एकड़ खेत की योजना
                      </p>
                      <h1 className="text-xl font-black leading-tight text-white sm:text-2xl">
                        {cropHi} के लिए कुल खाद
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

                {/* Big Metric Banner */}
                <div className="relative z-10 mt-4 flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                      कुल अनुमानित बैग
                    </p>
                    <p className="mt-0.5 text-2xl font-black tracking-tight text-white">
                      लगभग {totalBagsEstimate}{" "}
                      <span className="text-sm font-semibold text-emerald-100">
                        बोरी खाद
                      </span>
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-emerald-200">
                    <Package className="h-6 w-6" />
                  </div>
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
                  {/* Total Bags Breakdown Grid */}
                  <div
                    className={cn(
                      AV.card,
                      "rounded-[24px] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]"
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <Package className="h-4 w-4" />
                        </span>
                        <h2 className="text-sm font-extrabold text-[var(--av-text-primary)]">
                          खाद सामग्री (कुल मात्रा)
                        </h2>
                      </div>
                      <span className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                        {plan.bags.length} प्रकार
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {plan.bags.map((b) => {
                        const { num, rest } = fertilizerAmountParts(b.amount);
                        return (
                          <div
                            key={b.name}
                            className="group relative flex flex-col justify-between rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3 transition hover:border-emerald-500/30"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                  🌾
                                </span>
                                <span className="rounded-md bg-[var(--av-surface)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--av-text-muted)] border border-[var(--av-border)]">
                                  {fertilizerBagPurposeHi(b.name)}
                                </span>
                              </div>
                              <p className="mt-2 text-xs font-black leading-tight text-[var(--av-text-primary)] line-clamp-1">
                                {b.name}
                              </p>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-[var(--av-border)]/60">
                              <p className="text-xl font-black leading-none text-emerald-700 dark:text-emerald-300">
                                {num}{" "}
                                <span className="text-[11px] font-bold text-[var(--av-text-muted)]">
                                  किग्रा
                                </span>
                              </p>
                              {rest && !/^किग्रा/i.test(rest) ? (
                                <p className="mt-1 line-clamp-1 text-[10px] font-semibold text-[var(--av-text-muted)]">
                                  {rest.replace(/^किग्रा\s*·?\s*/, "")}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

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
                              चरण अनुसार खाद (कब और कैसे डालें)
                            </h2>
                            <p className="text-[11px] font-medium text-[var(--av-text-muted)]">
                              समय पर खाद देने से फसल का पूरा उत्पादन मिलता है
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
                            return (
                              <div key={`${s.time}-${i}`} className="relative flex gap-3.5">
                                {/* Number Badge on line */}
                                <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-xs font-black text-white shadow-md shadow-emerald-900/30 ring-4 ring-[var(--av-surface)]">
                                  {i + 1}
                                </div>

                                {/* Content Card for this stage */}
                                <div className="flex-1 overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3.5 shadow-sm">
                                  <div className="flex flex-wrap items-center justify-between gap-1">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                                      चरण {i + 1} · {isFirst ? "बुवाई का समय (बेसल)" : `सिंचाई / टॉप ड्रेसिंग`}
                                    </span>
                                    <span className="text-[11px] font-bold text-[var(--av-text-muted)]">
                                      {s.time}
                                    </span>
                                  </div>

                                  <p className="mt-2 text-sm font-black leading-snug text-[var(--av-text-primary)]">
                                    {s.apply}
                                  </p>

                                  <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-[var(--av-text-secondary)]">
                                    {isFirst
                                      ? "बुवाई के समय खाद को बीज से 4-5 सेमी नीचे या कतारों में डालें ताकि पौधे की जड़ें मजबूत हों।"
                                      : "सिंचाई के बाद खेत में पैर टिकने पर छिड़कें। पत्तों पर ओस या पानी सूखा होना चाहिए।"}
                                  </p>
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

                  {/* Farmer Tips & Caution */}
                  {(plan.farmerTipHi ||
                    plan.guideNotes.find((n) => !n.includes("मिट्टी जाँच"))) && (
                    <div className="flex gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                      <AlertTriangle
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                        aria-hidden
                      />
                      <p className="text-xs font-medium leading-relaxed text-[var(--av-text-primary)]">
                        {plan.farmerTipHi ||
                          plan.guideNotes.find((n) => !n.includes("मिट्टी जाँच"))}
                      </p>
                    </div>
                  )}

                  <p className="text-center text-[10.5px] font-medium text-[var(--av-text-muted)]">
                    यह मात्रा मानक कृषि विश्वविद्यालयों की संस्तुतियों पर आधारित है।
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
        {/* THUMB-FRIENDLY BOTTOM SHEET MODAL (Crop & Acre Selection)   */}
        {/* ========================================================== */}
        <AnimatePresence>
          {showBottomSheet && slug && (
            <div className="fixed inset-0 z-50 flex items-end justify-center">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowBottomSheet(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Bottom Sheet Card */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="relative z-10 w-full max-w-lg rounded-t-[32px] border-t border-emerald-500/25 bg-[var(--av-surface)] p-5 shadow-2xl"
              >
                {/* Pull indicator */}
                <div className="mx-auto -mt-2 mb-4 h-1.5 w-12 rounded-full bg-[var(--av-border)]" />

                {/* Crop Selected Header */}
                <div className="flex items-center justify-between border-b border-[var(--av-border)] pb-3.5">
                  <div className="flex items-center gap-3">
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
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        फसल चुनी गई
                      </span>
                      <h2 className="text-lg font-black text-[var(--av-text-primary)]">
                        {cropHi}
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowBottomSheet(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--av-surface-inset)] text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Acre Input with Stepper */}
                <div className="mt-4">
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
                        autoFocus
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

                {/* Prompt: Mitti Janch Report Check (BEFORE CALCULATION) */}
                <div className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-3.5">
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
                        "flex-1 rounded-xl py-2 text-xs font-bold transition active:scale-95",
                        !hasSoilReport
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
                      )}
                    >
                      नहीं (मानक सलाह)
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasSoilReport(true)}
                      className={cn(
                        "flex-1 rounded-xl py-2 text-xs font-bold transition active:scale-95",
                        hasSoilReport
                          ? "bg-amber-600 text-white shadow-sm"
                          : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
                      )}
                    >
                      हाँ (रिपोर्ट दर्ज करें)
                    </button>
                  </div>

                  {hasSoilReport && (
                    <div className="mt-3 pt-3 border-t border-amber-500/20">
                      <SoilTestInputs value={soilTest} onChange={setSoilTest} />
                    </div>
                  )}
                </div>

                {/* Large Thumb-Zone CTA */}
                <button
                  type="button"
                  disabled={!canSeePlan}
                  onClick={handleViewPlan}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-900/30 transition active:scale-[0.98] disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>खाद योजना देखें</span>
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
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
        >
          <div className="mx-auto max-w-lg px-1 py-8 text-center text-sm text-[var(--av-text-muted)]">
            कैलकुलेटर खुल रहा है…
          </div>
        </Agriveda2Shell>
      }
    >
      <FertilizerCalculatorInner />
    </Suspense>
  );
}
