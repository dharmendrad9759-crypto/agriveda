"use client";

import { useState, useMemo, useEffect } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { Plus, Wifi, WifiOff, Droplets } from "lucide-react";
import SprayTimeline from "@/components/spray-rotation/SprayTimeline";
import RiskBanner from "@/components/spray-rotation/RiskBanner";
import SuggestedSprayCard from "@/components/spray-rotation/SuggestedSprayCard";
import { useSprayLogs } from "@/hooks/useSprayLogs";
import { useSprayFields } from "@/hooks/useSprayFields";
import { useSprayLocale } from "@/hooks/useSprayLocale";
import { t, LOCALE_OPTIONS } from "@/lib/i18n/spray-rotation";
import {
  attachProducts,
  checkResistanceRisk,
  suggestNextMoAGroup,
} from "@/lib/sprayRotation";
import { trySyncPendingSprays } from "@/lib/spraySync";
import { cropCatalog } from "@/data/crop-catalog";
import { getCropPestDisease } from "@/data/pest-disease";
import { cn } from "@/lib/cn";
import { AV } from "@/lib/design/tokens";

const TRACKER_CROPS = cropCatalog.filter((c) =>
  ["paddy", "cotton", "maize", "moongfali"].includes(c.slug)
);

export default function SprayRotationPage() {
  const { locale, setLocale } = useSprayLocale();
  const { fields } = useSprayFields();
  const { hydrated, isOnline, pendingCount, getLogsForField } = useSprayLogs();

  const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?.id ?? "");
  const [pestId, setPestId] = useState("");
  const [diseaseId, setDiseaseId] = useState("");

  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId) {
      setSelectedFieldId(fields[0].id);
    }
  }, [fields, selectedFieldId]);

  useEffect(() => {
    if (isOnline) trySyncPendingSprays();
  }, [isOnline]);

  const activeField = fields.find((f) => f.id === selectedFieldId) ?? fields[0];
  const cropId = activeField?.cropSlug ?? "paddy";
  const cropThreats = getCropPestDisease(cropId);

  const fieldLogs = useMemo(() => {
    if (!activeField) return [];
    return getLogsForField(activeField.id, cropId);
  }, [activeField, cropId, getLogsForField]);

  const withProducts = useMemo(() => attachProducts(fieldLogs), [fieldLogs]);
  const risk = useMemo(() => checkResistanceRisk(fieldLogs), [fieldLogs]);
  const suggestions = useMemo(
    () => suggestNextMoAGroup(cropId, pestId || undefined, diseaseId || undefined, fieldLogs),
    [cropId, pestId, diseaseId, fieldLogs]
  );

  if (!hydrated) return null;

  return (
    <AppShell
      title={t(locale, "title")}
      subtitle={t(locale, "subtitle")}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Spray Rotation" }]}
    >
      <div className="flex justify-end">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-[var(--av-accent)]" />
        ) : (
          <WifiOff className="h-4 w-4 text-amber-500" />
        )}
      </div>

      <DarkCard className="mt-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {LOCALE_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLocale(opt.code)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold",
                locale === opt.code
                  ? "bg-[var(--av-accent)] text-[#0a0f1a]"
                  : "border border-[var(--av-border)] text-[var(--av-text-muted)]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </DarkCard>

      {pendingCount > 0 && (
        <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-xs font-bold text-amber-600">
          {pendingCount} {t(locale, "syncPending")}
        </p>
      )}

      <AppLink href="/spray-rotation/log" className={`mt-4 flex w-full justify-center gap-2 ${AV.btnPrimary}`}>
        <Plus className="h-5 w-5" />
        {t(locale, "logSpray")}
      </AppLink>

      <DarkCard className="mt-4" delay={1}>
        <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
          <Droplets className="h-4 w-4 text-[var(--av-accent)]" />
          {t(locale, "rotationStatus")}
        </h2>

        <div className="mb-3 mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {fields.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFieldId(f.id)}
              className={cn(
                "shrink-0 rounded-xl border px-4 py-2 text-xs font-bold",
                selectedFieldId === f.id
                  ? "border-[var(--av-accent)] bg-[var(--av-accent-soft)] text-[var(--av-accent)]"
                  : "border-[var(--av-border)] text-[var(--av-text-muted)]"
              )}
            >
              {f.name}
            </button>
          ))}
        </div>

        <RiskBanner
          result={risk}
          labels={{
            low: t(locale, "riskLow"),
            medium: t(locale, "riskMedium"),
            high: t(locale, "riskHigh"),
            consecutive: t(locale, "consecutiveWarning"),
          }}
        />

        <div className="mt-4">
          <p className={AV.label}>{t(locale, "timeline")}</p>
          {withProducts.length === 0 ? (
            <p className="mt-4 text-center text-sm text-[var(--av-text-muted)]">{t(locale, "noSprays")}</p>
          ) : (
            <div className="mt-3">
              <SprayTimeline sprays={withProducts} />
            </div>
          )}
        </div>
      </DarkCard>

      <DarkCard className="mt-4" delay={2}>
        <p className={AV.label}>{t(locale, "targetPest")} (for suggestions)</p>
        <select
          value={pestId ? `p-${pestId}` : diseaseId ? `d-${diseaseId}` : ""}
          onChange={(e) => {
            const v = e.target.value;
            if (v.startsWith("p-")) {
              setPestId(v.slice(2));
              setDiseaseId("");
            } else if (v.startsWith("d-")) {
              setDiseaseId(v.slice(2));
              setPestId("");
            } else {
              setPestId("");
              setDiseaseId("");
            }
          }}
          className="av-input mt-2 w-full"
        >
          <option value="">— {t(locale, "targetPest")} —</option>
          {cropThreats.pests.map((p) => (
            <option key={p.id} value={`p-${p.id}`}>
              🐛 {p.name}
            </option>
          ))}
          {cropThreats.diseases.map((d) => (
            <option key={d.id} value={`d-${d.id}`}>
              🦠 {d.name}
            </option>
          ))}
        </select>
        <p className={`mt-1 ${AV.micro}`}>
          Crop: {TRACKER_CROPS.find((c) => c.slug === cropId)?.name ?? cropId}
        </p>
      </DarkCard>

      <SuggestedSprayCard
        suggestions={suggestions}
        title={t(locale, "suggestedNext")}
        emptyMessage={t(locale, "recommendDifferent")}
      />
    </AppShell>
  );
}
