"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CloudRain,
  Droplets,
  FlaskConical,
  Loader2,
  Pill,
  ShieldAlert,
  Sun,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-react";
import { fetchSprayWeatherFromSaved } from "@/lib/sprayWeatherApi";
import { buildSprayWindowAnalysis, getSprayWindowStatus } from "@/lib/sprayWindow";
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
      title: "आज छिड़काव करें",
      subtitle: reasonHi || "सुबह 7–11 बजे अच्छा समय",
      verb: "करें",
      image: "/images/jobs/job-spray.jpg",
      tint: "from-[#042f1a]/92 via-[#0a3d24]/55 to-[#04140f]/25",
      accent: "emerald" as const,
      Icon: CheckCircle2,
      iconTone: "bg-emerald-400 text-emerald-950 ring-1 ring-emerald-200/60",
      chip: "bg-emerald-400 text-emerald-950",
    };
  }
  if (status === "CAUTION") {
    return {
      title: "आज सावधानी से छिड़काव करें",
      subtitle: reasonHi || "हवा/नमी सीमा पर — मोटी फुहार (बड़ी बूँद) रखें",
      verb: "ध्यान",
      image: "/images/jobs/job-spray.jpg",
      tint: "from-[#3b2108]/92 via-[#5c3a12]/50 to-[#1a1208]/30",
      accent: "amber" as const,
      Icon: AlertTriangle,
      iconTone: "bg-amber-300 text-amber-950 ring-1 ring-amber-100/50",
      chip: "bg-amber-300 text-amber-950",
    };
  }
  return {
    title: "आज छिड़काव न करें",
    subtitle: reasonHi || "बारिश या तेज़ हवा — कल का मौसम देखें",
    verb: "मत",
    image: "/images/jobs/job-spray-avoid.jpg",
    tint: "from-[#3f0a14]/92 via-[#5c1220]/50 to-[#1a080c]/30",
    accent: "rose" as const,
    Icon: ShieldAlert,
    iconTone: "bg-rose-300 text-rose-950 ring-1 ring-rose-100/50",
    chip: "bg-rose-300 text-rose-950",
  };
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
      id: "evening",
      label: "शाम 4 बजे बाद",
      detail: `बारिश की संभावना ${rain}%`,
      badge: eveningTone === "bad" ? "न करें" : "ठीक है",
      tone: eveningTone,
    },
  ];
}

