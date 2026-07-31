"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CloudRain,
  Droplets,
  FlaskConical,
  Loader2,
  Pencil,
  Pill,
  ShieldAlert,
} from "lucide-react";
import { useMyCrops } from "@/hooks/useMyCrops";
import { getProductsForCrop, sprayProducts } from "@/data/spray-products";
import {
  checkTankMixCompatibility,
  formatProductOption,
  type TankMixCheckResult,
} from "@/lib/tankMixCompatibility";
import {
  getControlRecommendations,
} from "@/data/spray-advisory-recommendations";
import { fetchSprayWeatherFromSaved } from "@/lib/sprayWeatherApi";
import { buildSprayWindowAnalysis, getSprayWindowStatus } from "@/lib/sprayWindow";
import { formatFarmerDose } from "@/lib/units/farmerDose";
import type { SprayWindowStatusLevel } from "@/types/spray-window";

type WindowTone = "good" | "ok" | "bad";

interface DayPartWindow {
  id: string;
  label: string;
  detail: string;
  badge: string;
  tone: WindowTone;
}

function heroCopy(status: SprayWindowStatusLevel, reasonHi: string) {
  if (status === "GOOD") {
    return {
      title: "आज स्प्रे सुरक्षित है",
      subtitle: reasonHi || "सुबह 7 बजे से दोपहर 11 बजे तक",
      card: "from-emerald-700 via-emerald-600 to-teal-700",
      Icon: CheckCircle2,
    };
  }
  if (status === "CAUTION") {
    return {
      title: "आज सावधानी से स्प्रे करें",
      subtitle: reasonHi || "हवा / नमी सीमा पर है — बड़ी droplets इस्तेमाल करें",
      card: "from-amber-600 via-amber-500 to-orange-600",
      Icon: AlertTriangle,
    };
  }
  return {
    title: "आज स्प्रे न करें",
    subtitle: reasonHi || "बारिश या तेज़ हवा — स्प्रे टालें",
    card: "from-rose-700 via-rose-600 to-red-700",
    Icon: ShieldAlert,
  };
}

function parseDose(doseHint?: string): { dose: string | null; water: string | null } {
  if (!doseHint) return { dose: "लेबल देखें", water: null };
  const cleaned = formatFarmerDose(doseHint);
  const waterMatch = cleaned.match(/(\d+(?:\.\d+)?\s*(?:ml|g|L|kg)?\/?\s*L)/i);
  if (waterMatch) {
    // Keep only the farmer-friendly water line (avoid duplicate 0.4 ml/L)
    return { dose: null, water: `${waterMatch[1]} पानी में` };
  }
  if (/acre|एकड़/i.test(cleaned)) {
    return { dose: cleaned, water: null };
  }
  return { dose: cleaned, water: "पर्याप्त पानी में" };
}

