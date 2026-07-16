"use client";

import AppLink from "@/components/ui/AppLink";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Bug,
  CloudSun,
  Droplets,
  FlaskConical,
  Users,
  Award,
  ShieldCheck,
} from "lucide-react";
import HomeScanHero from "@/components/dashboard/HomeScanHero";
import HomeWeatherCard from "@/components/dashboard/HomeWeatherCard";
import HomeFarmSnapshot from "@/components/dashboard/HomeFarmSnapshot";
import HomeTodayAdvice from "@/components/dashboard/HomeTodayAdvice";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { EASE_OUT } from "@/lib/motion/variants";
import { cn } from "@/lib/cn";

const QUICK_ACTIONS: {
  label: string;
  labelHi: string;
  href: string;
  icon: typeof BookOpen;
  tint: string;
}[] = [
  {
    label: "Crop Guide",
    labelHi: "फसल गाइड",
    href: "/crops",
    icon: BookOpen,
    tint: "from-emerald-500/15 to-lime-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    label: "Weather",
    labelHi: "मौसम",
    href: "/weather",
    icon: CloudSun,
    tint: "from-sky-500/15 to-cyan-500/10 text-sky-700 dark:text-sky-300",
  },
  {
    label: "Spray Advisory",
    labelHi: "स्प्रे सलाह",
    href: "/weather/spray-advisory",
    icon: Droplets,
    tint: "from-teal-500/15 to-emerald-500/10 text-teal-700 dark:text-teal-300",
  },
  {
    label: "Fertilizer Planner",
    labelHi: "उर्वरक योजना",
    href: "/services/fertilizer-calculator",
    icon: FlaskConical,
    tint: "from-amber-500/15 to-orange-500/10 text-amber-800 dark:text-amber-300",
  },
  {
    label: "Pest & Disease",
    labelHi: "कीट व रोग",
    href: "/pest-diseases",
    icon: Bug,
    tint: "from-rose-500/12 to-orange-500/10 text-rose-700 dark:text-rose-300",
  },
  {
    label: "Ask Community",
    labelHi: "समुदाय",
    href: "/community",
    icon: Users,
    tint: "from-stone-500/12 to-emerald-500/10 text-stone-700 dark:text-stone-200",
  },
];

export default function DesktopDashboard({ embedded: _embedded }: { embedded?: boolean } = {}) {
  const reduced = useReducedMotion();
  const { locale } = useLocale();
  const isHi = locale === "hi" || locale === "hinglish";

  return (
    <div className="relative min-w-0 max-w-full overflow-x-hidden">
      {/* Soft earthy wash — atmosphere without dashboard clutter */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-16px] top-0 z-0 h-[420px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.16),transparent_55%),radial-gradient(ellipse_at_90%_10%,rgba(180,140,80,0.12),transparent_50%),linear-gradient(180deg,rgba(236,253,245,0.65)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_20%_0%,rgba(16,185,129,0.12),transparent_55%),radial-gradient(ellipse_at_90%_10%,rgba(180,140,80,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Points / trust strip — answers “why trust AgriVeda” without crowding the hero */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="flex items-center justify-between gap-2 rounded-2xl border border-emerald-500/15 bg-[var(--av-surface)]/85 px-3 py-2 shadow-sm backdrop-blur-md"
        >
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[var(--av-text-primary)]">
              {isHi ? "आज का फ़ोकस: फसल की जाँच" : "Aaj ka focus: fasal check"}
            </p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-medium text-[var(--av-text-muted)]">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[var(--av-accent)]" />
              {isHi ? "किसानों का भरोसेमंद साथी" : "Farmers ka bharosemand saathi"}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-amber-800 ring-1 ring-amber-500/25 dark:text-amber-200">
            <Award className="h-3.5 w-3.5" />
            {isHi ? "१२० अंक" : "120 pts"}
          </span>
        </motion.div>

        <HomeScanHero />

        <section className="min-w-0">
          <div className="mb-2.5 px-0.5">
            <h2 className="font-display text-base font-bold tracking-tight text-[var(--av-text-primary)]">
              {isHi ? "त्वरित काम" : "Quick Actions"}
            </h2>
            <p className="mt-0.5 text-[12px] text-[var(--av-text-muted)]">
              {isHi ? "एक टैप — सही टूल" : "One tap — the right tool"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {QUICK_ACTIONS.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.href + a.label}
                  className="min-w-0"
                  initial={reduced ? false : { opacity: 0, y: 10, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.38, ease: EASE_OUT }}
                  whileTap={reduced ? undefined : { scale: 0.96 }}
                >
                  <AppLink
                    href={a.href}
                    className="av-tool-press flex h-full flex-col items-center gap-2 rounded-[1.25rem] border border-emerald-500/12 bg-[var(--av-surface)]/95 px-2 py-3 text-center shadow-[0_6px_20px_-10px_rgba(4,80,40,0.28)]"
                  >
                    <span
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ring-black/5 dark:ring-white/10",
                        a.tint
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2.15} />
                    </span>
                    <span className="line-clamp-2 text-[11px] font-bold leading-tight text-[var(--av-text-primary)]">
                      {isHi ? a.labelHi : a.label}
                    </span>
                  </AppLink>
                </motion.div>
              );
            })}
          </div>
        </section>

        <HomeWeatherCard />
        <HomeFarmSnapshot />
        <HomeTodayAdvice />
      </div>
    </div>
  );
}
