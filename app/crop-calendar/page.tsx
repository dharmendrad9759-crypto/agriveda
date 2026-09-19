"use client";

import AppShell from "@/components/shell/AppShell";
import CropPlannerClient from "@/components/crop-planner/CropPlannerClient";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function CropCalendarPage() {
  const { t } = useLocale();

  return (
    <AppShell className="!bg-transparent" backHref="/" title={t("plannerTitle")}>
      <CropPlannerClient />
    </AppShell>
  );
}
