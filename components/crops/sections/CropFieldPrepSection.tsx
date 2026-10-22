"use client";

import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { getCropManagementProfile } from "@/data/crop-management";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropFieldPrepGuide, getNurseryProcess } from "@/lib/crops/cropFieldPrepGuide";
import { getPracticalSeedRate } from "@/lib/crops/practicalSeedRates";
import { farmerSpeak } from "@/lib/crops/farmerSpeak";
import type { Crop } from "@/types/crop";
import { Droplets, LayoutGrid, Shield, Shovel, Sprout, Tractor, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const GENERIC_NURSERY = /स्थानीय सलाह के अनुसार नर्सरी तैयार करें/;
const DIRECT_SOWING_OR_NA = /प्रत्यक्ष|सीधी\s*बुवाई|सीधी\s*बोवाई|लागू\s*नहीं|आवश्यकता\s*नहीं|नर्सरी\s*नहीं|not\s*applicable|direct\s*sow/i;

const DIRECT_SOWN_CROPS = new Set([
  "moongfali",
  "groundnut",
  "wheat",
  "soybean",
  "maize",
  "cotton",
  "bajra",
  "mustard",
  "chana",
  "gram",
  "moong",
  "urad",
  "potato",
  "sugarcane",
]);

function cropUsesNursery(crop: Crop): boolean {
  if (DIRECT_SOWN_CROPS.has(crop.slug.toLowerCase())) return false;
  const text = [
    crop.sowingGuide.bestSowingTime,
    crop.sowingGuide.sowingMethod,
    crop.sowingGuide.seedRate,
    crop.seedRate,
  ].join(" ");
  return /नर्सरी|nursery|पौध\s*तैयार|seedling/i.test(text);
}

function farmerOpLine(line: string, hi: boolean): string {
  if (/Use timely interculture and mulching/i.test(line)) {
    return hi
      ? "समय पर निराई-गुड़ाई करें; ज़रूरत हो तो मल्चिंग करें।"
      : "Do timely weeding/hoeing; mulch if needed.";
  }
  return line;
}

function ListBlock({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-2 space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="crop-premium-inset text-xs leading-relaxed text-[var(--av-text-secondary)]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

const FUNGUS = /फफूंद|थिरम|कैप्टान|कार्बेन्डाजिम|मेटालैक्सिल|मैंको|ट्राइकोडर्मा|गर्म पानी|स्ट्रेप्टो|कार्बोक्सिन|स्मट/i;
const INSECT = /इमिडा|कीटनाशक|क्लोरपाइरी|थायोमेथ|थियोमेथ|रस चूसक|दीमक|लट|छेदक|फ्लाई/i;
const BIO = /राइजोबियम|ब्रैडी|कल्चर/i;

function seedTreatPlan(lines: string[]) {
  const order = lines.filter((line) => FUNGUS.test(line) && INSECT.test(line));
  const fungus = lines.filter((line) => FUNGUS.test(line) && !INSECT.test(line) && !BIO.test(line));
  const insect = lines.filter((line) => INSECT.test(line) && !FUNGUS.test(line));
  const bio = lines.filter((line) => BIO.test(line) && !FUNGUS.test(line) && !INSECT.test(line));
  const used = new Set([...order, ...fungus, ...insect, ...bio]);
  const other = lines.filter((line) => !used.has(line));
  return { order, fungus, insect, bio, other };
}

export default function CropFieldPrepSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const guide = useMemo(() => getCropFieldPrepGuide(crop.slug), [crop.slug]);
  const profile = useMemo(() => getCropManagementProfile(crop.slug), [crop.slug]);
  const sow = crop.sowingGuide;
  const practicalSeed = useMemo(() => getPracticalSeedRate(crop.slug), [crop.slug]);
  const seedRate =
    practicalSeed?.labelHi || sow.seedRate || crop.seedRate;
  const seedRateNote = practicalSeed?.noteHi;
  const [treatOpen, setTreatOpen] = useState(false);
  const [nurseryOpen, setNurseryOpen] = useState(false);
  const [sheetReady, setSheetReady] = useState(false);

  useEffect(() => setSheetReady(true), []);

  const landPrep =
    guide?.landPreparation?.length
      ? guide.landPreparation
      : profile?.landPreparation?.length
        ? profile.landPreparation
        : [
            hi
              ? "खेत साफ करें, गहरी जुताई और पाटा लगाएँ।"
              : "Clear field, deep plough and level.",
          ];

  const seedTreatmentLines =
    guide?.seedTreatment?.length
      ? guide.seedTreatment
      : sow.seedTreatment
        ? [sow.seedTreatment]
        : profile?.seedTreatment?.filter(Boolean) ?? [];

  const spacing = guide?.spacing || sow.spacing || crop.spacing;
  const sowingTimeLines =
    guide?.sowingTime?.length
      ? guide.sowingTime
      : sow.bestSowingTime
        ? [sow.bestSowingTime]
        : [];

  const nursery =
    guide?.nurseryNotes?.length
      ? guide.nurseryNotes
      : (profile?.nursery ?? []).filter(
          (line) => !GENERIC_NURSERY.test(line.trim()) && !DIRECT_SOWING_OR_NA.test(line.trim())
        );

  const transplanting =
    guide?.transplanting?.length
      ? guide.transplanting
      : (profile?.transplanting ?? []).filter(
          (line) => Boolean(line) && !DIRECT_SOWING_OR_NA.test(line.trim())
        );

  const isDirectSown =
    guide?.usesNursery === false ||
    DIRECT_SOWN_CROPS.has(crop.slug.toLowerCase());

  const hasNursery =
    !isDirectSown &&
    (Boolean(guide?.usesNursery) || nursery.length > 0 || cropUsesNursery(crop));

  const mulchingDrip = [
    ...(profile?.interculturalOperations?.filter((line) =>
      /mulch|मल्च|drip|ड्रिप/i.test(line)
    ) ?? []),
    ...(crop.cropProtection?.weedManagement?.filter((line) =>
      /mulch|मल्च|drip|ड्रिप/i.test(line)
    ) ?? []),
  ].map((line) => farmerOpLine(line, hi));

  const plan = seedTreatPlan(seedTreatmentLines);
  const nurseryProcess = getNurseryProcess(crop.slug);

  return (
    <div className="space-y-4">
      {seedTreatmentLines.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 via-[var(--av-surface)] to-[var(--av-surface)] p-4 shadow-sm dark:border-violet-400/20">
          <div className="flex items-center justify-between gap-2 border-b border-violet-500/15 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-violet-700 dark:text-violet-300">
                <Shield className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[15px] font-black text-[var(--av-text-primary)]">
                  {hi ? "बीज उपचार (Seed Treatment)" : "Seed Treatment"}
                </h3>
                <p className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                  {hi ? "बीज जनित रोगों व कीटों से 100% सुरक्षा" : "Protection against seed-borne pests & diseases"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3.5 space-y-2.5">
            {plan.fungus.length > 0 && (
              <div className="rounded-xl border border-violet-500/20 bg-violet-50/50 p-3 dark:bg-violet-950/20">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-black text-white">
                    {hi ? "चरण 1: फफूंदनाशक" : "Step 1: Fungicide"}
                  </span>
                  <span className="text-[11px] font-bold text-violet-800 dark:text-violet-300">
                    {hi ? "सड़न व गलन से बचाव" : "Against Rot & Blight"}
                  </span>
                </div>
                <div className="mt-1.5 space-y-1">
                  {plan.fungus.map((f, i) => (
                    <p key={i} className="text-[12px] font-bold text-[var(--av-text-primary)] leading-relaxed">
                      • {f}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {plan.insect.length > 0 && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-50/50 p-3 dark:bg-amber-950/20">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-md bg-amber-600 px-2 py-0.5 text-[10px] font-black text-white">
                    {hi ? "चरण 2: कीटनाशक" : "Step 2: Insecticide"}
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                    {hi ? "दीमक, लट व रस चूसक कीटों से सुरक्षा" : "Against Termites & Sucking Pests"}
                  </span>
                </div>
                <div className="mt-1.5 space-y-1">
                  {plan.insect.map((ins, i) => (
                    <p key={i} className="text-[12px] font-bold text-[var(--av-text-primary)] leading-relaxed">
                      • {ins}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {plan.bio.length > 0 && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-3 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white">
                    {hi ? "चरण 3: जैव संवर्धन" : "Step 3: Bio Culture"}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    {hi ? "राइजोबियम / PSB से जड़ों का विकास" : "Rhizobium / PSB for root vigor"}
                  </span>
                </div>
                <div className="mt-1.5 space-y-1">
                  {plan.bio.map((b, i) => (
                    <p key={i} className="text-[12px] font-bold text-[var(--av-text-primary)] leading-relaxed">
                      • {b}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {(plan.fungus.length > 0 || plan.insect.length > 0 || plan.bio.length > 0) &&
              (plan.order.length > 0 || plan.other.length > 0) && (
              <div className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3">
                <span className="inline-block rounded-md bg-slate-600 px-2 py-0.5 text-[10px] font-black text-white">
                  {hi ? "संयुक्त / अन्य उपचार" : "Combined / Other Treatment"}
                </span>
                <div className="mt-1.5 space-y-1">
                  {[...plan.order, ...plan.other].map((line, i) => (
                    <p key={i} className="text-[12px] font-bold text-[var(--av-text-primary)] leading-relaxed">
                      • {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {plan.fungus.length === 0 && plan.insect.length === 0 && plan.bio.length === 0 && (
              <div className="space-y-1.5">
                {seedTreatmentLines.map((line, i) => (
                  <div key={i} className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5 text-xs font-bold text-[var(--av-text-primary)]">
                    • {line}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setTreatOpen(true)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 py-2 text-xs font-black text-violet-800 dark:text-violet-300 hover:bg-violet-500/20 active:scale-[0.99] transition"
          >
            {hi ? "💡 बीज उपचार का सही क्रम व सावधानियां देखें →" : "View Step-by-Step Treatment Guide →"}
          </button>
        </section>
      ) : null}

      {hasNursery ? (
        <section className="overflow-hidden rounded-2xl border border-amber-600/30 bg-gradient-to-br from-amber-500/10 via-[var(--av-surface)] to-[var(--av-surface)] p-4 shadow-sm dark:border-amber-400/20">
          <div className="flex items-center justify-between gap-2 border-b border-amber-500/15 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300">
                <Sprout className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[15px] font-black text-[var(--av-text-primary)]">
                  {hi ? "पौधशाला (नर्सरी) प्रबंधन" : "Nursery Management"}
                </h3>
                <p className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                  {hi ? "स्वस्थ पौध से अधिक पैदावार की शुरुआत" : "From seedbed to transplant"}
                </p>
              </div>
            </div>
            {nurseryProcess ? (
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-black text-amber-800 dark:text-amber-200">
                {hi ? "विशेषज्ञ गाइड" : "Expert Guide"}
              </span>
            ) : null}
          </div>

          {/* Quick Metrics Grid */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
            {nurseryProcess?.areaHi ? (
              <div className="rounded-xl border border-amber-500/20 bg-amber-50/60 p-2.5 dark:bg-amber-950/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  {hi ? "नर्सरी क्षेत्रफल" : "Nursery Area"}
                </p>
                <p className="mt-0.5 text-[12px] font-black text-[var(--av-text-primary)]">
                  {nurseryProcess.areaHi}
                </p>
              </div>
            ) : null}

            {seedRate ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/60 p-2.5 dark:bg-emerald-950/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  {hi ? "बीज की मात्रा" : "Seed Rate"}
                </p>
                <p className="mt-0.5 text-[12px] font-black text-[var(--av-text-primary)]">
                  {seedRate}
                </p>
              </div>
            ) : null}
          </div>

          {seedRateNote ? (
            <p className="mt-2.5 rounded-xl border border-amber-500/20 bg-white/70 px-3 py-2 text-[11.5px] font-semibold leading-relaxed text-amber-950 dark:bg-black/25 dark:text-amber-200">
              💡 {seedRateNote}
            </p>
          ) : null}

          {/* Step-by-Step Nursery Preparation */}
          {nurseryProcess?.stepsHi?.length ? (
            <div className="mt-3.5 space-y-2">
              <p className="text-[12px] font-black text-[var(--av-text-primary)]">
                {hi ? "नर्सरी तैयार करने के मुख्य चरण:" : "Key Steps for Seedbed:"}
              </p>
              <ol className="space-y-1.5">
                {nurseryProcess.stepsHi.map((step, idx) => (
                  <li
                    key={step}
                    className="flex items-start gap-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5 text-xs font-semibold leading-relaxed text-[var(--av-text-secondary)]"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-600 text-[10.5px] font-black text-white">
                      {idx + 1}
                    </span>
                    <span className="min-w-0 flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <ListBlock items={nursery} />
          )}
        </section>
      ) : null}

      <DarkCard>
        <div className="flex items-center justify-between gap-2 border-b border-[var(--av-border)] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              <Tractor className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-[15px] font-black text-[var(--av-text-primary)]">
                {hi ? "खेत की तैयारी (क्रमवार चरण)" : "Land Preparation Steps"}
              </h3>
              <p className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                {hi ? "गहरी जुताई, पाटा व भुरभुरी मिट्टी" : "Ploughing, leveling & soil tilth"}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-black text-emerald-700 dark:text-emerald-300">
            {landPrep.length} {hi ? "चरण" : "Steps"}
          </span>
        </div>
        <div className="mt-3.5 space-y-2">
          {landPrep.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3 text-xs font-semibold leading-relaxed text-[var(--av-text-secondary)] shadow-2xs"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-[11px] font-black text-white shadow-xs">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-bold text-[var(--av-text-primary)] leading-snug">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DarkCard>

      <DarkCard>
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-sky-600" />
          <SectionHeader
            title={
              hasNursery
                ? (hi ? "खेत में दूरी और रोपाई" : "Field spacing & transplanting")
                : (hi ? "बीज दर व सीधी बुवाई" : "Seed rate & direct sowing")
            }
          />
        </div>
        <dl className="mt-3 space-y-2 text-xs">
          {!hasNursery && seedRate ? (
            <div className="crop-premium-inset border-l-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20">
              <dt className="font-extrabold text-emerald-900 dark:text-emerald-300">
                {hi ? "बीज की मात्रा (प्रति एकड़)" : "Seed rate (per acre)"}
              </dt>
              <dd className="mt-0.5 text-[13px] font-black text-[var(--av-text-primary)]">{seedRate}</dd>
              {seedRateNote ? (
                <dd className="mt-1 text-[11px] leading-snug text-[var(--av-text-muted)]">
                  {seedRateNote}
                </dd>
              ) : null}
            </div>
          ) : null}
          {spacing ? (
            <div className="crop-premium-inset">
              <dt className="font-bold text-[var(--av-text-muted)]">
                {hi ? "दूरी (पंक्ति × पौधा)" : "Spacing (R × P)"}
              </dt>
              <dd className="mt-0.5 text-[var(--av-text-primary)]">{spacing}</dd>
            </div>
          ) : null}
          {sowingTimeLines.length > 0 ? (
            <div className="crop-premium-inset">
              <dt className="font-bold text-[var(--av-text-muted)]">
                {hi ? (hasNursery ? "रोपाई का समय" : "बुवाई का समय") : "Sowing time"}
              </dt>
              <dd className="mt-1 space-y-1.5 text-[var(--av-text-primary)]">
                {sowingTimeLines.map((line) => (
                  <p key={line} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </dd>
            </div>
          ) : null}
          {!guide && sow.sowingMethod ? (
            <div className="crop-premium-inset">
              <dt className="font-bold text-[var(--av-text-muted)]">
                {hi ? "बुवाई का तरीका" : "Sowing method"}
              </dt>
              <dd className="mt-0.5 text-[var(--av-text-primary)]">{sow.sowingMethod}</dd>
            </div>
          ) : null}
        </dl>
      </DarkCard>

      {!isDirectSown && transplanting.length > 0 ? (
        <DarkCard>
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-emerald-600" />
            <SectionHeader title={hi ? "रोपाई" : "Transplanting"} />
          </div>
          <ListBlock items={hi ? transplanting.map((line) => farmerSpeak(line)) : transplanting} />
        </DarkCard>
      ) : null}

      {!isDirectSown && mulchingDrip.length > 0 ? (
        <DarkCard>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-cyan-600" />
            <SectionHeader
              title={hi ? "मल्चिंग और ड्रिप (ज़रूरत हो तो)" : "Mulching & drip (if needed)"}
            />
          </div>
          <ListBlock items={mulchingDrip} />
        </DarkCard>
      ) : null}

      {nurseryOpen && sheetReady && nurseryProcess
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm" role="presentation" onClick={() => setNurseryOpen(false)}>
              <div
                role="dialog"
                aria-modal="true"
                aria-label={hi ? "नर्सरी की प्रक्रिया" : "Nursery steps"}
                className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#fffaf3] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-amber-900/20" />
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[18px] font-black text-[#0B3D28]">{hi ? "नर्सरी कैसे बनाएँ" : "How to raise the nursery"}</h2>
                    <p className="mt-1 text-[14px] font-semibold leading-snug text-[#34584a]">
                      {hi ? "एक एकड़ मुख्य खेत के लिए" : "For one acre of the main field"}
                    </p>
                  </div>
                  <button type="button" onClick={() => setNurseryOpen(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-100 text-[#0B3D28]" aria-label={hi ? "बंद करें" : "Close"}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="rounded-2xl bg-amber-100 px-3 py-3">
                  <p className="text-[13px] font-black text-amber-950">{hi ? "जगह" : "Area"}</p>
                  <p className="mt-1 text-[16px] font-black leading-snug text-[#0B3D28]">{nurseryProcess.areaHi}</p>
                  <p className="mt-1 text-[12px] leading-snug text-[#6b5430]">{nurseryProcess.sourceHi}</p>
                </div>
                {seedRate ? (
                  <p className="mt-3 text-[14px] font-bold text-[#0B3D28]">
                    {hi ? "बीज: " : "Seed: "}
                    {seedRate}
                  </p>
                ) : null}
                <ol className="mt-3 space-y-2">
                  {nurseryProcess.stepsHi.map((step, index) => (
                    <li key={step} className="rounded-2xl border border-amber-900/10 bg-white px-3 py-2.5">
                      <p className="text-[15px] font-black text-[#0B3D28]">{index + 1}. {step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>,
            document.body
          )
        : null}

      {treatOpen && sheetReady
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm" role="presentation" onClick={() => setTreatOpen(false)}>
              <div
                role="dialog"
                aria-modal="true"
                aria-label={hi ? "बीज उपचार का तरीका" : "How to treat seed"}
                className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-3 flex items-start justify-between gap-3 border-b border-emerald-900/10 pb-3">
                  <div>
                    <h2 className="text-[18px] font-black text-[#0B3D28]">{hi ? "बीज उपचार का सही क्रम" : "Seed Treatment Order"}</h2>
                    <p className="mt-1 text-[13px] font-semibold leading-snug text-[#34584a]">
                      {hi ? "दवा एक साथ मत मिलाएँ। पहले फफूंद, सूखने दें, फिर कीट।" : "Do not mix both medicines together. Fungicide first, dry, then insecticide."}
                    </p>
                  </div>
                  <button type="button" onClick={() => setTreatOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-[#0B3D28] hover:bg-emerald-100 transition-colors" aria-label={hi ? "बंद करें" : "Close"}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <ol className="space-y-2.5">
                  {plan.order.map((line) => (
                    <li key={line} className="rounded-2xl bg-emerald-50 px-3 py-2.5 text-[14px] font-semibold leading-snug text-[#0B3D28]">
                      {line}
                    </li>
                  ))}
                  <li className="rounded-2xl border border-emerald-900/10 px-3 py-2.5">
                    <p className="text-[15px] font-black text-[#0B3D28]">{hi ? "1. बीज निकालें" : "1. Take the seed out"}</p>
                    <p className="mt-1 text-[14px] leading-snug text-[#34584a]">{hi ? "साफ, सूखा बीज एक बर्तन में डालें। टूटा और गीला बीज निकाल दें।" : "Put clean, dry seed in a pot. Remove broken or wet seed."}</p>
                  </li>
                  {plan.fungus.map((line) => (
                    <li key={line} className="rounded-2xl border border-emerald-900/10 px-3 py-2.5">
                      <p className="text-[15px] font-black text-[#0B3D28]">{hi ? "2. पहले फफूंद की दवा" : "2. Fungicide first"}</p>
                      <p className="mt-1 text-[14px] leading-snug text-[#0B3D28]">{line}</p>
                      <p className="mt-1 text-[14px] leading-snug text-[#34584a]">{hi ? "थोड़ा पानी छिड़ककर हाथ से धीरे मिलाएँ। हर दाने पर हल्की परत आ जाए। दाना गुच्छे में चिपक न जाए।" : "Sprinkle a little water and mix gently so each grain gets a light coat."}</p>
                    </li>
                  ))}
                  {plan.fungus.length > 0 && plan.insect.length > 0 ? (
                    <li className="rounded-2xl bg-amber-50 px-3 py-2.5">
                      <p className="text-[15px] font-black text-[#0B3D28]">{hi ? "बीच का समय" : "Wait between the two"}</p>
                      <p className="mt-1 text-[14px] font-semibold leading-snug text-[#0B3D28]">
                        {hi
                          ? "फफूंद की दवा के बाद बीज को छाँव में पतला बिछाकर सूखने दें। अक्सर करीब 2 घंटे। पूरी तरह सूखे बिना कीटनाशक मत डालें।"
                          : "After the fungicide, spread the seed in the shade until dry — often about 2 hours. Do not add insecticide while it is still wet."}
                      </p>
                      <p className="mt-1 text-[14px] leading-snug text-[#34584a]">{hi ? "धूप में मत सुखाएँ। दोनों दवा एक ही पानी में एक साथ मत घोलें।" : "Do not dry in the sun. Do not dissolve both medicines in the same water."}</p>
                    </li>
                  ) : null}
                  {plan.insect.map((line) => (
                    <li key={line} className="rounded-2xl border border-emerald-900/10 px-3 py-2.5">
                      <p className="text-[15px] font-black text-[#0B3D28]">{hi ? "3. फिर कीट की दवा" : "3. Then the insecticide"}</p>
                      <p className="mt-1 text-[14px] leading-snug text-[#0B3D28]">{line}</p>
                      <p className="mt-1 text-[14px] leading-snug text-[#34584a]">{hi ? "फिर से छाँव में सुखाएँ। करीब 2 घंटे। सूख जाए तो बो सकते हैं।" : "Dry again in the shade, about 2 hours, then sow."}</p>
                    </li>
                  ))}
                  {plan.bio.map((line) => (
                    <li key={line} className="rounded-2xl border border-emerald-900/10 px-3 py-2.5">
                      <p className="text-[15px] font-black text-[#0B3D28]">{hi ? "आखिर में गाँठ की दवा" : "Culture last"}</p>
                      <p className="mt-1 text-[14px] leading-snug text-[#0B3D28]">{line}</p>
                      <p className="mt-1 text-[14px] leading-snug text-[#34584a]">{hi ? "ऊपर वाली दोनों दवा पूरी सूख जाएँ, तब बुवाई से ठीक पहले लगाएँ। फफूंद की दवा के साथ मत मिलाएँ।" : "Wait until the chemical coats are dry. Put this on just before sowing."}</p>
                    </li>
                  ))}
                  {plan.other.map((line) => (
                    <li key={line} className="rounded-2xl border border-emerald-900/10 px-3 py-2.5">
                      <p className="text-[14px] leading-snug text-[#0B3D28]">{line}</p>
                    </li>
                  ))}
                  <li className="rounded-2xl bg-emerald-50 px-3.5 py-3">
                    <p className="text-[15px] font-black text-[#0B3D28]">{hi ? "कब बोएँ" : "When to sow"}</p>
                    <p className="mt-1 text-[14px] leading-snug text-[#34584a]">{hi ? "उपचारित बीज को उसी दिन या अगली सुबह बो दें। कई दिन बंद डिब्बे में मत रखें।" : "Sow treated seed the same day or the next morning. Do not store it for many days."}</p>
                  </li>
                </ol>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
