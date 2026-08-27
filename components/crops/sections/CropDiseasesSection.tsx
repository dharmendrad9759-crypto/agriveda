"use client";

import RiskBadge from "@/components/shell/RiskBadge";
import FarmerSplitCard from "@/components/ui/FarmerSplitCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropFieldGuideDiseaseListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getIpmDiseaseListForCrop } from "@/lib/crops/ipmDataBridge";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { getDiseaseSpeciesImage } from "@/lib/pests/threatSpeciesImages";
import {
  matchCatalogThreat,
  threatCardDetailHref,
} from "@/lib/pests/matchCatalogThreat";
import { getEnrichedCropThreats, threatDetailPath } from "@/lib/pest-disease-catalog";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { Crop } from "@/types/crop";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

function diseaseThumb(pathogen?: string, catalogImage?: string) {
  return (
    getDiseaseSpeciesImage(pathogen) ||
    catalogImage ||
    "/images/threats/threat-disease.jpg"
  );
}

export default function CropDiseasesSection({ crop }: { crop: Crop }) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const cropLabel = (hi && getCropHindiName(crop.slug)) || crop.name;
  const [search, setSearch] = useState("");

  const profile = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const useRichDiseases = Boolean(profile?.diseaseManagement?.length);

  const ipmDiseases = useMemo(() => getIpmDiseaseListForCrop(crop.slug), [crop.slug]);
  const fieldGuideDiseases = useMemo(
    () => getCropFieldGuideDiseaseListForCrop(crop.slug),
    [crop.slug]
  );
  const catalogDiseases = useMemo(
    () => getEnrichedCropThreats(crop.slug).filter((x) => x.type === "disease"),
    [crop.slug]
  );

  const richDiseases = useMemo(() => {
    if (!useRichDiseases || !profile?.diseaseManagement) return [];
    return profile.diseaseManagement.map((d, i) => {
      const match = matchCatalogThreat(catalogDiseases, {
        name: d.diseaseName,
        scientific: d.pathogen,
      });
      const detailHref = threatCardDetailHref(crop.slug, "disease", match, {
        name: d.diseaseName,
        scientific: d.pathogen,
        index: i,
      });
      return {
        id: match?.id ?? `md-${i}`,
        detailHref,
        name: d.diseaseName,
        scientific: d.pathogen,
        risk: /virus|वायरस|bacterial wilt|टंग्रो/i.test(d.diseaseName + d.type)
          ? ("high" as const)
          : ("medium" as const),
        type: d.type,
        image: diseaseThumb(d.pathogen ?? match?.pathogen ?? undefined, match?.image),
      };
    });
  }, [crop.slug, useRichDiseases, profile, catalogDiseases]);

  const diseases = useRichDiseases
    ? richDiseases
    : fieldGuideDiseases.length
      ? fieldGuideDiseases.map((d) => ({
          ...d,
          detailHref: threatDetailPath(crop.slug, "disease", d.id),
        }))
      : ipmDiseases.length
        ? ipmDiseases.map((d) => ({
            ...d,
            detailHref: threatDetailPath(crop.slug, "disease", d.id),
          }))
        : catalogDiseases.map((d) => ({
            id: d.id,
            name: d.name,
            scientific: d.pathogen ?? d.scientificName,
            risk: d.category === "viral" ? ("high" as const) : ("medium" as const),
            type: d.category,
            image: diseaseThumb(d.pathogen, d.image),
            detailHref: threatDetailPath(crop.slug, "disease", d.id),
          }));

  const filtered = diseases.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-extrabold text-[var(--av-text-primary)]">
          {t("cropDiseasesTitle")} — {cropLabel}
        </h3>
        <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
          {hi
            ? `${diseases.length} रोग · टैप कर पूरा पेज खोलें`
            : `${diseases.length} diseases · tap to open full page`}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={hi ? "रोग खोजें..." : "Search disease..."}
          className="av-input py-2.5 pl-10"
        />
      </div>

      <ul className="space-y-2.5">
        {filtered.map((d) => {
          const href =
            "detailHref" in d && d.detailHref
              ? String(d.detailHref)
              : threatDetailPath(crop.slug, "disease", d.id);
          const img =
            "image" in d
              ? String(d.image)
              : diseaseThumb("scientific" in d ? String(d.scientific) : undefined);
          const sci = "scientific" in d ? String(d.scientific) : "";
          const typeLabel = "type" in d && d.type ? String(d.type) : "";
          return (
            <li key={d.id}>
              <FarmerSplitCard
                href={href}
                title={d.name}
                subtitle={sci}
                image={img}
                threatCategory="fungal"
                openHint={hi ? "पूरा रोग पेज" : "Open disease page"}
                meta={
                  <span className="flex flex-wrap items-center gap-1.5">
                    <RiskBadge level={d.risk} />
                    {typeLabel ? (
                      <span className="text-[10px] font-semibold text-[var(--av-accent)]">
                        {typeLabel}
                      </span>
                    ) : null}
                  </span>
                }
              />
            </li>
          );
        })}
      </ul>

      {!filtered.length && (
        <p className="rounded-xl border border-dashed border-[var(--av-border)] px-4 py-6 text-center text-sm text-[var(--av-text-muted)]">
          {hi ? "कोई रोग नहीं मिला" : "No diseases found"}
        </p>
      )}
    </div>
  );
}
