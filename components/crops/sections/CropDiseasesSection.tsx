"use client";

import RiskBadge from "@/components/shell/RiskBadge";
import FarmerSplitCard from "@/components/ui/FarmerSplitCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropFieldGuideDiseaseListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getIpmDiseaseListForCrop } from "@/lib/crops/ipmDataBridge";
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

function pathogenTypeLabel(raw: string | undefined, hi: boolean): string {
  if (!raw?.trim()) return "";
  const t = raw.trim();
  if (/virus|वायरस|viral|टंग्रो|tungro/i.test(t)) return hi ? "वायरस" : "Virus";
  if (/bacter|जीवाणु|blb|bacterial/i.test(t)) return hi ? "जीवाणु" : "Bacteria";
  if (/fung|कवक|blast|smut|blight|spot/i.test(t)) return hi ? "कवक" : "Fungus";
  if (hi) {
    if (/कवक/.test(t)) return "कवक";
    if (/जीवाणु/.test(t)) return "जीवाणु";
    if (/वायरस/.test(t)) return "वायरस";
  }
  return t;
}

function diseaseThreatCategory(type?: string): "fungal" | "bacterial" | "viral" {
  const t = type ?? "";
  if (/virus|वायरस|viral|टंग्रो|tungro/i.test(t)) return "viral";
  if (/bacter|जीवाणु/i.test(t)) return "bacterial";
  return "fungal";
}

export default function CropDiseasesSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
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
        risk: /virus|वायरस|bacterial wilt|टंग्रो|tungro/i.test(d.diseaseName + d.type)
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

  const filtered = diseases.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      ("scientific" in d && String(d.scientific ?? "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-3">
      <p className="px-0.5 text-[11px] font-medium text-[#7A8B82]">
        {hi
          ? `${diseases.length} रोग · टैप कर पूरा पेज खोलें`
          : `${diseases.length} diseases · tap to open full page`}
      </p>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9A91]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={hi ? "रोग खोजें..." : "Search disease..."}
          className="w-full rounded-full border border-[#DCE8E0] bg-white py-3 pl-12 pr-4 text-[14px] font-medium text-[#12281C] shadow-[0_4px_14px_-8px_rgba(11,61,40,0.28)] outline-none placeholder:text-[#8A9A91] focus:border-[#0B6B45]/40 focus:ring-2 focus:ring-[#0B6B45]/15"
        />
      </div>

      <ul className="space-y-3">
        {filtered.map((d) => {
          const href =
            "detailHref" in d && d.detailHref
              ? String(d.detailHref)
              : threatDetailPath(crop.slug, "disease", d.id);
          const img =
            "image" in d
              ? String(d.image)
              : diseaseThumb("scientific" in d ? String(d.scientific) : undefined);
          const sci = "scientific" in d ? String(d.scientific ?? "") : "";
          const typeRaw = "type" in d && d.type ? String(d.type) : "";
          const typeLabel = pathogenTypeLabel(typeRaw || sci || d.name, hi);
          return (
            <li key={d.id}>
              <FarmerSplitCard
                tone="light"
                href={href}
                title={d.name}
                subtitle={sci || undefined}
                subtitleItalic={Boolean(sci)}
                image={img}
                threatCategory={diseaseThreatCategory(typeRaw || d.name)}
                openHint={hi ? "पूरा रोग पेज" : "Full disease page"}
                meta={
                  <span className="flex flex-wrap items-center gap-1.5">
                    <RiskBadge level={d.risk} />
                    {typeLabel ? (
                      <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-[#0B6B45]">
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
        <p className="rounded-2xl border border-dashed border-[#D8E8DE] bg-white/70 px-4 py-6 text-center text-sm text-[#7A8B82]">
          {hi ? "कोई रोग नहीं मिला" : "No diseases found"}
        </p>
      )}
    </div>
  );
}
