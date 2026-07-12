"use client";

import AppLink from "@/components/ui/AppLink";
import {
  MapPin,
  Plus,
  Sprout,
} from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { DonutChart } from "@/components/shell/charts";
import DashboardWeatherHero from "@/components/dashboard/DashboardWeatherHero";
import DashboardCropCalendar from "@/components/dashboard/DashboardCropCalendar";
import DashboardMandiWidget from "@/components/dashboard/DashboardMandiWidget";
import DashboardPestAlerts from "@/components/dashboard/DashboardPestAlerts";
import DashboardAiRecommendations from "@/components/dashboard/DashboardAiRecommendations";
import { QuickActionIcon } from "@/components/services/SpriteQuickIcon";
import { AV } from "@/lib/design/tokens";
import { CROP_HEALTH_SEGMENTS } from "@/data/mock/dashboard";
import { useFarmData } from "@/hooks/useFarmData";

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
  { label: "Fertilizer Calc", href: "/services/fertilizer-calculator", col: 2, row: 0 },
  { label: "Market Prices", href: "/mandi", col: 5, row: 0 },
  { label: "Weather", href: "/weather", col: 0, row: 1 },
];

const AGRI_NEWS = [
  {
    title: "Heatwave alert in Uttar Pradesh",
    time: "2 hours ago",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=120&h=80&fit=crop",
  },
  {
    title: "Increase in Tomato Prices",
    time: "5 hours ago",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=120&h=80&fit=crop",
  },
  {
    title: "New IPM advisory for paddy stem borer",
    time: "1 day ago",
    image: "https://images.unsplash.com/photo-1536304575081-ff8c827fd69f?w=120&h=80&fit=crop",
  },
];

export default function DesktopDashboard({ embedded: _embedded }: { embedded?: boolean } = {}) {
  const { data: farm, stats: farmStats } = useFarmData();
  const healthLabel = farmStats.healthScore >= 80 ? "Very Good" : farmStats.healthScore >= 65 ? "Good" : "Watch";

  return (
    <div className={`${AV.sectionGap} min-w-0 max-w-full overflow-x-hidden`}>
      <div className="grid min-w-0 gap-3 sm:gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <DashboardWeatherHero />
        </div>
        <DarkCard hover className="min-w-0 xl:col-span-4" delay={1}>
          <SectionHeader title="Farm Health Score" />
          <div className="mt-2 flex flex-col items-center">
            <DonutChart
              segments={CROP_HEALTH_SEGMENTS}
              centerValue={`${farmStats.healthScore}`}
              centerLabel={healthLabel}
            />
          </div>
          <p className="mt-2 text-center text-xs text-[var(--av-text-secondary)]">
            Keep it up! Your crops are healthy.
          </p>
        </DarkCard>
      </div>

      <DarkCard hover delay={1} className="min-w-0">
        <SectionHeader title="Quick Actions" />
        <div className="mt-3 grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:gap-4">
          {QUICK_ACTIONS.map((a) => (
            <AppLink
              key={a.href + a.label}
              href={a.href}
              className="group flex min-w-0 flex-col items-center gap-1.5 text-center sm:min-w-[72px] sm:gap-2"
            >
              <QuickActionIcon label={a.label} col={a.col} row={a.row} lucide={a.lucide} imageSrc={a.imageSrc} />
              <span className="line-clamp-2 text-[9px] font-semibold leading-tight text-[var(--av-text-secondary)] sm:text-[10px]">
                {a.label}
              </span>
            </AppLink>
          ))}
        </div>
      </DarkCard>

      <div className="grid min-w-0 gap-3 sm:gap-4 xl:grid-cols-12">
        <DashboardCropCalendar />
        <DarkCard hover className="min-w-0 xl:col-span-4" delay={2}>
          <SectionHeader title="Upcoming Tasks" action={{ label: "View All", href: "/crop-calendar" }} />
          <ul className="mt-3 space-y-2">
            {farm.activities.slice(0, 4).map((a) => (
              <li key={a.id} className="av-card-inset flex items-start justify-between gap-2 p-2.5">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--av-text-primary)]">{a.task}</p>
                  <p className={AV.micro}>{a.field}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-[var(--av-accent-soft)] px-2 py-1 text-[10px] font-bold text-[var(--av-accent)]">
                  {a.date.split(" ")[0]}
                </span>
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>

      <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-3">
        <DarkCard hover delay={1} className="min-w-0">
          <SectionHeader title="Field Overview" action={{ label: "My Farm", href: "/my-farm" }} />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="av-card-inset p-3 text-center">
              <p className={AV.label}>Total Fields</p>
              <p className="mt-1 text-xl font-bold text-[var(--av-text-primary)]">{farm.fields.length}</p>
            </div>
            <div className="av-card-inset p-3 text-center">
              <p className={AV.label}>Total Area</p>
              <p className="mt-1 text-xl font-bold text-[var(--av-text-primary)]">
                {farm.fields.reduce((s, f) => s + parseFloat(f.area) || 0, 0).toFixed(1)} Acre
              </p>
            </div>
            <div className="av-card-inset p-3 text-center">
              <p className={AV.label}>Active Crops</p>
              <p className="mt-1 text-xl font-bold text-[var(--av-accent)]">{statsActiveCrops(farm.fields)}</p>
            </div>
            <div className="av-card-inset p-3 text-center">
              <p className={AV.label}>Irrigation Due</p>
              <p className="mt-1 text-xl font-bold text-amber-600">2 Fields</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center rounded-xl bg-[var(--av-accent-soft)]/40 py-6">
            <MapPin className="h-10 w-10 text-[var(--av-accent)] opacity-60" />
            <Sprout className="-ml-4 h-8 w-8 text-emerald-600" />
          </div>
        </DarkCard>

        <DashboardPestAlerts />

        <DashboardMandiWidget limit={4} compact />
      </div>

      <div className="grid min-w-0 gap-3 sm:gap-4 xl:grid-cols-12">
        <DashboardAiRecommendations />
        <DarkCard hover className="min-w-0 xl:col-span-4" delay={2}>
          <SectionHeader title="Agri News & Tips" action={{ label: "Library", href: "/library" }} />
          <ul className="mt-3 space-y-3">
            {AGRI_NEWS.map((n) => (
              <li key={n.title} className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={n.image} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                <div>
                  <p className="text-xs font-semibold leading-snug text-[var(--av-text-primary)]">{n.title}</p>
                  <p className={AV.micro}>{n.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>
    </div>
  );
}

function statsActiveCrops(fields: { crop: string }[]): number {
  return new Set(fields.map((f) => f.crop)).size;
}
