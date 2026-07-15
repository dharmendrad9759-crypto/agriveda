"use client";

import { getCropManagementProfile } from "@/data/crop-management";
import { getWeedProgramForCrop } from "@/lib/crops/weedAbioticBridge";
import { getCropPestDisease } from "@/data/pest-disease";
import AppLink from "@/components/ui/AppLink";
import { threatDetailPath } from "@/lib/pest-disease-catalog";
import type { Crop } from "@/types/crop";
import { FlaskConical, Leaf } from "lucide-react";

export default function CropWeedSection({ crop }: { crop: Crop }) {
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
            {crop.name} — field weed guide (herbicide catalog may expand by season)
          </p>
          <ul className="space-y-2">
            {guide.map((w) => (
              <li key={w} className="crop-premium-inset text-xs text-[var(--av-text-primary)]">
                {w}
              </li>
            ))}
          </ul>
          <AppLink href="/ai-doctor" className="inline-flex text-xs font-bold text-[var(--av-accent)]">
            Photo se weed pehchaan → AI Doctor
          </AppLink>
        </div>
      );
    }
    return (
      <div className="crop-premium-empty">
        <p className="text-sm text-[var(--av-text-secondary)]">
          Detailed weed molecules are not listed for {crop.name} yet. First 30–45 days critical — keep field clean and ask AI Doctor with a photo.
        </p>
        <AppLink href="/ai-doctor" className="mt-3 inline-flex text-xs font-bold text-[var(--av-accent)]">
          Open AI Doctor →
        </AppLink>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--av-text-primary)]">
          <Leaf className="h-4 w-4 text-[var(--av-accent)]" />
          मुख्य खरपतवार — {crop.name}
        </h3>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {weedNames.map((w) => {
            const href =
              catalog.weeds.some((x) => x.id === w.id)
                ? threatDetailPath(crop.slug, "weed", w.id)
                : `/pest-diseases?type=weed&crop=${crop.slug}`;
            return (
              <li key={w.id}>
                <AppLink
                  href={href}
                  className="av-card av-card-hover block px-3 py-2.5"
                >
                  <p className="text-sm font-bold text-[var(--av-text-primary)]">{w.name}</p>
                  {w.scientificName ? (
                    <p className="mt-0.5 text-[10px] italic text-[var(--av-text-muted)]">
                      {w.scientificName}
                    </p>
                  ) : null}
                </AppLink>
              </li>
            );
          })}
        </ul>
      </div>

      {chemicals.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--av-text-primary)]">
            <FlaskConical className="h-4 w-4 text-violet-500" />
            प्रभावी टेक्निकल / कॉम्बिनेशन
          </h3>
          {program?.criticalPeriod ? (
            <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
              Critical period: {program.criticalPeriod}
            </p>
          ) : null}
          <ul className="mt-3 space-y-2">
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
