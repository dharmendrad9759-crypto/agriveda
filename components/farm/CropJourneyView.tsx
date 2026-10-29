"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  FarmField,
  CropSeason,
  FarmTask,
  CropStageDefinition,
  TaskStatus,
} from "@/lib/farm/types";
import { WHEAT_ZADOKS_STAGES, getWheatStageById, getWheatStageByDays } from "@/lib/farm/wheatZadoksStages";
import { calculateDaysAfterSowing } from "@/lib/farm/cropJourneyEngine";
import { useToast } from "@/components/ui/Toast";
import AppLink from "@/components/ui/AppLink";
import {
  Sprout,
  CheckCircle2,
  Circle,
  Calendar,
  AlertTriangle,
  Droplets,
  Leaf,
  Bug,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Plus,
  Camera,
  Layers,
  Award,
  Sparkles,
  X,
  Clock,
  ArrowRight,
} from "lucide-react";

interface CropJourneyViewProps {
  field: FarmField;
  activeSeason?: CropSeason;
  tasks: FarmTask[];
  onUpdateSeason?: (seasonId: string, updates: Partial<CropSeason>) => void;
  onUpdateTaskStatus?: (taskId: string, status: TaskStatus) => void;
  onAddTask?: (task: Omit<FarmTask, "id">) => void;
}

