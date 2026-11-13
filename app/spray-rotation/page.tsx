"use client";

import { useState, useMemo, useEffect } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import { Plus, Wifi, WifiOff, BookOpen, Droplets } from "lucide-react";
import SprayTimeline from "@/components/spray-rotation/SprayTimeline";
import RiskBanner from "@/components/spray-rotation/RiskBanner";
import { useSprayLogs } from "@/hooks/useSprayLogs";
import { useSprayFields } from "@/hooks/useSprayFields";
import { attachProducts, checkResistanceRisk } from "@/lib/sprayRotation";
import { trySyncPendingSprays } from "@/lib/spraySync";
import { cropCatalog } from "@/data/crop-catalog";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/i18n/LocaleProvider";

const ALL = "all";

export default function SprayRotationPage() {
  const { t: uiT } = useLocale();
  const { fields } = useSprayFields();
  const { logs, hydrated, isOnline, pendingCount } = useSprayLogs();

  const [selectedFieldId, setSelectedFieldId] = useState(ALL);
  const [selectedCropSlug, setSelectedCropSlug] = useState(ALL);

  useEffect(() => {
    if (isOnline) trySyncPendingSprays();
  }, [isOnline]);

  const cropId =
    selectedCropSlug === "groundnut" ? "moongfali" : selectedCropSlug;

  const visibleLogs = useMemo(() => {
    return logs.filter((l) => {
      if (cropId !== ALL) {
        const sameCrop =
          l.cropId === cropId ||
          (cropId === "moongfali" && l.cropId === "groundnut");
        if (!sameCrop) return false;
      }
      if (selectedFieldId !== ALL) {
        if (l.fieldId !== selectedFieldId && l.fieldId !== "hub") return false;
      }
      return true;
    });
  }, [logs, cropId, selectedFieldId]);

  const withProducts = useMemo(() => attachProducts(visibleLogs), [visibleLogs]);
  const risk = useMemo(() => checkResistanceRisk(visibleLogs), [visibleLogs]);

  const fieldNameById = useMemo(() => {
    const map: Record<string, string> = { hub: "फसल डॉक्टर" };
    for (const f of fields) map[f.id] = f.name;
    return map;
  }, [fields]);

  const usedCrops = useMemo(() => {
    const slugs = new Set(logs.map((l) => l.cropId).filter(Boolean));
    const fromLogs = cropCatalog.filter(
      (c) => slugs.has(c.slug) || (c.slug === "moongfali" && slugs.has("groundnut"))
    );
    return fromLogs.length > 0 ? fromLogs : cropCatalog.slice(0, 8);
  }, [logs]);

  if (!hydrated) {
    return (
      <AppShell
        title="स्प्रे डायरी"
        breadcrumbs={[{ label: uiT("navHome"), href: "/" }, { label: "स्प्रे डायरी" }]}
      >
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 py-10 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.png" alt="" className="h-12 w-12 object-contain" />
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-emerald-600 border-t-transparent" />
          <p className="text-xs font-semibold text-[var(--av-text-muted)]">
            स्प्रे डायरी लोड हो रही है…
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="स्प्रे डायरी"
      breadcrumbs={[{ label: uiT("navHome"), href: "/" }, { label: "स्प्रे डायरी" }]}
    >
      <div className="flex items-center justify-between pb-1">
        <p className="text-[12px] font-semibold text-[var(--av-text-secondary)]">
          हर छिड़काव यहाँ दिखेगा — फसल डॉक्टर, मिक्स जाँच, या हाथ से दर्ज।
        </p>
        <div className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[var(--av-text-muted)]">
          {isOnline ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-emerald-600" />
              <span>ऑनलाइन</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-amber-500" />
              <span>ऑफलाइन</span>
            </>
          )}
        </div>
      </div>

      {pendingCount > 0 && (
        <p className="mt-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-xs font-bold text-amber-700">
          {pendingCount} छिड़काव सिंक होना बाकी है (इंटरनेट आने पर अपने आप सिंक होगा)
        </p>
      )}

      <div className="mt-3 space-y-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-0.5">
          <button
            type="button"
            onClick={() => setSelectedFieldId(ALL)}
            className={cn(
              "shrink-0 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition",
              selectedFieldId === ALL
                ? "border-emerald-600 bg-emerald-500/15 text-emerald-900 ring-2 ring-emerald-500/25 dark:text-emerald-100"
                : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)]"
            )}
          >
            सभी खेत
          </button>
          {fields.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setSelectedFieldId(f.id);
                if (f.cropSlug) setSelectedCropSlug(f.cropSlug);
              }}
              className={cn(
                "shrink-0 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition",
                selectedFieldId === f.id
                  ? "border-emerald-600 bg-emerald-500/15 text-emerald-900 ring-2 ring-emerald-500/25 dark:text-emerald-100"
                  : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)]"
              )}
            >
              {f.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
          <span className="shrink-0 text-[11px] font-bold text-[var(--av-text-muted)]">फसल:</span>
          <button
            type="button"
            onClick={() => setSelectedCropSlug(ALL)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold transition",
              cropId === ALL
                ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
            )}
          >
            सभी
          </button>
          {usedCrops.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setSelectedCropSlug(c.slug)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold transition",
                cropId === c.slug
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                  : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
              )}
            >
              {c.nameHi || c.name}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-4 overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--av-border)] pb-3">
          <h2 className="flex items-center gap-2 text-[15px] font-black text-[var(--av-text-primary)]">
            <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            मेरी छिड़काव डायरी
          </h2>
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800 dark:text-emerald-200">
            {withProducts.length} छिड़काव
          </span>
        </div>

        {withProducts.length > 0 ? (
          <>
            <div className="mt-3">
              <RiskBanner
                result={risk}
                labels={{
                  low: "सुरक्षित रोटेशन",
                  medium: "मध्यम जोखिम — दवा बदलें",
                  high: "उच्च जोखिम — तुरंत दवा बदलें!",
                  consecutive: "लगातार एक ही ग्रुप का स्प्रे न दोहराएं",
                }}
              />
            </div>
            <div className="mt-4">
              <SprayTimeline sprays={withProducts} fieldNameById={fieldNameById} />
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-emerald-600/30 bg-emerald-500/8 px-4 py-8 text-center">
            <Droplets className="mx-auto h-8 w-8 text-emerald-700" />
            <p className="mt-2 text-[14px] font-black text-emerald-950 dark:text-emerald-100">
              अभी कोई छिड़काव दर्ज नहीं है
            </p>
            <p className="mt-1 text-[12px] font-semibold text-[var(--av-text-secondary)]">
              फसल डॉक्टर से “आज यह स्प्रे किया” दबाएँ, या नीचे से नया छिड़काव लिखें। सेव होते ही यहीं दिखेगा।
            </p>
          </div>
        )}

        <AppLink
          href={`/spray-rotation/log${cropId !== ALL ? `?crop=${encodeURIComponent(cropId)}` : ""}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white shadow-md shadow-emerald-700/20 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          नया छिड़काव दर्ज करें
        </AppLink>
      </section>
    </AppShell>
  );
}
