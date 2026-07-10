"use client";

import Link from "next/link";
import { cropCategoryHref } from "@/lib/crops/crop-section-redirect";
import { motion } from "framer-motion";
import {
  Sprout,
  FlaskConical,
  Droplets,
  Bug,
  Leaf,
  Apple,
  TrendingUp,
  ChevronRight,
  CloudSun,
} from "lucide-react";

const CATEGORIES = [
  { id: "sowing", label: "Sowing", icon: Sprout, color: "from-emerald-500/15 to-green-500/5 border-emerald-500/25" },
  { id: "fertilizer", label: "Fertilizer", icon: FlaskConical, color: "from-amber-500/15 to-yellow-500/5 border-amber-500/25" },
  { id: "irrigation", label: "Water", icon: Droplets, color: "from-sky-500/15 to-blue-500/5 border-sky-500/25" },
  { id: "protection", label: "Pests & disease", icon: Bug, color: "from-rose-500/15 to-orange-500/5 border-rose-500/25" },
  { id: "weeds", label: "Weeds", icon: Leaf, color: "from-lime-500/15 to-green-500/5 border-lime-500/25" },
  { id: "stress", label: "Abiotic stress", icon: CloudSun, color: "from-amber-500/15 to-orange-500/5 border-amber-500/25" },
  { id: "nutrition", label: "Nutrition", icon: FlaskConical, color: "from-violet-500/15 to-purple-500/5 border-violet-500/25" },
  { id: "harvest", label: "Harvest", icon: Apple, color: "from-orange-500/15 to-amber-500/5 border-orange-500/25" },
  { id: "market", label: "Mandi", icon: TrendingUp, color: "from-cyan-500/15 to-teal-500/5 border-cyan-500/25" },
] as const;

interface CropCategoryGuideProps {
  cropSlug: string;
}

export default function CropCategoryGuide({ cropSlug }: CropCategoryGuideProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--av-text-muted)]">Tap a section for full crop intelligence</p>

      <div className="grid grid-cols-2 gap-2.5">
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={cropCategoryHref(cropSlug, cat.id)}
                className={`crop-premium-inset flex items-center gap-2.5 border bg-gradient-to-br p-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] ${cat.color}`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--av-surface)]/80 text-emerald-600 dark:text-emerald-400">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="flex-1 text-xs font-extrabold text-[var(--av-text-primary)]">{cat.label}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--av-text-muted)]" />
              </Link>
            </motion.div>
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
  weeds: { title: "Weeds", subtitle: "HRAC herbicide ladder & critical period" },
  stress: { title: "Abiotic stress", subtitle: "Water, heat, nutrients, lodging" },
  nutrition: { title: "Nutrition", subtitle: "Deficiency signs and fix" },
  harvest: { title: "Harvest", subtitle: "Harvest and storage" },
  market: { title: "Mandi", subtitle: "Market information" },
};

export const CROP_SECTION_IDS = Object.keys(CROP_SECTION_META);
