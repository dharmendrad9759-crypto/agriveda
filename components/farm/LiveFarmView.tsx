"use client";

import { useMemo, useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import {
  FarmField,
  CropSeason,
  FarmTask,
  FieldObservation,
  FarmActivity,
  TaskStatus,
  ObservationCategory,
} from "@/lib/farm/types";
import { LatLng } from "@/lib/geo/fieldGeometry";
import {
  calculateDaysAfterSowing,
  isWheatCrop,
} from "@/lib/farm/cropJourneyEngine";
import { getWheatStageById } from "@/lib/farm/wheatZadoksStages";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useToast } from "@/components/ui/Toast";
import FarmSheet from "@/components/farm/FarmSheet";
import { cn } from "@/lib/cn";
import {
  Droplets,
  Wind,
  Thermometer,
  CalendarDays,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Plus,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Bug,
  Leaf,
  Sprout,
  SprayCan,
  Shovel,
  Search,
  FlaskConical,
  NotebookPen,
  Crosshair,
  X,
  type LucideIcon,
} from "lucide-react";

const LiveFieldMap = dynamic(() => import("@/components/farm/LiveFieldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[260px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[11px] text-[var(--av-text-muted)]">
      <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-emerald-600 border-t-transparent" />
      <span>उपग्रह नक्शा लोड हो रहा है…</span>
    </div>
  ),
});

interface LiveFarmViewProps {
  field: FarmField;
  activeSeason?: CropSeason;
  tasks: FarmTask[];
  observations: FieldObservation[];
  onSwitchTab: (tab: "live" | "radar" | "journey") => void;
  onUpdateTaskStatus?: (taskId: string, status: TaskStatus) => void;
  onAddObservation?: (obs: Omit<FieldObservation, "id" | "createdAt">) => void;
  onDeleteObservation?: (obsId: string) => void;
  onAddActivity?: (activity: Omit<FarmActivity, "id">) => void;
}

interface CategoryOption {
  id: ObservationCategory;
  label: string;
  icon: LucideIcon;
  tint: string;
}

const OBS_CATEGORIES: CategoryOption[] = [
  {
    id: "insect_pest",
    label: "कीट",
    icon: Bug,
    tint: "text-rose-600 dark:text-rose-300",
  },
  {
    id: "disease",
    label: "रोग",
    icon: Leaf,
    tint: "text-orange-600 dark:text-orange-300",
  },
  {
    id: "weed_patch",
    label: "खरपतवार",
    icon: Sprout,
    tint: "text-amber-600 dark:text-amber-300",
  },
  {
    id: "waterlogging",
    label: "जलभराव",
    icon: Droplets,
    tint: "text-sky-600 dark:text-sky-300",
  },
  {
    id: "soil_deficiency",
    label: "पोषण",
    icon: FlaskConical,
    tint: "text-violet-600 dark:text-violet-300",
  },
  {
    id: "general_scout",
    label: "निरीक्षण",
    icon: Search,
    tint: "text-emerald-600 dark:text-emerald-300",
  },
];

const ACTIVITY_TYPES: {
  id: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "irrigation", label: "सिंचाई", icon: Droplets },
  { id: "fertilizer", label: "खाद", icon: Sprout },
  { id: "spray", label: "छिड़काव", icon: SprayCan },
  { id: "weeding", label: "निराई", icon: Shovel },
  { id: "scouting", label: "निगरानी", icon: Search },
];

function observationMeta(category: ObservationCategory) {
  return (
    OBS_CATEGORIES.find((item) => item.id === category) ?? OBS_CATEGORIES[5]
  );
}

