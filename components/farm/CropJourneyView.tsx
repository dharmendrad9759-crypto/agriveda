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
import WheatStageVisualizer from "@/components/farm/WheatStageVisualizer";
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
  TrendingUp,
  Check,
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
      {/* 360° Botanical Visualizer Engine */}
      <WheatStageVisualizer
        currentStage={currentStageDef}
        selectedStage={selectedStageDef}
        das={das}
        totalDays={135}
        onSelectStage={(stageId) => setSelectedStageId(stageId)}
      />

      {/* Selected Stage Detail & Agronomic Command Center */}
      <div className="rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-2 border-b border-[var(--av-border)] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                {selectedStageDef.zadoksCode}
              </span>
              <h2 className="text-base font-black text-[var(--av-text-primary)]">
                {selectedStageDef.stageNameHi}
              </h2>
            </div>
            <p className="text-xs text-[var(--av-text-secondary)] mt-1">
              अवस्था अवधि: {selectedStageDef.typicalDaysRange[0]} से {selectedStageDef.typicalDaysRange[1]} दिन
              {selectedStageDef.targetGDD ? ` • संचित GDD: ${selectedStageDef.targetGDD[0]}-${selectedStageDef.targetGDD[1]}°C` : ""}
            </p>
          </div>

          {selectedStageDef.stageId !== currentStageId ? (
            <button
              type="button"
              onClick={() => handleConfirmStage(selectedStageDef.stageId)}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 shadow-md shadow-emerald-700/20 active:scale-95 transition flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>यह अवस्था चुनें</span>
            </button>
          ) : (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              वर्तमान अवस्था
            </span>
          )}
        </div>

        {/* Identification Criteria Card */}
        {selectedStageDef.identificationCriteriaHi && selectedStageDef.identificationCriteriaHi.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-[var(--av-surface-inset)] border border-[var(--av-border)] text-xs space-y-2">
            <p className="font-extrabold text-[var(--av-text-primary)] flex items-center gap-1.5 text-xs">
              <Sprout className="w-4 h-4 text-emerald-600" />
              खेत में पहचान के लक्षण (Physical Field Indicators):
            </p>
            <ul className="space-y-1.5 text-[11.5px] text-[var(--av-text-secondary)]">
              {selectedStageDef.identificationCriteriaHi.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{crit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Irrigation & Fertilizer High-Impact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {/* Irrigation Protocol */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/25 space-y-1.5">
            <p className="font-extrabold text-blue-900 dark:text-blue-200 flex items-center gap-1.5 text-xs">
              <Droplets className="w-4 h-4 text-blue-600 shrink-0" />
              सिंचाई प्रोटोकॉल (Irrigation Guidance):
            </p>
            <p className="text-[11.5px] text-blue-950 dark:text-blue-100 leading-relaxed">
              {selectedStageDef.irrigationConsiderationsHi}
            </p>
          </div>

          {/* Fertilizer & Nutrient Protocol */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/25 space-y-1.5">
            <p className="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 text-xs">
              <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
              खाद व पोषक तत्व (Nutrient Dosage):
            </p>
            <p className="text-[11.5px] text-emerald-950 dark:text-emerald-100 leading-relaxed">
              {selectedStageDef.nutrientManagementHi}
            </p>
          </div>
        </div>

        {/* Weed & Disease Scouting Cards */}
        {(selectedStageDef.weedManagementHi || selectedStageDef.pestMonitoringHi) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
            {selectedStageDef.weedManagementHi && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-950 dark:text-amber-100 space-y-1">
                <p className="font-extrabold text-[11.5px] flex items-center gap-1 text-amber-900 dark:text-amber-200">
                  <span>🌿</span> खरपतवार नियंत्रण खिड़की:
                </p>
                <p className="text-[11px] leading-relaxed">{selectedStageDef.weedManagementHi}</p>
              </div>
            )}
            {selectedStageDef.pestMonitoringHi && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-950 dark:text-rose-100 space-y-1">
                <p className="font-extrabold text-[11.5px] flex items-center gap-1 text-rose-900 dark:text-rose-200">
                  <Bug className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  कीट व रोग निगरानी (Scouting Focus):
                </p>
                <p className="text-[11px] leading-relaxed">{selectedStageDef.pestMonitoringHi}</p>
              </div>
            )}
          </div>
        )}

        {/* 5 Common Mistakes - Red Caution Card */}
        {selectedStageDef.commonMistakesHi && selectedStageDef.commonMistakesHi.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-rose-500/5 to-transparent border border-rose-500/30 space-y-2">
            <p className="text-xs font-black text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              किसान भाइयों की इस चरण की बड़ी गलतियां (इनसे बचें):
            </p>
            <ul className="space-y-1.5 text-[11.5px] text-rose-950 dark:text-rose-200">
              {selectedStageDef.commonMistakesHi.map((mistake, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-600 font-black">✕</span>
                  <span className="leading-relaxed">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Stage Tasks List */}
      <div className="rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-teal-500/15 text-teal-700 dark:text-teal-300">
              <Calendar className="w-4 h-4" />
            </span>
            <h2 className="text-xs font-black text-[var(--av-text-primary)]">
              फसल कार्य सूची ({filteredTasks.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowTaskModal(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-sm hover:bg-emerald-800 active:scale-95 transition"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                taskFilter === tab.id
                  ? "bg-emerald-800 text-white shadow-sm"
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
            इस अवस्था का कोई कार्य लंबित नहीं है।
          </p>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((t) => {
              const isCompleted = t.status === "completed";
              return (
                <div
                  key={t.id}
                  className={`p-3 rounded-2xl border transition ${
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
                      className="mt-0.5 text-gray-400 hover:text-emerald-600 transition"
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
                          className={`text-xs font-black leading-tight ${
                            isCompleted ? "line-through text-gray-400" : "text-[var(--av-text-primary)]"
                          }`}
                        >
                          {t.titleHi || (t as any).title}
                        </span>
                        {t.status === "due" && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                            तुरंत करें
                          </span>
                        )}
                      </div>
                      {(t.descriptionHi || (t as any).description) && (
                        <p className="text-[11px] text-[var(--av-text-secondary)] mt-1 leading-relaxed">
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
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[var(--av-surface)] to-transparent p-4 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black text-[var(--av-text-primary)]">
            फसल कटाई संपन्न?
          </h3>
          <p className="text-[10px] text-[var(--av-text-muted)] mt-0.5">
            कटाई दर्ज करके यह सीजन समाप्त करें व नया सीजन शुरू करें।
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowHarvestModal(true)}
          className="px-3.5 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 active:scale-95 transition"
        >
          कटाई पूरी करें
        </button>
      </div>

      {/* Modal: Add Task */}
      {showTaskModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--av-surface)] rounded-3xl border border-[var(--av-border)] p-5 max-w-sm w-full space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--av-border)] pb-2.5">
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
          <div className="bg-[var(--av-surface)] rounded-3xl border border-[var(--av-border)] p-5 max-w-sm w-full space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--av-border)] pb-2.5">
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
