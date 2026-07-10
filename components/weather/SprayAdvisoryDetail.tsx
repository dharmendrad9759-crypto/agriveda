"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FlaskConical,
  Info,
  Loader2,
  ShieldAlert,
  Wind,
  Thermometer,
  CloudRain,
} from "lucide-react";
import { useMyCrops } from "@/hooks/useMyCrops";
import { sprayProducts, getProductsForCrop } from "@/data/spray-products";
import {
  checkTankMixCompatibility,
  formatProductOption,
  type TankMixCheckResult,
} from "@/lib/tankMixCompatibility";
import {
  getControlRecommendations,
  moaBadgeClasses,
} from "@/data/spray-advisory-recommendations";
import { fetchSprayWeatherFromSaved } from "@/lib/sprayWeatherApi";
import { getSprayWindowStatus } from "@/lib/sprayWindow";
import type { SprayWindowStatusLevel } from "@/types/spray-window";

function statusConfig(status: SprayWindowStatusLevel) {
  if (status === "GOOD") {
    return {
      bg: "bg-emerald-50 border-emerald-200",
      icon: CheckCircle2,
      iconClass: "text-emerald-600",
      title: "Ideal Time to Spray",
      titleClass: "text-emerald-900",
    };
  }
  if (status === "CAUTION") {
    return {
      bg: "bg-amber-50 border-amber-200",
      icon: AlertTriangle,
      iconClass: "text-amber-600",
      title: "Spray with Caution",
      titleClass: "text-amber-900",
    };
  }
  return {
    bg: "bg-red-50 border-red-200",
    icon: ShieldAlert,
    iconClass: "text-red-600",
    title: "Not Recommended to Spray",
    titleClass: "text-red-900",
  };
}

function mixResultStyles(result: TankMixCheckResult | null) {
  if (!result) return "border-gray-200 bg-gray-50 text-gray-600";
  if (result.status === "safe") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (result.status === "caution") return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-red-200 bg-red-50 text-red-900";
}

