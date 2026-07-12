"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Download,
  FolderOpen,
  Share2,
  Sprout,
  Droplets,
  IndianRupee,
  Stethoscope,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { crops } from "@/data/crops";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropHindiName, getCropImageUrl } from "@/lib/crops/crop-display";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { AV } from "@/lib/design/tokens";

const SEASONS = [
  { id: "kharif", label: "Kharif (Jun–Oct)" },
  { id: "rabi", label: "Rabi (Nov–Mar)" },
  { id: "zaid", label: "Zaid (Apr–Jun)" },
] as const;

const PLAN_TABS = ["Overview", "Irrigation", "Fertilizer", "Pest Control", "Disease Control", "Weed Control", "Harvest"] as const;

const PADDY_TIMELINE = [
  { stage: "Nursery", days: "0–20 Days", icon: "🌱" },
  { stage: "Transplanting", days: "20–30 Days", icon: "🚜" },
  { stage: "Tillering", days: "30–45 Days", icon: "🌿" },
  { stage: "Panicle Initiation", days: "45–60 Days", icon: "🌾" },
  { stage: "Flowering", days: "60–75 Days", icon: "🌸" },
  { stage: "Grain Filling", days: "75–100 Days", icon: "🌽" },
  { stage: "Maturity", days: "100–120 Days", icon: "✅" },
];

const SCHEDULE_ROWS = [
  { stage: "Nursery", days: "0–20 DAS", activities: ["Seed treatment", "Nursery bed preparation", "Light irrigation"] },
  { stage: "Transplanting", days: "20–30 DAT", activities: ["Field puddling", "Basal fertilizer", "Shallow water"] },
  { stage: "Tillering", days: "30–45 DAT", activities: ["1st nitrogen top-dress", "Stem borer scouting", "Weed control"] },
  { stage: "Panicle Initiation", days: "45–60 DAT", activities: ["2nd nitrogen + potash", "Maintain moisture", "Blast monitoring"] },
  { stage: "Flowering", days: "60–75 DAT", activities: ["Avoid moisture stress", "Planthopper watch", "Micronutrient foliar"] },
  { stage: "Grain Filling", days: "75–100 DAT", activities: ["Light irrigation", "Bird protection", "PHI before spray"] },
  { stage: "Maturity", days: "100–120 DAT", activities: ["Drain water 10 days before", "Harvest at 80% maturity", "Thresh & dry"] },
];

const REMINDERS = [
  { type: "fertilizer", color: "border-emerald-200 bg-emerald-50", text: "Apply first top dressing at tillering (25–30 DAT)" },
  { type: "pest", color: "border-amber-200 bg-amber-50", text: "Monitor Stem Borer — scout for dead hearts" },
  { type: "irrigation", color: "border-sky-200 bg-sky-50", text: "Maintain 2–5 cm water level during tillering" },
  { type: "harvest", color: "border-red-200 bg-red-50", text: "Drain water 10 days before harvest" },
];

const VARIETIES = [
  { name: "Pusa Basmati 1121", duration: "140–145 days", yield: "18–22 q/acre", image: "https://images.unsplash.com/photo-1536304575081-ff8c827fd69f?w=200&h=140&fit=crop" },
  { name: "PB 1121", duration: "120–125 days", yield: "20–25 q/acre", image: "https://images.unsplash.com/photo-1536304575081-ff8c827fd69f?w=200&h=140&fit=crop" },
  { name: "IR 64", duration: "110–115 days", yield: "22–28 q/acre", image: "https://images.unsplash.com/photo-1536304575081-ff8c827fd69f?w=200&h=140&fit=crop" },
];

