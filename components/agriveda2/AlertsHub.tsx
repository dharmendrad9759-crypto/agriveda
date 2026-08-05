"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Bell, ChevronRight } from "lucide-react";
import { useSprayFields } from "@/hooks/useSprayFields";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { buildFieldAlerts } from "@/lib/agriveda2/farmAlertsEngine";

const SEV = {
  critical: "border-l-red-500 bg-red-50 dark:bg-red-500/10",
  warning: "border-l-amber-500 bg-amber-50 dark:bg-amber-500/10",
  info: "border-l-sky-500 bg-sky-50 dark:bg-sky-500/10",
};

export default function AlertsHub() {
  const { fields } = useSprayFields();
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();

  const allAlerts = useMemo(() => {
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
            <p className="text-[17px] font-bold text-white">आज का अलर्ट</p>
            <p className="text-[12px] font-medium text-white/85">
              मौसम + फसल अवस्था — पहले से सावधान
            </p>
          </div>
        </div>
      </div>

      {allAlerts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 px-4 py-8 text-center text-sm font-semibold text-[var(--av-text-muted)]">
          कोई अलर्ट नहीं — सब ठीक ✓
        </p>
      ) : (
        allAlerts.map((a) => (
          <Link key={a.id + a.fieldName} href={a.actionHref ?? "/dashboard"}>
            <div
              className={`mb-3 rounded-xl border border-[var(--av-border)] border-l-4 p-4 ${SEV[a.severity].replace(/rounded-r-2xl|shadow-sm/g, "")}`}
            >
              <p className="text-[10px] font-bold uppercase text-[var(--av-text-muted)]">
                {a.fieldName}
                {a.daysAhead ? ` · ${a.daysAhead} दिन पहले` : ""}
              </p>
              <p className="mt-1 font-bold text-[var(--av-text-primary)]">{a.title}</p>
              <p className="mt-1 text-sm text-[var(--av-text-secondary)]">{a.body}</p>
              {a.actionLabel && (
                <p className="mt-2 flex items-center gap-1 text-xs font-bold text-[var(--av-accent)]">
                  {a.actionLabel}
                  <ChevronRight className="h-3.5 w-3.5" />
                </p>
              )}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
