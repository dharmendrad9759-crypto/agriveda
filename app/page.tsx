"use client";

import Link from "next/link";
import {
  Bug,
  FlaskConical,
  TrendingUp,
  Plus,
  Sparkles,
  CloudSun,
  Sprout,
  ChevronRight,
  User,
} from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import PageBackground from "@/components/ui/PageBackground";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { useMyCrops } from "@/hooks/useMyCrops";

const keyFeatures = [
  {
    title: "Pest & diseases",
    icon: Bug,
    href: "/pest-diseases",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    gradient: "from-red-500/20 to-orange-500/10 border-red-500/30",
  },
  {
    title: "Deficiencies",
    icon: FlaskConical,
    href: "/deficiencies",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
    gradient: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
  },
  {
    title: "Mandi Prices",
    icon: TrendingUp,
    href: "/mandi",
    glow: "shadow-[0_0_20px_rgba(0,255,136,0.3)]",
    gradient: "from-emerald-500/20 to-cyan-500/10 border-emerald-500/30",
  },
];

const quickAccess = [
  { title: "Crops", icon: Sprout, href: "/crops" },
  { title: "Weather", icon: CloudSun, href: "/weather" },
  { title: "Profile", icon: User, href: "/profile" },
];

export default function Home() {
  const { crops, hydrated } = useMyCrops();

  return (
    <div className="agriveda-page relative pb-28">
      <PageBackground />

      <div className="relative mx-auto max-w-lg px-5 pt-7 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">
              Agriveda Pro
            </p>
            <h1 className="agriveda-gradient-text text-3xl font-black tracking-tight animate-float">
              My Farm
            </h1>
          </div>
          <Link
            href="/ai-doctor"
            className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[11px] font-black text-emerald-400 shadow-[0_0_16px_rgba(0,255,136,0.15)] transition-all hover:border-emerald-400/50 hover:shadow-[0_0_24px_rgba(0,255,136,0.25)]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AgriChat AI
          </Link>
        </header>

        <section>
          <SectionHeading title="My crops." subtitle="Tap to open crop intelligence" />
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {hydrated &&
              crops.map((crop) => (
                <Link
                  key={crop.slug}
                  href={`/crop-details/${crop.slug}`}
                  className="group flex flex-shrink-0 flex-col items-center gap-2"
                >
                  <GlassCard
                    hover
                    neon
                    className="flex h-[92px] w-[92px] items-center justify-center text-4xl transition-transform group-hover:scale-105"
                  >
                    {crop.emoji}
                  </GlassCard>
                  <span className="max-w-[92px] text-center text-xs font-bold text-emerald-300/80 leading-tight">
                    {crop.name}
                  </span>
                </Link>
              ))}

            <Link
              href="/select-crops"
              className="group flex flex-shrink-0 flex-col items-center gap-2"
            >
              <div className="flex h-[92px] w-[92px] items-center justify-center rounded-3xl border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 transition-all hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(0,255,136,0.15)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 transition-transform group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(0,255,136,0.3)]">
                  <Plus className="h-5 w-5" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400/70">Add / Remove</span>
            </Link>
          </div>
        </section>

        <section>
          <SectionHeading title="AgriChat AI." subtitle="Neural crop diagnostics" />
          <Link href="/ai-doctor">
            <GlassCard hover neon className="flex items-center gap-4 px-4 py-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_12px_rgba(0,255,136,0.2)]">
                <div className="grid grid-cols-2 gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-400 agriveda-glow-dot" />
                  ))}
                </div>
              </div>
              <span className="flex-1 text-sm font-medium text-slate-400">
                Click to ask about crops.
              </span>
              <ChevronRight className="h-4 w-4 text-emerald-400" />
            </GlassCard>
          </Link>
        </section>

        <section>
          <SectionHeading title="Key features." />
          <div className="flex justify-around gap-2">
            {keyFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group flex flex-col items-center gap-2.5"
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl border bg-gradient-to-br ${feature.gradient} ${feature.glow} transition-all duration-300 group-hover:scale-110 group-active:scale-95`}
                  >
                    <Icon className="h-7 w-7 text-emerald-400" strokeWidth={1.75} />
                  </div>
                  <span className="max-w-[80px] text-center text-[11px] font-bold text-slate-300 leading-tight">
                    {feature.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <SectionHeading title="Quick access." />
          <div className="flex justify-around gap-2">
            {quickAccess.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-emerald-400 transition-all duration-300 group-hover:border-emerald-500/30 group-hover:shadow-[0_0_16px_rgba(0,255,136,0.15)] group-hover:scale-105">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <GlassCard neon className="overflow-hidden p-5">
          <h3 className="text-base font-extrabold text-white">Need expert help?</h3>
          <p className="mt-1 text-sm font-medium text-slate-400">
            Ask our Agriveda Expert about crop issues, pests, or diseases.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/ask-query"
              className="flex-1 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 py-3 text-center text-sm font-black text-emerald-400 shadow-[0_0_16px_rgba(0,255,136,0.1)] transition-all hover:shadow-[0_0_24px_rgba(0,255,136,0.2)]"
            >
              Ask query
            </Link>
            <Link
              href="/community"
              className="flex-1 rounded-2xl border border-white/10 bg-black/30 py-3 text-center text-sm font-bold text-slate-300 transition-colors hover:border-emerald-500/20 hover:text-emerald-400"
            >
              View feed
            </Link>
          </div>
        </GlassCard>
      </div>

      <Link
        href="/ai-doctor"
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-5 py-3 text-sm font-black text-emerald-400 shadow-[0_0_24px_rgba(0,255,136,0.2)] backdrop-blur-md transition-all hover:scale-105 hover:shadow-[0_0_32px_rgba(0,255,136,0.35)] md:bottom-8"
      >
        <div className="grid grid-cols-2 gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-400 agriveda-glow-dot" />
          ))}
        </div>
        AgriChat AI
      </Link>

      <BottomNav />
    </div>
  );
}
