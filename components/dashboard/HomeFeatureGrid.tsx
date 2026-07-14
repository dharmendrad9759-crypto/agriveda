"use client";

import type { LucideIcon } from "lucide-react";
import {
  Tractor,
  Leaf,
  Brain,
  Droplets,
  Calendar,
  Bell,
  BookOpen,
  ShieldAlert,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import AppLink from "@/components/ui/AppLink";
import HomeSnapSlider from "@/components/dashboard/HomeSnapSlider";
import { cn } from "@/lib/cn";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";

/** Tools NOT already in Quick Actions (AI, Add Field, Planner, Pest Scanner, Fertilizer, Mandi, Weather) */
const FEATURES: {
  label: string;
  sub: string;
  href: string;
  icon: LucideIcon;
  ring: string;
}[] = [
  { label: "My Farm", sub: "खेत", href: "/my-farm", icon: Tractor, ring: "ring-emerald-500/40" },
  { label: "Nutrients", sub: "Deficiency", href: "/deficiencies", icon: Leaf, ring: "ring-lime-500/40" },
  { label: "Advisor", sub: "Field", href: "/field-advisor", icon: Brain, ring: "ring-violet-500/40" },
  { label: "Spray", sub: "Advisory", href: "/weather/spray-advisory", icon: Droplets, ring: "ring-cyan-500/40" },
  { label: "Sowing", sub: "Window", href: "/sowing-window", icon: Calendar, ring: "ring-indigo-500/40" },
  { label: "Alerts", sub: "Farm", href: "/alerts", icon: Bell, ring: "ring-red-500/40" },
  { label: "Weeds", sub: "Guide", href: "/pest-diseases?type=weed", icon: ShieldAlert, ring: "ring-orange-500/40" },
  { label: "Library", sub: "ज्ञान", href: "/library", icon: BookOpen, ring: "ring-stone-500/40" },
];

export default function HomeFeatureGrid() {
  const reduced = useReducedMotion();

  return (
    <section className="min-w-0">
      <div className="mb-1.5 flex items-center justify-between px-0.5">
        <h2 className="text-xs font-bold text-[var(--av-text-primary)]">More Tools</h2>
        <span className="text-[9px] font-semibold text-[var(--av-text-muted)]">swipe →</span>
      </div>
      <HomeSnapSlider itemCount={FEATURES.length} showArrows>
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.href + f.label}
            data-slide
            className="w-[88px] shrink-0 snap-start"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i, 8) * 0.04, duration: MOTION.normal, ease: EASE_OUT }}
          >
            <AppLink
              href={f.href}
              className={cn(
                "group flex flex-col items-center gap-1 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-2.5 text-center shadow-sm",
                "transition duration-200 hover:-translate-y-0.5 hover:border-[var(--av-accent)]/35 hover:shadow-[0_8px_24px_rgba(0,100,50,0.12)] active:scale-[0.97]"
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-transparent ring-1",
                  f.ring
                )}
              >
                <f.icon className="h-4 w-4 text-[var(--av-accent)] transition group-hover:scale-110" />
              </span>
              <span className="truncate text-[10px] font-bold text-[var(--av-text-primary)]">{f.label}</span>
              <span className="truncate text-[8px] text-[var(--av-text-muted)]">{f.sub}</span>
            </AppLink>
          </motion.div>
        ))}
      </HomeSnapSlider>
    </section>
  );
}
