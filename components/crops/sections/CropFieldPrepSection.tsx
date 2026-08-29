"use client";

import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { getCropManagementProfile } from "@/data/crop-management";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Crop } from "@/types/crop";
import { Droplets, LayoutGrid, Shovel, Sprout, Tractor } from "lucide-react";
import { useMemo } from "react";

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

export default function CropFieldPrepSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const profile = useMemo(() => getCropManagementProfile(crop.slug), [crop.slug]);
  const sow = crop.sowingGuide;
  const seedRate = sow.seedRate || crop.seedRate;
  const spacing = sow.spacing || crop.spacing;

  const landPrep =
    profile?.landPreparation?.length
      ? profile.landPreparation
      : [
          hi
            ? "खेत साफ करें, गहरी जुताई और पाटा लगाएँ।"
            : "Clear field, deep plough and level.",
        ];

  const nursery = profile?.nursery ?? [];
  const transplanting = profile?.transplanting ?? [];
  const hasNursery = nursery.length > 0;

  const mulchingDrip = [
    ...(profile?.interculturalOperations?.filter((line) =>
      /mulch|मल्च|drip|ड्रिप/i.test(line)
    ) ?? []),
    ...(crop.cropProtection?.weedManagement?.filter((line) =>
      /mulch|मल्च|drip|ड्रिप/i.test(line)
    ) ?? []),
  ];

  return (
    <div className="space-y-4">
      {hasNursery ? (
        <DarkCard>
          <div className="flex items-center gap-2">
            <Shovel className="h-4 w-4 text-amber-600" />
            <SectionHeader title={hi ? "नर्सरी प्रबंधन" : "Nursery management"} />
          </div>
          <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">
            {hi
              ? "नर्सरी में बीज लगाने से रोपाई तक (लगभग 25–30 दिन)"
              : "From nursery sowing to transplant (about 25–30 days)"}
          </p>
          {seedRate ? (
            <div className="mt-2 crop-premium-inset text-xs">
              <p className="font-bold text-[var(--av-text-muted)]">
                {hi ? "बीज की मात्रा" : "Seed rate"}
              </p>
              <p className="mt-0.5 text-[var(--av-text-primary)]">{seedRate}</p>
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
          {[
            ...(!hasNursery && seedRate
              ? [{ label: hi ? "बीज की मात्रा" : "Seed rate", value: seedRate }]
              : []),
            { label: hi ? "दूरी (पंक्ति × पौधा)" : "Spacing (R × P)", value: spacing },
            { label: hi ? "बीज उपचार" : "Seed treatment", value: sow.seedTreatment },
            { label: hi ? "बुवाई का तरीका" : "Sowing method", value: sow.sowingMethod },
            { label: hi ? "बुवाई का समय" : "Sowing time", value: sow.bestSowingTime },
          ]
            .filter((row) => row.value)
            .map((row) => (
              <div key={row.label} className="crop-premium-inset">
                <dt className="font-bold text-[var(--av-text-muted)]">{row.label}</dt>
                <dd className="mt-0.5 text-[var(--av-text-primary)]">{row.value}</dd>
              </div>
            ))}
        </dl>
      </DarkCard>

      {transplanting.length > 0 ? (
        <DarkCard>
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-emerald-600" />
            <SectionHeader title={hi ? "रोपाई का समय" : "Transplanting"} />
          </div>
          <ListBlock items={transplanting} />
        </DarkCard>
      ) : null}

      {mulchingDrip.length > 0 ? (
        <DarkCard>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-cyan-600" />
            <SectionHeader title={hi ? "मल्चिंग और ड्रिप (ज़रूरत हो तो)" : "Mulching & drip (if needed)"} />
          </div>
          <ListBlock items={mulchingDrip} />
        </DarkCard>
      ) : null}
    </div>
  );
}
