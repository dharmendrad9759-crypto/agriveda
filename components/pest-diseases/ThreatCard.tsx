"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { EnrichedThreat } from "@/types/pest-disease-ui";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/types/pest-disease-ui";
import { threatDetailPath } from "@/lib/pest-disease-catalog";
import ThreatImage from "@/components/ui/ThreatImage";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface ThreatCardProps {
  threat: EnrichedThreat;
}

export default function ThreatCard({ threat }: ThreatCardProps) {
  const router = useRouter();
  const { t } = useLocale();
  const href = threatDetailPath(threat.cropSlug, threat.type, threat.id);
  const storageKey = `agriveda-threat-photo-${threat.cropSlug}-${threat.type}-${threat.id}`;

  return (
    <GlassCard hover className="flex flex-col overflow-hidden p-0">
      <Link href={href} className="block">
        <ThreatImage
          src={threat.image}
          alt={threat.name}
          category={threat.category}
          className="h-32 w-full"
        />
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-extrabold theme-text-primary leading-tight">{threat.name}</p>
            <span
              className={`flex-shrink-0 rounded-md border px-1.5 py-0.5 text-[8px] font-bold ${CATEGORY_COLORS[threat.category]}`}
            >
              {CATEGORY_LABELS[threat.category]}
            </span>
          </div>
          <p className="mt-0.5 text-[10px] italic theme-text-muted line-clamp-1">
            {threat.scientificName}
          </p>
          <p className="mt-1.5 text-[10px] theme-text-muted line-clamp-2">{threat.description}</p>
          <span className="mt-2 inline-block text-[10px] font-bold text-emerald-600">
            {t("viewDetails")} →
          </span>
        </div>
      </Link>
      <div className="border-t border-gray-100 px-3 py-2 dark:border-white/10">
        <FarmerPhotoUpload
          storageKey={storageKey}
          currentUrl={null}
          onUpload={() => router.push(href)}
          compact
        />
      </div>
    </GlassCard>
  );
}
