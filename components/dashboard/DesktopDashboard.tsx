"use client";

import AppLink from "@/components/ui/AppLink";
import {
  Plus,
} from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import DashboardWeatherHero from "@/components/dashboard/DashboardWeatherHero";
import HomeFarmSnapshot from "@/components/dashboard/HomeFarmSnapshot";
import HomeFeatureGrid from "@/components/dashboard/HomeFeatureGrid";
import { QuickActionIcon } from "@/components/services/SpriteQuickIcon";
import { AV } from "@/lib/design/tokens";
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

export default function DesktopDashboard({ embedded: _embedded }: { embedded?: boolean } = {}) {
  const { data: farm } = useFarmData();

  return (
    <div className={`${AV.sectionGap} min-w-0 max-w-full overflow-x-hidden`}>
      <DashboardWeatherHero />

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

      <HomeFarmSnapshot />

      <HomeFeatureGrid />

      {farm.activities.length > 0 && (
        <DarkCard hover className="min-w-0" delay={2}>
          <SectionHeader title="आपके कार्य" action={{ label: "सभी", href: "/my-farm" }} />
          <ul className="mt-2 space-y-1.5">
            {farm.activities.slice(0, 3).map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[var(--av-text-primary)]">{a.task}</p>
                  <p className="truncate text-[10px] text-[var(--av-text-muted)]">{a.field}</p>
                </div>
                <span className="shrink-0 text-[10px] font-bold text-[var(--av-accent)]">{a.date}</span>
              </li>
            ))}
          </ul>
        </DarkCard>
      )}
    </div>
  );
}
