"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Bell, ChevronRight } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
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
      <DarkCard className="flex items-center gap-3 p-4">
        <Bell className="h-8 w-8 text-[var(--av-accent)]" />
        <div>
          <p className="font-bold text-[var(--av-text-primary)]">Predictive Alert System</p>
          <p className="text-xs text-[var(--av-text-muted)]">
            समस्या आने से 3–5 दिन पहले — weather + crop stage + pest calendar
          </p>
        </div>
      </DarkCard>

      {allAlerts.length === 0 ? (
        <p className="text-center text-sm text-[var(--av-text-muted)]">कोई active alert नहीं — सब ठीक ✓</p>
      ) : (
        allAlerts.map((a) => (
          <Link key={a.id + a.fieldName} href={a.actionHref ?? "/dashboard"}>
            <div
              className={`mb-3 rounded-xl border border-[var(--av-border)] border-l-4 p-4 ${SEV[a.severity].replace(/rounded-r-2xl|shadow-sm/g, "")}`}
            >
              <p className="text-[10px] font-bold uppercase text-[var(--av-text-muted)]">
                {a.fieldName}
                {a.daysAhead ? ` · ${a.daysAhead} days ahead` : ""}
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
