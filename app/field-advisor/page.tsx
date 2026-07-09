"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { DonutChart } from "@/components/shell/charts";
import { AV } from "@/lib/design/tokens";
import {
  FIELD_ADVISOR_HELP,
  FIELD_RECOMMENDATIONS,
  FIELD_EXPERTS,
  FIELD_TOOLS,
} from "@/data/mock/field-advisor";
import { DASHBOARD_ALERTS, CROP_HEALTH_SEGMENTS } from "@/data/mock/dashboard";

export default function FieldAdvisorPage() {
  return (
    <AppShell
      title="Field Advisor"
      subtitle="Your personal agriculture advisor for smarter farming decisions"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Field Advisor" }]}
    >
      <div className="rounded-xl border border-[#10b981]/30 bg-gradient-to-r from-[#059669]/30 to-[#10b981]/10 p-6 lg:flex lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--av-text-primary)]">Your Personal Agri Advisor</h2>
          <p className="mt-1 text-sm text-[var(--av-text-secondary)]">Crop-specific recommendations based on your field, soil & weather.</p>
          <AppLink href="/kisan-saathi" className={`mt-4 inline-flex ${AV.btnPrimarySm} bg-white text-[#059669] hover:bg-white/90`}>
            Ask AI Advisor →
          </AppLink>
        </div>
        <div className="mt-4 hidden text-6xl lg:mt-0 lg:block">🌾</div>
      </div>

      <h3 className="mt-6 text-sm font-bold text-[var(--av-text-primary)]">What would you like help with today?</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {FIELD_ADVISOR_HELP.map((item, i) => (
          <AppLink key={item.title} href={item.href}>
            <DarkCard hover delay={i} className="h-full text-center">
              <span className="text-2xl">{item.icon}</span>
              <p className="mt-2 text-xs font-bold text-[var(--av-text-primary)]">{item.title}</p>
              <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{item.desc}</p>
            </DarkCard>
          </AppLink>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Recommendations for Your Fields</h3>
          <ul className="mt-3 space-y-2">
            {FIELD_RECOMMENDATIONS.map((r) => (
              <li key={r.crop} className="flex items-center justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                <div>
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
        <DarkCard hover delay={1}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Field Health Summary</h3>
          <div className="mt-4 flex justify-center">
            <DonutChart segments={CROP_HEALTH_SEGMENTS} centerValue="82" centerLabel="Good" />
          </div>
          <p className="mt-3 text-center text-xs text-emerald-400">Keep it up! Your fields are in good condition.</p>
        </DarkCard>

        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Important Alerts</h3>
          <ul className="mt-3 space-y-2">
            {DASHBOARD_ALERTS.map((a) => (
              <li key={a.id} className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                <p className="text-xs font-semibold text-[var(--av-text-primary)]">{a.title}</p>
                <p className="text-[10px] text-[var(--av-text-muted)]">{a.desc}</p>
              </li>
            ))}
          </ul>
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
