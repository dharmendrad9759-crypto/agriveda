"use client";

import { getCropManagementProfile } from "@/data/crop-management";
import { getWeedProgramForCrop } from "@/lib/crops/weedAbioticBridge";
import { getCropPestDisease } from "@/data/pest-disease";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { weedDisplayName } from "@/lib/crops/weedNamesHi";
import { threatDetailPath } from "@/lib/pest-disease-catalog";
import type { Crop } from "@/types/crop";
import { ChevronRight, FlaskConical, Leaf } from "lucide-react";

export default function CropWeedSection({ crop }: { crop: Crop }) {
  const { locale, t } = useLocale();
  const hi = locale === "hi";
  const profile = getCropManagementProfile(crop.slug);
  const program = profile?.weedProgram ?? getWeedProgramForCrop(crop.slug);
  const catalog = getCropPestDisease(crop.slug);
  const weedNames =
    catalog.weeds.length > 0
      ? catalog.weeds.map((w) => ({ id: w.id, name: w.name, scientificName: w.scientificName }))
      : (program?.keyWeeds ?? []).map((name, i) => ({
          id: `kw-${i}`,
          name,
          scientificName: "",
        }));

  const chemicals = program?.chemical ?? [];

  if (!weedNames.length && !chemicals.length) {
    const guide = crop.cropProtection.weedManagement;
    if (guide.length > 0) {
      return (
        <div className="space-y-3">
          <h3 className="text-base font-extrabold text-[var(--av-text-primary)]">
            {t("cropWeedsTitle")} — {crop.name}
          </h3>
          <ul className="space-y-2">
            {guide.map((w) => (
              <li key={w} className="crop-premium-inset text-xs text-[var(--av-text-primary)]">
                {w}
              </li>
            ))}
          </ul>
          <AppLink href="/ai-doctor" className="inline-flex text-xs font-bold text-[var(--av-accent)]">
            {hi ? "फोटो से खरपतवार पहचान → एआई डॉक्टर" : "Photo weed ID → AI Doctor"}
          </AppLink>
        </div>
      );
    }
    return (
      <div className="crop-premium-empty">
        <p className="text-sm text-[var(--av-text-secondary)]">
          {hi
            ? `${crop.name} के लिए विस्तृत खरपतवार सूची जल्द। पहले 30–45 दिन खेत साफ रखें।`
            : `Detailed weed list not ready for ${crop.name} yet. Keep field clean first 30–45 days.`}
        </p>
        <AppLink href="/ai-doctor" className="mt-3 inline-flex text-xs font-bold text-[var(--av-accent)]">
          {t("cropOpenAiDoctor")} →
        </AppLink>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-extrabold text-[var(--av-text-primary)]">
          {t("cropWeedsTitle")} — {crop.name}
        </h3>
        <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
          {hi
            ? `${weedNames.length} मुख्य खरपतवार · टैप कर विवरण`
            : `${weedNames.length} key weeds · tap for detail`}
        </p>
      </div>

      <ul className="space-y-2">
        {weedNames.map((w) => {
          const href = catalog.weeds.some((x) => x.id === w.id)
            ? threatDetailPath(crop.slug, "weed", w.id)
            : `/pest-diseases?type=weed&crop=${crop.slug}`;
          const label = weedDisplayName(w.name, w.scientificName, locale);
          return (
            <li key={w.id}>
              <AppLink href={href} className="av-card av-card-hover flex items-center gap-3 px-3 py-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-extrabold leading-snug text-[var(--av-text-primary)]">
                    {label.primary}
                  </p>
                  {label.secondary ? (
                    <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)] line-clamp-1">
                      {label.secondary}
                    </p>
                  ) : null}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--av-text-muted)]" />
              </AppLink>
            </li>
          );
        })}
      </ul>

      {chemicals.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-[var(--av-text-primary)]">
            <FlaskConical className="h-4 w-4 text-violet-500" />
            {hi ? "प्रभावी टेक्निकल" : "Effective technicals"}
          </h4>
          {program?.criticalPeriod ? (
            <p className="mb-2 text-[10px] text-[var(--av-text-muted)]">
              {hi ? "कड़ा समय" : "Critical"}: {program.criticalPeriod}
            </p>
          ) : null}
          <ul className="space-y-2">
            {chemicals.map((c) => (
              <li
                key={`${c.technical}-${c.timing}`}
                className="rounded-xl border border-violet-500/15 bg-violet-500/5 px-3 py-2.5 text-xs"
              >
                <p className="font-bold text-[var(--av-text-primary)]">{c.technical}</p>
                <p className="mt-0.5 text-[var(--av-text-secondary)]">
                  {c.dose} · {c.timing}
                  {c.targets ? ` · ${c.targets}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
