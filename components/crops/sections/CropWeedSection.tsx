"use client";

import { getCropManagementProfile } from "@/data/crop-management";
import { getWeedProgramForCrop } from "@/lib/crops/weedAbioticBridge";
import { getCropPestDisease } from "@/data/pest-disease";
import AppLink from "@/components/ui/AppLink";
import CropCollapsible from "@/components/crops/CropCollapsible";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { weedDisplayName } from "@/lib/crops/weedNamesHi";
import { threatDetailPath } from "@/lib/pest-disease-catalog";
import type { Crop } from "@/types/crop";
import { FlaskConical, Leaf } from "lucide-react";

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
          <p className="text-xs text-[var(--av-text-muted)]">
            {hi
              ? `${crop.name} — खेत खरपतवार गाइड`
              : `${crop.name} — field weed guide (herbicide catalog may expand by season)`}
          </p>
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
            : `Detailed weed molecules are not listed for ${crop.name} yet. First 30–45 days critical — keep field clean and ask AI Doctor with a photo.`}
        </p>
        <AppLink href="/ai-doctor" className="mt-3 inline-flex text-xs font-bold text-[var(--av-accent)]">
          {t("cropOpenAiDoctor")} →
        </AppLink>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <CropCollapsible
        title={`${t("cropWeedsTitle")} — ${crop.name}`}
        subtitle={hi ? "मुख्य खरपतवार · टैप करें" : "Key weeds · tap for detail"}
        defaultOpen
      >
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {weedNames.map((w) => {
            const href = catalog.weeds.some((x) => x.id === w.id)
              ? threatDetailPath(crop.slug, "weed", w.id)
              : `/pest-diseases?type=weed&crop=${crop.slug}`;
            const label = weedDisplayName(w.name, w.scientificName, locale);
            return (
              <li key={w.id}>
                <AppLink href={href} className="av-card av-card-hover block px-3 py-2.5">
                  <p className="text-base font-extrabold leading-snug text-[var(--av-text-primary)]">
                    {label.primary}
                  </p>
                  {label.secondary ? (
                    <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">{label.secondary}</p>
                  ) : null}
                </AppLink>
              </li>
            );
          })}
        </ul>
      </CropCollapsible>

      {chemicals.length > 0 && (
        <CropCollapsible
          title={hi ? "प्रभावी टेक्निकल / कॉम्बिनेशन" : "Effective technicals / combos"}
          subtitle={program?.criticalPeriod ? `Critical: ${program.criticalPeriod}` : undefined}
          defaultOpen={weedNames.length === 0}
        >
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
        </CropCollapsible>
      )}
    </div>
  );
}
