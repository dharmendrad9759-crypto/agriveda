"use client";

import AwdIrrigationCard from "@/components/crops/AwdIrrigationCard";
import IrrigationReminderButton from "@/components/crops/IrrigationReminderButton";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import {
  getCropIrrigationGuide,
  irrigationStagePhoto,
  irrigationStagePhotoFallback,
  type IrrigationStageGuide,
} from "@/lib/crops/cropIrrigationGuide";
import {
  farmerIrrigationHi,
  formatIrrigationPeriodHi,
  stripLeadingIndex,
} from "@/lib/crops/simplifyIrrigationHi";
import { getWaterPriorityPlan } from "@/lib/crops/waterPriorityRules";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { shortLocation } from "@/lib/weather/weatherUi";
import { cn } from "@/lib/cn";
import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

interface CropIrrigationSectionProps {
  crop: Crop;
  detail: EnrichedCropDetail;
  timingHint: string;
}

function StagePhoto({
  cropSlug,
  kind,
  alt,
}: {
  cropSlug: string;
  kind: IrrigationStageGuide["photoKind"];
  alt: string;
}) {
  const primary = irrigationStagePhoto(cropSlug, kind);
  const fallback = irrigationStagePhotoFallback(kind);
  const [src, setSrc] = useState(primary);

  return (
    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="56px"
        onError={() => {
          if (src !== fallback) setSrc(fallback);
        }}
      />
    </span>
  );
}

