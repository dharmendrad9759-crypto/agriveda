"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bug,
  CheckCircle2,
  CloudRain,
  Droplets,
  FlaskConical,
  Leaf,
  Loader2,
  Pill,
  Search,
  ShieldAlert,
  Sprout,
  Sun,
  Sunrise,
  Sunset,
  Wind,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  checkTankMixByActives,
  formatMoleculeOption,
  getMoleculesForCategory,
  getTankMixCategories,
  type TankMixCategory,
  type TankMixCheckResult,
} from "@/lib/tankMixCompatibility";
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
      title: "आज स्प्रे करो",
      subtitle: reasonHi || "सुबह 7–11 बजे अच्छा समय",
      verb: "करो",
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
      title: "आज सावधानी से",
      subtitle: reasonHi || "हवा/नमी सीमा पर — बड़ी बूँद डालो",
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
    title: "आज स्प्रे मत करो",
    subtitle: reasonHi || "बारिश या तेज़ हवा — कल देखो",
    verb: "मत",
    image: "/images/jobs/job-spray-avoid.jpg",
    tint: "from-[#3f0a14]/92 via-[#5c1220]/50 to-[#1a080c]/30",
    accent: "rose" as const,
    Icon: ShieldAlert,
    iconTone: "bg-rose-300 text-rose-950 ring-1 ring-rose-100/50",
    chip: "bg-rose-300 text-rose-950",
  };
}

