"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { fadeUp } from "@/lib/motion/variants";
import {
  formatCategoryLabel,
  getCropHindiName,
  getCropImageUrl,
  parseSeasonTag,
  seasonBadgeClass,
} from "@/lib/crops/crop-display";
import type { Crop } from "@/types/crop";

interface CropCardProps {
  crop: Crop;
  index: number;
  variant?: "grid" | "list";
}

export default function CropCard({ crop, index, variant = "grid" }: CropCardProps) {
  const hindi = getCropHindiName(crop.slug);
  const season = parseSeasonTag(crop.suitableSeason);
  const image = getCropImageUrl(crop);

  if (variant === "list") {
    return (
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={index}>
        <Link
          href={`/crops/${crop.slug}`}
          className="av-card av-card-hover flex items-center gap-4 overflow-hidden p-3"
        >
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">
            <Image src={image} alt={crop.name} fill className="object-cover object-center" sizes="80px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-[var(--av-text-primary)]">
              {crop.name}
              {hindi ? ` (${hindi})` : ""}
            </p>
            <p className="text-xs text-[var(--av-text-muted)]">{formatCategoryLabel(crop.category)}</p>
          </div>
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${seasonBadgeClass(season)}`}>
            {season}
          </span>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      custom={index}
      transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link href={`/crops/${crop.slug}`} className="group block h-full">
        <article className="av-card av-card-hover flex h-full flex-col overflow-hidden p-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--av-surface-muted)]">
            <Image
              src={image}
              alt={crop.name}
              fill
              className="object-cover object-center transition duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <span
              className={`absolute right-2 top-2 rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-sm ${seasonBadgeClass(season)}`}
            >
              {season}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-3">
            <h3 className="text-sm font-bold leading-snug text-[var(--av-text-primary)] group-hover:text-[var(--av-accent)]">
              {crop.name}
              {hindi ? ` (${hindi})` : ""}
            </h3>
            <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">{formatCategoryLabel(crop.category)}</p>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export function AddCustomCropCard({ index }: { index: number }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={index} className="h-full">
      <Link
        href="/select-crops"
        className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--av-accent)]/40 bg-[var(--av-accent-soft)]/30 p-6 text-center transition hover:border-[var(--av-accent)] hover:bg-[var(--av-accent-soft)]/50"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--av-accent)] text-white shadow-md">
          <Plus className="h-6 w-6" />
        </span>
        <p className="text-sm font-bold text-[var(--av-accent)]">Add Custom Crop</p>
        <p className="text-[11px] text-[var(--av-text-muted)]">Add crop not in the list</p>
      </Link>
    </motion.div>
  );
}
