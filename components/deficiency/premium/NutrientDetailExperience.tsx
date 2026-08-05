"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Droplets,
  FlaskConical,
  HelpCircle,
  Leaf,
  Lightbulb,
  MessageCircle,
  Shield,
  AlertTriangle,
  Sprout,
  Stethoscope,
  Zap,
} from "lucide-react";
import type { NutrientDeficiencyData } from "@/types/deficiency";
import { toFarmerNutrientView } from "@/lib/nutrients/farmerNutrientView";
import {
  buildCropScope,
  categoryLabelHi,
  getCropOptions,
  healthFromSeverity,
  type CropOption,
} from "@/lib/nutrients/nutrientCropContext";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";
import { EASE_OUT, MOTION, staggerContainer, staggerItem } from "@/lib/motion/variants";

const TABS = [
  { id: "impact", label: "फसल असर", icon: Sprout },
  { id: "fix", label: "उपाय", icon: FlaskConical },
  { id: "symptoms", label: "लक्षण", icon: Leaf },
  { id: "why", label: "कारण", icon: HelpCircle },
  { id: "prevention", label: "बचाव", icon: Shield },
  { id: "more", label: "और", icon: Lightbulb },
] as const;

type TabId = (typeof TABS)[number]["id"];

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

const panelMotion = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.slow, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: MOTION.normal, ease: EASE_OUT },
  },
};

function AvCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function CropStrip({
  crops,
  active,
  onChange,
}: {
  crops: CropOption[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700/70 dark:text-emerald-300/70">
        फसल चुनें
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {crops.map((crop) => {
          const selected = crop.key === active;
          return (
            <button
              key={crop.key}
              type="button"
              onClick={() => onChange(crop.key)}
              className={cn(
                "shrink-0 rounded-xl border px-3 py-2 text-[12px] font-bold transition",
                selected
                  ? "border-emerald-500/45 bg-emerald-500/12 text-emerald-950 dark:text-emerald-50"
                  : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)] hover:border-emerald-500/25"
              )}
            >
              {crop.labelHi}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SegmentTabs({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-[53px] z-30 -mx-4 border-b border-[var(--av-border)] bg-[var(--background)]/92 px-4 backdrop-blur-xl">
      <div
        ref={scrollRef}
        role="tablist"
        className="flex gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((tab) => {
          const selected = tab.id === active;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-[12px] font-semibold transition-colors",
                selected
                  ? "text-emerald-800 dark:text-emerald-200"
                  : "text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)]"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
              <span>{tab.label}</span>
              {selected && (
                <motion.span
                  layoutId="nutrient-tool-tab"
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function NutrientDetailExperience({
  nutrient,
}: {
  nutrient: NutrientDeficiencyData;
}) {
  const reduceMotion = useReducedMotion();
  const farmer = useMemo(() => toFarmerNutrientView(nutrient), [nutrient]);
  const crops = useMemo(() => getCropOptions(nutrient), [nutrient]);
  const [cropKey, setCropKey] = useState(crops[0]?.key ?? "Paddy");
  const [tab, setTab] = useState<TabId>("impact");
  const [expandedFix, setExpandedFix] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const scope = useMemo(
    () => buildCropScope(nutrient, farmer, cropKey),
    [nutrient, farmer, cropKey]
  );

  const health = healthFromSeverity(nutrient.severity);
  const catHi = categoryLabelHi(nutrient.category);
  const fixes = nutrient.howToFix ?? [];
  const expertTips = (nutrient.expertTips ?? []).slice(0, 5).map((t) => t.slice(0, 100));
  const faq = farmer.faq.length
    ? farmer.faq
    : (nutrient.faq ?? []).slice(0, 3).map((f) => ({ q: f.q, a: f.a.slice(0, 120) }));

  const tabIndex = TABS.findIndex((t) => t.id === tab);
  const goTab = useCallback(
    (dir: 1 | -1) => {
      const next = TABS[tabIndex + dir];
      if (next) setTab(next.id);
    },
    [tabIndex]
  );

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.x < -60) goTab(1);
      else if (info.offset.x > 60) goTab(-1);
    },
    [goTab]
  );

  const mobilityLabel =
    nutrient.mobility === "Mobile"
      ? "चलनशील"
      : nutrient.mobility === "Immobile"
        ? "अचल"
        : "आंशिक";

  const fixList = (fixes.length
    ? fixes
    : farmer.kyaKaren.map((k) => ({
        fertilizer: k.title,
        nutrientContent: "",
        soilApplicationDose: k.detail,
        foliarSprayDose: "",
        bestCropStage: scope.cropStage,
        methodOfApplication: "",
        expectedRecoveryTime: nutrient.recoveryTimeline,
        precautions: "",
      }))
  ).slice(0, 6);

  return (
    <div className="av-page relative min-h-screen overflow-x-hidden pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-8 h-36 w-36 rounded-full bg-emerald-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 top-48 h-28 w-28 rounded-full bg-teal-500/10 blur-3xl"
      />

      <header className="sticky top-0 z-40 border-b border-[var(--av-border)] bg-[var(--background)]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link
            href="/deficiencies"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-800 transition hover:text-emerald-950 dark:text-emerald-300"
            aria-label="वापस पोषक तत्व"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>पोषक तत्व</span>
          </Link>
          <span className="h-3 w-px bg-[var(--av-border)]" aria-hidden />
          <p className="min-w-0 flex-1 truncate text-[12px] font-medium text-[var(--av-text-muted)]">
            {farmer.symbol} · {catHi}
          </p>
        </div>
      </header>

      <div className="relative mx-auto max-w-lg px-4">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.slow, ease: EASE_OUT }}
          className="space-y-4 pt-5"
        >
          {/* Compact nutrient identity */}
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-black shadow-sm",
                SYM_TILE[farmer.symbol] ?? "bg-emerald-700 text-white"
              )}
              aria-hidden
            >
              {farmer.symbol}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-[1.65rem] font-bold leading-tight tracking-tight text-[var(--av-text-primary)]">
                {farmer.nameHi}
              </h1>
              <p className="mt-0.5 text-[12px] text-[var(--av-text-muted)]">
                {catHi} · {mobilityLabel}
              </p>
            </div>
          </div>

          {/* Crop first */}
          <CropStrip crops={crops} active={cropKey} onChange={setCropKey} />

          {/* Crop impact panel — always visible above tabs */}
          <div className="overflow-hidden rounded-[20px] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.09] to-[var(--av-surface)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-800/70 dark:text-emerald-200/70">
                  {scope.labelHi} पर असर
                </p>
                <p className="mt-1.5 text-sm font-semibold leading-snug text-[var(--av-text-primary)]">
                  {scope.cropSymptom}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold",
                  health.tone === "amber"
                    ? "bg-amber-500/15 text-amber-900 dark:text-amber-100"
                    : "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100"
                )}
              >
                {health.label}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-emerald-500/15 pt-3">
              <div>
                <p className="text-[10px] font-semibold text-[var(--av-text-muted)]">अवस्था</p>
                <p className="mt-0.5 text-[13px] font-bold text-[var(--av-text-primary)]">
                  {scope.cropStage}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[var(--av-text-muted)]">त्वरित उपाय</p>
                <p className="mt-0.5 line-clamp-2 text-[13px] font-bold text-emerald-800 dark:text-emerald-200">
                  {scope.cropFix || farmer.kyaKaren[0]?.title || "नीचे देखें"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTab("fix")}
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-emerald-800 dark:text-emerald-200"
            >
              पूरी खुराक देखें
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.section>

        <SegmentTabs active={tab} onChange={setTab} />

        <motion.div
          key={`${tab}-${cropKey}`}
          drag={reduceMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={onDragEnd}
          initial={reduceMotion ? false : panelMotion.initial}
          animate={panelMotion.animate}
          exit={panelMotion.exit}
          className="mt-4 touch-pan-y"
        >
          {tab === "impact" && (
            <div className="space-y-3">
              <AvCard>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--av-text-muted)]">
                  पहचान
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--av-text-secondary)]">
                  {farmer.pehchan}
                </p>
              </AvCard>
              {scope.symptoms.slice(0, 3).map((s) => (
                <AvCard key={s.id} className="!py-3">
                  <p className="text-sm font-bold text-[var(--av-text-primary)]">{s.title}</p>
                  <p className="mt-1 text-[12px] leading-snug text-[var(--av-text-muted)]">
                    {s.description}
                  </p>
                </AvCard>
              ))}
              {scope.cropCause ? (
                <AvCard className="border-amber-500/20 bg-amber-500/[0.04]">
                  <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-100">
                    इस फसल में क्यों
                  </p>
                  <p className="mt-1.5 text-[13px] leading-snug text-[var(--av-text-secondary)]">
                    {scope.cropCause}
                  </p>
                </AvCard>
              ) : null}
            </div>
          )}

          {tab === "fix" && (
            <div className="space-y-3">
              <p className="text-[12px] font-semibold text-emerald-800 dark:text-emerald-200">
                {scope.labelHi} · सही खुराक
              </p>
              {fixList.map((fix, i) => (
                <FertilizerCard
                  key={fix.fertilizer + i}
                  fix={fix}
                  expanded={expandedFix === fix.fertilizer}
                  onToggle={() =>
                    setExpandedFix(expandedFix === fix.fertilizer ? null : fix.fertilizer)
                  }
                  cropNote={scope.cropFix}
                />
              ))}
            </div>
          )}

          {tab === "symptoms" && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {scope.symptoms.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-[var(--av-border)] bg-[var(--av-surface)] px-4 py-8 text-center text-sm text-[var(--av-text-muted)]">
                  लक्षण डेटा जल्द जुड़ेगा।
                </p>
              ) : (
                scope.symptoms.map((s) => (
                  <motion.div key={s.id} variants={staggerItem}>
                    <SymptomCard symptom={s} />
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {tab === "why" && (
            <div className="space-y-3">
              {scope.causes.map((c, i) => (
                <CauseCard key={c.id} cause={c} index={i} />
              ))}
            </div>
          )}

          {tab === "prevention" && (
            <div className="space-y-3">
              <AvCard className="border-emerald-500/20 bg-emerald-500/[0.04]">
                <p className="flex items-center gap-2 text-[15px] font-bold text-emerald-900 dark:text-emerald-100">
                  <Sprout className="h-4 w-4" /> करें
                </p>
                <ul className="mt-3 space-y-2">
                  {scope.preventionDos.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-[13px] leading-snug text-[var(--av-text-secondary)]"
                    >
                      <span className="font-bold text-emerald-600" aria-hidden>
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </AvCard>
              {scope.preventionDonts.length > 0 && (
                <AvCard className="border-rose-500/20 bg-rose-500/[0.03]">
                  <p className="flex items-center gap-2 text-[15px] font-bold text-rose-800 dark:text-rose-200">
                    <AlertTriangle className="h-4 w-4" /> न करें
                  </p>
                  <ul className="mt-3 space-y-2">
                    {scope.preventionDonts.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-[13px] leading-snug text-[var(--av-text-secondary)]"
                      >
                        <span className="font-bold text-rose-500" aria-hidden>
                          ✗
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </AvCard>
              )}
            </div>
          )}

          {tab === "more" && (
            <div className="space-y-3">
              <AvCard>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-200">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--av-text-primary)]">
                      ज़्यादा खाद का असर
                    </p>
                    <p className="text-[11px] text-[var(--av-text-muted)]">सावधानी</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--av-text-secondary)]">
                  {nutrient.toxicity?.whatHappens ??
                    "ज़्यादा मात्रा से दूसरे पोषक तत्व की कमी हो सकती है।"}
                </p>
                {nutrient.toxicity?.correctionMethods ? (
                  <p className="mt-3 rounded-xl bg-emerald-500/8 p-3 text-[12px] leading-relaxed text-emerald-950 dark:text-emerald-50">
                    <span className="font-semibold">सुधार — </span>
                    {nutrient.toxicity.correctionMethods}
                  </p>
                ) : null}
              </AvCard>

              {expertTips.map((tip) => (
                <AvCard key={tip}>
                  <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-800 dark:text-emerald-200">
                    <Zap className="h-3.5 w-3.5" /> सुझाव
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--av-text-secondary)]">
                    {tip}
                  </p>
                </AvCard>
              ))}

              <div className="space-y-2">
                <p className="text-[15px] font-bold text-[var(--av-text-primary)]">सवाल</p>
                {faq.map((item, i) => (
                  <FaqItem
                    key={item.q}
                    q={item.q}
                    a={item.a}
                    open={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Sticky-feel bottom actions */}
        <div className="mt-8 grid grid-cols-2 gap-2">
          <Link
            href="/ai-doctor"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-3.5 text-[13px] font-bold text-white shadow-sm shadow-emerald-700/20"
          >
            <Stethoscope className="h-3.5 w-3.5" />
            फोटो लो
          </Link>
          <Link
            href="/ask-query"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-600/30 bg-[var(--av-surface)] px-3 py-3.5 text-[13px] font-bold text-emerald-900 dark:text-emerald-100"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            पूछो
          </Link>
        </div>
      </div>
    </div>
  );
}

function SymptomCard({
  symptom,
}: {
  symptom: { title: string; description: string; part: string; severity: string };
}) {
  const [open, setOpen] = useState(true);
  const colors =
    symptom.severity === "high"
      ? "border-rose-500/25"
      : symptom.severity === "medium"
        ? "border-amber-500/25"
        : "border-emerald-500/20";

  return (
    <AvCard className={colors}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-2 text-left"
      >
        <div>
          <p className="text-sm font-bold text-[var(--av-text-primary)]">{symptom.title}</p>
          <p className="mt-0.5 text-[11px] font-medium text-[var(--av-text-muted)]">
            हिस्सा: {symptom.part}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--av-text-muted)] transition",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 overflow-hidden text-[13px] leading-relaxed text-[var(--av-text-secondary)]"
          >
            {symptom.description}
          </motion.p>
        )}
      </AnimatePresence>
    </AvCard>
  );
}

function CauseCard({
  cause,
  index,
}: {
  cause: { title: string; farmerNote: string; technicalNote: string };
  index: number;
}) {
  const icons = [Droplets, Leaf, Sprout, Zap, HelpCircle];
  const Icon = icons[index % icons.length];
  return (
    <AvCard>
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-200">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--av-text-primary)]">{cause.title}</p>
          <p className="mt-1 text-[13px] font-semibold text-emerald-900 dark:text-emerald-100">
            {cause.farmerNote}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-[var(--av-text-muted)]">
            {cause.technicalNote}
          </p>
        </div>
      </div>
    </AvCard>
  );
}

function FertilizerCard({
  fix,
  expanded,
  onToggle,
  cropNote,
}: {
  fix: {
    fertilizer: string;
    nutrientContent?: string;
    soilApplicationDose?: string;
    foliarSprayDose?: string;
    fertigationDose?: string;
    bestCropStage?: string;
    methodOfApplication?: string;
    expectedRecoveryTime?: string;
    precautions?: string;
    waterQuantity?: string;
  };
  expanded: boolean;
  onToggle: () => void;
  cropNote: string;
}) {
  const dose =
    fix.foliarSprayDose && fix.foliarSprayDose !== "NA"
      ? fix.foliarSprayDose
      : fix.soilApplicationDose && fix.soilApplicationDose !== "NA"
        ? fix.soilApplicationDose
        : "मिट्टी परीक्षण अनुसार";

  return (
    <AvCard>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-base font-bold text-[var(--av-text-primary)]">{fix.fertilizer}</p>
          {fix.nutrientContent ? (
            <p className="mt-0.5 text-[12px] font-semibold text-emerald-800 dark:text-emerald-200">
              {fix.nutrientContent}
            </p>
          ) : null}
        </div>
      </div>
      <p className="mt-2.5 text-sm font-semibold text-[var(--av-text-primary)]">{dose}</p>
      {fix.bestCropStage ? (
        <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">समय: {fix.bestCropStage}</p>
      ) : null}
      {cropNote ? (
        <p className="mt-2 border-l-2 border-emerald-500/30 pl-2.5 text-[11px] leading-snug text-[var(--av-text-secondary)]">
          इस फसल में: {cropNote}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onToggle}
        className={`mt-3 flex w-full items-center justify-center gap-1 ${AV.btnSecondarySm}`}
      >
        {expanded ? "कम देखें" : "पूरा विवरण"}
        <ChevronRight className={cn("h-3.5 w-3.5 transition", expanded && "rotate-90")} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 space-y-1.5 overflow-hidden border-t border-[var(--av-border-subtle)] pt-3 text-[12px] text-[var(--av-text-secondary)]"
          >
            {fix.methodOfApplication && <p>तरीका: {fix.methodOfApplication}</p>}
            {fix.waterQuantity && fix.waterQuantity !== "NA" && <p>पानी: {fix.waterQuantity}</p>}
            {fix.fertigationDose && fix.fertigationDose !== "NA" && (
              <p>ड्रिप: {fix.fertigationDose}</p>
            )}
            {fix.expectedRecoveryTime && <p>असर: {fix.expectedRecoveryTime}</p>}
            {fix.precautions && (
              <p className="text-amber-900 dark:text-amber-100">सावधानी: {fix.precautions}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AvCard>
  );
}

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <AvCard className="!overflow-hidden !p-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="text-[13px] font-semibold text-[var(--av-text-primary)]">{q}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--av-text-muted)] transition",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-[var(--av-border-subtle)] px-4 pb-3"
          >
            <p className="pt-2 text-[13px] leading-relaxed text-[var(--av-text-secondary)]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </AvCard>
  );
}