export default function SprayAdvisoryDetail({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [windKmh, setWindKmh] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [rainPct, setRainPct] = useState<number | null>(null);
  const [sprayStatus, setSprayStatus] = useState<SprayWindowStatusLevel>("CAUTION");
  const [statusReason, setStatusReason] = useState("");

  const loadWeather = useCallback(async () => {
    setWeatherLoading(true);
    try {
      const bundle = await fetchSprayWeatherFromSaved();
      if (!bundle) {
        setStatusReason("छिड़काव सलाह के लिए पहले मौसम पेज पर स्थान चुनें।");
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

  const hero = heroCopy(sprayStatus, statusReason);
  const HeroIcon = hero.Icon;
  const windows = buildDayPartWindows(sprayStatus, windKmh, humidity, rainPct);

  const todayLabel = new Date().toLocaleDateString("hi-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={embedded ? "space-y-5" : "min-h-screen bg-[#f3f5f7] text-gray-900"}>
      {!embedded && (
        <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3.5">
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700"
              aria-label="Back to weather"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/weather");
                }
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="flex items-center gap-1.5 text-base font-bold tracking-tight text-gray-900">
                <Pill className="h-4 w-4 text-gray-600" />
                स्प्रे सलाह
              </h1>
              <p className="truncate text-xs text-gray-500">आज, {todayLabel}</p>
            </div>
          </div>
        </header>
      )}

      <main className={embedded ? "space-y-5" : "mx-auto max-w-lg space-y-5 px-4 py-5 pb-28"}>
        {/* Hero — status command panel */}
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 shadow-[0_20px_50px_-28px_rgba(4,47,26,0.55)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.image}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover"
          />
          <span className={`absolute inset-0 bg-gradient-to-br ${hero.tint}`} />
          <span className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <span className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-48 rounded-full bg-emerald-400/10 blur-2xl" />

          <div className="relative z-10 flex min-h-[248px] flex-col justify-between gap-5 p-5 sm:min-h-[268px] sm:p-6">
            {weatherLoading ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-3 py-6">
                <Loader2 className="h-7 w-7 animate-spin text-white/85" />
                <p className="text-sm font-semibold text-white/90">मौसम देख रहे हैं…</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wide ${hero.chip}`}
                  >
                    <HeroIcon className="h-3.5 w-3.5" />
                    आज · {hero.verb}
                  </span>
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-lg ${hero.iconTone}`}
                  >
                    <HeroIcon className="h-5 w-5" />
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-[30px] font-bold leading-[1.05] tracking-tight text-white sm:text-[34px]">
                    {hero.title}
                  </h2>
                  <p className="mt-2 max-w-md text-[14px] font-medium leading-relaxed text-white/88">
                    {hero.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { label: "हवा", value: `${windKmh ?? "—"}`, unit: "km/h", Icon: Wind },
                      { label: "नमी", value: `${humidity ?? "—"}`, unit: "%", Icon: Droplets },
                      { label: "बारिश", value: `${rainPct ?? "—"}`, unit: "%", Icon: CloudRain },
                    ] as const
                  ).map((m) => (
                    <div
                      key={m.label}
                      className="rounded-2xl border border-white/15 bg-white/10 px-2.5 py-2.5 backdrop-blur-md"
                    >
                      <div className="flex items-center gap-1 text-white/70">
                        <m.Icon className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wide">{m.label}</span>
                      </div>
                      <p className="mt-1 text-[18px] font-black leading-none text-white">
                        {m.value}
                        <span className="ml-0.5 text-[10px] font-bold text-white/65">{m.unit}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Do / Don't — split guide */}
        <section className="overflow-hidden rounded-[24px] border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]">
          <div className="border-b border-[var(--av-border)] px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--av-text-muted)]">
              आसान नियम
            </p>
            <h3 className="mt-0.5 text-[16px] font-extrabold text-[var(--av-text-primary)]">
              कब करें · कब न करें
            </h3>
          </div>
          <div className="grid grid-cols-2 divide-x divide-[var(--av-border)]">
            {(
              [
                {
                  ok: true,
                  title: "करें",
                  lines: [
                    { t: "हवा धीमी हो", Icon: Wind },
                    { t: "बारिश न हो", Icon: CloudRain },
                    { t: "सुबह ठंडी हो", Icon: Sunrise },
                  ],
                  head: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
                  bullet: "bg-emerald-500",
                },
                {
                  ok: false,
                  title: "न करें",
                  lines: [
                    { t: "तेज़ हवा हो", Icon: Wind },
                    { t: "बादल/बारिश हो", Icon: CloudRain },
                    { t: "बहुत गर्मी हो", Icon: Sun },
                  ],
                  head: "bg-rose-500/10 text-rose-800 dark:text-rose-300",
                  bullet: "bg-rose-500",
                },
              ] as const
            ).map((rule) => (
              <div key={rule.title} className="p-3.5 sm:p-4">
                <p
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-extrabold ${rule.head}`}
                >
                  {rule.ok ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <ShieldAlert className="h-3.5 w-3.5" />
                  )}
                  {rule.title}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {rule.lines.map((line) => (
                    <li key={line.t} className="flex items-start gap-2">
                      <span
                        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                          rule.ok ? "bg-emerald-500/15 text-emerald-700" : "bg-rose-500/15 text-rose-700"
                        }`}
                      >
                        <line.Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="pt-0.5 text-[13px] font-semibold leading-snug text-[var(--av-text-primary)]">
                        {line.t}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Day timeline */}
        <section className="overflow-hidden rounded-[24px] border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]">
          <div className="flex items-end justify-between gap-3 border-b border-[var(--av-border)] px-4 py-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--av-text-muted)]">
                आज का समय
              </p>
              <h3 className="mt-0.5 text-[16px] font-extrabold text-[var(--av-text-primary)]">
                कब करूँ?
              </h3>
            </div>
            <p className="text-[10px] font-bold text-[var(--av-text-muted)]">2 विंडो</p>
          </div>

          <ol className="relative space-y-0 px-3 py-2 sm:px-4">
            <span
              aria-hidden
              className="absolute bottom-6 left-[1.85rem] top-6 w-px bg-gradient-to-b from-emerald-400/50 via-amber-400/40 to-rose-400/30 sm:left-[2.1rem]"
            />
            {windows.map((w, idx) => {
              const SlotIcon = w.id === "morning" ? Sunrise : Sunset;
              const toneBg =
                w.tone === "good"
                  ? "from-emerald-500/12 to-transparent ring-emerald-500/25"
                  : w.tone === "ok"
                    ? "from-amber-500/12 to-transparent ring-amber-500/25"
                    : "from-rose-500/12 to-transparent ring-rose-500/25";
              const nodeBg =
                w.tone === "good"
                  ? "bg-emerald-500 text-white shadow-emerald-500/40"
                  : w.tone === "ok"
                    ? "bg-amber-500 text-white shadow-amber-500/40"
                    : "bg-rose-500 text-white shadow-rose-500/40";
              const badgeCls =
                w.tone === "good"
                  ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
                  : w.tone === "ok"
                    ? "bg-amber-500/15 text-amber-900 dark:text-amber-300"
                    : "bg-rose-500/15 text-rose-800 dark:text-rose-300";
              return (
                <li key={w.id} className="relative flex gap-3 py-2.5">
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-md ${nodeBg}`}
                  >
                    <SlotIcon className="h-5 w-5" />
                  </div>
                  <div
                    className={`min-w-0 flex-1 rounded-2xl bg-gradient-to-r p-3.5 ring-1 ${toneBg}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--av-text-muted)]">
                          विंडो {idx + 1}
                        </p>
                        <p className="mt-0.5 text-[15px] font-extrabold text-[var(--av-text-primary)]">
                          {w.label}
                        </p>
                        <p className="mt-1 text-[12px] font-medium text-[var(--av-text-secondary)]">
                          {w.detail}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${badgeCls}`}
                      >
                        {w.badge}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Tank Mix Advisor Link Card */}
        <section className="overflow-hidden rounded-2xl border border-emerald-800/20 bg-gradient-to-br from-emerald-950 via-[#06331e] to-emerald-950 p-5 shadow-lg shadow-emerald-950/20 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-300 ring-1 ring-emerald-400/30">
                <FlaskConical className="h-3.5 w-3.5" />
                दवा मिश्रण जांच (घोल सुरक्षा)
              </span>
              <h3 className="text-lg font-bold leading-snug">
                क्या दो या तीन दवाएं एक साथ मिला सकते हैं?
              </h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                फसल और बीमारी/कीट चुनकर सुरक्षित घोल, सही क्रम (WALES नियम) और सटीक डोज़ जानें।
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/mix-advisor"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-950 shadow-md transition active:scale-[0.99] hover:bg-emerald-50"
            >
              घोल सुरक्षा जांचें
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[var(--av-text-muted)]">
          <CloudRain className="h-3.5 w-3.5" />
          लेबल और अधिकारी की सलाह हमेशा मानो
        </p>
      </main>
    </div>
  );
}
