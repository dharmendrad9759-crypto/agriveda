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
      title: "आज स्प्रे करो",
      subtitle: reasonHi || "सुबह 7–11 बजे अच्छा समय",
      verb: "करो",
      image: "/images/jobs/job-spray.jpg",
      tint: "from-emerald-950/80 via-emerald-900/45 to-black/20",
      Icon: CheckCircle2,
      iconTone: "bg-emerald-500 text-white",
    };
  }
  if (status === "CAUTION") {
    return {
      title: "आज सावधानी से",
      subtitle: reasonHi || "हवा/नमी सीमा पर — बड़ी बूँद डालो",
      verb: "ध्यान",
      image: "/images/jobs/job-spray.jpg",
      tint: "from-amber-950/85 via-amber-900/50 to-black/25",
      Icon: AlertTriangle,
      iconTone: "bg-amber-400 text-amber-950",
    };
  }
  return {
    title: "आज स्प्रे मत करो",
    subtitle: reasonHi || "बारिश या तेज़ हवा — कल देखो",
    verb: "मत",
    image: "/images/jobs/job-spray-avoid.jpg",
    tint: "from-rose-950/85 via-rose-900/55 to-black/30",
    Icon: ShieldAlert,
    iconTone: "bg-rose-500 text-white",
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
        {/* Hero status — photo first */}
        <section className="relative min-h-[220px] overflow-hidden rounded-[22px] border border-[var(--av-border)] shadow-[var(--av-shadow-md)] sm:min-h-[250px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className={`absolute inset-0 bg-gradient-to-t ${hero.tint}`} />
          <div className="relative z-10 flex min-h-[220px] flex-col justify-end p-5 sm:min-h-[250px]">
            {weatherLoading ? (
              <div className="flex flex-col items-start gap-3 py-2">
                <Loader2 className="h-7 w-7 animate-spin text-white/85" />
                <p className="text-sm font-semibold text-white/90">मौसम देख रहे हैं…</p>
              </div>
            ) : (
              <>
                <span
                  className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-md ${hero.iconTone}`}
                >
                  <HeroIcon className="h-6 w-6" />
                </span>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">
                  आज · {hero.verb}
                </p>
                <h2 className="mt-1 text-[28px] font-black leading-tight tracking-tight text-white">
                  {hero.title}
                </h2>
                <p className="mt-2 max-w-md text-[14px] font-medium leading-snug text-white/90">
                  {hero.subtitle}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                    हवा {windKmh ?? "—"} km/h
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                    नमी {humidity ?? "—"}%
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                    बारिश {rainPct ?? "—"}%
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Simple rules */}
        <section className="grid grid-cols-2 gap-2.5">
          {[
            {
              ok: true,
              title: "करो जब",
              lines: ["हवा धीमी", "बारिश नहीं", "सुबह ठंडी"],
              image: "/images/jobs/job-spray.jpg",
            },
            {
              ok: false,
              title: "मत करो जब",
              lines: ["तेज़ हवा", "बादल/बारिश", "बहुत गर्मी"],
              image: "/images/jobs/job-spray-avoid.jpg",
            },
          ].map((rule) => (
            <div
              key={rule.title}
              className="relative min-h-[140px] overflow-hidden rounded-2xl border border-[var(--av-border)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={rule.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <span
                className={`absolute inset-0 ${
                  rule.ok
                    ? "bg-gradient-to-t from-emerald-950/90 via-emerald-950/50 to-black/20"
                    : "bg-gradient-to-t from-rose-950/90 via-rose-950/55 to-black/25"
                }`}
              />
              <div className="relative z-10 flex h-full flex-col justify-end p-3">
                <p className="text-[13px] font-extrabold text-white">{rule.title}</p>
                <ul className="mt-1 space-y-0.5">
                  {rule.lines.map((line) => (
                    <li key={line} className="text-[11px] font-medium text-white/85">
                      · {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>

        {/* Spray windows */}
        <section>
          <h3 className="mb-2 text-sm font-bold text-[var(--av-text-primary)]">कब करूँ?</h3>
          <ul className="space-y-2">
            {windows.map((w) => (
              <li
                key={w.id}
                className="relative flex min-h-[72px] items-center overflow-hidden rounded-2xl border border-[var(--av-border)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    w.tone === "bad"
                      ? "/images/jobs/job-spray-avoid.jpg"
                      : "/images/jobs/job-spray.jpg"
                  }
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span
                  className={`absolute inset-0 ${
                    w.tone === "good"
                      ? "bg-emerald-950/75"
                      : w.tone === "ok"
                        ? "bg-amber-950/70"
                        : "bg-rose-950/78"
                  }`}
                />
                <div className="relative z-10 flex w-full items-center gap-3 px-3.5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">{w.label}</p>
                    <p className="text-xs text-white/80">{w.detail}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-extrabold text-white">
                    {w.badge}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Recommended dosage */}
        <section>
          <h3 className="mb-2 text-sm font-bold text-[var(--av-text-primary)]">खुराक</h3>
          <ul className="space-y-2.5">
            {dosageCards.map((card) => (
              <li
                key={card.id}
                className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-[var(--av-shadow-sm)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--av-text-primary)]">{card.name}</p>
                    <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
                      किस पर: {card.target}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                    {card.badge}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--av-text-secondary)]">
                  {card.dose ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Pencil className="h-3.5 w-3.5 text-[var(--av-text-muted)]" />
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
        <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
          <div className="mb-3 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-[var(--av-text-primary)]">दो दवा मिलाऊँ?</h2>
          </div>
          <p className="mb-3 text-xs text-[var(--av-text-muted)]">
            मिलाकर छिड़कने से पहले जाँच लो।
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[var(--av-text-secondary)]">
                दवा 1
              </span>
              <select
                value={chem1}
                onChange={(e) => {
                  setChem1(e.target.value);
                  setMixChecked(false);
                }}
                className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              >
                <option value="">चुनो…</option>
                {mixableProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {formatProductOption(p)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[var(--av-text-secondary)]">
                दवा 2
              </span>
              <select
                value={chem2}
                onChange={(e) => {
                  setChem2(e.target.value);
                  setMixChecked(false);
                }}
                className="theme-input w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              >
                <option value="">चुनो…</option>
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
            जाँच करो
          </button>
          {mixChecked && mixResult && (
            <div className={`mt-3 rounded-xl border p-3 ${mixResultStyles(mixResult)}`} role="alert">
              <p className="font-bold">{mixResult.title}</p>
              <p className="mt-1 text-sm opacity-90">{mixResult.message}</p>
            </div>
          )}
        </section>

        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[var(--av-text-muted)]">
          <CloudRain className="h-3.5 w-3.5" />
          लेबल और अधिकारी की सलाह हमेशा मानो
        </p>
      </main>
    </div>
  );
}
