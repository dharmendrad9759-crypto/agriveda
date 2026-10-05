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

function cropUsesNursery(crop: Crop): boolean {
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
      : (profile?.nursery ?? []).filter((line) => !GENERIC_NURSERY.test(line.trim()));

  const transplanting =
    guide?.transplanting?.length
      ? guide.transplanting
      : (profile?.transplanting ?? []).filter(Boolean);

  const hasNursery =
    Boolean(guide?.usesNursery) ||
    nursery.length > 0 ||
    cropUsesNursery(crop);

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
        <DarkCard>
          <button type="button" onClick={() => setTreatOpen(true)} className="w-full text-left">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-violet-600" />
              <SectionHeader title={hi ? "बीज उपचार" : "Seed treatment"} />
            </div>
            <ListBlock items={seedTreatmentLines} />
            <p className="mt-2 text-[13px] font-black text-emerald-800">
              {hi ? "कैसे करें" : "How to do it"}
            </p>
          </button>
        </DarkCard>
      ) : null}

      {hasNursery ? (
        <DarkCard>
          <div className="flex items-center gap-2">
            <Shovel className="h-4 w-4 text-amber-600" />
            <SectionHeader title={hi ? "नर्सरी" : "Nursery"} />
            {nurseryProcess ? (
              <button
                type="button"
                onClick={() => setNurseryOpen(true)}
                className="ml-auto min-h-9 rounded-full bg-amber-100 px-3 text-[13px] font-black text-amber-950"
              >
                {hi ? "प्रक्रिया" : "Steps"}
              </button>
            ) : null}
          </div>
          <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">
            {hi
              ? "नर्सरी में बीज से रोपाई तक"
              : "From nursery sowing to transplant"}
          </p>
          {seedRate ? (
            <div className="mt-2 crop-premium-inset text-xs">
              <p className="font-bold text-[var(--av-text-muted)]">
                {hi ? "बीज की मात्रा" : "Seed rate"}
              </p>
              <p className="mt-0.5 text-[var(--av-text-primary)]">{seedRate}</p>
              {seedRateNote ? (
                <p className="mt-1 text-[11px] leading-snug text-[var(--av-text-muted)]">
                  {seedRateNote}
                </p>
              ) : null}
            </div>
          ) : null}
          <ListBlock items={nursery} />
        </DarkCard>
      ) : null}

      <DarkCard>
        <div className="flex items-center gap-2">
          <Tractor className="h-4 w-4 text-emerald-600" />
          <SectionHeader title={hi ? "ज़मीन की तैयारी" : "Land preparation"} />
        </div>
        <ListBlock items={landPrep} />
      </DarkCard>

      <DarkCard>
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-sky-600" />
          <SectionHeader title={hi ? "खेत में दूरी और बुवाई" : "Field spacing & sowing"} />
        </div>
        <dl className="mt-3 space-y-2 text-xs">
          {spacing ? (
            <div className="crop-premium-inset">
              <dt className="font-bold text-[var(--av-text-muted)]">
                {hi ? "दूरी (पंक्ति × पौधा)" : "Spacing (R × P)"}
              </dt>
              <dd className="mt-0.5 text-[var(--av-text-primary)]">{spacing}</dd>
            </div>
          ) : null}
          {!hasNursery && seedRate ? (
            <div className="crop-premium-inset">
              <dt className="font-bold text-[var(--av-text-muted)]">
                {hi ? "बीज की मात्रा" : "Seed rate"}
              </dt>
              <dd className="mt-0.5 text-[var(--av-text-primary)]">{seedRate}</dd>
              {seedRateNote ? (
                <dd className="mt-1 text-[11px] leading-snug text-[var(--av-text-muted)]">
                  {seedRateNote}
                </dd>
              ) : null}
            </div>
          ) : null}
          {sowingTimeLines.length > 0 ? (
            <div className="crop-premium-inset">
              <dt className="font-bold text-[var(--av-text-muted)]">
                {hi ? "बुवाई / रोपाई का समय" : "Sowing / transplant time"}
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

      {transplanting.length > 0 ? (
        <DarkCard>
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-emerald-600" />
            <SectionHeader title={hi ? "रोपाई" : "Transplanting"} />
          </div>
          <ListBlock items={hi ? transplanting.map((line) => farmerSpeak(line)) : transplanting} />
        </DarkCard>
      ) : null}

      {mulchingDrip.length > 0 ? (
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
            <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40" role="presentation" onClick={() => setNurseryOpen(false)}>
              <div
                role="dialog"
                aria-modal="true"
                aria-label={hi ? "नर्सरी की प्रक्रिया" : "Nursery steps"}
                className="max-h-[86vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-[#fffaf3] px-4 pb-8 pt-3 shadow-2xl"
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
            <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40" role="presentation" onClick={() => setTreatOpen(false)}>
              <div
                role="dialog"
                aria-modal="true"
                aria-label={hi ? "बीज उपचार का तरीका" : "How to treat seed"}
                className="max-h-[86vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white px-4 pb-8 pt-3 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-emerald-900/15" />
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[18px] font-black text-[#0B3D28]">{hi ? "बीज का इलाज, आसान क्रम" : "Treat the seed, simply"}</h2>
                    <p className="mt-1 text-[14px] font-semibold leading-snug text-[#34584a]">
                      {hi ? "दवा एक साथ मत मिलाएँ। पहले फफूंद, सूखने दें, फिर कीट।" : "Do not mix both medicines together. Fungicide first, dry, then insecticide."}
                    </p>
                  </div>
                  <button type="button" onClick={() => setTreatOpen(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-50 text-[#0B3D28]" aria-label={hi ? "बंद करें" : "Close"}>
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
                  <li className="rounded-2xl bg-emerald-50 px-3 py-2.5">
                    <p className="text-[15px] font-black text-[#0B3D28]">{hi ? "कब बोएँ" : "When to sow"}</p>
                    <p className="mt-1 text-[14px] leading-snug text-[#34584a]">{hi ? "इलाज वाला बीज उसी दिन या अगली सुबह बो दें। कई दिन बंद डिब्बे में मत रखें।" : "Sow treated seed the same day or the next morning. Do not store it for many days."}</p>
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
