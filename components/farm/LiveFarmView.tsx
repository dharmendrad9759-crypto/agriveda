"use client";

import { useMemo, useState } from "react";
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
import { calculateDaysAfterSowing } from "@/lib/farm/cropJourneyEngine";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useToast } from "@/components/ui/Toast";
import AppLink from "@/components/ui/AppLink";
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  Calendar,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Plus,
  Radio,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Bug,
  Leaf,
  Sprout,
  X,
  Camera,
} from "lucide-react";

const LiveFieldMap = dynamic(() => import("@/components/farm/LiveFieldMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] w-full bg-slate-900/10 animate-pulse rounded-2xl flex items-center justify-center text-xs text-gray-500">
      उपग्रह नक्शा लोड हो रहा है...
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
  const [obsCategory, setObsCategory] = useState<ObservationCategory>("insect_pest");
  const [obsNotes, setObsNotes] = useState("");

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [actType, setActType] = useState<string>("irrigation");
  const [actTitle, setActTitle] = useState("");
  const [actNotes, setActNotes] = useState("");

  const das = useMemo(() => {
    if (activeSeason?.sowingDate) return calculateDaysAfterSowing(activeSeason.sowingDate);
    if (field.sowingDateIso) return calculateDaysAfterSowing(field.sowingDateIso);
    return null;
  }, [activeSeason?.sowingDate, field.sowingDateIso]);

  // Filter tasks for this field
  const fieldTasks = useMemo(() => {
    return tasks.filter((t) => t.fieldId === field.id);
  }, [tasks, field.id]);

  const pendingTasks = useMemo(() => {
    return fieldTasks.filter((t) => t.status !== "completed");
  }, [fieldTasks]);

  const recentTasks = useMemo(() => {
    return pendingTasks.slice(0, 3);
  }, [pendingTasks]);

  // Spray conditions evaluation
  const sprayAdvisory = useMemo(() => {
    const windSpeedNum = weather?.windSpeed ? parseInt(weather.windSpeed, 10) : 8;
    const tempNum = weather?.temp ? parseInt(weather.temp, 10) : 24;

    if (weather?.rainfallAlert) {
      return {
        safe: false,
        message: weather.rainfallAlert,
        color: "text-amber-700 bg-amber-50 border-amber-200",
      };
    }
    if (windSpeedNum > 15) {
      return {
        safe: false,
        message: `हवा तेज़ है (${windSpeedNum} km/h) — ड्रिफ्ट का खतरा`,
        color: "text-amber-700 bg-amber-50 border-amber-200",
      };
    }
    if (tempNum > 35) {
      return {
        safe: false,
        message: "तापमान अधिक है — सुबह 7-10 या शाम 4-6 बजे छिड़कें",
        color: "text-amber-700 bg-amber-50 border-amber-200",
      };
    }
    return {
      safe: true,
      message: "छिड़काव के लिए मौसम अनुकूल है (हवा व नमी सामान्य)",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    };
  }, [weather]);

  const handleMapClick = (coords: LatLng) => {
    setSelectedCoords(coords);
    setShowObsModal(true);
    setIsPinMode(false);
  };

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddObservation) return;

    const coords = selectedCoords || (field.boundary && field.boundary[0]) || { lat: 27.5, lng: 78.0 };

    onAddObservation({
      fieldId: field.id,
      seasonId: activeSeason?.id,
      category: obsCategory,
      title: obsNotes.slice(0, 30) || "खेत अवलोकन",
      notes: obsNotes,
      location: coords,
      date: new Date().toISOString(),
      status: "active",
    });

    showToast("समस्या पिन खेत पर दर्ज कर दी गई", "success");
    setShowObsModal(false);
    setObsNotes("");
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddActivity) return;

    onAddActivity({
      field: field.name,
      task: actTitle || `${actType} कार्य`,
      notes: actNotes,
      date: new Date().toISOString(),
      category: actType,
    });

    showToast("गतिविधि खेत की डायरी में दर्ज हुई", "success");
    setShowActivityModal(false);
    setActTitle("");
    setActNotes("");
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner: Quick Navigation Pills */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onSwitchTab("radar")}
          className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-800 text-white shadow-md active:scale-[0.98] transition"
        >
          <div className="flex items-center gap-2.5 text-left">
            <span className="p-2 rounded-xl bg-white/15 backdrop-blur-sm text-emerald-200">
              <Radio className="w-4 h-4 animate-pulse" />
            </span>
            <div>
              <p className="text-xs font-bold leading-tight">स्वास्थ्य रडार</p>
              <p className="text-[10px] text-emerald-200">Sentinel-2 NDVI</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-200" />
        </button>

        <button
          type="button"
          onClick={() => onSwitchTab("journey")}
          className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-900 text-white shadow-md active:scale-[0.98] transition"
        >
          <div className="flex items-center gap-2.5 text-left">
            <span className="p-2 rounded-xl bg-white/15 backdrop-blur-sm text-amber-200">
              <Sprout className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs font-bold leading-tight">फसल सफर</p>
              <p className="text-[10px] text-amber-200">
                {das ? `${das} दिन` : "कार्य व चरण"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-200" />
        </button>
      </div>

      {/* Field Digital Map Card */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xs font-bold text-[var(--av-text-primary)]">
                खेत का लाइव उपग्रह दृश्य
              </h2>
              <p className="text-[10px] text-[var(--av-text-muted)]">
                {field.areaAcres ? `${field.areaAcres} एकड़` : field.area}
                {field.bighaDisplay ? ` • ${field.bighaDisplay}` : ""}
              </p>
            </div>
          </div>

          {/* Pin Observation Button */}
          <button
            type="button"
            onClick={() => setIsPinMode(!isPinMode)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              isPinMode
                ? "bg-rose-600 text-white animate-bounce shadow-md"
                : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isPinMode ? "नक्शे पर टैप करें" : "समस्या पिन करें"}</span>
          </button>
        </div>

        {/* Interactive Map */}
        <LiveFieldMap
          boundary={field.boundary || []}
          observations={observations.filter((o) => o.fieldId === field.id)}
          height="280px"
          allowPinDrop={isPinMode}
          onMapClick={handleMapClick}
        />

        {/* Observations Quick Summary */}
        {observations.filter((o) => o.fieldId === field.id).length > 0 && (
          <div className="pt-2 border-t border-[var(--av-border)]">
            <p className="text-[11px] font-bold text-[var(--av-text-secondary)] mb-1.5">
              खेत में दर्ज समस्याएं ({observations.filter((o) => o.fieldId === field.id).length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {observations
                .filter((o) => o.fieldId === field.id)
                .map((obs) => (
                  <div
                    key={obs.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--av-surface-inset)] border border-[var(--av-border)] text-xs text-[var(--av-text-primary)]"
                  >
                    <span>
                      {obs.category === "insect_pest" || (obs.category as string) === "pest"
                        ? "🐛 कीट"
                        : obs.category === "disease"
                        ? "🍂 रोग"
                        : obs.category === "weed_patch" || (obs.category as string) === "weed"
                        ? "🌿 खरपतवार"
                        : obs.category === "waterlogging"
                        ? "💧 जलभराव"
                        : "📍 समस्या"}
                    </span>
                    <span className="text-[11px] text-[var(--av-text-muted)] truncate max-w-[120px]">
                      {obs.notes}
                    </span>
                    {onDeleteObservation && (
                      <button
                        type="button"
                        onClick={() => onDeleteObservation(obs.id)}
                        className="text-gray-400 hover:text-rose-500 ml-1"
                        title="हटाएं"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Weather & Spray Advisory Card */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              <CloudSun className="w-4 h-4" />
            </span>
            <h2 className="text-xs font-bold text-[var(--av-text-primary)]">
              खेत का वास्तविक मौसम व छिड़काव परामर्श
            </h2>
          </div>
          <span className="text-[10px] text-[var(--av-text-muted)]">
            {field.village || "स्थानीय स्टेशन"}
          </span>
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-2xl bg-[var(--av-surface-inset)] border border-[var(--av-border)] text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--av-text-muted)] text-[10px] mb-1 font-semibold">
              <Thermometer className="w-3.5 h-3.5 text-rose-500" />
              <span>तापमान</span>
            </div>
            <p className="text-base font-black text-[var(--av-text-primary)]">
              {weather?.temp || "24°C"}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--av-surface-inset)] border border-[var(--av-border)] text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--av-text-muted)] text-[10px] mb-1 font-semibold">
              <Droplets className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>नमी</span>
            </div>
            <p className="text-base font-black text-[var(--av-text-primary)]">
              {weather?.humidity || "58%"}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--av-surface-inset)] border border-[var(--av-border)] text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--av-text-muted)] text-[10px] mb-1 font-semibold">
              <Wind className="w-3.5 h-3.5 text-teal-500 animate-[spin_6s_linear_infinite]" />
              <span>हवा की गति</span>
            </div>
            <p className="text-base font-black text-[var(--av-text-primary)]">
              {weather?.windSpeed || "8 km/h"}
            </p>
          </div>
        </div>

        {/* Spray Advisory Banner */}
        <div className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${sprayAdvisory.color}`}>
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{sprayAdvisory.message}</span>
        </div>
      </div>

      {/* Upcoming Tasks Card */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <Calendar className="w-4 h-4" />
            </span>
            <h2 className="text-xs font-bold text-[var(--av-text-primary)]">
              आज व इस हफ्ते के काम ({pendingTasks.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onSwitchTab("journey")}
            className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            सभी देखें →
          </button>
        </div>

        {recentTasks.length === 0 ? (
          <p className="text-xs text-[var(--av-text-muted)] py-2 text-center">
            इस अवस्था के सभी कार्य पूर्ण हो चुके हैं! शाबाश।
          </p>
        ) : (
          <div className="space-y-2">
            {recentTasks.map((t) => {
              const isDue = t.status === "due";
              return (
                <div
                  key={t.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[var(--av-surface-inset)] border border-[var(--av-border)]"
                >
                  <button
                    type="button"
                    onClick={() => onUpdateTaskStatus?.(t.id, t.status === "completed" ? "due" : "completed")}
                    className="mt-0.5 text-gray-400 hover:text-emerald-600 transition"
                  >
                    {t.status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[var(--av-text-primary)] leading-tight">
                        {t.titleHi || (t as any).title}
                      </p>
                      {isDue && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/15 text-rose-700 dark:text-rose-300">
                          तुरंत करें
                        </span>
                      )}
                    </div>
                    {(t.descriptionHi || (t as any).description) && (
                      <p className="text-[11px] text-[var(--av-text-secondary)] mt-0.5">
                        {t.descriptionHi || (t as any).description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Field Activities & Log Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowActivityModal(true)}
          className="flex-1 py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>+ नई गतिविधि दर्ज करें (सिंचाई, खाद, छिड़काव)</span>
        </button>
      </div>

      {/* Modal: Add Observation */}
      {showObsModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--av-surface)] rounded-2xl border border-[var(--av-border)] p-4 max-w-sm w-full space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--av-text-primary)] flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-rose-600" />
                खेत में समस्या दर्ज करें
              </h3>
              <button
                type="button"
                onClick={() => setShowObsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveObservation} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[var(--av-text-secondary)] mb-1">
                  समस्या का प्रकार
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: "insect_pest", label: "🐛 कीट" },
                      { id: "disease", label: "🍂 रोग" },
                      { id: "weed_patch", label: "🌿 खरपतवार" },
                      { id: "waterlogging", label: "💧 जलभराव" },
                      { id: "soil_deficiency", label: "🧪 पोषक तत्व" },
                      { id: "general_scout", label: "🔍 सामान्य निरीक्षण" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setObsCategory(item.id)}
                      className={`p-2 rounded-xl text-xs font-bold text-center border transition ${
                        obsCategory === item.id
                          ? "bg-emerald-700 text-white border-emerald-700"
                          : "bg-[var(--av-surface-inset)] border-[var(--av-border)] text-[var(--av-text-secondary)]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--av-text-secondary)] mb-1">
                  लक्षण या विवरण
                </label>
                <textarea
                  value={obsNotes}
                  onChange={(e) => setObsNotes(e.target.value)}
                  placeholder="जैसे: पत्तों पर पीले धब्बे, दीमक का प्रकोप..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowObsModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[var(--av-border)] text-xs font-bold text-[var(--av-text-secondary)]"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-md hover:bg-emerald-800"
                >
                  पिन सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Activity */}
      {showActivityModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--av-surface)] rounded-2xl border border-[var(--av-border)] p-4 max-w-sm w-full space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--av-text-primary)] flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                नई गतिविधि दर्ज करें
              </h3>
              <button
                type="button"
                onClick={() => setShowActivityModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[var(--av-text-secondary)] mb-1">
                  गतिविधि प्रकार
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: "irrigation", label: "💧 सिंचाई" },
                      { id: "fertilizer", label: "🌱 खाद/उर्वरक" },
                      { id: "spray", label: "🚿 छिड़काव" },
                      { id: "weeding", label: "🌾 निराई-गुड़ाई" },
                      { id: "scouting", label: "🔍 खेत निगरानी" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActType(item.id)}
                      className={`p-2 rounded-xl text-xs font-bold text-center border transition ${
                        actType === item.id
                          ? "bg-emerald-700 text-white border-emerald-700"
                          : "bg-[var(--av-surface-inset)] border-[var(--av-border)] text-[var(--av-text-secondary)]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--av-text-secondary)] mb-1">
                  शीर्षक
                </label>
                <input
                  type="text"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  placeholder="जैसे: प्रथम सिंचाई (CRI चरण)"
                  className="w-full text-xs p-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--av-text-secondary)] mb-1">
                  मात्रा / विवरण
                </label>
                <textarea
                  value={actNotes}
                  onChange={(e) => setActNotes(e.target.value)}
                  placeholder="जैसे: 45 किग्रा यूरिया + 5 किग्रा जिंक सल्फेट प्रति एकड़..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[var(--av-border)] text-xs font-bold text-[var(--av-text-secondary)]"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-md hover:bg-emerald-800"
                >
                  डायरी में जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
