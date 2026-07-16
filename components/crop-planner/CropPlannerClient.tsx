"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Download,
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
import {
  getCropHindiName,
  getCropImageUrl,
  getPlannerSeasonsForCrop,
  pickDefaultPlannerSeason,
  type PlannerSeasonId,
} from "@/lib/crops/crop-display";
import { getVarietiesForCrop } from "@/lib/crops/cropVarieties";
import { buildFertilizerPlan } from "@/lib/agriveda2/fertilizerEngine";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useToast } from "@/components/ui/Toast";
import { writeStorage } from "@/lib/storage";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";
import { shortenFarmerLine, shortenFarmerLines, stageTipsFromPoints } from "@/lib/crops/farmerShortCopy";

const SEASONS: { id: PlannerSeasonId; label: string }[] = [
  { id: "kharif", label: "Kharif (Jun–Oct)" },
  { id: "rabi", label: "Rabi (Nov–Mar)" },
  { id: "zaid", label: "Zaid (Apr–Jun)" },
];

const PLAN_TABS = [
  { id: "Overview", label: "काम" },
  { id: "Irrigation", label: "पानी" },
  { id: "Fertilizer", label: "खाद" },
  { id: "Pest Control", label: "कीट" },
  { id: "Disease Control", label: "रोग" },
  { id: "Weed Control", label: "घास" },
  { id: "Harvest", label: "कटाई" },
] as const;

