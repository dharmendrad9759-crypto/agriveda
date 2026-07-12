"use client";

import { useState } from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import RiskBadge from "@/components/shell/RiskBadge";
import { GaugeChart } from "@/components/shell/charts";
import { AV } from "@/lib/design/tokens";
import { AI_DOCTOR_CROPS } from "@/data/ai-doctor-crops";
import { getCropImageUrl } from "@/lib/crops/crop-display";
import { crops } from "@/data/crops";
import {
  Bot,
  Camera,
  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  Sparkles,
  Stethoscope,
  Upload,
  Zap,
  ArrowRight,
  Leaf,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DiagnosisResult } from "@/lib/aiDiagnosis";
import type { AIHistoryEntry } from "@/hooks/useAIHistory";

const HOW_IT_WORKS = [
  { step: "Upload Photo", icon: Upload },
  { step: "AI Analysis", icon: Bot },
  { step: "Get Diagnosis", icon: Stethoscope },
  { step: "Get Solution", icon: CheckCircle2 },
];

const EXPERTS = [
  { name: "Dr. Rakesh Sharma", title: "Agronomist (PhD)", exp: "15 years", photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop" },
  { name: "Dr. Priya Verma", title: "Plant Pathologist", exp: "12 years", photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop" },
  { name: "Dr. Amit Singh", title: "Entomologist", exp: "10 years", photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=80&h=80&fit=crop" },
];

const PROTECTION_TIPS = [
  "Monitor your field regularly for early symptoms",
  "Use yellow sticky traps for flying pests",
  "Rotate crops to break pest cycles",
  "Follow PHI before harvest spray",
];

const TREATMENT_TABS = ["Pest", "Disease", "Nutrient Deficiency", "Weed"] as const;

export function AiDoctorDesktopHero({
  onUploadClick,
  onQuickTopic,
}: {
  onUploadClick?: () => void;
  onQuickTopic?: (topic: string) => void;
}) {
  return (
    <DarkCard className="overflow-hidden !p-0">
      <div className="grid lg:grid-cols-2">
        <div className="border-b border-[var(--av-border)] bg-gradient-to-br from-emerald-50 to-white p-5 lg:border-b-0 lg:border-r dark:from-emerald-950/30 dark:to-transparent">
          <span className="av-badge av-badge-low">AI Powered</span>
          <h2 className="mt-3 text-lg font-bold text-[var(--av-text-primary)] lg:text-xl">
            How can I help your crop today?
          </h2>
          <ul className="mt-3 space-y-1.5 text-xs text-[var(--av-text-secondary)]">
            {["Identify pests, diseases & nutrient issues", "Get spray dose & timing recommendations", "24×7 instant diagnosis from photo"].map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--av-accent)]" />
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onUploadClick}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 sm:w-auto ${AV.btnPrimary}`}
          >
            <Camera className="h-4 w-4" />
            Upload Crop / Leaf Photo
          </button>
          <p className={`mt-2 ${AV.micro}`}>Supports JPG, PNG (Max 10MB)</p>
        </div>
        <div className="p-5">
          <p className="text-xs font-bold text-[var(--av-text-primary)]">How it works?</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--av-accent-soft)] text-[var(--av-accent)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="max-w-[72px] text-center text-[9px] font-semibold text-[var(--av-text-muted)]">
                      {step.step}
                    </span>
                  </div>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <ArrowRight className="h-3.5 w-3.5 text-[var(--av-text-muted)]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--av-border)] px-4 py-2">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {["Identify Disease", "Pest Problem", "Nutrient Deficiency", "Weed Control", "Fertilizer Advice"].map((chip) => (
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
    </DarkCard>
  );
}

export function AiDoctorQuickIdentify({
  selectedCrop,
  onSelectCrop,
}: {
  selectedCrop: string;
  onSelectCrop: (slug: string) => void;
}) {
  const quickCrops = AI_DOCTOR_CROPS.slice(0, 9);
  return (
    <DarkCard hover>
      <SectionHeader title="Quick Identify — Select Crop" />
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {quickCrops.map((c) => {
          const full = crops.find((x) => x.slug === c.slug);
          const active = selectedCrop === c.slug;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => onSelectCrop(c.slug)}
              className={`flex min-w-[72px] shrink-0 flex-col items-center gap-1.5 rounded-xl border p-2 transition ${
                active
                  ? "border-[var(--av-accent)] bg-[var(--av-accent-soft)]"
                  : "border-[var(--av-border)] bg-[var(--av-surface)] hover:border-[var(--av-accent)]/40"
              }`}
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                {full ? (
                  <Image src={getCropImageUrl(full)} alt={c.name} fill className="object-cover" sizes="48px" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-2xl">{c.emoji}</span>
                )}
              </div>
              <span className="text-[10px] font-bold text-[var(--av-text-primary)]">{c.name}</span>
            </button>
          );
        })}
        <AppLink
          href="/crops"
          className="flex min-w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[var(--av-border)] p-2 text-[10px] font-bold text-[var(--av-accent)]"
        >
          More
        </AppLink>
      </div>
    </DarkCard>
  );
}

export function AiDoctorRecentDiagnoses({
  history,
  onOpenEntry,
}: {
  history: AIHistoryEntry[];
  onOpenEntry: (entry: AIHistoryEntry) => void;
}) {
  const items = history.slice(0, 4);
  if (!items.length) {
    return (
      <DarkCard hover>
        <SectionHeader title="Recent Diagnoses" action={{ label: "View All", href: "#" }} />
        <p className={`mt-3 text-center ${AV.micro}`}>No diagnoses yet — upload a photo to get started</p>
      </DarkCard>
    );
  }

  return (
    <DarkCard hover>
      <SectionHeader title="Recent Diagnoses" />
      <ul className="mt-3 space-y-2">
        {items.map((h) => {
          const severity =
            h.result.severity?.toLowerCase().includes("high") ? "high" :
            h.result.severity?.toLowerCase().includes("low") ? "low" : "medium";
          return (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => onOpenEntry(h)}
                className="av-card-inset flex w-full items-center gap-3 p-2 text-left transition hover:border-[var(--av-accent)]/40"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={h.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[var(--av-text-primary)]">{h.result.diseaseName}</p>
                  <p className={AV.micro}>
                    {typeof h.timestamp === "string"
                      ? new Date(h.timestamp).toLocaleDateString("en-IN")
                      : new Date(h.timestamp).toLocaleDateString("en-IN")}{" "}
                    · {h.result.confidence}%
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                    Disease
                  </span>
                </div>
                <RiskBadge level={severity} />
              </button>
            </li>
          );
        })}
      </ul>
    </DarkCard>
  );
}

export function AiDoctorSidebarPanels() {
  const [treatmentTab, setTreatmentTab] = useState<(typeof TREATMENT_TABS)[number]>("Disease");

  return (
    <div className="grid gap-4 lg:grid-cols-1">
      <DarkCard hover>
        <SectionHeader title="Disease Risk Forecast" />
        <div className="mt-2 flex flex-col items-center sm:flex-row sm:gap-4">
          <GaugeChart value={78} label="High Risk" />
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold text-[var(--av-text-primary)]">Paddy — Leaf Blast</p>
            <p className={`mt-1 ${AV.micro}`}>
              High risk in your area for the next 7 days due to humid conditions
            </p>
          </div>
        </div>
      </DarkCard>

      <DarkCard hover delay={1}>
        <SectionHeader title="Ask Expert" />
        <ul className="mt-3 space-y-3">
          {EXPERTS.map((e) => (
            <li key={e.name} className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image src={e.photo} alt={e.name} fill className="object-cover" sizes="40px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[var(--av-text-primary)]">{e.name}</p>
                <p className={AV.micro}>{e.title} · {e.exp}</p>
              </div>
              <AppLink href="/ask-query" className="shrink-0 rounded-lg border border-[var(--av-accent)] px-2 py-1 text-[10px] font-bold text-[var(--av-accent)]">
                Chat
              </AppLink>
            </li>
          ))}
        </ul>
        <AppLink href="/ask-query" className={`mt-3 flex w-full justify-center ${AV.btnPrimarySm}`}>
          Consult Now
        </AppLink>
      </DarkCard>

      <DarkCard hover delay={2}>
        <div className="flex gap-1 overflow-x-auto border-b border-[var(--av-border)] pb-px scrollbar-hide">
          {TREATMENT_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTreatmentTab(tab)}
              className={`shrink-0 px-2 py-2 text-[10px] font-bold ${
                treatmentTab === tab
                  ? "border-b-2 border-[var(--av-accent)] text-[var(--av-accent)]"
                  : "text-[var(--av-text-muted)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-3 av-card-inset border-red-200 bg-red-50/50 p-3 dark:border-red-500/20 dark:bg-red-500/5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-[var(--av-text-primary)]">Leaf Blast (Pyricularia oryzae)</p>
            <RiskBadge level="high" label="High Severity" />
          </div>
          <p className={`mt-1 ${AV.micro}`}>Paddy · Disease</p>
          <div className="mt-3 space-y-2 text-[11px]">
            <div>
              <p className="font-bold text-emerald-700">Early Stage (Curative)</p>
              <p className="text-[var(--av-text-secondary)]">Tricyclazole 75% WP @ 0.6 g/L — spray uniformly</p>
            </div>
            <div>
              <p className="font-bold text-amber-700">Advanced Stage (Curative)</p>
              <p className="text-[var(--av-text-secondary)]">Isoprothiolane 40% EC @ 1.5 ml/L</p>
            </div>
            <div>
              <p className="font-bold text-sky-700">Preventive</p>
              <p className="text-[var(--av-text-secondary)]">Carbendazim 50% WP — repeat every 15 days if needed</p>
            </div>
          </div>
          <AppLink href="/crops/paddy/diseases" className={`mt-3 inline-flex ${AV.link}`}>
            View Full Details →
          </AppLink>
        </div>
      </DarkCard>

      <DarkCard delay={3}>
        <SectionHeader title="Plant Protection Tips" />
        <ul className="mt-3 space-y-2">
          {PROTECTION_TIPS.map((tip) => (
            <li key={tip} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
              <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--av-accent)]" />
              {tip}
            </li>
          ))}
        </ul>
      </DarkCard>

      <DarkCard className="border-[var(--av-accent)]/30 bg-[var(--av-accent-soft)]/30">
        <div className="flex items-center gap-3">
          <Phone className="h-8 w-8 text-[var(--av-accent)]" />
          <div>
            <p className="text-xs font-bold text-[var(--av-text-primary)]">Emergency Helpline</p>
            <p className="text-lg font-black text-[var(--av-accent)]">1800 120 2474</p>
            <p className={AV.micro}>Mon–Sat, 8 AM – 6 PM</p>
          </div>
        </div>
      </DarkCard>
    </div>
  );
}

export function AiDoctorDesktopSidebar() {
  return <AiDoctorSidebarPanels />;
}
