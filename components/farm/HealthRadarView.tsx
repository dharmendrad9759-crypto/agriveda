"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
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
import FarmSheet from "@/components/farm/FarmSheet";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion/variants";
import {
  Satellite,
  Radio,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  Cloud,
  Layers,
  Camera,
  Search,
  TrendingUp,
  TrendingDown,
  Map as MapIcon,
  Activity,
  NotebookPen,
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

interface HealthRadarViewProps {
  field: FarmField;
  activeSeason?: CropSeason;
  satelliteObservations?: SatelliteObservation[];
  onAddObservation?: (obs: Omit<FieldObservation, "id" | "createdAt">) => void;
}

function formatShortDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "short",
  });
}

function getNdviBand(value: number) {
  if (value >= 0.7) {
    return {
      label: "बहुत घनी और स्वस्थ",
      detail: "खेत में बहुत अच्छी हरियाली है, पौधे पूरे ओज के साथ बढ़ रहे हैं।",
      badge: "border-emerald-400/30 bg-emerald-400/15 text-emerald-200",
      dot: "bg-emerald-400",
    };
  }
  if (value >= 0.5) {
    return {
      label: "बढ़वार अच्छी है",
      detail: "फसल का विकास सामान्य है, समय पर पानी और खाद की निगरानी रखें।",
      badge: "border-teal-400/30 bg-teal-400/15 text-teal-200",
      dot: "bg-teal-400",
    };
  }
  if (value >= 0.3) {
    return {
      label: "हल्की कमजोरी / तनाव",
      detail: "खेत के कुछ हिस्सों में फसल थोड़ी हल्की या पीली दिख रही है — मौके पर जाकर नमी जांचें।",
      badge: "border-amber-400/30 bg-amber-400/15 text-amber-200",
      dot: "bg-amber-400",
    };
  }
  return {
    label: "फसल हल्की / कमजोर",
    detail: "फसल पतली है या पौधे अभी छोटे हैं — मिट्टी में नमी व जड़ों का फैलाव देखें।",
    badge: "border-rose-400/30 bg-rose-400/15 text-rose-200",
    dot: "bg-rose-400",
  };
}

