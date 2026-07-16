"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Camera,
  CloudRain,
  CloudSun,
  Droplets,
  FlaskConical,
  Gift,
  Leaf,
  MessageCircle,
  Microscope,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  ThermometerSun,
  Wind,
} from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import AppLink from "@/components/ui/AppLink";
import { useFarmData } from "@/hooks/useFarmData";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";

const quickActions: {
  label: string;
  hint: string;
  href: string;
  icon: LucideIcon;
  tone: string;
}[] = [
  {
    label: "Crop Guide",
    hint: "फसल ज्ञान",
    href: "/crops",
    icon: BookOpen,
    tone: "from-emerald-500 to-lime-500",
  },
  {
    label: "Weather",
    hint: "आज का मौसम",
    href: "/weather",
    icon: CloudSun,
    tone: "from-sky-500 to-cyan-500",
  },
  {
    label: "Spray Advisory",
    hint: "स्प्रे timing",
    href: "/weather/spray-advisory",
    icon: Droplets,
    tone: "from-teal-500 to-emerald-500",
  },
  {
    label: "Fertilizer Planner",
    hint: "खाद dose",
    href: "/services/fertilizer-calculator",
    icon: FlaskConical,
    tone: "from-amber-500 to-orange-500",
  },
  {
    label: "Pest & Disease",
    hint: "रोग/कीट",
    href: "/pest-diseases",
    icon: Microscope,
    tone: "from-rose-500 to-orange-500",
  },
  {
    label: "Ask Community",
    hint: "किसान चर्चा",
    href: "/community",
    icon: MessageCircle,
    tone: "from-violet-500 to-fuchsia-500",
  },
];

