"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Sprout,
  Activity,
  Droplets,
  Stethoscope,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Leaf,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  CropGuideData,
  CropStageItem,
  PestAndDiseaseItem,
  ChemicalControlItem,
  TOMATO_CROP_GUIDE,
} from "@/lib/crops/cropGuideData";
import { cn } from "@/lib/cn";

// ============================================================================
// 1. PEST CARD COMPONENT (Rendered inside Suraksha accordion)
// ============================================================================
interface PestCardProps {
  pest: PestAndDiseaseItem;
}

export function PestCard({ pest }: PestCardProps) {
  const isDisease = pest.category === "disease";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/75 px-4 py-3 dark:border-slate-800/80 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold",
              isDisease
                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
            )}
          >
            {isDisease ? "🍄" : "🐛"}
          </span>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              {pest.pest_name}
            </h4>
            {pest.scientific_name ? (
              <p className="text-[11px] italic text-slate-500 dark:text-slate-400">
                {pest.scientific_name}
              </p>
            ) : null}
          </div>
        </div>

        {pest.etl_threshold ? (
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
            ETL: {pest.etl_threshold}
          </span>
        ) : null}
      </div>

      {/* Pest Images Gallery (Horizontal Scroll) */}
      {pest.images && pest.images.length > 0 ? (
        <div className="border-b border-slate-100 bg-slate-900/5 px-4 py-3 dark:border-slate-800 dark:bg-black/20">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            लक्षण व कीट चित्र (Field Photos)
          </p>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {pest.images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-200 dark:border-slate-700/60 dark:bg-slate-800"
              >
                <Image
                  src={imgUrl}
                  alt={`${pest.pest_name} photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="180px"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Detailed Diagnostics & Solutions Body */}
      <div className="space-y-3.5 p-4 text-xs leading-relaxed">
        {/* A. Identification */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="mb-1 flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/15 text-[10px] text-blue-600 dark:text-blue-400">
              🔍
            </span>
            <span className="font-extrabold uppercase tracking-wide text-slate-800 dark:text-slate-200">
              पहचान (Identification):
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            {pest.identification_text}
          </p>
        </div>

        {/* B. Nature of Damage */}
        <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3 dark:border-rose-950/40 dark:bg-rose-950/20">
          <div className="mb-1 flex items-center gap-1.5 font-bold text-rose-900 dark:text-rose-200">
            <AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
            <span className="font-extrabold uppercase tracking-wide">
              क्षति का स्वरूप (Nature of Damage):
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            {pest.damage_nature}
          </p>
        </div>

        {/* C. Organic Control */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 dark:border-emerald-950/40 dark:bg-emerald-950/20">
          <div className="mb-1 flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
            <Leaf className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-extrabold uppercase tracking-wide">
              जैविक नियंत्रण (Organic & Biological Control):
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            {pest.organic_control}
          </p>
        </div>

        {/* D. Chemical Control (FRAC / IRAC Mapped) */}
        {pest.chemical_control && pest.chemical_control.length > 0 ? (
          <div className="rounded-xl border border-amber-200/70 bg-gradient-to-b from-amber-50/50 to-transparent p-3.5 dark:border-amber-900/40 dark:from-amber-950/20">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                <FlaskConical className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-extrabold uppercase tracking-wide">
                  रासायनिक नियंत्रण (Chemical Control & Technicals):
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                FRAC/IRAC रोटेशन
              </span>
            </div>

            <div className="space-y-2">
              {pest.chemical_control.map((chem: ChemicalControlItem, cIdx: number) => (
                <div
                  key={cIdx}
                  className="rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <p className="text-xs font-black text-slate-900 dark:text-slate-100">
                      {chem.chemical_name}
                    </p>
                    {chem.frac_irac_group ? (
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
                        {chem.frac_irac_group}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">मात्रा: </span>
                      <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{chem.dosage}</span> / {chem.per_volume || chem.volume}
                    </div>
                    {chem.waiting_period_days ? (
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">PHI: </span>
                        <span>{chem.waiting_period_days} दिन</span>
                      </div>
                    ) : null}
                  </div>

                  {chem.safety_note ? (
                    <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                      💡 {chem.safety_note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

// ============================================================================
// 2. REUSABLE STAGE ACCORDION COMPONENT
// ============================================================================
interface StageAccordionProps {
  stage: CropStageItem;
  defaultExpanded?: boolean;
}

export function StageAccordion({ stage, defaultExpanded = false }: StageAccordionProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const isSuraksha = stage.stage_id === "suraksha";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition duration-200 dark:border-slate-800 dark:bg-slate-900">
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-slate-50/75 dark:hover:bg-slate-850"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black shadow-xs",
              stage.stage_id === "shuruat"
                ? "bg-emerald-500 text-white"
                : stage.stage_id === "lagana"
                ? "bg-teal-500 text-white"
                : stage.stage_id === "dekhbhal"
                ? "bg-sky-500 text-white"
                : "bg-amber-500 text-white"
            )}
          >
            {stage.stage_id === "shuruat"
              ? "1"
              : stage.stage_id === "lagana"
              ? "2"
              : stage.stage_id === "dekhbhal"
              ? "3"
              : "4"}
          </span>
          <div>
            <h3 className="font-display text-sm font-black text-slate-900 dark:text-white sm:text-base">
              {stage.stage_name_hi}
            </h3>
            {stage.stage_period ? (
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {stage.stage_period}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSuraksha && stage.pests_and_diseases ? (
            <span className="hidden rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-600 sm:inline-block dark:text-rose-400">
              {stage.pests_and_diseases.length} मुख्य कीट/रोग
            </span>
          ) : null}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition dark:bg-slate-800 dark:text-slate-300">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        </div>
      </button>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/40 p-4 space-y-4 dark:border-slate-800 dark:bg-slate-950/30">
          {stage.summary ? (
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
              {stage.summary}
            </p>
          ) : null}

          {/* Key Parameters / Specifications Grid */}
          {stage.parameters && Object.keys(stage.parameters).length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Object.entries(stage.parameters).map(([key, val]) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200/70 bg-white p-2.5 text-xs shadow-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {key}
                  </p>
                  <p className="mt-0.5 font-bold text-slate-900 dark:text-white">
                    {val}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {/* Activities List */}
          {stage.activities && stage.activities.length > 0 ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="mb-2 text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                मुख्य कृषि कार्य (Key Operations):
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {stage.activities.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Advisories / Warnings */}
          {stage.advisories && stage.advisories.length > 0 ? (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="mb-2 text-[11px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                महत्वपूर्ण सलाह (Advisories):
              </p>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {stage.advisories.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Render Pest Cards inside Suraksha */}
          {isSuraksha && stage.pests_and_diseases && stage.pests_and_diseases.length > 0 ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  कीट व रोग निवारण (Pests & Diseases Solutions):
                </h4>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  तकनीकी दवा व जैविक उपचार
                </span>
              </div>
              <div className="space-y-3">
                {stage.pests_and_diseases.map((pest) => (
                  <PestCard key={pest.pest_id} pest={pest} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. STICKY BOTTOM CALL-TO-ACTION (KRISHI DOCTOR TELECONSULTATION BANNER)
// ============================================================================
interface StickyDoctorBannerProps {
  cropName: string;
}

export function StickyDoctorBanner({ cropName }: StickyDoctorBannerProps) {
  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 px-4 py-3 text-white shadow-[0_-8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md"
      aria-label="Krishi Doctor Teleconsultation"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-3 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-2 ring-emerald-300/40">
            <Stethoscope className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-black text-white sm:text-sm">
              {cropName} में कोई समस्या आई?
            </p>
            <p className="text-[11px] font-medium text-emerald-200">
              24x7 कृषि डॉक्टर से बात करें व तुरंत समाधान पाएं
            </p>
          </div>
        </div>

        <Link
          href="/ai-doctor"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-950/40 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-95"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>कृषि डॉक्टर से बात करें</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  );
}

// ============================================================================
// 4. MAIN CROP GUIDE SCREEN (Fasal Pustika Screen)
// ============================================================================
interface CropGuideScreenProps {
  cropSlug?: string;
}

export default function CropGuideScreen({ cropSlug = "tomato" }: CropGuideScreenProps) {
  const [guideData, setGuideData] = useState<CropGuideData>(TOMATO_CROP_GUIDE);
  const [loading, setLoading] = useState<boolean>(true);

  // Dynamic API Fetch with Fallback
  useEffect(() => {
    let isMounted = true;
    async function fetchCropGuide() {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/crops/${cropSlug}/guide`);
        if (res.ok) {
          const json = await res.json();
          if (json?.data && isMounted) {
            setGuideData(json.data);
          }
        }
      } catch (err) {
        console.warn("[CropGuide] Using fallback local dataset:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void fetchCropGuide();
    return () => {
      isMounted = false;
    };
  }, [cropSlug]);

  return (
    <div className="relative min-h-screen pb-28 pt-2">
      {/* Header Info */}
      <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-4 dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              <Layers className="h-3 w-3" />
              फसल पुस्तिका (Fasal Pustika)
            </span>
            <h2 className="mt-1 font-display text-lg font-black text-slate-900 dark:text-white sm:text-xl">
              {guideData.crop_name} ({guideData.crop_name_hi}) संपूर्ण फसल गाइड
            </h2>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
              4 मुख्य चरण: शुरुआत, लगाना, देखभाल, और सुरक्षा (FRAC/IRAC तकनीकी नियंत्रण सहित)
            </p>
          </div>
          <span className="text-3xl">🍅</span>
        </div>
      </div>

      {/* Accordion Stages List */}
      <div className="space-y-3">
        {guideData.stages.map((stage, idx) => (
          <StageAccordion
            key={stage.stage_id}
            stage={stage}
            defaultExpanded={idx === 3} // Suraksha expanded by default for rapid preview
          />
        ))}
      </div>

      {/* Sticky Krishi Doctor Bottom CTA Banner */}
      <StickyDoctorBanner cropName={guideData.crop_name_hi || guideData.crop_name} />
    </div>
  );
}
