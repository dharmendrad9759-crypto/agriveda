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
} from "@/lib/crops/cropIrrigationGuide";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";
import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";
import {
  AlertTriangle,
  CalendarClock,
  CloudRain,
  Droplets,
  Grid2x2,
  TrendingUp,
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
  kind: "sow" | "veg" | "flower" | "bulk" | "harvest";
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
  const showAwd = crop.slug === "paddy";

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

  return (
    <div className="space-y-3">
      {/* Hero summary */}
      <section className="overflow-hidden rounded-2xl border border-emerald-800/20 bg-gradient-to-br from-emerald-800 via-emerald-700 to-lime-800 text-white shadow-[var(--av-shadow-sm)]">
        <div className="flex gap-3 p-3.5 sm:p-4">
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-black leading-tight tracking-tight">
              {hi ? `${cropLabel} — पानी कब दें` : `${cropLabel} — when to water`}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {[
                {
                  icon: CalendarClock,
                  label: hi ? "मौसम" : "Season",
                  value: crop.suitableSeason,
                },
                {
                  icon: Grid2x2,
                  label: hi ? "क्षेत्र" : "Area",
                  value: hi ? "1 एकड़" : "1 acre",
                },
                {
                  icon: TrendingUp,
                  label: hi ? "पैदावार" : "Yield",
                  value: crop.estimatedYield.replace(/प्रति\s*एकड़/gi, "").trim(),
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-xl bg-black/20 px-2 py-2 backdrop-blur-[2px]"
                  >
                    <Icon className="mb-1 h-3.5 w-3.5 text-lime-200" />
                    <p className="text-[9px] font-bold text-white/70">{item.label}</p>
                    <p className="mt-0.5 line-clamp-2 text-[10px] font-extrabold leading-snug">
                      {item.value}
                    </p>
                  </div>
                );
              })}
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

      {/* Live weather alert */}
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
                {!weatherLoading && !weather && (hi
                  ? "लोकेशन सेट करें — मौसम पेज से GPS या शहर चुनें।"
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

      {/* Quick facts */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            icon: Droplets,
            label: hi ? "कुल सिंचाई" : "Total irrigations",
            value: hi ? guide.irrigationsHi : guide.irrigationsEn,
          },
          {
            icon: Grid2x2,
            label: hi ? "विधि" : "Method",
            value: hi ? guide.methodHi : guide.methodEn,
          },
          {
            icon: AlertTriangle,
            label: hi ? "ध्यान" : "Note",
            value: hi ? guide.noteHi : guide.noteEn,
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
              <p className="mt-0.5 text-[11px] font-extrabold leading-snug text-[var(--av-text-primary)]">
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
              {hi ? "सबसे ज़रूरी बात" : "Most important"}
            </p>
            <p className="mt-1 text-[12px] font-semibold leading-snug text-[var(--av-text-secondary)]">
              {hi ? guide.warningHi : guide.warningEn}
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
            {hi ? "सिंचाई समय सारणी" : "Irrigation schedule"}
          </h3>
        </div>

        <ol className="relative mt-4 space-y-0 pl-1">
          <span
            aria-hidden
            className="absolute bottom-4 left-[15px] top-4 w-0.5 bg-sky-500/25"
          />
          {guide.stages.map((stage, i) => (
            <li key={stage.titleHi} className="relative pb-4 pl-9">
              <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-[11px] font-black text-white shadow-sm">
                {i + 1}
              </span>
              <div className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-2.5">
                <div className="flex gap-2.5">
                  <StagePhoto
                    cropSlug={crop.slug}
                    kind={stage.photoKind}
                    alt={hi ? stage.titleHi : stage.titleEn}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-1.5">
                      <div>
                        <p className="text-[12px] font-extrabold text-[var(--av-text-primary)]">
                          {hi ? stage.titleHi : stage.titleEn}
                        </p>
                        <p className="text-[10px] font-semibold text-[var(--av-text-muted)]">
                          {hi ? stage.periodHi : stage.periodEn}
                        </p>
                      </div>
                      <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold text-sky-800 dark:text-sky-200">
                        {hi ? stage.badgeHi : stage.badgeEn}
                      </span>
                    </div>
                    {stage.critical ? (
                      <span className="mt-1.5 inline-flex rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-extrabold text-red-700 dark:text-red-300">
                        {hi ? "सबसे महत्वपूर्ण समय" : "Most critical stage"}
                      </span>
                    ) : null}
                    <ul className="mt-2 space-y-1">
                      {(hi ? stage.pointsHi : stage.pointsEn).map((p) => (
                        <li
                          key={p}
                          className="text-[12px] font-semibold leading-snug text-[var(--av-text-secondary)]"
                        >
                          • {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </DarkCard>

      {/* Desi moisture check */}
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

      {/* Tips grid */}
      <div className="grid grid-cols-2 gap-2">
        {(hi
          ? [
              "सुबह या शाम सिंचाई करें",
              crop.slug === "maize"
                ? "मूंछ / भुट्टा समय पानी न रोकें"
                : "बालियों के समय पानी न रोकें",
              "खेत में पानी खड़ा न रखें",
            ]
          : [
              "Irrigate morning or evening",
              crop.slug === "maize"
                ? "Do not skip water at silk / cob time"
                : "Do not stop water at panicle / ear stage",
              "Avoid standing water in field",
            ]
        ).map((tip) => (
          <div
            key={tip}
            className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-[11px] font-bold leading-snug text-[var(--av-text-primary)]"
          >
            {tip}
          </div>
        ))}
      </div>

      <IrrigationReminderButton
        cropSlug={crop.slug}
        cropLabel={cropLabel}
        hi={hi}
        badgeHints={guide.stages.flatMap((s) =>
          hi ? [s.badgeHi, ...s.pointsHi] : [s.badgeEn, ...s.pointsEn]
        )}
      />
    </div>
  );
}
