"use client";

import { useMemo, useRef, useState } from "react";
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
  Loader2,
} from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { crops } from "@/data/crops";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropHindiName, getCropImageUrl } from "@/lib/crops/crop-display";
import { getVarietiesForCrop } from "@/lib/crops/cropVarieties";
import { buildFertilizerPlan } from "@/lib/agriveda2/fertilizerEngine";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useToast } from "@/components/ui/Toast";
import { writeStorage } from "@/lib/storage";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";

const SEASONS = [
  { id: "kharif", label: "Kharif (Jun–Oct)" },
  { id: "rabi", label: "Rabi (Nov–Mar)" },
  { id: "zaid", label: "Zaid (Apr–Jun)" },
] as const;

const PLAN_TABS = [
  "Overview",
  "Irrigation",
  "Fertilizer",
  "Pest Control",
  "Disease Control",
  "Weed Control",
  "Harvest",
] as const;

type PlanTab = (typeof PLAN_TABS)[number];

const STAGE_ICONS = ["🌱", "🚜", "🌿", "🌾", "🌸", "🌽", "✅", "📦"];

interface SavedPlan {
  cropSlug: string;
  season: string;
  areaAcres: number;
  generatedAt: string;
}

export default function CropPlannerClient() {
  const { profile } = useFarmerProfile();
  const { showToast } = useToast();
  const planRef = useRef<HTMLDivElement>(null);

  const [cropSlug, setCropSlug] = useState("paddy");
  const [season, setSeason] = useState<(typeof SEASONS)[number]["id"]>("kharif");
  const [area, setArea] = useState("1");
  const [activeTab, setActiveTab] = useState<PlanTab>("Overview");
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [planStamp, setPlanStamp] = useState<string | null>(null);

  const crop = crops.find((c) => c.slug === cropSlug) ?? crops[0];
  const hindi = getCropHindiName(crop.slug);
  const mgmt = getCropManagementProfile(crop.slug);
  const acres = Math.max(0.1, Number(area) || 1);

  const fertPlan = useMemo(
    () => (generated ? buildFertilizerPlan(crop.slug, acres) : null),
    [generated, crop.slug, acres, planStamp]
  );

  const varieties = useMemo(
    () => getVarietiesForCrop(crop.slug, profile.state || undefined).slice(0, 3),
    [crop.slug, profile.state, planStamp]
  );

  const timeline = useMemo(() => {
    const stages = mgmt?.growthStages;
    if (!stages?.length) {
      return [
        { stage: "Sowing", days: crop.sowingGuide.bestSowingTime, icon: "🌱" },
        { stage: "Vegetative", days: "Early growth", icon: "🌿" },
        { stage: "Reproductive", days: "Mid season", icon: "🌸" },
        { stage: "Harvest", days: crop.harvestAndYield.harvestingTime, icon: "✅" },
      ];
    }
    return stages.slice(0, 8).map((s, i) => ({
      stage: s.title.split(/[—(]/)[0]?.trim().slice(0, 22) || s.title,
      days: s.period,
      icon: STAGE_ICONS[i] ?? "🌱",
    }));
  }, [mgmt, crop, planStamp]);

  const scheduleRows = useMemo(() => {
    const stages = mgmt?.growthStages;
    if (!stages?.length) {
      return [
        {
          stage: "Land & sowing",
          days: crop.sowingGuide.bestSowingTime,
          activities: [
            crop.sowingGuide.seedTreatment,
            `Seed rate: ${crop.sowingGuide.seedRate}`,
            crop.sowingGuide.sowingMethod,
          ],
        },
        {
          stage: "Crop care",
          days: crop.durationDays,
          activities: crop.irrigationManagement.schedule.slice(0, 3),
        },
        {
          stage: "Harvest",
          days: crop.harvestAndYield.harvestingTime,
          activities: crop.harvestAndYield.maturitySigns.slice(0, 3),
        },
      ];
    }
    return stages.slice(0, 8).map((s) => ({
      stage: s.title.split(/[—(]/)[0]?.trim() || s.title,
      days: s.period,
      activities: s.keyPoints.slice(0, 3).length ? s.keyPoints.slice(0, 3) : [s.title],
    }));
  }, [mgmt, crop, planStamp]);

  const reminders = useMemo(() => {
    const list: { color: string; text: string }[] = [];
    const fert = fertPlan?.schedule?.[0];
    if (fert) {
      list.push({
        color: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
        text: `Fertilizer: ${fert.time} — ${fert.apply}`,
      });
    } else if (crop.fertilizerSchedule.stageWise[0]) {
      list.push({
        color: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
        text: `Fertilizer (${crop.fertilizerSchedule.stageWise[0].stage}): ${crop.fertilizerSchedule.stageWise[0].details[0]}`,
      });
    }
    const pest = mgmt?.pestManagement?.[0];
    if (pest) {
      list.push({
        color: "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
        text: `Pest watch: ${pest.pestName} — ETL: ${pest.etl}`,
      });
    }
    if (crop.irrigationManagement.criticalStages[0]) {
      list.push({
        color: "border-sky-200 bg-sky-50 dark:border-sky-500/20 dark:bg-sky-500/10",
        text: `Irrigation critical: ${crop.irrigationManagement.criticalStages.join(", ")}`,
      });
    }
    list.push({
      color: "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10",
      text: `Harvest: ${crop.harvestAndYield.harvestingTime} — ${crop.harvestAndYield.maturitySigns[0] ?? crop.estimatedYield}`,
    });
    return list.slice(0, 4);
  }, [fertPlan, mgmt, crop, planStamp]);

  const generatePlan = async () => {
    if (!cropSlug) {
      showToast("पहले फसल चुनें", "error");
      return;
    }
    setGenerating(true);
    // Small delay so farmer sees the button working + plan rebuild
    await new Promise((r) => setTimeout(r, 450));

    const stamp = new Date().toISOString();
    const saved: SavedPlan = {
      cropSlug: crop.slug,
      season,
      areaAcres: acres,
      generatedAt: stamp,
    };
    writeStorage("agriveda-last-crop-plan", saved);

    setPlanStamp(stamp);
    setGenerated(true);
    setActiveTab("Overview");
    setGenerating(false);
    showToast(
      `${crop.name}${hindi ? ` (${hindi})` : ""} — ${acres} acre ${season} plan तैयार ✓`
    );

    requestAnimationFrame(() => {
      planRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const waterNeed =
    crop.irrigationManagement.waterRequirement ||
    mgmt?.irrigationSchedule?.[0] ||
    "As per crop / soil moisture";

  const tabBody = () => {
    if (activeTab === "Overview") {
      return (
        <DarkCard className="xl:col-span-8" hover>
          <SectionHeader title={`${crop.name} — Recommended Schedule`} />
          <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
            {acres} acre · {SEASONS.find((s) => s.id === season)?.label} · generated for your selection
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="av-table min-w-[560px]">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Days / Period</th>
                  <th>Key Activities</th>
                  <th className="text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {scheduleRows.map((row) => (
                  <tr key={row.stage + row.days}>
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
                        Crop guide →
                      </AppLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => showToast("PDF export — जल्द available")}
              className={`inline-flex items-center gap-1.5 ${AV.btnSecondarySm}`}
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={() => {
                const text = `${crop.name} plan · ${acres} acre · ${season}`;
                if (navigator.share) {
                  void navigator.share({ title: "Agriveda Crop Plan", text });
                } else {
                  void navigator.clipboard?.writeText(text);
                  showToast("Plan summary copied");
                }
              }}
              className={`inline-flex items-center gap-1.5 ${AV.btnSecondarySm}`}
            >
              <Share2 className="h-3.5 w-3.5" />
              Share Plan
            </button>
          </div>
        </DarkCard>
      );
    }

    if (activeTab === "Irrigation") {
      const lines =
        mgmt?.irrigationSchedule?.length
          ? mgmt.irrigationSchedule
          : [
              crop.irrigationManagement.waterRequirement,
              ...crop.irrigationManagement.criticalStages.map((c) => `Critical: ${c}`),
              ...crop.irrigationManagement.schedule,
            ];
      return (
        <DarkCard className="xl:col-span-12">
          <SectionHeader title={`Irrigation — ${crop.name}`} />
          <ul className="mt-3 space-y-2">
            {lines.filter(Boolean).map((line) => (
              <li key={line} className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-xs text-[var(--av-text-secondary)]">
                {line}
              </li>
            ))}
          </ul>
        </DarkCard>
      );
    }

    if (activeTab === "Fertilizer") {
      return (
        <DarkCard className="xl:col-span-12">
          <SectionHeader title={`Fertilizer — ${crop.name} (${acres} acre)`} />
          <ul className="mt-3 space-y-2">
            {(fertPlan?.schedule?.length
              ? fertPlan.schedule.map((s) => `${s.time}: ${s.apply}`)
              : [
                  ...crop.fertilizerSchedule.basalDose,
                  ...crop.fertilizerSchedule.stageWise.flatMap((s) =>
                    s.details.map((d) => `${s.stage}: ${d}`)
                  ),
                ]
            ).map((line) => (
              <li key={line} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs">
                {line}
              </li>
            ))}
          </ul>
          {fertPlan?.bags?.length ? (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {fertPlan.bags.map((b) => (
                <div key={b.name} className="rounded-xl border border-[var(--av-border)] px-3 py-2">
                  <p className="text-[10px] text-[var(--av-text-muted)]">{b.name}</p>
                  <p className="text-sm font-bold text-[var(--av-accent)]">{b.amount}</p>
                </div>
              ))}
            </div>
          ) : null}
          <AppLink href={`/crops/${crop.slug}?tab=fertilizer`} className={`mt-3 inline-flex ${AV.link}`}>
            Full fertilizer guide →
          </AppLink>
        </DarkCard>
      );
    }

    if (activeTab === "Pest Control") {
      const pests = mgmt?.pestManagement?.slice(0, 5) ?? [];
      return (
        <DarkCard className="xl:col-span-12">
          <SectionHeader title={`Pests — ${crop.name}`} />
          {pests.length ? (
            <ul className="mt-3 space-y-2">
              {pests.map((p) => (
                <li key={p.pestName} className="rounded-xl border border-[var(--av-border)] px-3 py-2.5">
                  <p className="text-xs font-bold text-[var(--av-text-primary)]">{p.pestName}</p>
                  <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">ETL: {p.etl}</p>
                  <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                    {p.activeIngredient} @ {p.dose}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-[var(--av-text-muted)]">
              {crop.cropProtection.majorPests.join(", ") || "See crop pest guide"}
            </p>
          )}
          <AppLink href={`/crops/${crop.slug}?tab=pests`} className={`mt-3 inline-flex ${AV.link}`}>
            All pests →
          </AppLink>
        </DarkCard>
      );
    }

    if (activeTab === "Disease Control") {
      const diseases = mgmt?.diseaseManagement?.slice(0, 5) ?? [];
      return (
        <DarkCard className="xl:col-span-12">
          <SectionHeader title={`Diseases — ${crop.name}`} />
          {diseases.length ? (
            <ul className="mt-3 space-y-2">
              {diseases.map((d) => (
                <li key={d.diseaseName} className="rounded-xl border border-[var(--av-border)] px-3 py-2.5">
                  <p className="text-xs font-bold">{d.diseaseName}</p>
                  <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                    {d.activeIngredient} @ {d.dose}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-[var(--av-text-muted)]">
              {crop.cropProtection.majorDiseases.join(", ") || "See crop disease guide"}
            </p>
          )}
          <AppLink href={`/crops/${crop.slug}?tab=diseases`} className={`mt-3 inline-flex ${AV.link}`}>
            All diseases →
          </AppLink>
        </DarkCard>
      );
    }

    if (activeTab === "Weed Control") {
      const weeds = mgmt?.weedManagement?.slice(0, 4) ?? [];
      const program = mgmt?.weedProgram;
      return (
        <DarkCard className="xl:col-span-12">
          <SectionHeader title={`Weed management — ${crop.name}`} />
          {program?.criticalPeriod ? (
            <p className="mt-2 text-xs text-[var(--av-text-muted)]">
              Critical period: {program.criticalPeriod}
            </p>
          ) : null}
          {weeds.length ? (
            <ul className="mt-3 space-y-2">
              {weeds.map((w) => (
                <li key={w.weedName} className="rounded-xl border border-[var(--av-border)] px-3 py-2 text-xs">
                  <p className="font-bold">{w.weedName}</p>
                  <p className="mt-1 text-[var(--av-text-secondary)]">
                    Pre: {w.preEmergenceHerbicide} · Post: {w.postEmergenceHerbicide} · {w.dose}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-3 space-y-1 text-xs text-[var(--av-text-secondary)]">
              {crop.cropProtection.weedManagement.map((w) => (
                <li key={w}>• {w}</li>
              ))}
            </ul>
          )}
          <AppLink href={`/crops/${crop.slug}?tab=weeds`} className={`mt-3 inline-flex ${AV.link}`}>
            Weed guide →
          </AppLink>
        </DarkCard>
      );
    }

    // Harvest
    return (
      <DarkCard className="xl:col-span-12">
        <SectionHeader title={`Harvest — ${crop.name}`} />
        <p className="mt-2 text-xs font-semibold text-[var(--av-accent)]">
          {crop.harvestAndYield.harvestingTime}
        </p>
        <p className="mt-1 text-xs text-[var(--av-text-muted)]">Yield: {crop.estimatedYield}</p>
        <ul className="mt-3 space-y-1 text-xs text-[var(--av-text-secondary)]">
          {crop.harvestAndYield.maturitySigns.map((m) => (
            <li key={m}>• {m}</li>
          ))}
          {crop.harvestAndYield.storageTips.slice(0, 3).map((m) => (
            <li key={m}>• Storage: {m}</li>
          ))}
        </ul>
      </DarkCard>
    );
  };

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
              onChange={(e) => {
                setCropSlug(e.target.value);
                setGenerated(false);
              }}
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
              onChange={(e) => {
                setSeason(e.target.value as (typeof SEASONS)[number]["id"]);
                setGenerated(false);
              }}
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
                onChange={(e) => {
                  setArea(e.target.value);
                  setGenerated(false);
                }}
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
              onClick={() => void generatePlan()}
              disabled={generating}
              className={`w-full ${AV.btnPrimary} inline-flex items-center justify-center gap-2 disabled:opacity-60`}
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {generating ? "Generating…" : generated ? "Regenerate Plan" : "Generate Plan"}
            </button>
          </div>
        </div>
        {!generated && (
          <p className="mt-3 text-center text-xs text-[var(--av-text-muted)]">
            फसल, सीजन और रकबा चुनकर <span className="font-bold text-[var(--av-accent)]">Generate Plan</span> दबाएँ
          </p>
        )}
      </DarkCard>

      {generated && (
        <div ref={planRef} className="space-y-4">
          <DarkCard hover>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
              {crop.name}
              {hindi ? ` (${hindi})` : ""} Growth Stages
            </h3>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {timeline.map((t, i) => (
                <div key={t.stage + i} className="relative flex min-w-[100px] shrink-0 flex-col items-center text-center">
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

          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
            {PLAN_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-xl border px-1.5 py-2 text-center text-[9px] font-bold leading-tight transition sm:text-[10px]",
                  activeTab === tab
                    ? "border-emerald-500/45 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-12">
            {tabBody()}

            {activeTab === "Overview" && (
              <div className="space-y-4 xl:col-span-4">
                <DarkCard hover>
                  <div className="relative h-28 overflow-hidden rounded-xl">
                    <Image
                      src={getCropImageUrl(crop)}
                      alt={crop.name}
                      fill
                      className="object-cover object-center"
                      sizes="320px"
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-[var(--av-text-primary)]">Crop Summary</h3>
                  <ul className="mt-2 space-y-2 text-xs">
                    {[
                      { icon: Calendar, label: "Duration", value: crop.durationDays },
                      {
                        icon: Sprout,
                        label: "Season",
                        value: SEASONS.find((s) => s.id === season)?.label ?? season,
                      },
                      { icon: Droplets, label: "Water", value: waterNeed },
                      { icon: IndianRupee, label: "Yield", value: crop.estimatedYield },
                      { icon: IndianRupee, label: "Area", value: `${acres} acre` },
                    ].map(({ icon: Icon, label, value }) => (
                      <li key={label} className="flex items-start gap-2 text-[var(--av-text-secondary)]">
                        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--av-accent)]" />
                        <span>
                          <span className="font-semibold text-[var(--av-text-primary)]">{label}:</span> {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </DarkCard>

                <DarkCard hover delay={1}>
                  <SectionHeader title="Important Reminders" />
                  <ul className="mt-3 space-y-2">
                    {reminders.map((r) => (
                      <li
                        key={r.text}
                        className={`rounded-xl border p-2.5 text-xs text-[var(--av-text-secondary)] ${r.color}`}
                      >
                        {r.text}
                      </li>
                    ))}
                  </ul>
                </DarkCard>
              </div>
            )}
          </div>

          <DarkCard hover>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
                Recommended Varieties — {crop.name}
                {profile.district ? ` · ${profile.district}` : ""}
              </h3>
              <AppLink href={`/crops/${crop.slug}?tab=varieties`} className={AV.link}>
                View All →
              </AppLink>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {varieties.map((v) => (
                <div key={v.name} className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5">
                  <p className="text-xs font-bold text-[var(--av-text-primary)]">{v.name}</p>
                  <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">{v.trait}</p>
                  <p className="mt-1 text-[10px] font-semibold text-[var(--av-accent)]">{v.season}</p>
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
                <p className={AV.micro}>AI Doctor से अपने खेत के हिसाब से पूछें</p>
              </div>
            </div>
            <AppLink href="/ai-doctor" className={`inline-flex gap-2 ${AV.btnPrimary}`}>
              <Stethoscope className="h-4 w-4" />
              Ask AI Doctor
            </AppLink>
          </div>
        </div>
      )}
    </div>
  );
}
