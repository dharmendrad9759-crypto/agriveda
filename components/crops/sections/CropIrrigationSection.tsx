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
  ChevronDown,
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
  const [openStageIdx, setOpenStageIdx] = useState<number | null>(0);
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
      <section className="overflow-hidden rounded-2xl border border-sky-800/25 bg-gradient-to-br from-sky-900 via-cyan-900 to-teal-900 text-white shadow-[var(--av-shadow-sm)]">
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-200">
              <Droplets className="h-3 w-3" />
              {hi ? "सिंचाई प्रबंधन" : "Irrigation Plan"}
            </span>
            <h2 className="mt-1.5 text-xl font-black leading-tight tracking-tight sm:text-2xl">
              {hi ? `${cropLabel} को पानी कब दें` : `When to water ${cropLabel}`}
            </h2>
            <p className="mt-1 text-xs font-semibold text-cyan-100/80">
              {hi
                ? `कुल ${farmerIrrigationHi(guide.irrigationsHi)} · ${farmerIrrigationHi(guide.methodHi)}`
                : `${guide.irrigationsEn} · ${guide.methodEn}`}
            </p>
          </div>
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 bg-white/10 shadow-md sm:h-24 sm:w-24">
            <Image
              src={cropImg}
              alt={cropLabel}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        </div>
      </section>

      {/* Weather Alert / Status */}
      {rainAlert?.postpone ? (
        <DarkCard className="border-amber-500/35 bg-amber-500/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <CloudRain className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="min-w-0 text-xs">
                <p className="font-extrabold text-[var(--av-text-primary)]">
                  {hi ? "मौसम अलर्ट: बारिश की संभावना" : "Rain Alert"}
                </p>
                <p className="text-[11px] font-semibold text-[var(--av-text-secondary)]">
                  {hi ? rainAlert.bodyHi : rainAlert.bodyEn}
                </p>
              </div>
            </div>
            <AppLink href="/weather" className={cn(AV.btnSecondarySm, "shrink-0")}>
              {hi ? "मौसम देखो" : "Weather"}
            </AppLink>
          </div>
        </DarkCard>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-sky-500/20 bg-sky-500/5 px-3 py-2 text-xs">
          <div className="flex items-center gap-2 min-w-0 text-[var(--av-text-secondary)]">
            <CloudRain className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
            <span className="font-semibold truncate">
              {weather?.location ? `${weather.location}: ` : ""}
              {rainAlert?.chance ? `बारिश संभावना ~${rainAlert.chance}%` : "मौसम साफ"} · सिंचाई सुरक्षित
            </span>
          </div>
          <AppLink href="/weather" className="shrink-0 font-bold text-sky-600 dark:text-sky-400 hover:underline">
            {hi ? "मौसम" : "Weather"} &rarr;
          </AppLink>
        </div>
      )}

      {/* Principle + soil */}
      {(guide.principleHi || guide.soilOrRegionHi) && (
        <DarkCard className="border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-transparent">
          <div className="flex gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-700 dark:text-violet-300">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-extrabold text-violet-900 dark:text-violet-100">
                {hi ? "सिंचाई के मुख्य नियम" : "Irrigation rules"}
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
            label: hi ? "ज़रूरी ध्यान" : "Note",
            value: hi ? farmerIrrigationHi(guide.noteHi) : guide.noteEn,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex flex-col justify-between rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] p-2.5 text-center shadow-xs"
            >
              <div>
                <Icon className="mx-auto h-4 w-4 text-sky-600" />
                <p className="mt-1 text-[10px] font-bold text-[var(--av-text-muted)]">{item.label}</p>
              </div>
              <p className="mt-1 text-[11px] font-extrabold leading-snug text-[var(--av-text-primary)]">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-sky-600" />
            <h3 className="text-sm font-black text-[var(--av-text-primary)]">
              {hi ? "सिंचाई क्रम व अवस्थाएँ" : "Irrigation Stages"}
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[var(--av-text-muted)]">
            {guide.stages.length} {hi ? "चरण" : "stages"}
          </span>
        </div>
        <p className="mt-1 text-[11px] font-semibold text-[var(--av-text-muted)]">
          {hi
            ? "विवरण देखने के लिए किसी भी अवस्था पर टैप करें"
            : "Tap any stage to view details"}
        </p>

        <div className="mt-3.5 space-y-2.5">
          {guide.stages.map((stage, i) => {
            const isOpen = openStageIdx === i;
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

            // Prevent repetitive "हल्की सिंचाई" or duplicate badge texts
            const isBadgeCritical = badgeLabel && /महत्वपूर्ण|क्रिटिकल|critical/i.test(badgeLabel);

            return (
              <div
                key={`${stage.titleHi}-${i}`}
                className={cn(
                  "overflow-hidden rounded-2xl border transition-all",
                  stage.critical
                    ? "border-red-500/35 bg-red-500/5 dark:bg-red-950/15"
                    : "border-[var(--av-border)] bg-[var(--av-surface)]"
                )}
              >
                {/* Accordion Toggle Header */}
                <button
                  type="button"
                  onClick={() => setOpenStageIdx(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 p-3.5 text-left transition hover:bg-[var(--av-surface-inset)]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white shadow-xs",
                        stage.critical ? "bg-red-600" : "bg-sky-600"
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {seqLabel ? (
                          <span className="text-[11px] font-black text-sky-700 dark:text-sky-300">
                            {seqLabel} ·
                          </span>
                        ) : null}
                        <h4 className="text-[13px] font-extrabold text-[var(--av-text-primary)] truncate">
                          {titleLabel}
                        </h4>
                      </div>
                      <p className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                        {periodLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {stage.critical ? (
                      <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-black text-red-700 dark:text-red-300">
                        {hi ? "क्रिटिकल" : "Critical"}
                      </span>
                    ) : badgeLabel && !isBadgeCritical ? (
                      <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold text-sky-800 dark:text-sky-200">
                        {badgeLabel}
                      </span>
                    ) : null}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[var(--av-text-muted)] transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                {/* Collapsible Content */}
                {isOpen && (
                  <div className="border-t border-[var(--av-border)] p-3.5 space-y-3 bg-[var(--av-surface-inset)]/40">
                    <div className="flex gap-3">
                      <StagePhoto
                        cropSlug={crop.slug}
                        kind={stage.photoKind}
                        alt={titleLabel}
                      />
                      <div className="min-w-0 flex-1 space-y-2">
                        {water && (
                          <div className="flex items-start gap-2 rounded-xl bg-sky-500/10 px-2.5 py-2 text-[11.5px] font-bold text-sky-950 dark:text-sky-100">
                            <Droplets className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600" />
                            <span>{water}</span>
                          </div>
                        )}

                        {fieldIds && fieldIds.length > 0 && (
                          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-2">
                            <p className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300">
                              <Eye className="h-3 w-3" />
                              {hi ? "खेत में पहचान" : "Field Identification"}
                            </p>
                            <ul className="mt-1 space-y-0.5">
                              {fieldIds.map((p) => (
                                <li
                                  key={p}
                                  className="text-[11px] font-medium text-[var(--av-text-secondary)]"
                                >
                                  • {hi ? farmerIrrigationHi(p) : p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-1.5 pt-1">
                      {(hi ? stage.pointsHi : stage.pointsEn).map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2 text-[11.5px] font-semibold text-[var(--av-text-secondary)]"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600" />
                          <span>{hi ? farmerIrrigationHi(p) : p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
