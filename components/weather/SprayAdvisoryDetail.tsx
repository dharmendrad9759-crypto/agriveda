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
  FlaskConical,
  Leaf,
  Loader2,
  Pill,
  Search,
  ShieldAlert,
  Sprout,
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
      // Neutral veil — photo stays readable, color only on status chip
      tint: "from-black/75 via-black/35 to-black/10",
      Icon: CheckCircle2,
      iconTone: "bg-white text-emerald-700",
    };
  }
  if (status === "CAUTION") {
    return {
      title: "आज सावधानी से",
      subtitle: reasonHi || "हवा/नमी सीमा पर — बड़ी बूँद डालो",
      verb: "ध्यान",
      image: "/images/jobs/job-spray.jpg",
      tint: "from-black/75 via-black/40 to-black/15",
      Icon: AlertTriangle,
      iconTone: "bg-white text-amber-700",
    };
  }
  return {
    title: "आज स्प्रे मत करो",
    subtitle: reasonHi || "बारिश या तेज़ हवा — कल देखो",
    verb: "मत",
    image: "/images/jobs/job-spray-avoid.jpg",
    tint: "from-black/78 via-black/42 to-black/15",
    Icon: ShieldAlert,
    iconTone: "bg-white text-rose-700",
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
        {/* Hero status — photo first, soft black veil (not tinted green) */}
        <section className="relative min-h-[220px] overflow-hidden rounded-[22px] border border-white/10 shadow-[var(--av-shadow-md)] sm:min-h-[250px]">
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
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">
                  आज · {hero.verb}
                </p>
                <h2 className="mt-1 text-[28px] font-black leading-tight tracking-tight text-white drop-shadow-sm">
                  {hero.title}
                </h2>
                <p className="mt-2 max-w-md text-[14px] font-medium leading-snug text-white/92">
                  {hero.subtitle}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black/35 px-3 py-1 text-[11px] font-bold text-white ring-1 ring-white/25 backdrop-blur-[2px]">
                    हवा {windKmh ?? "—"} km/h
                  </span>
                  <span className="rounded-full bg-black/35 px-3 py-1 text-[11px] font-bold text-white ring-1 ring-white/25 backdrop-blur-[2px]">
                    नमी {humidity ?? "—"}%
                  </span>
                  <span className="rounded-full bg-black/35 px-3 py-1 text-[11px] font-bold text-white ring-1 ring-white/25 backdrop-blur-[2px]">
                    बारिश {rainPct ?? "—"}%
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Simple rules */}
        <section className="grid grid-cols-2 gap-3">
          {[
            {
              ok: true,
              title: "कब करें",
              lines: ["हवा धीमी हो", "बारिश न हो", "सुबह ठंडी हो"],
              image: "/images/jobs/spray-morning.jpg",
            },
            {
              ok: false,
              title: "कब न करें",
              lines: ["तेज़ हवा हो", "बादल/बारिश हो", "बहुत गर्मी हो"],
              image: "/images/jobs/job-spray-avoid.jpg",
            },
          ].map((rule) => (
            <div
              key={rule.title}
              className="relative min-h-[168px] overflow-hidden rounded-2xl border border-white/15 shadow-[var(--av-shadow-md)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={rule.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
              <div className="relative z-10 flex h-full flex-col justify-end p-3.5">
                <p
                  className={`inline-flex w-fit rounded-lg px-2 py-0.5 text-[13px] font-black tracking-tight ${
                    rule.ok ? "bg-white text-emerald-800" : "bg-white text-rose-800"
                  }`}
                >
                  {rule.title}
                </p>
                <ul className="mt-2 space-y-1">
                  {rule.lines.map((line) => (
                    <li key={line} className="text-[12px] font-semibold text-white drop-shadow-sm">
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
                className="relative flex min-h-[72px] items-center overflow-hidden rounded-2xl border border-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    w.id === "morning"
                      ? "/images/jobs/spray-morning.jpg"
                      : w.id === "afternoon"
                        ? "/images/jobs/spray-afternoon.jpg"
                        : "/images/jobs/spray-evening.jpg"
                  }
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/25" />
                <div className="relative z-10 flex w-full items-center gap-3 px-3.5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-extrabold text-white">{w.label}</p>
                    <p className="text-[12px] font-medium text-white/90">{w.detail}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                      w.tone === "good"
                        ? "bg-white text-emerald-800"
                        : w.tone === "ok"
                          ? "bg-white text-amber-800"
                          : "bg-white text-rose-800"
                    }`}
                  >
                    {w.badge}
                  </span>
                </div>
              </li>
            ))}
          </ul>
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
                className="w-full rounded-xl border-0 bg-white/10 py-2.5 pl-9 pr-3 text-[13px] font-semibold text-white outline-none placeholder:text-emerald-100/50 ring-1 ring-white/10"
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
