"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Sprout } from "lucide-react";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";
import GrowthStageImage, {
  growthKindFromStage,
} from "@/components/crops/GrowthStageImage";
import CropGrowthHonestySection from "@/components/crops/sections/CropGrowthHonestySection";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useToast } from "@/components/ui/Toast";
import {
  getGrowthStageCropBadge,
  getGrowthStageImage,
} from "@/lib/crops/growthStageImages";
import { getGrowthHonestyForStage } from "@/lib/crops/growthHonesty";
import { resolveCurrentCropStageIndex } from "@/lib/cropGrowthStage";
import {
  simplifyGrowthPeriodEn,
  simplifyGrowthPeriodHi,
  simplifyGrowthPointHi,
  simplifyGrowthTitleEn,
  simplifyGrowthTitleHi,
} from "@/lib/crops/simplifyGrowthStageHi";
import type { CropStage } from "@/types/crop-management";

interface Props {
  stages: CropStage[];
  cropSlug: string;
  cropName?: string;
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatSowingDisplay(iso: string, hi: boolean): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(hi ? "hi-IN" : "en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function AnimatedGrowthTimeline({ stages, cropSlug, cropName }: Props) {
  const reduced = useReducedMotion();
  const { locale } = useLocale();
  const hi = locale === "hi";
  const { showToast } = useToast();
  const { profile, hydrated, setSowingDate } = useFarmerProfile();
  const savedSowing = profile.sowingDates[cropSlug] || "";
  const [draftDate, setDraftDate] = useState("");
  const [editingDate, setEditingDate] = useState(false);

  const sowingISO = savedSowing || "";
  const dateInputValue = editingDate || !sowingISO ? draftDate || sowingISO : sowingISO;

  const { index: currentIndex, das } = useMemo(
    () => resolveCurrentCropStageIndex(stages, sowingISO || undefined),
    [stages, sowingISO]
  );

  const activeStage =
    sowingISO && currentIndex !== null ? stages[currentIndex] ?? null : null;

  const titleOf = (title: string) =>
    hi ? simplifyGrowthTitleHi(title) : simplifyGrowthTitleEn(title);
  const periodOf = (period: string) =>
    hi ? simplifyGrowthPeriodHi(period) : simplifyGrowthPeriodEn(period);
  const pointOf = (point: string) => (hi ? simplifyGrowthPointHi(point) : point);

  const saveDate = (value: string) => {
    if (!value) return;
    setSowingDate(cropSlug, value);
    setDraftDate(value);
    setEditingDate(false);
    showToast(hi ? "बुवाई की तारीख सेव हो गई ✓" : "Sowing date saved ✓");
  };

  const honesty = getGrowthHonestyForStage(
    cropSlug,
    activeStage?.title,
    activeStage?.period
  );

  const activeKind = activeStage
    ? growthKindFromStage(activeStage.title, activeStage.period)
    : "veg";
  const activeImage = activeStage
    ? getGrowthStageImage({
        cropSlug,
        cropName,
        title: activeStage.title,
        period: activeStage.period,
        index: currentIndex ?? 0,
      })
    : "/images/growth/growth-stage-veg.jpg";

  // Wait for profile hydrate so we don't flash the form if date exists
  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-4 py-8 text-center text-sm text-[var(--av-text-muted)]">
        {hi ? "लोड हो रहा है…" : "Loading…"}
      </div>
    );
  }

  // Step 1 — ask sowing date before any work
  if (!sowingISO || editingDate) {
    return (
      <div className="overflow-hidden rounded-2xl border border-emerald-600/25 bg-gradient-to-br from-emerald-50 via-white to-amber-50 shadow-[var(--av-shadow-sm)] dark:from-emerald-950/40 dark:via-[var(--av-surface)] dark:to-amber-950/20">
        <div className="relative h-36 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/jobs/job-my-farm.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/45 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[17px] font-black text-white">
                {hi ? "पहले बुवाई की तारीख डालें" : "First add sowing date"}
              </p>
              <p className="text-[12px] font-medium text-white/85">
                {hi
                  ? "तारीख के बाद ही आज का काम बताएँगे — पुराना या आगे का नहीं"
                  : "Then we’ll show only today’s stage work"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-bold text-[var(--av-text-primary)]">
              {hi
                ? `${cropName ?? "फसल"} कब बोई थी?`
                : `When did you sow ${cropName ?? "this crop"}?`}
            </span>
            <input
              type="date"
              max={todayISO()}
              value={dateInputValue}
              onChange={(e) => setDraftDate(e.target.value)}
              className="w-full rounded-xl border border-emerald-600/25 bg-[var(--av-surface)] px-3 py-3 text-[15px] font-semibold text-[var(--av-text-primary)] outline-none focus:border-emerald-600/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>

          <button
            type="button"
            disabled={!dateInputValue}
            onClick={() => saveDate(dateInputValue)}
            className={cn(AV.btnPrimary, "w-full justify-center disabled:opacity-50")}
          >
            {hi ? "तारीख सेव करो — आज का काम दिखाओ" : "Save date — show today’s work"}
          </button>

          {editingDate && sowingISO ? (
            <button
              type="button"
              onClick={() => {
                setEditingDate(false);
                setDraftDate("");
              }}
              className={cn(AV.btnSecondarySm, "w-full justify-center")}
            >
              {hi ? "वापस" : "Back"}
            </button>
          ) : null}

          <p className="text-center text-[11px] font-medium text-[var(--av-text-muted)]">
            {hi
              ? "बिना तारीख के अवस्था का काम नहीं दिखाएँगे"
              : "Without a date we won’t guess the stage"}
          </p>
        </div>
      </div>
    );
  }

  // Future sowing
  if (das !== null && das < 0) {
    return (
      <div className="space-y-3 rounded-2xl border border-amber-500/30 bg-amber-50/80 p-4 dark:bg-amber-950/30">
        <p className="text-[15px] font-extrabold text-amber-950 dark:text-amber-50">
          {hi ? "बुवाई की तारीख आगे की है" : "Sowing date is in the future"}
        </p>
        <p className="text-sm text-amber-900/80 dark:text-amber-100/80">
          {hi
            ? `आपने ${formatSowingDisplay(sowingISO, true)} डाली है। असली बुवाई की तारीख डालें।`
            : `You entered ${formatSowingDisplay(sowingISO, false)}. Enter the real sowing date.`}
        </p>
        <button
          type="button"
          onClick={() => {
            setDraftDate(sowingISO);
            setEditingDate(true);
          }}
          className={cn(AV.btnPrimarySm, "w-full justify-center")}
        >
          {hi ? "तारीख बदलें" : "Change date"}
        </button>
      </div>
    );
  }

  if (!activeStage) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--av-border)] px-4 py-8 text-center text-sm text-[var(--av-text-muted)]">
        {hi ? "इस फसल की अवस्थाएँ उपलब्ध नहीं" : "No stages for this crop"}
      </p>
    );
  }

  const stageTitle = titleOf(activeStage.title);
  const stagePeriod = periodOf(activeStage.period);
  const stageNum = (currentIndex ?? 0) + 1;
  const total = stages.length;

  return (
    <div className="space-y-4">
      {/* Status strip — sowing + DAS + current stage only */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-600/20 bg-emerald-500/8 px-3 py-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <Sprout className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-extrabold text-emerald-950 dark:text-emerald-50">
            {hi
              ? `आज — बुवाई के ${das ?? 0} दिन`
              : `Today — day ${das ?? 0} after sowing`}
          </p>
          <p className="text-[11px] font-semibold text-emerald-800/80 dark:text-emerald-200/80">
            {hi
              ? `बोई: ${formatSowingDisplay(sowingISO, true)} · अवस्था ${stageNum}/${total}`
              : `Sown: ${formatSowingDisplay(sowingISO, false)} · stage ${stageNum}/${total}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDraftDate(sowingISO);
            setEditingDate(true);
          }}
          className="shrink-0 rounded-lg border border-emerald-700/20 bg-white/70 px-2.5 py-1.5 text-[11px] font-bold text-emerald-900 dark:bg-black/20 dark:text-emerald-100"
        >
          {hi ? "तारीख बदलें" : "Edit date"}
        </button>
      </div>

      <p className="px-0.5 text-[12px] font-bold text-[var(--av-text-muted)]">
        {hi
          ? "सिर्फ अभी की अवस्था का काम — पीछे या आगे का नहीं"
          : "Only this stage’s work — not past or future"}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${sowingISO}-${currentIndex}`}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="space-y-3"
        >
          <div className="overflow-hidden rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)]">
            <div className="relative h-40 w-full sm:h-48">
              <GrowthStageImage src={activeImage} kind={activeKind} className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="mb-1 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getGrowthStageCropBadge(cropSlug, cropName)}
                    alt=""
                    className="h-7 w-7 rounded-full border border-white/50 object-cover"
                  />
                  <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-white">
                    {hi ? "अभी यही अवस्था" : "Current stage"}
                  </span>
                </div>
                <p className="text-[10px] font-bold tracking-wide text-emerald-200">{stagePeriod}</p>
                <p className="mt-0.5 text-base font-extrabold text-white">{stageTitle}</p>
              </div>
            </div>

            <div className="border-b border-[var(--av-border)] bg-[var(--av-surface-inset)] px-4 py-2.5">
              <p className="text-[13px] font-extrabold text-[var(--av-text-primary)]">
                {hi ? "आज का काम" : "Work for now"}
              </p>
            </div>

            <ul className="space-y-2 p-4">
              {activeStage.keyPoints.map((point, pi) => (
                <motion.li
                  key={point}
                  initial={reduced ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: pi * 0.05 }}
                  className="flex gap-2 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5 text-sm leading-relaxed text-[var(--av-text-secondary)]"
                >
                  <span className="shrink-0 font-bold text-[var(--av-accent)]">{pi + 1}.</span>
                  <span className="break-words text-[var(--av-text-primary)]">{pointOf(point)}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {honesty ? <CropGrowthHonestySection data={honesty} /> : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