function daysSince(date?: string) {
  if (!date) return 38;

  const started = new Date(date);
  if (Number.isNaN(started.getTime())) return 38;

  const diff = Date.now() - started.getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto mt-5 h-48 max-w-[320px] overflow-hidden rounded-[30px] border border-white/25 bg-gradient-to-br from-emerald-900 via-emerald-700 to-lime-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_24px_50px_-26px_rgba(4,120,87,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(252,211,77,0.22),transparent_24%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-lime-900/70 via-emerald-800/20 to-transparent" />
      <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-2 opacity-80">
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className="h-20 w-5 origin-bottom rounded-full bg-lime-300/35"
            style={{ transform: `rotate(${index % 2 === 0 ? -10 : 8}deg)` }}
          />
        ))}
      </div>

      <div className="absolute left-6 top-8">
        <div className="mx-auto h-9 w-9 rounded-full bg-amber-200 shadow-sm" />
        <div className="mt-1 h-20 w-16 rounded-[22px_22px_14px_14px] bg-gradient-to-b from-white to-emerald-50 shadow-lg" />
        <div className="absolute left-10 top-[52px] h-5 w-16 rotate-[-15deg] rounded-full bg-amber-200" />
      </div>

      <div className="absolute right-8 top-7 h-32 w-20 rotate-6 rounded-[24px] border-[5px] border-slate-900 bg-slate-950 shadow-2xl">
        <div className="absolute inset-1 overflow-hidden rounded-[17px] bg-gradient-to-b from-emerald-100 to-lime-100">
          <div className="absolute inset-3 rounded-[18px_4px_18px_4px] bg-gradient-to-br from-emerald-500 to-lime-500 shadow-inner">
            <span className="absolute left-5 top-5 h-2 w-2 rounded-full bg-yellow-200" />
            <span className="absolute right-4 top-8 h-1.5 w-1.5 rounded-full bg-orange-300" />
            <span className="absolute bottom-5 left-7 h-2.5 w-2.5 rounded-full bg-rose-400" />
          </div>
          <div className="absolute inset-5 rounded-xl border-2 border-white/90" />
          <ScanLine className="absolute left-4 right-4 top-[58px] h-5 w-12 text-white drop-shadow" />
        </div>
      </div>

      <div className="absolute left-5 right-5 top-4 flex items-center justify-between">
        <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
          AI leaf scan
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-700 shadow-lg">
          <Camera className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function QuickActionCard({
  action,
}: {
  action: (typeof quickActions)[number];
}) {
  const Icon = action.icon;

  return (
    <AppLink
      href={action.href}
      className="group flex min-h-[112px] flex-col justify-between rounded-[22px] border border-emerald-900/10 bg-white/90 p-3.5 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl transition active:scale-[0.98] dark:border-white/10 dark:bg-slate-900/75"
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${action.tone} text-white shadow-lg shadow-emerald-900/10`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-[12px] font-extrabold leading-tight text-[var(--av-text-primary)]">
          {action.label}
        </span>
        <span className="mt-0.5 block text-[10px] font-semibold text-[var(--av-text-muted)]">
          {action.hint}
        </span>
      </span>
    </AppLink>
  );
}

function WeatherMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-emerald-50/80 p-3 text-center dark:bg-emerald-400/10">
      <Icon className="mx-auto h-4 w-4 text-emerald-700 dark:text-emerald-300" />
      <p className="mt-1 text-[10px] font-semibold text-[var(--av-text-muted)]">{label}</p>
      <p className="text-sm font-extrabold text-[var(--av-text-primary)]">{value}</p>
    </div>
  );
}

export default function Home() {
  const { data: farm } = useFarmData();
  const { profile } = useFarmerProfile();

  const primaryField = farm.fields[0];
  const farmerName = profile.name?.trim() || "Kisan Saathi";
  const cropName = primaryField?.crop || "Wheat";
  const fieldStage = primaryField?.stage || "Vegetative growth";
  const cropDays = daysSince(primaryField?.sowingDate);
  const health = primaryField?.health ?? 86;

  return (
    <AppShell className="!bg-transparent">
      <div className="mx-auto max-w-lg space-y-4 pb-2">
        <section className="relative overflow-hidden rounded-[34px] border border-emerald-900/10 bg-gradient-to-br from-white via-emerald-50 to-[#eef8dc] p-4 shadow-[0_24px_60px_-34px_rgba(4,120,87,0.55)] dark:border-white/10 dark:from-slate-950 dark:via-emerald-950/70 dark:to-slate-900">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-lime-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-6 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/15 bg-white/70 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700 shadow-sm dark:bg-white/10 dark:text-emerald-200">
                <Sparkles className="h-3 w-3" />
                Smart farm assistant
              </div>
              <h1 className="mt-3 text-[28px] font-black leading-[1.02] tracking-tight text-[#10291d] dark:text-white">
                What should I do today for my crop?
              </h1>
              <p className="mt-2 text-[14px] font-semibold leading-relaxed text-[#4c6a58] dark:text-emerald-50/70">
                Namaste {farmerName.split(" ")[0]}, aaj crop ko healthy rakhne ke liye pehle leaf problem scan karein.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-amber-300/60 bg-gradient-to-br from-amber-50 to-white px-2.5 py-2 text-right shadow-sm dark:border-amber-300/20 dark:from-amber-400/15 dark:to-white/5">
              <div className="flex items-center justify-end gap-1 text-amber-600 dark:text-amber-300">
                <Gift className="h-3.5 w-3.5" />
                <span className="text-sm font-black">1,240</span>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-wide text-amber-700/80 dark:text-amber-200/80">
                AgriPoints
              </p>
            </div>
          </div>

          <HeroIllustration />

          <div className="relative mt-4 grid grid-cols-[1fr_auto] items-center gap-3">
            <AppLink
              href="/ai-doctor"
              className="flex min-h-[54px] items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 px-5 text-base font-black text-white shadow-[0_16px_32px_-14px_rgba(4,120,87,0.85)] active:scale-[0.98]"
            >
              <ScanLine className="h-5 w-5" />
              Scan Problem
              <ArrowRight className="h-4 w-4" />
            </AppLink>
            <AppLink
              href="/ai-doctor"
              className="flex h-[54px] w-[54px] items-center justify-center rounded-[20px] border border-emerald-600/15 bg-white/80 text-emerald-700 shadow-sm dark:bg-white/10 dark:text-emerald-200"
              aria-label="Ask AI Doctor"
            >
              <Stethoscope className="h-6 w-6" />
            </AppLink>
          </div>

          <div className="relative mt-3 flex items-center gap-2 rounded-2xl border border-emerald-600/10 bg-white/60 px-3 py-2 text-[11px] font-bold text-[#3c614b] backdrop-blur dark:bg-white/10 dark:text-emerald-50/75">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
            Trusted by progressive farmers · AI advice in simple language
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-end justify-between px-1">
            <div>
              <h2 className="text-lg font-black tracking-tight text-[var(--av-text-primary)]">
                Quick Actions
              </h2>
              <p className="text-[12px] font-semibold text-[var(--av-text-muted)]">
                One tap for today&apos;s farming decision
              </p>
            </div>
            <BadgeCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {quickActions.map((action) => (
              <QuickActionCard key={action.label} action={action} />
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-emerald-900/10 bg-white/90 p-4 shadow-[0_18px_44px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
                Weather Today
              </p>
              <h2 className="mt-1 text-2xl font-black text-[var(--av-text-primary)]">31°C</h2>
              <p className="text-[12px] font-semibold text-[var(--av-text-muted)]">
                Warm, light wind · good field visit window
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-lg shadow-amber-500/20">
              <ThermometerSun className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            <WeatherMetric icon={Droplets} label="Humidity" value="62%" />
            <WeatherMetric icon={Wind} label="Wind" value="8 km/h" />
            <WeatherMetric icon={CloudRain} label="Rain" value="20%" />
            <WeatherMetric icon={CloudSun} label="UV" value="Med" />
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[28px] border border-emerald-900/10 bg-gradient-to-br from-[#fffaf0] via-white to-emerald-50 p-4 shadow-[0_18px_44px_-30px_rgba(15,23,42,0.42)] dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                  My Fields
                </p>
                <h2 className="mt-1 text-xl font-black text-[var(--av-text-primary)]">{cropName}</h2>
                <p className="text-[12px] font-semibold text-[var(--av-text-muted)]">{fieldStage}</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl shadow-inner dark:bg-emerald-400/10">
                {primaryField?.emoji || "🌾"}
              </span>
            </div>
            <div className="mt-4 rounded-2xl bg-white/70 p-3 dark:bg-white/10">
              <div className="flex items-center justify-between text-[12px] font-bold">
                <span className="text-[var(--av-text-muted)]">Crop age</span>
                <span className="text-[var(--av-text-primary)]">{cropDays} days</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-emerald-100 dark:bg-emerald-400/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400"
                  style={{ width: `${Math.min(92, Math.max(18, cropDays))}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 dark:bg-emerald-400/10">
                <span className="text-[11px] font-bold text-[var(--av-text-muted)]">Field health</span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">{health}%</span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-900/10 bg-gradient-to-br from-emerald-700 via-emerald-600 to-lime-600 p-4 text-white shadow-[0_22px_46px_-28px_rgba(4,120,87,0.8)]">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                <Leaf className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-50/80">
                  Today&apos;s Advice
                </p>
                <h2 className="text-lg font-black">Do this first</h2>
              </div>
            </div>
            <p className="mt-4 text-[15px] font-bold leading-relaxed text-white">
              पत्तियों पर दाग दिखें तो सुबह photo scan करें. बारिश chance कम है, इसलिए spray advisory check करके शाम 4 बजे के बाद ही spray करें.
            </p>
            <AppLink
              href="/weather/spray-advisory"
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-emerald-700 shadow-lg shadow-emerald-950/10 active:scale-[0.98]"
            >
              View spray timing
              <ArrowRight className="h-4 w-4" />
            </AppLink>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
