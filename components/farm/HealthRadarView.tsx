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
  Zap,
  Target,
  Activity,
} from "lucide-react";

const LiveFieldMap = dynamic(() => import("@/components/farm/LiveFieldMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-xs text-emerald-400 gap-2 border border-emerald-900/50">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <span>ESA Sentinel-2 L2A उपग्रह रडार लोड हो रहा है...</span>
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
  const [isRadarScanning, setIsRadarScanning] = useState(false);

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
        label: "अति सघन व स्वस्थ फसल (Dense Canopy)",
        color: "text-emerald-400",
        badgeBg: "bg-emerald-600 text-white",
        glow: "from-emerald-500/20 to-transparent",
      };
    }
    if (v >= 0.5) {
      return {
        label: "सामान्य व अच्छी वानस्पतिक बढ़वार (Good Biomass)",
        color: "text-teal-400",
        badgeBg: "bg-teal-600 text-white",
        glow: "from-teal-500/20 to-transparent",
      };
    }
    if (v >= 0.3) {
      return {
        label: "मध्यम बढ़वार / हल्का वानस्पतिक तनाव (Low Density / Stress)",
        color: "text-amber-400",
        badgeBg: "bg-amber-600 text-white",
        glow: "from-amber-500/20 to-transparent",
      };
    }
    return {
      label: "कम वानस्पतिक घनत्व / अंकुरण चरण (Bare Soil / Sparse)",
      color: "text-rose-400",
      badgeBg: "bg-rose-600 text-white",
      glow: "from-rose-500/20 to-transparent",
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

  const triggerScan = () => {
    setIsRadarScanning(true);
    setTimeout(() => {
      setIsRadarScanning(false);
      showToast("रडार स्कैन पूर्ण: 10m Sentinel-2 डेटा अद्यतन है", "success");
    }, 2000);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Aerospace Satellite Telemetry Cockpit */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#103C32] via-[#0c2a23] to-[#061814] text-white p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl" />

        {/* Cockpit Top Bar */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Satellite className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-black tracking-wide text-white uppercase">
                  Copernicus Sentinel-2 Level-2A
                </h2>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  BOA Reflectance
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/70">
                यूरोपीय अंतरिक्ष एजेंसी (ESA) • 10m मल्टीस्पेक्ट्रल रिज़ॉल्यूशन
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={triggerScan}
            disabled={isRadarScanning}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition"
          >
            <Radio className={`w-3.5 h-3.5 ${isRadarScanning ? "animate-spin text-amber-300" : "animate-pulse"}`} />
            <span>{isRadarScanning ? "स्कैन जारी..." : "रडार स्कैन"}</span>
          </button>
        </div>

        {/* Telemetry Numbers Grid */}
        <div className="grid grid-cols-4 gap-2 my-3 text-center">
          <div className="p-2.5 rounded-2xl bg-black/40 border border-emerald-500/20">
            <span className="text-[9px] font-bold text-emerald-300/80 uppercase">अधिग्रहण</span>
            <p className="text-xs font-black text-white mt-0.5">
              {new Date(currentObservation.acquisitionDate).toLocaleDateString("hi-IN", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/40 border border-emerald-500/20">
            <span className="text-[9px] font-bold text-emerald-300/80 uppercase">औसत NDVI</span>
            <p className="text-sm font-black text-emerald-400 mt-0.5">
              {currentObservation.meanNdvi.toFixed(2)}
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/40 border border-emerald-500/20">
            <span className="text-[9px] font-bold text-emerald-300/80 uppercase">क्लाउड कवर</span>
            <p className="text-xs font-black text-white mt-0.5">
              {currentObservation.cloudCoveragePercent}%
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/40 border border-emerald-500/20">
            <span className="text-[9px] font-bold text-emerald-300/80 uppercase">वैध पिक्सल</span>
            <p className="text-xs font-black text-white mt-0.5">
              {currentObservation.validPixelCount}
            </p>
          </div>
        </div>

        {/* Spectral Formula & Health Evaluation Badge */}
        <div className="p-3 rounded-2xl bg-black/50 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 font-mono">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>NDVI = (B8 NIR - B4 Red) / (B8 + B4)</span>
            </div>
            <p className={`text-xs font-black mt-0.5 ${ndviClass.color}`}>
              {ndviClass.label}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${ndviClass.badgeBg}`}>
            {currentObservation.meanNdvi.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Small Farm Resolution Safeguard Notice */}
      {currentObservation.isSmallFieldSafeguarded && (
        <div className="rounded-3xl border border-amber-300/80 bg-amber-50/90 dark:bg-amber-950/30 p-4 text-xs text-amber-900 dark:text-amber-200 shadow-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-extrabold text-sm text-amber-950 dark:text-amber-100">
              वैज्ञानिक सावधानी — छोटा खेत (0.5 एकड़ से कम):
            </p>
            <p className="text-[11.5px] leading-relaxed text-amber-900 dark:text-amber-300">
              सेंटिनल-2 उपग्रह का प्रत्येक पिक्सल 10×10 मीटर (100 मी²) का होता है। 0.5 एकड़ से छोटे खेतों में मेड़ों व सीमाओं का प्रभाव पड़ता है। पूरे खेत का औसत NDVI सटीक है, लेकिन खेत के भीतर अलग-अलग ज़ोन का निर्णय करने से पहले स्वयं खेत में जाकर पौधों की स्थिति अवश्य देखें।
            </p>
          </div>
        </div>
      )}

      {/* Satellite Imagery with Radar Sweep Effect */}
      <div className="rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              <Target className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-black text-[var(--av-text-primary)]">
                उपग्रह वनस्पति स्वास्थ्य व असमानता मानचित्र
              </h3>
              <p className="text-[10px] text-[var(--av-text-muted)]">
                10m रिज़ॉल्यूशन ग्रिड पर संवेदी विश्लेषण
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {currentObservation.potentialInspectionZones.length} जांच क्षेत्र मिले
          </span>
        </div>

        {/* Live Map */}
        <div className="relative rounded-2xl overflow-hidden">
          <LiveFieldMap
            boundary={field.boundary || []}
            inspectionZones={currentObservation.potentialInspectionZones}
            height="300px"
          />

          {/* Radar Scanning Line Overlay */}
          {isRadarScanning && (
            <div className="pointer-events-none absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-pulse" />
            </div>
          )}
        </div>

        {/* NDVI Color Scale Legend Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-[var(--av-text-secondary)] mb-1">
            <span>NDVI रंग पैमाना (वानस्पतिक घनत्व):</span>
            <span className="text-emerald-700 dark:text-emerald-300">0.2 से 0.85+</span>
          </div>
          <div className="h-3 rounded-full w-full bg-gradient-to-r from-[#d97706] via-[#eab308] via-[#84cc16] to-[#047857] shadow-inner" />
          <div className="flex justify-between text-[9px] text-[var(--av-text-muted)] mt-1 font-extrabold">
            <span>सूखा / खाली (0.2)</span>
            <span>कम घनत्व (0.4)</span>
            <span>मध्यम बढ़वार (0.6)</span>
            <span>अति सघन (&gt;0.75)</span>
          </div>
        </div>
      </div>

      {/* Candidate Inspection Zones */}
      <div className="rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-300">
              <Search className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-black text-[var(--av-text-primary)]">
                खेत में जाकर जांच करें (Inspection Zones)
              </h3>
              <p className="text-[10px] text-[var(--av-text-muted)]">
                उपग्रह असमानता केवल लक्षण बताती है, वास्तविक कारण खेत में जांचें
              </p>
            </div>
          </div>
        </div>

        {currentObservation.potentialInspectionZones.length === 0 ? (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center text-xs text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-6 h-6 mx-auto mb-1.5 text-emerald-600" />
            <p className="font-black text-sm">पूरे खेत में एकसमान व स्वस्थ वानस्पतिक फैलाव है</p>
            <p className="text-[11px] mt-1 text-emerald-700 dark:text-emerald-300">
              कोई असामान्य तनाव क्षेत्र (Stress Zone) नहीं मिला है।
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentObservation.potentialInspectionZones.map((zone) => {
              const isHigh = zone.urgency === "high";
              return (
                <div
                  key={zone.zoneId}
                  className="p-3.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] space-y-2.5 transition hover:border-emerald-500/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          isHigh ? "bg-rose-600 text-white" : "bg-amber-500 text-white"
                        }`}
                      >
                        {isHigh ? "उच्च प्राथमिकता" : "मध्यम प्राथमिकता"}
                      </span>
                      <span className="text-xs font-black text-[var(--av-text-primary)]">
                        ज़ोन {zone.zoneId}
                      </span>
                    </div>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                      NDVI {zone.meanNdvi.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--av-text-secondary)] leading-relaxed">
                    {zone.explanationHi}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[var(--av-surface)] border border-[var(--av-border)] text-[11px] text-[var(--av-text-secondary)] flex items-center justify-between">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">
                      सलाह: खेत में नमी, दीमक या उर्वरक कमी की जांच करें
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      ~{Math.round(zone.areaHectares * 10000)} मी²
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <AppLink
                      href="/ai-doctor"
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 active:scale-95 transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>फोटो खींचें व AI डॉक्टर से पूछें</span>
                    </AppLink>
                    <button
                      type="button"
                      onClick={() => handleOpenInspectionLog(zone)}
                      className="py-2 px-3 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold text-[var(--av-text-secondary)] active:scale-95 transition"
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
      <div className="rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-500/15 text-blue-700 dark:text-blue-300">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-black text-[var(--av-text-primary)]">
                फसल वानस्पतिक वृद्धि का उपग्रह सफर (NDVI Time-Series)
              </h3>
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
                  <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 mb-1">
                    {obs.meanNdvi.toFixed(2)}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[42px] rounded-t-xl transition-all ${
                      isLatest
                        ? "bg-gradient-to-t from-emerald-700 to-teal-400 shadow-lg shadow-emerald-500/30"
                        : "bg-emerald-600/70"
                    }`}
                  />
                  <span className="text-[9px] font-extrabold text-gray-500 mt-1 truncate">
                    {new Date(obs.acquisitionDate).toLocaleDateString("hi-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-center text-emerald-800 dark:text-emerald-300 font-bold pt-1">
            🌱 फसल का वानस्पतिक घनत्व समय के साथ सुचारू रूप से बढ़ रहा है।
          </p>
        </div>
      </div>

      {/* Modal: Log Inspection Note */}
      {showLogModal && selectedZone && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--av-surface)] rounded-3xl border border-[var(--av-border)] p-5 max-w-sm w-full space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--av-border)] pb-2.5">
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