const MIX_CAT_META: Record<TankMixCategory, { hint: string; Icon: LucideIcon }> = {
  "insecticide+fungicide": { hint: "कीड़े और फंगस एक साथ", Icon: Bug },
  "insecticide+insecticide": { hint: "दो कीटनाशक मिलाएँ", Icon: Bug },
  "fungicide+fungicide": { hint: "दो फफूंदनाशक मिलाएँ", Icon: Leaf },
  "herbicide+herbicide": { hint: "दो खरपतवारनाशक मिलाएँ", Icon: Sprout },
  "chem+fertilizer": { hint: "दवा + खाद", Icon: FlaskConical },
  "micro+pgr": { hint: "माइक्रो / हॉर्मोन", Icon: Sprout },
  biological: { hint: "जैव + दवा", Icon: Leaf },
  npk: { hint: "दो खाद", Icon: Sprout },
};

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

  const [mixCategory, setMixCategory] = useState<TankMixCategory>("insecticide+fungicide");
  const [chem1, setChem1] = useState("");
  const [chem2, setChem2] = useState("");
  const [form1, setForm1] = useState("");
  const [form2, setForm2] = useState("");
  const [mixResult, setMixResult] = useState<TankMixCheckResult | null>(null);
  const [mixQuery, setMixQuery] = useState("");
  const [pickSlot, setPickSlot] = useState<1 | 2>(1);

  const mixMolecules = useMemo(() => getMoleculesForCategory(mixCategory), [mixCategory]);
  const mixCategories = useMemo(() => getTankMixCategories(), []);
  const mol1 = mixMolecules.find((m) => m.id === chem1);
  const mol2 = mixMolecules.find((m) => m.id === chem2);
  const mixFiltered = useMemo(() => {
    const q = mixQuery.trim().toLowerCase();
    if (!q) return mixMolecules.slice(0, 24);
    return mixMolecules
      .filter((m) => formatMoleculeOption(m).toLowerCase().includes(q))
      .slice(0, 24);
  }, [mixMolecules, mixQuery]);

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
    setChem1("");
    setChem2("");
    setForm1("");
    setForm2("");
    setMixResult(null);
    setMixQuery("");
    setPickSlot(1);
  }, [mixCategory]);

  useEffect(() => {
    setForm1(mol1?.forms?.[0] || "");
  }, [chem1, mol1?.forms?.[0]]);

  useEffect(() => {
    setForm2(mol2?.forms?.[0] || "");
  }, [chem2, mol2?.forms?.[0]]);

  const hero = heroCopy(sprayStatus, statusReason);
  const HeroIcon = hero.Icon;
  const windows = buildDayPartWindows(sprayStatus, windKmh, humidity, rainPct);

  const todayLabel = new Date().toLocaleDateString("hi-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!chem1 || !chem2) {
      setMixResult(null);
      return;
    }
    if (chem1 === chem2) {
      setMixResult({
        status: "incompatible",
        title: "न मिलाएँ",
        message: "दो अलग दवा चुनो। एक ही दवा दो बार नहीं।",
      });
      return;
    }
    setMixResult(
      checkTankMixByActives(chem1, chem2, mixCategory, form1 || undefined, form2 || undefined)
    );
  }, [chem1, chem2, mixCategory, form1, form2]);

  const pickMolecule = (id: string) => {
    if (pickSlot === 1) {
      setChem1(id);
      setPickSlot(2);
    } else {
      setChem2(id);
    }
    setMixQuery("");
  };

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

        {/* Mix two medicines — tap type, tap two names, instant yes/no */}
        <section className="overflow-hidden rounded-2xl border border-emerald-800/20 bg-emerald-950 shadow-lg shadow-emerald-900/25">
          <div className="relative min-h-[92px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/jobs/job-spray.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            />
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/85 to-emerald-950/40" />
            <div className="relative z-10 px-4 py-4">
              <p className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-100/90">
                <FlaskConical className="h-3 w-3" />
                टैंक मिक्स
              </p>
              <h2 className="mt-1.5 text-[18px] font-bold leading-tight text-white">
                दो दवा मिलाऊँ?
              </h2>
              <p className="mt-1 text-[12px] font-medium text-emerald-100/85">
                किस्म चुनो · दो नाम टैप करो · जवाब तुरंत
              </p>
              <Link
                href="/mix-advisor"
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-[12px] font-bold text-emerald-950"
              >
                फसल से शुरू करें
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="space-y-3 p-3.5">
            <div className="grid grid-cols-2 gap-2">
              {mixCategories.map((c) => {
                const meta = MIX_CAT_META[c.id];
                const Icon = meta.Icon;
                const on = mixCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setMixCategory(c.id)}
                    className={`flex min-h-[52px] items-center gap-2 rounded-xl px-3 py-2.5 text-left transition active:scale-[0.99] ${
                      on
                        ? "bg-white text-emerald-950 shadow-md"
                        : "bg-white/10 text-emerald-50 ring-1 ring-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={2.4} />
                    <span>
                      <span className="block text-[12px] font-bold leading-tight">{c.hi}</span>
                      <span className={`block text-[10px] font-medium ${on ? "text-emerald-800" : "text-emerald-100/70"}`}>
                        {meta.hint}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {([1, 2] as const).map((slot) => {
                const selected = slot === 1 ? mol1 : mol2;
                const active = pickSlot === slot;
                return (
                  <div
                    key={slot}
                    className={`relative min-h-[64px] rounded-xl px-3 py-2.5 text-left ${
                      active
                        ? "bg-white/15 ring-2 ring-white"
                        : selected
                          ? "bg-white/10 ring-1 ring-emerald-300/40"
                          : "bg-white/5 ring-1 ring-white/10"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setPickSlot(slot)}
                      className="w-full pr-6 text-left"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-200/90">
                        दवा {slot}
                        {active ? " · अब चुनो" : ""}
                      </span>
                      <span className="mt-0.5 block line-clamp-2 text-[13px] font-bold leading-snug text-white">
                        {selected ? formatMoleculeOption(selected) : "टैप करो"}
                      </span>
                    </button>
                    {selected ? (
                      <button
                        type="button"
                        aria-label={`दवा ${slot} हटाएँ`}
                        onClick={() => {
                          if (slot === 1) setChem1("");
                          else setChem2("");
                          setPickSlot(slot);
                          setMixResult(null);
                        }}
                        className="absolute right-2 top-2 rounded-full bg-black/30 p-1 text-white/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-200/70" />
              <input
                value={mixQuery}
                onChange={(e) => setMixQuery(e.target.value)}
                placeholder={pickSlot === 1 ? "दवा 1 खोजो…" : "दवा 2 खोजो…"}
                className="w-full rounded-xl border-0 bg-white/10 py-2.5 pl-11 pr-3 text-[13px] font-semibold text-white outline-none placeholder:text-emerald-100/50 ring-1 ring-white/10"
              />
            </label>

            <div className="max-h-[220px] overflow-y-auto rounded-xl bg-black/20 p-1.5">
              <div className="flex flex-wrap gap-1.5">
                {mixFiltered.map((m) => {
                  const picked = m.id === chem1 || m.id === chem2;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => pickMolecule(m.id)}
                      disabled={picked}
                      className={`rounded-full px-3 py-2 text-left text-[12px] font-bold leading-tight transition active:scale-[0.98] ${
                        picked
                          ? "bg-emerald-400/30 text-emerald-50"
                          : "bg-white/90 text-emerald-950"
                      }`}
                    >
                      {formatMoleculeOption(m)}
                    </button>
                  );
                })}
              </div>
              {mixFiltered.length === 0 ? (
                <p className="px-2 py-4 text-center text-[12px] font-semibold text-emerald-100/70">
                  नाम नहीं मिला — दूसरे शब्द से खोजो
                </p>
              ) : null}
            </div>

            {(mol1?.forms?.length || 0) > 1 || (mol2?.forms?.length || 0) > 1 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {(mol1?.forms?.length || 0) > 1 ? (
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase text-emerald-200/80">फॉर्म 1</p>
                    <div className="flex flex-wrap gap-1">
                      {mol1!.forms.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setForm1(f)}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            form1 === f ? "bg-white text-emerald-950" : "bg-white/10 text-white"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                {(mol2?.forms?.length || 0) > 1 ? (
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase text-emerald-200/80">फॉर्म 2</p>
                    <div className="flex flex-wrap gap-1">
                      {mol2!.forms.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setForm2(f)}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            form2 === f ? "bg-white text-emerald-950" : "bg-white/10 text-white"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {mixResult ? (
              <div
                className={`rounded-xl p-3.5 ${
                  mixResult.status === "safe"
                    ? "bg-white text-emerald-950"
                    : "bg-rose-600 text-white"
                }`}
                role="alert"
              >
                <p className="text-[20px] font-black leading-tight">{mixResult.title}</p>
                <p className="mt-1 whitespace-pre-line text-[12px] font-medium leading-snug opacity-90">
                  {mixResult.message}
                </p>
              </div>
            ) : (
              <p className="text-center text-[12px] font-semibold text-emerald-100/80">
                {chem1 ? "अब दूसरी दवा टैप करो" : "ऊपर किस्म चुनो, फिर दवा टैप करो"}
              </p>
            )}

            <p className="text-[10px] leading-relaxed text-emerald-100/65">
              शक या शर्त = न मिलाएँ। लेबल / CIBRC अंतिम। कॉपर+सल्फर, Ca+फॉस्फेट, ट्राइकोडर्मा+फफूंदनाशक — न मिलाएँ।
            </p>
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
