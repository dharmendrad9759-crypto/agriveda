"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navigateBack } from "@/lib/navigationTracker";
import {
  AlertTriangle,
  Apple,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CloudRain,
  Flower2,
  Info,
  Leaf,
  Plus,
  RotateCcw,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";
import { CROP_PROBLEM_CROPS, type CropProblemItem } from "@/data/crop-curative-problems";
import {
  GROWTH_STAGES,
  buildMixPlanFromProblems,
  planWithStickerToggle,
  evaluateTankMix,
  generateDynamicMixSteps,
  getProblemSpecificAlternatives,
  POPULAR_INSECTICIDES,
  POPULAR_FUNGICIDES,
  POPULAR_TONICS,
  SILICONE_STICKER,
  tankItems,
  type GrowthStageId,
  type MixMedicine,
  type MixPlan,
  type TankMixVerdict,
} from "@/data/mix-advisor/mix-plans";
import { fetchSprayWeatherFromSaved } from "@/lib/sprayWeatherApi";
import { buildSprayWindowAnalysis } from "@/lib/sprayWindow";
import { EASE_OUT } from "@/lib/motion/variants";

type StepId = "problem" | "weather" | "mix" | "guide";

const STEPS: { id: StepId; label: string; sub: string }[] = [
  { id: "problem", label: "फसल व समस्या", sub: "1. चयन" },
  { id: "weather", label: "मौसम सलाह", sub: "2. जाँच" },
  { id: "mix", label: "स्मार्ट टैंक-मिक्स", sub: "3. दवाएँ" },
  { id: "guide", label: "घोल बनाने की विधि", sub: "4. गाइड" },
];

const STAGE_ICON = {
  vegetative: Leaf,
  flowering: Flower2,
  fruiting: Apple,
} as const;

const MAX_PROBLEMS = 4;

function Stepper({ step }: { step: StepId }) {
  const idx = STEPS.findIndex((s) => s.id === step);
  return (
    <div className="mb-4 flex items-center justify-between gap-1 px-1">
      {STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.id} className="flex min-w-0 flex-1 items-center gap-1">
            <div className="flex min-w-0 flex-col items-center gap-0.5">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black transition-all",
                  done
                    ? "bg-emerald-600 text-white shadow-sm"
                    : active
                      ? "bg-emerald-600 text-white ring-4 ring-emerald-500/20 shadow-md"
                      : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "truncate text-[10px] font-bold",
                  active
                    ? "text-emerald-700 dark:text-emerald-400 font-extrabold"
                    : done
                      ? "text-[var(--av-text-primary)]"
                      : "text-[var(--av-text-muted)]"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mb-3.5 h-0.5 flex-1 rounded-full transition-colors",
                  i < idx ? "bg-emerald-500" : "bg-[var(--av-border)]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function MixAdvisorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [step, setStep] = useState<StepId>("problem");
  const [cropSlug, setCropSlug] = useState("tomato");
  const [stage, setStage] = useState<GrowthStageId>("fruiting");
  const [problemIds, setProblemIds] = useState<string[]>([]);
  const [meds, setMeds] = useState<MixMedicine[]>([]);
  const [plan, setPlan] = useState<MixPlan | null>(null);
  const [cropGridOpen, setCropGridOpen] = useState(false);

  // Synchronized browser history step navigation
  const goToStep = (nextStep: StepId) => {
    setStep(nextStep);
    if (typeof window !== "undefined") {
      window.history.pushState({ agrivedaMix: true, step: nextStep }, "");
    }
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.agrivedaMix && e.state.step) {
        setStep(e.state.step);
      } else {
        setStep("problem");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Single-step back navigation
  const handleBackStep = () => {
    if (step === "guide" || step === "mix" || step === "weather") {
      if (typeof window !== "undefined" && window.history.state?.agrivedaMix) {
        window.history.back();
      } else {
        if (step === "guide") setStep("mix");
        else if (step === "mix") setStep("weather");
        else if (step === "weather") setStep("problem");
      }
    } else {
      navigateBack({ router });
    }
  };

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [step]);

  // Restore step and mix state only if returning with step=guide or restore query
  useEffect(() => {
    try {
      const urlStep = searchParams?.get("step");
      const urlRestore = searchParams?.get("restore");
      if (urlStep === "guide" || urlRestore) {
        const saved = sessionStorage.getItem("agriveda_mix_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.cropSlug) setCropSlug(parsed.cropSlug);
          if (parsed.stage) setStage(parsed.stage);
          if (parsed.problemIds && Array.isArray(parsed.problemIds) && parsed.problemIds.length > 0) {
            setProblemIds(parsed.problemIds);
          }
          if (parsed.meds && Array.isArray(parsed.meds) && parsed.meds.length > 0) setMeds(parsed.meds);
          if (parsed.plan) setPlan(parsed.plan);
          if (urlStep === "guide" || parsed.step === "guide") {
            setStep("guide");
          }
        }
      }
    } catch {}
  }, [searchParams]);

  // Modal / drawer states
  const [pickSlot, setPickSlot] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addCategoryTab, setAddCategoryTab] = useState<"fungicide" | "insecticide" | "tonic">("insecticide");

  // Weather state
  const [weatherLine, setWeatherLine] = useState("मौसम लोड हो रहा है…");
  const [weatherBad, setWeatherBad] = useState(false);
  const [weatherBits, setWeatherBits] = useState<{
    place: string;
    temp: string;
    humidity: string;
  }>({ place: "आपका इलाका", temp: "—", humidity: "—" });

  const crop = useMemo(
    () => CROP_PROBLEM_CROPS.find((c) => c.slug === cropSlug) ?? CROP_PROBLEM_CROPS[0],
    [cropSlug]
  );

  const problems = crop?.problems ?? [];

  const selectedProblems = useMemo(
    () => problems.filter((p) => problemIds.includes(p.id)),
    [problems, problemIds]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const bundle = await fetchSprayWeatherFromSaved();
        if (cancelled || !bundle) {
          if (!cancelled) {
            setWeatherLine("मौसम नहीं मिला — स्थान डालें");
            setWeatherBad(false);
          }
          return;
        }
        const analysis = buildSprayWindowAnalysis(bundle.current, bundle.hourly);
        const cur = bundle.current;
        if (!cancelled) {
          setWeatherBits({
            place: bundle.location || "आपका इलाका",
            temp: cur?.temperatureC != null ? `${Math.round(cur.temperatureC)}°C` : "—",
            humidity: cur?.humidityPercent != null ? `${Math.round(cur.humidityPercent)}%` : "—",
          });
          const avoid = analysis.current.status === "AVOID";
          setWeatherBad(avoid);
          setWeatherLine(
            avoid
              ? analysis.current.reasonHi || "अभी तेज हवा/बारिश के कारण छिड़काव टालें"
              : analysis.current.reasonHi || "छिड़काव का मौसम अनुकूल है (हवा व नमी सामान्य)"
          );
        }
      } catch {
        if (!cancelled) setWeatherLine("मौसम अभी नहीं मिला");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleProblem = (id: string) => {
    setProblemIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_PROBLEMS) {
        showToast("आप अधिकतम 4 समस्याएँ चुन सकते हैं।", "error");
        return prev;
      }
      return [...prev, id];
    });
  };

  const runCheck = () => {
    if (!selectedProblems.length) return;
    const next = buildMixPlanFromProblems(cropSlug, selectedProblems);
    if (!next) return;
    setPlan(next);
    setMeds(next.medicines);
    goToStep("weather");
  };

  const goToMix = () => {
    if (!meds.length) return;
    goToStep("mix");
  };

  // Evaluate current compatibility
  const mixVerdict: TankMixVerdict = useMemo(() => {
    return evaluateTankMix(meds);
  }, [meds]);

  const isSafe = mixVerdict.status === "safe";
  const isCaution = mixVerdict.status === "caution";
  const isIncompatible = mixVerdict.status === "incompatible";

  // Change medicine in a slot
  const chooseForSlot = (slotIndex: number, newMed: MixMedicine) => {
    setMeds((prev) => {
      const next = [...prev];
      if (slotIndex < 0 || slotIndex >= next.length) return prev;
      next[slotIndex] = {
        ...newMed,
        targetProblemId: prev[slotIndex].targetProblemId,
        targetProblemHi: prev[slotIndex].targetProblemHi,
      };
      return next;
    });
    setPickSlot(null);
  };

  // Remove a medicine from the tank
  const removeMedicine = (index: number) => {
    if (meds.length <= 1) return;
    setMeds((prev) => prev.filter((_, i) => i !== index));
  };

  // Add an additional medicine to the tank
  const addMedicine = (med: MixMedicine) => {
    if (meds.some((m) => m.activeId === med.activeId)) {
      setShowAddModal(false);
      return;
    }
    setMeds((prev) => [...prev, med]);
    setShowAddModal(false);
  };

  // Selected slot medicine for alternative modal
  const activeSlotMed = pickSlot != null ? meds[pickSlot] : null;

  // Problem-specific alternatives strictly filtered to the problem assigned to this slot!
  const slotAlternatives = useMemo(() => {
    if (!activeSlotMed) return [];
    return getProblemSpecificAlternatives(cropSlug, activeSlotMed);
  }, [cropSlug, activeSlotMed]);

  // Replace incompatible pair with safe fallback
  const fixIncompatiblePair = () => {
    if (!mixVerdict.badPair) return;
    const [badA, badB] = mixVerdict.badPair;
    // If one is copper, swap copper for Mancozeb or Azoxystrobin
    setMeds((prev) => {
      return prev.map((m) => {
        if (m.activeId === badA.activeId && /copper/i.test(m.technical)) {
          return POPULAR_FUNGICIDES[0]; // Mancozeb
        }
        if (m.activeId === badB.activeId && /copper/i.test(m.technical)) {
          return POPULAR_FUNGICIDES[0]; // Mancozeb
        }
        if (m.activeId === badA.activeId && /sulphur/i.test(m.technical)) {
          return POPULAR_FUNGICIDES[4]; // Hexaconazole
        }
        if (m.activeId === badB.activeId && /sulphur/i.test(m.technical)) {
          return POPULAR_FUNGICIDES[4]; // Hexaconazole
        }
        return m;
      });
    });
  };

  const toggleSticker = () => {
    if (!plan) return;
    const next = planWithStickerToggle(plan, !plan.includeSticker);
    setPlan(next);
  };

  // Dynamic W-A-L-E steps based on current medicines
  const dynamicMixSteps = useMemo(() => {
    return generateDynamicMixSteps(meds, plan?.includeSticker ?? true);
  }, [meds, plan?.includeSticker]);

  const displayItems = plan ? tankItems(plan, meds) : meds;

  return (
    <AppShell
      variant="hub"
      title="दवा मिलाएँ (Tank Mix Advisor)"
      onBack={handleBackStep}
    >
      <div className="mx-auto max-w-xl space-y-4 px-2 pb-12">
        <Stepper step={step} />

        <AnimatePresence mode="wait">
          {/* ============================================================= */}
          {/* STEP 1: PROBLEM & CROP SELECTION */}
          {/* ============================================================= */}
          {step === "problem" && (
            <motion.div
              key="problem"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="space-y-4"
            >


              {/* Crop Selection Section - Collapsible to avoid long scrolling */}
              <div>
                <div className="flex items-center justify-between">
                  <p className={AV.sectionTitle}>1. फसल चुनें (Crop)</p>
                  <button
                    type="button"
                    onClick={() => setCropGridOpen((prev) => !prev)}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    {cropGridOpen ? "सूची समेटें ▴" : "सभी फसलें देखें ▾"}
                  </button>
                </div>

                {/* Selected Crop Compact Banner */}
                <div className="mt-2 flex items-center justify-between rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-3 shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/5 border border-emerald-600/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={crop.image} alt={crop.nameHi} className="h-full w-full object-cover" />
                    </span>
                    <div className="min-w-0">
                      <span className="block truncate text-[14px] font-black text-emerald-950 dark:text-emerald-100">
                        {crop.nameHi} <span className="text-[11px] font-medium text-[var(--av-text-muted)]">({crop.nameEn})</span>
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                        ✓ चयनित फसल
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCropGridOpen((prev) => !prev)}
                    className="shrink-0 rounded-xl border border-emerald-600/30 bg-[var(--av-surface)] px-3 py-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-200 transition hover:bg-emerald-500/10 active:scale-95 shadow-2xs"
                  >
                    {cropGridOpen ? "बंद करें ▴" : "फसल बदलें ▾"}
                  </button>
                </div>

                {/* Open Grid of all crops when toggled */}
                <AnimatePresence>
                  {cropGridOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 text-[11px] text-[var(--av-text-muted)]">
                        अपनी फसल पर टैप करें — चुनते ही पेज आगे बढ़ जाएगा:
                      </p>
                      <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
                        {CROP_PROBLEM_CROPS.map((c) => {
                          const active = c.slug === cropSlug;
                          return (
                            <button
                              key={c.slug}
                              type="button"
                              onClick={() => {
                                setCropSlug(c.slug);
                                setProblemIds([]); // Clear to avoid carrying over selections from other crop
                                setCropGridOpen(false);
                                setTimeout(() => {
                                  document.getElementById("growth-stage-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
                                }, 120);
                              }}
                              className={cn(
                                "relative flex flex-col items-center gap-1.5 rounded-2xl border p-2 text-center transition-all active:scale-[0.97]",
                                active
                                  ? "border-emerald-600 bg-emerald-500/15 ring-2 ring-emerald-500/40 shadow-sm"
                                  : "border-[var(--av-border)] bg-[var(--av-surface)] hover:border-emerald-500/30"
                              )}
                            >
                              {active && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
                                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                                </span>
                              )}
                              <span className="relative h-14 w-14 overflow-hidden rounded-xl bg-black/5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={c.image} alt={c.nameHi} className="h-full w-full object-cover" />
                              </span>
                              <div className="min-w-0">
                                <span
                                  className={cn(
                                    "block text-[13px] font-black leading-tight",
                                    active ? "text-emerald-950 dark:text-emerald-100" : "text-[var(--av-text-primary)]"
                                  )}
                                >
                                  {c.nameHi}
                                </span>
                                <span className="text-[10px] font-semibold text-[var(--av-text-muted)]">
                                  {c.nameEn}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Growth Stage Selection */}
              <div id="growth-stage-section">
                <p className={AV.sectionTitle}>2. फसल का चरण (Growth Stage)</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {GROWTH_STAGES.map((s) => {
                    const Icon = STAGE_ICON[s.id];
                    const active = stage === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setStage(s.id)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-center transition active:scale-[0.98]",
                          active
                            ? "border-emerald-600 bg-emerald-500/15 ring-2 ring-emerald-500/30"
                            : "border-[var(--av-border)] bg-[var(--av-surface)] hover:border-emerald-500/30"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            active ? "text-emerald-700 dark:text-emerald-300" : "text-[var(--av-text-muted)]"
                          )}
                        />
                        <span className="text-[12px] font-bold text-[var(--av-text-primary)] leading-tight">
                          {s.labelHi}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Problems Selection Grid */}
              <div>
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className={AV.sectionTitle}>3. समस्याएँ चुनें (कीट व बीमारियाँ)</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-600/15 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800 dark:text-emerald-200">
                    {problemIds.length}/{MAX_PROBLEMS} चुनी
                  </span>
                </div>

                {/* Stable Selection Chips */}
                {selectedProblems.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 shadow-2xs">
                    <span className="text-[11px] font-black text-emerald-950 dark:text-emerald-100 mr-1">
                      चुने गए रोग/कीट:
                    </span>
                    {selectedProblems.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-xs"
                      >
                        ✓ {p.nameHi}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleProblem(p.id);
                          }}
                          className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/30 hover:bg-white/50 text-white transition active:scale-95"
                          title="हटाएँ"
                        >
                          <X className="h-2.5 w-2.5 stroke-[3]" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                  {problems.map((p) => {
                    const active = problemIds.includes(p.id);
                    const isFungus = p.tagHi.includes("फफूंद") || p.tagHi.includes("फंगस");
                    const isPest = p.tagHi.includes("कीट") || p.tagHi.includes("कीड़ा");

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProblem(p.id)}
                        className={cn(
                          "relative overflow-hidden rounded-2xl border text-left transition-all active:scale-[0.98]",
                          active
                            ? "border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-500/5 shadow-md"
                            : "border-[var(--av-border)] bg-[var(--av-surface)] hover:border-emerald-500/30"
                        )}
                      >
                        <span className="relative block h-24 w-full bg-black/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt={p.nameHi} className="h-full w-full object-cover" />
                          {active && (
                            <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
                              <Check className="h-4 w-4 stroke-[3]" />
                            </span>
                          )}
                          <span
                            className={cn(
                              "absolute bottom-1.5 left-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm",
                              isFungus ? "bg-amber-700/90" : isPest ? "bg-sky-700/90" : "bg-purple-700/90"
                            )}
                          >
                            {p.tagHi}
                          </span>
                        </span>
                        <span className="block px-3 py-2.5">
                          <span className="line-clamp-1 text-[13px] font-black text-[var(--av-text-primary)]">
                            {p.nameHi}
                          </span>
                          <span className="line-clamp-1 text-[10px] font-medium text-[var(--av-text-muted)]">
                            {p.nameEn}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Summary Pill */}
                {selectedProblems.length > 0 && (
                  <div className="mt-3 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 p-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                      <div className="text-[12px] leading-snug">
                        <span className="font-bold text-emerald-950 dark:text-emerald-100">
                          चुनी गई समस्याएँ:{" "}
                        </span>
                        <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                          {selectedProblems.map((p) => p.nameHi).join(" + ")}
                        </span>
                        <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">
                          💡 चुनी गई समस्याओं के लिए सबसे असरदार व सुरक्षित दवाएँ अपने आप सुझाई जाएँगी।
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={!problemIds.length}
                onClick={runCheck}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-[15px] font-black text-white shadow-lg shadow-emerald-600/25 transition active:scale-[0.98] disabled:opacity-40"
              >
                आगे बढ़ें: स्मार्ट मिक्स जाँच
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>
          )}

          {/* ============================================================= */}
          {/* STEP 2: WEATHER CHECK */}
          {/* ============================================================= */}
          {step === "weather" && (
            <motion.div
              key="weather"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="space-y-4"
            >
              <div
                className={cn(
                  "rounded-2xl border p-4 shadow-sm",
                  weatherBad
                    ? "border-rose-500/35 bg-rose-500/10 text-rose-950 dark:text-rose-100"
                    : "border-emerald-500/30 bg-emerald-500/10"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      weatherBad ? "bg-rose-500/20 text-rose-600" : "bg-emerald-500/20 text-emerald-600"
                    )}
                  >
                    <CloudRain className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[16px] font-black text-[var(--av-text-primary)]">
                      {weatherBad ? "सावधानी: आज छिड़काव टालें" : "मौसम अनुकूल है — स्प्रे कर सकते हैं"}
                    </p>
                    <p className="mt-1 text-[13px] font-semibold text-[var(--av-text-secondary)]">
                      {weatherBits.place} · {weatherBits.temp} · नमी {weatherBits.humidity}
                    </p>
                    <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-[var(--av-text-muted)]">
                      {weatherLine}
                    </p>
                  </div>
                </div>
              </div>

              {selectedProblems.length > 0 && (
                <div className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3">
                  <p className="text-[11px] font-bold text-[var(--av-text-muted)]">
                    आपकी फसल व चुनी गई समस्याएँ:
                  </p>
                  <p className="mt-1 text-[13px] font-extrabold text-[var(--av-text-primary)]">
                    {crop.nameHi} ({crop.nameEn}) — {selectedProblems.map((p) => p.nameHi).join(" · ")}
                  </p>
                </div>
              )}

              <div>
                <p className={AV.sectionTitle}>छिड़काव का सबसे अच्छा समय</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { t: "सुबह (Morning)", d: "7–11 बजे", best: !weatherBad, note: "उत्तम समय" },
                    { t: "दोपहर (Noon)", d: "12–3 बजे", best: false, note: "धूप में न करें" },
                    { t: "शाम (Evening)", d: "4–7 बजे", best: !weatherBad, note: "सर्वोत्तम समय" },
                  ].map((w) => (
                    <div
                      key={w.t}
                      className={cn(
                        "rounded-2xl border p-3 text-center transition",
                        w.best
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
                          : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)]"
                      )}
                    >
                      <p className="text-[12px] font-black">{w.t}</p>
                      <p className="text-[10px] font-medium text-[var(--av-text-muted)]">{w.d}</p>
                      <span
                        className={cn(
                          "mt-1.5 inline-block rounded-md px-1.5 py-0.5 text-[9px] font-extrabold",
                          w.best
                            ? "bg-emerald-600 text-white"
                            : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
                        )}
                      >
                        {w.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-[var(--av-border)] py-3 text-[14px] font-bold active:scale-[0.98]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  वापस
                </button>
                <button
                  type="button"
                  onClick={goToMix}
                  className="flex flex-[1.6] items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-[15px] font-black text-white shadow-md shadow-emerald-600/25 active:scale-[0.98]"
                >
                  आगे: दवाएँ देखें
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ============================================================= */}
          {/* STEP 3: SMART TANK MIX SCREEN (ICAR AUTO-RECOMMENDATION) */}
          {/* ============================================================= */}
          {step === "mix" && meds.length > 0 && plan && (
            <motion.div
              key="mix"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="space-y-4"
            >
              {/* Traffic Light Compatibility Alert System */}
              <div
                className={cn(
                  "rounded-2xl border p-4 shadow-sm transition-all",
                  isSafe &&
                    "border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-950 dark:text-emerald-100",
                  isCaution &&
                    "border-amber-500/40 bg-gradient-to-r from-amber-500/15 to-yellow-500/10 text-amber-950 dark:text-amber-100",
                  isIncompatible &&
                    "border-rose-500/60 bg-gradient-to-r from-rose-500/20 to-red-600/15 text-rose-950 dark:text-rose-100 animate-pulse-subtle"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                      isSafe && "bg-emerald-600 text-white",
                      isCaution && "bg-amber-500 text-white",
                      isIncompatible && "bg-rose-600 text-white"
                    )}
                  >
                    {isSafe && <ShieldCheck className="h-6 w-6 stroke-[2.5]" />}
                    {isCaution && <AlertTriangle className="h-6 w-6 stroke-[2.5]" />}
                    {isIncompatible && <ShieldAlert className="h-6 w-6 stroke-[2.5]" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-md px-2.5 py-0.5 text-[10.5px] font-extrabold tracking-wide text-white",
                          isSafe && "bg-emerald-700",
                          isCaution && "bg-amber-600",
                          isIncompatible && "bg-rose-700"
                        )}
                      >
                        {mixVerdict.badgeHi}
                      </span>
                    </div>

                    <p className="mt-1 text-[15px] font-black leading-snug">
                      {mixVerdict.title}
                    </p>

                    <p className="mt-1 text-[12px] font-semibold leading-relaxed opacity-95">
                      {mixVerdict.messageHi}
                    </p>

                    {/* Conflict remedy action if incompatible */}
                    {isIncompatible && (
                      <div className="mt-3 rounded-xl bg-white/40 dark:bg-black/30 p-2.5">
                        <p className="text-[11px] font-extrabold text-rose-900 dark:text-rose-200">
                          💡 समाधान: {mixVerdict.remedyHi || "असंगत रसायनों को अलग-अलग छिड़कें।"}
                        </p>
                        <button
                          type="button"
                          onClick={fixIncompatiblePair}
                          className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-[11px] font-bold text-white shadow transition hover:bg-rose-700 active:scale-[0.98]"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          सुरक्षित विकल्प से स्वतः बदलें
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Medicine Tank Slot Cards */}
              <div>
                <p className={AV.sectionTitle}>टैंक में दवाएँ (Tank Mix Items)</p>

                <div className="mt-2.5 space-y-3">
                  {meds.map((m, idx) => {
                    return (
                      <div
                        key={`${m.activeId}-${idx}`}
                        className="relative rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm transition hover:border-emerald-500/40"
                      >
                        {/* Header Badge */}
                        <div className="flex items-center justify-between gap-2 border-b border-[var(--av-border)]/60 pb-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded-md bg-emerald-600/15 px-2 py-0.5 text-[10px] font-black text-emerald-900 dark:text-emerald-200">
                              दवा {idx + 1}
                            </span>
                            {m.targetProblemHi && (
                              <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:text-amber-200">
                                🎯 {m.targetProblemHi} हेतु
                              </span>
                            )}
                          </div>

                          {/* Delete Slot Button if > 1 med */}
                          {meds.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMedicine(idx)}
                              className="rounded-lg p-1 text-[var(--av-text-muted)] hover:bg-rose-500/10 hover:text-rose-600 transition"
                              title="यह दवा हटाएँ"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        {/* Technical Name Prominent Heading */}
                        <div className="mt-2">
                          <p className="text-[15px] font-black text-emerald-950 dark:text-emerald-100 tracking-tight">
                            {m.technical}
                          </p>
                          <p className="text-[12px] font-bold text-[var(--av-text-secondary)]">
                            {m.nameHi}
                          </p>
                          {m.brands && m.brands.length > 0 && (
                            <p className="text-[10px] font-medium text-[var(--av-text-muted)]">
                              बाजार के लोकप्रिय ब्रांड: {m.brands.slice(0, 3).join(", ")}
                            </p>
                          )}
                        </div>

                        {/* Doses Grid */}
                        <div className="mt-2.5 grid grid-cols-2 gap-2 rounded-xl bg-[var(--av-surface-inset)] p-2">
                          <div>
                            <span className="block text-[10px] font-semibold text-[var(--av-text-muted)]">
                              💧 1 लीटर पानी में खुराक:
                            </span>
                            <span className="text-[12px] font-black text-emerald-800 dark:text-emerald-300">
                              {m.dosePerLiter || m.doseHi.split("(")[0]}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-semibold text-[var(--av-text-muted)]">
                              🌾 1 एकड़ हेतु कुल दवा:
                            </span>
                            <span className="text-[12px] font-black text-emerald-800 dark:text-emerald-300">
                              {m.dosePerAcre || "200 L पानी में स्प्रे"}
                            </span>
                          </div>
                        </div>

                        {/* Formulation and Action Bar */}
                        <div className="mt-3 flex items-center justify-between gap-2 pt-1 border-t border-[var(--av-border)]/40">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--av-text-muted)]">
                            फॉर्मूलेशन:{" "}
                            <span className="font-extrabold text-[var(--av-text-primary)]">
                              {m.formCode} ({m.formHi})
                            </span>
                          </span>

                          <button
                            type="button"
                            onClick={() => setPickSlot(idx)}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600/10 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-600/20 transition active:scale-[0.98]"
                          >
                            दवा बदलें (Change)
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Extra Medicine Button (Tank Mix) */}
                  {meds.length < 3 && (
                    <button
                      type="button"
                      onClick={() => setShowAddModal(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 py-3 text-[13px] font-extrabold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-500/10 transition active:scale-[0.98]"
                    >
                      <Plus className="h-4 w-4 stroke-[3]" />
                      + एक और दवा जोड़ें (कीटनाशक / फफूंदनाशक / टॉनिक)
                    </button>
                  )}
                </div>
              </div>

              {/* Silicone Sticker Section */}
              <button
                type="button"
                onClick={toggleSticker}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98]",
                  plan.includeSticker
                    ? "border-sky-500/40 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/40 dark:to-blue-950/30"
                    : "border-[var(--av-border)] bg-[var(--av-surface)]"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-sky-600/20 px-2 py-0.5 text-[10px] font-black text-sky-800 dark:text-sky-200">
                      एडजुवेंट (चिपको)
                    </span>
                    <span className="text-[13px] font-extrabold text-[var(--av-text-primary)]">
                      सिलिकॉन सुपर स्प्रेडर स्टिकर
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-[var(--av-text-muted)]">
                    दवा को पत्तों पर तुरंत फैलाता है और बारिश में धुलने से रोकता है (5–10 मिली/पंप)।
                  </p>
                </div>
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all",
                    plan.includeSticker
                      ? "bg-sky-600 text-white shadow"
                      : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
                  )}
                >
                  {plan.includeSticker ? <Check className="h-4 w-4 stroke-[3]" /> : null}
                </span>
              </button>

              {/* Water Volume & Nozzle Hint */}
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3">
                <div>
                  <span className="block text-[10px] font-semibold text-[var(--av-text-muted)]">
                    पानी की मात्रा प्रति एकड़:
                  </span>
                  <span className="text-[12px] font-black text-[var(--av-text-primary)]">
                    {plan.waterHi}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-[var(--av-text-muted)]">
                    नोजल की सिफारिश:
                  </span>
                  <span className="text-[12px] font-black text-[var(--av-text-primary)]">
                    {plan.nozzleHi}
                  </span>
                </div>
              </div>

              {/* Bottom Nav Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-[var(--av-border)] py-3 text-[14px] font-bold active:scale-[0.98]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  वापस
                </button>
                <button
                  type="button"
                  disabled={isIncompatible}
                  onClick={() => goToStep("guide")}
                  className="flex flex-[1.6] items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-[15px] font-black text-white shadow-md shadow-emerald-600/25 active:scale-[0.98] disabled:opacity-40"
                >
                  अगला: घोल विधि (Guide)
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* ============================================================= */}
              {/* MODAL 1: PICK ALTERNATIVE FOR SLOT */}
              {/* ============================================================= */}
              <AnimatePresence>
                {pickSlot != null && meds[pickSlot] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-2 sm:items-center"
                    onClick={() => setPickSlot(null)}
                  >
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 24, opacity: 0 }}
                      transition={{ duration: 0.22, ease: EASE_OUT }}
                      className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-3xl bg-[var(--av-surface)] shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between border-b border-[var(--av-border)] px-4 py-3.5">
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="rounded-md bg-emerald-600/15 px-2 py-0.5 text-[10px] font-black text-emerald-900 dark:text-emerald-200">
                              दवा {pickSlot !== null ? pickSlot + 1 : ""}
                            </span>
                            {activeSlotMed?.targetProblemHi && (
                              <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-black text-amber-900 dark:text-amber-200">
                                🎯 {activeSlotMed.targetProblemHi}
                              </span>
                            )}
                          </div>
                          <p className="text-[15px] font-black text-[var(--av-text-primary)] leading-tight">
                            {activeSlotMed?.targetProblemHi
                              ? `${activeSlotMed.targetProblemHi} हेतु स्वीकृत दवाएँ`
                              : "वैकल्पिक दवा चुनें"}
                          </p>
                          <p className="mt-0.5 text-[11px] font-medium text-[var(--av-text-muted)]">
                            {activeSlotMed?.targetProblemHi
                              ? `केवल "${activeSlotMed.targetProblemHi}" हेतु अनुशंसित दवाएँ:`
                              : "अन्य अनुशंसित सुरक्षित दवाएँ:"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPickSlot(null)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--av-surface-inset)]"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="max-h-[60vh] space-y-2 overflow-y-auto p-3">
                        {slotAlternatives.map((opt) => {
                          const selected = activeSlotMed?.technical === opt.technical;
                          return (
                            <button
                              key={opt.technical}
                              type="button"
                              onClick={() => chooseForSlot(pickSlot, opt)}
                              className={cn(
                                "flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.98]",
                                selected
                                  ? "border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-500/25 shadow-sm"
                                  : "border-[var(--av-border)] bg-[var(--av-surface)] hover:border-emerald-500/30"
                              )}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                  <span className="rounded-md bg-emerald-600/15 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-200">
                                    {opt.formCode} {opt.formHi ? `(${opt.formHi})` : ""}
                                  </span>
                                </div>

                                {/* English Technical Formulation Name */}
                                <p className="text-[14px] font-black text-[var(--av-text-primary)] leading-snug">
                                  {opt.technical}
                                </p>

                                {/* Hindi Name & Brands */}
                                <p className="mt-0.5 text-[12px] font-bold text-[var(--av-text-secondary)]">
                                  {opt.nameHi}
                                </p>
                                {opt.brands && opt.brands.length > 0 && (
                                  <p className="text-[10px] font-medium text-[var(--av-text-muted)]">
                                    बाजार के ब्रांड: {opt.brands.slice(0, 3).join(", ")}
                                  </p>
                                )}

                                {/* Doses */}
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-black text-emerald-800 dark:text-emerald-300">
                                  <span>💧 1L पानी: {opt.dosePerLiter || opt.doseHi.split("(")[0]}</span>
                                  <span>•</span>
                                  <span>🌾 1 एकड़: {opt.dosePerAcre || "200L पानी"}</span>
                                </div>

                                {opt.safetyHi && (
                                  <p className="mt-1.5 text-[10px] text-[var(--av-text-muted)] italic leading-tight">
                                    {opt.safetyHi}
                                  </p>
                                )}
                              </div>

                              {selected ? (
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm mt-1">
                                  <Check className="h-4 w-4 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="rounded-lg bg-emerald-600/10 px-2 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-200 mt-1">
                                  चुनें
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ============================================================= */}
              {/* MODAL 2: ADD EXTRA MEDICINE MODAL */}
              {/* ============================================================= */}
              <AnimatePresence>
                {showAddModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-2 sm:items-center"
                    onClick={() => setShowAddModal(false)}
                  >
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 24, opacity: 0 }}
                      transition={{ duration: 0.22, ease: EASE_OUT }}
                      className="max-h-[82vh] w-full max-w-lg overflow-hidden rounded-3xl bg-[var(--av-surface)] shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between border-b border-[var(--av-border)] px-4 py-3.5">
                        <div>
                          <p className="text-[15px] font-black text-[var(--av-text-primary)]">
                            टैंक में नई दवा जोड़ें
                          </p>
                          <p className="text-[11px] font-medium text-[var(--av-text-muted)]">
                            कीटनाशक, फफूंदनाशक या टॉनिक चुनें:
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddModal(false)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--av-surface-inset)]"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Category Switcher Tabs */}
                      <div className="flex border-b border-[var(--av-border)] px-2 pt-2 bg-[var(--av-surface-inset)]/50">
                        {[
                          { id: "insecticide", label: "कीटनाशक (Insecticides)" },
                          { id: "fungicide", label: "फफूंदनाशक (Fungicides)" },
                          { id: "tonic", label: "टॉनिक/NPK (Tonics)" },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setAddCategoryTab(t.id as any)}
                            className={cn(
                              "flex-1 py-2 text-[12px] font-black border-b-2 transition-all",
                              addCategoryTab === t.id
                                ? "border-emerald-600 text-emerald-700 dark:text-emerald-300"
                                : "border-transparent text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)]"
                            )}
                          >
                            {t.label.split(" ")[0]}
                          </button>
                        ))}
                      </div>

                      {/* Medicine List for Selected Category */}
                      <div className="max-h-[55vh] space-y-2 overflow-y-auto p-3">
                        {(addCategoryTab === "insecticide"
                          ? POPULAR_INSECTICIDES
                          : addCategoryTab === "fungicide"
                            ? POPULAR_FUNGICIDES
                            : POPULAR_TONICS
                        ).map((med) => {
                          const alreadyInTank = meds.some((m) => m.activeId === med.activeId);
                          return (
                            <button
                              key={med.technical}
                              type="button"
                              disabled={alreadyInTank}
                              onClick={() => addMedicine(med)}
                              className={cn(
                                "flex w-full items-start justify-between rounded-2xl border p-3 text-left transition active:scale-[0.98]",
                                alreadyInTank
                                  ? "border-[var(--av-border)] opacity-40 cursor-not-allowed"
                                  : "border-[var(--av-border)] hover:border-emerald-500/40 bg-[var(--av-surface)]"
                              )}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="rounded-md bg-emerald-600/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:text-emerald-200">
                                    {med.formCode}
                                  </span>
                                  <span className="text-[13px] font-black text-[var(--av-text-primary)]">
                                    {med.technical}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-[12px] font-bold text-[var(--av-text-secondary)]">
                                  {med.nameHi}
                                </p>
                                <p className="mt-1 text-[11px] font-black text-emerald-800 dark:text-emerald-300">
                                  {med.doseHi}
                                </p>
                              </div>

                              <span className="rounded-xl bg-emerald-600 px-2.5 py-1 text-[11px] font-black text-white shadow-sm">
                                + जोड़ें
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ============================================================= */}
          {/* STEP 4: DYNAMIC W-A-L-E MIXING ORDER GUIDE */}
          {/* ============================================================= */}
          {step === "guide" && meds.length > 0 && plan && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="space-y-4"
            >
              {/* Header Visual Banner */}
              <div className="relative overflow-hidden rounded-2xl shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/jobs/job-spray.jpg"
                  alt="Spray Method"
                  className="h-36 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
                    W-A-L-E वैज्ञानिक विधि
                  </span>
                  <p className="mt-1 text-[16px] font-black leading-tight">
                    टैंक में सही क्रम से घोल बनाने की विधि
                  </p>
                  <p className="text-[11px] text-white/90">
                    क्रम से मिलाने पर दवा कभी नहीं फटती और 100% असर देती है
                  </p>
                </div>
              </div>

              {/* Dynamic W-A-L-E Step Cards */}
              <div className="space-y-2.5">
                {dynamicMixSteps.map((s) => (
                  <div
                    key={s.stepNo}
                    className="flex gap-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-[13px] font-black text-white shadow-sm">
                      {s.stepNo}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-200">
                          {s.badgeHi}
                        </span>
                        <p className="text-[13px] font-black text-[var(--av-text-primary)]">
                          {s.titleHi}
                        </p>
                      </div>
                      <p className="mt-1 text-[12px] font-medium leading-relaxed text-[var(--av-text-secondary)]">
                        {s.descHi}
                      </p>
                      {s.items && s.items.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {s.items.map((it, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-lg bg-[var(--av-surface-inset)] border border-[var(--av-border)] px-2 py-0.5 text-[11px] font-bold text-[var(--av-text-primary)]"
                            >
                              🧪 {it}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Complete Spray & Dose Summary Table */}
              <div className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-sm">
                <div className="bg-emerald-600 px-3.5 py-2.5 text-white">
                  <p className="text-[13px] font-black">
                    खुराक व स्प्रे सारणी (Dosage Table)
                  </p>
                  <p className="text-[10px] text-emerald-100 font-semibold">
                    1 एकड़ खेत के लिए गणना:
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[12px]">
                    <thead className="border-b border-[var(--av-border)] bg-[var(--av-surface-inset)]">
                      <tr>
                        <th className="px-3 py-2 font-bold text-[var(--av-text-secondary)]">दवा</th>
                        <th className="px-3 py-2 font-bold text-[var(--av-text-secondary)]">1L पानी</th>
                        <th className="px-3 py-2 font-bold text-[var(--av-text-secondary)]">1 एकड़ खुराक</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--av-border)]">
                      {displayItems.map((m) => {
                        const brand = !m.isAdjuvant
                          ? m.brandHi || (m.brands && m.brands.length > 0 ? m.brands[0].split("(")[0].trim() : null)
                          : null;
                        return (
                          <tr key={m.technical}>
                            <td className="px-3 py-2.5">
                              <span className="block font-black text-[var(--av-text-primary)]">
                                {m.isAdjuvant ? m.nameHi : m.technical}
                              </span>
                              {brand && (
                                <span className="inline-block mt-0.5 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                                  प्रसिद्ध ब्रांड: {brand}
                                </span>
                              )}
                              {!brand && !m.isAdjuvant && m.targetProblemHi && (
                                <span className="text-[10px] font-semibold text-[var(--av-text-muted)]">
                                  {m.targetProblemHi}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2.5 font-bold text-emerald-800 dark:text-emerald-300">
                              {m.dosePerLiter || "—"}
                            </td>
                            <td className="px-3 py-2.5 font-black text-emerald-800 dark:text-emerald-300">
                              {m.dosePerAcre || m.doseHi}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-emerald-500/8 font-bold">
                        <td className="px-3 py-2 text-emerald-950 dark:text-emerald-200">
                          🚰 कुल पानी की मात्रा
                        </td>
                        <td colSpan={2} className="px-3 py-2 text-emerald-900 dark:text-emerald-300 font-black">
                          {plan.waterHi}
                        </td>
                      </tr>
                      <tr className="bg-[var(--av-surface-inset)] font-bold">
                        <td className="px-3 py-2 text-[var(--av-text-secondary)]">
                          🎯 नोजल प्रकार
                        </td>
                        <td colSpan={2} className="px-3 py-2 text-[var(--av-text-primary)] font-black">
                          {plan.nozzleHi}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Safety Badges & PHI Interval */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3">
                  <p className="text-[11px] font-extrabold text-amber-900 dark:text-amber-100">
                    सुरक्षा निर्देश
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-amber-950/80 dark:text-amber-50/80 leading-snug">
                    मास्क · रबर दस्ताने · हवा की दिशा में स्प्रे · खाली डिब्बा नष्ट करें
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3">
                  <p className="text-[11px] font-extrabold text-sky-900 dark:text-sky-100">
                    तुड़ाई पूर्व प्रतीक्षा काल (PHI)
                  </p>
                  <p className="mt-1 text-[18px] font-black text-sky-800 dark:text-sky-200">
                    {plan.phiDays} दिन
                  </p>
                  <p className="text-[9px] font-medium text-sky-900/80 dark:text-sky-300">
                    स्प्रे के इतने दिन बाद ही फल/सब्जी तोड़ें
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.setItem(
                      "agriveda_mix_state",
                      JSON.stringify({
                        cropSlug,
                        stage,
                        problemIds,
                        meds,
                        plan,
                        step: "guide",
                      })
                    );
                  } catch {}
                  const stageObj = GROWTH_STAGES.find((s) => s.id === stage);
                  const stageLabel = stageObj ? stageObj.labelHi : stage;
                  const problemLabel = selectedProblems.map((p) => p.nameHi).join(", ");
                  const medNames = meds.map((m) => m.technical).join(" + ");
                  const doseLabel = meds.map((m) => m.dosePerAcre || m.doseHi).join(" + ");
                  router.push(
                    `/spray-rotation/log?crop=${encodeURIComponent(cropSlug)}&stage=${encodeURIComponent(
                      stageLabel
                    )}&problem=${encodeURIComponent(problemLabel)}&med=${encodeURIComponent(
                      medNames
                    )}&dose=${encodeURIComponent(doseLabel)}&from=mix-advisor`
                  );
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-[15px] font-black text-white shadow-lg shadow-emerald-600/25 active:scale-[0.98]"
              >
                <CheckCircle2 className="h-5 w-5" />
                छिड़काव डायरी में रिकॉर्ड करें
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-[var(--av-border)] py-2.5 text-[13px] font-bold active:scale-[0.98]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  वापस
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.share) {
                      const names = displayItems.map((m) => m.technical).join(" + ");
                      void navigator.share({
                        title: `${crop.nameHi} टैंक-मिक्स गाइड — AgriVeda`,
                        text: `AgriVeda वैज्ञानिक टैंक-मिक्स:\nफसल: ${crop.nameHi}\nदवाएँ: ${names}\nपानी: ${plan.waterHi}`,
                      });
                    }
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-[var(--av-border)] py-2.5 text-[13px] font-bold active:scale-[0.98]"
                >
                  <Share2 className="h-4 w-4" />
                  किसान मित्रों को शेयर करें
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}

export default function MixAdvisorClient() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-sm font-bold text-emerald-800">लोड हो रहा है...</div>}>
      <MixAdvisorInner />
    </Suspense>
  );
}