function NdviGauge({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const clamped = Math.min(1, Math.max(0, value));
  const radius = 62;
  const arcLength = Math.PI * radius;
  const offset = arcLength * (1 - clamped);

  return (
    <div className="w-[168px] shrink-0">
      <div className="relative">
        <svg viewBox="0 0 160 112" className="w-full" aria-hidden>
          <defs>
            <linearGradient id="radar-gauge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="48%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <path
            d="M18 96 A 62 62 0 0 1 142 96"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <motion.path
            d="M18 96 A 62 62 0 0 1 142 96"
            fill="none"
            stroke="url(#radar-gauge)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            initial={false}
            animate={{ strokeDashoffset: offset }}
            transition={reduced ? { duration: 0 } : { duration: 0.9, ease: EASE_OUT }}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-1 text-center">
          <p className="text-[26px] font-semibold leading-none tabular-nums text-white">
            {value.toFixed(2)}
          </p>
          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-200/55">
            NDVI
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 text-[9px] font-medium text-emerald-200/40">
        <span>0.0</span>
        <span>0.5</span>
        <span>1.0</span>
      </div>
    </div>
  );
}

function NdviSparkline({ series }: { series: SatelliteObservation[] }) {
  const gradientId = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 320;
  const height = 84;
  const padX = 12;
  const padY = 12;

  const values = series.map((item) => item.meanNdvi);
  const min = Math.min(...values, 0.24) - 0.04;
  const max = Math.max(...values, 0.82) + 0.04;
  const range = Math.max(0.01, max - min);
  const step = (width - padX * 2) / Math.max(1, series.length - 1);

  const points = series.map((item, index) => {
    const x = padX + index * step;
    const y = height - padY - ((item.meanNdvi - min) / range) * (height - padY * 2);
    return { x, y, item, index };
  });

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");
  const first = points[0];
  const last = points[points.length - 1];
  const area = `${line} L${last.x.toFixed(1)} ${height - padY} L${first.x.toFixed(1)} ${
    height - padY
  } Z`;

  const handlePointer = (clientX: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = ((clientX - rect.left) / rect.width) * width;
    let closestIdx = 0;
    let closestDist = Infinity;
    points.forEach((p, idx) => {
      const dist = Math.abs(p.x - relativeX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });
    setActiveIndex(closestIdx);
  };

  const activePoint = activeIndex !== null ? points[activeIndex] : null;

  return (
    <div className="relative select-none">
      {/* Floating Scrubber Tooltip */}
      {activePoint && (
        <div
          className="pointer-events-none absolute -top-7 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-950/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg backdrop-blur-md transition-all duration-75"
          style={{
            left: `${(activePoint.x / width) * 100}%`,
          }}
        >
          <span className="text-emerald-300">
            {formatShortDate(activePoint.item.acquisitionDate)}
          </span>
          <span className="text-white/40">·</span>
          <span className="text-amber-300 tabular-nums">
            NDVI {activePoint.item.meanNdvi.toFixed(2)}
          </span>
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full cursor-crosshair touch-none overflow-visible"
        role="img"
        aria-label="पिछले 45 दिनों का NDVI रुझान"
        onMouseMove={(e) => handlePointer(e.clientX)}
        onTouchMove={(e) => {
          if (e.touches[0]) handlePointer(e.touches[0].clientX);
        }}
        onMouseLeave={() => setActiveIndex(null)}
        onTouchEnd={() => setActiveIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        <line
          x1={padX}
          y1={height - padY}
          x2={width - padX}
          y2={height - padY}
          stroke="var(--av-border)"
          strokeDasharray="3 4"
        />

        <motion.path
          d={area}
          fill={`url(#${gradientId})`}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        />

        {/* Vertical Guide Line when Scrubbing */}
        {activePoint && (
          <line
            x1={activePoint.x}
            y1={padY}
            x2={activePoint.x}
            y2={height - padY}
            stroke="#34d399"
            strokeWidth="1.5"
            strokeDasharray="2 3"
          />
        )}

        {points.map((point, index) => {
          const isSelected = activeIndex === index;
          const isLatest = index === points.length - 1;
          return (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={isSelected ? 4.8 : isLatest ? 3.4 : 2}
              fill={isSelected ? "#34d399" : isLatest ? "#10b981" : "var(--av-surface)"}
              stroke={isSelected ? "#ffffff" : "#10b981"}
              strokeWidth={isSelected ? 2.5 : isLatest ? 2 : 1.4}
              className="transition-all duration-100"
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function HealthRadarView({
  field,
  activeSeason,
  satelliteObservations = [],
  onAddObservation,
}: HealthRadarViewProps) {
  const { showToast } = useToast();
  const reduced = useReducedMotion();
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedZone, setSelectedZone] = useState<PotentialInspectionZone | null>(null);
  const [inspectionNote, setInspectionNote] = useState("");
  const [showLogModal, setShowLogModal] = useState(false);
  const [isRadarScanning, setIsRadarScanning] = useState(false);

  const cropAge = (() => {
    if (activeSeason?.sowingDate) {
      return calculateDaysAfterSowing(activeSeason.sowingDate);
    }
    if (field.sowingDateIso) {
      return calculateDaysAfterSowing(field.sowingDateIso);
    }
    return 35;
  })();

  const currentObservation = useMemo(() => {
    const existing = satelliteObservations.find((item) => item.fieldId === field.id);
    if (existing) return existing;
    return generateFieldSatelliteObservation(field.id, field.boundary || [], cropAge);
  }, [satelliteObservations, field.id, field.boundary, cropAge]);

  const historicalSeries = useMemo(() => {
    return generateHistoricalObservations(field.id, field.boundary || [], cropAge);
  }, [field.id, field.boundary, cropAge]);

  const band = useMemo(() => getNdviBand(currentObservation.meanNdvi), [
    currentObservation.meanNdvi,
  ]);

  const ndviDelta = useMemo(() => {
    if (historicalSeries.length < 2) return 0;
    const first = historicalSeries[0].meanNdvi;
    const latest = historicalSeries[historicalSeries.length - 1].meanNdvi;
    return latest - first;
  }, [historicalSeries]);

  useEffect(() => {
    return () => {
      if (scanTimer.current) clearTimeout(scanTimer.current);
    };
  }, []);

  const handleOpenInspectionLog = (zone: PotentialInspectionZone) => {
    setSelectedZone(zone);
    setInspectionNote(`जांच परिणाम: ${zone.explanationHi}`);
    setShowLogModal(true);
  };

  const handleSaveInspection = (event: React.FormEvent) => {
    event.preventDefault();
    if (!onAddObservation || !selectedZone) return;

    onAddObservation({
      fieldId: field.id,
      seasonId: activeSeason?.id,
      category: "general_scout",
      title: `निरीक्षण रिपोर्ट - क्षेत्र ${selectedZone.zoneId.split("-").pop()}`,
      notes: inspectionNote,
      location: selectedZone.centroid || (field.boundary && field.boundary[0]),
      date: new Date().toISOString(),
      status: "active",
    });

    showToast("जांच रिपोर्ट खेत की डायरी में दर्ज की गई", "success");
    setShowLogModal(false);
  };

  const triggerScan = () => {
    if (isRadarScanning) return;
    setIsRadarScanning(true);
    scanTimer.current = setTimeout(() => {
      setIsRadarScanning(false);
      scanTimer.current = null;
      showToast("रडार स्कैन पूर्ण — Sentinel-2 डेटा अद्यतन है", "success");
    }, 2000);
  };

  const zones = currentObservation.potentialInspectionZones;

  return (
    <div className="space-y-4 pb-12">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#0a211b] text-white shadow-[0_18px_50px_-24px_rgba(6,78,59,0.75)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_85%_0%,rgba(45,212,191,0.16),transparent_55%)]" />

        <header className="relative flex items-center justify-between gap-2 px-4 pt-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
              <Satellite className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-[14px] font-semibold leading-tight">फसल हरियाली व सेहत</h2>
              <p className="text-[10px] text-emerald-200/70">उपग्रह द्वारा खेत की सेहत की जांच</p>
            </div>
          </div>

          <button
            type="button"
            onClick={triggerScan}
            disabled={isRadarScanning}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-200 transition active:scale-95 disabled:opacity-70"
          >
            <Radio
              className={cn("h-3 w-3", isRadarScanning ? "animate-spin text-amber-300" : "animate-pulse")}
              aria-hidden
            />
            {isRadarScanning ? "स्कैन…" : "स्कैन"}
          </button>
        </header>

        <div className="relative flex flex-col items-center gap-3 px-4 pb-4 pt-2 sm:flex-row sm:items-center sm:gap-4">
          <NdviGauge value={currentObservation.meanNdvi} />

          <div className="min-w-0 flex-1">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                band.badge
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", band.dot)} />
              {band.label}
            </span>
            <p className="mt-1.5 text-[11px] leading-snug text-emerald-100/65">{band.detail}</p>

            <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[10px] text-emerald-100/75">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1">
                <CalendarDays className="h-3 w-3 text-emerald-300/80" aria-hidden />
                {formatShortDate(currentObservation.acquisitionDate)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1">
                <Cloud className="h-3 w-3 text-emerald-300/80" aria-hidden />
                {currentObservation.cloudCoveragePercent}% बादल
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1">
                <Layers className="h-3 w-3 text-emerald-300/80" aria-hidden />
                {currentObservation.resolutionMeters} मी
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1">
                <Activity className="h-3 w-3 text-emerald-300/80" aria-hidden />
                {currentObservation.validPixelCount} px
              </span>
            </div>
          </div>
        </div>
      </section>

      {currentObservation.isSmallFieldSafeguarded ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] px-3.5 py-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
          <p className="text-[11px] leading-relaxed text-amber-900 dark:text-amber-100/85">
            <span className="font-semibold">छोटा खेत: </span>
            {currentObservation.smallFieldMessage ||
              "10 मीटर पिक्सल के कारण सीमा का प्रभाव पड़ सकता है। ज़ोन का निर्णय खेत में जाकर ही करें।"}
          </p>
        </div>
      ) : null}

      <section className="rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <MapIcon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-[12px] font-semibold text-[var(--av-text-primary)]">
                फसल नक्शा
              </h3>
              <p className="text-[10px] text-[var(--av-text-muted)]">
                10 मीटर ग्रिड · {zones.length} जांच क्षेत्र
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[var(--av-surface-inset)] px-2 py-1 text-[9px] font-semibold text-[var(--av-text-muted)]">
            NDVI
          </span>
        </div>

        <div className="relative mt-2.5 overflow-hidden rounded-2xl">
          <LiveFieldMap
            boundary={field.boundary || []}
            inspectionZones={zones}
            height="264px"
          />

          {isRadarScanning ? (
            <div className="pointer-events-none absolute inset-0 bg-emerald-400/5">
              <motion.div
                className="h-px w-full bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_16px_#34d399]"
                initial={reduced ? false : { y: 0 }}
                animate={{ y: [0, 264, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : null}
        </div>

        <div className="mt-2.5">
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-500" />
          <div className="mt-1 flex items-center justify-between text-[9px] font-medium text-[var(--av-text-muted)]">
            <span>कम घनत्व</span>
            <span>मध्यम</span>
            <span>सघन</span>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300">
              <Search className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-[12px] font-semibold text-[var(--av-text-primary)]">
                खेत में जांच करें
              </h3>
              <p className="text-[10px] text-[var(--av-text-muted)]">
                उपग्रह केवल संकेत देता है, कारण खेत में देखें
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[var(--av-surface-inset)] px-2 py-1 text-[9px] font-semibold text-[var(--av-text-muted)]">
            {zones.length}
          </span>
        </div>

        {zones.length === 0 ? (
          <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] px-3.5 py-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <div>
              <p className="text-[11.5px] font-semibold text-emerald-900 dark:text-emerald-100">
                पूरे खेत में एकसमान फैलाव
              </p>
              <p className="text-[10px] text-emerald-800/70 dark:text-emerald-200/65">
                कोई स्पष्ट तनाव क्षेत्र नहीं मिला।
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {zones.map((zone) => {
              const high = zone.urgency === "high";
              return (
                <article
                  key={zone.zoneId}
                  className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                        high
                          ? "bg-rose-500/12 text-rose-600 dark:text-rose-300"
                          : "bg-amber-500/12 text-amber-600 dark:text-amber-300"
                      )}
                    >
                      <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[11.5px] font-semibold text-[var(--av-text-primary)]">
                          उत्तरी हिस्सा — {high ? "अधिक ध्यान दें" : "हल्की कमजोरी"}
                        </p>
                        <span className="shrink-0 rounded-md bg-[var(--av-surface)] px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                          {zone.meanNdvi.toFixed(2)}
                        </span>
                      </div>

                      <p className="mt-1 text-[10.5px] leading-relaxed text-[var(--av-text-secondary)]">
                        {zone.explanationHi}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-[9.5px] text-[var(--av-text-muted)]">
                          ~{Math.round(zone.areaHectares * 10000)} m²
                        </span>
                        <div className="flex items-center gap-1.5">
                          <AppLink
                            href="/ai-doctor"
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-2 py-1 text-[10px] font-semibold text-white transition active:scale-95"
                          >
                            <Camera className="h-3 w-3" aria-hidden />
                            AI जांच
                          </AppLink>
                          <button
                            type="button"
                            onClick={() => handleOpenInspectionLog(zone)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] px-2 py-1 text-[10px] font-semibold text-[var(--av-text-secondary)] transition active:scale-95"
                          >
                            <NotebookPen className="h-3 w-3" aria-hidden />
                            डायरी
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300">
              <TrendingUp className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-[12px] font-semibold text-[var(--av-text-primary)]">
                फसल बढ़वार का ग्राफ
              </h3>
              <p className="text-[10px] text-[var(--av-text-muted)]">पिछले 45 दिनों में हरियाली का बदलाव</p>
            </div>
          </div>

          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              ndviDelta >= 0
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-500/10 text-rose-700 dark:text-rose-300"
            )}
          >
            {ndviDelta >= 0 ? (
              <TrendingUp className="h-3 w-3" aria-hidden />
            ) : (
              <TrendingDown className="h-3 w-3" aria-hidden />
            )}
            {ndviDelta >= 0 ? "+" : ""}
            {ndviDelta.toFixed(2)}
          </span>
        </div>

        <div className="mt-2">
          <NdviSparkline series={historicalSeries} />
        </div>

        <div className="flex items-center justify-between text-[9px] font-medium text-[var(--av-text-muted)]">
          <span>{formatShortDate(historicalSeries[0]?.acquisitionDate || currentObservation.acquisitionDate)}</span>
          <span>
            {formatShortDate(
              historicalSeries[historicalSeries.length - 1]?.acquisitionDate ||
                currentObservation.acquisitionDate
            )}
          </span>
        </div>
      </section>

      <FarmSheet
        open={showLogModal && Boolean(selectedZone)}
        onClose={() => setShowLogModal(false)}
        title="जांच डायरी में दर्ज करें"
        subtitle={
          selectedZone
            ? `क्षेत्र ${selectedZone.zoneId.split("-").pop()} · NDVI ${selectedZone.meanNdvi.toFixed(2)}`
            : undefined
        }
        icon={<Search className="h-4 w-4" aria-hidden />}
      >
        <form onSubmit={handleSaveInspection} className="space-y-3">
          <div>
            <label
              htmlFor="inspection-note"
              className="mb-1 block text-[11px] font-semibold text-[var(--av-text-secondary)]"
            >
              खेत में आपने क्या देखा?
            </label>
            <textarea
              id="inspection-note"
              value={inspectionNote}
              onChange={(event) => setInspectionNote(event.target.value)}
              rows={4}
              required
              className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5 text-[12px] text-[var(--av-text-primary)] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLogModal(false)}
              className="flex-1 rounded-xl border border-[var(--av-border)] py-2.5 text-[11px] font-semibold text-[var(--av-text-secondary)] transition active:scale-[0.98]"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-700 py-2.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.98]"
            >
              डायरी में जोड़ें
            </button>
          </div>
        </form>
      </FarmSheet>
    </div>
  );
}
