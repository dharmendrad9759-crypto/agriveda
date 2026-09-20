"use client";

import AwdIrrigationCard from "@/components/crops/AwdIrrigationCard";
import IrrigationReminderButton from "@/components/crops/IrrigationReminderButton";
import DarkCard from "@/components/shell/DarkCard";
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
  formatIrrigationSequenceHi,
  stripLeadingIndex,
} from "@/lib/crops/simplifyIrrigationHi";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";
import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";
import {
  AlertTriangle,
  CheckCircle2,
  CloudRain,
  Droplets,
  Eye,
  Grid2x2,
  Lightbulb,
  Sparkles,
} from "lucide-react";
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
    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-sky-500/15 bg-white sm:h-[72px] sm:w-[72px]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="72px"
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

  const rainAlert = useMemo(() => {
    if (!weather?.dailyForecast?.length) return null;
    const next48 = weather.dailyForecast.slice(0, 2);
    const maxRain = Math.max(...next48.map((d) => d.rainChance), 0);
    const rainy = next48.some((d) => d.rainChance >= 55);
    if (rainy || maxRain >= 55) {
      return {
        postpone: true as const,
        chance: maxRain,
        titleHi: "मौसम अलर्ट",
        titleEn: "Weather alert",
        bodyHi: `आपके क्षेत्र में अगले 48 घंटों में बारिश की संभावना (~${maxRain}%) है। सलाह: अभी सिंचाई टालें — पानी और बिजली दोनों बचाएँ।`,
        bodyEn: `Rain likely in the next 48 hours (~${maxRain}%). Advice: postpone irrigation — save water and power.`,
      };
    }
    if (maxRain >= 35) {
      return {
        postpone: false as const,
        chance: maxRain,
        titleHi: "मौसम ध्यान",
        titleEn: "Weather note",
        bodyHi: `अगले 2 दिन हल्की बारिश संभव (~${maxRain}%)। खेत की नमी देखकर ही पानी दें।`,
        bodyEn: `Light rain possible in 2 days (~${maxRain}%). Check soil moisture before irrigating.`,
      };
    }
    return {
      postpone: false as const,
      chance: maxRain,
      titleHi: "मौसम स्थिति",
      titleEn: "Weather status",
      bodyHi: `अगले 48 घंटों में तेज़ बारिश की संभावना कम (~${maxRain}%)। मिट्टी सूखी हो तो सिंचाई कर सकते हैं।`,
      bodyEn: `Heavy rain unlikely next 48h (~${maxRain}%). Irrigate if top soil is dry.`,
    };
  }, [weather]);

  const criticalCount = guide.stages.filter((s) => s.critical).length;

  return (
    <div className="space-y-3">
      {/* Hero */}
      <section className="overflow-hidden rounded-2xl border border-sky-800/25 bg-gradient-to-br from-sky-900 via-cyan-800 to-teal-800 text-white shadow-[var(--av-shadow-sm)]">
        <div className="flex gap-3 p-3.5 sm:p-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-cyan-100/80">
              {hi ? "सिंचाई · महत्वपूर्ण अवस्था गाइड" : "Irrigation · critical stage guide"}
            </p>
            <p className="mt-1 text-[17px] font-black leading-tight tracking-tight">
              {hi ? `${cropLabel} — पानी कब दें` : `${cropLabel} — when to water`}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {[
                {
                  label: hi ? "कुल सिंचाई" : "Total",
                  value: hi
                    ? farmerIrrigationHi(guide.irrigationsHi)
                    : guide.irrigationsEn,
                },
                {
                  label: hi ? "विधि" : "Method",
                  value: hi ? farmerIrrigationHi(guide.methodHi) : guide.methodEn,
                },
                {
                  label: hi ? "क्रिटिकल" : "Critical",
                  value: hi
                    ? `${criticalCount || guide.stages.length} महत्वपूर्ण अवस्था`
                    : `${criticalCount || guide.stages.length} stages`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-black/25 px-2 py-2 backdrop-blur-[2px]"
                >
                  <p className="text-[9px] font-bold text-white/70">{item.label}</p>
                  <p className="mt-0.5 line-clamp-3 text-[10px] font-extrabold leading-snug">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white/10 sm:h-28 sm:w-28">
            <Image
              src={cropImg}
              alt={cropLabel}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        </div>
      </section>

      {/* Weather */}
      <DarkCard
        className={cn(
          rainAlert?.postpone
            ? "border-amber-500/35 bg-amber-500/10"
            : "border-sky-500/25 bg-sky-500/8"
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex min-w-0 flex-1 gap-2.5">
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                rainAlert?.postpone
                  ? "bg-amber-500/20 text-amber-800 dark:text-amber-200"
                  : "bg-sky-500/15 text-sky-700 dark:text-sky-300"
              )}
            >
              <CloudRain className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-extrabold text-[var(--av-text-primary)]">
                {weatherLoading
                  ? hi
                    ? "मौसम लोड हो रहा है…"
                    : "Loading weather…"
                  : hi
                    ? rainAlert?.titleHi ?? "मौसम"
                    : rainAlert?.titleEn ?? "Weather"}
                {weather?.location ? (
                  <span className="ml-1 font-semibold text-[var(--av-text-muted)]">
                    · {weather.location}
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-[12px] font-semibold leading-snug text-[var(--av-text-secondary)]">
                {weatherLoading
                  ? hi
                    ? "लोकेशन से बारिश की सलाह जल्द दिखेगी।"
                    : "Rain advice will appear from your location."
                  : hi
                    ? rainAlert?.bodyHi
                    : rainAlert?.bodyEn}
                {!weatherLoading &&
                  !weather &&
                  (hi
                    ? "स्थान डालें — मौसम पेज से जीपीएस या शहर चुनें।"
                    : "Set location on Weather page (GPS or city).")}
              </p>
            </div>
          </div>
          <AppLink
            href="/weather"
            className={cn(AV.btnSecondarySm, "shrink-0 self-start")}
          >
            {hi ? "मौसम देखो" : "See weather"}
          </AppLink>
        </div>
      </DarkCard>

      {/* Principle + soil */}
      {(guide.principleHi || guide.soilOrRegionHi) && (
        <DarkCard className="border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-transparent">
          <div className="flex gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-700 dark:text-violet-300">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-extrabold text-violet-900 dark:text-violet-100">
                {hi ? "मुख्य सिद्धांत" : "Key principle"}
              </p>
              {guide.principleHi ? (
                <p className="mt-1 text-[12px] font-semibold leading-snug text-[var(--av-text-secondary)]">
                  {hi
                    ? farmerIrrigationHi(guide.principleHi)
                    : guide.principleEn ?? guide.principleHi}
                </p>
              ) : null}
              {(guide.soilOrRegionHi || guide.noteHi) && (
                <p className="mt-2 rounded-lg border border-violet-500/20 bg-white/50 px-2 py-1.5 text-[11px] font-bold leading-snug text-[var(--av-text-primary)] dark:bg-black/20">
                  {hi ? "मिट्टी / क्षेत्र: " : "Soil / region: "}
                  {hi
                    ? farmerIrrigationHi(guide.soilOrRegionHi ?? guide.noteHi)
                    : guide.soilOrRegionEn ?? guide.noteEn}
                </p>
              )}
            </div>
          </div>
        </DarkCard>
      )}

      {/* Quick facts */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            icon: Droplets,
            label: hi ? "कुल सिंचाई" : "Total irrigations",
            value: hi
              ? farmerIrrigationHi(guide.irrigationsHi)
              : guide.irrigationsEn,
          },
          {
            icon: Grid2x2,
            label: hi ? "विधि" : "Method",
            value: hi ? farmerIrrigationHi(guide.methodHi) : guide.methodEn,
          },
          {
            icon: AlertTriangle,
            label: hi ? "ध्यान" : "Note",
            value: hi ? farmerIrrigationHi(guide.noteHi) : guide.noteEn,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-2.5 py-2.5 text-center shadow-sm"
            >
              <Icon className="mx-auto h-4 w-4 text-sky-600" />
              <p className="mt-1 text-[9px] font-bold text-[var(--av-text-muted)]">{item.label}</p>
              <p className="mt-0.5 line-clamp-3 text-[11px] font-extrabold leading-snug text-[var(--av-text-primary)]">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Critical warning */}
      <DarkCard className="border-red-500/30 bg-red-500/8">
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-extrabold text-red-800 dark:text-red-200">
              {hi ? "सबसे ज़रूरी सावधानी" : "Most important caution"}
            </p>
            <p className="mt-1 text-[12px] font-semibold leading-snug text-[var(--av-text-secondary)]">
              {hi ? farmerIrrigationHi(guide.warningHi) : guide.warningEn}
            </p>
          </div>
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-red-500/20 bg-white">
            <Image
              src="/images/irrigation/drainage.webp"
              alt=""
              fill
              className="object-cover"
              sizes="64px"
            />
          </span>
        </div>
      </DarkCard>

      {showAwd ? <AwdIrrigationCard hi={hi} /> : null}

      {/* Timeline */}
      <DarkCard>
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-sky-600" />
          <h3 className="text-sm font-black text-[var(--av-text-primary)]">
            {hi ? "सिंचाई क्रम · महत्वपूर्ण अवस्था" : "Irrigation sequence · critical stages"}
          </h3>
        </div>
        <p className="mt-1 text-[11px] font-semibold text-[var(--av-text-muted)]">
          {hi
            ? "समय + खेत की पहचान + पानी का तरीका"
            : "Timing (DAS/DAT) + field ID + water method"}
        </p>

        <ol className="relative mt-4 space-y-0 pl-1">
          <span
            aria-hidden
            className="absolute bottom-4 left-[15px] top-4 w-0.5 bg-sky-500/25"
          />
          {guide.stages.map((stage, i) => {
            const fieldIds = hi
              ? stage.fieldIdHi
              : stage.fieldIdEn ?? stage.fieldIdHi;
            const waterRaw = hi ? stage.waterHi : stage.waterEn ?? stage.waterHi;
            const water = hi && waterRaw ? farmerIrrigationHi(waterRaw) : waterRaw;
            const seqLabel = hi
              ? formatIrrigationSequenceHi(stage.sequenceHi, i)
              : stage.sequenceHi
                ? `Irrigation ${stage.sequenceHi}`
                : null;
            const periodLabel = hi
              ? formatIrrigationPeriodHi(stage.periodHi)
              : stage.periodEn;
            const titleLabel = hi
              ? farmerIrrigationHi(stage.titleHi)
              : stage.titleEn;
            const badgeLabel = hi
              ? farmerIrrigationHi(stage.badgeHi)
              : stage.badgeEn;
            return (
              <li key={`${stage.titleHi}-${i}`} className="relative pb-4 pl-9">
                <span
                  className={cn(
                    "absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-black text-white shadow-sm",
                    stage.critical ? "bg-red-600" : "bg-sky-600"
                  )}
                >
                  {i + 1}
                </span>
                <div
                  className={cn(
                    "rounded-xl border p-2.5",
                    stage.critical
                      ? "border-red-500/30 bg-gradient-to-r from-red-500/10 to-[var(--av-surface-inset)]"
                      : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
                  )}
                >
                  <div className="flex gap-2.5">
                    <StagePhoto
                      cropSlug={crop.slug}
                      kind={stage.photoKind}
                      alt={titleLabel}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-1.5">
                        <div className="min-w-0">
                          {seqLabel ? (
                            <p className="text-[10px] font-bold tracking-wide text-sky-700 dark:text-sky-300">
                              {seqLabel}
                            </p>
                          ) : null}
                          <p className="text-[13px] font-extrabold leading-snug text-[var(--av-text-primary)]">
                            {titleLabel}
                          </p>
                          <p className="mt-0.5 text-[11px] font-bold text-[var(--av-text-muted)]">
                            {periodLabel}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            stage.critical
                              ? "bg-red-500/15 text-red-800 dark:text-red-200"
                              : "bg-sky-500/15 text-sky-800 dark:text-sky-200"
                          )}
                        >
                          {badgeLabel}
                        </span>
                      </div>

                      {stage.critical ? (
                        <span className="mt-1.5 inline-flex rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-extrabold text-red-700 dark:text-red-300">
                          {hi ? "सबसे महत्वपूर्ण समय" : "Most critical stage"}
                        </span>
                      ) : null}

                      {water ? (
                        <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-sky-500/10 px-2 py-1.5 text-[11px] font-bold leading-snug text-sky-900 dark:text-sky-100">
                          <Droplets className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {water}
                        </p>
                      ) : null}

                      {fieldIds && fieldIds.length > 0 ? (
                        <div className="mt-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2 py-1.5">
                          <p className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-200">
                            <Eye className="h-3 w-3" />
                            {hi ? "खेत में कैसे पहचानें" : "How to spot in field"}
                          </p>
                          <ul className="mt-1 space-y-1">
                            {fieldIds.map((p) => (
                              <li
                                key={p}
                                className="text-[11px] font-semibold leading-snug text-[var(--av-text-secondary)]"
                              >
                                • {hi ? farmerIrrigationHi(p) : p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <ul className="mt-2 space-y-1">
                        {(hi ? stage.pointsHi : stage.pointsEn).map((p) => (
                          <li
                            key={p}
                            className="flex items-start gap-1.5 text-[12px] font-semibold leading-snug text-[var(--av-text-secondary)]"
                          >
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600" />
                            {hi ? farmerIrrigationHi(p) : p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </DarkCard>

      {/* Field experience */}
      {guide.experiences && guide.experiences.length > 0 ? (
        <DarkCard className="border-amber-500/25 bg-amber-500/5">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-black text-[var(--av-text-primary)]">
              {hi ? "खेत का अनुभव · सावधानियां" : "Field experience · cautions"}
            </h3>
          </div>
          <div className="mt-3 space-y-2.5">
            {guide.experiences.map((ex, idx) => (
              <div
                key={ex.titleHi}
                className="rounded-xl border border-amber-500/20 bg-[var(--av-surface)] px-3 py-2.5"
              >
                <p className="text-[12px] font-extrabold text-amber-950 dark:text-amber-100">
                  {idx + 1}.{" "}
                  {hi
                    ? farmerIrrigationHi(stripLeadingIndex(ex.titleHi))
                    : stripLeadingIndex(ex.titleEn)}
                </p>
                <ul className="mt-1.5 space-y-1">
                  {(hi ? ex.pointsHi : ex.pointsEn).map((p) => (
                    <li
                      key={p}
                      className="text-[11px] font-semibold leading-snug text-[var(--av-text-secondary)]"
                    >
                      • {hi ? farmerIrrigationHi(p) : p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DarkCard>
      ) : null}

      {/* Desi moisture */}
      <DarkCard className="border-amber-500/30 bg-amber-500/8">
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-extrabold text-amber-950 dark:text-amber-100">
              {hi
                ? "खेत में नमी जाँचने का आसान देसी तरीका"
                : "Easy desi way to check soil moisture"}
            </p>
            <p className="mt-1.5 text-[12px] font-semibold leading-snug text-[var(--av-text-secondary)]">
              {hi ? guide.moistureHi : guide.moistureEn}
            </p>
          </div>
          <span className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border border-amber-500/25 bg-white">
            <Image
              src="/images/irrigation/desi-moisture.webp"
              alt=""
              fill
              className="object-cover"
              sizes="72px"
            />
          </span>
        </div>
      </DarkCard>

      <IrrigationReminderButton
        cropSlug={crop.slug}
        cropLabel={cropLabel}
        hi={hi}
        badgeHints={guide.stages.flatMap((s) =>
          hi
            ? [s.badgeHi, s.waterHi ?? "", ...(s.fieldIdHi ?? []), ...s.pointsHi]
            : [s.badgeEn, s.waterEn ?? "", ...(s.fieldIdEn ?? []), ...s.pointsEn]
        )}
      />
    </div>
  );
}
