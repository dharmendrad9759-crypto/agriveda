"use client";

import type { LucideIcon } from "lucide-react";
import {
  Tractor,
  FlaskConical,
  Leaf,
  CloudSun,
  Brain,
  Droplets,
  Calendar,
  Bell,
  BookOpen,
  Sprout,
  ShieldAlert,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { cn } from "@/lib/cn";

const FEATURES: {
  label: string;
  sub: string;
  href: string;
  icon: LucideIcon;
  accent: string;
}[] = [
  {
    label: "My Farm",
    sub: "खेत प्रबंधन",
    href: "/my-farm",
    icon: Tractor,
    accent: "from-emerald-500/25 to-green-600/5 border-emerald-500/25",
  },
  {
    label: "Fertilizer",
    sub: "Schedule",
    href: "/services/fertilizer-calculator",
    icon: FlaskConical,
    accent: "from-amber-500/20 to-orange-500/5 border-amber-500/20",
  },
  {
    label: "Nutrients",
    sub: "Deficiency",
    href: "/deficiencies",
    icon: Leaf,
    accent: "from-lime-500/20 to-green-500/5 border-lime-500/20",
  },
  {
    label: "Weather",
    sub: "Forecast",
    href: "/weather",
    icon: CloudSun,
    accent: "from-sky-500/20 to-blue-500/5 border-sky-500/20",
  },
  {
    label: "Field Advisor",
    sub: "सलाह",
    href: "/field-advisor",
    icon: Brain,
    accent: "from-violet-500/20 to-purple-500/5 border-violet-500/20",
  },
  {
    label: "Spray",
    sub: "Advisory",
    href: "/weather/spray-advisory",
    icon: Droplets,
    accent: "from-cyan-500/20 to-teal-500/5 border-cyan-500/20",
  },
  {
    label: "Sowing",
    sub: "Window",
    href: "/sowing-window",
    icon: Calendar,
    accent: "from-indigo-500/20 to-blue-500/5 border-indigo-500/20",
  },
  {
    label: "Alerts",
    sub: "Farm",
    href: "/alerts",
    icon: Bell,
    accent: "from-red-500/15 to-rose-500/5 border-red-500/20",
  },
  {
    label: "Crop Calendar",
    sub: "योजना",
    href: "/crop-calendar",
    icon: Sprout,
    accent: "from-emerald-600/15 to-teal-500/5 border-emerald-500/15",
  },
  {
    label: "Pest Guide",
    sub: "कीट रोग",
    href: "/pest-diseases",
    icon: ShieldAlert,
    accent: "from-orange-500/15 to-amber-500/5 border-orange-500/20",
  },
  {
    label: "Library",
    sub: "ज्ञान",
    href: "/library",
    icon: BookOpen,
    accent: "from-stone-500/15 to-neutral-500/5 border-stone-500/20",
  },
];

export default function HomeFeatureGrid() {
  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-center justify-between px-0.5">
        <h2 className="text-sm font-bold text-[var(--av-text-primary)]">Farm Tools</h2>
        <span className="text-[10px] font-semibold text-[var(--av-text-muted)]">सब कुछ एक जगह</span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5 lg:grid-cols-6">
        {FEATURES.map((f) => (
          <AppLink
            key={f.href + f.label}
            href={f.href}
            className={cn(
              "group relative flex min-w-0 flex-col items-center gap-1.5 overflow-hidden rounded-2xl border bg-gradient-to-br p-2.5 text-center transition",
              "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98]",
              f.accent
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--av-surface)]/80 shadow-sm ring-1 ring-white/10">
              <f.icon className="h-4 w-4 text-[var(--av-accent)]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold leading-tight text-[var(--av-text-primary)] sm:text-[11px]">
                {f.label}
              </p>
              <p className="truncate text-[9px] text-[var(--av-text-muted)]">{f.sub}</p>
            </div>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
