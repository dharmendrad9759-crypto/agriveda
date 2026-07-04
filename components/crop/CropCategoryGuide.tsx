"use client";

import Link from "next/link";
import {
  Sprout,
  FlaskConical,
  Droplets,
  Bug,
  Leaf,
  Apple,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

const CATEGORIES = [
  { id: "sowing", label: "Sowing", icon: Sprout, color: "from-emerald-500/20 to-green-500/10 border-emerald-500/30" },
  { id: "fertilizer", label: "Fertilizer", icon: FlaskConical, color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30" },
  { id: "irrigation", label: "Water", icon: Droplets, color: "from-sky-500/20 to-blue-500/10 border-sky-500/30" },
  { id: "protection", label: "Pests & disease", icon: Bug, color: "from-red-500/20 to-orange-500/10 border-red-500/30" },
  { id: "weeds", label: "Weeds", icon: Leaf, color: "from-lime-500/20 to-green-500/10 border-lime-500/30" },
  { id: "nutrition", label: "Nutrition", icon: FlaskConical, color: "from-violet-500/20 to-purple-500/10 border-violet-500/30" },
  { id: "harvest", label: "Harvest", icon: Apple, color: "from-orange-500/20 to-amber-500/10 border-orange-500/30" },
  { id: "market", label: "Mandi", icon: TrendingUp, color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30" },
] as const;

interface CropCategoryGuideProps {
  cropSlug: string;
}

export default function CropCategoryGuide({ cropSlug }: CropCategoryGuideProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs theme-text-muted">Tap a box to open full details on the next page</p>

      <div className="grid grid-cols-2 gap-2.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={`/crop-details/${cropSlug}/${cat.id}`}
              className={`flex items-center gap-2.5 rounded-2xl border bg-gradient-to-br p-3.5 text-left transition hover:scale-[1.02] active:scale-[0.98] ${cat.color}`}
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/80 text-emerald-700 dark:bg-black/30 dark:text-emerald-400">
                <Icon className="h-4 w-4" />
              </div>
              <span className="flex-1 text-xs font-extrabold theme-text-primary">{cat.label}</span>
              <ChevronRight className="h-4 w-4 flex-shrink-0 theme-text-muted" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export const CROP_SECTION_META: Record<
  string,
  { title: string; subtitle: string }
> = {
  sowing: { title: "Sowing", subtitle: "Seed rate, spacing and planting" },
  fertilizer: { title: "Fertilizer", subtitle: "Nutrients and schedule" },
  irrigation: { title: "Water", subtitle: "Irrigation schedule" },
  protection: { title: "Pests & disease", subtitle: "Insects, diseases and spray doses" },
  weeds: { title: "Weeds", subtitle: "Weed control" },
  nutrition: { title: "Nutrition", subtitle: "Deficiency signs and fix" },
  harvest: { title: "Harvest", subtitle: "Harvest and storage" },
  market: { title: "Mandi", subtitle: "Market information" },
};

export const CROP_SECTION_IDS = Object.keys(CROP_SECTION_META);