export default function CropPlannerClient() {
  const { profile } = useFarmerProfile();
  const [cropSlug, setCropSlug] = useState("paddy");
  const [season, setSeason] = useState<(typeof SEASONS)[number]["id"]>("kharif");
  const [area, setArea] = useState("1");
  const [activeTab, setActiveTab] = useState<(typeof PLAN_TABS)[number]>("Overview");
  const [generated, setGenerated] = useState(true);

  const crop = crops.find((c) => c.slug === cropSlug) ?? crops[0];
  const hindi = getCropHindiName(crop.slug);
  const mgmtProfile = getCropManagementProfile(crop.slug);

  const timeline = useMemo(() => {
    const stages = mgmtProfile?.growthStages;
    if (!stages?.length) return PADDY_TIMELINE;
    return stages.slice(0, 7).map((s, i) => ({
      stage: s.title.split(" ").slice(0, 2).join(" "),
      days: s.period,
      icon: PADDY_TIMELINE[i]?.icon ?? "🌱",
    }));
  }, [mgmtProfile]);

  const scheduleRows = useMemo(() => {
    const stages = mgmtProfile?.growthStages;
    if (!stages?.length) return SCHEDULE_ROWS;
    return stages.slice(0, 7).map((s) => ({
      stage: s.title.split(" ").slice(0, 2).join(" "),
      days: s.period,
      activities: s.keyPoints.slice(0, 3).length ? s.keyPoints.slice(0, 3) : [s.title],
    }));
  }, [mgmtProfile]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <AppLink
          href="/my-farm"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--av-border)] px-4 py-2 text-xs font-bold text-[var(--av-text-secondary)]"
        >
          <FolderOpen className="h-4 w-4" />
          My Plans
        </AppLink>
      </div>

      <DarkCard className="!bg-[var(--av-surface-muted)]/60">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={AV.label}>Select Crop</label>
            <select
              value={cropSlug}
              onChange={(e) => setCropSlug(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-sm font-semibold"
            >
              {crops.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                  {getCropHindiName(c.slug) ? ` (${getCropHindiName(c.slug)})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={AV.label}>Select Season</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value as (typeof SEASONS)[number]["id"])}
              className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-sm font-semibold"
            >
              {SEASONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={AV.label}>Area</label>
            <div className="mt-1 flex gap-2">
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-sm font-semibold"
              />
              <span className="flex items-center rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 text-xs font-bold text-[var(--av-text-muted)]">
                Acre
              </span>
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setGenerated(true)}
              className={`w-full ${AV.btnPrimary}`}
            >
              Generate Plan
            </button>
          </div>
        </div>
      </DarkCard>

      {generated && (
        <>
          <DarkCard hover>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
              {crop.name} Growth Stages
            </h3>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {timeline.map((t, i) => (
                <div key={t.stage} className="relative flex min-w-[100px] shrink-0 flex-col items-center text-center">
                  {i < timeline.length - 1 && (
                    <span className="absolute left-[calc(50%+20px)] top-5 h-0.5 w-[calc(100%-40px)] bg-[var(--av-accent)]/30" />
                  )}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--av-accent)] bg-[var(--av-accent-soft)] text-lg">
                    {t.icon}
                  </span>
                  <p className="mt-2 text-[10px] font-bold text-[var(--av-text-primary)]">{t.stage}</p>
                  <p className="text-[9px] text-[var(--av-text-muted)]">{t.days}</p>
                </div>
              ))}
            </div>
          </DarkCard>

          <div className="flex gap-1 overflow-x-auto border-b border-[var(--av-border)] pb-px scrollbar-hide">
            {PLAN_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-3 py-2.5 text-xs font-semibold transition ${
                  activeTab === tab
                    ? "border-b-2 border-[var(--av-accent)] text-[var(--av-accent)]"
                    : "text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-12">
            <DarkCard className="xl:col-span-8" hover>
              <SectionHeader title="Recommended Schedule" />
              <div className="mt-3 overflow-x-auto">
                <table className="av-table min-w-[560px]">
                  <thead>
                    <tr>
                      <th>Stage</th>
                      <th>Days</th>
                      <th>Key Activities</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleRows.map((row) => (
                      <tr key={row.stage}>
                        <td className="font-bold text-[var(--av-accent)]">{row.stage}</td>
                        <td className="whitespace-nowrap text-[var(--av-text-muted)]">{row.days}</td>
                        <td>
                          <ul className="space-y-0.5">
                            {row.activities.map((a) => (
                              <li key={a} className="text-xs text-[var(--av-text-secondary)]">
                                • {a}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="text-right">
                          <AppLink
                            href={`/crops/${crop.slug}`}
                            className="text-[10px] font-bold text-[var(--av-accent)]"
                          >
                            View Details
                          </AppLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className={`inline-flex items-center gap-1.5 ${AV.btnSecondarySm}`}>
                  <Download className="h-3.5 w-3.5" />
                  Download Full Schedule (PDF)
                </button>
                <button type="button" className={`inline-flex items-center gap-1.5 ${AV.btnSecondarySm}`}>
                  <Share2 className="h-3.5 w-3.5" />
                  Share Plan
                </button>
              </div>
            </DarkCard>

            <div className="space-y-4 xl:col-span-4">
              <DarkCard hover>
                <div className="relative h-28 overflow-hidden rounded-xl">
                  <Image src={getCropImageUrl(crop)} alt={crop.name} fill className="object-cover" sizes="320px" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-[var(--av-text-primary)]">Crop Summary</h3>
                <ul className="mt-2 space-y-2 text-xs">
                  {[
                    { icon: Calendar, label: "Duration", value: crop.durationDays },
                    { icon: Sprout, label: "Season", value: SEASONS.find((s) => s.id === season)?.label ?? "Kharif" },
                    { icon: Droplets, label: "Water Requirement", value: "1200–1500 mm" },
                    { icon: IndianRupee, label: "Expected Yield", value: crop.estimatedYield },
                    { icon: IndianRupee, label: "Cost of Cultivation", value: "₹18,000 – 22,000 / Acre" },
                  ].map(({ icon: Icon, label, value }) => (
                    <li key={label} className="flex items-center gap-2 text-[var(--av-text-secondary)]">
                      <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--av-accent)]" />
                      <span className="font-semibold text-[var(--av-text-primary)]">{label}:</span> {value}
                    </li>
                  ))}
                </ul>
              </DarkCard>

              <DarkCard hover delay={1}>
                <SectionHeader title="Important Reminders" />
                <ul className="mt-3 space-y-2">
                  {REMINDERS.map((r) => (
                    <li key={r.text} className={`rounded-xl border p-2.5 text-xs text-[var(--av-text-secondary)] ${r.color}`}>
                      {r.text}
                    </li>
                  ))}
                </ul>
              </DarkCard>
            </div>
          </div>

          <DarkCard hover>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
                Recommended Varieties for {profile.district || "your area"}
              </h3>
              <AppLink href={`/crops/${crop.slug}?tab=varieties`} className={AV.link}>
                View All Varieties
              </AppLink>
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {VARIETIES.map((v) => (
                <div
                  key={v.name}
                  className="av-card-inset min-w-[160px] shrink-0 overflow-hidden !p-0"
                >
                  <div className="relative h-20 w-full">
                    <Image src={v.image} alt={v.name} fill className="object-cover" sizes="160px" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-[var(--av-text-primary)]">{v.name}</p>
                    <p className="text-[10px] text-[var(--av-text-muted)]">{v.duration}</p>
                    <p className="text-[10px] font-semibold text-[var(--av-accent)]">{v.yield}</p>
                  </div>
                </div>
              ))}
            </div>
          </DarkCard>

          <div className="av-hero flex flex-col items-center justify-between gap-4 p-5 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--av-accent-soft)] text-2xl">
                🤖
              </span>
              <div>
                <p className="font-bold text-[var(--av-text-primary)]">Need Personalized Plan?</p>
                <p className={`${AV.micro}`}>AI Doctor se apne khet ke liye custom schedule banwayein</p>
              </div>
            </div>
            <AppLink href="/ai-doctor" className={`inline-flex gap-2 ${AV.btnPrimary}`}>
              <Stethoscope className="h-4 w-4" />
              Ask AI Doctor
            </AppLink>
          </div>
        </>
      )}
    </div>
  );
}
