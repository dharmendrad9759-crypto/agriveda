"use client";

import { useMemo, useState } from "react";
import {
  Apple,
  Shovel,
  Wheat,
  Scissors,
  Calendar,
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
  SunMedium,
  Warehouse,
  StickyNote,
} from "lucide-react";
import { GovtSchemeSparkleIcon } from "@/components/brand/icons";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { getCropManagementProfile } from "@/data/crop-management";
import { cropHarvestLabel, harvestActionForCrop } from "@/lib/crops/harvestLabel";
import { cropHarvestStages } from "@/lib/crops/harvestStages";
import { getCropHarvestProtocol } from "@/lib/crops/cropHarvestGuide";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Crop } from "@/types/crop";

/** Clean farmer Hindi yield — removes residual profit labels and normalizes units */
function yieldHi(raw: string): string {
  return raw
    .replace(/\(?(?:शुद्ध|अनुमानित)?\s*(?:मुनाफा|मुनाफ़ा|लागत)[^)]*\)?/gi, "")
    .replace(/\bq\/acre\b/gi, "क्विंटल/एकड़")
    .replace(/\bqtl\/acre\b/gi, "क्विंटल/एकड़")
    .replace(/\bquintal(s)?\s*\/\s*acre\b/gi, "क्विंटल/एकड़")
    .replace(/\bt\/ha\b/gi, "टन/हेक्टर")
    .replace(/\bton(nes)?\/ha\b/gi, "टन/हेक्टर")
    .replace(/\bkg\/acre\b/gi, "किलो/एकड़")
    .replace(/\bacre\b/gi, "एकड़")
    .replace(/\bha\b/gi, "हेक्टर")
    .replace(/\s+/g, " ")
    .trim();
}

export default function CropHarvestSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const h = crop.harvestAndYield;

  const profile = useMemo(() => getCropManagementProfile(crop.slug), [crop.slug]);
  const protocol = useMemo(() => getCropHarvestProtocol(crop, hi), [crop, hi]);

  const supportOps =
    profile?.interculturalOperations?.filter((line) =>
      /सहारा|खूंट|बाढ़|staking|trellis|support|ट्रेलिस/i.test(line)
    ) ?? [];

  const pickStages = cropHarvestStages(crop.slug, hi);
  const label = cropHarvestLabel(crop, hi);
  const action = harvestActionForCrop(crop);

  // Default first step open
  const [openStepId, setOpenStepId] = useState<string>(protocol.steps[0]?.id || "");

  const toggleStep = (id: string) => {
    setOpenStepId((prev) => (prev === id ? "" : id));
  };

  // Select appropriate hero icon
  const HeroIcon = action === "dig" ? Shovel : action === "pick" ? Scissors : Wheat;

  return (
    <div className="space-y-4">
      {/* 1. HERO HARVEST & YIELD CARD */}
      <DarkCard className="border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/30">
              <HeroIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-bold text-[var(--av-text-primary)]">
                {crop.name} — {label} व पैदावार
              </p>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--av-text-muted)]">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span>{h.harvestingTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Yield Highlight Box */}
        <div className="mt-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <GovtSchemeSparkleIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{hi ? "औसत पैदावार (अनुमानित)" : "Estimated Average Yield"}</span>
            </span>
            <span className="text-xs text-[var(--av-text-muted)]">
              {hi ? "अच्छी देखरेख पर" : "With optimal care"}
            </span>
          </div>
          <p className="mt-1 text-xl font-black tracking-tight text-emerald-700 dark:text-emerald-300">
            {yieldHi(h.yield)}
          </p>
          <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">
            {hi
              ? `सही समय पर ${label} और सुरक्षित नमी से भरपूर वजन व उच्चतम मंडी भाव मिलता है।`
              : `Timely ${label.toLowerCase()} and controlled curing protects produce weight and fetches premium mandi rates.`}
          </p>
        </div>
      </DarkCard>

      {/* 2. FIELD HARVEST PROTOCOL ACCORDIONS */}
      <DarkCard className="space-y-3">
        <div className="border-b border-[var(--av-border-default)] pb-2.5">
          <SectionHeader
            title={hi ? protocol.leadTitleHi : protocol.leadTitleEn}
          />
          <p className="mt-1 text-xs text-[var(--av-text-muted)]">
            {hi ? "वैज्ञानिक व व्यावहारिक नियम — दाना सुरक्षित, मंडी में सबसे ऊंचा भाव" : "Actionable field protocols for maximum yield quality"}
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          {protocol.steps.map((step) => {
            const isOpen = openStepId === step.id;
            const points = hi ? step.pointsHi : step.pointsEn;
            const alertText = hi ? step.alertHi : step.alertEn;

            return (
              <div
                key={step.id}
                className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                  isOpen
                    ? "border-amber-500/35 bg-amber-500/[0.03] shadow-sm"
                    : "border-[var(--av-border-default)] bg-[var(--av-surface-soft)] hover:border-amber-500/20"
                }`}
              >
                {/* Header Toggle */}
                <button
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  className="flex w-full items-start justify-between gap-3 p-3 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                      {hi ? step.badgeHi : step.badgeEn}
                    </span>
                    <h3 className="mt-1 text-xs font-bold text-[var(--av-text-primary)]">
                      {hi ? step.titleHi : step.titleEn}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
                      {hi ? step.subtitleHi : step.subtitleEn}
                    </p>
                  </div>
                  <div
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--av-surface-muted)] text-[var(--av-text-muted)] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-amber-500" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {/* Collapsible Body */}
                {isOpen && (
                  <div className="border-t border-[var(--av-border-default)] px-3 pb-3 pt-2.5">
                    <ul className="space-y-2">
                      {points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[var(--av-text-primary)]">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>

                    {alertText && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-800 dark:text-amber-200">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span className="leading-snug">{alertText}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DarkCard>

      {/* 3. MARKET PICKING STAGES (For Tomato, Chilli, etc. if available) */}
      {pickStages ? (
        <DarkCard>
          <SectionHeader
            title={hi ? "बाज़ार के अनुसार तुड़ाई की अवस्था" : "Harvest Stage by Market Target"}
          />
          <p className="mt-1 text-xs text-[var(--av-text-muted)]">
            {hi ? "दूरी और बिक्री के उद्देश्य के अनुसार सही रंग चुनें" : "Select maturity stage based on transport distance"}
          </p>
          <ul className="mt-3 space-y-2">
            {pickStages.map((stage) => (
              <li key={stage} className="crop-premium-inset text-xs text-[var(--av-text-primary)]">
                {stage}
              </li>
            ))}
          </ul>
        </DarkCard>
      ) : null}

      {/* 4. STAKING & SUPPORT (If applicable) */}
      {supportOps.length > 0 ? (
        <DarkCard>
          <div className="flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-violet-500" />
            <SectionHeader title={hi ? "सहारा और बाढ़ (ज़रूरत हो तो)" : "Staking & Support (if needed)"} />
          </div>
          <ul className="mt-3 space-y-2">
            {supportOps.map((line) => (
              <li key={line} className="crop-premium-inset text-xs text-[var(--av-text-secondary)]">
                {line}
              </li>
            ))}
          </ul>
        </DarkCard>
      ) : null}
    </div>
  );
}