function buildDayPartWindows(
  status: SprayWindowStatusLevel,
  windKmh: number | null,
  humidity: number | null,
  rainPct: number | null
): DayPartWindow[] {
  const wind = windKmh ?? 8;
  const hum = humidity ?? 68;
  const rain = rainPct ?? 20;

  const morningTone: WindowTone =
    status === "AVOID" ? "bad" : status === "GOOD" ? "good" : "ok";
  const afternoonTone: WindowTone = status === "AVOID" ? "bad" : "ok";
  const eveningTone: WindowTone = rain >= 40 || status === "AVOID" ? "bad" : "ok";

  return [
    {
      id: "morning",
      label: "सुबह 7-11 बजे",
      detail: `हवा ${wind} km/h, नमी ${hum}%`,
      badge: morningTone === "good" ? "उत्तम" : morningTone === "ok" ? "ठीक है" : "न करें",
      tone: morningTone,
    },
    {
      id: "afternoon",
      label: "दोपहर 12-3 बजे",
      detail: "गर्मी अधिक, असर कम",
      badge: afternoonTone === "bad" ? "न करें" : "ठीक है",
      tone: afternoonTone,
    },
    {
      id: "evening",
      label: "शाम 4 बजे बाद",
      detail: `बारिश की संभावना ${rain}%`,
      badge: eveningTone === "bad" ? "न करें" : "ठीक है",
      tone: eveningTone,
    },
  ];
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
  const [humidity, setHumidity] = useState<number | null>(null);
  const [rainPct, setRainPct] = useState<number | null>(null);
  const [sprayStatus, setSprayStatus] = useState<SprayWindowStatusLevel>("CAUTION");
  const [statusReason, setStatusReason] = useState("");

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
        setStatusReason("स्प्रे सलाह के लिए पहले मौसम पेज पर स्थान सेट करें।");
        setSprayStatus("CAUTION");
        return;
      }
      const analysis = buildSprayWindowAnalysis(bundle.current, bundle.hourly);
      const result = analysis.current ?? getSprayWindowStatus(bundle.current);
      setWindKmh(Math.round(bundle.current.windSpeedKmh));
      setHumidity(Math.round(bundle.current.humidityPercent));
      setRainPct(Math.round(bundle.current.rainProbabilityNext3h * 100));
      setSprayStatus(result.status);
      setStatusReason(result.reasonHi);
    } catch {
      setStatusReason("मौसम लोड नहीं हुआ। कनेक्शन जाँचकर फिर कोशिश करें।");
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

  const hero = heroCopy(sprayStatus, statusReason);
  const HeroIcon = hero.Icon;
  const windows = buildDayPartWindows(sprayStatus, windKmh, humidity, rainPct);

  const dosageCards = useMemo(() => {
    return recommendations.slice(0, 4).map((rec) => {
      const parsed = parseDose(rec.doseHint);
      const badge =
        rec.moaType === "FRAC"
          ? "फफूंद रोग"
          : rec.moaType === "IRAC"
            ? "कीट नियंत्रण"
            : "खरपतवार";
      return {
        id: rec.id,
        name: rec.activeIngredient,
        badge,
        dose: parsed.dose,
        water: parsed.water,
        target: rec.target,
      };
    });
  }, [recommendations]);

  const todayLabel = new Date().toLocaleDateString("hi-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleCheckMix = () => {
    const result = checkTankMixCompatibility(chem1, chem2);
    setMixResult(result);
    setMixChecked(true);
  };

  return (
    <div className={embedded ? "space-y-5" : "min-h-screen bg-[#f3f5f7] text-gray-900"}>
      {!embedded && (
        <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3.5">
            <Link
              href="/weather"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700"
              aria-label="Back to weather"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="flex items-center gap-1.5 text-base font-bold tracking-tight text-emerald-700">
                <Pill className="h-4 w-4" />
                स्प्रे सलाह
              </h1>
              <p className="truncate text-xs text-gray-500">आज, {todayLabel}</p>
            </div>
          </div>
        </header>
      )}

      <main className={embedded ? "space-y-5" : "mx-auto max-w-lg space-y-5 px-4 py-5 pb-28"}>
        {/* Hero status */}
        <section
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${hero.card} px-5 py-8 text-center text-white shadow-lg`}
        >
          {weatherLoading ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="h-8 w-8 animate-spin text-white/80" />
              <p className="text-sm text-white/90">स्प्रे स्थिति जाँच हो रही है…</p>
            </div>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
                <HeroIcon
                  className={`h-8 w-8 ${
                    sprayStatus === "GOOD"
                      ? "text-emerald-600"
                      : sprayStatus === "CAUTION"
                        ? "text-amber-500"
                        : "text-rose-600"
                  }`}
                />
              </div>
              <h2 className="mt-4 text-2xl font-black tracking-tight">{hero.title}</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/90">
                {hero.subtitle}
              </p>
            </>
          )}
        </section>

        {/* Spray windows */}
        <section>
          <h3 className="mb-2 text-sm font-bold text-gray-900">स्प्रे विंडो</h3>
          <ul className="space-y-2">
            {windows.map((w) => (
              <li
                key={w.id}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
              >
                <span
                  className={`h-3 w-3 shrink-0 rounded-full ${
                    w.tone === "good"
                      ? "bg-emerald-500"
                      : w.tone === "ok"
                        ? "bg-amber-400"
                        : "bg-rose-500"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900">{w.label}</p>
                  <p className="text-xs text-gray-500">{w.detail}</p>
                </div>
                <span
                  className={`shrink-0 text-xs font-bold ${
                    w.tone === "good"
                      ? "text-emerald-600"
                      : w.tone === "ok"
                        ? "text-amber-600"
                        : "text-rose-600"
                  }`}
                >
                  {w.badge}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Recommended dosage */}
        <section>
          <h3 className="mb-2 text-sm font-bold text-gray-900">अनुशंसित खुराक</h3>
          <ul className="space-y-2.5">
            {dosageCards.map((card) => (
              <li
                key={card.id}
                className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">{card.name}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500">लक्ष्य: {card.target}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                    {card.badge}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-700">
                  {card.dose ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Pencil className="h-3.5 w-3.5 text-gray-400" />
                      {card.dose}
                    </span>
                  ) : null}
                  {card.water ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Droplets className="h-3.5 w-3.5 text-sky-500" />
                      {card.water}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Tank-mix (kept, Hindi labels) */}
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-gray-900">टैंक-मिक्स जाँच</h2>
          </div>
          <p className="mb-3 text-xs text-gray-600">
            दो दवाएँ मिलाकर छिड़कने से पहले अनुकूलता जाँचें।
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">दवा 1</span>
              <select
                value={chem1}
                onChange={(e) => {
                  setChem1(e.target.value);
                  setMixChecked(false);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              >
                <option value="">चुनें…</option>
                {mixableProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {formatProductOption(p)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-gray-700">दवा 2</span>
              <select
                value={chem2}
                onChange={(e) => {
                  setChem2(e.target.value);
                  setMixChecked(false);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              >
                <option value="">चुनें…</option>
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
            className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            अनुकूलता जाँचें
          </button>
          {mixChecked && mixResult && (
            <div className={`mt-3 rounded-xl border p-3 ${mixResultStyles(mixResult)}`} role="alert">
              <p className="font-bold">{mixResult.title}</p>
              <p className="mt-1 text-sm opacity-90">{mixResult.message}</p>
            </div>
          )}
        </section>

        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-400">
          <CloudRain className="h-3.5 w-3.5" />
          लेबल, PHI और कृषि अधिकारी की सलाह हमेशा मानें
        </p>
      </main>
    </div>
  );
}
