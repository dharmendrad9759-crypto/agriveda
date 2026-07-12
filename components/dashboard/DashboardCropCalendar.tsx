"use client";

import { useState } from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { getCropImageUrl } from "@/lib/crops/crop-display";
import { useMyCrops } from "@/hooks/useMyCrops";
import { crops } from "@/data/crops";

const SEASON_TABS = ["Kharif", "Rabi", "Zaid"] as const;

const STAGE_BY_SLUG: Record<string, { stage: string; das: string }> = {
  paddy: { stage: "Vegetative", das: "25 DAS" },
  tomato: { stage: "Flowering", das: "45 DAS" },
  chilli: { stage: "Fruiting", das: "60 DAS" },
  cauliflower: { stage: "Curd formation", das: "55 DAS" },
  potato: { stage: "Tuber bulking", das: "70 DAS" },
  maize: { stage: "Grain filling", das: "65 DAS" },
  soybean: { stage: "Pod filling", das: "50 DAS" },
  wheat: { stage: "Tillering", das: "30 DAS" },
  cucumber: { stage: "Fruiting", das: "40 DAS" },
};

export default function DashboardCropCalendar() {
  const [tab, setTab] = useState<(typeof SEASON_TABS)[number]>("Kharif");
  const { crops: myCrops } = useMyCrops();

  const slugs = myCrops.length
    ? myCrops.map((c) => c.slug)
    : ["paddy", "tomato", "chilli", "cauliflower", "potato"];

  const items = slugs
    .map((slug) => crops.find((c) => c.slug === slug))
    .filter(Boolean)
    .slice(0, 5);

  return (
    <DarkCard hover className="min-w-0 xl:col-span-8">
      <SectionHeader title="Crop Calendar" action={{ label: "View All", href: "/crop-calendar" }} />
      <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
        {SEASON_TABS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTab(s)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition sm:px-4 sm:text-xs ${
              tab === s
                ? "bg-[var(--av-accent)] text-white shadow-sm"
                : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide sm:gap-3">
        {items.map((crop) => {
          const meta = STAGE_BY_SLUG[crop!.slug] ?? { stage: "Growing", das: "—" };
          return (
            <AppLink
              key={crop!.slug}
              href={`/crops/${crop!.slug}`}
              className="av-card-inset min-w-[118px] shrink-0 overflow-hidden p-0 transition hover:border-[var(--av-accent)]/40 sm:min-w-[140px]"
            >
              <div className="relative h-24 w-full">
                <Image
                  src={getCropImageUrl(crop!)}
                  alt={crop!.name}
                  fill
                  className="object-cover"
                  sizes="140px"
                />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{crop!.name}</p>
                <p className="text-[10px] text-[var(--av-text-muted)]">{meta.stage}</p>
                <p className="mt-1 text-[10px] font-semibold text-[var(--av-accent)]">{meta.das}</p>
              </div>
            </AppLink>
          );
        })}
      </div>
    </DarkCard>
  );
}
