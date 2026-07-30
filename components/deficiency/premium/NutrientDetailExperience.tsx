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
  BookOpen,
  ChevronDown,
  ChevronRight,
  Droplets,
  FlaskConical,
  HelpCircle,
  Leaf,
  Lightbulb,
  Shield,
  Sparkles,
  AlertTriangle,
  Sprout,
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
  { id: "overview", label: "झलक", icon: BookOpen, emoji: "📖" },
  { id: "symptoms", label: "लक्षण", icon: Leaf, emoji: "🔍" },
  { id: "why", label: "कारण", icon: HelpCircle, emoji: "❓" },
  { id: "fix", label: "उपाय", icon: FlaskConical, emoji: "💊" },
  { id: "prevention", label: "बचाव", icon: Shield, emoji: "🌱" },
  { id: "toxicity", label: "ज़्यादा", icon: AlertTriangle, emoji: "⚠️" },
  { id: "expert", label: "सुझाव", icon: Lightbulb, emoji: "👨‍🌾" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const panelMotion = {
  initial: { opacity: 0, y: 14, scale: 0.99 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: MOTION.slow, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.995,
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
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: MOTION.fast, ease: EASE_OUT }}
      className={cn(
        "rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function CropImpactSwitcher({
  crops,
  active,
  onChange,
}: {
  crops: CropOption[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[var(--av-accent)]">
        फसल चुनें — जानकारी बदलेगी
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {crops.map((crop) => {
          const selected = crop.key === active;
          return (
            <motion.button
              key={crop.key}
              type="button"
              onClick={() => onChange(crop.key)}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-2xl border px-3.5 py-2.5 text-left transition-colors",
                selected
                  ? "border-emerald-500/50 bg-emerald-500/15 text-[var(--av-text-primary)] shadow-[0_8px_24px_rgba(16,185,129,0.18)]"
                  : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)] hover:border-emerald-500/30"
              )}
            >
              <span className="relative flex items-center gap-2">
                <span className="text-lg">{crop.emoji}</span>
                <span className="text-xs font-bold">{crop.labelHi}</span>
              </span>
            </motion.button>
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
    <div className="sticky top-0 z-30 -mx-4 border-b border-[var(--av-border)] bg-[var(--background)]/92 px-4 py-3 backdrop-blur-xl">
      <div
        ref={scrollRef}
        className="relative flex gap-1 overflow-x-auto rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-1 scrollbar-none"
      >
        {TABS.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative z-10 flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold transition-colors",
                selected
                  ? "text-emerald-800 dark:text-emerald-200"
                  : "text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)]"
              )}
            >
              {selected && (
                <motion.div
                  layoutId="nutrient-tab-pill"
                  className="absolute inset-0 rounded-xl border border-emerald-500/35 bg-emerald-500/15"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative text-sm">{tab.emoji}</span>
              <span className="relative">{tab.label}</span>
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
  const [tab, setTab] = useState<TabId>("overview");
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

  return (
    <div className="av-page relative min-h-screen overflow-x-hidden pb-32">
      <header className="sticky top-0 z-40 border-b border-[var(--av-border)] bg-[var(--background)]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link
            href="/deficiencies"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] text-emerald-600"
            aria-label="वापस"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-[var(--av-text-primary)]">
              {farmer.nameHi}
            </p>
            <p className="truncate text-[11px] text-[var(--av-text-muted)]">
              {farmer.symbol} · {catHi}
            </p>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-lg px-4">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.slow, ease: EASE_OUT }}
          className="relative mt-4 overflow-hidden rounded-[24px] border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-[var(--av-surface)] to-cyan-500/10 p-5 shadow-[var(--av-shadow-md)]"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-200">
                  {catHi}
                </span>
                <span className="rounded-full border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2.5 py-1 text-[10px] font-semibold text-[var(--av-text-secondary)]">
                  {nutrient.mobility === "Mobile"
                    ? "चलनशील"
                    : nutrient.mobility === "Immobile"
                      ? "अचल"
                      : "आंशिक"}
                </span>
              </div>

              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-4xl"
              >
                {farmer.icon}
              </motion.div>

              <div>
                <h1 className="text-[1.65rem] font-black tracking-tight text-[var(--av-text-primary)]">
                  {farmer.nameHi}
                </h1>
                <p className="mt-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {farmer.symbol}
                </p>
              </div>
            </div>

            <div className="min-w-[100px] rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 shadow-sm">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--av-text-muted)]">
                खेत जोखिम
              </p>
              <p
                className={cn(
                  "mt-1 text-lg font-black",
                  health.tone === "amber" ? "text-amber-600" : "text-emerald-600"
                )}
              >
                {health.pct}%
              </p>
              <p className="text-[10px] font-semibold text-[var(--av-text-secondary)]">
                {health.label}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--av-surface-inset)]">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    health.tone === "amber" ? "bg-amber-500" : "bg-emerald-500"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${health.pct}%` }}
                  transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 }}
                />
              </div>
            </div>
          </div>

          <p className="relative mt-4 text-sm leading-relaxed text-[var(--av-text-secondary)]">
            {farmer.oneLiner}
          </p>
          <p className="relative mt-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs leading-snug text-amber-900 dark:text-amber-100">
            <span className="font-bold">पहचान: </span>
            {farmer.pehchan}
          </p>

          <CropImpactSwitcher crops={crops} active={cropKey} onChange={setCropKey} />

          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-5 flex justify-center text-[var(--av-text-muted)]"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
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
          {tab === "overview" && (
            <div className="space-y-3">
              <AvCard className="border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 to-transparent">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-xs font-bold uppercase tracking-wide">
                    फसल: {scope.labelHi}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--av-text-secondary)]">
                  {scope.cropSymptom}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-[var(--av-surface-inset)] p-2.5">
                    <p className="text-[9px] font-bold uppercase text-[var(--av-text-muted)]">अवस्था</p>
                    <p className="text-xs font-semibold text-[var(--av-text-primary)]">
                      {scope.cropStage}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[var(--av-surface-inset)] p-2.5">
                    <p className="text-[9px] font-bold uppercase text-[var(--av-text-muted)]">उपाय</p>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      {scope.cropFix || "नीचे देखें"}
                    </p>
                  </div>
                </div>
              </AvCard>
              <AvCard>
                <p className="text-xs font-bold text-[var(--av-text-primary)]">त्वरित खाद</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {farmer.kyaKaren.map((f) => (
                    <span
                      key={f.title}
                      className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-200"
                    >
                      {f.title}
                    </span>
                  ))}
                </div>
              </AvCard>
            </div>
          )}

          {tab === "symptoms" && (
            <div className="space-y-3">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {scope.symptoms.length === 0 ? (
                  <p className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-4 py-6 text-center text-sm text-[var(--av-text-muted)]">
                    इस पोषक तत्व के लक्षण डेटा जल्द जुड़ेगा। Overview में संक्षिप्त लक्षण देखें।
                  </p>
                ) : (
                  scope.symptoms.map((s) => (
                    <motion.div key={s.id} variants={staggerItem}>
                      <SymptomCard symptom={s} />
                    </motion.div>
                  ))
                )}
              </motion.div>
            </div>
          )}

          {tab === "why" && (
            <div className="space-y-3">
              {scope.causes.map((c, i) => (
                <CauseCard key={c.id} cause={c} index={i} />
              ))}
            </div>
          )}

          {tab === "fix" && (
            <div className="space-y-3">
              <p className="text-center text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                {scope.emoji} {scope.labelHi} के लिए सुझाव
              </p>
              {(fixes.length
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
              )
                .slice(0, 6)
                .map((fix, i) => (
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

          {tab === "prevention" && (
            <div className="space-y-3">
              <AvCard className="border-emerald-500/25 bg-emerald-500/5">
                <p className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-200">
                  <Sprout className="h-4 w-4" /> करें ✓
                </p>
                <ul className="mt-3 space-y-2">
                  {scope.preventionDos.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-xs text-[var(--av-text-secondary)]"
                    >
                      <span className="font-bold text-emerald-600">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </AvCard>
              {scope.preventionDonts.length > 0 && (
                <AvCard className="border-rose-500/25 bg-rose-500/5">
                  <p className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300">
                    <AlertTriangle className="h-4 w-4" /> न करें ✗
                  </p>
                  <ul className="mt-3 space-y-2">
                    {scope.preventionDonts.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-xs text-[var(--av-text-secondary)]"
                      >
                        <span className="font-bold text-rose-500">✗</span> {item}
                      </li>
                    ))}
                  </ul>
                </AvCard>
              )}
            </div>
          )}

          {tab === "toxicity" && (
            <div>
              <AvCard className="border-amber-500/30 bg-amber-500/8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
                      ज़्यादा खाद का असर
                    </p>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-200/80">
                      सावधानी से प्रयोग करें
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[var(--av-text-secondary)]">
                  {nutrient.toxicity?.whatHappens ??
                    "ज़्यादा मात्रा से दूसरे पोषक तत्व की कमी हो सकती है।"}
                </p>
                {nutrient.toxicity?.plantToxicitySymptoms && (
                  <p className="mt-2 text-xs text-[var(--av-text-muted)]">
                    {nutrient.toxicity.plantToxicitySymptoms}
                  </p>
                )}
                {nutrient.toxicity?.correctionMethods && (
                  <p className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-900 dark:text-emerald-100">
                    <span className="font-bold">सुधार: </span>
                    {nutrient.toxicity.correctionMethods}
                  </p>
                )}
              </AvCard>
            </div>
          )}

          {tab === "expert" && (
            <div className="space-y-3">
              {expertTips.map((tip) => (
                <AvCard
                  key={tip}
                  className="border-amber-500/20 bg-gradient-to-br from-amber-500/8 to-transparent"
                >
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                    <Zap className="h-3.5 w-3.5" /> विशेष सुझाव
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--av-text-secondary)]">
                    {tip}
                  </p>
                </AvCard>
              ))}
              <div className="space-y-2">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">
                  अक्सर पूछे जाने वाले सवाल
                </p>
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
      ? "border-rose-500/30 bg-rose-500/8"
      : symptom.severity === "medium"
        ? "border-amber-500/30 bg-amber-500/8"
        : "border-emerald-500/25 bg-emerald-500/8";

  return (
    <AvCard className={colors}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-2 text-left"
      >
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--av-surface)] text-xl ring-1 ring-[var(--av-border)]">
            🍃
          </div>
          <div>
            <p className="text-sm font-extrabold text-[var(--av-text-primary)]">{symptom.title}</p>
            <p className="mt-0.5 text-[10px] font-semibold text-[var(--av-text-muted)]">
              हिस्सा: {symptom.part}
            </p>
          </div>
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
            className="mt-3 overflow-hidden text-xs leading-relaxed text-[var(--av-text-secondary)]"
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
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-300">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-[var(--av-text-primary)]">{cause.title}</p>
          <p className="mt-1 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
            {cause.farmerNote}
          </p>
          <p className="mt-1 text-[10px] leading-snug text-[var(--av-text-muted)]">
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
    <AvCard className="border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 to-transparent">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-base font-extrabold text-[var(--av-text-primary)]">{fix.fertilizer}</p>
          {fix.nutrientContent ? (
            <p className="mt-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {fix.nutrientContent}
            </p>
          ) : null}
        </div>
        <span className="rounded-lg bg-emerald-500/15 px-2 py-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-200">
          उपलब्ध
        </span>
      </div>
      <p className="mt-3 text-sm font-bold text-amber-800 dark:text-amber-200">{dose}</p>
      {fix.bestCropStage ? (
        <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">समय: {fix.bestCropStage}</p>
      ) : null}
      {cropNote ? (
        <p className="mt-2 rounded-lg border border-sky-500/20 bg-sky-500/8 px-2 py-1.5 text-[10px] text-sky-900 dark:text-sky-100">
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
            className="mt-3 space-y-1.5 overflow-hidden text-[11px] text-[var(--av-text-secondary)]"
          >
            {fix.methodOfApplication && <p>तरीका: {fix.methodOfApplication}</p>}
            {fix.waterQuantity && fix.waterQuantity !== "NA" && <p>पानी: {fix.waterQuantity}</p>}
            {fix.fertigationDose && fix.fertigationDose !== "NA" && (
              <p>ड्रिप: {fix.fertigationDose}</p>
            )}
            {fix.expectedRecoveryTime && <p>असर: {fix.expectedRecoveryTime}</p>}
            {fix.precautions && (
              <p className="text-amber-800 dark:text-amber-200">सावधानी: {fix.precautions}</p>
            )}
            <p className="text-[var(--av-text-muted)]">
              कीमत: बाज़ार अनुसार · ब्रांड: स्थानीय FCO उत्पाद
            </p>
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
    <AvCard className="!p-0 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="text-xs font-bold text-[var(--av-text-primary)]">{q}</span>
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
            <p className="pt-2 text-xs leading-relaxed text-[var(--av-text-secondary)]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </AvCard>
  );
}
