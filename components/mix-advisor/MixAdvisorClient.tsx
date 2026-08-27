"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Leaf,
  Play,
  Share2,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";
import { CROP_PROBLEM_CROPS } from "@/data/crop-curative-problems";
import {
  GROWTH_STAGES,
  buildMixPlanFromProblems,
  planWithStickerToggle,
  tankItems,
  type GrowthStageId,
  type MixMedicine,
  type MixPlan,
} from "@/data/mix-advisor/mix-plans";
import { checkTankMixByActives } from "@/lib/tankMixCompatibility";
import { fetchSprayWeatherFromSaved } from "@/lib/sprayWeatherApi";
import { buildSprayWindowAnalysis } from "@/lib/sprayWindow";
import { EASE_OUT } from "@/lib/motion/variants";

type StepId = "problem" | "weather" | "mix" | "guide";

const STEPS: { id: StepId; label: string }[] = [
  { id: "problem", label: "समस्या" },
  { id: "weather", label: "मौसम" },
  { id: "mix", label: "मिक्स" },
  { id: "guide", label: "गाइड" },
];

const STAGE_ICON = {
  vegetative: Leaf,
  flowering: Flower2,
  fruiting: Apple,
} as const;

const MAX_PROBLEMS = 3;

function Stepper({ step }: { step: StepId }) {
  const idx = STEPS.findIndex((s) => s.id === step);
  return (
    <div className="mb-4 flex items-center justify-between gap-1 px-0.5">
      {STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.id} className="flex min-w-0 flex-1 items-center gap-1">
            <div className="flex min-w-0 flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold",
                  done || active
                    ? "bg-emerald-600 text-white"
                    : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "truncate text-[10px] font-semibold",
                  active ? "text-emerald-700" : "text-[var(--av-text-muted)]"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mb-4 h-0.5 flex-1 rounded-full",
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

function MedCard({
  med,
  onChoose,
}: {
  med: MixMedicine;
  onChoose?: () => void;
}) {
  const sticker = Boolean(med.isAdjuvant);
  const inner = (
    <>
      <div className="flex items-start justify-between gap-1">
        <p
          className={cn(
            "text-[11px] font-bold",
            sticker
              ? "text-sky-700 dark:text-sky-300"
              : "text-emerald-700 dark:text-emerald-300"
          )}
        >
          {sticker ? "स्टिकर" : "दवा"}
        </p>
        {!sticker && onChoose ? (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-600/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:text-emerald-200">
            चुनें
            <ChevronDown className="h-3 w-3" />
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-[14px] font-extrabold leading-snug text-[var(--av-text-primary)]">
        {med.nameHi}
      </p>
      <p className="text-[11px] font-semibold text-[var(--av-text-muted)]">{med.formHi}</p>
      <p
        className={cn(
          "mt-2 text-[13px] font-black",
          sticker
            ? "text-sky-800 dark:text-sky-200"
            : "text-emerald-800 dark:text-emerald-200"
        )}
      >
        {med.doseHi}
      </p>
    </>
  );

  const className = cn(
    "relative w-full overflow-hidden rounded-2xl border p-3 text-left transition",
    sticker
      ? "border-sky-500/30 bg-gradient-to-b from-sky-50 to-white dark:from-sky-950/40 dark:to-[var(--av-surface)]"
      : "border-emerald-500/20 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/40 dark:to-[var(--av-surface)]",
    onChoose && !sticker && "active:scale-[0.98]"
  );

  if (onChoose && !sticker) {
    return (
      <button type="button" onClick={onChoose} className={className}>
        {inner}
      </button>
    );
  }

  return <div className={className}>{inner}</div>;
}

function evaluateMixSafe(meds: MixMedicine[]): boolean {
  const chems = meds.filter((m) => !m.isAdjuvant);
  if (chems.length < 2) return true;
  return (
    checkTankMixByActives(chems[0].activeId, chems[1].activeId, "insecticide+fungicide")
      .status === "safe"
  );
}

export default function MixAdvisorClient() {
  const router = useRouter();
  const [step, setStep] = useState<StepId>("problem");
  const [cropSlug, setCropSlug] = useState("tomato");
  const [stage, setStage] = useState<GrowthStageId>("fruiting");
  /** Multi-select — कीट + फफूंद एक साथ */
  const [problemIds, setProblemIds] = useState<string[]>(["early-blight", "fruit-borer"]);
  const [meds, setMeds] = useState<MixMedicine[]>([]);
  const [plan, setPlan] = useState<MixPlan | null>(null);
  const [showUnsafe, setShowUnsafe] = useState(false);
  /** Which medicine slot is being chosen (index into meds) */
  const [pickSlot, setPickSlot] = useState<number | null>(null);
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
            setWeatherLine("मौसम नहीं मिला — लोकेशन सेट करें");
            setWeatherBad(false);
          }
          return;
        }
        const analysis = buildSprayWindowAnalysis(bundle.current, bundle.hourly);
        const cur = bundle.current;
        if (!cancelled) {
          setWeatherBits({
            place: bundle.location || "आपका इलाका",
            temp:
              cur?.temperatureC != null ? `${Math.round(cur.temperatureC)}°C` : "—",
            humidity:
              cur?.humidityPercent != null
                ? `${Math.round(cur.humidityPercent)}%`
                : "—",
          });
          const avoid = analysis.current.status === "AVOID";
          setWeatherBad(avoid);
          setWeatherLine(
            avoid
              ? analysis.current.reasonHi || "अभी छिड़काव न करें"
              : analysis.current.reasonHi || "छिड़काव का समय ठीक लग रहा है"
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

  useEffect(() => {
    const valid = problemIds.filter((id) => problems.some((p) => p.id === id));
    if (valid.length === problemIds.length && valid.length > 0) return;
    const first = problems[0];
    const second = problems.find((p) => p.tagHi.includes("कीट")) ?? problems[1];
    if (first && second && first.id !== second.id) {
      setProblemIds([first.id, second.id]);
    } else if (first) {
      setProblemIds([first.id]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-seed when crop's problem list changes
  }, [cropSlug, problems]);

  const toggleProblem = (id: string) => {
    setProblemIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_PROBLEMS) {
        return [...prev.slice(1), id];
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
    setStep("weather");
  };

  const goToMix = () => {
    if (!meds.length) return;
    const safe = evaluateMixSafe(meds);
    setShowUnsafe(!safe);
    setStep("mix");
  };

  const applySafeFallback = () => {
    if (!plan?.safeFallback?.length) {
      setShowUnsafe(false);
      return;
    }
    setMeds(plan.safeFallback);
    setShowUnsafe(false);
  };

  const chooseForSlot = (slotIndex: number, alt: MixMedicine) => {
    setMeds((prev) => {
      const next = [...prev];
      if (slotIndex < 0 || slotIndex >= next.length) return prev;
      next[slotIndex] = alt;
      setShowUnsafe(!evaluateMixSafe(next));
      return next;
    });
    setPickSlot(null);
  };

  const optionsForSlot = (slotIndex: number): MixMedicine[] => {
    if (!plan) return [];
    const current = meds[slotIndex];
    if (!current) return plan.alternatives;
    const sameKind = plan.alternatives.filter(
      (a) =>
        a.kindHi === current.kindHi ||
        (current.kindHi.includes("फफूंद") && a.kindHi.includes("फफूंद")) ||
        (current.kindHi.includes("कीट") && a.kindHi.includes("कीट"))
    );
    const pool = sameKind.length ? sameKind : plan.alternatives;
    const ids = new Set(pool.map((a) => a.activeId));
    // Always include current so farmer sees what's selected
    const list = ids.has(current.activeId) ? pool : [current, ...pool];
    return list;
  };

  const toggleSticker = () => {
    if (!plan) return;
    const next = planWithStickerToggle(plan, !plan.includeSticker);
    setPlan(next);
  };

  const mixSafe = evaluateMixSafe(meds);
  const displayItems = plan ? tankItems(plan, meds) : meds;
  const chemSlots = meds.filter((m) => !m.isAdjuvant);

  return (
    <AppShell
      variant="hub"
      title="दवा मिलाएँ"
      subtitle="कीट + फफूंद एक साथ — स्टिकर सहित"
      backHref="/dashboard"
    >
      <div className="mx-auto max-w-lg space-y-4 px-1 pb-8">
        <Stepper step={step} />

        <AnimatePresence mode="wait">
          {step === "problem" && (
            <motion.div
              key="problem"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="space-y-4"
            >
              <div
                className={cn(
                  "rounded-2xl border p-3",
                  weatherBad
                    ? "border-rose-500/35 bg-rose-500/10"
                    : "border-sky-500/25 bg-sky-500/8"
                )}
              >
                <div className="flex items-start gap-2">
                  <CloudRain
                    className={cn(
                      "mt-0.5 h-5 w-5 shrink-0",
                      weatherBad ? "text-rose-600" : "text-sky-600"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[var(--av-text-muted)]">
                      खेत का मौसम · {weatherBits.place}
                    </p>
                    <p className="mt-0.5 text-[13px] font-bold text-[var(--av-text-primary)]">
                      {weatherBits.temp} · नमी {weatherBits.humidity}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-[12px] font-semibold leading-snug",
                        weatherBad
                          ? "text-rose-800 dark:text-rose-200"
                          : "text-[var(--av-text-secondary)]"
                      )}
                    >
                      {weatherLine}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className={AV.sectionTitle}>फसल चुनें</p>
                <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {CROP_PROBLEM_CROPS.map((c) => {
                    const active = c.slug === cropSlug;
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => setCropSlug(c.slug)}
                        className={cn(
                          "relative flex w-[76px] shrink-0 flex-col items-center gap-1 rounded-2xl border p-1.5 transition",
                          active
                            ? "border-emerald-500/55 bg-emerald-500/12"
                            : "border-[var(--av-border)] bg-[var(--av-surface)]"
                        )}
                      >
                        {active && (
                          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                        <span className="relative h-14 w-14 overflow-hidden rounded-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={c.image} alt="" className="h-full w-full object-cover" />
                        </span>
                        <span className="line-clamp-1 text-[10px] font-bold">{c.nameHi}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className={AV.sectionTitle}>फसल का चरण चुनें</p>
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
                          "flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 transition",
                          active
                            ? "border-emerald-500/50 bg-emerald-500/12"
                            : "border-[var(--av-border)] bg-[var(--av-surface)]"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            active ? "text-emerald-700" : "text-[var(--av-text-muted)]"
                          )}
                        />
                        <span className="text-[12px] font-bold">{s.labelHi}</span>
                        <span className="text-center text-[9px] font-medium text-[var(--av-text-muted)]">
                          {s.hintHi}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className={AV.sectionTitle}>समस्याएँ चुनें</p>
                    <p className="mt-0.5 text-[11px] font-medium text-[var(--av-text-muted)]">
                      एक साथ कई हो सकती हैं — कीट + फफूंद दोनों चुनो (अधिकतम {MAX_PROBLEMS})
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {problemIds.length}/{MAX_PROBLEMS}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2.5">
                  {problems.map((p) => {
                    const active = problemIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProblem(p.id)}
                        className={cn(
                          "overflow-hidden rounded-2xl border text-left transition",
                          active
                            ? "border-emerald-500/55 ring-2 ring-emerald-500/25"
                            : "border-[var(--av-border)]"
                        )}
                      >
                        <span className="relative block h-24 w-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt="" className="h-full w-full object-cover" />
                          {active && (
                            <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </span>
                        <span className="block bg-[var(--av-surface)] px-2.5 py-2">
                          <span className="line-clamp-2 text-[12px] font-extrabold leading-snug">
                            {p.nameHi}
                          </span>
                          <span className="mt-0.5 block text-[10px] font-medium text-[var(--av-text-muted)]">
                            {p.tagHi}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedProblems.length > 1 && (
                  <p className="mt-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold text-emerald-900 dark:text-emerald-100">
                    चुना: {selectedProblems.map((p) => p.nameHi).join(" + ")} — एक टैंक में दोनों की दवा + स्टिकर
                  </p>
                )}
              </div>

              <button
                type="button"
                disabled={!problemIds.length}
                onClick={runCheck}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/25 disabled:opacity-40"
              >
                चेक करें
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

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
                  "rounded-2xl border p-4",
                  weatherBad
                    ? "border-rose-500/35 bg-rose-500/10"
                    : "border-emerald-500/30 bg-emerald-500/10"
                )}
              >
                <p className="text-[15px] font-extrabold text-[var(--av-text-primary)]">
                  {weatherBad ? "आज छिड़काव टालें" : "मौसम ठीक है — आगे बढ़ें"}
                </p>
                <p className="mt-1 text-[13px] font-medium text-[var(--av-text-secondary)]">
                  {weatherBits.place} · {weatherBits.temp} · नमी {weatherBits.humidity}
                </p>
                <p className="mt-2 text-[12px] font-semibold leading-snug text-[var(--av-text-muted)]">
                  {weatherLine}
                </p>
              </div>

              {selectedProblems.length > 0 && (
                <p className="text-[12px] font-semibold text-[var(--av-text-secondary)]">
                  समस्या: {selectedProblems.map((p) => p.nameHi).join(" · ")}
                </p>
              )}

              <div className="grid grid-cols-3 gap-2">
                {[
                  { t: "सुबह", d: "7–11 बजे", best: !weatherBad },
                  { t: "दोपहर", d: "12–3 बजे", best: false },
                  { t: "शाम", d: "4–7 बजे", best: !weatherBad },
                ].map((w) => (
                  <div
                    key={w.t}
                    className={cn(
                      "rounded-xl border p-2.5 text-center",
                      w.best
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-[var(--av-border)] bg-[var(--av-surface)]"
                    )}
                  >
                    <p className="text-[12px] font-bold">{w.t}</p>
                    <p className="text-[10px] text-[var(--av-text-muted)]">{w.d}</p>
                    <p
                      className={cn(
                        "mt-1 text-[10px] font-bold",
                        w.best ? "text-emerald-700" : "text-[var(--av-text-muted)]"
                      )}
                    >
                      {w.best ? "अच्छा" : "सावधानी"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep("problem")}
                  className="flex flex-1 items-center justify-center gap-1 rounded-2xl border border-[var(--av-border)] py-3 text-[13px] font-bold"
                >
                  <ArrowLeft className="h-4 w-4" />
                  वापस
                </button>
                <button
                  type="button"
                  onClick={goToMix}
                  className="flex flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-[14px] font-bold text-white"
                >
                  आगे: मिक्स
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === "mix" && meds.length > 0 && plan && (
            <motion.div
              key="mix"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="relative space-y-4"
            >
              <div
                className={cn(
                  "grid gap-2.5",
                  displayItems.length >= 3 ? "grid-cols-2" : "grid-cols-2"
                )}
              >
                {displayItems.map((m, i) => {
                  const isSticker = Boolean(m.isAdjuvant);
                  // Sticker is appended after chem meds — chem slot index matches meds index
                  const chemIndex = isSticker ? -1 : i;
                  return (
                    <MedCard
                      key={`${m.activeId}-${i}`}
                      med={m}
                      onChoose={
                        isSticker
                          ? undefined
                          : () => setPickSlot(chemIndex)
                      }
                    />
                  );
                })}
              </div>

              {/* Choose medicine sheet */}
              <AnimatePresence>
                {pickSlot != null && plan && meds[pickSlot] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center"
                    onClick={() => setPickSlot(null)}
                  >
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 24, opacity: 0 }}
                      transition={{ duration: 0.22, ease: EASE_OUT }}
                      className="max-h-[70vh] w-full max-w-md overflow-hidden rounded-2xl bg-[var(--av-surface)] shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between border-b border-[var(--av-border)] px-4 py-3">
                        <p className="text-[15px] font-extrabold text-[var(--av-text-primary)]">
                          दवा चुनें
                        </p>
                        <button
                          type="button"
                          onClick={() => setPickSlot(null)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--av-surface-inset)]"
                          aria-label="बंद करें"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <ul className="max-h-[55vh] space-y-1 overflow-y-auto p-3">
                        {optionsForSlot(pickSlot).map((opt) => {
                          const selected = meds[pickSlot]?.activeId === opt.activeId;
                          return (
                            <li key={opt.activeId + opt.formHi}>
                              <button
                                type="button"
                                onClick={() => chooseForSlot(pickSlot, opt)}
                                className={cn(
                                  "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition",
                                  selected
                                    ? "border-emerald-500/50 bg-emerald-500/12"
                                    : "border-[var(--av-border)] bg-[var(--av-surface)]"
                                )}
                              >
                                <span className="min-w-0 flex-1">
                                  <span className="block text-[14px] font-extrabold text-[var(--av-text-primary)]">
                                    {opt.nameHi}
                                  </span>
                                  <span className="mt-0.5 block text-[11px] font-medium text-[var(--av-text-muted)]">
                                    {opt.formHi} · {opt.doseHi}
                                  </span>
                                </span>
                                {selected ? (
                                  <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                                ) : null}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {chemSlots.length >= 2 && (
                <div className="flex justify-center">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full shadow-lg",
                      mixSafe ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                    )}
                  >
                    {mixSafe ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : (
                      <ShieldAlert className="h-5 w-5" />
                    )}
                  </div>
                </div>
              )}

              <p
                className={cn(
                  "text-center text-[14px] font-extrabold",
                  mixSafe ? "text-emerald-700" : "text-rose-700"
                )}
              >
                {mixSafe
                  ? plan.includeSticker
                    ? "सुरक्षित मिक्स — दवाएँ + स्टिकर"
                    : "सुरक्षित और असरदार!"
                  : "यह जोड़ी असुरक्षित है"}
              </p>

              <button
                type="button"
                onClick={toggleSticker}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition",
                  plan.includeSticker
                    ? "border-sky-500/40 bg-sky-500/10"
                    : "border-[var(--av-border)] bg-[var(--av-surface)]"
                )}
              >
                <span>
                  <span className="block text-[13px] font-extrabold text-[var(--av-text-primary)]">
                    सिलिकॉन स्टिकर साथ डालें
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium text-[var(--av-text-muted)]">
                    पत्ते पर दवा चिपकती है — किसान अक्सर दोनों दवाओं के साथ डालते हैं
                  </span>
                </span>
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    plan.includeSticker
                      ? "bg-sky-600 text-white"
                      : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
                  )}
                >
                  {plan.includeSticker ? <Check className="h-4 w-4" /> : null}
                </span>
              </button>

              <div>
                <p className={AV.sectionTitle}>छिड़काव का समय</p>
                <div className="mt-2 flex overflow-hidden rounded-xl border border-[var(--av-border)]">
                  {[
                    { t: "सुबह", best: true },
                    { t: "दोपहर", best: false },
                    { t: "शाम", best: true, top: true },
                  ].map((slot) => (
                    <div
                      key={slot.t}
                      className={cn(
                        "flex-1 px-2 py-2.5 text-center",
                        slot.top
                          ? "bg-emerald-600 text-white"
                          : slot.best
                            ? "bg-emerald-500/15 text-emerald-900"
                            : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
                      )}
                    >
                      <p className="text-[12px] font-bold">{slot.t}</p>
                      <p className="text-[9px] font-semibold opacity-90">
                        {slot.top ? "सबसे अच्छा" : slot.best ? "ठीक" : "न करें"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep("weather")}
                  className="flex flex-1 items-center justify-center gap-1 rounded-2xl border border-[var(--av-border)] py-3 text-[13px] font-bold"
                >
                  <ArrowLeft className="h-4 w-4" />
                  वापस
                </button>
                <button
                  type="button"
                  disabled={!mixSafe}
                  onClick={() => setStep("guide")}
                  className="flex flex-[1.6] items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-[14px] font-bold text-white disabled:opacity-40"
                >
                  अगला: गाइड
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <AnimatePresence>
                {showUnsafe && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-rose-950/75 p-4 backdrop-blur-[2px]"
                  >
                    <div className="w-full max-w-sm rounded-2xl border border-rose-400/40 bg-rose-950 p-4 text-white shadow-xl">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/30">
                        <AlertTriangle className="h-7 w-7 text-rose-200" />
                      </div>
                      <p className="mt-3 text-center text-[15px] font-extrabold">
                        चेतावनी: यह मिश्रण असुरक्षित है!
                      </p>
                      <p className="mt-2 text-center text-[12px] leading-snug text-rose-100/90">
                        ये दवाएँ मिलाएँ तो फसल खराब हो सकती है और असर भी कम हो सकता है।
                      </p>
                      {plan.safeFallback && plan.safeFallback.length >= 2 && (
                        <div className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-[12px]">
                          <p className="font-bold text-emerald-200">सुरक्षित जोड़ी</p>
                          <p className="mt-0.5 font-medium">
                            {plan.safeFallback.map((m) => `${m.nameHi} ${m.formHi}`).join(" + ")}
                          </p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={applySafeFallback}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-[13px] font-bold text-white"
                      >
                        असुरक्षित जोड़ी बदलें
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {step === "guide" && meds.length > 0 && plan && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="space-y-4"
            >
              <div className="relative overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/jobs/job-spray.jpg"
                  alt=""
                  className="h-40 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                </div>
                <p className="absolute bottom-3 left-3 right-3 text-[15px] font-extrabold text-white">
                  मिश्रण कैसे तैयार करें?
                </p>
              </div>

              <ol className="space-y-2">
                {plan.mixStepsHi.map((line, i) => (
                  <li
                    key={line}
                    className="flex gap-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-[13px] font-semibold leading-snug text-[var(--av-text-primary)]">
                      {line}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="overflow-hidden rounded-2xl border border-[var(--av-border)]">
                <table className="w-full text-left text-[12px]">
                  <thead className="bg-emerald-600 text-white">
                    <tr>
                      <th className="px-3 py-2 font-bold">दवा / स्टिकर</th>
                      <th className="px-3 py-2 font-bold">खुराक</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--av-surface)]">
                    {displayItems.map((m) => (
                      <tr key={m.activeId + m.formHi} className="border-t border-[var(--av-border)]">
                        <td className="px-3 py-2 font-semibold">
                          {m.nameHi} {m.formHi}
                        </td>
                        <td className="px-3 py-2 font-bold text-emerald-800">{m.doseHi}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-[var(--av-border)] bg-emerald-500/8">
                      <td className="px-3 py-2 font-semibold">पानी</td>
                      <td className="px-3 py-2 font-bold">{plan.waterHi}</td>
                    </tr>
                    <tr className="border-t border-[var(--av-border)]">
                      <td className="px-3 py-2 font-semibold">नोजल</td>
                      <td className="px-3 py-2 font-bold">{plan.nozzleHi}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                  <p className="text-[11px] font-bold text-amber-900 dark:text-amber-100">
                    सुरक्षा
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-amber-950/80 dark:text-amber-50/80">
                    मास्क · दस्ताने · पूरी बाँह कपड़े
                  </p>
                </div>
                <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3">
                  <p className="text-[11px] font-bold text-sky-900 dark:text-sky-100">
                    कटाई का इंतज़ार
                  </p>
                  <p className="mt-1 text-[18px] font-black text-sky-800 dark:text-sky-100">
                    {plan.phiDays} दिन
                  </p>
                </div>
              </div>

              <ul className="space-y-1 text-[11px] font-medium text-[var(--av-text-muted)]">
                <li>· दवा और स्टिकर का लेबल हमेशा पढ़ें — लेबल अंतिम है</li>
                <li>· बच्चे और जानवर दूर रखें</li>
                <li>· बची दवा नाले में न डालें</li>
              </ul>

              <button
                type="button"
                onClick={() => router.push("/spray-rotation/log")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-[15px] font-bold text-white"
              >
                <CheckCircle2 className="h-4 w-4" />
                छिड़काव रिकॉर्ड करें
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep("mix")}
                  className="flex flex-1 items-center justify-center gap-1 rounded-2xl border border-[var(--av-border)] py-2.5 text-[12px] font-bold"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  वापस
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.share) {
                      const names = displayItems.map((m) => m.nameHi).join(" + ");
                      void navigator.share({
                        title: "दवा मिलाएँ — AgriVeda",
                        text: names,
                      });
                    }
                  }}
                  className="flex flex-1 items-center justify-center gap-1 rounded-2xl border border-[var(--av-border)] py-2.5 text-[12px] font-bold"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  बाँटें
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
