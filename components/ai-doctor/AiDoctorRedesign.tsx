"use client";

import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import RiskBadge from "@/components/shell/RiskBadge";
import { AV } from "@/lib/design/tokens";
import {
  Bot,
  Bug,
  FlaskConical,
  Leaf,
  Shield,
  Sprout,
  Stethoscope,
  Zap,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const QUICK_CHIPS = ["Identify Disease", "Pest Problem", "Nutrient Deficiency", "Weed Control", "Fertilizer Advice"];

const KNOWLEDGE: { title: string; desc: string; href: string; icon: LucideIcon }[] = [
  { title: "Crop Problems", desc: "Common issues & solutions", href: "/crop-problem", icon: Sprout },
  { title: "Pest Management", desc: "IPM & control methods", href: "/pest-diseases", icon: Bug },
  { title: "Disease Control", desc: "Prevention & treatment", href: "/pest-diseases", icon: Shield },
  { title: "Fertilizer Guide", desc: "NPK & micronutrients", href: "/deficiencies", icon: FlaskConical },
  { title: "Weed Control", desc: "Herbicide & cultural", href: "/crop-problem", icon: Leaf },
];

const DIAGNOSIS = {
  condition: "Rice Blast (likely)",
  confidence: 87,
  urgency: "high" as const,
  nextStep: "Apply Tricyclazole 75% WP @ 0.6 g/L within 48 hours",
  actions: [
    { label: "View disease guide", href: "/crops/paddy/diseases" },
    { label: "Add to calendar", href: "/crop-calendar" },
  ],
};

export function AiDoctorDesktopHero({ onQuickTopic }: { onQuickTopic?: (topic: string) => void }) {
  return (
    <div className="mb-4">
      <div className="av-hero flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
        <div>
          <span className="av-badge av-badge-low">24×7 Farming Assistant</span>
          <h2 className="mt-2 text-lg font-bold text-[var(--av-text-primary)] lg:text-xl">
            आपका स्मार्ट कृषि साथी
          </h2>
          <p className={`mt-1 ${AV.body}`}>
            Photo upload, symptom describe, ya seedha sawal — actionable diagnosis milega.
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--av-accent-soft)] text-[var(--av-accent)]">
          <Bot className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onQuickTopic?.(chip)}
            className="av-chip av-btn-xs shrink-0 cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AiDoctorDesktopSidebar() {
  return (
    <div className="grid gap-4 lg:grid-cols-1">
      <DarkCard hover>
        <SectionHeader title="Latest Diagnosis" />
        <div className="mt-3 av-card-inset border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold text-[var(--av-text-primary)]">{DIAGNOSIS.condition}</p>
            <RiskBadge level={DIAGNOSIS.urgency} label="Urgent" />
          </div>
          <p className={`mt-2 ${AV.micro}`}>Confidence: {DIAGNOSIS.confidence}%</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--av-surface-inset)]">
            <div
              className="h-full rounded-full bg-[var(--av-accent)]"
              style={{ width: `${DIAGNOSIS.confidence}%` }}
            />
          </div>
          <p className="mt-3 text-xs font-medium text-[var(--av-text-primary)]">
            Next step: {DIAGNOSIS.nextStep}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DIAGNOSIS.actions.map((a) => (
              <AppLink key={a.href} href={a.href} className={AV.link}>
                {a.label} →
              </AppLink>
            ))}
          </div>
        </div>

        <ul className="mt-3 space-y-2">
          {[
            "Spray: Tricyclazole 75% WP @ 0.6 g/liter",
            "Fertilizer: Potash @ 25 kg/acre",
            "Irrigation: Light irrigation in 2 days",
          ].map((item) => (
            <li key={item} className="av-card-inset text-xs text-[var(--av-text-secondary)]">
              {item}
            </li>
          ))}
        </ul>
      </DarkCard>

      <DarkCard hover delay={1}>
        <SectionHeader title="Knowledge Base" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          {KNOWLEDGE.map((k) => {
            const Icon = k.icon;
            return (
              <AppLink
                key={k.title}
                href={k.href}
                className="av-card-inset transition hover:border-[var(--av-accent)]/40"
              >
                <Icon className="h-4 w-4 text-[var(--av-accent)]" />
                <p className="mt-1 text-[10px] font-bold text-[var(--av-text-primary)]">{k.title}</p>
                <p className={AV.micro}>{k.desc}</p>
              </AppLink>
            );
          })}
        </div>
      </DarkCard>

      <DarkCard delay={2}>
        <SectionHeader title="Why AI Doctor?" />
        <div className="mt-3 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
          {[
            { label: "Instant", icon: Zap },
            { label: "AI Powered", icon: Bot },
            { label: "24×7", icon: Clock },
            { label: "Personalized", icon: Stethoscope },
          ].map(({ label, icon: Icon }) => (
            <div key={label} className="av-card-inset p-2">
              <Icon className="mx-auto h-4 w-4 text-[var(--av-accent)]" />
              <p className="mt-1 text-[10px] font-semibold text-[var(--av-accent)]">{label}</p>
            </div>
          ))}
        </div>
        <p className={`mt-3 ${AV.micro}`}>
          AI suggestions are advisory. Local expert se confirm karein before spray ya dose change.
        </p>
        <AppLink href="/kisan-saathi" className={`mt-3 inline-flex items-center gap-1 ${AV.link}`}>
          Talk to expert <ArrowRight className="h-3 w-3" />
        </AppLink>
      </DarkCard>
    </div>
  );
}