function toNumber(value?: string) {
  const parsed = parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function LiveFarmView({
  field,
  activeSeason,
  tasks,
  observations,
  onSwitchTab,
  onUpdateTaskStatus,
  onAddObservation,
  onDeleteObservation,
  onAddActivity,
}: LiveFarmViewProps) {
  const { showToast } = useToast();
  const { weather } = useLiveWeather();

  const [isPinMode, setIsPinMode] = useState(false);
  const [showObsModal, setShowObsModal] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<LatLng | null>(null);
  const [obsCategory, setObsCategory] =
    useState<ObservationCategory>("insect_pest");
  const [obsNotes, setObsNotes] = useState("");

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [actType, setActType] = useState<string>("irrigation");
  const [actTitle, setActTitle] = useState("");
  const [actNotes, setActNotes] = useState("");

  const das = useMemo(() => {
    const sowingDate = activeSeason?.sowingDate || field.sowingDateIso;
    return sowingDate ? calculateDaysAfterSowing(sowingDate) : null;
  }, [activeSeason?.sowingDate, field.sowingDateIso]);

  const stageLabel = useMemo(() => {
    if (isWheatCrop(field) || activeSeason?.cropId === "wheat") {
      const stage = activeSeason?.currentStageId
        ? getWheatStageById(activeSeason.currentStageId)
        : undefined;
      if (stage) return stage.stageNameHi;
    }
    return field.stage || activeSeason?.cropName || field.crop;
  }, [activeSeason, field]);

  const fieldTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.fieldId === field.id &&
          (!activeSeason || task.seasonId === activeSeason.id)
      ),
    [tasks, field.id, activeSeason]
  );

  const pendingTasks = useMemo(
    () => fieldTasks.filter((task) => task.status !== "completed"),
    [fieldTasks]
  );

  const recentTasks = useMemo(() => pendingTasks.slice(0, 3), [pendingTasks]);

  const fieldObservations = useMemo(
    () =>
      observations
        .filter((observation) => observation.fieldId === field.id)
        .sort(
          (a, b) =>
            new Date(b.date || b.createdAt).getTime() -
            new Date(a.date || a.createdAt).getTime()
        ),
    [observations, field.id]
  );

  const sprayAdvisory = useMemo(() => {
    const windSpeed = toNumber(weather?.windSpeed) ?? 8;
    const temperature = toNumber(weather?.temp) ?? 24;

    if (weather?.rainfallAlert) {
      return { safe: false, message: weather.rainfallAlert };
    }
    if (windSpeed > 15) {
      return {
        safe: false,
        message: `हवा तेज़ है (${windSpeed} km/h) — छिड़काव टालें`,
      };
    }
    if (temperature > 35) {
      return {
        safe: false,
        message: "तापमान अधिक है — सुबह या शाम छिड़कें",
      };
    }
    return { safe: true, message: "छिड़काव के लिए मौसम अनुकूल है" };
  }, [weather]);

  const areaLabel = field.areaAcres
    ? `${field.areaAcres} एकड़`
    : field.area || field.bighaDisplay || "क्षेत्र दर्ज नहीं";

  const handleMapClick = (coords: LatLng) => {
    setSelectedCoords(coords);
    setShowObsModal(true);
    setIsPinMode(false);
  };

  const closeObservationSheet = () => {
    setShowObsModal(false);
    setObsNotes("");
  };

  const handleSaveObservation = (event: FormEvent) => {
    event.preventDefault();
    if (!onAddObservation) return;

    const coords =
      selectedCoords || field.boundary?.[0] || field.location;

    onAddObservation({
      fieldId: field.id,
      seasonId: activeSeason?.id,
      category: obsCategory,
      title: obsNotes.slice(0, 30) || "खेत अवलोकन",
      notes: obsNotes.trim(),
      location: coords,
      date: new Date().toISOString(),
      status: "active",
    });

    showToast("समस्या पिन खेत पर दर्ज हो गई", "success");
    closeObservationSheet();
  };

  const closeActivitySheet = () => {
    setShowActivityModal(false);
    setActTitle("");
    setActNotes("");
  };

  const handleSaveActivity = (event: FormEvent) => {
    event.preventDefault();
    if (!onAddActivity) return;

    onAddActivity({
      field: field.name,
      task: actTitle || `${actType} कार्य`,
      notes: actNotes.trim(),
      date: new Date().toISOString(),
      category: actType,
    });

    showToast("गतिविधि खेत की डायरी में दर्ज हुई", "success");
    closeActivitySheet();
  };

  return (
    <div className="space-y-3.5 pb-12">
      {/* Live conditions */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-900/40 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 p-4 text-white shadow-[var(--av-shadow-md)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl"
        />

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/65">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
              </span>
              लाइव खेत
            </p>
            <p className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[28px] font-semibold leading-none tabular-nums">
                {das ?? "—"}
              </span>
              <span className="text-[11px] font-medium text-emerald-200/60">
                दिन बुवाई के बाद
              </span>
            </p>
            <p className="mt-1.5 truncate text-xs text-emerald-100/70">
              {field.crop || activeSeason?.cropName || "फसल"}
              {field.variety ? ` · ${field.variety}` : ""}
              {field.village ? ` · ${field.village}` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSwitchTab("journey")}
            className="flex max-w-[45%] items-center gap-1 rounded-xl border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-left text-[11px] font-medium text-emerald-50 backdrop-blur-sm transition hover:bg-white/[0.12] active:scale-95"
          >
            <span className="truncate">{stageLabel || "फसल अवस्था"}</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-emerald-200/70" />
          </button>
        </div>

        <div className="relative mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-white/[0.06] py-2.5 backdrop-blur-sm">
          <div className="px-1.5 text-center sm:px-2">
            <p className="flex items-center justify-center gap-1 text-[9px] font-medium uppercase tracking-wider text-emerald-200/55">
              <Thermometer className="h-3 w-3" /> तापमान
            </p>
            <p className="mt-1 text-[12px] sm:text-[13px] font-semibold tabular-nums">
              {weather?.temp || "24°C"}
            </p>
          </div>
          <div className="px-1.5 text-center sm:px-2">
            <p className="flex items-center justify-center gap-1 text-[9px] font-medium uppercase tracking-wider text-emerald-200/55">
              <Droplets className="h-3 w-3" /> नमी
            </p>
            <p className="mt-1 text-[12px] sm:text-[13px] font-semibold tabular-nums">
              {weather?.humidity || "58%"}
            </p>
          </div>
          <div className="px-1.5 text-center sm:px-2">
            <p className="flex items-center justify-center gap-1 text-[9px] font-medium uppercase tracking-wider text-emerald-200/55">
              <Wind className="h-3 w-3" /> हवा
            </p>
            <p className="mt-1 text-[12px] sm:text-[13px] font-semibold tabular-nums">
              {weather?.windSpeed || "8 km/h"}
            </p>
          </div>
        </div>

        <div className="relative mt-2.5 flex items-center gap-1.5 text-[11px] leading-snug">
          {sprayAdvisory.safe ? (
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-300" />
          )}
          <span
            className={cn(
              "text-emerald-100/75",
              !sprayAdvisory.safe && "text-amber-100/85"
            )}
          >
            {sprayAdvisory.message}
          </span>
        </div>
      </section>

      {/* Field map */}
      <section className="rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-[var(--av-shadow-sm)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <MapPin className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[13px] font-semibold leading-tight text-[var(--av-text-primary)]">
                खेत का नक्शा
              </h2>
              <p className="mt-0.5 truncate text-[10px] text-[var(--av-text-muted)]">
                {areaLabel}
                {field.bighaDisplay ? ` · ${field.bighaDisplay}` : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPinMode((active) => !active)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-semibold transition active:scale-95",
              isPinMode
                ? "border-rose-500/30 bg-rose-600 text-white shadow-sm"
                : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)] hover:text-[var(--av-text-primary)]"
            )}
          >
            {isPinMode ? (
              <Crosshair className="h-3.5 w-3.5 animate-pulse" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            <span>{isPinMode ? "नक्शे पर टैप करें" : "समस्या पिन"}</span>
          </button>
        </div>

        <div className="mt-3">
          <LiveFieldMap
            boundary={field.boundary || []}
            observations={fieldObservations}
            height="260px"
            allowPinDrop={isPinMode}
            onMapClick={handleMapClick}
          />
        </div>

        {fieldObservations.length > 0 ? (
          <div className="mt-3 space-y-1.5 border-t border-[var(--av-border-subtle)] pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--av-text-muted)]">
              दर्ज अवलोकन · {fieldObservations.length}
            </p>
            {fieldObservations.map((observation) => {
              const meta = observationMeta(observation.category);
              const Icon = meta.icon;
              return (
                <div
                  key={observation.id}
                  className="flex items-center gap-2 rounded-xl bg-[var(--av-surface-inset)] px-2.5 py-1.5"
                >
                  <Icon className={cn("h-3.5 w-3.5 shrink-0", meta.tint)} />
                  <span className="min-w-0 flex-1 truncate text-[11px] text-[var(--av-text-primary)]">
                    {observation.notes || meta.label}
                  </span>
                  {onDeleteObservation ? (
                    <button
                      type="button"
                      onClick={() => onDeleteObservation(observation.id)}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[var(--av-text-muted)] transition hover:bg-rose-500/10 hover:text-rose-500"
                      aria-label="अवलोकन हटाएं"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </section>

      {/* Tasks */}
      <section className="rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-[var(--av-shadow-sm)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <CalendarDays className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[13px] font-semibold leading-tight text-[var(--av-text-primary)]">
                आज के काम
              </h2>
              <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">
                {pendingTasks.length} कार्य बाकी
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSwitchTab("journey")}
            className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400"
          >
            सभी
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {recentTasks.length === 0 ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2.5 text-[11px] text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            इस अवस्था के सभी कार्य पूरे हैं।
          </div>
        ) : (
          <div className="mt-3 space-y-1.5">
            {recentTasks.map((task) => {
              const isDue = task.status === "due";
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-2.5 rounded-xl bg-[var(--av-surface-inset)] px-2.5 py-2"
                >
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateTaskStatus?.(
                        task.id,
                        task.status === "completed" ? "due" : "completed"
                      )
                    }
                    className="mt-0.5 shrink-0 text-[var(--av-text-muted)] transition hover:text-emerald-600"
                    aria-label="कार्य पूर्ण करें"
                  >
                    {task.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-1.5">
                      <p className="min-w-0 flex-1 text-[11.5px] font-medium leading-snug text-[var(--av-text-primary)]">
                        {task.titleHi}
                      </p>
                      {isDue ? (
                        <span className="shrink-0 rounded-md bg-rose-500/12 px-1.5 py-0.5 text-[9px] font-semibold text-rose-700 dark:text-rose-300">
                          अभी
                        </span>
                      ) : null}
                    </div>
                    {task.descriptionHi ? (
                      <p className="mt-0.5 line-clamp-1 text-[10px] leading-snug text-[var(--av-text-muted)]">
                        {task.descriptionHi}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={() => setShowActivityModal(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-3 text-xs font-semibold text-white shadow-[var(--av-shadow-sm)] transition hover:bg-emerald-800 active:scale-[0.99]"
      >
        <NotebookPen className="h-4 w-4" />
        गतिविधि दर्ज करें
      </button>

      {/* Observation sheet */}
      <FarmSheet
        open={showObsModal}
        onClose={closeObservationSheet}
        title="समस्या दर्ज करें"
        subtitle="नक्शे पर चुने गए स्थान के लिए"
        icon={<Bug className="h-4 w-4" />}
      >
        <form onSubmit={handleSaveObservation} className="space-y-3.5">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-[var(--av-text-secondary)]">
              समस्या का प्रकार
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {OBS_CATEGORIES.map((option) => {
                const Icon = option.icon;
                const selected = obsCategory === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setObsCategory(option.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-[10px] font-medium transition active:scale-95",
                      selected
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                        : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)] hover:border-[var(--av-border)] hover:text-[var(--av-text-primary)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        selected ? "text-white" : option.tint
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
              लक्षण या विवरण
            </label>
            <textarea
              value={obsNotes}
              onChange={(event) => setObsNotes(event.target.value)}
              placeholder="जैसे: पत्तों पर पीले धब्बे, दीमक का प्रकोप…"
              rows={3}
              className="w-full resize-none rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5 text-xs text-[var(--av-text-primary)] outline-none transition placeholder:text-[var(--av-text-muted)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              required
            />
          </div>

          <div className="flex gap-2 pt-0.5">
            <button
              type="button"
              onClick={closeObservationSheet}
              className="flex-1 rounded-xl border border-[var(--av-border)] py-2.5 text-xs font-semibold text-[var(--av-text-secondary)] transition hover:bg-[var(--av-surface-inset)]"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.99]"
            >
              सहेजें
            </button>
          </div>
        </form>
      </FarmSheet>

      {/* Activity sheet */}
      <FarmSheet
        open={showActivityModal}
        onClose={closeActivitySheet}
        title="गतिविधि जोड़ें"
        subtitle="खेत की डायरी में दर्ज करें"
        icon={<NotebookPen className="h-4 w-4" />}
      >
        <form onSubmit={handleSaveActivity} className="space-y-3.5">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-[var(--av-text-secondary)]">
              गतिविधि प्रकार
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {ACTIVITY_TYPES.map((option) => {
                const Icon = option.icon;
                const selected = actType === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setActType(option.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-[10px] font-medium transition active:scale-95",
                      selected
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                        : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)] hover:text-[var(--av-text-primary)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        selected ? "text-white" : "text-emerald-600 dark:text-emerald-300"
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
              शीर्षक
            </label>
            <input
              type="text"
              value={actTitle}
              onChange={(event) => setActTitle(event.target.value)}
              placeholder="जैसे: प्रथम सिंचाई (CRI चरण)"
              className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5 text-xs text-[var(--av-text-primary)] outline-none transition placeholder:text-[var(--av-text-muted)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-[var(--av-text-secondary)]">
              मात्रा / विवरण
            </label>
            <textarea
              value={actNotes}
              onChange={(event) => setActNotes(event.target.value)}
              placeholder="जैसे: 45 किग्रा यूरिया प्रति एकड़…"
              rows={2}
              className="w-full resize-none rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5 text-xs text-[var(--av-text-primary)] outline-none transition placeholder:text-[var(--av-text-muted)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex gap-2 pt-0.5">
            <button
              type="button"
              onClick={closeActivitySheet}
              className="flex-1 rounded-xl border border-[var(--av-border)] py-2.5 text-xs font-semibold text-[var(--av-text-secondary)] transition hover:bg-[var(--av-surface-inset)]"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.99]"
            >
              डायरी में जोड़ें
            </button>
          </div>
        </form>
      </FarmSheet>

      {/* Sticky Mobile Floating Action Bar when Pin Drop Mode is active */}
      {isPinMode && (
        <div className="fixed bottom-20 left-4 right-4 z-50 flex items-center justify-between gap-3 rounded-2xl border border-rose-500/40 bg-[#160a0e]/95 p-3 text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300">
              <Crosshair className="h-4 w-4 animate-pulse" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight truncate">नक्शे पर समस्या का स्थान चुनें</p>
              <p className="text-[10px] text-rose-200/80 truncate">टैप करते ही समस्या पिन दर्ज हो जाएगी</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPinMode(false)}
            className="shrink-0 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/30 active:scale-95"
          >
            रद्द करें
          </button>
        </div>
      )}
    </div>
  );
}
