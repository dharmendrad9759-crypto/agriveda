"use client";

import DarkCard from "@/components/shell/DarkCard";
import AppLink from "@/components/ui/AppLink";
import { getCropManagementProfile } from "@/data/crop-management";
import {
  calculateFertilizerProducts,
  getFertilizerForCrop,
  haToAcre,
} from "@/data/knowledge/fertilizer-recommendations";
import { buildFertilizerPlan, type SoilTestLevels } from "@/lib/agriveda2/fertilizerEngine";
import { cn } from "@/lib/cn";
import {
  cropSupportsDripFertigation,
  filterDripMentions,
  withoutDripFertigationLines,
} from "@/lib/crops/dripFertigation";
import {
  bucketFertilizerTip,
  defaultOrganicTipsHi,
  fertilizerProductImage,
  foliarCardImage,
  organicTipImage,
  parseFertilizerApplyLine,
  toFoliarCards,
} from "@/lib/crops/fertilizerFarmerUi";
import { toFarmerFertilizerNotes, simplifyFertilizerNoteHi } from "@/lib/crops/simplifyFertilizerNoteHi";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { resolveCropImage } from "@/lib/crops/cropImages";
import {
  fertilizerBagLabel,
  fertilizerBagPurposeHi,
} from "@/data/agriveda2/fertilizer-data";
import { AV } from "@/lib/design/tokens";
import { useLocale } from "@/components/i18n/LocaleProvider";
import SoilTestInputs from "@/components/fertilizer/SoilTestInputs";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { Crop } from "@/types/crop";
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  Droplets,
  FileText,
  FlaskConical,
  Leaf,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

type SubTabId = "schedule" | "foliar" | "organic" | "calculator" | "notes";
type FertMode = "normal" | "drip";

const SUB_TABS: {
  id: SubTabId;
  label: string;
  labelHi: string;
  icon: typeof FlaskConical;
}[] = [
  { id: "schedule", label: "When to feed", labelHi: "खाद कब दें", icon: FlaskConical },
  { id: "foliar", label: "Leaf spray", labelHi: "पत्ती स्प्रे", icon: Droplets },
  { id: "organic", label: "Organic", labelHi: "जैविक विकल्प", icon: Leaf },
  { id: "calculator", label: "Bag count", labelHi: "बोरी हिसाब", icon: Calculator },
  { id: "notes", label: "Must-know", labelHi: "जरूरी बातें", icon: FileText },
];

function toDripSchedule(
  rows: { stage: number; time: string; apply: string }[],
  hi: boolean
): { stage: number; time: string; apply: string }[] {
  if (!rows.length) {
    return [
      {
        stage: 1,
        time: hi ? "रोपाई / बुवाई के बाद" : "After transplant / sowing",
        apply: hi
          ? "ड्रिप से हल्की NPK (19:19:19 या 20:20:20) — 2–3 kg/एकड़, सप्ताह में 2 बार"
          : "Start light NPK via drip (19:19:19 or 20:20:20) — 2–3 kg/acre, 2×/week",
      },
      {
        stage: 2,
        time: hi ? "वृद्धि अवस्था" : "Vegetative",
        apply: hi
          ? "यूरिया / कैल्शियम नाइट्रेट — कुल N का ~40% बाँटकर"
          : "Urea / Ca nitrate — ~40% of total N in splits",
      },
      {
        stage: 3,
        time: hi ? "फूल / फल" : "Flowering / fruiting",
        apply: hi
          ? "P–K बढ़ाएँ (0:52:34 / SOP) — सप्ताह में 2–3 छोटी खुराक"
          : "Raise P–K (0:52:34 / SOP) — 2–3 small weekly pulses",
      },
    ];
  }
  return rows.map((r, i) => ({
    ...r,
    apply: hi
      ? `${r.apply} · ड्रिप: कुल खुराक 4–6 छोटी खुराकों में बाँटें (हर 3–4 दिन)`
      : `${r.apply} · Drip: split this dose into 4–6 small pulses (every 3–4 days)`,
    time:
      i === 0
        ? hi
          ? `${r.time} (ड्रिप शुरू)`
          : `${r.time} (start drip)`
        : r.time,
  }));
}

