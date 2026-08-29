"use client";



import { Apple, Sparkles, StickyNote } from "lucide-react";

import DarkCard from "@/components/shell/DarkCard";

import SectionHeader from "@/components/shell/SectionHeader";

import { getCropManagementProfile } from "@/data/crop-management";

import { cropHarvestLabel, harvestActionForCrop } from "@/lib/crops/harvestLabel";

import { cropHarvestStages } from "@/lib/crops/harvestStages";

import { useLocale } from "@/components/i18n/LocaleProvider";

import type { Crop } from "@/types/crop";

import { useMemo } from "react";



/** Farmer Hindi yield — q/acre → क्विंटल/एकड़ */

function yieldHi(raw: string): string {

  return raw

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

  const supportOps =

    profile?.interculturalOperations?.filter((line) =>

      /सहारा|खूंट|बाढ़|staking|trellis|support|ट्रेलिस/i.test(line)

    ) ?? [];

  const profileHarvest = profile?.harvesting ?? [];

  const pickStages = cropHarvestStages(crop.slug, hi);

  const label = cropHarvestLabel(crop, hi);

  const action = harvestActionForCrop(crop);

  const maturityHint =

    action === "pick"

      ? hi

        ? "जब ये दिखें — तुड़ाई का समय नज़दीक"

        : "When you see these — time to pick"

      : action === "dig"

        ? hi

          ? "जब ये दिखें — खुदाई का समय नज़दीक"

          : "When you see these — time to dig"

        : hi

          ? "जब ये दिखें — कटाई का समय नज़दीक"

          : "When you see these — time to harvest";



  return (

    <div className="space-y-4">

      <DarkCard className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-500">

            <Apple className="h-6 w-6" />

          </div>

          <div>

            <p className="text-sm font-bold text-[var(--av-text-primary)]">

              {label} और उपज

            </p>

            <p className="text-xs text-[var(--av-text-muted)]">{h.harvestingTime}</p>

          </div>

        </div>

        <p className="mt-3 text-lg font-black text-emerald-600 dark:text-emerald-400">

          {yieldHi(h.yield)}

        </p>

      </DarkCard>



      {pickStages ? (

        <DarkCard>

          <SectionHeader title={hi ? `${label} की अवस्था` : `${label} stages`} />

          <p className="mt-1 text-xs text-[var(--av-text-muted)]">

            {hi ? "बाज़ार के हिसाब से चुनें" : "Choose by your market"}

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



      <DarkCard>

        <SectionHeader title={hi ? "पकने के लक्षण" : "Maturity signs"} />

        <p className="mt-1 text-xs text-[var(--av-text-muted)]">{maturityHint}</p>

        <ul className="mt-3 space-y-2">

          {h.maturitySigns.map((sign) => (

            <li key={sign} className="crop-premium-inset flex gap-2 text-xs text-[var(--av-text-primary)]">

              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />

              {sign}

            </li>

          ))}

        </ul>

      </DarkCard>



      {supportOps.length > 0 ? (

        <DarkCard>

          <div className="flex items-center gap-2">

            <StickyNote className="h-4 w-4 text-violet-500" />

            <SectionHeader title={hi ? "सहारा और बाढ़ (ज़रूरत हो तो)" : "Staking & support (if needed)"} />

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



      {profileHarvest.length > 0 ? (

        <DarkCard>

          <SectionHeader title={hi ? "खेत में ध्यान" : "Field care at harvest"} />

          <ul className="mt-3 space-y-2">

            {profileHarvest.map((line) => (

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

