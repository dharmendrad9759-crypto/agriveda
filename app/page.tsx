"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bug,
  TrendingUp,
  Plus,
  Sparkles,
  CloudSun,
  Sprout,
  ChevronRight,
  Droplets,
  Radar,
  LayoutGrid,
  MessageCircleQuestion,
  Stethoscope,
  FlaskConical,
  LayoutDashboard,
} from "lucide-react";
import PageBackground from "@/components/ui/PageBackground";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import FarmDashboard from "@/components/agriveda2/FarmDashboard";
import Agriveda2Hub from "@/components/agriveda2/Agriveda2Hub";
import SprayWindowCard from "@/components/spray-window/SprayWindowCard";
import ServicesHubSheet from "@/components/home/ServicesHubSheet";
import EmptyCropsCard from "@/components/home/EmptyCropsCard";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";

type ToolDef = {
  titleKey: FarmerUiKey;
  icon: typeof Radar;
  href: string;
  tone: string;
  action?: "services";
};

const TOOL_DEFS: ToolDef[] = [
  {
    titleKey: "toolDashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    tone: "from-emerald-500/25 to-teal-500/10 border-emerald-500/40 text-emerald-700",
  },
  {
    titleKey: "toolPest",
    icon: Bug,
    href: "/pest-diseases",
    tone: "from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-600",
  },
  {
    titleKey: "toolPestSolver",
    icon: Stethoscope,
    href: "/pest-solver",
    tone: "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-500/30 text-fuchsia-700",
  },
  {
    titleKey: "toolOutbreak",
    icon: Radar,
    href: "/pest-outbreak-radar",
    tone: "from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-600",
  },
  {
    titleKey: "toolAi",
    icon: Sparkles,
    href: "/ai-doctor",
    tone: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-600",
  },
  {
    titleKey: "toolWeather",
    icon: CloudSun,
    href: "/weather",
    tone: "from-sky-500/20 to-cyan-500/10 border-sky-500/30 text-sky-600",
  },
  {
    titleKey: "toolSprayAdvisory",
    icon: FlaskConical,
    href: "/weather/spray-advisory",
    tone: "from-indigo-500/20 to-violet-500/10 border-indigo-500/30 text-indigo-700",
  },
  {
    titleKey: "toolMandi",
    icon: TrendingUp,
    href: "/mandi",
    tone: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-700",
  },
  {
    titleKey: "toolCrops",
    icon: Sprout,
    href: "/crops",
    tone: "from-lime-500/20 to-green-500/10 border-lime-500/30 text-lime-700",
  },
  {
    titleKey: "toolSpray",
    icon: Droplets,
    href: "/spray-rotation",
    tone: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-600",
  },
  {
    titleKey: "toolAllServices",
    icon: LayoutGrid,
    href: "#services",
    tone: "from-cyan-500/20 to-emerald-500/10 border-cyan-500/30 text-cyan-700",
    action: "services",
  },
];

