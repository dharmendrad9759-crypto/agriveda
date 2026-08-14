"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { fadeUp } from "@/lib/motion/variants";
import {
  formatCategoryLabel,
  getCropHindiName,
  getCropImageUrl,
  parseSeasonTag,
} from "@/lib/crops/crop-display";
import type { Crop } from "@/types/crop";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface CropCardProps {
  crop: Crop;
  index: number;
  variant?: "grid" | "list" | "feature";
}

function seasonChip(tag: string, isHi: boolean) {
  const label =
    isHi
      ? tag === "Kharif"
        ? "खरीफ"
        : tag === "Rabi"
          ? "रबी"
          : tag === "Summer"
            ? "गर्मी"
            : "साल भर"
      : tag;
  const tone =
    tag === "Kharif"
      ? "bg-emerald-500/90 text-white"
      : tag === "Rabi"
        ? "bg-sky-500/90 text-white"
        : tag === "Summer"
          ? "bg-amber-500/90 text-white"
          : "bg-white/85 text-slate-800";
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-sm ${tone}`}>
      {label}
    </span>
  );
}

export default function CropCard({ crop, index, variant = "grid" }: CropCardProps) {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const hindi = getCropHindiName(crop.slug);
  const season = parseSeasonTag(crop.suitableSeason);
  const image = getCropImageUrl(crop);
  const title = hindi || crop.name;
  const sub = hindi ? crop.name : formatCategoryLabel(crop.category);

  if (variant === "list") {
    return (
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={index}>
        <Link
          href={`/crops/${crop.slug}`}
          className="group flex items-stretch overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)] transition active:scale-[0.99]"
        >
          <div className="relative h-[88px] w-[108px] shrink-0 overflow-hidden">
            <Image src={image} alt={crop.name} fill className="object-cover" sizes="108px" />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3.5 py-3">
            <div className="min-w-0">
              <p className="truncate text-[16px] font-bold text-[var(--av-text-primary)]">{title}</p>
              <p className="truncate text-xs text-[var(--av-text-muted)]">{sub}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {seasonChip(season, isHi)}
                {crop.isStub ? (
                  <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-200">
                    {isHi ? "संक्षिप्त गाइड" : "Brief guide"}
                  </span>
                ) : null}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-[var(--av-accent)] transition group-hover:translate-x-0.5" />
          </div>
        </Link>
      </motion.div>
    );
  }

  const isFeature = variant === "feature";

  return (
    <motion.div
      layout
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      custom={index}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={isFeature ? "h-full min-w-[168px] max-w-[180px] shrink-0" : "h-full"}
    >
      <Link href={`/crops/${crop.slug}`} className="group block h-full">
        <article
          className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 shadow-[var(--av-shadow-md)] ring-1 ring-black/5 ${
            isFeature ? "aspect-[3/4]" : "aspect-[4/5] sm:aspect-[3/4]"
          }`}
        >
          <Image
            src={image}
            alt={crop.name}
            fill
            className="object-cover object-center transition duration-500 group-hover:scale-110"
            sizes={isFeature ? "180px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
            priority={index < 4}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
            {seasonChip(season, isHi)}
            {crop.isStub ? (
              <span className="rounded-md bg-amber-500/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                {isHi ? "संक्षिप्त" : "Brief"}
              </span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
            <h3 className="font-display text-[18px] font-bold leading-tight text-white drop-shadow sm:text-[20px]">
              {title}
            </h3>
            <p className="mt-0.5 text-[11px] font-medium text-white/75">{sub}</p>
            <span className="mt-2 inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-300">
              {isHi ? "गाइड खोलो" : "Open guide"}
              <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
