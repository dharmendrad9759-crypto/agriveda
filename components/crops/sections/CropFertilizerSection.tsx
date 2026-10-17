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
  withoutDripFertigationLines,
} from "@/lib/crops/dripFertigation";
import {
  defaultOrganicTipsHi,
  fertilizerProductImage,
  foliarCardImage,
  organicTipImage,
  parseFertilizerApplyLine,
  toFoliarCards,
} from "@/lib/crops/fertilizerFarmerUi";
import { simplifyFertilizerNoteHi } from "@/lib/crops/simplifyFertilizerNoteHi";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { resolveCropImage } from "@/lib/crops/cropImages";
import {
  fertilizerBagLabel,
  fertilizerBagPurposeHi,
  fertilizerPackKg,
  fertilizerPackHi,
} from "@/data/agriveda2/fertilizer-data";
import { useLocale } from "@/components/i18n/LocaleProvider";
import SoilTestInputs from "@/components/fertilizer/SoilTestInputs";
import CropFertilizerMixinPanel from "@/components/crops/sections/CropFertilizerMixinPanel";
import { getCropFertilizerMixinGuide } from "@/lib/crops/fertilizerMixinFieldGuide";
import {
  buildMixinFoliarCardsRich,
  buildMixinNotes,
  buildMixinOrganicCards,
} from "@/lib/crops/fertilizerMixinTabs";
import { simplifyMixinFarmerHi } from "@/lib/crops/simplifyMixinFarmerHi";
import { buildFertilizerSlipText, openWhatsAppWithText } from "@/lib/whatsappShare";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { Crop } from "@/types/crop";
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  FileText,
  FlaskConical,
  Leaf,
  Minus,
  Plus,
  Share2,
  Sparkles,
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
  { id: "calculator", label: "Bag count", labelHi: "कुल खाद", icon: Calculator },
  { id: "notes", label: "Must-know", labelHi: "जरूरी नियम", icon: FileText },
];

const PRESET_ACRES = [0.5, 1, 2, 3, 5];

/** Approximate government subsidized retail prices (INR) per standard pack */
const ESTIMATED_PRICES: Record<string, { price: number; perKg: number }> = {
  urea: { price: 266.5, perKg: 5.92 },
  dap: { price: 1350, perKg: 27 },
  mop: { price: 1700, perKg: 34 },
  ssp: { price: 450, perKg: 9 },
  gypsum: { price: 200, perKg: 4 },
  zinc: { price: 450, perKg: 45 },
  borax: { price: 120, perKg: 120 },
};