export default function Home() {
  const { crops, hydrated } = useMyCrops();
  const { profile, hydrated: profileReady } = useFarmerProfile();
  const { t } = useLocale();
  const [servicesOpen, setServicesOpen] = useState(false);

  const greeting = profile.name.trim()
    ? t("homeGreetingNamed").replace("{name}", profile.name.trim())
    : t("homeGreeting");

  const locationHint =
    profileReady && (profile.village || profile.district)
      ? t("homeLocationHint")
          .replace("{village}", profile.village || "")
          .replace("{district}", profile.district || "")
          .replace(/^\s*•\s*|\s*•\s*$/g, "")
          .trim()
      : null;

  const tools = useMemo(
    () => TOOL_DEFS.map((tool) => ({ ...tool, title: t(tool.titleKey) })),
    [t]
  );

  return (
    <div className="agriveda-page relative">
      <PageBackground />
      <ServicesHubSheet open={servicesOpen} onClose={() => setServicesOpen(false)} />

      <div className="relative mx-auto max-w-lg space-y-7 px-5 pt-6">
        <header className="animate-slide-up-soft">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-600">
            Agriveda · {t("smartKisan")}
          </p>
          <h1 className="agriveda-gradient-text mt-1 text-3xl font-black tracking-tight">
            {t("myFarm")}
          </h1>
          <p className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">{greeting}</p>
          {locationHint && (
            <p className="text-xs theme-text-muted">📍 {locationHint}</p>
          )}
          <p className="mt-0.5 text-sm theme-text-muted">{t("homeSubtitle")}</p>
        </header>

        <div className="animate-slide-up-soft" style={{ animationDelay: "40ms" }}>
          <Agriveda2Hub />
        </div>

        <div className="animate-slide-up-soft" style={{ animationDelay: "50ms" }}>
          <FarmDashboard compact />
        </div>

        <div className="animate-slide-up-soft" style={{ animationDelay: "60ms" }}>
          <SprayWindowCard />
        </div>

        <section className="animate-slide-up-soft" style={{ animationDelay: "100ms" }}>
          <SectionHeading title={t("myCrops")} subtitle={t("tapCropGuideSubtitle")} />
          {hydrated && crops.length === 0 ? (
            <EmptyCropsCard />
          ) : (
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
                    className="flex h-[88px] w-[88px] items-center justify-center text-4xl transition-transform duration-300 group-active:scale-95"
                  >
                    {crop.emoji}
                  </GlassCard>
                  <span className="max-w-[88px] text-center text-xs font-bold theme-text-accent leading-tight">
                    {crop.name}
                  </span>
                </Link>
              ))}
            <Link href="/select-crops" className="group flex flex-shrink-0 flex-col items-center gap-2">
              <div className="flex h-[88px] w-[88px] items-center justify-center rounded-3xl border-2 border-dashed border-emerald-500/35 bg-[var(--accent-soft)] transition-all duration-300 group-active:scale-95">
                <Plus className="h-6 w-6 text-emerald-600" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold theme-text-muted">{t("addCrop")}</span>
            </Link>
          </div>
          )}
        </section>

        <section className="animate-slide-up-soft" style={{ animationDelay: "140ms" }}>
          <SectionHeading title={t("mainServices")} subtitle={t("servicesNote")} />
          <div className="grid grid-cols-4 gap-3">
            {tools
              .filter((tool) => tool.action !== "services")
              .map((tool) => {
              const Icon = tool.icon;
              const inner = (
                <>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border bg-gradient-to-br transition-all duration-300 hover:scale-105 active:scale-95 ${tool.tone}`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <span className="mt-2 line-clamp-2 text-center text-[10px] font-bold leading-tight theme-text-primary">
                    {tool.title}
                  </span>
                </>
              );

              return (
                <Link key={tool.titleKey} href={tool.href} className="flex flex-col items-center">
                  {inner}
                </Link>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setServicesOpen(true)}
            className="mt-3 flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-cyan-500/40 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 px-4 py-3.5 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-700">
                <LayoutGrid className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black theme-text-primary">{t("toolAllServices")}</p>
                <p className="text-[10px] theme-text-muted">{t("servicesHubTitle")}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-cyan-600" />
          </button>
        </section>

        <div className="animate-slide-up-soft" style={{ animationDelay: "180ms" }}>
          <GlassCard neon className="overflow-hidden p-5">
            <h3 className="text-base font-extrabold theme-text-primary">{t("expertHelpTitle")}</h3>
            <p className="mt-1 text-sm theme-text-muted">{t("expertHelpDesc")}</p>
            <Link
              href="/ask-query"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006432] py-3.5 text-sm font-black text-white shadow-[0_8px_24px_rgba(0,100,50,0.25)] transition-transform active:scale-[0.98]"
            >
              <MessageCircleQuestion className="h-4 w-4" />
              {t("askQuestion")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
