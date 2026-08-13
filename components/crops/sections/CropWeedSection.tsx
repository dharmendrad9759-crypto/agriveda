"use client";

import { getCropManagementProfile } from "@/data/crop-management";
import { getWeedProgramForCrop } from "@/lib/crops/weedAbioticBridge";
import { getCropPestDisease } from "@/data/pest-disease";
import AppLink from "@/components/ui/AppLink";
import CropSprayMedicineList from "@/components/crops/CropSprayMedicineList";
import ThreatImage from "@/components/ui/ThreatImage";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { weedDisplayName } from "@/lib/crops/weedNamesHi";
import { threatDetailPath } from "@/lib/pest-disease-catalog";
import {
  getWeedCardImage,
  getWeedStageImages,
  normalizeScientificName,
} from "@/lib/weeds/weedStageImages";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { CropSprayProduct } from "@/types/crop-management";
import type { Crop } from "@/types/crop";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const WEED_FALLBACK = "/images/threats/threat-weed.jpg";

function extractBinomial(raw?: string | null): string {
  const s = (raw || "").trim();
  if (!s) return "";
  const paren = s.match(/\(([A-Z][a-z]+(?:\s+(?:spp\.|[a-z.-]+))?)\)/);
  if (paren?.[1]) return paren[1];
  if (/^[A-Z][a-z]+\s+[a-z.-]+/.test(s) || /^[A-Z][a-z]+\s+spp\./i.test(s)) {
    return s.split(/[;·,]/)[0]!.trim();
  }
  return s;
}

function weedThumb(scientificName?: string | null, catalogImage?: string | null): string {
  return (
    getWeedCardImage(scientificName) ||
    catalogImage ||
    WEED_FALLBACK
  );
}

function WeedStageStrip({
  scientificName,
  hi,
}: {
  scientificName?: string | null;
  hi: boolean;
}) {
  const stages = getWeedStageImages(scientificName);
  if (!stages) return null;
  return (
    <div className="mt-2">
      <p className="mb-1.5 text-[10px] font-bold text-[var(--av-text-muted)]">
        {hi ? "दो अवस्था — पहचान" : "2 stages — ID"}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {(
          [
            { key: "early", src: stages.early, labelHi: "छोटा पौधा", labelEn: "Young" },
            { key: "late", src: stages.late, labelHi: "बड़ा पौधा", labelEn: "Grown" },
          ] as const
        ).map((s) => (
          <div
            key={s.key}
            className="overflow-hidden rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]"
          >
            <div className="aspect-[4/3] w-full">
              <ThreatImage
                src={s.src}
                alt={hi ? s.labelHi : s.labelEn}
                category="weed"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="px-2 py-1 text-[10px] font-semibold text-[var(--av-text-secondary)]">
              {hi ? s.labelHi : s.labelEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      ? catalog.weeds.map((w) => ({
          id: w.id,
          name: w.name,
          scientificName: w.scientificName,
          image: w.image,
        }))
      : (program?.keyWeeds ?? []).map((name, i) => ({
          id: `kw-${i}`,
          name,
          scientificName: extractBinomial(name),
          image: undefined as string | undefined,
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

  const enrichedProfileWeeds = useMemo(() => {
    return profileWeeds.map((w, i) => {
      const sci = extractBinomial(w.scientificName) || extractBinomial(w.weedName);
      const norm = normalizeScientificName(sci);
      const match = catalog.weeds.find(
        (c) => normalizeScientificName(c.scientificName) === norm && norm.length > 0
      );
      return {
        id: `${crop.slug}-weed-${i}`,
        weedName: w.weedName,
        scientificName: match?.scientificName || sci || w.scientificName,
        criticalPeriod: w.criticalPeriod,
        preEmergenceHerbicide: w.preEmergenceHerbicide,
        postEmergenceHerbicide: w.postEmergenceHerbicide,
        dose: w.dose,
        image: weedThumb(match?.scientificName || sci, match?.image),
        href: match ? threatDetailPath(crop.slug, "weed", match.id) : null,
      };
    });
  }, [profileWeeds, catalog.weeds, crop.slug]);

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
            ? `${crop.name} की विस्तृत खरपतवार सूची सीमित है। पहले 30–45 दिन खेत साफ रखें; खरपतवार हब में उपलब्ध फसलें देखें या कृषि विभाग से पूछें।`
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
            ? `${Math.max(weedNames.length, profileWeeds.length)} मुख्य खरपतवार · टैप कर तस्वीर व विवरण`
            : `${Math.max(weedNames.length, profileWeeds.length)} key weeds · tap for photos & detail`}
        </p>
      </div>

      {useProfileWeeds ? (
        <ul className="space-y-2">
          {enrichedProfileWeeds.map((w) => {
            const open = openId === w.id;
            return (
              <li key={w.id} className="av-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : w.id)}
                  className="av-card-hover flex w-full items-center gap-3 px-3 py-3 text-left"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]">
                    <ThreatImage
                      src={w.image}
                      alt={w.weedName}
                      category="weed"
                      className="h-full w-full object-cover"
                    />
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
                </button>
                {open ? (
                  <div className="space-y-1 border-t border-[var(--av-border)] px-3 pb-3 pt-2 text-xs text-[var(--av-text-secondary)]">
                    <WeedStageStrip scientificName={w.scientificName} hi={hi} />
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
                    {w.href ? (
                      <AppLink
                        href={w.href}
                        className="mt-1 inline-flex text-[11px] font-bold text-[var(--av-accent)]"
                      >
                        {hi ? "पूरा कार्ड →" : "Full card →"}
                      </AppLink>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="space-y-2">
          {weedNames.map((w) => {
            const hasCatalog = catalog.weeds.some((x) => x.id === w.id);
            const href = hasCatalog
              ? threatDetailPath(crop.slug, "weed", w.id)
              : `/pest-diseases?type=weed&crop=${crop.slug}`;
            const label = weedDisplayName(w.name, w.scientificName, locale);
            const open = openId === w.id;
            const thumb = weedThumb(w.scientificName, w.image);
            return (
              <li key={w.id} className="av-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : w.id)}
                  className="av-card-hover flex w-full items-center gap-3 px-3 py-3 text-left"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]">
                    <ThreatImage
                      src={thumb}
                      alt={label.primary}
                      category="weed"
                      className="h-full w-full object-cover"
                    />
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
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 text-[var(--av-text-muted)] transition ${open ? "rotate-90" : ""}`}
                  />
                </button>
                {open ? (
                  <div className="border-t border-[var(--av-border)] px-3 pb-3 pt-2">
                    <WeedStageStrip scientificName={w.scientificName} hi={hi} />
                    <AppLink
                      href={href}
                      className="mt-2 inline-flex text-[11px] font-bold text-[var(--av-accent)]"
                    >
                      {hi ? "पूरा खरपतवार कार्ड →" : "Full weed card →"}
                    </AppLink>
                  </div>
                ) : null}
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
