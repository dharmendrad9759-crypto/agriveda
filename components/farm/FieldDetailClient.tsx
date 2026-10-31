"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useFarmData } from "@/hooks/useFarmData";
import AppLink from "@/components/ui/AppLink";
import FieldSwitcher from "@/components/farm/FieldSwitcher";
import LiveFarmView from "@/components/farm/LiveFarmView";
import HealthRadarView from "@/components/farm/HealthRadarView";
import CropJourneyView from "@/components/farm/CropJourneyView";
import {
  calculateDaysAfterSowing,
  estimateWheatStage,
  generateWheatSeasonTasks,
  isWheatCrop,
  updateTaskStatusesByAge,
} from "@/lib/farm/cropJourneyEngine";
import { cn } from "@/lib/cn";
import { EASE_OUT, MOTION, tabPanel } from "@/lib/motion/variants";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Radio,
  Sprout,
  Compass,
  Tractor,
} from "lucide-react";

interface FieldDetailClientProps {
  fieldId: string;
  initialTab?: string;
}

type FarmTab = "live" | "radar" | "journey";

const TABS: { id: FarmTab; label: string; icon: LucideIcon }[] = [
  { id: "live", label: "खेत स्थिति", icon: Compass },
  { id: "radar", label: "फसल सेहत", icon: Radio },
  { id: "journey", label: "फसल बढ़वार", icon: Sprout },
];

function validTab(tab?: string | null): FarmTab {
  return tab === "radar" || tab === "journey" ? tab : "live";
}

function currentSeasonLabel(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  if (month >= 5 && month <= 9) return `खरीफ ${year}`;
  if (month >= 10) return `रबी ${year}-${String(year + 1).slice(2)}`;
  return `रबी ${year - 1}-${String(year).slice(2)}`;
}

