"use client";

import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  Bug,
  CalendarDays,
  ChevronRight,
  CloudRain,
  CloudSun,
  Droplets,
  FlaskConical,
  Leaf,
  MapPin,
  ScanLine,
  ShieldCheck,
  Sparkles,
  SprayCan,
  UsersRound,
  Wheat,
  Wind,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { useFarmData } from "@/hooks/useFarmData";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLiveWeather } from "@/hooks/useLiveWeather";

const QUICK_ACTIONS = [
  {
    label: "Crop Guide",
    labelHi: "फसल गाइड",
    href: "/crops",
    icon: BookOpenText,
    color: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    label: "Weather",
    labelHi: "मौसम",
    href: "/weather",
    icon: CloudSun,
    color: "bg-sky-50 text-sky-700 ring-sky-100",
  },
  {
    label: "Spray Advisory",
    labelHi: "स्प्रे सलाह",
    href: "/weather/spray-advisory",
    icon: SprayCan,
    color: "bg-teal-50 text-teal-700 ring-teal-100",
  },
  {
    label: "Fertilizer Planner",
    labelHi: "खाद योजना",
    href: "/services/fertilizer-calculator",
    icon: FlaskConical,
    color: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  {
    label: "Pest & Disease",
    labelHi: "कीट व रोग",
    href: "/pest-diseases",
    icon: Bug,
    color: "bg-rose-50 text-rose-700 ring-rose-100",
  },
  {
    label: "Ask Community",
    labelHi: "किसानों से पूछें",
    href: "/community",
    icon: UsersRound,
    color: "bg-violet-50 text-violet-700 ring-violet-100",
  },
] as const;

function daysSince(dateValue?: string): number {
  if (!dateValue) return 42;
  const timestamp = Date.parse(dateValue);
  if (Number.isNaN(timestamp)) return 42;
  return Math.max(1, Math.floor((Date.now() - timestamp) / 86_400_000));
}

function SectionTitle({
  title,
  action,
  href,
}: {
  title: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 className="font-sans text-[17px] font-extrabold tracking-[-0.025em] text-[#173c2b]">{title}</h2>
      {action && href ? (
        <AppLink
          href={href}
          className="inline-flex items-center gap-0.5 text-xs font-bold text-[#16794a]"
        >
          {action}
          <ChevronRight className="h-3.5 w-3.5" />
        </AppLink>
      ) : null}
    </div>
  );
}

export default function DesktopDashboard({ embedded: _embedded }: { embedded?: boolean } = {}) {
  const { data: farm } = useFarmData();
  const { profile } = useFarmerProfile();
  const { weather, loading: weatherLoading } = useLiveWeather();

  const firstName = profile.name.trim().split(/\s+/)[0] || "Kisan";
  const location = [profile.village, profile.district].filter(Boolean).join(", ") || "Sehore, MP";
  const primaryField = farm.fields[0];
  const cropName = primaryField?.crop?.split("(")[0].trim() || "Wheat";
  const fieldName = primaryField?.name || "North Field";
  const stage = primaryField?.stage || "Vegetative growth";
  const cropDay = daysSince(primaryField?.sowingDate);
  const rainChance = weather?.hourlyForecast[0]?.rainChancePercent ?? 20;
  const numericWind = Number.parseInt(weather?.windSpeed ?? "8", 10);
  const canSpray = rainChance < 40 && numericWind <= 15;
  const adviceTitle = canSpray ? "शाम 5 बजे के बाद स्प्रे करें" : "आज स्प्रे रोकना बेहतर है";
  const adviceBody = canSpray
    ? `हवा ${weather?.windSpeed ?? "8 km/h"} रहेगी और बारिश की संभावना केवल ${rainChance}% है। पत्तियों की निचली सतह भी भिगोएँ।`
    : `बारिश की संभावना ${rainChance}% और हवा ${weather?.windSpeed ?? "तेज़"} है। दवा के नुकसान से बचने के लिए अगले साफ़ समय का इंतज़ार करें।`;

  return (
    <div className="home-dashboard relative mx-auto min-w-0 max-w-6xl text-[#173c2b]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-28 top-20 h-64 w-64 rounded-full bg-[#dff2d9]/70 blur-3xl"
      />

      <div className="relative space-y-5 sm:space-y-6">
        <section className="flex items-end justify-between gap-3 px-0.5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#52705f]">नमस्ते, {firstName} जी 👋</p>
            <h1 className="mt-1 font-sans text-[25px] font-extrabold leading-[1.12] tracking-[-0.035em] text-[#153b29] sm:text-3xl">
              आज फसल के लिए क्या करें?
            </h1>
          </div>
          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-[#e2d7b6] bg-[#fffaf0] px-3 py-2 shadow-sm sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3c75a] text-[#5d4404]">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span>
              <span className="block text-[11px] font-extrabold text-[#5d4404]">1,240 Points</span>
              <span className="block text-[9px] font-semibold text-[#8a7440]">Kisan Rewards</span>
            </span>
          </div>
        </section>

        <section className="group relative min-h-[310px] overflow-hidden rounded-[30px] bg-[#123b28] shadow-[0_24px_60px_-24px_rgba(10,66,39,0.75)] sm:min-h-[340px]">
          <Image
            src="/images/home/agriveda-leaf-scan-hero.webp"
            alt="Farmer scanning a crop leaf with a phone"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 950px"
            className="object-cover object-[68%_center] transition duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,45,28,0.97)_0%,rgba(8,53,32,0.88)_38%,rgba(8,53,32,0.22)_74%,rgba(8,53,32,0.08)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl" />

          <div className="relative z-10 flex min-h-[310px] max-w-[76%] flex-col justify-between p-5 sm:min-h-[340px] sm:max-w-[60%] sm:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/12 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                  <ShieldCheck className="h-3.5 w-3.5 text-lime-300" />
                  AI Crop Doctor
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#dff86a] px-2.5 py-1 text-[10px] font-extrabold text-[#264514]">
                  <BadgeCheck className="h-3 w-3" />
                  92% useful
                </span>
              </div>
              <h2 className="mt-4 max-w-md font-sans text-[26px] font-extrabold leading-[1.06] tracking-[-0.04em] text-white sm:text-[36px]">
                पत्ती की फोटो लें.
                <span className="block text-[#dff86a]">इलाज तुरंत जानें.</span>
              </h2>
              <p className="mt-3 max-w-sm text-[13px] font-medium leading-relaxed text-emerald-50/85 sm:text-sm">
                बीमारी, कीट या पोषक कमी पहचानें — आसान भाषा में सही अगला कदम पाएँ।
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <AppLink
                href="/ai-doctor"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#e5f67a] px-4 text-sm font-extrabold text-[#173c2b] shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition hover:bg-[#efff8f] active:scale-[0.98]"
              >
                <ScanLine className="h-5 w-5" strokeWidth={2.4} />
                Scan Problem
              </AppLink>
              <AppLink
                href="/kisan-saathi"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/18 active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4 text-[#dff86a]" />
                Ask AI
              </AppLink>
            </div>
          </div>

          <div className="absolute bottom-5 right-5 hidden items-center gap-2 rounded-2xl border border-white/20 bg-white/12 px-3 py-2 text-white backdrop-blur-lg sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#dff86a] text-[#173c2b]">
              <Leaf className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/70">Diagnosis in</p>
              <p className="text-xs font-extrabold">under 30 sec</p>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle title="Quick Actions" />
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3">
            {QUICK_ACTIONS.map(({ label, labelHi, href, icon: Icon, color }) => (
              <AppLink
                key={label}
                href={href}
                className="group flex min-h-[112px] flex-col items-center justify-center rounded-[22px] border border-[#e2eee6] bg-white px-2 py-3 text-center shadow-[0_8px_24px_-18px_rgba(16,65,39,0.55)] transition hover:-translate-y-0.5 hover:border-[#b9dcc7] hover:shadow-[0_14px_30px_-18px_rgba(16,65,39,0.5)] active:scale-[0.98]"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 transition group-hover:scale-105 ${color}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <span className="mt-2.5 text-[11px] font-extrabold leading-tight text-[#1c4531]">
                  {label}
                </span>
                <span className="mt-0.5 text-[9px] font-semibold leading-tight text-[#718678]">
                  {labelHi}
                </span>
              </AppLink>
            ))}
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
          <section className="rounded-[26px] border border-[#e0ece4] bg-white p-4 shadow-[0_14px_40px_-28px_rgba(13,70,41,0.55)] sm:p-5">
            <SectionTitle title="Weather Today" action="7-day forecast" href="/weather" />
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff7d8] to-[#edf8de] text-[#c8880c]">
                  <CloudSun className="h-7 w-7" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-end gap-2">
                    <p className="text-[30px] font-extrabold leading-none tracking-[-0.04em] text-[#173c2b]">
                      {weatherLoading ? "—" : weather?.temp ?? "28°C"}
                    </p>
                    <p className="pb-0.5 text-xs font-bold capitalize text-[#668071]">
                      {weather?.condition ?? "Clear"}
                    </p>
                  </div>
                  <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#718678]">
                    <MapPin className="h-3 w-3 text-[#258859]" />
                    <span className="truncate">{location}</span>
                  </p>
                </div>
              </div>
              <span
                className={`hidden rounded-full px-3 py-1.5 text-[10px] font-extrabold sm:inline-flex ${
                  canSpray ? "bg-[#eaf8ed] text-[#23754a]" : "bg-[#fff3dc] text-[#9a6506]"
                }`}
              >
                {canSpray ? "Good for spray" : "Avoid spray"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x divide-[#e7efe9] rounded-2xl bg-[#f7faf7] px-1 py-3">
              {[
                { icon: Droplets, value: weather?.humidity ?? "64%", label: "Humidity" },
                { icon: Wind, value: weather?.windSpeed ?? "8 km/h", label: "Wind" },
                { icon: CloudRain, value: `${rainChance}%`, label: "Rain" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="px-2 text-center">
                  <Icon className="mx-auto h-4 w-4 text-[#399267]" strokeWidth={2} />
                  <p className="mt-1 text-xs font-extrabold text-[#244b37]">{value}</p>
                  <p className="mt-0.5 text-[9px] font-semibold text-[#7d9185]">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[26px] border border-[#e0ece4] bg-white shadow-[0_14px_40px_-28px_rgba(13,70,41,0.55)]">
            <div className="p-4 pb-3 sm:p-5 sm:pb-3">
              <SectionTitle title="My Fields" action={primaryField ? "View field" : "Add field"} href="/my-farm" />
              <div className="flex items-center gap-3">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-br from-[#dff1c9] to-[#f7e7aa] text-[#257346]">
                  <Wheat className="h-8 w-8" strokeWidth={1.7} />
                  <span className="absolute -bottom-3 -right-3 h-8 w-8 rounded-full bg-white/55" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-extrabold text-[#173c2b]">{cropName}</p>
                      <p className="mt-0.5 truncate text-[11px] font-semibold text-[#718678]">{fieldName}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#e9f7ec] px-2.5 py-1 text-[9px] font-extrabold text-[#25734a]">
                      Healthy
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e7efe7]">
                    <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[#69b86e] to-[#b5d84c]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-[#e7efe9] bg-[#f9fbf8]">
              <div className="flex items-center gap-2.5 border-r border-[#e7efe9] px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#3b9164] shadow-sm">
                  <Leaf className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[9px] font-semibold text-[#809087]">Growth stage</p>
                  <p className="max-w-[120px] truncate text-[11px] font-extrabold text-[#294f3b]">{stage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#3b9164] shadow-sm">
                  <CalendarDays className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[9px] font-semibold text-[#809087]">Crop age</p>
                  <p className="text-[11px] font-extrabold text-[#294f3b]">Day {cropDay}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section>
          <SectionTitle title="Today’s Advice" />
          <div className="relative overflow-hidden rounded-[26px] border border-[#dcebd9] bg-gradient-to-br from-[#eff8e9] via-[#f8fbf4] to-[#fff9e9] p-4 shadow-[0_14px_40px_-28px_rgba(13,70,41,0.45)] sm:p-5">
            <div
              aria-hidden
              className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[20px] border-white/45"
            />
            <div className="relative flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1f7a4d] text-white shadow-[0_8px_20px_-8px_rgba(18,99,58,0.6)]">
                <SprayCan className="h-6 w-6" strokeWidth={1.9} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#e1f2d8] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#367247]">
                    Recommended for you
                  </span>
                  <span className="text-[10px] font-bold text-[#809087]">• 2 min read</span>
                </div>
                <h3 className="mt-2 text-base font-extrabold leading-snug text-[#173c2b] sm:text-lg">
                  {adviceTitle}
                </h3>
                <p className="mt-1.5 max-w-3xl text-[12px] font-medium leading-relaxed text-[#597064] sm:text-[13px]">
                  {adviceBody}
                </p>
                <AppLink
                  href="/weather/spray-advisory"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#197848]"
                >
                  पूरी सलाह देखें
                  <ArrowRight className="h-3.5 w-3.5" />
                </AppLink>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center gap-2 pb-1 pt-1 text-[10px] font-bold text-[#708478]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#338a5e]" />
          AgriVeda advice is reviewed by agricultural experts
        </div>
      </div>
    </div>
  );
}
