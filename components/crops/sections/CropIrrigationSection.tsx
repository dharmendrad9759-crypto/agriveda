"use client";

import ExpandablePanel, { TimingBadge } from "@/components/crops/ExpandablePanel";
import AwdIrrigationCard from "@/components/crops/AwdIrrigationCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropManagementProfile } from "@/data/crop-management";
import {
  simplifyIrrigationLineHi,
  simplifyWaterNeedHi,
} from "@/lib/crops/simplifyIrrigationHi";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import { Droplets, Sprout } from "lucide-react";
import type { Crop } from "@/types/crop";
import type { EnrichedCropDetail } from "@/types/crop-detail";
import { useMemo } from "react";

interface CropIrrigationSectionProps {
  crop: Crop;
  detail: EnrichedCropDetail;
  timingHint: string;
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
  const growthStages = profile?.growthStages?.length
    ? profile.growthStages
    : detail.growthStages ?? [];
  const showAwd = crop.slug === "paddy";

  const waterNeed = hi
    ? simplifyWaterNeedHi(crop.irrigationManagement.waterRequirement)
    : crop.irrigationManagement.waterRequirement;
  const critical = crop.irrigationManagement.criticalStages
    .map((c) => (hi ? simplifyIrrigationLineHi(c) : c))
    .join(" · ");
  const simpleSchedule = scheduleLines.map((s) =>
    hi ? simplifyIrrigationLineHi(s) : s
  );

  return (
    <div className="space-y-2">
      {showAwd ? <AwdIrrigationCard hi={hi} /> : null}

      <p className="av-card-inset text-xs leading-relaxed text-[var(--av-text-secondary)]">
        {hi
          ? "सरल नियम: ऊपरी मिट्टी सूखे तब पानी दें। नीचे लिखी कड़ी अवस्था में पानी मत रोकें।"
          : `${timingHint} — water at critical stages; otherwise when top soil dries.`}
      </p>

      <ExpandablePanel
        title={hi ? "कितना पानी?" : "Water requirement"}
        subtitle={hi ? "आसान भाषा में" : crop.irrigationManagement.waterRequirement}
        icon={Droplets}
        accent="sky"
        defaultOpen
      >
        <p className="text-sm leading-relaxed text-[var(--av-text-primary)]">{waterNeed}</p>
        <p className="mt-2 text-xs font-semibold text-[var(--av-text-secondary)]">
          {hi ? "इन समय पर पानी ज़रूरी" : "Critical stages"}: {critical}
        </p>
        {simpleSchedule.length ? (
          <ul className="mt-3 space-y-2">
            {simpleSchedule.map((s) => (
              <li
                key={s}
                className="rounded-xl border border-sky-500/20 bg-sky-500/5 px-3 py-2 text-xs leading-relaxed text-[var(--av-text-secondary)]"
              >
                {s}
              </li>
            ))}
          </ul>
        ) : null}
      </ExpandablePanel>

      {detail.irrigations.map((ir, i) => (
        <ExpandablePanel
          key={`${ir.label}-${i}`}
          title={hi ? `${simplifyIrrigationLineHi(ir.label)} · ${ir.timing}` : `${ir.label} · ${ir.timing}`}
          subtitle={hi ? simplifyIrrigationLineHi(ir.amount) : ir.amount}
          badge={ir.timingRef}
          icon={Droplets}
          accent="green"
          defaultOpen={false}
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <TimingBadge timing={ir.timing} ref={ir.timingRef} />
              <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[11px] font-bold text-sky-700 dark:text-sky-300">
                {hi ? "दिन" : "Days"}: {ir.timing}
              </span>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-[var(--av-text-primary)]">
              {hi ? simplifyIrrigationLineHi(ir.amount) : ir.amount}
            </p>
            {ir.notes ? (
              <p className="text-xs leading-relaxed text-[var(--av-text-secondary)]">
                {hi ? simplifyIrrigationLineHi(ir.notes) : ir.notes}
              </p>
            ) : null}
          </div>
        </ExpandablePanel>
      ))}

      {growthStages.length ? (
        <ExpandablePanel
          title={hi ? "पौधे की अवस्थाएँ" : "Growth stages"}
          icon={Sprout}
          accent="green"
        >
          <ul className="space-y-2 text-sm">
            {growthStages.map((s) => (
              <li key={`${s.title}-${s.period}`}>
                <p className="font-bold text-[var(--av-text-primary)]">
                  {hi ? simplifyIrrigationLineHi(s.title) : s.title}{" "}
                  <span className="text-xs font-medium text-[var(--av-text-muted)]">
                    ({s.period})
                  </span>
                </p>
                <p className="text-xs leading-relaxed text-[var(--av-text-secondary)]">
                  {(hi
                    ? s.keyPoints.map(simplifyIrrigationLineHi)
                    : s.keyPoints
                  ).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </ExpandablePanel>
      ) : null}

      <ExpandablePanel
        title={hi ? "कटाई और भंडारण" : "Harvest & storage"}
        icon={Sprout}
        accent="amber"
      >
        <ul className="space-y-1.5 text-sm leading-relaxed text-[var(--av-text-primary)]">
          <li>
            •{" "}
            {hi
              ? simplifyIrrigationLineHi(crop.harvestAndYield.harvestingTime)
              : crop.harvestAndYield.harvestingTime}
          </li>
          <li>
            • {hi ? "उपज" : "Yield"}: {crop.harvestAndYield.yield}
          </li>
          {crop.harvestAndYield.storageTips.map((tip) => (
            <li key={tip}>• {hi ? simplifyIrrigationLineHi(tip) : tip}</li>
          ))}
        </ul>
      </ExpandablePanel>
    </div>
  );
}