export default function FieldDetailClient({
  fieldId,
  initialTab = "live",
}: FieldDetailClientProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const {
    data,
    hydrated,
    addSeason,
    updateSeason,
    updateField,
    addTask,
    updateTaskStatus,
    addObservation,
    deleteObservation,
    addActivity,
  } = useFarmData();

  const [activeTab, setActiveTab] = useState<FarmTab>(validTab(initialTab));
  const initializedFor = useRef<string | null>(null);
  const derivedSignature = useRef<string>("");

  const field = useMemo(
    () => data.fields.find((item) => item.id === fieldId),
    [data.fields, fieldId]
  );

  const activeSeason = useMemo(
    () =>
      data.seasons.find(
        (season) => season.fieldId === fieldId && season.seasonStatus === "active"
      ),
    [data.seasons, fieldId]
  );

  const hasAnySeason = useMemo(
    () => data.seasons.some((season) => season.fieldId === fieldId),
    [data.seasons, fieldId]
  );

  // Keep the active tab in sync with browser back/forward navigation.
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(validTab(params.get("tab")));
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  // Create a season only for fields that have never had one. Harvested seasons
  // stay harvested; the farmer can explicitly start a fresh season instead.
  const startSeason = useCallback((sowingDateOverride?: string) => {
    if (!field) return;
    initializedFor.current = field.id;

    const wheat = isWheatCrop(field);
    const sowingIso =
      sowingDateOverride || field.sowingDateIso || new Date().toISOString();

    if (sowingDateOverride) {
      updateField(field.id, {
        sowingDateIso: sowingDateOverride,
        sowingDate: sowingDateOverride,
        status: "Active",
      });
    }
    const cropId = wheat ? "wheat" : field.cropSlug || "other";

    const estimated = estimateWheatStage({
      id: "",
      fieldId: field.id,
      cropId,
      cropName: field.crop || "फसल",
      seasonName: currentSeasonLabel(),
      sowingDate: sowingIso,
      currentStageId: "cri",
      stageEstimationMethod: "agronomic_window",
      seasonStatus: "active",
      createdAt: "",
      updatedAt: "",
    });

    const seasonId = addSeason({
      fieldId: field.id,
      cropId,
      cropName: field.crop || "फसल",
      variety: field.variety,
      seasonName: currentSeasonLabel(),
      sowingDate: sowingIso,
      currentStageId: wheat ? estimated.stage.stageId : field.stage || "germination",
      stageEstimationMethod: wheat ? estimated.method : "farmer_confirmed",
      seasonStatus: "active",
    });

    if (wheat) {
      generateWheatSeasonTasks(seasonId, field.id).forEach((task) => addTask(task));
    }
  }, [field, addSeason, addTask, updateField]);

  useEffect(() => {
    if (!hydrated || !field || hasAnySeason) return;
    if (initializedFor.current === field.id) return;
    startSeason();
  }, [hydrated, field, hasAnySeason, startSeason]);

  // Derive due/upcoming statuses from crop age for the active season only.
  useEffect(() => {
    if (!hydrated || !activeSeason) return;

    const seasonTasks = data.tasks.filter(
      (task) => task.seasonId === activeSeason.id
    );
    if (seasonTasks.length === 0) return;

    const age = calculateDaysAfterSowing(activeSeason.sowingDate);
    const derived = updateTaskStatusesByAge(seasonTasks, age);
    const signature = derived
      .map((task) => `${task.id}:${task.status}`)
      .join("|");

    if (signature === derivedSignature.current) return;
    derivedSignature.current = signature;

    derived.forEach((task, index) => {
      if (task.status !== seasonTasks[index]?.status) {
        updateTaskStatus(task.id, task.status);
      }
    });
  }, [hydrated, activeSeason, data.tasks, updateTaskStatus]);

  const handleSwitchTab = (tab: FarmTab) => {
    setActiveTab(tab);
    window.history.replaceState(null, "", `/my-farm/${fieldId}?tab=${tab}`);
  };

  const handleSelectField = (newFieldId: string) => {
    router.push(`/my-farm/${newFieldId}?tab=${activeTab}`);
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--av-surface-inset)] p-6 text-center">
        <div className="space-y-3">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-[3px] border-emerald-600 border-t-transparent" />
          <p className="text-[11px] font-medium text-[var(--av-text-muted)]">
            खेत डेटा लोड हो रहा है…
          </p>
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--av-surface-inset)] p-6 text-center">
        <div className="w-full max-w-sm space-y-4 rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-6 shadow-[var(--av-shadow-md)]">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            <Tractor className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-sm font-semibold text-[var(--av-text-primary)]">
              खेत नहीं मिला
            </h1>
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--av-text-muted)]">
              यह खेत हटाया जा चुका है या लिंक अमान्य है।
            </p>
          </div>
          <AppLink
            href="/my-farm"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <ArrowLeft className="h-4 w-4" />
            मेरे खेत
          </AppLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--av-surface-inset)] text-[var(--av-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--av-border)] bg-[var(--av-surface)]/95 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 pb-2 pt-3">
          <div className="flex items-center gap-2">
            <AppLink
              href="/my-farm"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)] transition hover:text-[var(--av-text-primary)]"
              aria-label="वापस जाएं"
            >
              <ArrowLeft className="h-4 w-4" />
            </AppLink>

            <div className="min-w-0 flex-1">
              <FieldSwitcher
                fields={data.fields}
                selectedFieldId={field.id}
                onSelectField={handleSelectField}
              />
            </div>

            <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-[var(--av-surface-inset)] px-2.5 py-1 text-[9.5px] font-medium text-[var(--av-text-muted)] sm:flex">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  field.status === "Active"
                    ? "bg-emerald-500"
                    : "bg-[var(--av-text-muted)]"
                )}
              />
              {field.status === "Active" ? "सक्रिय" : field.status}
            </span>
          </div>

          <nav
            className="relative mt-2.5 grid grid-cols-3 gap-1 rounded-2xl bg-[var(--av-surface-inset)] p-1"
            aria-label="खेत दृश्य"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSwitchTab(tab.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-xl py-2 text-[11px] font-semibold transition",
                    active
                      ? "text-[var(--av-text-primary)]"
                      : "text-[var(--av-text-muted)] hover:text-[var(--av-text-secondary)]"
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="farm-tab-indicator"
                      className="absolute inset-0 rounded-xl bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34 }
                      }
                    />
                  ) : null}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5",
                        active
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-current"
                      )}
                    />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            variants={tabPanel}
            initial={reduced ? false : "initial"}
            animate="animate"
            exit={reduced ? undefined : "exit"}
            transition={{ duration: MOTION.normal, ease: EASE_OUT }}
          >
            {activeTab === "live" ? (
              <LiveFarmView
                field={field}
                activeSeason={activeSeason}
                tasks={data.tasks}
                observations={data.observations}
                onSwitchTab={handleSwitchTab}
                onUpdateTaskStatus={updateTaskStatus}
                onAddObservation={addObservation}
                onDeleteObservation={deleteObservation}
                onAddActivity={addActivity}
              />
            ) : null}

            {activeTab === "radar" ? (
              <HealthRadarView
                field={field}
                activeSeason={activeSeason}
                satelliteObservations={data.satelliteObservations}
                onAddObservation={addObservation}
              />
            ) : null}

            {activeTab === "journey" ? (
              <CropJourneyView
                field={field}
                activeSeason={activeSeason}
                hasSeasonHistory={hasAnySeason}
                tasks={data.tasks}
                onUpdateSeason={updateSeason}
                onUpdateTaskStatus={updateTaskStatus}
                onAddTask={addTask}
                onStartSeason={startSeason}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
