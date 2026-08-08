"use client";

import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import ThreatImage from "@/components/ui/ThreatImage";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropFieldGuidePestListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getIpmPestListForCrop } from "@/lib/crops/ipmDataBridge";
import { getPestSpeciesImage } from "@/lib/pests/threatSpeciesImages";
import { getEnrichedCropThreats } from "@/lib/pest-disease-catalog";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { Crop } from "@/types/crop";
import { ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

function pestThumb(scientific?: string, catalogImage?: string) {
  return (
    getPestSpeciesImage(scientific) ||
    catalogImage ||
    "/images/threats/threat-insect.jpg"
  );
}

export default function CropPestsSection({ crop }: { crop: Crop }) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const [search, setSearch] = useState("");

  const profile = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const useRichPests = Boolean(profile?.pestManagement?.length);

  const ipmPests = useMemo(() => getIpmPestListForCrop(crop.slug), [crop.slug]);
  const fieldGuidePests = useMemo(() => getCropFieldGuidePestListForCrop(crop.slug), [crop.slug]);
  const catalogPests = useMemo(
    () => getEnrichedCropThreats(crop.slug).filter((x) => x.type === "pest"),
    [crop.slug]
  );

  const richPests = useMemo(() => {
    if (!useRichPests || !profile?.pestManagement) return [];
    return profile.pestManagement.map((p, i) => {
      const nameLc = p.pestName.toLowerCase();
      const match = catalogPests.find(
        (c) =>
          c.scientificName?.toLowerCase() === p.scientificName?.toLowerCase() ||
          c.name.toLowerCase().includes(nameLc.slice(0, 10)) ||
          nameLc.includes(c.name.toLowerCase().slice(0, 10))
      );
      return {
        id: match?.id ?? `${crop.slug}-pest-${i}`,
        detailHref: match
          ? `/pest-diseases/${crop.slug}/pest/${match.id}`
          : `/pest-diseases?crop=${crop.slug}&type=pest`,
        name: p.pestName,
        scientific: p.scientificName,
        etl: p.etl,
        risk: "high" as const,
        image: pestThumb(p.scientificName, match?.image),
      };
    });
  }, [crop.slug, useRichPests, profile, catalogPests]);

  const pests = useRichPests
    ? richPests
    : fieldGuidePests.length
      ? fieldGuidePests
      : ipmPests.length
        ? ipmPests
        : catalogPests.map((p) => ({
            id: p.id,
            name: p.name,
            scientific: p.scientificName,
            etl: p.etl,
            risk: "high" as const,
            image: pestThumb(p.scientificName, p.image),
          }));

  const filtered = pests.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      ("scientific" in p && String(p.scientific).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-extrabold text-[var(--av-text-primary)]">
          {t("cropPestsTitle")} — {crop.name}
        </h3>
        <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
          {hi
            ? `${pests.length} मुख्य कीट · टैप कर पूरा पेज खोलें`
            : `${pests.length} major pests · tap to open full page`}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={hi ? "कीट खोजें..." : "Search pest..."}
          className="av-input py-2.5 pl-10"
        />
      </div>

      <ul className="space-y-2">
        {filtered.map((pest) => {
          const href =
            "detailHref" in pest && pest.detailHref
              ? String(pest.detailHref)
              : `/pest-diseases/${crop.slug}/pest/${pest.id}`;
          return (
            <li key={pest.id}>
              <AppLink href={href} className="av-card av-card-hover flex items-center gap-3 px-3 py-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]">
                  <ThreatImage
                    src={
                      "image" in pest
                        ? String(pest.image)
                        : pestThumb(
                            "scientific" in pest ? String(pest.scientific) : undefined
                          )
                    }
                    alt={pest.name}
                    category="insect"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-extrabold text-[var(--av-text-primary)]">{pest.name}</p>
                    <RiskBadge level={pest.risk} />
                  </div>
                  <p className="mt-0.5 text-[11px] italic text-[var(--av-text-muted)] line-clamp-1">
                    {"scientific" in pest ? String(pest.scientific) : ""}
                  </p>
                  {"etl" in pest && pest.etl ? (
                    <p className="mt-1 text-[10px] font-semibold text-[var(--av-accent)]">
                      ETL: {String(pest.etl)}
                    </p>
                  ) : null}
                  <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
                    {hi ? "पूरा कीट पेज खोलें →" : "Open pest page →"}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--av-text-muted)]" />
              </AppLink>
            </li>
          );
        })}
      </ul>

      {!filtered.length && (
        <p className="rounded-xl border border-dashed border-[var(--av-border)] px-4 py-6 text-center text-sm text-[var(--av-text-muted)]">
          {hi ? "कोई कीट नहीं मिला" : "No pests found"}
        </p>
      )}
    </div>
  );
}
