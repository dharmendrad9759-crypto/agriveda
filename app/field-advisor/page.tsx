"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import PageHero from "@/components/shell/PageHero";
import Badge from "@/components/design-system/Badge";
import { DonutChart } from "@/components/shell/charts";
import { AV } from "@/lib/design/tokens";
import {
  FIELD_ADVISOR_HELP,
  FIELD_EXPERTS,
  FIELD_TOOLS,
} from "@/data/mock/field-advisor";
import { CROP_HEALTH_SEGMENTS } from "@/data/mock/dashboard";
import { useDashboardAlerts } from "@/hooks/useDashboardAlerts";
import { useFarmData } from "@/hooks/useFarmData";
import { buildFieldRecommendations } from "@/lib/field-advisor/buildFieldRecommendations";
import { Brain, AlertTriangle } from "lucide-react";

const SEVERITY_STYLES = {
  critical: "border-red-500/30 bg-red-500/10 text-red-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  info: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

export default function FieldAdvisorPage() {
  const alerts = useDashboardAlerts(6);
  const recommendations = buildFieldRecommendations(alerts);
  const { stats } = useFarmData();
  const healthLabel = stats.healthScore >= 80 ? "Good" : stats.healthScore >= 65 ? "Average" : "Watch";

  return (
    <AppShell
      className="!bg-transparent"
      title="Field Advisor"
      subtitle="Your personal agriculture advisor for smarter farming decisions"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Field Advisor" }]}
    >
      <PageHero
        title="Your Personal Agri Advisor"
        subtitle="Crop-specific recommendations based on your field, soil & weather."
        badge="AI Powered"
        icon={Brain}
        action={{ label: "Ask AI Advisor", href: "/kisan-saathi" }}
      />

      <h3 className="text-sm font-bold text-[var(--av-text-primary)]">What would you like help with today?</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {FIELD_ADVISOR_HELP.map((item, i) => (
          <AppLink key={item.title} href={item.href}>
            <DarkCard hover delay={i} className="h-full border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-transparent text-center">
              <span className="text-2xl">{item.icon}</span>
              <p className="mt-2 text-xs font-bold text-[var(--av-text-primary)]">{item.title}</p>
              <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{item.desc}</p>
            </DarkCard>
          </AppLink>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1} className="border-emerald-500/15">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Recommendations for Your Fields</h3>
            <Badge variant="info">{recommendations.length} tips</Badge>
          </div>
          <ul className="mt-3 space-y-2">
            {recommendations.map((r) => (
              <li key={`${r.crop}-${r.tip}`} className="flex items-center justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{r.crop}</p>
                  <p className="text-[10px] text-[var(--av-text-muted)]">{r.tip}</p>
                </div>
                <AppLink href={r.href} className="shrink-0 text-[10px] font-bold text-[var(--av-accent)]">View →</AppLink>
              </li>
            ))}
          </ul>
        </DarkCard>

        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Ask an Expert</h3>
          <ul className="mt-3 space-y-2">
            {FIELD_EXPERTS.map((e) => (
              <li key={e.name} className="flex items-center justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                <div>
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{e.name}</p>
                  <p className="text-[10px] text-[var(--av-text-muted)]">{e.role} · {e.exp}</p>
                </div>
                <AppLink href={e.href} className="rounded-lg bg-[var(--av-accent)] px-3 py-1.5 text-[10px] font-bold text-white">Ask Now</AppLink>
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1} className="border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Field Health Summary</h3>
          <div className="mt-4 flex justify-center">
            <DonutChart
              segments={CROP_HEALTH_SEGMENTS}
              centerValue={`${stats.healthScore}%`}
              centerLabel={healthLabel}
            />
          </div>
          <p className="mt-3 text-center text-xs text-emerald-400">
            {stats.healthScore >= 75
              ? "Keep it up! Your fields are in good condition."
              : "Review alerts below and take action this week."}
          </p>
        </DarkCard>

        <DarkCard hover delay={2}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Important Alerts</h3>
            <Badge variant={alerts.length ? "warning" : "success"}>{alerts.length} active</Badge>
          </div>
          <ul className="mt-3 space-y-2">
            {alerts.length === 0 ? (
              <li className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-4 text-center text-xs text-emerald-400">
                No active alerts — all good ✓
              </li>
            ) : (
              alerts.map((a) => (
                <li key={a.id} className={`rounded-lg border px-3 py-2 ${SEVERITY_STYLES[a.severity]}`}>
                  <AppLink href={a.actionHref ?? "/alerts"} className="block">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--av-text-primary)]">
                      {a.severity !== "info" && <AlertTriangle className="h-3 w-3 shrink-0" />}
                      {a.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">{a.body}</p>
                    {a.actionLabel && (
                      <p className="mt-1 text-[10px] font-bold text-[var(--av-accent)]">{a.actionLabel} →</p>
                    )}
                  </AppLink>
                </li>
              ))
            )}
          </ul>
          <AppLink href="/alerts" className={`mt-3 inline-flex ${AV.btnSecondarySm}`}>
            View all alerts
          </AppLink>
        </DarkCard>
      </div>

      <h3 className="mt-6 text-sm font-bold text-[var(--av-text-primary)]">Tools & Calculators</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {FIELD_TOOLS.map((tool, i) => (
          <AppLink key={tool.title} href={tool.href}>
            <DarkCard hover delay={i} className="h-full">
              <p className="text-xs font-bold text-[var(--av-text-primary)]">{tool.title}</p>
              <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{tool.desc}</p>
              <span className="mt-2 inline-block text-[10px] font-semibold text-[var(--av-accent)]">Use Tool →</span>
            </DarkCard>
          </AppLink>
        ))}
      </div>

      <ShellCtaBanner
        title="Need Personalized Advice?"
        description="Talk to our agriculture experts and get solutions for your specific problems."
        buttonLabel="Contact Expert Now"
        href="/ask-query"
      />
    </AppShell>
  );
}