export default function CropIrrigationSection({ crop }: CropIrrigationSectionProps) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const [openStageIdx, setOpenStageIdx] = useState<number | null>(null);
  const { weather, loading: weatherLoading } = useLiveWeather();

  const hindi = getCropHindiName(crop.slug);
  const cropLabel = hi && hindi ? hindi : crop.name;
  const cropImg = resolveCropImage({ slug: crop.slug, name: crop.name, image: crop.image });
  const showAwd = crop.slug === "paddy" || crop.slug === "rice" || crop.slug === "dhaan";

  const guide = useMemo(
    () =>
      getCropIrrigationGuide(crop.slug, {
        criticalStages: crop.irrigationManagement.criticalStages,
        schedule: crop.irrigationManagement.schedule,
        waterRequirement: crop.irrigationManagement.waterRequirement,
      }),
    [crop]
  );

  const waterPriority = useMemo(() => getWaterPriorityPlan(crop.slug), [crop.slug]);

  const rainAlert = useMemo(() => {
    if (!weather?.dailyForecast?.length) return null;
    const next48 = weather.dailyForecast.slice(0, 2);
    const maxRain = Math.max(...next48.map((d) => d.rainChance), 0);
    if (next48.some((d) => d.rainChance >= 55) || maxRain >= 55) {
      return { postpone: true as const, chance: maxRain };
    }
    return { postpone: false as const, chance: maxRain };
  }, [weather]);

  const place = weather?.location ? shortLocation(weather.location) : "";
  const totalLine = `${hi ? farmerIrrigationHi(guide.irrigationsHi) : guide.irrigationsEn} · ${
    hi ? farmerIrrigationHi(guide.methodHi) : guide.methodEn
  }`;
  const principle = hi
    ? guide.principleHi
      ? farmerIrrigationHi(guide.principleHi)
      : ""
    : guide.principleEn ?? guide.principleHi ?? "";
  const warning = hi ? farmerIrrigationHi(guide.warningHi) : guide.warningEn;
  const soilRaw = hi
    ? guide.soilOrRegionHi
      ? farmerIrrigationHi(guide.soilOrRegionHi)
      : ""
    : guide.soilOrRegionEn ?? "";
  const soil = soilRaw && !totalLine.includes(soilRaw) ? soilRaw : "";
  const weatherBit =
    weatherLoading && !weather
      ? ""
      : rainAlert?.postpone
        ? hi
          ? "बारिश आ रही है · अभी पानी न दें"
          : "Rain coming · hold the water"
        : rainAlert && rainAlert.chance >= 35
          ? hi
            ? "हल्की बारिश हो सकती है · मिट्टी देखकर पानी दें"
            : "Light rain possible · check the soil"
          : weather
            ? hi
              ? "मौसम साफ"
              : "Sky is clear"
            : "";
  const weatherText = [place, weatherBit].filter(Boolean).join(" · ");

  return (
    <div className="space-y-3">
      <section className="overflow-hidden rounded-[1.35rem] border border-[#d5eadc] bg-[#f4fbf7] dark:border-white/10 dark:bg-[var(--av-surface)]">
        <div className="flex items-center gap-3 px-3.5 py-3">
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
            <Image src={cropImg} alt="" fill className="object-cover" sizes="56px" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-[18px] font-semibold leading-tight text-[var(--av-text-primary)]">
              {cropLabel}
            </h2>
            <p className="mt-0.5 text-[13px] font-medium text-[var(--av-text-secondary)]">{totalLine}</p>
            {soil ? (
              <p className="mt-0.5 text-[12px] text-[var(--av-text-muted)]">{soil}</p>
            ) : null}
          </div>
        </div>

        {weatherText ? (
          <AppLink
            href="/weather"
            className={cn(
              "flex items-center justify-between gap-3 border-t px-3.5 py-2.5 text-[13px] font-medium",
              rainAlert?.postpone
                ? "border-[#7a4510]/20 bg-[#7a4510] text-[#fff4df]"
                : "border-[#d5eadc] text-[var(--av-text-secondary)]"
            )}
          >
            <span className="min-w-0">{weatherText}</span>
            <span className="shrink-0 text-[12px] font-semibold">{hi ? "मौसम" : "Weather"}</span>
          </AppLink>
        ) : null}

        {principle ? (
          <p className="border-t border-[#d5eadc] px-3.5 py-2.5 text-[13px] font-medium leading-snug text-[var(--av-text-primary)]">
            {principle}
          </p>
        ) : null}
      </section>

      {warning ? (
        <p className="px-1 text-[13px] font-medium leading-snug text-[#7a4510] dark:text-[#e7c99a]">
          {warning}
        </p>
      ) : null}

      {showAwd ? <AwdIrrigationCard hi={hi} /> : null}

      <div className="overflow-hidden rounded-[1.35rem] border border-[#d5eadc] bg-[#f4fbf7] dark:border-white/10 dark:bg-[var(--av-surface)]">
        {guide.stages.map((stage, i) => {
          const isOpen = openStageIdx === i;
          const titleLabel = hi ? farmerIrrigationHi(stage.titleHi) : stage.titleEn;
          const periodLabel = hi ? formatIrrigationPeriodHi(stage.periodHi) : stage.periodEn;
          const waterRaw = hi ? stage.waterHi : stage.waterEn ?? stage.waterHi;
          const water = hi && waterRaw ? farmerIrrigationHi(waterRaw) : waterRaw;
          const badgeRaw = hi ? stage.badgeHi : stage.badgeEn;
          const badge =
            badgeRaw && !/महत्वपूर्ण|क्रिटिकल|critical/i.test(badgeRaw)
              ? hi
                ? farmerIrrigationHi(badgeRaw)
                : badgeRaw
              : "";
          const how = water || badge;
          const fieldIds = (hi ? stage.fieldIdHi : stage.fieldIdEn ?? stage.fieldIdHi) ?? [];
          const points = hi ? stage.pointsHi : stage.pointsEn;

          return (
            <div
              key={`${stage.titleHi}-${i}`}
              className={cn(i > 0 && "border-t border-[#d5eadc]")}
            >
              <button
                type="button"
                onClick={() => setOpenStageIdx(isOpen ? null : i)}
                className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
              >
                <span
                  className={cn(
                    "w-1 self-stretch rounded-full",
                    stage.critical ? "bg-[#7a4510]" : "bg-emerald-800/25"
                  )}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold leading-tight text-[var(--av-text-primary)]">
                    {titleLabel}
                  </span>
                  <span className="mt-0.5 block text-[12px] font-medium text-[var(--av-text-muted)]">
                    {[periodLabel, how].filter(Boolean).join(" · ")}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-[var(--av-text-muted)] transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              {isOpen ? (
                <div className="flex gap-3 px-3.5 pb-3">
                  <StagePhoto cropSlug={crop.slug} kind={stage.photoKind} alt={titleLabel} />
                  <div className="min-w-0 flex-1 space-y-1">
                    {points.map((p) => (
                      <p key={p} className="text-[13px] font-medium leading-snug text-[var(--av-text-secondary)]">
                        {hi ? farmerIrrigationHi(p) : p}
                      </p>
                    ))}
                    {fieldIds.map((p) => (
                      <p key={p} className="text-[13px] font-medium leading-snug text-[var(--av-text-secondary)]">
                        {hi ? farmerIrrigationHi(p) : p}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {waterPriority ? (
        <details className="rounded-[1.35rem] border border-[#d5eadc] bg-[#f4fbf7] px-3.5 py-3 dark:border-white/10 dark:bg-[var(--av-surface)]">
          <summary className="cursor-pointer text-[15px] font-semibold text-[var(--av-text-primary)]">
            {hi ? "पानी कम हो तो" : "If water is short"}
          </summary>
          <p className="mt-2 text-[13px] font-medium leading-snug text-[var(--av-text-secondary)]">
            <span className="font-semibold text-[var(--av-text-primary)]">{hi ? "एक बार · " : "Once · "}</span>
            {hi ? waterPriority.singleHi : waterPriority.singleEn}
          </p>
          <p className="mt-1.5 text-[13px] font-medium leading-snug text-[var(--av-text-secondary)]">
            <span className="font-semibold text-[var(--av-text-primary)]">{hi ? "दो बार · " : "Twice · "}</span>
            {hi ? waterPriority.twoHi : waterPriority.twoEn}
          </p>
        </details>
      ) : null}

      {guide.experiences && guide.experiences.length > 0 ? (
        <details className="rounded-[1.35rem] border border-[#d5eadc] bg-[#f4fbf7] px-3.5 py-3 dark:border-white/10 dark:bg-[var(--av-surface)]">
          <summary className="cursor-pointer text-[15px] font-semibold text-[var(--av-text-primary)]">
            {hi ? "खेत में ध्यान" : "In the field"}
          </summary>
          <div className="mt-2 space-y-2.5">
            {guide.experiences.map((ex) => (
              <div key={ex.titleHi}>
                <p className="text-[13px] font-semibold text-[var(--av-text-primary)]">
                  {hi ? farmerIrrigationHi(stripLeadingIndex(ex.titleHi)) : stripLeadingIndex(ex.titleEn)}
                </p>
                {(hi ? ex.pointsHi : ex.pointsEn).map((p) => (
                  <p key={p} className="mt-0.5 text-[13px] font-medium leading-snug text-[var(--av-text-secondary)]">
                    {hi ? farmerIrrigationHi(p) : p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </details>
      ) : null}

      <p className="px-1 text-[13px] font-medium leading-snug text-[var(--av-text-secondary)]">
        {hi ? guide.moistureHi : guide.moistureEn}
      </p>

      <IrrigationReminderButton
        cropSlug={crop.slug}
        cropLabel={cropLabel}
        hi={hi}
        rainHold={Boolean(rainAlert?.postpone)}
        badgeHints={guide.stages.flatMap((s) =>
          hi
            ? [s.badgeHi, s.waterHi ?? "", ...(s.fieldIdHi ?? []), ...s.pointsHi]
            : [s.badgeEn, s.waterEn ?? "", ...(s.fieldIdEn ?? []), ...s.pointsEn]
        )}
      />
    </div>
  );
}
