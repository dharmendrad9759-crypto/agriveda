"use client";

import { Calendar } from "lucide-react";
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
    >
      <CropPlannerClient />
    </AppShell>
  );
}
