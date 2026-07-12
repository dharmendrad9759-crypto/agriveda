"use client";

import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { AV } from "@/lib/design/tokens";
import { useDashboardAlerts } from "@/hooks/useDashboardAlerts";
import { CheckCircle2, Stethoscope } from "lucide-react";

const DEFAULT_TIPS = [
  "Apply Zinc Sulphate if khaira patches appear in paddy",
  "Monitor stem borer dead hearts during tillering",
  "Maintain shallow water at panicle initiation",
  "Scout fruit fly traps before cucumber harvest",
];

export default function DashboardAiRecommendations() {
  const alerts = useDashboardAlerts(4);
  const tips =
    alerts.length > 0
      ? alerts.map((a) => a.body || a.title).slice(0, 4)
      : DEFAULT_TIPS;

  return (
    <DarkCard hover className="min-w-0 xl:col-span-8">
      <SectionHeader title="AI Recommendation" />
      <ul className="mt-3 space-y-2.5">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--av-accent)]" />
            <p className={`text-sm leading-relaxed ${AV.body}`}>{tip}</p>
          </li>
        ))}
      </ul>
      <AppLink href="/ai-doctor" className={`mt-4 inline-flex ${AV.btnPrimary}`}>
        <Stethoscope className="mr-2 h-4 w-4" />
        Ask AI Doctor
      </AppLink>
    </DarkCard>
  );
}
