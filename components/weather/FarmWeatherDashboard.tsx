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
} from "lucide-react";
import type { WeatherViewModel } from "@/lib/weatherApi";
import { buildFarmDashboardData } from "@/lib/weatherDashboardData";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";

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
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#tempFill)" />
        <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#f59e0b" />
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              className="fill-gray-700 text-[10px] font-semibold"
            >
              {p.temp}°
            </text>
            <text
              x={p.x}
              y={height + 18}
              textAnchor="middle"
              className="fill-gray-400 text-[9px]"
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
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(true);

  const data = useMemo(() => buildFarmDashboardData(weather), [weather]);

  const fieldName = profile.village
    ? `${profile.village} field`
    : profile.district
      ? `${profile.district} field`
      : "Dadri field";

  const cropName = crops[0]?.name ?? "Paddy";

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const updatedLabel = lastUpdated
    ? `Updated ${lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
    : "Updated just now";

  const activeId = activeDayId ?? data.dayTabs.find((d) => d.isToday)?.id ?? data.dayTabs[0]?.id;

  const sprayAdvice =
    weather.recommendations.find((r) => r.title.includes("सामान्य") || r.title.includes("सलाह"))
      ?.advice ??
    "Spray when wind is below 10 km/h and rain chance is under 30% in the next 6 hours.";

  return (
    <div className="mx-auto max-w-lg space-y-4 pb-6 text-gray-900">
      {/* Header & Location */}
      <header className="pt-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <button
              type="button"
              className="flex items-center gap-1 text-left"
              aria-label="Select field"
            >
              <h2 className="text-xl font-bold tracking-tight text-gray-900">{fieldName}</h2>
              <ChevronDown className="mt-0.5 h-5 w-5 text-gray-500" />
            </button>
            <p className="mt-0.5 text-sm font-medium text-gray-500">{cropName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">{dateLabel}</p>
            <p className="text-xs text-gray-400">{updatedLabel}</p>
          </div>
        </div>
      </header>

      {/* Hero Weather Card */}
      <section
        className="relative overflow-hidden rounded-2xl p-5 shadow-sm"
        style={{
          background:
            "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 40%, #a5d6a7 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath fill='%232e7d32' fill-opacity='0.15' d='M0 120 Q50 80 100 120 T200 120 V200 H0Z'/%3E%3Ccircle cx='160' cy='40' r='24' fill='%23fff9c4' fill-opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "cover",
            backgroundPosition: "bottom",
          }}
        />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/80">
              {data.next6hLabel}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {data.heroTempHigh}°{" "}
              <span className="text-2xl font-semibold text-gray-600">| {data.heroTempLow}°</span>
            </p>
            <p className="mt-1 text-sm capitalize text-gray-600">{weather.condition}</p>
          </div>
          <span className="text-6xl drop-shadow-sm" role="img" aria-label="Weather">
            {data.heroIcon}
          </span>
        </div>
      </section>

      {/* Daily Tabs */}
      <section>
        <div className="scrollbar-hide -mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
          {data.dayTabs.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveDayId(tab.id)}
                className={`flex min-w-[4.5rem] shrink-0 flex-col items-center rounded-xl px-3 py-2 transition ${
                  isActive ? "bg-white shadow-sm" : "bg-transparent"
                }`}
              >
                <span
                  className={`text-xs font-semibold ${isActive ? "text-gray-900" : "text-gray-500"}`}
                >
                  {tab.label}
                </span>
                <span
                  className={`mt-0.5 text-lg font-bold ${isActive ? "text-gray-900" : "text-gray-400"}`}
                >
                  {tab.sublabel}
                </span>
                {isActive && (
                  <span className="mt-1.5 h-0.5 w-8 rounded-full bg-emerald-600" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Spray Advisory Banner */}
      <section
        className="relative overflow-hidden rounded-2xl shadow-sm"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.1) 100%), url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-white/80">
            Spread and Spray advisory
          </p>
          <p className="mt-2 max-w-[85%] text-sm font-medium leading-relaxed text-white">
            {sprayAdvice.length > 120 ? `${sprayAdvice.slice(0, 117)}…` : sprayAdvice}
          </p>
          <Link
            href="/weather/spray-advisory"
            className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-md transition hover:bg-gray-50"
          >
            Learn more
          </Link>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<CloudRain className="h-5 w-5 text-sky-500" />}
          label="Chance of rain"
          value={`${data.metrics.rainChance}%`}
          sub={`${data.metrics.rainMm.toFixed(1)} mm`}
        />
        <MetricCard
          icon={<Droplets className="h-5 w-5 text-blue-500" />}
          label="Humidity"
          value={`${data.metrics.humidity}%`}
        />
        <MetricCard
          icon={<Thermometer className="h-5 w-5 text-orange-500" />}
          label="Max / Min"
          value={`${data.metrics.tempHigh}° / ${data.metrics.tempLow}°`}
        />
        <MetricCard
          icon={<Wind className="h-5 w-5 text-teal-500" />}
          label="Wind"
          value={`${data.metrics.windKmh} km/h`}
          sub={data.metrics.windDirection}
        />
      </section>

      {/* Hourly Forecast */}
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">Hourly Forecast</h3>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>

        <div className="scrollbar-hide mt-4 flex gap-4 overflow-x-auto pb-2">
          {data.hourly.slice(0, 12).map((slot, i) => (
            <div key={i} className="flex min-w-[3.5rem] shrink-0 flex-col items-center gap-1.5">
              <span className="text-xs font-medium text-gray-500">{slot.time}</span>
              <span className="text-2xl">{slot.icon}</span>
              <span
                className={`text-xs font-semibold ${
                  slot.rainPercent >= 40 ? "text-sky-600" : "text-gray-400"
                }`}
              >
                {slot.rainPercent}%
              </span>
            </div>
          ))}
        </div>

        {showDetails && (
          <>
            <h4 className="mt-5 text-sm font-bold text-gray-800">Temperature</h4>
            <div className="mt-2 rounded-xl bg-amber-50/60 p-2">
              <TemperatureChart hourly={data.hourly} />
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-semibold text-emerald-700"
        >
          {showDetails ? "Less Details" : "More Details"}
          {showDetails ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </section>

      {/* 14-Day Calendar */}
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-base font-bold text-gray-900">Next 14 days</h3>
        <p className="mt-0.5 text-sm text-gray-500">
          {data.calendarMonth} {data.calendarYear}
        </p>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1 text-[10px] font-bold text-gray-400">
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
                    className={`flex flex-col items-center rounded-lg py-2 ${
                      isTodayCol ? "bg-emerald-50 ring-1 ring-emerald-200/60" : ""
                    } ${!cell.isCurrentMonth ? "opacity-35" : ""}`}
                  >
                    <span
                      className={`text-xs font-semibold ${
                        isTodayCol ? "text-emerald-700" : "text-gray-700"
                      }`}
                    >
                      {cell.date}
                    </span>
                    <span className="mt-0.5 text-base leading-none">{cell.icon}</span>
                    <span className="mt-0.5 text-[9px] font-medium text-sky-600">
                      {cell.isCurrentMonth ? `${cell.rainPercent}%` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* Crop recommendations */}
      {weather.recommendations.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-base font-bold text-gray-900">Crop advisory</h3>
          {weather.recommendations.map((rec, i) => (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm font-bold text-emerald-700">{rec.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{rec.advice}</p>
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
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <p className="mt-2 text-lg font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
