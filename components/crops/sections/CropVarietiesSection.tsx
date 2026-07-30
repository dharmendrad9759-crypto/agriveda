"use client";

import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import CropCollapsible from "@/components/crops/CropCollapsible";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getVarietiesForCrop, type MarketVarietyRec } from "@/lib/crops/cropVarieties";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import type { Crop } from "@/types/crop";
import { MapPin, TrendingUp } from "lucide-react";
import { useMemo } from "react";

function VarietyCard({
  v,
  index,
  highlighted,
}: {
  v: MarketVarietyRec;
  index: number;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 ${
        highlighted
          ? "border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent"
          : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[var(--av-text-primary)]">
            {index}. {v.name}
          </p>
          <p className="mt-0.5 text-xs text-[var(--av-text-secondary)]">{v.trait}</p>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--av-accent-soft)] px-2 py-0.5 text-[9px] font-bold text-[var(--av-accent)]">
          {v.season}
        </span>
      </div>
      <p className="mt-1.5 flex items-start gap-1 text-[10px] text-[var(--av-text-muted)]">
        <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
        {v.marketNote}
        {v.states.length > 0 && (
          <span className="text-[var(--av-text-muted)]"> · {v.states.slice(0, 3).join(", ")}</span>
        )}
      </p>
    </div>
  );
}

export default function CropVarietiesSection({ crop }: { crop: Crop }) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const { profile } = useFarmerProfile();
  const state = profile.state.trim() || undefined;
  const district = profile.district.trim();
  const varieties = getVarietiesForCrop(crop.slug, state);

  const { stateGovt, statePrivate, otherGovt, otherPrivate } = useMemo(() => {
    const inState = (v: MarketVarietyRec) =>
      !!state && v.states.some((s) => s.toLowerCase() === state.toLowerCase());
    const stateList = state ? varieties.filter(inState) : varieties;
    const otherList = state ? varieties.filter((v) => !inState(v)) : [];
    return {
      stateGovt: stateList.filter((v) => v.source === "govt"),
      statePrivate: stateList.filter((v) => v.source === "private"),
      otherGovt: otherList.filter((v) => v.source === "govt"),
      otherPrivate: otherList.filter((v) => v.source === "private"),
    };
  }, [varieties, state]);

  const renderGroup = (title: string, list: MarketVarietyRec[], highlight: boolean) => {
    if (!list.length) return null;
    return (
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--av-text-muted)]">
          {title}
        </p>
        {list.map((v, i) => (
          <VarietyCard key={v.name} v={v} index={i + 1} highlighted={highlight} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {(state || district) && (
        <DarkCard className="border-emerald-500/20 bg-emerald-500/5">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
            <MapPin className="h-3.5 w-3.5" />
            {hi
              ? `${t("varForYourState")}: ${[district, state].filter(Boolean).join(", ")}`
              : `Market pick for ${[district, state].filter(Boolean).join(", ") || "your area"}`}
          </p>
          <p className="mt-1 text-xs text-[var(--av-text-muted)]">
            {stateGovt.length || statePrivate.length
              ? hi
                ? `सरकारी ${stateGovt.length} · प्राइवेट ${statePrivate.length}`
                : `Govt ${stateGovt.length} · Private ${statePrivate.length}`
              : hi
                ? "प्रोफ़ाइल में राज्य सेट करें — बेहतर किस्म सुझाव मिलेगा।"
                : "Set state in profile for better variety tips."}
          </p>
        </DarkCard>
      )}

      <DarkCard>
        <SectionHeader title={hi ? "अनुशंसित किस्में" : "Recommended Varieties"} />
        <p className="mt-1 text-xs text-[var(--av-text-muted)]">
          {hi
            ? `${crop.name} — राज्य के हिसाब से सरकारी और प्राइवेट किस्में`
            : `${crop.name} — state-wise government and private (hybrid) picks`}
        </p>
        <div className="mt-3 space-y-4">
          {state ? (
            <>
              {renderGroup(t("varGovt"), stateGovt, true)}
              {renderGroup(t("varPrivate"), statePrivate, true)}
            </>
          ) : (
            <>
              {renderGroup(
                t("varGovt"),
                varieties.filter((v) => v.source === "govt"),
                false
              )}
              {renderGroup(
                t("varPrivate"),
                varieties.filter((v) => v.source === "private"),
                false
              )}
            </>
          )}
        </div>
      </DarkCard>

      {state && (otherGovt.length > 0 || otherPrivate.length > 0) && (
        <CropCollapsible
          title={t("varOtherStates")}
          subtitle={hi ? "अन्य राज्यों की किस्में" : "Varieties popular elsewhere"}
          defaultOpen={false}
        >
          <div className="space-y-4">
            {renderGroup(t("varGovt"), otherGovt, false)}
            {renderGroup(t("varPrivate"), otherPrivate, false)}
          </div>
        </CropCollapsible>
      )}
    </div>
  );
}
