"use client";

import { getCropManagementProfile } from "@/data/crop-management";
import { getWeedProgramForCrop } from "@/lib/crops/weedAbioticBridge";
import { getCropPestDisease } from "@/data/pest-disease";
import AppLink from "@/components/ui/AppLink";
import CropSprayMedicineList from "@/components/crops/CropSprayMedicineList";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { weedDisplayName } from "@/lib/crops/weedNamesHi";
import { threatDetailPath } from "@/lib/pest-disease-catalog";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { CropSprayProduct } from "@/types/crop-management";
import type { Crop } from "@/types/crop";
import { ChevronRight, Leaf } from "lucide-react";
import { useMemo, useState } from "react";

export default function CropWeedSection({ crop }: { crop: Crop }) {
  const { locale, t } = useLocale();
  const hi = locale === "hi";
  const profile = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const program = profile?.weedProgram ?? getWeedProgramForCrop(crop.slug);
  const profileWeeds = profile?.weedManagement ?? [];
  const catalog = getCropPestDisease(crop.slug);
  const [openId, setOpenId] = useState<string | null>(null);

  const weedNames =
    catalog.weeds.length > 0
      ? catalog.weeds.map((w) => ({ id: w.id, name: w.name, scientificName: w.scientificName }))
      : (program?.keyWeeds ?? []).map((name, i) => ({
          id: `kw-${i}`,
          name,
          scientificName: "",
        }));

  const chemicals = program?.chemical ?? [];
  const useProfileWeeds = profileWeeds.length > 0;
  const herbicideCards = useMemo((): CropSprayProduct[] => {
    return chemicals.map((c) => ({
      technical: c.technical,
      doseAcre: c.dose,
      bestStage: c.timing,
      bestUseCondition: c.targets,
      points: c.note ? [c.note] : undefined,
      sourceConfidence: /लेबल|label/i.test(c.dose + (c.note ?? "")) ? "label-check" : "high",
    }));
  }, [chemicals]);

  if (!weedNames.length && !chemicals.length && !useProfileWeeds) {
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
            ? `${Math.max(weedNames.length, profileWeeds.length)} मुख्य खरपतवार · टैप कर विवरण`
            : `${Math.max(weedNames.length, profileWeeds.length)} key weeds · tap for detail`}
        </p>
      </div>

      {useProfileWeeds ? (
        <ul className="space-y-2">
          {profileWeeds.map((w, i) => {
            const id = `${crop.slug}-weed-${i}`;
            const open = openId === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : id)}
                  className="av-card av-card-hover flex w-full flex-col items-stretch gap-2 px-3 py-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Leaf className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-extrabold leading-snug text-[var(--av-text-primary)]">
                        {w.weedName}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)] line-clamp-1">
                        {w.scientificName} · {w.criticalPeriod}
                      </p>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 text-[var(--av-text-muted)] transition ${open ? "rotate-90" : ""}`}
                    />
                  </div>
                  {open ? (
                    <div className="space-y-1 border-t border-[var(--av-border)] pt-2 text-xs text-[var(--av-text-secondary)]">
                      <p>
                        <span className="font-bold text-[var(--av-text-primary)]">
                          {hi ? "पूर्व-उद्भव: " : "Pre-em: "}
                        </span>
                        {w.preEmergenceHerbicide}
                      </p>
                      <p>
                        <span className="font-bold text-[var(--av-text-primary)]">
                          {hi ? "उत्तर-उद्भव: " : "Post-em: "}
                        </span>
                        {w.postEmergenceHerbicide}
                      </p>
                      <p>{w.dose}</p>
                    </div>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
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
      )}

      {herbicideCards.length > 0 && (
        <div>
          {program?.criticalPeriod ? (
            <p className="mb-2 text-[10px] text-[var(--av-text-muted)]">
              {hi ? "कड़ा समय" : "Critical"}: {program.criticalPeriod}
            </p>
          ) : null}
          <CropSprayMedicineList products={herbicideCards} hi={hi} />
        </div>
      )}
    </div>
  );
}
