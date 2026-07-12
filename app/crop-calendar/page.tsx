"use client";

import { Calendar } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import CropPlannerClient from "@/components/crop-planner/CropPlannerClient";

export default function CropCalendarPage() {
  return (
    <AppShell
      title={
        <span className="inline-flex items-center gap-2">
          <Calendar className="h-6 w-6 text-[var(--av-accent)]" />
          Crop Planner
        </span>
      }
      subtitle="Generate stage-wise crop schedule for your field"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Crop Planner" }]}
      actions={
        <AppLink
          href="/my-farm"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-4 py-2 text-xs font-bold text-[var(--av-text-secondary)] shadow-sm"
        >
          My Plans
        </AppLink>
      }
    >
      <CropPlannerClient />
    </AppShell>
  );
}