function getApproxProductCost(name: string, kg: number): number {
  const n = name.toLowerCase();
  if (n.includes("urea") || n.includes("यूरिया")) return Math.round(kg * ESTIMATED_PRICES.urea.perKg);
  if (n.includes("dap") || n.includes("डीएपी")) return Math.round(kg * ESTIMATED_PRICES.dap.perKg);
  if (n.includes("mop") || n.includes("पोटाश")) return Math.round(kg * ESTIMATED_PRICES.mop.perKg);
  if (n.includes("ssp") || n.includes("सिंगल सुपर")) return Math.round(kg * ESTIMATED_PRICES.ssp.perKg);
  if (n.includes("zinc") || n.includes("जिंक")) return Math.round(kg * ESTIMATED_PRICES.zinc.perKg);
  if (n.includes("borax") || n.includes("बोरॉन")) return Math.round(kg * ESTIMATED_PRICES.borax.perKg);
  if (n.includes("gypsum") || n.includes("जिप्सम")) return Math.round(kg * ESTIMATED_PRICES.gypsum.perKg);
  return Math.round(kg * 20);
}

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
          ? "ड्रिप से 19:19:19 — 2.5 kg/एकड़, सप्ताह में 2 बार चलाएँ"
          : "Start light NPK via drip (19:19:19) — 2.5 kg/acre, 2×/week",
      },
      {
        stage: 2,
        time: hi ? "शाखा / कल्ले फूटना" : "Vegetative Stage",
        apply: hi
          ? "यूरिया / 12:61:00 — जड़ों के विकास हेतु 3–4 दिन के अंतर पर"
          : "Urea / 12:61:00 for root vigor in weekly pulses",
      },
      {
        stage: 3,
        time: hi ? "फूल व फल विकास" : "Flowering & Fruiting",
        apply: hi
          ? "0:52:34 और 0:0:50 (पोटाश) — फल की चमक व वज़न बढ़ाने के लिए"
          : "0:52:34 and 0:0:50 for fruit size, weight, and luster",
      },
    ];
  }
  return rows.map((r, i) => ({
    ...r,
    apply: hi
      ? `${r.apply} · ड्रिप से: 3–4 दिन के अंतराल पर छोटी खुराकों में दें`
      : `${r.apply} · Via Drip: split dose every 3–4 days`,
    time: i === 0 ? (hi ? `${r.time} (ड्रिप शुरू)` : `${r.time} (start drip)`) : r.time,
  }));
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
  const zone = pct >= 35 && pct <= 85 ? "safe" : pct < 35 ? "low" : "high";
  return (
    <div className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]/60 p-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[12px] font-black text-[var(--av-text-primary)]">{label}</span>
        <span className="text-[11px] font-bold text-[var(--av-text-secondary)]">
          {Math.round(value)} किग्रा
          <span
            className={cn(
              "ml-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-black",
              zone === "safe"
                ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
                : zone === "low"
                  ? "bg-amber-500/15 text-amber-800 dark:text-amber-300"
                  : "bg-red-500/15 text-red-800 dark:text-red-300"
            )}
          >
            {zone === "safe" ? "संतुलित" : zone === "low" ? "कम" : "ज़्यादा"}
          </span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--av-border)]/60">
        <div
          className="h-full rounded-full transition-all duration-500"
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
  const [acresText, setAcresText] = useState("1");
  const [soilTest, setSoilTest] = useState<SoilTestLevels>({});

  /** Acreage with clean fallback */
  const acres = useMemo(() => {
    const n = Number.parseFloat(acresText);
    if (!Number.isFinite(n) || n <= 0) return 1;
    return Math.min(50, Math.max(0.25, n));
  }, [acresText]);

  const hindi = getCropHindiName(crop.slug);
  const supportsDrip = cropSupportsDripFertigation(crop);
  const cropImg = resolveCropImage({ slug: crop.slug, name: crop.name, image: crop.image });

  const mixinGuide = useMemo(
    () => getCropFertilizerMixinGuide(crop.slug),
    [crop.slug]
  );
  const mixinFoliar = useMemo(
    () => (mixinGuide ? buildMixinFoliarCardsRich(mixinGuide) : []),
    [mixinGuide]
  );
  const mixinOrganic = useMemo(
    () => (mixinGuide ? buildMixinOrganicCards(mixinGuide) : []),
    [mixinGuide]
  );
  const mixinNotes = useMemo(
    () => (mixinGuide ? buildMixinNotes(mixinGuide) : null),
    [mixinGuide]
  );

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
      };
    }
    const nRow = plan?.nutrients.find((x) => x.nutrient === "N");
    const pRow = plan?.nutrients.find((x) => x.nutrient === "P");
    const kRow = plan?.nutrients.find((x) => x.nutrient === "K");
    return {
      n: nRow ? nutrientTotal(nRow.detail) ?? 0 : 0,
      p: pRow ? nutrientTotal(pRow.detail) ?? 0 : 0,
      k: kRow ? nutrientTotal(kRow.detail) ?? 0 : 0,
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

  const totalEstimatedCost = useMemo(() => {
    let sum = 0;
    for (const b of bags) {
      const kg = parseFloat(b.amount) || 0;
      sum += getApproxProductCost(b.name, kg);
    }
    return sum;
  }, [bags]);

  const scheduleTip =
    plan?.farmerTipHi ??
    (hi
      ? "यूरिया एक साथ न डालें — पहली खुराक निराई के बाद हल्की नमी में दें।"
      : "Split urea doses — apply in moist soil after light hoeing.");

  const npkMax = Math.max(npkAcre.n, npkAcre.p, npkAcre.k, 40) * 1.15;

  const handleStepAcre = (delta: number) => {
    const next = Math.max(0.5, Math.min(50, Math.round((acres + delta) * 2) / 2));
    setAcresText(String(next));
  };

  return (
    <div className="space-y-4">
      {/* =========================================================================
          1. COMMAND CENTER HERO BANNER (Ultra-Premium Glassmorphic Header)
      ========================================================================= */}
      <section className="relative overflow-hidden rounded-[26px] border border-emerald-500/35 bg-gradient-to-br from-[#063321] via-[#042618] to-[#021810] p-4 text-white shadow-[0_20px_45px_-16px_rgba(4,45,28,0.7)] sm:p-5">
        {/* Glow ambient background effects */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-teal-400/15 blur-3xl"
        />

        <div className="relative z-10">
          {/* Top category badges */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-emerald-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              {hi ? "वैज्ञानिक खाद प्रबंधन (Fertilizer Plan)" : "Scientific Fertilizer Plan"}
            </span>
            <span className="rounded-full bg-white/15 border border-white/20 px-2.5 py-0.5 text-[10.5px] font-extrabold text-white/90 backdrop-blur-md">
              🏛️ ICAR मानक
            </span>
          </div>

          {/* Main Title & Crop Image */}
          <div className="mt-3.5 flex items-center gap-3.5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-400/30 bg-slate-900 shadow-md ring-2 ring-emerald-500/20 sm:h-24 sm:w-24">
              <Image
                src={cropImg}
                alt={hindi || crop.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 80px, 96px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-[20px] font-black leading-tight text-white tracking-tight sm:text-[23px]">
                {hindi || crop.name} खाद योजना
              </h1>
              <p className="mt-1 text-[12px] font-medium leading-snug text-emerald-100/85">
                {hi
                  ? "संतुलित खुराक, सटीक बोरी संख्या व अधिक पैदावार का वैज्ञानिक फॉर्मूला"
                  : "Balanced nutrients, exact bag counts & high yield fertilizer schedule"}
              </p>
            </div>
          </div>

          {/* 3 Quick-Metric Stat Pills */}
          <div className="mt-3.5 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/10 p-2 backdrop-blur-md text-center">
              <span className="block text-[10px] font-bold uppercase text-emerald-300">
                {hi ? "मौसम" : "Season"}
              </span>
              <span className="mt-0.5 block truncate text-[11.5px] font-black text-white">
                {crop.suitableSeason}
              </span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-2 backdrop-blur-md text-center">
              <span className="block text-[10px] font-bold uppercase text-emerald-300">
                {hi ? "पैदावार" : "Yield"}
              </span>
              <span className="mt-0.5 block truncate text-[11.5px] font-black text-white">
                {crop.estimatedYield}
              </span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-2 backdrop-blur-md text-center">
              <span className="block text-[10px] font-bold uppercase text-emerald-300">
                {hi ? "अनुमानित खर्च" : "Est. Cost"}
              </span>
              <span className="mt-0.5 block truncate text-[11.5px] font-black text-emerald-300">
                {totalEstimatedCost ? `~₹${totalEstimatedCost.toLocaleString()}` : "लागत जाँचें"}
              </span>
            </div>
          </div>

          {/* Interactive Acre Selector with Quick Pills & Stepper */}
          <div className="mt-4 rounded-2xl border border-white/15 bg-black/30 p-3 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-black tracking-wide text-white">
                🌾 {hi ? "क्षेत्रफल (एकड़):" : "Field Area (Acres):"}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStepAcre(-0.5)}
                  disabled={acres <= 0.5}
                  aria-label="Decrease acre"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-white/15 text-white transition active:scale-95 disabled:opacity-40"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-center gap-1 rounded-lg border border-emerald-400/40 bg-emerald-950/80 px-2.5 py-1 text-center font-black text-emerald-300 text-[13px]">
                  <span>{acres}</span>
                  <span className="text-[10px] font-bold text-white/70">{hi ? "एकड़" : "acre"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStepAcre(0.5)}
                  disabled={acres >= 50}
                  aria-label="Increase acre"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-white/15 text-white transition active:scale-95 disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Acre Chips */}
            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <span className="text-[10px] font-bold text-white/60 shrink-0">
                {hi ? "त्वरित चयन:" : "Quick pick:"}
              </span>
              {PRESET_ACRES.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAcresText(String(val))}
                  className={cn(
                    "shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold transition active:scale-95",
                    acres === val
                      ? "bg-emerald-500 text-white shadow-sm ring-1 ring-white"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  )}
                >
                  {val} {hi ? "एकड़" : "ac"}
                </button>
              ))}
            </div>
          </div>

          {/* Calculator Link Banner */}
          <div className="mt-3.5 pt-1">
            <AppLink
              href={`/services/fertilizer-calculator?crop=${encodeURIComponent(crop.slug)}&acres=${encodeURIComponent(String(acres))}`}
              className="flex w-full items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-500/20 px-3.5 py-2.5 text-[12.5px] font-black text-white shadow-sm transition hover:bg-emerald-500/30 active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-emerald-300" />
                <span>{hi ? "विस्तृत खाद व मिट्टी कैलकुलेटर खोलें" : "Open Advanced Fertilizer Calculator"}</span>
              </span>
              <ChevronRight className="h-4 w-4 text-emerald-300" />
            </AppLink>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SLEEK HORIZONTAL SUB-TAB SELECTOR
      ========================================================================= */}
      <div className="sticky top-2 z-20 flex gap-1.5 overflow-x-auto rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]/95 p-1.5 shadow-md backdrop-blur-md no-scrollbar">
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
                "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-black transition-all active:scale-95",
                active
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/20"
                  : "text-[var(--av-text-secondary)] hover:bg-emerald-500/10 hover:text-[var(--av-text-primary)]"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", active ? "text-white" : "text-emerald-600 dark:text-emerald-400")} />
              <span>{hi ? tab.labelHi : tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: SCHEDULE (खाद कब दें)
      ========================================================================= */}
      {activeSubTab === "schedule" && mixinGuide ? (
        <CropFertilizerMixinPanel guide={mixinGuide} acres={acres} />
      ) : null}

      {activeSubTab === "schedule" && !mixinGuide ? (
        <div className="space-y-3.5">
          {/* DAP + Zinc Warning Alert */}
          <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/10 p-3.5 shadow-sm dark:bg-amber-950/20">
            <div className="flex items-start gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white font-black text-xs shadow-xs">
                <AlertTriangle className="h-3.5 w-3.5" />
              </span>
              <div>
                <h4 className="text-[12.5px] font-black text-amber-950 dark:text-amber-100">
                  {hi ? "सुनहरा नियम: DAP / SSP के साथ जिंक सल्फेट कभी न मिलाएँ!" : "Golden Rule: Never mix DAP with Zinc!"}
                </h4>
                <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                  {hi
                    ? "डीएपी (फॉस्फोरस) और जिंक सल्फेट मिलकर अघुलनशील जिंक फॉस्फेट बनाते हैं जिससे दोनों बेकार हो जाते हैं। बुवाई पर DAP दें, और जिंक सल्फेट खेत तैयारी में अलग दें या पहली सिंचाई पर यूरिया के साथ दें।"
                    : "Mixing DAP and Zinc causes insoluble zinc phosphate, wasting both. Apply DAP at sowing, and Zinc separately during land prep or at 1st irrigation."}
                </p>
              </div>
            </div>
          </div>

          <DarkCard>
            {supportsDrip ? (
              <div className="mb-3.5 flex rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-1">
                {(
                  [
                    { id: "normal" as const, label: hi ? "🌾 साधारण / ज़मीन में" : "Soil Broadcast" },
                    { id: "drip" as const, label: hi ? "💧 ड्रिप फर्टीगेशन" : "Drip Fertigation" },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setFertMode(m.id)}
                    className={cn(
                      "flex-1 rounded-lg py-1.5 text-center text-[12px] font-black transition",
                      fertMode === m.id
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-[var(--av-text-secondary)] hover:text-[var(--av-text-primary)]"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-[14px] font-black text-[var(--av-text-primary)]">
                  {hi ? `खाद डालने का समय (${acres} एकड़ के लिए)` : `Fertilizer Schedule (${acres} Acre)`}
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-[var(--av-text-muted)]">
                  चरण अनुसार सही मात्रा · मिट्टी में पर्याप्त नमी होने पर ही खाद दें
                </p>
              </div>
            </div>

            {displaySchedule.length ? (
              <ol className="mt-3.5 space-y-3">
                {displaySchedule.map((row) => {
                  const products = parseFertilizerApplyLine(
                    hi ? simplifyFertilizerNoteHi(row.apply) : row.apply
                  );
                  return (
                    <li
                      key={`${fertMode}-${row.stage}-${row.time}`}
                      className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]/40 p-3.5 shadow-xs transition hover:border-emerald-500/30"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-[var(--av-border)]/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white text-[11px] font-black shadow-xs">
                            0{row.stage}
                          </span>
                          <span className="text-[13px] font-black text-[var(--av-text-primary)]">
                            {row.time}
                          </span>
                        </div>
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                          {hi ? `चरण ${row.stage}` : `Stage ${row.stage}`}
                        </span>
                      </div>

                      <ul className="mt-2.5 space-y-2">
                        {products.map((p) => (
                          <li
                            key={`${p.name}-${p.dose}`}
                            className="flex items-center gap-3 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] p-2 shadow-xs"
                          >
                            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[var(--av-border)] bg-white">
                              <Image
                                src={fertilizerProductImage(p.name)}
                                alt={p.name}
                                fill
                                className="object-cover"
                                sizes="44px"
                              />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[12.5px] font-black text-[var(--av-text-primary)]">
                                {p.name}
                              </p>
                              {p.dose ? (
                                <p className="text-[11.5px] font-black text-emerald-700 dark:text-emerald-300">
                                  {p.dose}
                                </p>
                              ) : null}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="mt-3 text-xs text-[var(--av-text-muted)]">
                {hi
                  ? "इस फसल की विस्तृत समयसारिणी अभी नहीं है। कुल खाद टैब से कुल आवश्यकता देखें।"
                  : "No schedule available. See Total Fertilizer tab for requirements."}
              </p>
            )}

            <div className="mt-3.5 flex items-start gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-[11.5px] font-semibold text-emerald-950 dark:text-emerald-100">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{scheduleTip}</span>
            </div>
          </DarkCard>
        </div>
      ) : null}

      {/* =========================================================================
          TAB 2: FOLIAR SPRAY (पत्ती स्प्रे)
      ========================================================================= */}
      {activeSubTab === "foliar" && (
        <div className="space-y-3.5">
          {/* Foliar Zinc Caution Alert */}
          <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/10 p-3.5 shadow-sm dark:bg-amber-950/20">
            <div className="flex items-start gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white font-black text-xs shadow-xs">
                <AlertTriangle className="h-3.5 w-3.5" />
              </span>
              <div>
                <h4 className="text-[12.5px] font-black text-amber-950 dark:text-amber-100">
                  {hi ? "स्प्रे सावधानी: पत्ती पर जिंक छिड़काव नियम" : "Foliar Zinc Caution"}
                </h4>
                <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                  {hi
                    ? "पत्तियों पर स्प्रे के लिए चिलेटेड जिंक (Zn EDTA 12%) सबसे सुरक्षित है (चूने की जरूरत नहीं)। यदि जिंक सल्फेट 21% छिड़कें तो 1 किग्रा दवा में 500 ग्राम बुझा चूना अवश्य मिलाएँ ताकि पत्तियाँ न झुलसें।"
                    : "Chelated Zinc (Zn EDTA 12%) is safest for foliar spray. If spraying ZnSO4 21%, always add 500g slaked lime per 1kg ZnSO4 to avoid leaf burning."}
                </p>
              </div>
            </div>
          </div>

          <DarkCard>
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-[14px] font-black text-[var(--av-text-primary)]">
                  {hi ? "पत्ती पर छिड़काव व सूक्ष्म पोषक (Foliar Sprays)" : "Leaf Spray & Micronutrients"}
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-[var(--av-text-muted)]">
                  💧 {hi ? "साफ़ पानी (150–200 L प्रति एकड़) · सुबह या शाम के समय स्प्रे करें" : "Clean water (150–200 L/acre) · Spray in morning or evening"}
                </p>
              </div>
            </div>

            {mixinFoliar.length ? (
              <ul className="mt-3.5 space-y-3">
                {mixinFoliar.map((card, i) => (
                  <li
                    key={`${card.stageHi}-${card.name}-${i}`}
                    className="rounded-2xl border border-cyan-500/30 bg-[var(--av-surface)] p-3.5 shadow-xs space-y-2.5 transition hover:border-cyan-500/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="inline-block rounded-md bg-cyan-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-900 dark:bg-cyan-950/60 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700">
                          {simplifyMixinFarmerHi(
                            `${card.stageHi}${card.timingHi ? ` · ${card.timingHi}` : ""}`
                          )}
                        </span>
                        <h4 className="mt-1 text-[13.5px] font-black text-[var(--av-text-primary)]">
                          {simplifyMixinFarmerHi(card.name)}
                        </h4>
                      </div>
                    </div>

                    {/* 3 Metric Pills */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/8 p-2">
                        <span className="block text-[9.5px] font-extrabold uppercase text-cyan-800 dark:text-cyan-300">
                          {hi ? "खुराक" : "Dose"}
                        </span>
                        <span className="mt-0.5 block text-[11.5px] font-black leading-tight text-cyan-950 dark:text-cyan-100">
                          {simplifyMixinFarmerHi(card.doseHi)}
                        </span>
                      </div>
                      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/8 p-2">
                        <span className="block text-[9.5px] font-extrabold uppercase text-cyan-800 dark:text-cyan-300">
                          {hi ? "पानी" : "Water"}
                        </span>
                        <span className="mt-0.5 block text-[11.5px] font-black leading-tight text-cyan-950 dark:text-cyan-100">
                          {card.waterHi ? simplifyMixinFarmerHi(card.waterHi) : "150–200 L"}
                        </span>
                      </div>
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-2">
                        <span className="block text-[9.5px] font-extrabold uppercase text-emerald-800 dark:text-emerald-300">
                          {hi ? "क्षेत्रफल" : "Area"}
                        </span>
                        <span className="mt-0.5 block text-[11.5px] font-black leading-tight text-emerald-950 dark:text-emerald-100">
                          {acres} {hi ? "एकड़" : "Acre"}
                        </span>
                      </div>
                    </div>

                    {card.brands?.length ? (
                      <p className="text-[10.5px] font-semibold text-[var(--av-text-muted)]">
                        दुकान में नाम: <span className="font-bold text-[var(--av-text-secondary)]">{card.brands.join(" · ")}</span>
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-3.5 space-y-3">
                {foliarCards.map((card, i) => (
                  <li
                    key={`${card.title}-${card.medicine}-${i}`}
                    className="rounded-2xl border border-emerald-600/20 bg-[var(--av-surface)] p-3.5 shadow-xs space-y-2.5 transition hover:border-emerald-500/40"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0 flex-1">
                        <span className="inline-block rounded-md bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200">
                          💧 {hi ? "पत्ती पर फोलियर स्प्रे" : "Foliar Spray"}
                        </span>
                        <h4 className="mt-1 text-[13.5px] font-black text-[var(--av-text-primary)]">
                          {card.title}
                        </h4>
                        <p className="mt-0.5 text-[12px] font-black text-emerald-700 dark:text-emerald-300">
                          {card.medicine}
                        </p>
                      </div>
                      <span className="relative h-13 w-13 shrink-0 overflow-hidden rounded-xl border border-emerald-600/15 bg-white">
                        <Image
                          src={foliarCardImage(card.title, card.medicine)}
                          alt={card.title}
                          fill
                          className="object-cover"
                          sizes="52px"
                        />
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-2">
                        <span className="block text-[9px] font-extrabold uppercase text-emerald-800 dark:text-emerald-300">
                          {hi ? "लीटर खुराक" : "Per Litre"}
                        </span>
                        <span className="mt-0.5 block text-[11px] font-black text-emerald-950 dark:text-emerald-100">
                          {card.dosePerL || "1–2 g/L"}
                        </span>
                      </div>
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-2">
                        <span className="block text-[9px] font-extrabold uppercase text-emerald-800 dark:text-emerald-300">
                          {hi ? "एकड़ खुराक" : "Acre Dose"}
                        </span>
                        <span className="mt-0.5 block text-[11px] font-black text-emerald-950 dark:text-emerald-100">
                          {card.dosePerAcre || card.dose}
                        </span>
                      </div>
                      <div className="rounded-xl border border-sky-500/20 bg-sky-500/8 p-2">
                        <span className="block text-[9px] font-extrabold uppercase text-sky-800 dark:text-sky-300">
                          {hi ? "पानी" : "Water"}
                        </span>
                        <span className="mt-0.5 block text-[11px] font-black text-sky-950 dark:text-sky-100">
                          {card.waterVolume || "150–200 L"}
                        </span>
                      </div>
                    </div>

                    {card.timing && (
                      <p className="text-[11px] font-semibold text-[var(--av-text-secondary)]">
                        ⏰ <span className="font-bold text-[var(--av-text-primary)]">समय: </span>{card.timing}
                      </p>
                    )}
                    {card.caution && (
                      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-2 text-[11px] font-semibold text-emerald-950 dark:text-emerald-100">
                        💡 <span className="font-bold">मिश्रण व प्रयोग सलाह: </span>{card.caution}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </DarkCard>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ORGANIC (जैविक विकल्प)
      ========================================================================= */}
      {activeSubTab === "organic" && (
        <div className="space-y-3.5">
          <DarkCard>
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-[14px] font-black text-[var(--av-text-primary)]">
                  {hi ? "जैविक व प्राकृतिक विकल्प" : "Organic Soil Conditioners"}
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-[var(--av-text-muted)]">
                  🌿 {hi ? "गोबर खाद · वर्मीकम्पोस्ट · ट्राइकोडर्मा · जीवामृत" : "FYM · Vermicompost · Trichoderma · Jeevamrut"}
                </p>
              </div>
            </div>

            {mixinOrganic.length ? (
              <ul className="mt-3.5 space-y-3">
                {mixinOrganic.map((card, i) => (
                  <li
                    key={`${card.name}-${card.stageHi}-${i}`}
                    className="flex gap-3.5 rounded-2xl border border-emerald-500/25 bg-[var(--av-surface)] p-3.5 shadow-xs transition hover:border-emerald-500/40"
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-emerald-500/20 bg-white">
                      <Image
                        src={organicTipImage(card.name)}
                        alt={card.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="rounded-md bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 text-[9.5px] font-black text-emerald-800 dark:text-emerald-300">
                        {simplifyMixinFarmerHi(card.stageHi)}
                      </span>
                      <h4 className="mt-1 text-[13px] font-black text-[var(--av-text-primary)]">
                        {simplifyMixinFarmerHi(card.name)}
                      </h4>
                      <p className="mt-0.5 text-[12px] font-black text-emerald-700 dark:text-emerald-300">
                        खुराक: {simplifyMixinFarmerHi(card.doseHi)}
                      </p>
                      {card.purposeHi ? (
                        <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">
                          💡 {simplifyMixinFarmerHi(card.purposeHi)}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-3.5 space-y-2.5">
                {organicRows.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-[12px] leading-snug text-[var(--av-text-secondary)]"
                  >
                    <span className="relative mt-0.5 h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-emerald-500/15 bg-white">
                      <Image
                        src={organicTipImage(r)}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </span>
                    <span className="min-w-0 flex-1 pt-0.5 font-medium">{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </DarkCard>
        </div>
      )}

      {/* =========================================================================
          TAB 4: BAG CALCULATOR (बोरी हिसाब व अनुमानित लागत)
      ========================================================================= */}
      {activeSubTab === "calculator" && (
        <div className="space-y-3.5">
          <DarkCard>
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-[14px] font-black text-[var(--av-text-primary)]">
                  {hi ? `कुल खाद व बोरी संख्या (${acres} एकड़)` : `Total Fertilizer Bags (${acres} Acre)`}
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-[var(--av-text-muted)]">
                  बाज़ार में उपलब्ध मानक पैक साइज़ (यूरिया 45 kg, DAP 50 kg, जिंक 10 kg)
                </p>
              </div>
            </div>

            {/* Stepper Inside Calculator Tab */}
            <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5">
              <span className="text-[12px] font-black text-[var(--av-text-primary)]">
                {hi ? "जमीन का रकबा बदलें:" : "Change Field Size:"}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStepAcre(-0.5)}
                  disabled={acres <= 0.5}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-primary)] active:scale-95 disabled:opacity-40"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[50px] text-center text-[13px] font-black text-emerald-700 dark:text-emerald-300">
                  {acres} {hi ? "एकड़" : "ac"}
                </span>
                <button
                  type="button"
                  onClick={() => handleStepAcre(0.5)}
                  disabled={acres >= 50}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-primary)] active:scale-95 disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Retail Product Cards List */}
            <ul className="mt-3.5 space-y-2.5">
              {bags.map((b) => {
                const kg = parseFloat(b.amount) || 0;
                const packText = fertilizerPackHi(b.name, kg);
                const cost = getApproxProductCost(b.name, kg);
                return (
                  <li
                    key={b.name}
                    className="flex items-center gap-3 rounded-2xl border border-emerald-600/20 bg-[var(--av-surface)] p-3 shadow-xs transition hover:border-emerald-500/40"
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-emerald-500/20 bg-white">
                      <Image
                        src={fertilizerProductImage(b.name)}
                        alt={b.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-[13px] font-black text-[var(--av-text-primary)]">
                          {b.name}
                        </h4>
                        <span className="text-[12px] font-black text-emerald-800 dark:text-emerald-300">
                          {b.amount}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11.5px] font-bold text-amber-900 dark:text-amber-200">
                        {packText || `${b.amount} कुल`}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[10.5px] font-semibold text-[var(--av-text-muted)]">
                        <span>{fertilizerBagPurposeHi(b.name)}</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          ~₹{cost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Total Estimated Budget Banner */}
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
              <div>
                <span className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                  {hi ? "कुल अनुमानित खाद बजट:" : "Total Fertilizer Budget:"}
                </span>
                <span className="text-[10px] text-[var(--av-text-muted)]">
                  (सरकारी सब्सिडी दर के आधार पर)
                </span>
              </div>
              <span className="text-[18px] font-black text-emerald-900 dark:text-emerald-100">
                ~₹{totalEstimatedCost.toLocaleString()}
              </span>
            </div>

            {/* WhatsApp Share Button */}
            {bags.length ? (
              <button
                type="button"
                onClick={() => {
                  openWhatsAppWithText(
                    buildFertilizerSlipText({
                      hi,
                      crop: hindi || crop.name,
                      acres,
                      bags,
                    })
                  );
                }}
                className="mt-3.5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-emerald-600 px-4 text-[13.5px] font-black text-white shadow-md shadow-emerald-900/20 transition active:scale-[0.98] hover:bg-emerald-700"
              >
                <Share2 className="h-4 w-4" />
                <span>{hi ? "खाद की पर्ची WhatsApp करें" : "Share Bag Slip on WhatsApp"}</span>
              </button>
            ) : null}

            {/* Soil Test Adjuster */}
            <div className="mt-4 pt-2 border-t border-[var(--av-border)]">
              <SoilTestInputs value={soilTest} onChange={setSoilTest} />
              {plan?.soilAdjusted ? (
                <p className="mt-2 text-[10.5px] font-semibold text-amber-800 dark:text-amber-200">
                  💡 {plan.soilAdjustNote}
                </p>
              ) : null}
            </div>
          </DarkCard>

          {/* Balanced Nutrition Meter */}
          <DarkCard>
            <h3 className="text-[14px] font-black text-[var(--av-text-primary)]">
              {hi ? "संतुलित N-P-K पोषण मीटर" : "NPK Nutrition Balance"}
            </h3>
            <p className="mt-0.5 text-[11px] font-medium text-[var(--av-text-muted)]">
              {hi ? "हरा = संतुलित पोषण ज़ोन · अधिक या कम होने पर फसल को नुकसान" : "Green = Optimal Balance Zone"}
            </p>
            <div className="mt-3.5 space-y-2.5">
              <NutritionBar
                label={hi ? "नाइट्रोजन (यूरिया)" : "Nitrogen (N)"}
                value={npkAcre.n * acres}
                max={npkMax * acres}
                color="#10b981"
              />
              <NutritionBar
                label={hi ? "फॉस्फोरस (डीएपी)" : "Phosphorus (P)"}
                value={npkAcre.p * acres}
                max={npkMax * acres}
                color="#3b82f6"
              />
              <NutritionBar
                label={hi ? "पोटाश (एमओपी)" : "Potash (K)"}
                value={npkAcre.k * acres}
                max={npkMax * acres}
                color="#f59e0b"
              />
            </div>
          </DarkCard>
        </div>
      )}

      {/* =========================================================================
          TAB 5: MUST-KNOW RULES (जरूरी नियम)
      ========================================================================= */}
      {activeSubTab === "notes" && (
        <div className="space-y-3.5">
          {/* Do's Card */}
          <DarkCard>
            <div className="flex items-center gap-2 pb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <h3 className="text-[14px] font-black text-[var(--av-text-primary)]">
                {hi ? "क्या करें (Do's)" : "Do's"}
              </h3>
            </div>
            <ul className="mt-2.5 space-y-2">
              {[
                hi ? "यूरिया को 2 से 3 बार में बाँटकर दें — पौधा अधिक ग्रहण करता है।" : "Split urea in 2-3 top dressings.",
                hi ? "जिंक व सूक्ष्म पोषक हमेशा पहली सिंचाई पर दें।" : "Apply zinc and micronutrients at 1st irrigation.",
                hi ? "खाद डालते समय खेत में पर्याप्त नमी होना अनिवार्य है।" : "Ensure optimal soil moisture during application.",
                hi ? "बुवाई से पहले बीज उपचार (FIR) अवश्य करें।" : "Complete FIR seed treatment before sowing.",
              ].map((n) => (
                <li
                  key={n}
                  className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-[12px] font-medium leading-relaxed text-[var(--av-text-secondary)]"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </DarkCard>

          {/* Don'ts Card */}
          <DarkCard>
            <div className="flex items-center gap-2 pb-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <h3 className="text-[14px] font-black text-[var(--av-text-primary)]">
                {hi ? "क्या न करें (Don'ts)" : "Don'ts"}
              </h3>
            </div>
            <ul className="mt-2.5 space-y-2">
              {[
                hi ? "DAP और जिंक सल्फेट को एक साथ कभी न मिलाएँ (दोनों अघुलनशील हो जाते हैं)।" : "Never mix DAP with Zinc Sulphate.",
                hi ? "सूखी मिट्टी में कभी भी यूरिया या डीएपी का छिड़काव न करें।" : "Never broadcast urea in dry soil without irrigation.",
                hi ? "सारा यूरिया एक साथ बुवाई पर न डालें — इससे पौधे जल सकते हैं।" : "Do not dump all nitrogen in basal dose.",
                hi ? "दलहनी फसलों में अतिरिक्त यूरिया न दें — इससे जड़ की गांठे खराब होती हैं।" : "Avoid excess urea on legumes.",
              ].map((n) => (
                <li
                  key={n}
                  className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-2.5 text-[12px] font-medium leading-relaxed text-[var(--av-text-secondary)]"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </DarkCard>

          {/* Mixing Rules Card */}
          <DarkCard>
            <div className="flex items-center gap-2 pb-1">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="text-[14px] font-black text-[var(--av-text-primary)]">
                {hi ? "टैंक-मिक्स व घोलने के नियम" : "Mixing & Safety Rules"}
              </h3>
            </div>
            <div className="mt-2.5 space-y-2 text-[11.5px] leading-relaxed text-[var(--av-text-secondary)]">
              <div className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5">
                <p className="font-bold text-[var(--av-text-primary)]">
                  1. WALES घोलने का क्रम:
                </p>
                <p className="mt-0.5">
                  पहले घुलनशील पाउडर (WP/WG) → फिर तरल (SC) → फिर EC → अंत में टॉनिक/चिपको मिलाएँ।
                </p>
              </div>
              <div className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5">
                <p className="font-bold text-[var(--av-text-primary)]">
                  2. फोलियर स्प्रे के लिए साफ़ पानी:
                </p>
                <p className="mt-0.5">
                  गंदला या क्षारीय पानी दवा की शक्ति कम कर देता है। हमेशा पीने योग्य साफ़ पानी का ही प्रयोग करें।
                </p>
              </div>
            </div>
          </DarkCard>
        </div>
      )}
    </div>
  );
}
