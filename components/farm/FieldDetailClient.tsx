"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFarmData } from "@/hooks/useFarmData";
import { useToast } from "@/components/ui/Toast";
import AppLink from "@/components/ui/AppLink";
import FieldSwitcher from "@/components/farm/FieldSwitcher";
import LiveFarmView from "@/components/farm/LiveFarmView";
import HealthRadarView from "@/components/farm/HealthRadarView";
import CropJourneyView from "@/components/farm/CropJourneyView";
import {
  calculateDaysAfterSowing,
  estimateWheatStage,
  generateWheatSeasonTasks,
} from "@/lib/farm/cropJourneyEngine";
import { FarmTask, CropSeason, TaskStatus } from "@/lib/farm/types";
import {
  ArrowLeft,
  Radio,
  Sprout,
  Compass,
  Tractor,
  Layers,
  Sparkles,
} from "lucide-react";

interface FieldDetailClientProps {
  fieldId: string;
  initialTab?: string;
}

export default function FieldDetailClient({
  fieldId,
  initialTab = "live",
}: FieldDetailClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    data,
    hydrated,
    addSeason,
    updateSeason,
    addTask,
    updateTaskStatus,
    addObservation,
    deleteObservation,
    addActivity,
  } = useFarmData();

  // Valid tabs: 'live' | 'radar' | 'journey'
  const validTab = (t?: string): "live" | "radar" | "journey" => {
    if (t === "radar" || t === "journey") return t;
    return "live";
  };

  const [activeTab, setActiveTab] = useState<"live" | "radar" | "journey">(
    validTab(initialTab)
  );

  const field = useMemo(() => {
    return data.fields.find((f) => f.id === fieldId);
  }, [data.fields, fieldId]);

  // Find or create active crop season for this field
  const activeSeason = useMemo(() => {
    return data.seasons.find((s) => s.fieldId === fieldId && s.seasonStatus === "active");
  }, [data.seasons, fieldId]);

  // If no season exists yet for this field, initialize one automatically
  useEffect(() => {
    if (!hydrated || !field) return;

    if (!activeSeason) {
      const sowingIso = field.sowingDateIso || new Date().toISOString();
      const das = calculateDaysAfterSowing(sowingIso);
      const estStage = estimateWheatStage({
        id: "",
        fieldId: field.id,
        cropId: "wheat",
        cropName: field.crop || "गेहूँ",
        seasonName: "रबी 2026-27",
        sowingDate: sowingIso,
        currentStageId: "cri",
        stageEstimationMethod: "agronomic_window",
        seasonStatus: "active",
        createdAt: "",
        updatedAt: "",
      });
      const newSeasonId = `cs-${field.id}-${Date.now()}`;

      addSeason({
        fieldId: field.id,
        cropId: "wheat",
        cropName: field.crop || "गेहूँ",
        variety: field.variety,
        seasonName: "रबी 2026-27",
        sowingDate: sowingIso,
        currentStageId: estStage.stage.stageId,
        stageEstimationMethod: estStage.method,
        seasonStatus: "active",
      });

      // Also generate initial tasks for this season
      const initialTasks = generateWheatSeasonTasks(newSeasonId, field.id);
      initialTasks.forEach((t) => {
        addTask(t);
      });
    }
  }, [hydrated, field, activeSeason, fieldId, addSeason, addTask]);

  const handleSwitchTab = (tab: "live" | "radar" | "journey") => {
    setActiveTab(tab);
    window.history.replaceState(null, "", `/my-farm/${fieldId}?tab=${tab}`);
  };

  const handleSelectField = (newFieldId: string) => {
    router.push(`/my-farm/${newFieldId}?tab=${activeTab}`);
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[var(--av-surface-inset)] flex items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-500">खेत डेटा लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="min-h-screen bg-[var(--av-surface-inset)] p-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-sm w-full bg-[var(--av-surface)] p-6 rounded-2xl border border-[var(--av-border)] shadow-md space-y-4">
          <Tractor className="w-12 h-12 text-emerald-600 mx-auto" />
          <div>
            <h1 className="text-base font-bold text-[var(--av-text-primary)]">
              खेत नहीं मिला
            </h1>
            <p className="text-xs text-[var(--av-text-muted)] mt-1">
              यह खेत हटाया जा चुका है या इसका लिंक अमान्य है।
            </p>
          </div>
          <AppLink
            href="/my-farm"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>मेरे सभी खेत पर वापस जाएं</span>
          </AppLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--av-surface-inset)] text-[var(--av-text-primary)]">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-[var(--av-surface)]/95 backdrop-blur-md border-b border-[var(--av-border)] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <AppLink
              href="/my-farm"
              className="p-2 rounded-xl bg-[var(--av-surface-inset)] hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--av-text-secondary)] border border-[var(--av-border)] transition shrink-0"
              title="पीछे जाएं"
            >
              <ArrowLeft className="w-4 h-4" />
            </AppLink>

            <FieldSwitcher
              fields={data.fields}
              selectedFieldId={field.id}
              onSelectField={handleSelectField}
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
              सक्रिय खेत
            </span>
          </div>
        </div>

        {/* 3-Tab Bar: Live Farm | Health Radar | 360° Crop Journey */}
        <div className="max-w-3xl mx-auto px-4 flex border-t border-[var(--av-border)] gap-1 p-1 bg-[var(--av-surface-inset)]">
          <button
            type="button"
            onClick={() => handleSwitchTab("live")}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "live"
                ? "bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-md shadow-emerald-900/20"
                : "text-[var(--av-text-secondary)] hover:text-[var(--av-text-primary)] hover:bg-white/50 dark:hover:bg-gray-800"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>🌾 लाइव खेत</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab("radar")}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "radar"
                ? "bg-gradient-to-r from-teal-800 to-cyan-800 text-white shadow-md shadow-teal-900/20"
                : "text-[var(--av-text-secondary)] hover:text-[var(--av-text-primary)] hover:bg-white/50 dark:hover:bg-gray-800"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>🛰️ स्वास्थ्य रडार</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab("journey")}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "journey"
                ? "bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-700 text-white shadow-md shadow-amber-900/30"
                : "text-[var(--av-text-secondary)] hover:text-[var(--av-text-primary)] hover:bg-white/50 dark:hover:bg-gray-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>🌟 360° फसल सफर</span>
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-3xl mx-auto px-4 py-4">
        {activeTab === "live" && (
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
        )}

        {activeTab === "radar" && (
          <HealthRadarView
            field={field}
            activeSeason={activeSeason}
            satelliteObservations={data.satelliteObservations}
            onAddObservation={addObservation}
          />
        )}

        {activeTab === "journey" && (
          <CropJourneyView
            field={field}
            activeSeason={activeSeason}
            tasks={data.tasks}
            onUpdateSeason={updateSeason}
            onUpdateTaskStatus={updateTaskStatus}
            onAddTask={addTask}
          />
        )}
      </main>
    </div>
  );
}
