"use client";

import RiskBadge from "@/components/shell/RiskBadge";
import ThreatBrowseCard from "@/components/ui/ThreatBrowseCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropFieldGuidePestListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getIpmPestListForCrop } from "@/lib/crops/ipmDataBridge";
import { formatPestSprayWhen } from "@/lib/crops/simplifyPestEtlHi";
import { getPestSpeciesImage } from "@/lib/pests/threatSpeciesImages";
import {
  matchCatalogThreat,
  threatCardDetailHref,
} from "@/lib/pests/matchCatalogThreat";
import { getEnrichedCropThreats, threatDetailPath } from "@/lib/pest-disease-catalog";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { Crop } from "@/types/crop";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

function pestThumb(scientific?: string, catalogImage?: string) {
  return (
    getPestSpeciesImage(scientific) ||
    catalogImage ||
    "/images/threats/threat-insect.jpg"
  );
}

export default function CropPestsSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
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
      const match = matchCatalogThreat(catalogPests, {
        name: p.pestName,
        scientific: p.scientificName,
      });
      const detailHref = threatCardDetailHref(crop.slug, "pest", match, {
        name: p.pestName,
        scientific: p.scientificName,
        index: i,
      });
      return {
        id: match?.id ?? `mp-${i}`,
        detailHref,
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
      ? fieldGuidePests.map((p) => ({
          ...p,
          detailHref: threatDetailPath(crop.slug, "pest", p.id),
        }))
      : ipmPests.length
        ? ipmPests.map((p) => ({
            ...p,
            detailHref: threatDetailPath(crop.slug, "pest", p.id),
          }))
        : catalogPests.map((p) => ({
            id: p.id,
            name: p.name,
            scientific: p.scientificName,
            etl: p.etl,
            risk: "high" as const,
            image: pestThumb(p.scientificName, p.image),
            detailHref: threatDetailPath(crop.slug, "pest", p.id),
          }));

  const filtered = pests.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      ("scientific" in p && String(p.scientific).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-3.5">
      <div className="flex items-end justify-between gap-3 px-0.5">
        <p className="text-[12px] font-semibold leading-snug text-[var(--av-text-muted)]">
          {hi
            ? `${pests.length} मुख्य कीट · फोटो देखो, टैप करो`
            : `${pests.length} main pests · tap a card`}
        </p>
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-rose-600/80">
          {hi ? "कीट गाइड" : "Pest guide"}
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9A91]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={hi ? "कीट का नाम लिखो…" : "Search pest…"}
          className="w-full rounded-2xl border border-[#DCE8E0] bg-white py-3 pl-12 pr-4 text-[14px] font-medium text-[#12281C] shadow-[0_8px_22px_-14px_rgba(11,61,40,0.35)] outline-none placeholder:text-[#8A9A91] focus:border-emerald-700/35 focus:ring-2 focus:ring-emerald-700/15"
        />
      </div>

      <ul className="space-y-3">
        {filtered.map((pest, i) => {
          const href =
            "detailHref" in pest && pest.detailHref
              ? String(pest.detailHref)
              : threatDetailPath(crop.slug, "pest", pest.id);
          const img =
            "image" in pest
              ? String(pest.image)
              : pestThumb("scientific" in pest ? String(pest.scientific) : undefined);
          const sci = "scientific" in pest ? String(pest.scientific) : "";
          const etl = "etl" in pest && pest.etl ? String(pest.etl) : "";
          const sprayWhen = etl ? formatPestSprayWhen(etl, hi) : "";
          return (
            <li key={pest.id}>
              <ThreatBrowseCard
                index={i + 1}
                title={pest.name}
                scientific={sci || undefined}
                image={img}
                href={href}
                accent="pest"
                threatCategory="insect"
                riskChip={<RiskBadge level={pest.risk} hi={hi} />}
                tipLine={sprayWhen || undefined}
                openHint={hi ? "क्या करें — पूरा पेज" : "What to do — open"}
              />
            </li>
          );
        })}
      </ul>

      {!filtered.length && (
        <p className="rounded-2xl border border-dashed border-[#D8E8DE] bg-white/70 px-4 py-6 text-center text-sm text-[#7A8B82]">
          {hi ? "कोई कीट नहीं मिला" : "No pests found"}
        </p>
      )}
    </div>
  );
}
