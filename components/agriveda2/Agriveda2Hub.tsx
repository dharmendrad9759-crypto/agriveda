"use client";

import Link from "next/link";
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

const MODULES = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    title: "मेरा खेत",
    desc: "सभी खेत · alerts · stage",
    glow: "from-emerald-500/25 to-teal-500/10 border-emerald-400/40",
  },
  {
    href: "/services/seed-calculator",
    icon: Calculator,
    title: "बीज कैलकुलेटर",
    desc: "Area → exact seed kg",
    glow: "from-amber-500/20 to-yellow-500/10 border-amber-400/40",
  },
  {
    href: "/sowing-window",
    icon: Calendar,
    title: "बुआई समय",
    desc: "Green Window Alert",
    glow: "from-sky-500/20 to-cyan-500/10 border-sky-400/40",
  },
  {
    href: "/smart-crop",
    icon: Brain,
    title: "Smart Crop",
    desc: "5-layer profit ranking",
    glow: "from-violet-500/20 to-indigo-500/10 border-violet-400/40",
  },
  {
    href: "/crop-problem",
    icon: Stethoscope,
    title: "समस्या → समाधान",
    desc: "Photo · Voice · Symptoms",
    glow: "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-400/40",
  },
  {
    href: "/kisan-saathi",
    icon: Sparkles,
    title: "Kisan Saathi",
    desc: "24/7 AI chat doctor",
    glow: "from-emerald-500/20 to-lime-500/10 border-lime-400/40",
  },
  {
    href: "/alerts",
    icon: Bell,
    title: "Predictive Alerts",
    desc: "3–5 दिन पहले warning",
    glow: "from-rose-500/20 to-red-500/10 border-rose-400/40",
  },
  {
    href: "/services/fertilizer-calculator",
    icon: Sprout,
    title: "खाद कैलकुलेटर",
    desc: "NPK by acre",
    glow: "from-lime-500/20 to-green-500/10 border-lime-400/40",
  },
];

export default function Agriveda2Hub() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500">
            AGRIVEDA 2.0
          </p>
          <h2 className="text-lg font-extrabold theme-text-primary">
            मेरी फ़सल, मेरा डॉक्टर
          </h2>
          <p className="text-xs theme-text-muted">Reactive नहीं — Predictive</p>
        </div>
        <Link href="/dashboard" className="text-xs font-bold text-emerald-600">
          Full dashboard →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.href} href={m.href}>
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
            </Link>
          );
        })}
      </div>
    </section>
  );
}