function guideSourceLabel(raw: string | undefined): string {
  if (!raw) return "Agriveda crop guide · adjust to soil test";
  if (/verified/i.test(raw)) return "Agriveda verified guide (kg/acre)";
  return "Agriveda crop guide · adjust to soil test";
}

function nutrientTotal(detail: string): number | null {
  const m = detail.match(/total:\s*([\d.]+)/i) || detail.match(/^([\d.]+)/);
  return m ? Number(m[1]) : null;
}

function NutritionBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  const zone =
    pct >= 35 && pct <= 85 ? "safe" : pct < 35 ? "low" : "high";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-[var(--av-text-primary)]">{label}</span>
        <span className="text-[10px] font-semibold text-[var(--av-text-muted)]">
          {Math.round(value)} किग्रा/एकड़
          {zone === "safe" ? " · संतुलित" : zone === "low" ? " · कम" : " · ज़्यादा"}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--av-surface-inset)]">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function CropFertilizerSection({ crop }: { crop: Crop }) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>("schedule");
  const [fertMode, setFertMode] = useState<FertMode>("normal");
  const [acres, setAcres] = useState(1);
  const [soilTest, setSoilTest] = useState<SoilTestLevels>({});

  const hindi = getCropHindiName(crop.slug);
  const supportsDrip = cropSupportsDripFertigation(crop);
  const cropImg = resolveCropImage({ slug: crop.slug, name: crop.name, image: crop.image });

  useEffect(() => {
    if (!supportsDrip) setFertMode("normal");
  }, [supportsDrip, crop.slug]);

  const plan = useMemo(
    () => buildFertilizerPlan(crop.slug, acres, soilTest),
    [crop.slug, acres, soilTest]
  );
  const icar = useMemo(() => getFertilizerForCrop(crop.slug), [crop.slug]);
  const profile = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const dossierFertLines = profile?.fertilizerSchedule ?? [];
  const dossierMicros = profile?.micronutrients ?? [];
  const dossierPgr = profile?.dossierPgrNotes ?? [];

  const scheduleRows = useMemo(() => {
    if (plan?.schedule?.length) {
      return plan.schedule.map((s, i) => ({
        stage: i + 1,
        time: s.time,
        apply: s.apply,
      }));
    }
    if (dossierFertLines.length) {
      return dossierFertLines.map((apply, i) => ({
        stage: i + 1,
        time: hi ? `चरण ${i + 1}` : `Step ${i + 1}`,
        apply,
      }));
    }
    const basal = crop.fertilizerSchedule.basalDose.map((d, i) => ({
      stage: i + 1,
      time: hi ? "बुवाई के समय" : "Basal",
      apply: d,
    }));
    const stageWise = crop.fertilizerSchedule.stageWise.flatMap((st, si) =>
      st.details.map((d, di) => ({
        stage: basal.length + si + di + 1,
        time: st.stage,
        apply: d,
      }))
    );
    return [...basal, ...stageWise];
  }, [plan, crop.fertilizerSchedule, dossierFertLines, hi]);

  const scheduleForCrop = useMemo(
    () => withoutDripFertigationLines(scheduleRows, supportsDrip),
    [scheduleRows, supportsDrip]
  );

  const displaySchedule = useMemo(() => {
    if (supportsDrip && fertMode === "drip") {
      return toDripSchedule(scheduleForCrop, hi);
    }
    return scheduleForCrop;
  }, [fertMode, scheduleForCrop, hi, supportsDrip]);

  const foliarRows = useMemo(() => {
    const micros = crop.fertilizerSchedule.micronutrients ?? [];
    const sprays = crop.fertilizerSchedule.foliarSpray ?? [];
    const fromIcar = icar?.micronutrients ?? [];
    const fromPlan =
      plan?.nutrients.filter((n) => ["Zn", "Fe", "B", "Mg", "S", "Micro"].includes(n.nutrient)) ??
      [];

    const rows: { name: string; detail: string }[] = [];
    for (const m of dossierMicros) rows.push({ name: hi ? "सूक्ष्म खाद" : "Micronutrient", detail: m });
    for (const m of micros) rows.push({ name: hi ? "सूक्ष्म खाद" : "Micronutrient", detail: m });
    for (const s of sprays) rows.push({ name: hi ? "पत्ती स्प्रे" : "Foliar spray", detail: s });
    for (const m of fromIcar) rows.push({ name: hi ? "सूक्ष्म खाद" : "Guide micronutrient", detail: m });
    for (const n of fromPlan) rows.push({ name: n.nutrient, detail: n.detail });

    if (plan?.farmerTipHi) {
      rows.push({ name: hi ? "खेत सलाह" : "Field tip", detail: plan.farmerTipHi });
    }

    if (!rows.length) {
      rows.push({
        name: hi ? "मिट्टी जाँच" : "Soil test first",
        detail: hi
          ? `${hindi || crop.name}: जिंक/आयरन/बोरॉन सिर्फ कमी दिखे तो — 2–3 साल में मिट्टी जाँच कराएँ`
          : `${crop.name}: Zn/Fe/B foliar only if deficiency — soil test every 2–3 years`,
      });
    }
    const seen = new Set<string>();
    return rows.filter((r) => {
      if (seen.has(r.detail)) return false;
      seen.add(r.detail);
      return true;
    });
  }, [crop, icar, plan, dossierMicros, hi, hindi]);

  const foliarCards = useMemo(() => toFoliarCards(foliarRows, hi), [foliarRows, hi]);

  const organicRows = useMemo(() => {
    const rows: string[] = [];
    const entryNotes = icar?.notes ?? [];
    for (const n of entryNotes) {
      if (/FYM|compost|Rhizobium|PSB|organic|bio|गोबर|वर्मी|जीवामृत|नीम/i.test(n)) {
        rows.push(hi ? simplifyFertilizerNoteHi(n) : n);
      }
    }
    for (const n of plan?.nutrients ?? []) {
      if (/Rhizobium|PSB|FYM|organic|गोबर/i.test(n.nutrient + n.detail)) {
        const line = `${n.nutrient}: ${n.detail}`;
        rows.push(hi ? simplifyFertilizerNoteHi(line) : line);
      }
    }
    if (rows.length < 2 && hi) {
      rows.push(...defaultOrganicTipsHi(crop.slug));
    } else if (rows.length < 2) {
      rows.push("Farmyard manure / compost as basal — improves soil and nutrient use");
      rows.push("Avoid dumping excess urea on legumes — reduces nodulation");
    }
    const seen = new Set<string>();
    return rows.filter((r) => {
      const k = r.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [crop.slug, icar, plan, hi]);

  const npkAcre = useMemo(() => {
    const factorN = plan?.soilFactors.n ?? 1;
    const factorP = plan?.soilFactors.p ?? 1;
    const factorK = plan?.soilFactors.k ?? 1;
    if (icar) {
      return {
        n: Math.round(haToAcre(icar.n, 1) * factorN * 10) / 10,
        p: Math.round(haToAcre(icar.p2o5, 1) * factorP * 10) / 10,
        k: Math.round(haToAcre(icar.k2o, 1) * factorK * 10) / 10,
        source: guideSourceLabel(icar.source),
      };
    }
    const nRow = plan?.nutrients.find((x) => x.nutrient === "N");
    const pRow = plan?.nutrients.find((x) => x.nutrient === "P");
    const kRow = plan?.nutrients.find((x) => x.nutrient === "K");
    return {
      n: nRow ? nutrientTotal(nRow.detail) ?? 0 : 0,
      p: pRow ? nutrientTotal(pRow.detail) ?? 0 : 0,
      k: kRow ? nutrientTotal(kRow.detail) ?? 0 : 0,
      source: guideSourceLabel(plan?.source === "verified" ? "verified" : undefined),
    };
  }, [icar, plan]);

  const bags = useMemo(() => {
    if (plan?.bags?.length) return plan.bags;
    if (npkAcre.n || npkAcre.p || npkAcre.k) {
      const calc = calculateFertilizerProducts({
        n: npkAcre.n * 2.47,
        p2o5: npkAcre.p * 2.47,
        k2o: npkAcre.k * 2.47,
        acres,
      });
      return [
        { name: fertilizerBagLabel("Urea"), amount: `${calc.ureaKg} किग्रा` },
        { name: fertilizerBagLabel("DAP"), amount: `${calc.dapKg} किग्रा` },
        { name: fertilizerBagLabel("MOP"), amount: `${calc.mopKg} किग्रा` },
      ];
    }
    return [];
  }, [plan, npkAcre, acres]);

  const notes = useMemo(() => {
    const list: string[] = [];
    for (const n of dossierPgr) list.push(n);
    if (icar?.notes?.length) list.push(...icar.notes);
    if (plan?.guideNotes?.length) list.push(...plan.guideNotes);
    if (plan?.unitNote) list.push(plan.unitNote);
    if (plan?.soilAdjusted) list.push(plan.soilAdjustNote);
    list.push(
      hi
        ? "खुराक अपनी मिट्टी जाँच के हिसाब से बदलें। बोरी/डिब्बे पर लिखी बात ज़रूर पढ़ें।"
        : "Always adjust doses to your local soil test and product label."
    );
    list.push(
      hi
        ? "सारा यूरिया एक साथ न डालें — समयसारिणी के हिसाब से बाँटकर डालें।"
        : "Never apply all nitrogen at once — split as per schedule."
    );
    return toFarmerFertilizerNotes(filterDripMentions(list, supportsDrip), hi);
  }, [icar, plan, dossierPgr, hi, supportsDrip]);

  const tipGroups = useMemo(() => {
    const doList: string[] = [];
    const dontList: string[] = [];
    const extraList: string[] = [];
    for (const n of notes) {
      const b = bucketFertilizerTip(n);
      if (b === "dont") dontList.push(n);
      else if (b === "do") doList.push(n);
      else extraList.push(n);
    }
    return { doList, dontList, extraList };
  }, [notes]);

  const scheduleTip =
    plan?.farmerTipHi ??
    (hi
      ? "यूरिया एक साथ न डालें — हल्की निराई के बाद मिट्टी में मिलाएँ।"
      : "Do not dump all urea at once — mix into soil after light hoeing.");

  const npkMax = Math.max(npkAcre.n, npkAcre.p, npkAcre.k, 40) * 1.15;

  return (
    <div className="space-y-4">
      {/* Crop plan summary */}
      <section className="overflow-hidden rounded-2xl border border-emerald-600/20 bg-gradient-to-br from-emerald-50 via-lime-50/80 to-amber-50/60 shadow-[var(--av-shadow-sm)] dark:from-emerald-950/40 dark:via-emerald-900/20 dark:to-amber-950/20">
        <div className="flex gap-3 p-3.5 sm:p-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-emerald-600/15 bg-white/60 sm:h-24 sm:w-24">
            <Image
              src={cropImg}
              alt={hindi || crop.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-black leading-tight tracking-tight text-emerald-900 dark:text-emerald-100">
              {hi
                ? `${hindi || crop.name} की फसल योजना`
                : `${crop.name} crop plan`}
            </p>
            <dl className="mt-2 grid grid-cols-1 gap-1 text-[11px] sm:grid-cols-3 sm:gap-x-3">
              <div>
                <dt className="font-bold text-emerald-800/70 dark:text-emerald-200/70">
                  {hi ? "मौसम" : "Season"}
                </dt>
                <dd className="font-semibold text-[var(--av-text-primary)]">
                  {crop.suitableSeason}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-emerald-800/70 dark:text-emerald-200/70">
                  {hi ? "क्षेत्रफल" : "Area"}
                </dt>
                <dd className="font-semibold text-[var(--av-text-primary)]">
                  {acres} {hi ? "एकड़" : "acre"}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-emerald-800/70 dark:text-emerald-200/70">
                  {hi ? "अनुमानित पैदावार" : "Est. yield"}
                </dt>
                <dd className="font-semibold text-[var(--av-text-primary)]">
                  {crop.estimatedYield}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="border-t border-emerald-600/10 bg-white/40 px-3.5 py-2.5 dark:bg-black/20 sm:px-4">
          <AppLink
            href="/services/fertilizer-calculator"
            className={cn(AV.btnPrimarySm, "w-full justify-center sm:w-auto")}
          >
            <Calculator className="mr-1.5 inline h-3.5 w-3.5" />
            {hi ? "खाद कैलकुलेटर खोलें" : "Open fertilizer calculator"}
          </AppLink>
        </div>
      </section>

      {/* Sub-tabs */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl border px-1 py-2.5 text-center shadow-sm transition active:scale-[0.97]",
                active
                  ? "border-emerald-600/50 bg-emerald-600 text-white"
                  : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-primary)]"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  active ? "bg-white/20" : "bg-emerald-500/10"
                )}
              >
                <Icon
                  className={cn("h-4 w-4", active ? "text-white" : "text-emerald-700 dark:text-emerald-300")}
                />
              </span>
              <span
                className={cn(
                  "line-clamp-2 text-[9px] font-extrabold leading-tight sm:text-[10px]",
                  active ? "text-white" : "text-[var(--av-text-primary)]"
                )}
              >
                {hi ? tab.labelHi : tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {activeSubTab === "schedule" && (
        <DarkCard>
          {supportsDrip ? (
            <div className="mb-3 grid grid-cols-2 gap-2">
              {(
                [
                  { id: "drip" as const, label: t("fertDrip"), hint: t("fertDripHint") },
                  { id: "normal" as const, label: t("fertNormal"), hint: t("fertNormalHint") },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setFertMode(m.id)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left transition active:scale-[0.98]",
                    fertMode === m.id
                      ? "border-emerald-500/45 bg-emerald-500/10"
                      : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
                  )}
                >
                  <p className="text-xs font-extrabold text-[var(--av-text-primary)]">{m.label}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-[var(--av-text-muted)]">
                    {m.hint}
                  </p>
                </button>
              ))}
            </div>
          ) : null}

          <h3 className="text-sm font-black text-[var(--av-text-primary)]">
            {hi
              ? `खाद डालने का समय (प्रति ${acres} एकड़)`
              : `When to fertilize (per ${acres} acre)`}
          </h3>
          <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">
            {supportsDrip && fertMode === "drip"
              ? t("fertDripHint")
              : hi
                ? "चरण के हिसाब से बोरी / किलो — मिट्टी जाँच से मात्रा बदलें"
                : "Stage-wise bags / kg — adjust after soil test"}
          </p>

          {displaySchedule.length ? (
            <ol className="relative mt-4 space-y-0 pl-2">
              <span
                aria-hidden
                className="absolute bottom-3 left-[19px] top-3 w-0.5 bg-emerald-500/25"
              />
              {displaySchedule.map((row) => {
                const products = parseFertilizerApplyLine(
                  hi ? simplifyFertilizerNoteHi(row.apply) : row.apply
                );
                return (
                  <li key={`${fertMode}-${row.stage}-${row.time}`} className="relative pb-4 pl-10">
                    <span className="absolute left-1 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-black text-white shadow-sm">
                      {row.stage}
                    </span>
                    <div className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5">
                      <p className="text-xs font-extrabold text-emerald-800 dark:text-emerald-200">
                        {hi ? `चरण ${row.stage}: ` : `Step ${row.stage}: `}
                        {row.time}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {products.map((p) => (
                          <li key={`${p.name}-${p.dose}`} className="flex items-center gap-2.5">
                            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[var(--av-border)] bg-white">
                              <Image
                                src={fertilizerProductImage(p.name)}
                                alt={p.name}
                                fill
                                className="object-cover"
                                sizes="44px"
                              />
                            </span>
                            <span className="min-w-0 text-[12px] leading-snug text-[var(--av-text-secondary)]">
                              <span className="font-bold text-[var(--av-text-primary)]">
                                {p.name}
                              </span>
                              {p.dose ? (
                                <>
                                  {": "}
                                  {p.dose}
                                </>
                              ) : null}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-3 text-xs text-[var(--av-text-muted)]">
              {hi
                ? "इस फसल की विस्तृत समयसारिणी अभी ऐप में नहीं है। मिट्टी जाँच + स्थानीय सलाह लें। बोरी हिसाब टैब से अनुमान देखें।"
                : "No detailed schedule yet. Use soil test + local advice. See Bag count tab for an estimate."}
            </p>
          )}

          <div className="mt-1 rounded-xl border border-amber-500/25 bg-amber-500/8 px-3 py-2.5">
            <p className="text-[11px] font-semibold leading-snug text-amber-950 dark:text-amber-100">
              {hi ? "खेत टिप: " : "Field tip: "}
              {scheduleTip}
            </p>
          </div>
        </DarkCard>
      )}

      {activeSubTab === "foliar" && (
        <DarkCard>
          <h3 className="text-sm font-black text-[var(--av-text-primary)]">
            {hi ? "पत्तियों पर छिड़काव की सलाह" : "Leaf spray advice"}
          </h3>
          <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">
            {hi
              ? "सुबह या शाम · लगभग 150–200 लीटर पानी / एकड़"
              : "Morning or evening · about 150–200 L water / acre"}
          </p>
          <ul className="mt-3 space-y-2.5">
            {foliarCards.map((card, i) => (
              <li
                key={`${card.title}-${i}`}
                className="flex gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-2.5"
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-cyan-500/15 bg-white sm:h-[72px] sm:w-[72px]">
                  <Image
                    src={foliarCardImage(card.title, card.medicine)}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-[var(--av-text-primary)]">
                    {card.title}
                  </p>
                  <p className="mt-1 text-[12px] text-[var(--av-text-secondary)]">
                    <span className="font-bold">{hi ? "दवा: " : "Product: "}</span>
                    {card.medicine}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[var(--av-text-secondary)]">
                    <span className="font-bold">{hi ? "मात्रा: " : "Dose: "}</span>
                    {card.dose}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </DarkCard>
      )}

      {activeSubTab === "organic" && (
        <DarkCard>
          <h3 className="text-sm font-black text-[var(--av-text-primary)]">
            {hi ? "प्राकृतिक व जैविक विकल्प" : "Natural & organic options"}
          </h3>
          <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">
            {hi
              ? "रासायनिक खाद के साथ मिलाकर इस्तेमाल करें — सिर्फ एक पर निर्भर न रहें"
              : "Use with chemical fertilizer — do not rely on one alone"}
          </p>
          <ul className="mt-3 space-y-2.5">
            {organicRows.map((r) => (
              <li
                key={r}
                className="flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-[12px] leading-snug text-[var(--av-text-secondary)]"
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-emerald-500/15 bg-white">
                  <Image
                    src={organicTipImage(r)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </span>
                <span className="min-w-0 flex-1 pt-0.5">{r}</span>
              </li>
            ))}
          </ul>
        </DarkCard>
      )}

      {activeSubTab === "calculator" && (
        <div className="space-y-3">
          <DarkCard>
            <h3 className="text-sm font-black text-[var(--av-text-primary)]">
              {hi
                ? `${acres} एकड़ के लिए कुल खाद की बोरी (अनुमान)`
                : `Bag estimate for ${acres} acre`}
            </h3>
            <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-[var(--av-text-secondary)]">
              {hi ? "क्षेत्र (एकड़)" : "Area (acre)"}
              <input
                type="number"
                min={0.5}
                max={50}
                step={0.5}
                value={acres}
                onChange={(e) => setAcres(Math.max(0.5, Number(e.target.value) || 1))}
                className="w-20 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] px-2 py-1.5 text-sm font-bold"
              />
            </label>
            <SoilTestInputs className="mt-3" value={soilTest} onChange={setSoilTest} />
            {plan?.soilAdjusted ? (
              <p className="mt-2 text-[10px] font-semibold text-amber-800 dark:text-amber-200">
                {plan.soilAdjustNote}
              </p>
            ) : null}

            <ul className="mt-4 space-y-2">
              {bags.map((b) => (
                <li
                  key={b.name}
                  className="flex items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-2 pr-3"
                >
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-amber-500/20 bg-white">
                    <Image
                      src={fertilizerProductImage(b.name)}
                      alt={b.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-[var(--av-text-primary)]">{b.name}</p>
                    <p className="text-[10px] text-[var(--av-text-muted)]">
                      {fertilizerBagPurposeHi(b.name)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-black text-emerald-700 dark:text-emerald-300">
                    {b.amount}
                  </p>
                </li>
              ))}
            </ul>
            {!bags.length && (
              <p className="mt-2 text-xs text-[var(--av-text-muted)]">
                {hi
                  ? "पूरा कैलकुलेटर खोलकर मिट्टी जाँच के हिसाब से बोरी जानें।"
                  : "Open the full calculator for soil-test bag counts."}
              </p>
            )}
          </DarkCard>

          <DarkCard>
            <h3 className="text-sm font-black text-[var(--av-text-primary)]">
              {hi ? "संतुलित पोषण मीटर" : "Nutrition balance meter"}
            </h3>
            <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">
              {hi
                ? "किसान भाषा में: हरा = संतुलित ज़ोन (अनुमान)"
                : "Green zone ≈ balanced estimate"}
            </p>
            <div className="mt-3 space-y-3">
              <NutritionBar label={hi ? "नाइट्रोजन (यूरिया वाला)" : "Nitrogen (N)"} value={npkAcre.n * acres} max={npkMax * acres} color="#10b981" />
              <NutritionBar label={hi ? "फॉस्फोरस (डीएपी वाला)" : "Phosphorus (P)"} value={npkAcre.p * acres} max={npkMax * acres} color="#3b82f6" />
              <NutritionBar label={hi ? "पोटाश (एमओपी वाला)" : "Potash (K)"} value={npkAcre.k * acres} max={npkMax * acres} color="#f59e0b" />
            </div>
          </DarkCard>
        </div>
      )}

      {activeSubTab === "notes" && (
        <div className="space-y-3">
          <DarkCard>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-black text-[var(--av-text-primary)]">
                {hi ? "क्या करें?" : "Do's"}
              </h3>
            </div>
            <ul className="mt-2 space-y-2">
              {(tipGroups.doList.length ? tipGroups.doList : notes.slice(0, 3)).map((n) => (
                <li
                  key={n}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[12px] leading-snug text-[var(--av-text-secondary)]"
                >
                  {n}
                </li>
              ))}
            </ul>
          </DarkCard>

          <DarkCard>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <h3 className="text-sm font-black text-[var(--av-text-primary)]">
                {hi ? "क्या न करें?" : "Don'ts"}
              </h3>
            </div>
            <ul className="mt-2 space-y-2">
              {(tipGroups.dontList.length
                ? tipGroups.dontList
                : [
                    hi
                      ? "सारा यूरिया एक साथ कभी न डालें — पौधा जल सकता है।"
                      : "Never apply all urea at once — crop may burn.",
                  ]
              ).map((n) => (
                <li
                  key={n}
                  className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-[12px] leading-snug text-[var(--av-text-secondary)]"
                >
                  {n}
                </li>
              ))}
            </ul>
          </DarkCard>

          {tipGroups.extraList.length ? (
            <DarkCard>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-black text-[var(--av-text-primary)]">
                  {hi ? "अतिरिक्त सुझाव" : "Extra tips"}
                </h3>
              </div>
              <ul className="mt-2 space-y-2">
                {tipGroups.extraList.map((n) => (
                  <li
                    key={n}
                    className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[12px] leading-snug text-[var(--av-text-secondary)]"
                  >
                    {n}
                  </li>
                ))}
              </ul>
            </DarkCard>
          ) : null}
        </div>
      )}
    </div>
  );
}
