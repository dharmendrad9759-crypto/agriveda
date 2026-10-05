"use client";

import { useState } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { useMyCrops } from "@/hooks/useMyCrops";
import { tryGetCropDashboard } from "@/data/crop-dashboard";
import { cropCatalog } from "@/data/crop-catalog";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { Droplets } from "lucide-react";
import { AV } from "@/lib/design/tokens";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function IrrigationServicePage() {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const { crops, hydrated } = useMyCrops();
  const catalog =
    hydrated && crops.length > 0
      ? crops.map((c) => ({ slug: c.slug, name: c.name, emoji: c.emoji }))
      : cropCatalog.slice(0, 6).map((c) => ({ slug: c.slug, name: c.name, emoji: c.emoji }));

  const [selectedSlug, setSelectedSlug] = useState(catalog[0]?.slug ?? "paddy");
  const dashboard = tryGetCropDashboard(selectedSlug);
  const irrigation = dashboard?.irrigationManagement;
  const cropLabel = getCropHindiName(selectedSlug) || dashboard?.name || selectedSlug;

  return (
    <AppShell
      title={t("irrigationTitle")}
      breadcrumbs={[
        { label: t("navHome"), href: "/" },
        { label: t("mainServices"), href: "/" },
        { label: t("irrigationTitle") },
      ]}
    >
      <DarkCard>
        <p className={AV.body}>
          {hi
            ? "अपनी फसल चुनो — कब और कितना पानी चाहिए, वो दिखेगा। पूरी डिटेल फसल पेज पर भी है।"
            : "Pick your crop — see when and how much water. Full detail is also on the crop page."}
        </p>
        <AppLink href="/select-crops" className={`mt-3 inline-flex ${AV.btnSecondarySm}`}>
          {hi ? "मेरी फसलें बदलें" : "Manage my crops"}
        </AppLink>
      </DarkCard>

      <DarkCard className="mt-4" delay={1}>
        <p className="mb-2 text-xs font-bold text-[var(--av-text-secondary)]">
          {hi ? "फसल चुनें:" : "Select crop:"}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {catalog.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setSelectedSlug(c.slug)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition ${
                selectedSlug === c.slug
                  ? "bg-[var(--av-accent)] text-[#0a0f1a]"
                  : "border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)]"
              }`}
            >
              <span>{c.emoji}</span>
              {getCropHindiName(c.slug) || c.name}
            </button>
          ))}
        </div>
      </DarkCard>

      {irrigation ? (
        <DarkCard className="mt-4" delay={2}>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/15">
              <Droplets className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <h2 className={AV.sectionTitle}>
                {irrigation.emoji} {irrigation.title}
              </h2>
              <p className={`mt-1 ${AV.body}`}>{irrigation.summary}</p>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {irrigation.fields.map((f) => (
              <li
                key={f.label}
                className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2"
              >
                <p className="text-xs font-semibold text-[var(--av-text-primary)]">{f.label}</p>
                <p className="text-[11px] text-[var(--av-text-secondary)]">{f.value}</p>
              </li>
            ))}
          </ul>

          {irrigation.tips.length > 0 && (
            <div className="mt-4">
              <p className={AV.label}>{hi ? "खेत टिप" : "Tips"}</p>
              <ul className={`mt-2 space-y-1 ${AV.micro}`}>
                {irrigation.tips.map((tip) => (
                  <li key={tip} className="text-[var(--av-text-secondary)]">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DarkCard>
      ) : (
        <DarkCard className="mt-4 border-amber-500/25 bg-amber-500/8">
          <p className="text-sm font-bold text-[var(--av-text-primary)]">
            {hi
              ? `${cropLabel} की सिंचाई गाइड अभी ऐप में नहीं है`
              : `No irrigation guide yet for ${cropLabel}`}
          </p>
          <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
            {hi
              ? "गलत फसल (जैसे धान) की सलाह नहीं दिखा रहे — फसल पेज खोलो या दूसरी फसल चुनो।"
              : "We won’t show another crop’s water advice by mistake. Open the crop page or pick another crop."}
          </p>
        </DarkCard>
      )}

      <AppLink href={`/crops/${selectedSlug}`} className={`mt-4 inline-flex ${AV.btnPrimarySm}`}>
        {hi ? `${cropLabel} की पूरी गाइड →` : `Full ${cropLabel} guide →`}
      </AppLink>
    </AppShell>
  );
}
