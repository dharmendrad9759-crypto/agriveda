"use client";

import { useState } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { useMyCrops } from "@/hooks/useMyCrops";
import { getCropDashboard } from "@/data/crop-dashboard";
import { cropCatalog } from "@/data/crop-catalog";
import { Droplets } from "lucide-react";
import { AV } from "@/lib/design/tokens";

export default function IrrigationServicePage() {
  const { crops, hydrated } = useMyCrops();
  const catalog = hydrated && crops.length > 0
    ? crops.map((c) => ({ slug: c.slug, name: c.name, emoji: c.emoji }))
    : cropCatalog.slice(0, 6).map((c) => ({ slug: c.slug, name: c.name, emoji: c.emoji }));

  const [selectedSlug, setSelectedSlug] = useState(catalog[0]?.slug ?? "paddy");
  const dashboard = getCropDashboard(selectedSlug);
  const irrigation = dashboard.irrigationManagement;

  return (
    <AppShell
      title="Irrigation Guide"
      subtitle="Crop-wise water schedule — critical stages aur timing"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/" },
        { label: "Irrigation" },
      ]}
    >
      <DarkCard>
        <p className={AV.body}>
          Apni fasal select karein — PoP ke hisaab se irrigation intervals aur critical stages dekhein.
          Full detail ke liye crop page bhi khol sakte hain.
        </p>
        <AppLink href="/select-crops" className={`mt-3 inline-flex ${AV.btnSecondarySm}`}>
          Manage my crops
        </AppLink>
      </DarkCard>

      <DarkCard className="mt-4" delay={1}>
        <p className="mb-2 text-xs font-bold text-[var(--av-text-secondary)]">Select crop:</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {catalog.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setSelectedSlug(c.slug)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition ${
                selectedSlug === c.slug
                  ? "bg-[var(--av-accent)] text-[#0a0f1a]"
                  : "border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)]"
              }`}
            >
              <span>{c.emoji}</span>
              {c.name}
            </button>
          ))}
        </div>
      </DarkCard>

      <DarkCard className="mt-4" delay={2}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/15">
            <Droplets className="h-5 w-5 text-sky-500" />
          </div>
          <div>
            <h2 className={AV.sectionTitle}>
              {irrigation.emoji} {irrigation.title}
            </h2>
            <p className={`mt-1 ${AV.body}`}>{irrigation.summary}</p>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {irrigation.fields.map((f) => (
            <li
              key={f.label}
              className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2"
            >
              <p className="text-xs font-semibold text-[var(--av-text-primary)]">{f.label}</p>
              <p className="text-[11px] text-[var(--av-text-secondary)]">{f.value}</p>
            </li>
          ))}
        </ul>

        {irrigation.tips.length > 0 && (
          <div className="mt-4">
            <p className={AV.label}>Tips</p>
            <ul className={`mt-2 space-y-1 ${AV.micro}`}>
              {irrigation.tips.map((t) => (
                <li key={t} className="text-[var(--av-text-secondary)]">• {t}</li>
              ))}
            </ul>
          </div>
        )}
      </DarkCard>

      <AppLink href={`/crops/${selectedSlug}`} className={`mt-4 inline-flex ${AV.btnPrimarySm}`}>
        Full {dashboard.name} guide →
      </AppLink>
    </AppShell>
  );
}
