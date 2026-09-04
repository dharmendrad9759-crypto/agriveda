"use client";



import AwdIrrigationCard from "@/components/crops/AwdIrrigationCard";

import DarkCard from "@/components/shell/DarkCard";

import { useLocale } from "@/components/i18n/LocaleProvider";

import { getCropManagementProfile } from "@/data/crop-management";

import {

  formatIrrigationStepHi,

  simplifyCriticalStageHi,

  simplifyIrrigationLineHi,

  simplifyWaterNeedHi,

} from "@/lib/crops/simplifyIrrigationHi";

import type { CropManagementWithDossier } from "@/types/crop-dossier";

import { AlertCircle, Droplets, ListOrdered } from "lucide-react";

import type { Crop } from "@/types/crop";

import type { EnrichedCropDetail } from "@/types/crop-detail";

import { useMemo } from "react";



interface CropIrrigationSectionProps {

  crop: Crop;

  detail: EnrichedCropDetail;

  timingHint: string;

}



function StepList({ items }: { items: string[] }) {

  if (!items.length) return null;

  return (

    <ol className="mt-2 space-y-2">

      {items.map((item, i) => (

        <li

          key={`${i}-${item.slice(0, 24)}`}

          className="flex gap-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5"

        >

          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-[11px] font-black text-sky-700 dark:text-sky-300">

            {i + 1}

          </span>

          <p className="text-[12px] font-semibold leading-snug text-[var(--av-text-primary)]">

            {item}

          </p>

        </li>

      ))}

    </ol>

  );

}



export default function CropIrrigationSection({

  crop,

  detail,

  timingHint,

}: CropIrrigationSectionProps) {

  const { locale } = useLocale();

  const hi = locale === "hi";

  const profile = useMemo(

    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,

    [crop.slug]

  );

  const scheduleLines =

    profile?.irrigationSchedule?.length

      ? profile.irrigationSchedule

      : crop.irrigationManagement.schedule ?? [];

  const showAwd = crop.slug === "paddy";



  const line = (text: string) => (hi ? simplifyIrrigationLineHi(text) : text);



  const waterNeed = hi

    ? simplifyWaterNeedHi(crop.irrigationManagement.waterRequirement)

    : crop.irrigationManagement.waterRequirement;



  const criticalStages = crop.irrigationManagement.criticalStages.map((c) =>

    hi ? simplifyCriticalStageHi(c) : c

  );



  const scheduleSteps = scheduleLines.map((s) => line(s));



  const timedSteps = detail.irrigations.map((ir) =>

    hi

      ? formatIrrigationStepHi(ir)

      : [ir.timing, ir.amount].filter(Boolean).join(": ")

  );



  const allSteps = [...scheduleSteps, ...timedSteps].filter(

    (step, index, arr) => step && arr.indexOf(step) === index

  );



  return (

    <div className="space-y-3">

      {showAwd ? <AwdIrrigationCard hi={hi} /> : null}



      <DarkCard className="border-sky-500/25 bg-gradient-to-br from-sky-500/8 to-transparent">

        <div className="flex items-start gap-2.5">

          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600">

            <AlertCircle className="h-4 w-4" />

          </span>

          <div>

            <p className="text-[11px] font-extrabold uppercase tracking-wide text-sky-700 dark:text-sky-300">

              {hi ? "1. सीधा नियम" : "1. Simple rule"}

            </p>

            <p className="mt-1 text-[13px] font-semibold leading-relaxed text-[var(--av-text-primary)]">

              {hi

                ? "ऊपरी मिट्टी सूखे तब पानी दें। जलभराव न होने दें — खेत में पानी खड़ा न रहे।"

                : `${timingHint} — water when top soil dries; avoid waterlogging.`}

            </p>

          </div>

        </div>

      </DarkCard>



      <DarkCard>

        <div className="flex items-center gap-2">

          <Droplets className="h-4 w-4 text-sky-600" />

          <p className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--av-text-muted)]">

            {hi ? "2. कितना पानी चाहिए" : "2. How much water"}

          </p>

        </div>

        <p className="mt-2 text-[13px] font-semibold leading-relaxed text-[var(--av-text-primary)]">

          {waterNeed}

        </p>

      </DarkCard>



      {criticalStages.length > 0 ? (

        <DarkCard>

          <div className="flex items-center gap-2">

            <ListOrdered className="h-4 w-4 text-emerald-600" />

            <p className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--av-text-muted)]">

              {hi ? "3. इन समय पर पानी ज़रूरी" : "3. Water these stages"}

            </p>

          </div>

          <StepList items={criticalStages} />

        </DarkCard>

      ) : null}



      {allSteps.length > 0 ? (

        <DarkCard>

          <div className="flex items-center gap-2">

            <ListOrdered className="h-4 w-4 text-emerald-600" />

            <p className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--av-text-muted)]">

              {hi

                ? `${criticalStages.length ? "4" : "3"}. कब-कब पानी दें`

                : `${criticalStages.length ? "4" : "3"}. When to irrigate`}

            </p>

          </div>

          <StepList items={allSteps} />

        </DarkCard>

      ) : null}

    </div>

  );

}

