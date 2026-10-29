"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  FarmField,
  CropSeason,
  SatelliteObservation,
  PotentialInspectionZone,
  FieldObservation,
} from "@/lib/farm/types";
import {
  generateFieldSatelliteObservation,
  generateHistoricalObservations,
} from "@/lib/farm/satelliteRadar";
import { calculateDaysAfterSowing } from "@/lib/farm/cropJourneyEngine";
import { useToast } from "@/components/ui/Toast";
import AppLink from "@/components/ui/AppLink";
import {
  Radio,
  Satellite,
  Info,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Camera,
  Search,
  ExternalLink,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";

const LiveFieldMap = dynamic(() => import("@/components/farm/LiveFieldMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] w-full bg-slate-900/10 animate-pulse rounded-2xl flex items-center justify-center text-xs text-gray-500">
      उपग्रह रडार लोड हो रहा है...
    </div>
  ),
});

interface HealthRadarViewProps {
  field: FarmField;
  activeSeason?: CropSeason;
  satelliteObservations?: SatelliteObservation[];
  onAddObservation?: (obs: Omit<FieldObservation, "id" | "createdAt">) => void;
}

export default function HealthRadarView({
  field,
  activeSeason,
  satelliteObservations = [],
  onAddObservation,
}: HealthRadarViewProps) {
  const { showToast } = useToast();
  const [selectedZone, setSelectedZone] = useState<PotentialInspectionZone | null>(null);
  const [inspectionNote, setInspectionNote] = useState("");
  const [showLogModal, setShowLogModal] = useState(false);

  // Generate current Sentinel-2 Level-2A observation if not passed
  const currentObservation = useMemo(() => {
    const existing = satelliteObservations.find((s) => s.fieldId === field.id);
    if (existing) return existing;

    const das = activeSeason?.sowingDate
      ? calculateDaysAfterSowing(activeSeason.sowingDate)
      : field.sowingDateIso
      ? calculateDaysAfterSowing(field.sowingDateIso)
      : 35;
    return generateFieldSatelliteObservation(field.id, field.boundary || [], das);
  }, [satelliteObservations, field.id, field.boundary, activeSeason?.sowingDate, field.sowingDateIso]);

  // Generate historical NDVI time-series
  const historicalSeries = useMemo(() => {
    const das = activeSeason?.sowingDate
      ? calculateDaysAfterSowing(activeSeason.sowingDate)
      : field.sowingDateIso
      ? calculateDaysAfterSowing(field.sowingDateIso)
      : 35;
    return generateHistoricalObservations(field.id, field.boundary || [], das);
  }, [field.id, field.boundary, activeSeason?.sowingDate, field.sowingDateIso]);

  // Determine NDVI Health Class
  const ndviClass = useMemo(() => {
    const v = currentObservation.meanNdvi;
    if (v >= 0.7) {
      return {
        label: "अति सघन व स्वस्थ फसल (Dense & Robust)",
        color: "text-emerald-700 dark:text-emerald-300",
        bg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
        badgeBg: "bg-emerald-600 text-white",
      };
    }
    if (v >= 0.5) {
      return {
        label: "सामान्य व अच्छी वानस्पतिक वृद्धि (Good Biomass)",
        color: "text-teal-700 dark:text-teal-300",
        bg: "bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800",
        badgeBg: "bg-teal-600 text-white",
      };
    }
    if (v >= 0.3) {
      return {
        label: "मध्यम वृद्धि / हल्का वानस्पतिक तनाव (Moderate / Stress)",
        color: "text-amber-700 dark:text-amber-300",
        bg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
        badgeBg: "bg-amber-600 text-white",
      };
    }
    return {
      label: "कम वानस्पतिक घनत्व / अंकुरण चरण (Low / Bare Soil)",
      color: "text-rose-700 dark:text-rose-300",
      bg: "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800",
      badgeBg: "bg-rose-600 text-white",
    };
  }, [currentObservation.meanNdvi]);

  const handleOpenInspectionLog = (zone: PotentialInspectionZone) => {
    setSelectedZone(zone);
    setInspectionNote(`जांच परिणाम: ${zone.explanationHi}`);
    setShowLogModal(true);
  };

  const handleSaveInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddObservation || !selectedZone) return;

    onAddObservation({
      fieldId: field.id,
      seasonId: activeSeason?.id,
      category: "soil_deficiency",
      title: `निरीक्षण रिपोर्ट - ज़ोन ${selectedZone.zoneId}`,
      notes: inspectionNote,
      location: selectedZone.centroid || (field.boundary && field.boundary[0]),
      date: new Date().toISOString(),
      status: "active",
    });

    showToast("जांच रिपोर्ट खेत की डायरी में दर्ज की गई", "success");
    setShowLogModal(false);
    setSelectedZone(null);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner: Scientific Satellite Metadata Bar */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              <Satellite className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xs font-bold text-[var(--av-text-primary)]">
                Copernicus Sentinel-2 Level-2A
              </h2>
              <p className="text-[10px] text-[var(--av-text-muted)]">
                ESA Surface Reflectance (BOA) • 10m रिज़ॉल्यूशन
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            क्लाउड फ्री (SCL Masked)
          </span>
        </div>

        {/* Observation Metadata Grid */}
        <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
          <div className="p-2 rounded-xl bg-[var(--av-surface-inset)] border border-[var(--av-border)]">
            <p className="text-[9px] text-[var(--av-text-muted)]">अधिग्रहण तिथि</p>
            <p className="font-bold text-[11px] text-[var(--av-text-primary)] mt-0.5">
              {new Date(currentObservation.acquisitionDate).toLocaleDateString("hi-IN", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-[var(--av-surface-inset)] border border-[var(--av-border)]">
            <p className="text-[9px] text-[var(--av-text-muted)]">औसत NDVI</p>
            <p className="font-extrabold text-[12px] text-emerald-600 mt-0.5">
              {currentObservation.meanNdvi.toFixed(2)}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-[var(--av-surface-inset)] border border-[var(--av-border)]">
            <p className="text-[9px] text-[var(--av-text-muted)]">बादल आवरण</p>
            <p className="font-bold text-[11px] text-[var(--av-text-primary)] mt-0.5">
              {currentObservation.cloudCoveragePercent}%
            </p>
          </div>
          <div className="p-2 rounded-xl bg-[var(--av-surface-inset)] border border-[var(--av-border)]">
            <p className="text-[9px] text-[var(--av-text-muted)]">अनुमानित पिक्सल</p>
            <p className="font-bold text-[11px] text-[var(--av-text-primary)] mt-0.5">
              {currentObservation.validPixelCount}
            </p>
          </div>
        </div>

        {/* Current Health Status Summary */}
        <div className={`p-3 rounded-xl border flex items-center justify-between ${ndviClass.bg}`}>
          <div>
            <p className="text-[10px] font-bold text-[var(--av-text-secondary)]">वानस्पतिक स्थिति:</p>
            <p className={`text-xs font-extrabold ${ndviClass.color}`}>
              {ndviClass.label}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${ndviClass.badgeBg}`}>
            NDVI {currentObservation.meanNdvi.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Small Farm Resolution Safeguard Notice */}
      {currentObservation.isSmallFieldSafeguarded && (
        <div className="rounded-2xl border border-amber-300/80 bg-amber-50/90 dark:bg-amber-950/30 p-3.5 text-xs text-amber-900 dark:text-amber-200 shadow-sm flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              वैज्ञानिक सावधानी — छोटा खेत (0.5 एकड़ से कम):
            </p>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
              सेंटिनल-2 उपग्रह का प्रत्येक पिक्सल 10×10 मीटर (100 मी²) का होता है। छोटे खेतों में मेड़ों व सीमाओं का प्रभाव पड़ता है। पूरे खेत का औसत NDVI सटीक है, लेकिन खेत के भीतर अलग-अलग ज़ोन का निर्णय करने से पहले स्वयं खेत में जाकर पौधों की स्थिति अवश्य देखें।
            </p>
          </div>
        </div>
      )}

      {/* Satellite Imagery with Anomaly Circles */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <Radio className="w-4 h-4 text-emerald-600" />
            </span>
            <h2 className="text-xs font-bold text-[var(--av-text-primary)]">
              उपग्रह वनस्पति स्वास्थ्य व असमानता मानचित्र
            </h2>
          </div>
          <span className="text-[10px] text-gray-500">
            {currentObservation.potentialInspectionZones.length} जांच क्षेत्र
          </span>
        </div>

        <LiveFieldMap
          boundary={field.boundary || []}
          inspectionZones={currentObservation.potentialInspectionZones}
          height="280px"
        />

        {/* NDVI Color Scale Bar */}
        <div className="pt-2">
          <p className="text-[10px] font-bold text-[var(--av-text-secondary)] mb-1">
            NDVI रंग पैमाना (वानस्पतिक घनत्व):
          </p>
          <div className="h-2.5 rounded-full w-full bg-gradient-to-r from-[#d97706] via-[#eab308] via-[#84cc16] to-[#047857]" />
          <div className="flex justify-between text-[9px] text-[var(--av-text-muted)] mt-1 font-semibold">
            <span>सूखा / खाली (0.2)</span>
            <span>कम घनत्व (0.4)</span>
            <span>मध्यम (0.6)</span>
            <span>अति सघन (&gt;0.75)</span>
          </div>
        </div>
      </div>

      {/* Candidate Inspection Zones */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              <Search className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xs font-bold text-[var(--av-text-primary)]">
                खेत में जाकर जांच करें (Inspection Zones)
              </h2>
              <p className="text-[10px] text-[var(--av-text-muted)]">
                उपग्रह असमानता केवल लक्षण बताती है, कारण नहीं
              </p>
            </div>
          </div>
        </div>

        {currentObservation.potentialInspectionZones.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center text-xs text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
            <p className="font-bold">पूरे खेत में एकसमान व स्वस्थ वानस्पतिक फैलाव है</p>
            <p className="text-[11px] mt-0.5 text-emerald-700 dark:text-emerald-300">
              कोई असामान्य तनाव क्षेत्र (Stress Zone) नहीं मिला है।
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {currentObservation.potentialInspectionZones.map((zone) => {
              const isHigh = zone.urgency === "high";
              return (
                <div
                  key={zone.zoneId}
                  className="p-3 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isHigh ? "bg-rose-600 text-white" : "bg-amber-500 text-white"
                        }`}
                      >
                        {isHigh ? "उच्च प्राथमिकता" : "मध्यम प्राथमिकता"}
                      </span>
                      <span className="text-xs font-bold text-[var(--av-text-primary)]">
                        ज़ोन {zone.zoneId}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">
                      NDVI {zone.meanNdvi.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--av-text-secondary)]">
                    {zone.explanationHi}
                  </p>

                  <div className="p-2 rounded-lg bg-[var(--av-surface)] border border-[var(--av-border)] text-[11px] text-[var(--av-text-secondary)] space-y-1">
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                      सलाह: खेत में जाकर मिट्टी की नमी, दीमक या पोषक तत्वों की जांच करें।
                    </p>
                    <p className="text-[10px] text-gray-400">
                      क्षेत्रफल: ~{Math.round(zone.areaHectares * 10000)} मी² ({(zone.relativeDeviation * 100).toFixed(0)}% औसत से भिन्न)
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <AppLink
                      href="/ai-doctor"
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold text-center flex items-center justify-center gap-1 shadow-sm transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>फोटो खींचें व AI डॉक्टर से पूछें</span>
                    </AppLink>
                    <button
                      type="button"
                      onClick={() => handleOpenInspectionLog(zone)}
                      className="py-1.5 px-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] hover:bg-gray-100 dark:hover:bg-gray-800 text-[11px] font-bold text-[var(--av-text-secondary)] transition"
                    >
                      डायरी नोट
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Multi-date Historical NDVI Time-Series */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xs font-bold text-[var(--av-text-primary)]">
                फसल वानस्पतिक वृद्धि का उपग्रह सफर (NDVI Time-Series)
              </h2>
              <p className="text-[10px] text-[var(--av-text-muted)]">
                बुवाई से अब तक सेंटिनल-2 निगरानी
              </p>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-2 pb-1 space-y-2">
          <div className="flex items-end justify-between gap-2 h-28 px-2 border-b border-[var(--av-border)]">
            {historicalSeries.map((obs, i) => {
              const heightPct = Math.max(15, Math.min(100, Math.round(obs.meanNdvi * 100)));
              const isLatest = i === historicalSeries.length - 1;

              return (
                <div key={obs.id} className="flex-1 flex flex-col items-center h-full justify-end">
                  <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {obs.meanNdvi.toFixed(2)}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                      isLatest
                        ? "bg-gradient-to-t from-emerald-700 to-teal-500 shadow-md"
                        : "bg-emerald-600/70"
                    }`}
                  />
                  <span className="text-[9px] font-semibold text-gray-500 mt-1 truncate">
                    {new Date(obs.acquisitionDate).toLocaleDateString("hi-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-center text-emerald-800 dark:text-emerald-300 font-semibold pt-1">
            🌱 फसल का वानस्पतिक घनत्व समय के साथ सुचारू रूप से बढ़ रहा है।
          </p>
        </div>
      </div>

      {/* Modal: Log Inspection Note */}
      {showLogModal && selectedZone && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--av-surface)] rounded-2xl border border-[var(--av-border)] p-4 max-w-sm w-full space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--av-text-primary)] flex items-center gap-1.5">
                <Search className="w-4 h-4 text-emerald-600" />
                खेत जांच डायरी में दर्ज करें
              </h3>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInspection} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[var(--av-text-secondary)] mb-1">
                  स्थान
                </label>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  ज़ोन {selectedZone.zoneId} (NDVI {selectedZone.meanNdvi.toFixed(2)})
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--av-text-secondary)] mb-1">
                  खेत में आपने क्या देखा?
                </label>
                <textarea
                  value={inspectionNote}
                  onChange={(e) => setInspectionNote(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
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
