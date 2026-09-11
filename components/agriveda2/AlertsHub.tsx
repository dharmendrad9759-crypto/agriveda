"use client";

import Link from "next/link";
import { useMemo, useState, useCallback, useEffect } from "react";
import { Bell, ChevronRight } from "lucide-react";
import { useSprayFields } from "@/hooks/useSprayFields";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useToast } from "@/components/ui/Toast";
import { buildFieldAlerts } from "@/lib/agriveda2/farmAlertsEngine";
import {
  buildIrrigationInAppAlerts,
  markIrrigationDone,
  onIrrigationAlertsChanged,
} from "@/lib/irrigationReminders";
import {
  answerAiFollowUp,
  buildAiFollowUpAlerts,
} from "@/lib/aiDoctorFollowUp";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";

const SEV = {
  critical: "border-l-red-500 bg-red-50 dark:bg-red-500/10",
  warning: "border-l-amber-500 bg-amber-50 dark:bg-amber-500/10",
  info: "border-l-sky-500 bg-sky-50 dark:bg-sky-500/10",
};

export default function AlertsHub() {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const { showToast } = useToast();
  const { fields } = useSprayFields();
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();
  const [irrTick, setIrrTick] = useState(0);
  const [fuTick, setFuTick] = useState(0);

  useEffect(() => onIrrigationAlertsChanged(() => setIrrTick((n) => n + 1)), []);

  const irrigationAlerts = useMemo(
    () => buildIrrigationInAppAlerts(hi),
    // irrTick refreshes after "पानी दे दिया"
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hi, irrTick]
  );

  const aiFollowUps = useMemo(
    () => buildAiFollowUpAlerts(hi),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hi, fuTick]
  );

  const fieldAlerts = useMemo(() => {
    const list =
      fields.length > 0
        ? fields
        : crops.map((c, i) => ({
            id: `c-${c.slug}`,
            name: `Field ${i + 1}`,
            cropSlug: c.slug,
          }));

    return list
      .flatMap((f) =>
        buildFieldAlerts(f, profile.sowingDates[f.cropSlug]).map((a) => ({
          ...a,
          fieldName: a.fieldName ?? f.name,
        }))
      )
      .sort((a, b) => {
        const order = { critical: 0, warning: 1, info: 2 };
        return order[a.severity] - order[b.severity];
      });
  }, [fields, crops, profile.sowingDates]);

  const allAlerts = useMemo(() => {
    const order = { critical: 0, warning: 1, info: 2 };
    const mappedFu = aiFollowUps.map((f) => ({
      id: f.id,
      severity: f.severity as "info",
      title: f.title,
      body: f.body,
      fieldName: hi ? "AI Doctor जाँच" : "AI Doctor check-in",
      actionLabel: hi ? "AI Doctor खोलें" : "Open AI Doctor",
      actionHref: f.href,
      followUpId: f.followUpId as string | undefined,
      cropSlug: undefined as string | undefined,
      daysAhead: undefined as number | undefined,
    }));
    return [...irrigationAlerts, ...fieldAlerts, ...mappedFu].sort(
      (a, b) => order[a.severity] - order[b.severity]
    );
  }, [irrigationAlerts, fieldAlerts, aiFollowUps, hi]);

  const onWatered = useCallback(
    async (cropSlug: string) => {
      await markIrrigationDone(cropSlug);
      setIrrTick((n) => n + 1);
      showToast(hi ? "अगली पानी याद लगा दी ✓" : "Next water reminder set ✓");
    },
    [hi, showToast]
  );

  const onFollowUp = useCallback(
    (id: string, status: "improved" | "same" | "worse") => {
      answerAiFollowUp(id, status);
      setFuTick((n) => n + 1);
      showToast(
        hi
          ? status === "improved"
            ? "अच्छा — सुधार नोट किया ✓"
            : status === "worse"
              ? "नोट किया — विशेषज्ञ से पूछें"
              : "नोट किया ✓"
          : "Thanks — noted ✓"
      );
    },
    [hi, showToast]
  );

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[22px] border border-amber-500/20 shadow-[var(--av-shadow-sm)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/jobs/job-alerts.jpg"
          alt=""
          className="h-36 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/15" />
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
            <Bell className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[17px] font-bold text-white">
              {hi ? "आज का अलर्ट" : "Today's alerts"}
            </p>
            <p className="text-[12px] font-medium text-white/85">
              {hi
                ? "पानी याद · मौसम · फसल — ऐप के अंदर"
                : "Water reminders · weather · crop — in app"}
            </p>
          </div>
        </div>
      </div>

      {allAlerts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 px-4 py-8 text-center text-sm font-semibold text-[var(--av-text-muted)]">
          {hi ? "कोई अलर्ट नहीं — सब ठीक ✓" : "No alerts — all good ✓"}
        </p>
      ) : (
        allAlerts.map((a) => {
          const isIrrDue = a.id.startsWith("irr-due-");
          const isAiFu = a.id.startsWith("ai-fu-");
          const cropSlug = a.cropSlug;
          const followUpId =
            "followUpId" in a && typeof (a as { followUpId?: unknown }).followUpId === "string"
              ? (a as { followUpId: string }).followUpId
              : undefined;
          return (
            <div key={a.id + (a.fieldName ?? "")} className="mb-3">
              <Link href={a.actionHref ?? "/dashboard"}>
                <div
                  className={`rounded-xl border border-[var(--av-border)] border-l-4 p-4 ${SEV[a.severity]}`}
                >
                  <p className="text-[10px] font-bold uppercase text-[var(--av-text-muted)]">
                    {a.fieldName}
                    {a.daysAhead ? ` · ${a.daysAhead} ${hi ? "दिन पहले" : "days ahead"}` : ""}
                  </p>
                  <p className="mt-1 font-bold text-[var(--av-text-primary)]">{a.title}</p>
                  <p className="mt-1 text-sm text-[var(--av-text-secondary)]">{a.body}</p>
                  {a.actionLabel && !isAiFu && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-bold text-[var(--av-accent)]">
                      {a.actionLabel}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </p>
                  )}
                </div>
              </Link>
              {isIrrDue && cropSlug ? (
                <button
                  type="button"
                  onClick={() => void onWatered(cropSlug)}
                  className={cn(AV.btnSecondarySm, "mt-2 w-full justify-center")}
                >
                  {hi ? "पानी दे दिया — अगली याद लगाओ" : "Watered — set next reminder"}
                </button>
              ) : null}
              {isAiFu && followUpId ? (
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: "improved" as const, label: hi ? "सुधार" : "Better" },
                      { id: "same" as const, label: hi ? "वैसा ही" : "Same" },
                      { id: "worse" as const, label: hi ? "बढ़ी" : "Worse" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onFollowUp(followUpId, opt.id)}
                      className={cn(AV.btnSecondarySm, "justify-center px-1 text-[11px]")}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
}
