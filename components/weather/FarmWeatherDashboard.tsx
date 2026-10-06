"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  SprayCan,
} from "lucide-react";
import type { WeatherViewModel } from "@/lib/weatherApi";
import { buildFarmDashboardData } from "@/lib/weatherDashboardData";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useLocale } from "@/components/i18n/LocaleProvider";
import WeatherConditionIcon from "@/components/weather/WeatherConditionIcon";

interface FarmWeatherDashboardProps {
  weather: WeatherViewModel;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function TemperatureChart({ hourly }: { hourly: { time: string; temp: number }[] }) {
  const slice = hourly.slice(0, 12);
  if (slice.length < 2) return null;

  const width = Math.max(slice.length * 56, 320);
  const height = 120;
  const padX = 20;
  const padY = 16;

  const temps = slice.map((h) => h.temp);
  const minT = Math.min(...temps) - 1;
  const maxT = Math.max(...temps) + 1;
  const range = maxT - minT || 1;

  const points = slice.map((h, i) => {
    const x = padX + (i / (slice.length - 1)) * (width - padX * 2);
    const y = padY + (1 - (h.temp - minT) / range) * (height - padY * 2);
    return { x, y, ...h };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <svg
        viewBox={`0 0 ${width} ${height + 28}`}
        className="min-w-full"
        style={{ minWidth: width }}
        aria-label="Hourly temperature trend"
      >
        <defs>
          <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#tempFill)" />
        <path d={linePath} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#0284c7" />
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              className="fill-sky-900 text-[10px] font-semibold"
            >
              {p.temp}°
            </text>
            <text
              x={p.x}
              y={height + 18}
              textAnchor="middle"
              className="fill-sky-700/60 text-[9px]"
            >
              {p.time.replace(/\s/g, "")}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function FarmWeatherDashboard({
  weather,
  lastUpdated,
}: FarmWeatherDashboardProps) {
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { locale } = useLocale();
  const isHi = locale === "hi";
  
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(true);

  const data = useMemo(() => buildFarmDashboardData(weather), [weather]);

  const fieldName = profile.village
    ? (isHi ? `${profile.village} का खेत` : `${profile.village} field`)
    : profile.district
      ? (isHi ? `${profile.district} का खेत` : `${profile.district} field`)
      : (isHi ? "मेरा खेत" : "My field");

  const cropName = crops[0]?.name ?? (isHi ? "धान" : "Paddy");

  const today = new Date();
  const dateLabel = today.toLocaleDateString(isHi ? "hi-IN" : "en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const updatedLabel = lastUpdated
    ? `${isHi ? 'अपडेट:' : 'Updated'} ${lastUpdated.toLocaleTimeString(isHi ? "hi-IN" : "en-IN", { hour: "2-digit", minute: "2-digit" })}`
    : (isHi ? "अभी अपडेट किया गया" : "Updated just now");

  const activeId = activeDayId ?? data.dayTabs.find((d) => d.isToday)?.id ?? data.dayTabs[0]?.id;

  const sprayAdvice =
    weather.recommendations.find((r) => r.title.includes("सामान्य") || r.title.includes("सलाह"))
      ?.advice ??
    (isHi ? "हवा की गति 10 किमी/घंटा से कम और बारिश की संभावना 30% से कम होने पर स्प्रे करें।" : "Spray when wind is below 10 km/h and rain chance is under 30%.");

  return (
    <div className="mx-auto max-w-lg space-y-5 pb-8 text-gray-900 bg-[#f8fafc] min-h-screen">
      {/* Header & Location */}
      <header className="px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <button
              type="button"
              className="flex items-center gap-1 text-left active:scale-95 transition-transform"
              aria-label="Select field"
            >
              <h2 className="text-[1.35rem] font-bold tracking-tight text-slate-800">{fieldName}</h2>
              <ChevronDown className="mt-0.5 h-5 w-5 text-slate-400" />
            </button>
            <p className="mt-0.5 text-[13px] font-semibold text-emerald-600">{cropName}</p>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-bold text-slate-700">{dateLabel}</p>
            <p className="text-[11px] font-medium text-slate-400">{updatedLabel}</p>
          </div>
        </div>
      </header>

      {/* Hero Weather Card - Matching HomeWeatherWidget Premium Style */}
      <section className="px-3">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-sky-700 via-sky-800 to-emerald-900 p-6 text-white shadow-[0_18px_40px_-20px_rgba(8,47,73,0.65)]">
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-amber-300/25 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl" />
          
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-sky-200/90 mb-1">
                {isHi ? "अगले 6 घंटे" : data.next6hLabel}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-tight drop-shadow-sm">
                  {data.heroTempHigh}°
                </span>
                <span className="text-xl font-medium text-sky-200/80">
                  / {data.heroTempLow}°
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold tracking-wide text-white/95 capitalize drop-shadow-sm">
                {weather.condition}
              </p>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
              <WeatherConditionIcon condition={weather.condition} className="h-11 w-11 text-amber-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Daily Tabs - Premium pill design */}
      <section className="px-3">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
          {data.dayTabs.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveDayId(tab.id)}
                className={`flex min-w-[5rem] shrink-0 flex-col items-center justify-center rounded-2xl py-3 px-2 transition-all active:scale-95 ${
                  isActive 
                    ? "bg-slate-800 text-white shadow-md ring-1 ring-slate-900/10" 
                    : "bg-white text-slate-600 border border-slate-200/60 shadow-sm"
                }`}
              >
                <span className={`text-[11px] font-bold uppercase tracking-wide ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                  {tab.label}
                </span>
                <span className={`mt-1 text-lg font-extrabold ${isActive ? "text-white" : "text-slate-800"}`}>
                  {tab.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Spray Advisory Banner - Modern Flat/Glass look */}
      <section className="px-3">
        <div className="relative overflow-hidden rounded-[1.35rem] bg-indigo-50 border border-indigo-100 shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <SprayCan className="h-24 w-24 text-indigo-900" />
          </div>
          <div className="relative p-5">
            <div className="flex items-center gap-2 mb-2 text-indigo-700">
              <SprayCan className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {isHi ? "छिड़काव सलाह" : "Spray Advisory"}
              </h3>
            </div>
            <p className="max-w-[85%] text-[13px] font-medium leading-relaxed text-indigo-950/80">
              {sprayAdvice}
            </p>
            <Link
              href="/weather/spray-advisory"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-[13px] font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
            >
              {isHi ? "अधिक जानें" : "Learn more"}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="px-3 grid grid-cols-2 gap-3">
        <MetricCard
          icon={<CloudRain className="h-5 w-5 text-sky-500" />}
          label={isHi ? "बारिश" : "Chance of rain"}
          value={`${data.metrics.rainChance}%`}
          sub={`${data.metrics.rainMm.toFixed(1)} mm`}
        />
        <MetricCard
          icon={<Droplets className="h-5 w-5 text-blue-500" />}
          label={isHi ? "नमी" : "Humidity"}
          value={`${data.metrics.humidity}%`}
        />
        <MetricCard
          icon={<Thermometer className="h-5 w-5 text-orange-500" />}
          label={isHi ? "तापमान" : "Max / Min"}
          value={`${data.metrics.tempHigh}° / ${data.metrics.tempLow}°`}
        />
        <MetricCard
          icon={<Wind className="h-5 w-5 text-teal-500" />}
          label={isHi ? "हवा" : "Wind"}
          value={`${data.metrics.windKmh} ${isHi ? 'किमी/घं' : 'km/h'}`}
          sub={data.metrics.windDirection}
        />
      </section>

      {/* Hourly Forecast */}
      <section className="px-3">
        <div className="rounded-[1.35rem] bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-slate-800">{isHi ? "हर घंटे का मौसम" : "Hourly Forecast"}</h3>
          </div>

          <div className="scrollbar-hide mt-5 flex gap-5 overflow-x-auto pb-2">
            {data.hourly.slice(0, 12).map((slot, i) => (
              <div key={i} className="flex min-w-[3.5rem] shrink-0 flex-col items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">{slot.time}</span>
                <span className="text-[26px]">{slot.icon}</span>
                <span
                  className={`text-[11px] font-extrabold ${
                    slot.rainPercent >= 40 ? "text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md" : "text-slate-400"
                  }`}
                >
                  {slot.rainPercent}%
                </span>
              </div>
            ))}
          </div>

          {showDetails && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <h4 className="text-[13px] font-bold text-slate-700 mb-3">{isHi ? "तापमान का ग्राफ" : "Temperature Trend"}</h4>
              <div className="rounded-[1rem] bg-sky-50/50 p-2">
                <TemperatureChart hourly={data.hourly} />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl bg-slate-50 py-2.5 text-[12px] font-bold text-slate-600 active:bg-slate-100 transition"
          >
            {showDetails ? (isHi ? "कम दिखाएं" : "Less Details") : (isHi ? "अधिक दिखाएं" : "More Details")}
            {showDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </section>

      {/* 14-Day Calendar */}
      <section className="px-3">
        <div className="rounded-[1.35rem] bg-white p-5 shadow-sm border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-800">{isHi ? "अगले 14 दिन" : "Next 14 days"}</h3>
          <p className="mt-0.5 text-[12px] font-medium text-slate-500">
            {data.calendarMonth} {data.calendarYear}
          </p>

          <div className="mt-5 grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-1 text-[10px] font-bold text-slate-400">
                {d}
              </div>
            ))}
          </div>

          <div className="space-y-1">
            {data.calendarWeeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1">
                {week.map((cell, ci) => {
                  const isTodayCol = cell.isToday;
                  return (
                    <div
                      key={ci}
                      className={`flex flex-col items-center justify-center rounded-xl py-2 transition-all ${
                        isTodayCol ? "bg-emerald-50 ring-1 ring-emerald-500/20" : ""
                      } ${!cell.isCurrentMonth ? "opacity-30 grayscale" : ""}`}
                    >
                      <span
                        className={`text-[12px] font-bold ${
                          isTodayCol ? "text-emerald-700" : "text-slate-700"
                        }`}
                      >
                        {cell.date}
                      </span>
                      <span className="mt-1 text-[18px] leading-none">{cell.icon}</span>
                      <span className="mt-1 text-[9px] font-bold text-sky-600">
                        {cell.isCurrentMonth ? `${cell.rainPercent}%` : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crop recommendations */}
      {weather.recommendations.length > 0 && (
        <section className="px-3 space-y-3">
          <h3 className="text-[15px] font-bold text-slate-800 ml-1">{isHi ? "फसल सलाह" : "Crop advisory"}</h3>
          {weather.recommendations.map((rec, i) => (
            <div key={i} className="rounded-[1.35rem] bg-emerald-50/50 p-4 border border-emerald-100/50">
              <p className="text-[13px] font-bold text-emerald-800">{rec.title}</p>
              <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-slate-600">{rec.advice}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-[1.25rem] bg-white p-4 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-slate-50 p-1.5">
          {icon}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</span>
      </div>
      <div className="mt-3">
        <p className="text-[17px] font-extrabold text-slate-800">{value}</p>
        {sub && <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}
