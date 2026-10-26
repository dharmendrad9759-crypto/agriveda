"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, CheckCircle2 } from "lucide-react";
import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { isHindiLocale } from "@/lib/i18n/farmer-ui";
import { riskLabelHi } from "@/lib/i18n/farmer-display";
import { getCropTasksDue, farmerThreatHi } from "@/lib/crops/cropAgroMeta";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { getCropTimelineGuidance } from "@/lib/crops/cropTimelineEngine";
import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";

interface Props {
  crop: Crop;
  detail: EnrichedCropDetail;
}

export interface CalendarTaskItem {
  id: string;
  task: string;
  details?: string;
  due: string;
  priority: "high" | "medium" | "low";
}

export default function CropCalendarSection({ crop }: Props) {
  const { locale } = useLocale();
  const hi = isHindiLocale(locale);
  const cropLabel = (hi && getCropHindiName(crop.slug)) || crop.name;

  const searchParams = useSearchParams();
  const dasParam = searchParams?.get("das");
  const parsedDas =
    dasParam !== null && !isNaN(Number(dasParam)) ? Number(dasParam) : null;

  // If DAS is available (e.g. from /crops/[slug]/care/calendar?das=57), compute stage-specific guidance
  const timeline = useMemo(() => {
    if (parsedDas === null) return null;
    const d = new Date();
    d.setDate(d.getDate() - parsedDas);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const sowingDateIso = `${y}-${m}-${day}`;

    return getCropTimelineGuidance({
      cropSlug: crop.slug,
      cropName: crop.name,
      sowingDate: sowingDateIso,
      isHi: hi,
    });
  }, [crop.slug, crop.name, parsedDas, hi]);

  // Tasks to perform: If timeline available, construct this week's exact actions; otherwise fallback to getCropTasksDue
  const tasks: CalendarTaskItem[] = useMemo(() => {
    if (timeline) {
      const items: CalendarTaskItem[] = [];

      // 1. Critical Agronomic / Irrigation / Field Task for this stage
      if (timeline.todayTask?.title) {
        items.push({
          id: "today-main",
          task: timeline.todayTask.title,
          details: timeline.todayTask.details,
          due: hi ? "आज ही करें / तुरंत" : "Today / Urgent",
          priority: timeline.todayTask.priority === "high" ? "high" : "medium",
        });
      }

      // 2. Fertilizer / Nutrition Task
      if (timeline.fertilizer) {
        items.push({
          id: "fert-task",
          task: timeline.fertilizer.title,
          details: `${timeline.fertilizer.dose}${
            timeline.fertilizer.tip ? ` · ${timeline.fertilizer.tip}` : ""
          }`,
          due: timeline.fertilizer.badge || (hi ? "इस हफ्ते" : "This week"),
          priority: timeline.fertilizer.isDueNow ? "high" : "low",
        });
      }

      // 3. Pest / Weed / Crop Health Scouting
      const majorPest = crop.cropProtection?.majorPests?.[0];
      const weedNote = crop.cropProtection?.weedManagement?.[0];
      items.push({
        id: "protect-task",
        task: majorPest
          ? hi
            ? `${farmerThreatHi(majorPest)} कीट व रोग की निगरानी करें`
            : `Scout for ${majorPest}`
          : hi
            ? "खेत में कीट व रोगों की जांच करें"
            : "Check for pests and leaf diseases",
        details:
          weedNote ||
          (hi
            ? "पत्तियों और तनों की जांच करें, कोई भी लक्षण दिखे तो समय पर समाधान करें।"
            : "Inspect plants and act at early symptoms."),
        due: hi ? "2–3 दिन में" : "In 2–3 days",
        priority: "medium",
      });

      return items;
    }

    // Default fallback from crop tasks
    return getCropTasksDue(crop).map((t) => ({
      id: t.id,
      task: t.task,
      due: t.due,
      priority: t.priority,
    }));
  }, [timeline, crop, hi]);

  return (
    <div className="space-y-3.5">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-600/30 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 p-4 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-emerald-300">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-black leading-tight text-white">
              {hi
                ? parsedDas !== null
                  ? `${cropLabel} — बुवाई के ${parsedDas} दिन का मुख्य काम`
                  : `${cropLabel} — इस हफ्ते का मुख्य काम`
                : parsedDas !== null
                  ? `${cropLabel} — Day ${parsedDas} Work`
                  : `${cropLabel} — This Week's Work`}
            </h1>
            <p className="mt-0.5 text-xs text-emerald-100/80">
              {timeline?.stageSubtitle
                ? `${timeline.stageName} (${timeline.stageSubtitle})`
                : hi
                  ? `फसल अवधि: ${crop.durationDays} · सही समय पर काम करने से पैदावार बढ़ती है`
                  : `Duration: ${crop.durationDays} · Timely action protects yield`}
            </p>
          </div>
        </div>

        <div className="mt-3 border-t border-white/10 pt-2.5">
          <AppLink
            href="/crop-calendar"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/30 active:scale-95"
          >
            <span>{hi ? "पूरा फसल कैलेंडर देखें →" : "View full crop calendar →"}</span>
          </AppLink>
        </div>
      </div>

      {/* Actionable Tasks List — ONLY this section is rendered */}
      <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 sm:p-4 shadow-sm">
        <div className="mb-3">
          <h2 className="text-[15px] sm:text-[16px] font-black tracking-tight text-[var(--av-text-primary)]">
            {hi ? "अभी आपको यह काम करने चाहिए" : "Tasks You Should Do Now"}
          </h2>
        </div>

        <ul className="space-y-2.5">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-[var(--av-border-subtle)] bg-[var(--av-surface-inset)] p-3 transition hover:border-emerald-500/30"
            >
              <div className="flex gap-2.5 min-w-0 flex-1">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold leading-snug text-[var(--av-text-primary)]">
                    {task.task}
                  </p>
                  {task.details ? (
                    <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--av-text-secondary)]">
                      {task.details}
                    </p>
                  ) : null}
                  <p className="mt-1.5 text-[11px] font-semibold text-[var(--av-text-muted)]">
                    ⏰ {task.due}
                  </p>
                </div>
              </div>
              <RiskBadge
                level={task.priority}
                label={hi ? riskLabelHi(task.priority) : undefined}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
