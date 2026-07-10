"use client";

import { useMemo } from "react";
import { useSprayFields } from "@/hooks/useSprayFields";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useAppSettings } from "@/hooks/useAppSettings";
import { buildFieldAlerts, type FarmAlert } from "@/lib/agriveda2/farmAlertsEngine";

import type { AppSettings } from "@/hooks/useAppSettings";
import { filterAlertsBySettings } from "@/lib/field-advisor/buildFieldRecommendations";

/** Real predictive alerts for dashboard & alerts page */
export function useDashboardAlerts(limit?: number, settingsOverride?: AppSettings): FarmAlert[] {
  const { fields } = useSprayFields();
  const { profile } = useFarmerProfile();
  const { crops } = useMyCrops();
  const { settings } = useAppSettings();
  const activeSettings = settingsOverride ?? settings;

  return useMemo(() => {
    const list =
      fields.length > 0
        ? fields
        : crops.map((c, i) => ({
            id: `c-${c.slug}`,
            name: `Field ${i + 1}`,
            cropSlug: c.slug,
          }));

    const alerts = list
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

    const filtered = filterAlertsBySettings(alerts, activeSettings);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [fields, crops, profile.sowingDates, limit, activeSettings]);
}
