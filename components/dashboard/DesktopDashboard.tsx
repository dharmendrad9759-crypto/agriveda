"use client";

import AppLink from "@/components/ui/AppLink";
import { Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import DashboardWeatherHero from "@/components/dashboard/DashboardWeatherHero";
import HomeFarmSnapshot from "@/components/dashboard/HomeFarmSnapshot";
import HomeFeatureGrid from "@/components/dashboard/HomeFeatureGrid";
import HomeSnapSlider, { HomeTipCarousel } from "@/components/dashboard/HomeSnapSlider";
import { QuickActionIcon } from "@/components/services/SpriteQuickIcon";
import { useFarmData } from "@/hooks/useFarmData";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

const QUICK_ACTIONS: {
  label: string;
  href: string;
  col?: number;
  row?: number;
  lucide?: typeof Plus;
  imageSrc?: string;
}[] = [
  { label: "AI Doctor", href: "/ai-doctor", imageSrc: "/images/icons/ai-doctor.png" },
  { label: "Add Field", href: "/my-farm", lucide: Plus },
  { label: "Crop Planner", href: "/crop-calendar", col: 1, row: 0 },
  { label: "Pest Scanner", href: "/pest-diseases", col: 3, row: 0 },
  { label: "Fertilizer", href: "/services/fertilizer-calculator", col: 2, row: 0 },
  { label: "Mandi", href: "/mandi", col: 5, row: 0 },
  { label: "Weather", href: "/weather", col: 0, row: 1 },
];

const TIPS = [
  {
    title: "खेत का data खुद भरें",
    body: "My Farm में रकबा और फसल जोड़ें — alerts उसी से आएंगे।",
  },
  {
    title: "स्प्रे से पहले मौसम देखें",
    body: "Spray Advisory में हवा और बारिश चेक करें।",
    href: "/weather/spray-advisory",
  },
  {
    title: "मंडी भाव live",
    body: "Mandi page पर आज के भाव — बेचने से पहले देखें।",
    href: "/mandi",
  },
];

export default function DesktopDashboard({ embedded: _embedded }: { embedded?: boolean } = {}) {
  const { data: farm } = useFarmData();
  const reduced = useReducedMotion();

  return (
    <div className="space-y-3 min-w-0 max-w-full overflow-x-hidden">
      <DashboardWeatherHero />

      <HomeFarmSnapshot />

      <section className="min-w-0">
        <div className="mb-1.5 flex items-center justify-between px-0.5">
          <h2 className="text-xs font-bold text-[var(--av-text-primary)]">Quick Actions</h2>
          <span className="text-[9px] font-semibold text-[var(--av-text-muted)]">swipe →</span>
        </div>
        <HomeSnapSlider itemCount={QUICK_ACTIONS.length}>
          {QUICK_ACTIONS.map((a, i) => (
            <motion.div
              key={a.href + a.label}
              data-slide
              className="w-[72px] shrink-0 snap-start"
              initial={reduced ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: MOTION.normal, ease: EASE_OUT }}
            >
              <AppLink
                href={a.href}
                className="group flex flex-col items-center gap-1 text-center active:scale-95"
              >
                <QuickActionIcon
                  label={a.label}
                  col={a.col}
                  row={a.row}
                  lucide={a.lucide}
                  imageSrc={a.imageSrc}
                />
                <span className="line-clamp-2 text-[9px] font-semibold leading-tight text-[var(--av-text-secondary)]">
                  {a.label}
                </span>
              </AppLink>
            </motion.div>
          ))}
        </HomeSnapSlider>
      </section>

      <HomeFeatureGrid />

      <HomeTipCarousel tips={TIPS} />

      {farm.activities.length > 0 && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.normal, ease: EASE_OUT }}
          className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[var(--av-text-primary)]">आपके कार्य</h3>
            <AppLink href="/my-farm" className="text-[10px] font-bold text-[var(--av-accent)]">
              सभी →
            </AppLink>
          </div>
          <ul className="mt-2 space-y-1">
            {farm.activities.slice(0, 3).map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-[var(--av-surface-inset)] px-2.5 py-1.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-[var(--av-text-primary)]">{a.task}</p>
                  <p className="truncate text-[9px] text-[var(--av-text-muted)]">{a.field}</p>
                </div>
                <span className="shrink-0 text-[9px] font-bold text-[var(--av-accent)]">{a.date}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
