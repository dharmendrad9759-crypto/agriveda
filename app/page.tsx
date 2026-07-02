"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bug,
  MessageCircleQuestion,
  BookOpen,
  Plus,
  Sparkles,
  CloudSun,
  Sprout,
  ChevronRight,
} from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import PageBackground from "@/components/ui/PageBackground";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import AddCropSheet from "@/components/home/AddCropSheet";
import { useMyCrops } from "@/hooks/useMyCrops";

const keyFeatures = [
  {
    title: "Pest & diseases",
    icon: Bug,
    href: "/crop-details/paddy",
    gradient: "from-emerald-600 to-green-700",
  },
  {
    title: "Agriveda Expert",
    icon: MessageCircleQuestion,
    href: "/community",
    gradient: "from-teal-600 to-emerald-700",
  },
  {
    title: "Agri Diary",
    icon: BookOpen,
    href: "/crops",
    gradient: "from-green-600 to-emerald-800",
  },
];

const quickAccess = [
  { title: "Crops", icon: Sprout, href: "/crops", gradient: "from-emerald-500 to-green-600" },
  { title: "Weather", icon: CloudSun, href: "/weather", gradient: "from-sky-400 to-blue-500" },
  { title: "AI Doctor", icon: Sparkles, href: "/ai-doctor", gradient: "from-violet-500 to-purple-600" },
];

export default function Home() {
  const { crops, hydrated, isSelected, toggleCrop } = useMyCrops();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="agriveda-page relative pb-28">
      <PageBackground />

      <div className="relative mx-auto max-w-lg px-5 pt-7 space-y-8">
        {/* Brand header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-emerald-600">
              Agriveda
            </p>
            <h1 className="agriveda-gradient-text text-3xl font-black tracking-tight">
              My Farm
            </h1>
          </div>
          <Link
            href="/ai-doctor"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-[11px] font-bold text-white shadow-lg shadow-emerald-900/25 transition-transform hover:scale-105"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AgriChat AI
          </Link>
        </header>

        {/* My crops */}
        <section>
          <SectionHeading title="My crops." />
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
                    strong
                    className="flex h-[92px] w-[92px] items-center justify-center text-4xl"
                  >
                    {crop.emoji}
                  </GlassCard>
                  <span className="max-w-[92px] text-center text-xs font-bold text-slate-700 leading-tight">
                    {crop.name}
                  </span>
                </Link>
              ))}

            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="group flex flex-shrink-0 flex-col items-center gap-2"
            >
              <div className="flex h-[92px] w-[92px] items-center justify-center rounded-3xl border-2 border-dashed border-emerald-300/60 bg-white/50 backdrop-blur-sm transition-all hover:border-emerald-500 hover:bg-emerald-50/50 hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-lg shadow-emerald-900/20 transition-transform group-hover:scale-110">
                  <Plus className="h-5 w-5" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700">Add / Remove</span>
            </button>
          </div>
        </section>

        {/* AgriChat AI bar */}
        <section>
          <SectionHeading title="AgriChat AI." />
          <Link href="/ai-doctor">
            <GlassCard strong hover className="flex items-center gap-4 px-4 py-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 shadow-md">
                <div className="grid grid-cols-2 gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/90" />
                  ))}
                </div>
              </div>
              <span className="flex-1 text-sm font-medium text-slate-500">
                Click to ask about crops.
              </span>
              <ChevronRight className="h-4 w-4 text-emerald-500" />
            </GlassCard>
          </Link>
        </section>

        {/* Key features */}
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
                    className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${feature.gradient} text-white shadow-lg shadow-emerald-900/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-active:scale-95`}
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.75} />
                  </div>
                  <span className="max-w-[80px] text-center text-[11px] font-bold text-slate-700 leading-tight">
                    {feature.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick access */}
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
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-md transition-all duration-300 group-hover:scale-105 group-active:scale-95`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Expert CTA */}
        <GlassCard strong className="overflow-hidden p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 pointer-events-none" />
          <div className="relative">
            <h3 className="text-base font-extrabold text-slate-900">Need expert help?</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Ask our Agriveda Expert about crop issues, pests, or diseases.
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/ask-query"
                className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 py-3 text-center text-sm font-bold text-white shadow-md shadow-emerald-900/20 transition-transform hover:scale-[1.02]"
              >
                Ask query
              </Link>
              <Link
                href="/community"
                className="flex-1 rounded-2xl border-2 border-emerald-500/30 bg-white/60 py-3 text-center text-sm font-bold text-emerald-700 backdrop-blur-sm transition-colors hover:bg-emerald-50"
              >
                View feed
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Floating AgriChat pill */}
      <Link
        href="/ai-doctor"
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-700 to-green-600 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-900/30 transition-transform hover:scale-105 md:bottom-8"
      >
        <div className="grid grid-cols-2 gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
          ))}
        </div>
        AgriChat AI
      </Link>

      <AddCropSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        isSelected={isSelected}
        onToggle={toggleCrop}
      />

      <BottomNav />
    </div>
  );
}
