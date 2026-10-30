"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  FarmField,
  CropSeason,
  FarmTask,
  TaskStatus,
} from "@/lib/farm/types";
import {
  getWheatStageById,
  getWheatStageByDays,
} from "@/lib/farm/wheatZadoksStages";
import {
  calculateDaysAfterSowing,
  isWheatCrop,
} from "@/lib/farm/cropJourneyEngine";
import WheatStageVisualizer from "@/components/farm/WheatStageVisualizer";
import FarmSheet from "@/components/farm/FarmSheet";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Sprout,
  CheckCircle2,
  Circle,
  CalendarDays,
  Droplets,
  Leaf,
  Bug,
  ShieldAlert,
  Plus,
  Award,
  Sparkles,
  Clock,
  X,
  ChevronDown,
  Wheat,
  Shovel,
  Search,
  SprayCan,
  FlaskConical,
  ScanSearch,
  type LucideIcon,
} from "lucide-react";

interface CropJourneyViewProps {
  field: FarmField;
  activeSeason?: CropSeason;
  hasSeasonHistory?: boolean;
  tasks: FarmTask[];
  onUpdateSeason?: (seasonId: string, updates: Partial<CropSeason>) => void;
  onUpdateTaskStatus?: (taskId: string, status: TaskStatus) => void;
  onAddTask?: (task: Omit<FarmTask, "id">) => void;
  onStartSeason?: (sowingDate?: string) => void;
}

const TASK_CATEGORIES: {
  id: FarmTask["category"];
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "irrigation", label: "सिंचाई", icon: Droplets },
  { id: "fertilizer", label: "खाद", icon: FlaskConical },
  { id: "weeding", label: "निराई", icon: Shovel },
  { id: "scouting", label: "निगरानी", icon: Search },
  { id: "spray", label: "छिड़काव", icon: SprayCan },
  { id: "harvest", label: "कटाई", icon: Wheat },
];

function categoryMeta(category: FarmTask["category"]) {
  return (
    TASK_CATEGORIES.find((item) => item.id === category) ?? {
      id: category,
      label: category,
      icon: ScanSearch,
    }
  );
}

function todayLocalISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export default function CropJourneyView({
  field,
  activeSeason,
  hasSeasonHistory = false,
  tasks,
  onUpdateSeason,
  onUpdateTaskStatus,
  onAddTask,
  onStartSeason,
}: CropJourneyViewProps) {
  const { showToast } = useToast();
  const reduced = useReducedMotion();

  const das = useMemo(() => {
    const sowingDate = activeSeason?.sowingDate || field.sowingDateIso;
    return sowingDate ? calculateDaysAfterSowing(sowingDate) : 25;
  }, [activeSeason?.sowingDate, field.sowingDateIso]);

  const isWheat = field.crop
    ? isWheatCrop(field)
    : isWheatCrop(activeSeason);

  const currentStageId = activeSeason?.currentStageId || "cri";
  const [selectedStageId, setSelectedStageId] = useState<string>(currentStageId);
  const [syncedStageId, setSyncedStageId] = useState<string>(currentStageId);
  const [taskFilter, setTaskFilter] =
    useState<"all" | "pending" | "completed">("pending");
  const [showMistakes, setShowMistakes] = useState(false);

  // Adjust the selected stage at render time when the season's stage changes
  // externally, without a cascading setState-in-effect.
  if (currentStageId !== syncedStageId) {
    setSyncedStageId(currentStageId);
    setSelectedStageId(currentStageId);
  }

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] =
    useState<FarmTask["category"]>("irrigation");
  const [newTaskNotes, setNewTaskNotes] = useState("");

  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [harvestYield, setHarvestYield] = useState("");
  const [harvestNotes, setHarvestNotes] = useState("");

  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [seasonSowingDate, setSeasonSowingDate] = useState("");

  const currentStageDef = useMemo(() => {
    return getWheatStageById(currentStageId) || getWheatStageByDays(das);
  }, [currentStageId, das]);

  const selectedStageDef = useMemo(() => {
    return getWheatStageById(selectedStageId) || currentStageDef;
  }, [selectedStageId, currentStageDef]);

  const seasonTasks = useMemo(() => {
    if (!activeSeason) return [];
    return tasks.filter(
      (task) =>
        task.fieldId === field.id && task.seasonId === activeSeason.id
    );
  }, [tasks, field.id, activeSeason]);

  const filteredTasks = useMemo(() => {
    if (taskFilter === "pending") {
      return seasonTasks.filter((task) => task.status !== "completed");
    }
    if (taskFilter === "completed") {
      return seasonTasks.filter((task) => task.status === "completed");
    }
    return seasonTasks;
  }, [seasonTasks, taskFilter]);

  const pendingCount = useMemo(
    () => seasonTasks.filter((task) => task.status !== "completed").length,
    [seasonTasks]
  );

  const completedCount = seasonTasks.length - pendingCount;

  const openSeasonSheet = () => {
    setSeasonSowingDate(todayLocalISO());
    setShowSeasonModal(true);
  };

  const closeSeasonSheet = () => {
    setShowSeasonModal(false);
  };

  const handleStartSeason = (event: FormEvent) => {
    event.preventDefault();
    if (!seasonSowingDate) return;
    onStartSeason?.(seasonSowingDate);
    showToast("नया सीजन शुरू हो गया", "success");
    setShowSeasonModal(false);
  };

  if (!activeSeason) {
    return (
      <div className="space-y-3.5 pb-12">
        <section className="relative overflow-hidden rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-5 text-center shadow-[var(--av-shadow-sm)]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl"
          />
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            <CalendarDays className="h-6 w-6" />
          </span>
          <h2 className="mt-3 text-sm font-semibold text-[var(--av-text-primary)]">
            {hasSeasonHistory
              ? `${field.crop || "यह फसल"} का सीजन पूरा हो चुका है`
              : "नया सीजन शुरू करें"}
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-[11px] leading-relaxed text-[var(--av-text-muted)]">
            {hasSeasonHistory
              ? "कटाई दर्ज हो चुकी है। अगली बुवाई की तारीख चुनकर नया 360° सफर शुरू करें।"
              : "बुवाई की तारीख जोड़कर चरण-वार कार्य और सिंचाई योजना सक्रिय करें।"}
          </p>

          {onStartSeason ? (
            <button
              type="button"
              onClick={openSeasonSheet}
              className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.99]"
            >
              <Plus className="h-4 w-4" />
              {hasSeasonHistory ? "नया सीजन शुरू करें" : "सीजन जोड़ें"}
            </button>
          ) : null}
        </section>

        <FarmSheet
          open={showSeasonModal}
          onClose={closeSeasonSheet}
          title="नया सीजन शुरू करें"
          subtitle="बुवाई की तारीख से चरण और कार्य तय होंगे"
          icon={<CalendarDays className="h-4 w-4" />}
        >
          <form onSubmit={handleStartSeason} className="space-y-3.5">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[var(--av-text-secondary)]">
                बुवाई की तारीख
              </label>
              <input
                type="date"
                value={seasonSowingDate}
                onChange={(event) => setSeasonSowingDate(event.target.value)}
                required
                className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5 text-xs font-medium text-[var(--av-text-primary)] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <p className="mt-1.5 text-[10px] leading-snug text-[var(--av-text-muted)]">
                इसी तारीख से दिन-गणना, चरण और कार्यों की समय-सीमा तय होगी।
              </p>
            </div>

            <div className="flex gap-2 pt-0.5">
              <button
                type="button"
                onClick={closeSeasonSheet}
                className="flex-1 rounded-xl border border-[var(--av-border)] py-2.5 text-xs font-semibold text-[var(--av-text-secondary)] transition hover:bg-[var(--av-surface-inset)]"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.99]"
              >
                सीजन शुरू करें
              </button>
            </div>
          </form>
        </FarmSheet>
      </div>
    );
  }

  const handleConfirmStage = (stageId: string) => {
    if (!activeSeason || !onUpdateSeason) return;

    onUpdateSeason(activeSeason.id, {
      currentStageId: stageId,
      farmerConfirmedStageId: stageId,
      stageEstimationMethod: "farmer_confirmed",
    });

    setSelectedStageId(stageId);
    showToast("फसल का चरण पुष्ट हो गया", "success");
  };

  const closeTaskSheet = () => {
    setShowTaskModal(false);
    setNewTaskTitle("");
    setNewTaskNotes("");
  };

  const handleCreateTask = (event: FormEvent) => {
    event.preventDefault();
    if (!onAddTask || !activeSeason) return;

    onAddTask({
      fieldId: field.id,
      seasonId: activeSeason.id,
      cropId: activeSeason.cropId,
      stageId: selectedStageId,
      category: newTaskCategory,
      titleHi: newTaskTitle,
      titleEn: newTaskTitle,
      descriptionHi: newTaskNotes,
      dueDaysAfterSowing: [das, das + 5],
      status: "due",
    });

    showToast("नया कार्य जोड़ा गया", "success");
    closeTaskSheet();
  };

  const closeHarvestSheet = () => {
    setShowHarvestModal(false);
    setHarvestYield("");
    setHarvestNotes("");
  };

  const handleHarvestSeason = (event: FormEvent) => {
    event.preventDefault();
    if (!activeSeason || !onUpdateSeason) return;

    const yieldNote = harvestYield
      ? `पैदावार: ${harvestYield} क्विंटल/एकड़`
      : "";
    const notes = [harvestNotes.trim(), yieldNote].filter(Boolean).join(" · ");

    onUpdateSeason(activeSeason.id, {
      seasonStatus: "harvested",
      actualHarvestDate: new Date().toISOString(),
      notes: notes || activeSeason.notes,
    });

    showToast("कटाई दर्ज हो गई", "success");
    closeHarvestSheet();
  };

  const tasksSection = (
    <section className="rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-[var(--av-shadow-sm)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300">
            <CalendarDays className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[13px] font-semibold leading-tight text-[var(--av-text-primary)]">
              फसल कार्य
            </h2>
            <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">
              {pendingCount} बाकी · {completedCount} पूर्ण
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTaskModal(true)}
          disabled={!activeSeason}
          className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-emerald-700 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
          जोड़ें
        </button>
      </div>

      <div className="mt-3 flex gap-1 rounded-xl bg-[var(--av-surface-inset)] p-1">
        {(
          [
            { id: "pending", label: "बाकी" },
            { id: "completed", label: "पूर्ण" },
            { id: "all", label: "सभी" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTaskFilter(tab.id)}
            className={cn(
              "relative flex-1 rounded-lg py-1.5 text-[11px] font-semibold transition",
              taskFilter === tab.id
                ? "bg-[var(--av-surface)] text-[var(--av-text-primary)] shadow-sm"
                : "text-[var(--av-text-muted)] hover:text-[var(--av-text-secondary)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-[var(--av-surface-inset)] px-3 py-2.5 text-[11px] text-[var(--av-text-muted)]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          {taskFilter === "pending"
            ? "इस सीजन के सभी कार्य पूरे हैं।"
            : "इस सूची में कोई कार्य नहीं है।"}
        </div>
      ) : (
        <div className="mt-2 space-y-1.5">
          {filteredTasks.map((task) => {
            const completed = task.status === "completed";
            const meta = categoryMeta(task.category);
            const Icon = meta.icon;

            return (
              <div
                key={task.id}
                className={cn(
                  "flex items-start gap-2.5 rounded-xl border px-2.5 py-2 transition",
                  completed
                    ? "border-emerald-500/15 bg-emerald-500/5 opacity-75"
                    : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    onUpdateTaskStatus?.(task.id, completed ? "due" : "completed")
                  }
                  className="mt-0.5 shrink-0 text-[var(--av-text-muted)] transition hover:text-emerald-600"
                  aria-label="कार्य पूर्ण करें"
                >
                  {completed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-1.5">
                    <p
                      className={cn(
                        "min-w-0 flex-1 text-[11.5px] font-medium leading-snug",
                        completed
                          ? "text-[var(--av-text-muted)] line-through"
                          : "text-[var(--av-text-primary)]"
                      )}
                    >
                      {task.titleHi}
                    </p>
                    {task.status === "due" ? (
                      <span className="shrink-0 rounded-md bg-rose-500/12 px-1.5 py-0.5 text-[9px] font-semibold text-rose-700 dark:text-rose-300">
                        अभी
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[9.5px] text-[var(--av-text-muted)]">
                    <Icon className="h-3 w-3" />
                    <span>{meta.label}</span>
                    <span className="text-[var(--av-border)]">·</span>
                    <Clock className="h-3 w-3" />
                    <span>
                      दिन {task.dueDaysAfterSowing[0]}–{task.dueDaysAfterSowing[1]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );

  const harvestSection = activeSeason ? (
    <section className="flex items-center justify-between gap-3 rounded-3xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-[var(--av-surface)] to-transparent p-3.5 shadow-[var(--av-shadow-sm)]">
      <div className="min-w-0">
        <h3 className="text-[12px] font-semibold text-[var(--av-text-primary)]">
          फसल कटाई संपन्न?
        </h3>
        <p className="mt-0.5 text-[10px] leading-snug text-[var(--av-text-muted)]">
          कटाई दर्ज कर सीजन बंद करें और नया सीजन शुरू करें।
        </p>
      </div>
      <button
        type="button"
        onClick={() => setShowHarvestModal(true)}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-amber-700 active:scale-95"
      >
        <Award className="h-3.5 w-3.5" />
        कटाई दर्ज करें
      </button>
    </section>
  ) : null;

  if (!isWheat) {
    return (
      <div className="space-y-3.5 pb-12">
        <section className="relative overflow-hidden rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-5 text-center shadow-[var(--av-shadow-sm)]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl"
          />
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            <Sprout className="h-6 w-6" />
          </span>
          <h2 className="mt-3 text-sm font-semibold text-[var(--av-text-primary)]">
            {field.crop || activeSeason?.cropName || "इस फसल"} के लिए 360° सफर
            तैयार हो रहा है
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-[11px] leading-relaxed text-[var(--av-text-muted)]">
            चरण-वार वैज्ञानिक मार्गदर्शन फिलहाल गेहूँ के लिए उपलब्ध है। आप इस
            सीजन के कार्य यहाँ प्रबंधित कर सकते हैं।
          </p>

          <div className="mx-auto mt-4 grid max-w-xs grid-cols-3 divide-x divide-[var(--av-border-subtle)] rounded-2xl bg-[var(--av-surface-inset)] py-2.5">
            <div>
              <p className="text-base font-semibold tabular-nums text-[var(--av-text-primary)]">
                {das}
              </p>
              <p className="mt-0.5 text-[9px] text-[var(--av-text-muted)]">
                दिन बाद
              </p>
            </div>
            <div>
              <p className="text-base font-semibold tabular-nums text-[var(--av-text-primary)]">
                {pendingCount}
              </p>
              <p className="mt-0.5 text-[9px] text-[var(--av-text-muted)]">
                कार्य बाकी
              </p>
            </div>
            <div>
              <p className="text-base font-semibold tabular-nums text-[var(--av-text-primary)]">
                {completedCount}
              </p>
              <p className="mt-0.5 text-[9px] text-[var(--av-text-muted)]">
                पूर्ण
              </p>
            </div>
          </div>
        </section>

        {tasksSection}
        {harvestSection}
        {taskAndHarvestSheets()}
      </div>
    );
  }

  return (
    <div className="space-y-3.5 pb-12">
      <WheatStageVisualizer
        currentStage={currentStageDef}
        selectedStage={selectedStageDef}
        das={das}
        totalDays={135}
        onSelectStage={(stageId) => setSelectedStageId(stageId)}
      />

      {/* Selected stage detail */}
      <section className="rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--av-border-subtle)] pb-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 dark:text-amber-300">
                चरण {selectedStageDef.stageOrder + 1}
              </span>
              <h2 className="text-[15px] font-semibold leading-tight text-[var(--av-text-primary)]">
                {selectedStageDef.stageNameHi}
              </h2>
            </div>
            <p className="mt-1 text-[10.5px] text-[var(--av-text-muted)]">
              अवधि {selectedStageDef.typicalDaysRange[0]}–
              {selectedStageDef.typicalDaysRange[1]} दिन
              {selectedStageDef.targetGDD
                ? ` · GDD ${selectedStageDef.targetGDD[0]}–${selectedStageDef.targetGDD[1]}°C`
                : ""}
            </p>
          </div>

          {selectedStageDef.stageId !== currentStageId ? (
            <button
              type="button"
              onClick={() => handleConfirmStage(selectedStageDef.stageId)}
              disabled={!activeSeason}
              className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-emerald-700 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              चुनें
            </button>
          ) : (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1 text-[9.5px] font-semibold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-3 w-3" />
              वर्तमान
            </span>
          )}
        </div>

        <p className="mt-3 text-[11.5px] leading-relaxed text-[var(--av-text-secondary)]">
          {selectedStageDef.descriptionHi}
        </p>

        {selectedStageDef.identificationCriteriaHi.length > 0 ? (
          <div className="mt-3 rounded-2xl bg-[var(--av-surface-inset)] p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--av-text-primary)]">
              <Sprout className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
              खेत में पहचानें
            </p>
            <ul className="mt-2 space-y-1.5">
              {selectedStageDef.identificationCriteriaHi.map((criterion) => (
                <li
                  key={criterion}
                  className="flex items-start gap-2 text-[11px] leading-relaxed text-[var(--av-text-secondary)]"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                  {criterion}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-800 dark:text-sky-200">
              <Droplets className="h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-300" />
              सिंचाई
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--av-text-secondary)]">
              {selectedStageDef.irrigationConsiderationsHi}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-200">
              <Leaf className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-300" />
              खाद व पोषण
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--av-text-secondary)]">
              {selectedStageDef.nutrientManagementHi}
            </p>
          </div>
        </div>

        {selectedStageDef.weedManagementHi || selectedStageDef.pestMonitoringHi ? (
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {selectedStageDef.weedManagementHi ? (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 dark:text-amber-200">
                  <Sprout className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-300" />
                  खरपतवार नियंत्रण
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--av-text-secondary)]">
                  {selectedStageDef.weedManagementHi}
                </p>
              </div>
            ) : null}

            {selectedStageDef.pestMonitoringHi ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-800 dark:text-rose-200">
                  <Bug className="h-3.5 w-3.5 shrink-0 text-rose-600 dark:text-rose-300" />
                  कीट व रोग निगरानी
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--av-text-secondary)]">
                  {selectedStageDef.pestMonitoringHi}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {selectedStageDef.commonMistakesHi.length > 0 ? (
          <div className="mt-2.5 overflow-hidden rounded-2xl border border-rose-500/20 bg-rose-500/5">
            <button
              type="button"
              onClick={() => setShowMistakes((open) => !open)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
              aria-expanded={showMistakes}
            >
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-800 dark:text-rose-200">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-rose-600 dark:text-rose-300" />
                बचने योग्य गलतियां
                <span className="rounded-md bg-rose-500/12 px-1.5 py-0.5 text-[9px] font-medium">
                  {selectedStageDef.commonMistakesHi.length}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-rose-600 transition-transform dark:text-rose-300",
                  showMistakes && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {showMistakes ? (
                <motion.div
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-1.5 border-t border-rose-500/15 px-3 py-2.5">
                    {selectedStageDef.commonMistakesHi.map((mistake) => (
                      <li
                        key={mistake}
                        className="flex items-start gap-2 text-[11px] leading-relaxed text-[var(--av-text-secondary)]"
                      >
                        <X className="mt-0.5 h-3 w-3 shrink-0 text-rose-500" />
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ) : null}
      </section>

      {tasksSection}
      {harvestSection}
      {taskAndHarvestSheets()}
    </div>
  );

  function taskAndHarvestSheets() {
    return (
      <>
        <FarmSheet
          open={showTaskModal}
          onClose={closeTaskSheet}
          title="नया कार्य जोड़ें"
          subtitle={`चरण: ${selectedStageDef.stageNameHi}`}
          icon={<Plus className="h-4 w-4" />}
        >
          <form onSubmit={handleCreateTask} className="space-y-3.5">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[var(--av-text-secondary)]">
                कार्य का नाम
              </label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                placeholder="जैसे: कल्ले फूटते समय यूरिया का बुरकाव"
                className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5 text-xs text-[var(--av-text-primary)] outline-none transition placeholder:text-[var(--av-text-muted)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[var(--av-text-secondary)]">
                श्रेणी
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {TASK_CATEGORIES.map((option) => {
                  const Icon = option.icon;
                  const selected = newTaskCategory === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setNewTaskCategory(option.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-[10px] font-medium transition active:scale-95",
                        selected
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                          : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          selected
                            ? "text-white"
                            : "text-emerald-600 dark:text-emerald-300"
                        )}
                      />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[var(--av-text-secondary)]">
                विवरण / मात्रा
              </label>
              <textarea
                value={newTaskNotes}
                onChange={(event) => setNewTaskNotes(event.target.value)}
                placeholder="आवश्यक निर्देश या दवा की मात्रा…"
                rows={2}
                className="w-full resize-none rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5 text-xs text-[var(--av-text-primary)] outline-none transition placeholder:text-[var(--av-text-muted)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex gap-2 pt-0.5">
              <button
                type="button"
                onClick={closeTaskSheet}
                className="flex-1 rounded-xl border border-[var(--av-border)] py-2.5 text-xs font-semibold text-[var(--av-text-secondary)] transition hover:bg-[var(--av-surface-inset)]"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.99]"
              >
                जोड़ें
              </button>
            </div>
          </form>
        </FarmSheet>

        <FarmSheet
          open={showHarvestModal}
          onClose={closeHarvestSheet}
          title="कटाई दर्ज करें"
          subtitle="सीजन बंद करके पैदावार सहेजें"
          icon={<Award className="h-4 w-4" />}
        >
          <form onSubmit={handleHarvestSeason} className="space-y-3.5">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[var(--av-text-secondary)]">
                पैदावार (क्विंटल प्रति एकड़)
              </label>
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                value={harvestYield}
                onChange={(event) => setHarvestYield(event.target.value)}
                placeholder="जैसे: 24.5"
                className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5 text-xs text-[var(--av-text-primary)] outline-none transition placeholder:text-[var(--av-text-muted)] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[var(--av-text-secondary)]">
                अनुभव व समीक्षा
              </label>
              <textarea
                value={harvestNotes}
                onChange={(event) => setHarvestNotes(event.target.value)}
                placeholder="दाने की गुणवत्ता, मौसम का प्रभाव, बीज का प्रदर्शन…"
                rows={3}
                className="w-full resize-none rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5 text-xs text-[var(--av-text-primary)] outline-none transition placeholder:text-[var(--av-text-muted)] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="flex gap-2 pt-0.5">
              <button
                type="button"
                onClick={closeHarvestSheet}
                className="flex-1 rounded-xl border border-[var(--av-border)] py-2.5 text-xs font-semibold text-[var(--av-text-secondary)] transition hover:bg-[var(--av-surface-inset)]"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-amber-600 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700 active:scale-[0.99]"
              >
                कटाई सहेजें
              </button>
            </div>
          </form>
        </FarmSheet>
      </>
    );
  }
}