export default function CropJourneyView({
  field,
  activeSeason,
  tasks,
  onUpdateSeason,
  onUpdateTaskStatus,
  onAddTask,
}: CropJourneyViewProps) {
  const { showToast } = useToast();

  const das = useMemo(() => {
    if (activeSeason?.sowingDate) {
      return calculateDaysAfterSowing(activeSeason.sowingDate);
    }
    if (field.sowingDateIso) {
      return calculateDaysAfterSowing(field.sowingDateIso);
    }
    return 25;
  }, [activeSeason?.sowingDate, field.sowingDateIso]);

  const currentStageId = activeSeason?.currentStageId || "cri";
  const [selectedStageId, setSelectedStageId] = useState<string>(currentStageId);
  const [taskFilter, setTaskFilter] = useState<"all" | "pending" | "completed">("pending");

  // New task modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<FarmTask["category"]>("irrigation");
  const [newTaskNotes, setNewTaskNotes] = useState("");

  // Harvest modal
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [harvestYield, setHarvestYield] = useState("");
  const [harvestNotes, setHarvestNotes] = useState("");

  const currentStageDef = useMemo(() => {
    return getWheatStageById(currentStageId) || getWheatStageByDays(das);
  }, [currentStageId, das]);

  const selectedStageDef = useMemo(() => {
    return getWheatStageById(selectedStageId) || currentStageDef;
  }, [selectedStageId, currentStageDef]);

  const fieldTasks = useMemo(() => {
    return tasks.filter((t) => t.fieldId === field.id);
  }, [tasks, field.id]);

  const filteredTasks = useMemo(() => {
    if (taskFilter === "pending") {
      return fieldTasks.filter((t) => t.status !== "completed");
    }
    if (taskFilter === "completed") {
      return fieldTasks.filter((t) => t.status === "completed");
    }
    return fieldTasks;
  }, [fieldTasks, taskFilter]);

  const handleConfirmStage = (stageId: string) => {
    if (!activeSeason || !onUpdateSeason) return;

    onUpdateSeason(activeSeason.id, {
      currentStageId: stageId,
      farmerConfirmedStageId: stageId,
      stageEstimationMethod: "farmer_confirmed",
    });

    setSelectedStageId(stageId);
    showToast("फसल का चरण सफलतापूर्वक पुष्ट किया गया!", "success");
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddTask) return;

    onAddTask({
      fieldId: field.id,
      seasonId: activeSeason?.id || `cs-${field.id}`,
      cropId: "wheat",
      stageId: selectedStageId,
      category: newTaskCategory,
      titleHi: newTaskTitle,
      titleEn: newTaskTitle,
      descriptionHi: newTaskNotes,
      dueDaysAfterSowing: [das, das + 5],
      status: "due",
    });

    showToast("नया कार्य सूची में जोड़ा गया", "success");
    setShowTaskModal(false);
    setNewTaskTitle("");
    setNewTaskNotes("");
  };

  const handleHarvestSeason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSeason || !onUpdateSeason) return;

    onUpdateSeason(activeSeason.id, {
      seasonStatus: "harvested",
      actualHarvestDate: new Date().toISOString(),
      notes: `${harvestNotes} (पैदावार: ${harvestYield} क्विंटल/एकड़)`.trim(),
    });

    showToast("फसल कटाई संपन्न! रिकॉर्ड सहेज लिया गया।", "success");
    setShowHarvestModal(false);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner: Crop Age, Sowing Date & Current Stage */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 mb-1">
              {activeSeason?.stageEstimationMethod === "farmer_confirmed"
                ? "✓ किसान द्वारा पुष्ट चरण"
                : "🛰️ मौसम व GDD आधार अनुमान"}
            </span>
            <h1 className="text-base font-extrabold text-[var(--av-text-primary)]">
              {field.crop || "गेहूँ"} {field.variety ? `(${field.variety})` : ""}
            </h1>
            <p className="text-xs text-[var(--av-text-muted)]">
              बुवाई तिथि:{" "}
              {activeSeason?.sowingDate
                ? new Date(activeSeason.sowingDate).toLocaleDateString("hi-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "दर्ज नहीं"}
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {das}
            </span>
            <p className="text-[10px] font-bold text-[var(--av-text-muted)] uppercase">
              दिन की फसल (DAS)
            </p>
          </div>
        </div>

        {/* Current Active Stage Quick Box */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-900/10 via-emerald-800/5 to-teal-800/10 border border-emerald-500/20 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
              वर्तमान अवस्था (Current Stage):
            </p>
            <p className="text-sm font-black text-[var(--av-text-primary)]">
              {currentStageDef.stageNameHi} ({currentStageDef.zadoksCode})
            </p>
          </div>
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-emerald-600 text-white shadow-sm">
            {currentStageDef.typicalDaysRange[0]}-{currentStageDef.typicalDaysRange[1]} दिन
          </span>
        </div>
      </div>

      {/* Wheat Zadoks 10-Stage Horizontal Interactive Progression Bar */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-xs font-bold text-[var(--av-text-primary)]">
              गेहूँ विकास चक्र (Zadoks Z00 - Z99)
            </h2>
          </div>
          <span className="text-[10px] text-[var(--av-text-muted)]">
            चरण पर टैप करके जानकारी देखें
          </span>
        </div>

        {/* Horizontal Scrollable Stages */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {WHEAT_ZADOKS_STAGES.map((stage) => {
            const isCurrent = stage.stageId === currentStageId;
            const isSelected = stage.stageId === selectedStageId;
            const isPast = das > stage.typicalDaysRange[1];

            return (
              <button
                key={stage.stageId}
                type="button"
                onClick={() => setSelectedStageId(stage.stageId)}
                className={`flex-shrink-0 w-28 p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-emerald-800 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/50"
                    : isCurrent
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-[var(--av-text-primary)]"
                    : isPast
                    ? "bg-[var(--av-surface-inset)] border-[var(--av-border)] text-gray-500"
                    : "bg-[var(--av-surface)] border-[var(--av-border)] text-[var(--av-text-secondary)]"
                }`}
              >
                <div className="flex items-center justify-between text-[9px] mb-1 font-semibold">
                  <span>{stage.zadoksCode}</span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  {isPast && !isCurrent && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  )}
                </div>
                <p className={`text-[11px] font-bold line-clamp-2 ${isSelected ? "text-white" : ""}`}>
                  {stage.stageNameHi}
                </p>
                <p className={`text-[9px] mt-1 ${isSelected ? "text-emerald-100" : "text-[var(--av-text-muted)]"}`}>
                  {stage.typicalDaysRange[0]}-{stage.typicalDaysRange[1]} दिन
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail & Agronomic Guide */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-sm space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {selectedStageDef.zadoksCode}
              </span>
              <h3 className="text-sm font-extrabold text-[var(--av-text-primary)]">
                {selectedStageDef.stageNameHi} ({selectedStageDef.stageNameEn})
              </h3>
            </div>
            <p className="text-[11px] text-[var(--av-text-secondary)] mt-1">
              अवधि: {selectedStageDef.typicalDaysRange[0]} से {selectedStageDef.typicalDaysRange[1]} दिन
              {selectedStageDef.targetGDD ? ` • संचित GDD: ${selectedStageDef.targetGDD[0]}-${selectedStageDef.targetGDD[1]}°C` : ""}
            </p>
          </div>

          {selectedStageDef.stageId !== currentStageId && (
            <button
              type="button"
              onClick={() => handleConfirmStage(selectedStageDef.stageId)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold shrink-0 shadow-sm transition"
            >
              यह चरण चुनें
            </button>
          )}
        </div>

        {/* Identification Criteria */}
        {selectedStageDef.identificationCriteriaHi && selectedStageDef.identificationCriteriaHi.length > 0 && (
          <div className="p-3 rounded-xl bg-[var(--av-surface-inset)] border border-[var(--av-border)] text-xs space-y-1">
            <p className="font-bold text-[var(--av-text-primary)] flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              पहचान के लक्षण (Identification):
            </p>
            <ul className="space-y-1 text-[11px] text-[var(--av-text-secondary)]">
              {selectedStageDef.identificationCriteriaHi.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Irrigation & Fertilizer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {/* Irrigation */}
          <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-1">
            <p className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
              सिंचाई सलाह (Irrigation):
            </p>
            <p className="text-[11px] text-blue-800 dark:text-blue-300">
              {selectedStageDef.irrigationConsiderationsHi}
            </p>
          </div>

          {/* Fertilizer */}
          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-1">
            <p className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              खाद व पोषक तत्व (Nutrients):
            </p>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
              {selectedStageDef.nutrientManagementHi}
            </p>
          </div>
        </div>

        {/* Weed & Disease Scouting */}
        {(selectedStageDef.weedManagementHi || selectedStageDef.pestMonitoringHi) && (
          <div className="space-y-2 text-xs">
            {selectedStageDef.weedManagementHi && (
              <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
                <p className="font-bold text-[11px] mb-0.5">🌿 खरपतवार नियंत्रण:</p>
                <p className="text-[11px]">{selectedStageDef.weedManagementHi}</p>
              </div>
            )}
            {selectedStageDef.pestMonitoringHi && (
              <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200">
                <p className="font-bold text-[11px] mb-0.5">🐛 कीट व रोग निगरानी:</p>
                <p className="text-[11px]">{selectedStageDef.pestMonitoringHi}</p>
              </div>
            )}
          </div>
        )}

        {/* 5 Common Farmer Mistakes */}
        {selectedStageDef.commonMistakesHi && selectedStageDef.commonMistakesHi.length > 0 && (
          <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-1.5">
            <p className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              किसान भाइयों की इस चरण की बड़ी गलतियां (गलतियों से बचें):
            </p>
            <ul className="space-y-1 text-[11px] text-rose-900 dark:text-rose-200">
              {selectedStageDef.commonMistakesHi.map((mistake, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Stage Tasks List */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <Calendar className="w-4 h-4" />
            </span>
            <h2 className="text-xs font-bold text-[var(--av-text-primary)]">
              फसल कार्य सूची ({filteredTasks.length})
            </h2>
          </div>

          {/* Add Task Button */}
          <button
            type="button"
            onClick={() => setShowTaskModal(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-700 text-white text-[11px] font-bold shadow-sm hover:bg-emerald-800 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>कार्य जोड़ें</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5">
          {(
            [
              { id: "pending", label: "बाकी कार्य" },
              { id: "completed", label: "पूर्ण" },
              { id: "all", label: "सभी" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTaskFilter(tab.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                taskFilter === tab.id
                  ? "bg-emerald-800 text-white"
                  : "bg-[var(--av-surface-inset)] border border-[var(--av-border)] text-[var(--av-text-secondary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Task Cards */}
        {filteredTasks.length === 0 ? (
          <p className="text-xs text-[var(--av-text-muted)] py-4 text-center">
            कोई कार्य नहीं मिला।
          </p>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((t) => {
              const isCompleted = t.status === "completed";
              return (
                <div
                  key={t.id}
                  className={`p-3 rounded-xl border transition ${
                    isCompleted
                      ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 opacity-80"
                      : "bg-[var(--av-surface-inset)] border-[var(--av-border)]"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateTaskStatus?.(t.id, isCompleted ? "due" : "completed")
                      }
                      className="mt-0.5 text-gray-400 hover:text-emerald-600"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-xs font-bold leading-tight ${
                            isCompleted ? "line-through text-gray-500" : "text-[var(--av-text-primary)]"
                          }`}
                        >
                          {t.titleHi || (t as any).title}
                        </span>
                        {t.status === "due" && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300">
                            तुरंत करें
                          </span>
                        )}
                      </div>
                      {(t.descriptionHi || (t as any).description) && (
                        <p className="text-[11px] text-[var(--av-text-secondary)] mt-1">
                          {t.descriptionHi || (t as any).description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Harvest Season Action Card */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-[var(--av-text-primary)]">
            फसल कटाई संपन्न?
          </h3>
          <p className="text-[10px] text-[var(--av-text-muted)]">
            कटाई दर्ज करके यह सीजन समाप्त करें व नया सीजन शुरू करें।
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowHarvestModal(true)}
          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition"
        >
          कटाई पूरी करें
        </button>
      </div>

      {/* Modal: Add Task */}
      {showTaskModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--av-surface)] rounded-2xl border border-[var(--av-border)] p-4 max-w-sm w-full space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--av-text-primary)] flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                नया फसल कार्य जोड़ें
              </h3>
              <button
                type="button"
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[var(--av-text-secondary)] mb-1">
                  कार्य का नाम
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="जैसे: कल्ले फूटते समय यूरिया का बुरकाव"
                  className="w-full text-xs p-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--av-text-secondary)] mb-1">
                  विवरण / मात्रा
                </label>
                <textarea
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="आवश्यक निर्देश या दवा की मात्रा..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[var(--av-border)] text-xs font-bold text-[var(--av-text-secondary)]"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-md hover:bg-emerald-800"
                >
                  कार्य जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Harvest Season */}
      {showHarvestModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--av-surface)] rounded-2xl border border-[var(--av-border)] p-4 max-w-sm w-full space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--av-text-primary)] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                फसल कटाई व पैदावार दर्ज करें
              </h3>
              <button
                type="button"
                onClick={() => setShowHarvestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleHarvestSeason} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[var(--av-text-secondary)] mb-1">
                  कुल पैदावार (क्विंटल प्रति एकड़)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={harvestYield}
                  onChange={(e) => setHarvestYield(e.target.value)}
                  placeholder="जैसे: 24.5"
                  className="w-full text-xs p-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--av-text-secondary)] mb-1">
                  कटाई संबंधी अनुभव व समीक्षा
                </label>
                <textarea
                  value={harvestNotes}
                  onChange={(e) => setHarvestNotes(e.target.value)}
                  placeholder="दाना की गुणवत्ता, मौसम का प्रभाव, बीज का प्रदर्शन..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowHarvestModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[var(--av-border)] text-xs font-bold text-[var(--av-text-secondary)]"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-md hover:bg-amber-700"
                >
                  कटाई सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
