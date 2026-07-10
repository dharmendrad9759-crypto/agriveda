"use client";

import { useMemo, useState } from "react";
import { MapPin, Sprout, Leaf, ChevronRight } from "lucide-react";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import AppLink from "@/components/ui/AppLink";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import {
  currentSeason,
  getRegionalCropPlan,
  seasonLabel,
  SEASON_INFO,
  type SeasonKey,
  type CropPlanItem,
} from "@/lib/cropPlanning/lookup";
import { AV } from "@/lib/design/tokens";

const SEASONS: SeasonKey[] = ["kharif", "rabi", "zaid"];

function CropChip({ item }: { item: CropPlanItem }) {
  if (item.kind === "note") {
    return (
      <p className="col-span-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[10px] leading-relaxed text-[var(--av-text-secondary)]">
        {item.label}
      </p>
    );
  }

  const href = item.slug ? `/crops/${item.slug}` : "/smart-crop";

  return (
    <AppLink
      href={href}
      className="flex items-center gap-2 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 transition hover:border-[var(--av-accent)]/40"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold text-[var(--av-text-primary)]">{item.english}</span>
        {item.hindi && <span className="block truncate text-[10px] text-[var(--av-text-muted)]">{item.hindi}</span>}
      </span>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--av-text-muted)]" />
    </AppLink>
  );
}

export default function CropCalendarPage() {
  const { profile } = useFarmerProfile();
  const [season, setSeason] = useState<SeasonKey>(currentSeason());

  const plan = useMemo(
    () => getRegionalCropPlan(profile.state, profile.district),
    [profile.state, profile.district]
  );

  const seasonCrops = plan?.seasons[season] ?? [];
  const grains = seasonCrops.filter((c) => c.kind === "crop");
  const vegetables = seasonCrops.filter((c) => c.kind === "vegetable");
  const notes = seasonCrops.filter((c) => c.kind === "note");

  return (
    <AppShell
      title="Crop Planning"
      subtitle="आपके राज्य/ज़िले में कौन-सी फसल किस मौसम में उग सकती है"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Crop Calendar" }]}
      className="overflow-x-hidden"
    >
      {/* Location */}
      <DarkCard className="overflow-hidden">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--av-accent)]" />
          <div className="min-w-0 flex-1">
            {profile.state && profile.district ? (
              <>
                <p className="font-semibold text-[var(--av-text-primary)]">
                  {profile.district}, {profile.state}
                </p>
                {plan?.zone && (
                  <p className="mt-0.5 text-xs text-[var(--av-accent)]">Agro-climatic zone: {plan.zone}</p>
                )}
                {plan?.zoneNote && (
                  <p className="mt-1 text-[10px] leading-relaxed text-[var(--av-text-muted)]">{plan.zoneNote}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-[var(--av-text-secondary)]">
                Profile में राज्य और ज़िला सेट करें — तभी सही crop plan दिखेगा।
              </p>
            )}
          </div>
          <AppLink href="/profile" className="shrink-0 text-[10px] font-bold text-[var(--av-accent)]">
            Edit →
          </AppLink>
        </div>
      </DarkCard>

      {!plan && (
        <DarkCard className="mt-3 text-center" delay={1}>
          <Sprout className="mx-auto h-10 w-10 text-[var(--av-accent)]" />
          <p className="mt-2 text-sm font-bold text-[var(--av-text-primary)]">Location set karein</p>
          <p className="mt-1 text-xs text-[var(--av-text-muted)]">
            Profile → State + District (जैसे Aligarh, Uttar Pradesh)
          </p>
          <AppLink href="/profile" className={`mt-3 inline-flex ${AV.btnPrimarySm}`}>
            Profile खोलें
          </AppLink>
        </DarkCard>
      )}

      {plan && (
        <>
          {/* Season tabs */}
          <div className="-mx-1 mt-3 flex gap-1 overflow-x-auto px-1 pb-1 scrollbar-hide">
            {SEASONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeason(s)}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                  season === s
                    ? "bg-[var(--av-accent)] text-[#0a0f1a]"
                    : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
                }`}
              >
                {seasonLabel(s)}
                {s === plan.currentSeason && (
                  <span className="ml-1 text-[9px] opacity-80">• अभी</span>
                )}
              </button>
            ))}
          </div>

          <p className="mt-2 text-[10px] leading-relaxed text-[var(--av-text-muted)]">
            {SEASON_INFO[season]}
          </p>

          {/* Crops grid */}
          <DarkCard className="mt-3" delay={1}>
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-[var(--av-accent)]" />
              <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
                {seasonLabel(season)} — मुख्य फसलें
              </h3>
            </div>
            {grains.length > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {grains.map((item) => (
                  <CropChip key={item.label} item={item} />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-[var(--av-text-muted)]">इस मौसम में कोई मुख्य फसल दर्ज नहीं।</p>
            )}
          </DarkCard>

          <DarkCard className="mt-3" delay={2}>
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-[var(--av-text-primary)]">सब्ज़ियां</h3>
            </div>
            {vegetables.length > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {vegetables.map((item) => (
                  <CropChip key={item.label} item={item} />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-[var(--av-text-muted)]">
                इस मौसम में सब्ज़ी डेटा limited है — generic सब्ज़ी placeholder हो सकता है।
              </p>
            )}
            {notes.map((n) => (
              <CropChip key={n.label} item={n} />
            ))}
          </DarkCard>

          {/* Quick links */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <AppLink
              href="/smart-crop"
              className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3 text-center"
            >
              <p className="text-xs font-bold text-[var(--av-accent)]">💰 Munafa Ranking</p>
              <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">किस फसल में ज़्यादा मुनाफ़ा</p>
            </AppLink>
            <AppLink
              href="/sowing-window"
              className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3 text-center"
            >
              <p className="text-xs font-bold text-sky-400">📅 Buwai Samay</p>
              <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">कब बोएं — science based</p>
            </AppLink>
          </div>
        </>
      )}

      <ShellCtaBanner
        title="Profit ranking chahiye?"
        description="Yeh page batata hai kya ug sakta hai. Smart Crop batata hai kisme sabse zyada munafa hai."
        buttonLabel="Smart Crop खोलें"
        href="/smart-crop"
      />
    </AppShell>
  );
}
