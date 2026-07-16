"use client";

import AppLink from "@/components/ui/AppLink";
import { useFarmData } from "@/hooks/useFarmData";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ChevronRight, Plus, Sprout } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { resolveCropImage } from "@/lib/crops/cropImages";
import Image from "next/image";

function estimateDays(sowingDate: string): number | null {
  if (!sowingDate?.trim()) return null;
  const parsed = Date.parse(sowingDate);
  if (!Number.isNaN(parsed)) {
    const diff = Math.floor((Date.now() - parsed) / 86400000);
    return diff >= 0 ? diff : null;
  }
  // "16 Jul 2026" style from onboarding
  const tryLocal = new Date(sowingDate);
  if (!Number.isNaN(tryLocal.getTime())) {
    const diff = Math.floor((Date.now() - tryLocal.getTime()) / 86400000);
    return diff >= 0 ? diff : null;
  }
  return null;
}

export default function HomeFarmSnapshot() {
  const { data: farm } = useFarmData();
  const { locale } = useLocale();
  const reduced = useReducedMotion();
  const isHi = locale === "hi" || locale === "hinglish";
  const field = farm.fields[0];
  const days = field ? estimateDays(field.sowingDate) : null;
  const cropImg = field
    ? resolveCropImage({ slug: field.cropSlug || "paddy", name: field.crop })
    : null;

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.slow, ease: EASE_OUT, delay: 0.08 }}
    >
      <div className="mb-2 flex items-end justify-between px-0.5">
        <div>
          <h2 className="font-display text-base font-bold tracking-tight text-[var(--av-text-primary)]">
            {isHi ? "मेरे खेत" : "My Fields"}
          </h2>
          <p className="mt-0.5 text-[12px] text-[var(--av-text-muted)]">
            {isHi ? "फसल · अवस्था · दिन" : "Crop · stage · days"}
          </p>
        </div>
        <AppLink href="/my-farm" className="text-[12px] font-bold text-[var(--av-accent)]">
          {isHi ? "सभी" : "All"}
        </AppLink>
      </div>

      {field ? (
        <AppLink
          href="/my-farm"
          className="av-tool-press flex items-center gap-3 overflow-hidden rounded-[1.35rem] border border-emerald-500/15 bg-[var(--av-surface)] p-3.5 shadow-[var(--av-shadow-md)]"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[var(--av-surface-inset)] ring-1 ring-emerald-500/15">
            {cropImg ? (
              <Image src={cropImg} alt="" fill sizes="64px" className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-2xl">
                {field.emoji || "🌾"}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold text-[var(--av-text-primary)]">
              {field.crop}
            </p>
            <p className="mt-0.5 truncate text-[12px] text-[var(--av-text-secondary)]">
              {field.name} · {field.stage || (isHi ? "सक्रिय वृद्धि" : "Active growth")}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                <Sprout className="h-3 w-3" />
                {days != null
                  ? isHi
                    ? `${days} दिन`
                    : `${days} days`
                  : field.sowingDate || (isHi ? "बुआई जोड़ी गई" : "Sown")}
              </span>
              <span className="rounded-full bg-[var(--av-surface-inset)] px-2 py-0.5 text-[11px] font-semibold text-[var(--av-text-muted)]">
                {field.area}
              </span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-[var(--av-text-muted)]" />
        </AppLink>
      ) : (
        <AppLink
          href="/my-farm"
          className="av-tool-press flex items-center justify-between gap-3 rounded-[1.35rem] border border-dashed border-emerald-500/30 bg-[var(--av-surface)]/90 px-4 py-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-600">
              <Plus className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[14px] font-bold text-[var(--av-text-primary)]">
                {isHi ? "खेत जोड़ें" : "Add your field"}
              </p>
              <p className="text-[12px] text-[var(--av-text-muted)]">
                {isHi ? "फसल और बुआई तारीख भरें" : "Crop + sowing date for advice"}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[var(--av-accent)]" />
        </AppLink>
      )}
    </motion.section>
  );
}