export default function SprayAdvisoryDetail({ embedded = false }: { embedded?: boolean }) {
  const { crops } = useMyCrops();
  const cropSlug = crops[0]?.slug ?? "paddy";

  const [weatherLoading, setWeatherLoading] = useState(true);
  const [windKmh, setWindKmh] = useState<number | null>(null);
  const [tempC, setTempC] = useState<number | null>(null);
  const [rainPct, setRainPct] = useState<number | null>(null);
  const [sprayStatus, setSprayStatus] = useState<SprayWindowStatusLevel>("CAUTION");
  const [statusReason, setStatusReason] = useState<string>("");

  const mixableProducts = useMemo(() => {
    const cropProducts = getProductsForCrop(cropSlug);
    const pool = cropProducts.length > 0 ? cropProducts : sprayProducts;
    return pool.filter((p) => p.category !== "herbicide").slice(0, 40);
  }, [cropSlug]);

  const defaultFungicide = mixableProducts.find((p) => p.category === "fungicide")?.id ?? "";
  const defaultInsecticide = mixableProducts.find((p) => p.category === "insecticide")?.id ?? "";

  const [chem1, setChem1] = useState("");
  const [chem2, setChem2] = useState("");
  const [mixResult, setMixResult] = useState<TankMixCheckResult | null>(null);
  const [mixChecked, setMixChecked] = useState(false);

  const recommendations = useMemo(() => getControlRecommendations(cropSlug), [cropSlug]);

  const loadWeather = useCallback(async () => {
    setWeatherLoading(true);
    try {
      const bundle = await fetchSprayWeatherFromSaved();
      if (!bundle) {
        setStatusReason("Set your location on the Weather page to see live spray conditions.");
        setSprayStatus("CAUTION");
        return;
      }
      const result = getSprayWindowStatus(bundle.current);
      setWindKmh(Math.round(bundle.current.windSpeedKmh));
      setTempC(Math.round(bundle.current.temperatureC));
      setRainPct(Math.round(bundle.current.rainProbabilityNext3h * 100));
      setSprayStatus(result.status);
      setStatusReason(result.reasonEn);
    } catch {
      setStatusReason("Could not load live weather. Check connection and try again.");
      setSprayStatus("CAUTION");
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  useEffect(() => {
    if (defaultFungicide && !chem1) setChem1(defaultFungicide);
    if (defaultInsecticide && !chem2) setChem2(defaultInsecticide);
  }, [defaultFungicide, defaultInsecticide, chem1, chem2]);

  const statusUi = statusConfig(sprayStatus);
  const StatusIcon = statusUi.icon;

  const handleCheckMix = () => {
    const result = checkTankMixCompatibility(chem1, chem2);
    setMixResult(result);
    setMixChecked(true);
  };

  return (
    <div className={embedded ? "space-y-5" : "min-h-screen bg-[#f4f5f7] text-gray-900"}>
      {!embedded && (
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3.5">
          <Link
            href="/weather"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-50"
            aria-label="Back to weather"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold tracking-tight text-gray-900">
              Spray &amp; Spread Advisory
            </h1>
            <p className="truncate text-xs text-gray-500">
              Scientific pest control · {crops[0]?.name ?? "Paddy"}
            </p>
          </div>
        </div>
      </header>
      )}

      <main className={embedded ? "space-y-5" : "mx-auto max-w-lg space-y-5 px-4 py-5 pb-28"}>
        {/* Current Status */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            Current Status
          </h2>
          <div
            className={`rounded-lg border p-4 shadow-sm ${statusUi.bg}`}
          >
            {weatherLoading ? (
              <div className="flex items-center gap-3 py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="text-sm text-gray-600">Loading live conditions…</span>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <StatusIcon className={`mt-0.5 h-6 w-6 shrink-0 ${statusUi.iconClass}`} />
                  <div>
                    <p className={`text-lg font-bold ${statusUi.titleClass}`}>{statusUi.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-700">{statusReason}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-black/5 pt-4">
                  <MetricPill
                    icon={<Wind className="h-4 w-4 text-teal-600" />}
                    label="Wind"
                    value={windKmh != null ? `${windKmh} km/h` : "—"}
                  />
                  <MetricPill
                    icon={<Thermometer className="h-4 w-4 text-orange-500" />}
                    label="Temperature"
                    value={tempC != null ? `${tempC}°C` : "—"}
                  />
                  <MetricPill
                    icon={<CloudRain className="h-4 w-4 text-sky-600" />}
                    label="Rain (3h)"
                    value={rainPct != null ? `${rainPct}%` : "—"}
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Tank-Mix Tester */}
        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">Tank-Mix Tester</h2>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            Select two agrochemicals to check formulation compatibility before filling your sprayer tank.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Agrochemical 1</span>
              <select
                value={chem1}
                onChange={(e) => {
                  setChem1(e.target.value);
                  setMixChecked(false);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select product…</option>
                {mixableProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {formatProductOption(p)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">Agrochemical 2</span>
              <select
                value={chem2}
                onChange={(e) => {
                  setChem2(e.target.value);
                  setMixChecked(false);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select product…</option>
                {mixableProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {formatProductOption(p)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={handleCheckMix}
            disabled={!chem1 || !chem2}
            className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check Compatibility
          </button>

          {mixChecked && mixResult && (
            <div
              className={`mt-4 rounded-lg border p-4 ${mixResultStyles(mixResult)}`}
              role="alert"
            >
              <p className="font-bold">{mixResult.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed opacity-90">{mixResult.message}</p>
            </div>
          )}
        </section>

        {/* Recommended Control Measures */}
        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-bold text-gray-900">Recommended Control Measures</h2>
          <p className="mt-1 text-sm text-gray-600">
            Evidence-based actives for {crops[0]?.name ?? "Paddy"} — aligned with IRAC / FRAC rotation principles.
          </p>

          <ul className="mt-4 space-y-3">
            {recommendations.map((rec) => (
              <li
                key={rec.id}
                className="rounded-lg border border-gray-100 bg-gray-50/80 p-4 transition hover:border-gray-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900">{rec.activeIngredient}</p>
                    <p className="mt-0.5 text-xs font-medium text-gray-500">
                      Target: <span className="text-gray-700">{rec.target}</span>
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-bold ring-1 ${moaBadgeClasses(rec.moaType)}`}
                  >
                    {rec.moaBadge}
                  </span>
                </div>
                {rec.doseHint && (
                  <p className="mt-2 text-xs text-gray-600">
                    <span className="font-semibold text-gray-700">Dose:</span> {rec.doseHint}
                  </p>
                )}
                {rec.notes && (
                  <p className="mt-1 text-xs italic text-gray-500">{rec.notes}</p>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed text-amber-900">
              <span className="font-bold">Resistance management:</span> Never apply the same IRAC or FRAC
              group in consecutive sprays. Rotate modes of action across the season and preserve
              beneficial insects by spraying only at economic threshold levels (ETL).
            </p>
          </div>
        </section>

        <p className="text-center text-[11px] text-gray-400">
          Always follow product label, PHI, and local agricultural officer guidance.
        </p>
      </main>
    </div>
  );
}

function MetricPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-white/70 px-2 py-2 text-center">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}
