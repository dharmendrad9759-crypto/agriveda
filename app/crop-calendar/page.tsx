"use client";

import { Sparkles } from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import CropPlannerClient from "@/components/crop-planner/CropPlannerClient";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function CropCalendarPage() {
  const { t } = useLocale();

  return (
    <AppShell
      title={
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-[var(--av-accent)]" />
          {t("plannerTitle")}
        </span>
      }
      subtitle={t("plannerSubtitle")}
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("plannerTitle") }]}
    >
      <CropPlannerClient />
    </AppShell>
  );
}
