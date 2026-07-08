"use client";

import AppLink from "@/components/ui/AppLink";
import {
  Bell,
  Brain,
  Calculator,
  Calendar,
  LayoutDashboard,
  Sparkles,
  Sprout,
  Stethoscope,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { BRAND } from "@/lib/brand";

const MODULES = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    title: "खेत Dashboard",
    desc: "सारी alerts एक जगह",
    glow: "from-emerald-500/25 to-teal-500/10 border-emerald-400/40",
  },
  {
    href: "/services/seed-calculator",
    icon: Calculator,
    title: "बीज कैलकुलेटर",
    desc: "ज़िले के हिसाब से बीघा → kg",
    glow: "from-amber-500/20 to-yellow-500/10 border-amber-400/40",
  },
  {
    href: "/sowing-window",
    icon: Calendar,
    title: "बुआई समय",
    desc: "सही समय — हरा/पीला/लाल",
    glow: "from-sky-500/20 to-cyan-500/10 border-sky-400/40",
  },
  {
    href: "/smart-crop",
    icon: Brain,
    title: "Smart Crop",
    desc: "ज़िले में किस फसल में फायदा",
    glow: "from-violet-500/20 to-indigo-500/10 border-violet-400/40",
  },
  {
    href: "/crop-problem",
    icon: Stethoscope,
    title: "समस्या → समाधान",
    desc: "Photo · लक्षण · Chat",
    glow: "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-400/40",
  },
  {
    href: "/kisan-saathi",
    icon: Sparkles,
    title: "Kisan Saathi",
    desc: "छोटे, सटीक AI जवाब",
    glow: "from-emerald-500/20 to-lime-500/10 border-lime-400/40",
  },
  {
    href: "/alerts",
    icon: Bell,
    title: "खेत अलर्ट",
    desc: "3–5 दिन पहले चेतावनी",
    glow: "from-rose-500/20 to-red-500/10 border-rose-400/40",
  },
  {
    href: "/services/fertilizer-calculator",
    icon: Sprout,
    title: "खाद कैलकुलेटर",
    desc: "NPK — एकड़/बीघा के हिसाब",
    glow: "from-lime-500/20 to-green-500/10 border-lime-400/40",
  },
];

export default function Agriveda2Hub() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-wide text-emerald-500">
            {BRAND}
          </p>
          <h2 className="text-lg font-extrabold theme-text-primary">
            मेरी फ़सल, मेरा डॉक्टर
          </h2>
          <p className="text-xs theme-text-muted">फसल, मौसम, कीट — सब एक जगह</p>
        </div>
        <AppLink href="/dashboard" className="text-xs font-bold text-emerald-600">
          Full dashboard →
        </AppLink>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <AppLink key={`${m.href}-${m.title}`} href={m.href}>
              <GlassCard
                hover
                className={`h-full border bg-gradient-to-br p-3.5 ${m.glow}`}
              >
                <Icon className="h-5 w-5 text-emerald-600" strokeWidth={2} />
                <p className="mt-2 text-sm font-extrabold leading-tight theme-text-primary">
                  {m.title}
                </p>
                <p className="mt-0.5 text-[10px] theme-text-muted">{m.desc}</p>
              </GlassCard>
            </AppLink>
          );
        })}
      </div>
    </section>
  );
}