type PlanTab = (typeof PLAN_TABS)[number]["id"];

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
  const [season, setSeason] = useState<PlannerSeasonId>("kharif");
  const [area, setArea] = useState("1");
  const [activeTab, setActiveTab] = useState<PlanTab>("Overview");
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [planStamp, setPlanStamp] = useState<string | null>(null);

  const crop = crops.find((c) => c.slug === cropSlug) ?? crops[0];
  const hindi = getCropHindiName(crop.slug);
  const mgmt = getCropManagementProfile(crop.slug);
  const acres = Math.max(0.1, Number(area) || 1);

  const allowedSeasons = useMemo(
    () => getPlannerSeasonsForCrop(crop.slug, crop.suitableSeason),
    [crop.slug, crop.suitableSeason]
  );

  const seasonOptions = useMemo(
    () => SEASONS.filter((s) => allowedSeasons.includes(s.id)),
    [allowedSeasons]
  );

  // Crop change → auto season (single = lock; multi = prefer current calendar season)
  useEffect(() => {
    const next = pickDefaultPlannerSeason(allowedSeasons);
    setSeason((prev) => (allowedSeasons.includes(prev) ? prev : next));
  }, [crop.slug, allowedSeasons]);

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
        { stage: "Buwai", days: shortenFarmerLine(crop.sowingGuide.bestSowingTime, 28), icon: "🌱" },
        { stage: "Badhaw", days: "Shuruat", icon: "🌿" },
        { stage: "Phool/dana", days: "Beech", icon: "🌸" },
        { stage: "Kataai", days: shortenFarmerLine(crop.harvestAndYield.harvestingTime, 28), icon: "✅" },
      ];
    }
    return stages.slice(0, 6).map((s, i) => ({
      stage: shortenFarmerLine(s.title.split(/[—(]/)[0]?.trim() || s.title, 16),
      days: shortenFarmerLine(s.period, 24),
      icon: STAGE_ICONS[i] ?? "🌱",
    }));
  }, [mgmt, crop, planStamp]);

  const scheduleRows = useMemo(() => {
    const stages = mgmt?.growthStages;
    if (!stages?.length) {
      return [
        {
          stage: "Buwai",
          days: shortenFarmerLine(crop.sowingGuide.bestSowingTime, 32),
          activities: stageTipsFromPoints(
            [
              `Beej: ${crop.sowingGuide.seedRate}`,
              crop.sowingGuide.seedTreatment,
              crop.sowingGuide.sowingMethod,
            ],
            "Certified beej + sahi spacing"
          ),
        },
        {
          stage: "Dekhbhal",
          days: shortenFarmerLine(crop.durationDays, 32),
          activities: stageTipsFromPoints(
            crop.irrigationManagement.schedule,
            "Paani mitti dekh ke dein"
          ),
        },
        {
          stage: "Kataai",
          days: shortenFarmerLine(crop.harvestAndYield.harvestingTime, 32),
          activities: stageTipsFromPoints(
            crop.harvestAndYield.maturitySigns,
            "Pakne ke nishaan dekh ke kaatein"
          ),
        },
      ];
    }
    return stages.slice(0, 6).map((s) => ({
      stage: shortenFarmerLine(s.title.split(/[—(]/)[0]?.trim() || s.title, 22),
      days: shortenFarmerLine(s.period, 28),
      activities: stageTipsFromPoints(s.keyPoints, s.title),
    }));
  }, [mgmt, crop, planStamp]);

  const reminders = useMemo(() => {
    const list: { color: string; text: string }[] = [];
    const fert = fertPlan?.schedule?.[0];
    if (fert) {
      list.push({
        color: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
        text: shortenFarmerLine(`Khad: ${fert.time} — ${fert.apply}`, 78),
      });
    } else if (crop.fertilizerSchedule.stageWise[0]) {
      list.push({
        color: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
        text: shortenFarmerLine(
          `Khad (${crop.fertilizerSchedule.stageWise[0].stage}): ${crop.fertilizerSchedule.stageWise[0].details[0]}`,
          78
        ),
      });
    }
    const pest = mgmt?.pestManagement?.[0];
    if (pest) {
      list.push({
        color: "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
        text: shortenFarmerLine(`Keet: ${pest.pestName} — field check karte rahein`, 78),
      });
    }
    if (crop.irrigationManagement.criticalStages[0]) {
      list.push({
        color: "border-sky-200 bg-sky-50 dark:border-sky-500/20 dark:bg-sky-500/10",
        text: shortenFarmerLine(
          `Paani zaroori: ${crop.irrigationManagement.criticalStages.slice(0, 2).join(", ")}`,
          78
        ),
      });
    }
    list.push({
      color: "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10",
      text: shortenFarmerLine(
        `Kataai: ${crop.harvestAndYield.harvestingTime}`,
        78
      ),
    });
    return list.slice(0, 4);
  }, [fertPlan, mgmt, crop, planStamp]);

  const downloadShortPlan = () => {
    const lines = [
      `Agriveda plan — ${crop.name}${hindi ? ` (${hindi})` : ""}`,
      `Season: ${SEASONS.find((s) => s.id === season)?.label ?? season}`,
      `Area: ${acres} acre`,
      "",
      "Kaam (stages):",
      ...scheduleRows.flatMap((r) => [
        `• ${r.stage} (${r.days})`,
        ...r.activities.map((a) => `  - ${a}`),
      ]),
      "",
      "Yaad rakhein:",
      ...reminders.map((r) => `• ${r.text}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${crop.slug}-plan.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Chhota plan download ✓");
  };

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

  const waterNeed = shortenFarmerLine(
    crop.irrigationManagement.waterRequirement ||
      mgmt?.irrigationSchedule?.[0] ||
      "Mitti dekh ke paani",
    40
  );

  const tabBody = () => {
    if (activeTab === "Overview") {
      return (
        <DarkCard className="xl:col-span-8" hover>
          <SectionHeader title={`${crop.name} — chhote kaam`} />
          <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
            {acres} acre · {SEASONS.find((s) => s.id === season)?.label} — sirf zaroori baatein
          </p>
          <ul className="mt-3 space-y-2">
            {scheduleRows.map((row) => (
              <li
                key={row.stage + row.days}
                className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-black text-[var(--av-accent)]">{row.stage}</p>
                  <p className="shrink-0 text-[10px] font-semibold text-[var(--av-text-muted)]">{row.days}</p>
                </div>
                <ul className="mt-1.5 space-y-0.5">
                  {row.activities.map((a) => (
                    <li key={a} className="text-xs leading-snug text-[var(--av-text-secondary)]">
                      • {a}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadShortPlan}
              className={`inline-flex items-center gap-1.5 ${AV.btnSecondarySm}`}
            >
              <Download className="h-3.5 w-3.5" />
              Save plan
            </button>
            <button
              type="button"
              onClick={() => {
                const text = [
                  `${crop.name} · ${acres} acre · ${season}`,
                  ...scheduleRows.map((r) => `${r.stage}: ${r.activities.join("; ")}`),
                ].join("\n");
                if (navigator.share) {
                  void navigator.share({ title: "Agriveda Crop Plan", text });
                } else {
                  void navigator.clipboard?.writeText(text);
                  showToast("Plan copy ✓");
                }
              }}
              className={`inline-flex items-center gap-1.5 ${AV.btnSecondarySm}`}
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
            <AppLink href={`/crops/${crop.slug}`} className={`inline-flex items-center ${AV.btnSecondarySm}`}>
              Full guide →
            </AppLink>
          </div>
        </DarkCard>
      );
    }

    if (activeTab === "Irrigation") {
      const lines = shortenFarmerLines(
        mgmt?.irrigationSchedule?.length
          ? mgmt.irrigationSchedule
          : [
              crop.irrigationManagement.waterRequirement,
              ...crop.irrigationManagement.criticalStages.map((c) => `Critical: ${c}`),
              ...crop.irrigationManagement.schedule,
            ],
        4,
        70
      );
      return (
        <DarkCard className="xl:col-span-12">
          <SectionHeader title={`Paani — ${crop.name}`} />
          <ul className="mt-3 space-y-2">
            {lines.map((line) => (
              <li
                key={line}
                className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5 text-sm font-medium text-[var(--av-text-primary)]"
              >
                {line}
              </li>
            ))}
          </ul>
        </DarkCard>
      );
    }

    if (activeTab === "Fertilizer") {
      const lines = shortenFarmerLines(
        fertPlan?.schedule?.length
          ? fertPlan.schedule.map((s) => `${s.time}: ${s.apply}`)
          : [
              ...crop.fertilizerSchedule.basalDose,
              ...crop.fertilizerSchedule.stageWise.flatMap((s) =>
                s.details.map((d) => `${s.stage}: ${d}`)
              ),
            ],
        5,
        75
      );
      return (
        <DarkCard className="xl:col-span-12">
          <SectionHeader title={`Khad — ${crop.name} (${acres} acre)`} />
          <ul className="mt-3 space-y-2">
            {lines.map((line) => (
              <li
                key={line}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 text-sm font-medium"
              >
                {line}
              </li>
            ))}
          </ul>
          {fertPlan?.bags?.length ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {fertPlan.bags.slice(0, 3).map((b) => (
                <div key={b.name} className="rounded-xl border border-[var(--av-border)] px-2 py-2 text-center">
                  <p className="text-[9px] text-[var(--av-text-muted)]">{shortenFarmerLine(b.name, 18)}</p>
                  <p className="text-sm font-black text-[var(--av-accent)]">{b.amount}</p>
                </div>
              ))}
            </div>
          ) : null}
        </DarkCard>
      );
    }

    if (activeTab === "Pest Control") {
      const pests = mgmt?.pestManagement?.slice(0, 4) ?? [];
      return (
        <DarkCard className="xl:col-span-12">
          <SectionHeader title={`Keet — ${crop.name}`} />
          {pests.length ? (
            <ul className="mt-3 space-y-2">
              {pests.map((p) => (
                <li key={p.pestName} className="rounded-xl border border-[var(--av-border)] px-3 py-2.5">
                  <p className="text-sm font-bold text-[var(--av-text-primary)]">
                    {shortenFarmerLine(p.pestName, 40)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                    {shortenFarmerLine(`${p.activeIngredient} — ${p.dose}`, 70)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">
                    Spray tab jab nuksaan dikhe / threshold cross ho
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-[var(--av-text-muted)]">
              {shortenFarmerLines(crop.cropProtection.majorPests, 3, 40).join(" · ") || "Crop guide dekhein"}
            </p>
          )}
        </DarkCard>
      );
    }

    if (activeTab === "Disease Control") {
      const diseases = mgmt?.diseaseManagement?.slice(0, 4) ?? [];
      return (
        <DarkCard className="xl:col-span-12">
          <SectionHeader title={`Rog — ${crop.name}`} />
          {diseases.length ? (
            <ul className="mt-3 space-y-2">
              {diseases.map((d) => (
                <li key={d.diseaseName} className="rounded-xl border border-[var(--av-border)] px-3 py-2.5">
                  <p className="text-sm font-bold">{shortenFarmerLine(d.diseaseName, 40)}</p>
                  <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                    {shortenFarmerLine(`${d.activeIngredient} — ${d.dose}`, 70)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-[var(--av-text-muted)]">
              {shortenFarmerLines(crop.cropProtection.majorDiseases, 3, 40).join(" · ") || "Crop guide dekhein"}
            </p>
          )}
        </DarkCard>
      );
    }

    if (activeTab === "Weed Control") {
      const weeds = mgmt?.weedManagement?.slice(0, 3) ?? [];
      const program = mgmt?.weedProgram;
      return (
        <DarkCard className="xl:col-span-12">
          <SectionHeader title={`Ghass / weed — ${crop.name}`} />
          {program?.criticalPeriod ? (
            <p className="mt-2 text-xs font-semibold text-[var(--av-accent)]">
              Pehle {shortenFarmerLine(program.criticalPeriod, 50)} saaf rakhein
            </p>
          ) : null}
          {weeds.length ? (
            <ul className="mt-3 space-y-2">
              {weeds.map((w) => (
                <li key={w.weedName} className="rounded-xl border border-[var(--av-border)] px-3 py-2.5">
                  <p className="text-sm font-bold">{shortenFarmerLine(w.weedName, 36)}</p>
                  <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                    {shortenFarmerLine(
                      `Dawai: ${w.postEmergenceHerbicide || w.preEmergenceHerbicide} · ${w.dose}`,
                      72
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {shortenFarmerLines(crop.cropProtection.weedManagement, 3, 70).map((w) => (
                <li
                  key={w}
                  className="rounded-xl border border-[var(--av-border)] px-3 py-2 text-sm text-[var(--av-text-secondary)]"
                >
                  {w}
                </li>
              ))}
            </ul>
          )}
        </DarkCard>
      );
    }

    return (
      <DarkCard className="xl:col-span-12">
        <SectionHeader title={`Kataai — ${crop.name}`} />
        <p className="mt-2 text-sm font-black text-[var(--av-accent)]">
          {shortenFarmerLine(crop.harvestAndYield.harvestingTime, 50)}
        </p>
        <p className="mt-1 text-xs text-[var(--av-text-muted)]">
          Paidawar: {shortenFarmerLine(crop.estimatedYield, 40)}
        </p>
        <ul className="mt-3 space-y-1.5">
          {shortenFarmerLines(
            [...crop.harvestAndYield.maturitySigns, ...crop.harvestAndYield.storageTips.slice(0, 2)],
            4,
            70
          ).map((m) => (
            <li
              key={m}
              className="rounded-xl border border-[var(--av-border)] px-3 py-2 text-sm text-[var(--av-text-secondary)]"
            >
              {m}
            </li>
          ))}
        </ul>
      </DarkCard>
    );
  };

  return (
    <div className="space-y-4">
      <DarkCard className="!bg-[var(--av-surface-muted)]/60">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={AV.label}>Select Crop</label>
            <select
              value={cropSlug}
              onChange={(e) => {
                const nextSlug = e.target.value;
                const nextCrop = crops.find((c) => c.slug === nextSlug) ?? crops[0];
                const seasons = getPlannerSeasonsForCrop(nextCrop.slug, nextCrop.suitableSeason);
                setCropSlug(nextSlug);
                setSeason(pickDefaultPlannerSeason(seasons));
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
            <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
              {crop.suitableSeason}
            </p>
          </div>
          <div>
            <label className={AV.label}>
              Select Season
              {allowedSeasons.length === 1 ? (
                <span className="ml-1 font-semibold text-[var(--av-accent)]">(auto)</span>
              ) : null}
            </label>
            <select
              value={season}
              onChange={(e) => {
                setSeason(e.target.value as PlannerSeasonId);
                setGenerated(false);
              }}
              disabled={allowedSeasons.length === 1}
              className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-80"
            >
              {seasonOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
              {allowedSeasons.length === 1
                ? `${crop.name} is fasal ke liye yahi season`
                : `${crop.name} ${allowedSeasons.length} seasons me ho sakti hai — choose karein`}
            </p>
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
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-xl border px-1.5 py-2 text-center text-[10px] font-bold leading-tight transition sm:text-xs",
                  activeTab === tab.id
                    ? "border-emerald-500/45 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)]"
                )}
              >
                {tab.label}
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
                  <h3 className="mt-3 text-sm font-bold text-[var(--av-text-primary)]">Short summary</h3>
                  <ul className="mt-2 space-y-2 text-xs">
                    {[
                      { icon: Calendar, label: "Din", value: shortenFarmerLine(crop.durationDays, 28) },
                      {
                        icon: Sprout,
                        label: "Season",
                        value: SEASONS.find((s) => s.id === season)?.label ?? season,
                      },
                      { icon: Droplets, label: "Paani", value: waterNeed },
                      { icon: IndianRupee, label: "Paidawar", value: shortenFarmerLine(crop.estimatedYield, 28) },
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
                  <SectionHeader title="Yaad rakhein" />
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
