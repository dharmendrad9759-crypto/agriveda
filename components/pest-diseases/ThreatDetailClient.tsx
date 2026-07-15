"use client";

import { useMemo, useState } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import RiskBadge from "@/components/shell/RiskBadge";
import {
  Bug,
  Leaf,
  ShieldAlert,
  Sparkles,
  Shield,
  Sprout,
  Eye,
  FlaskConical,
} from "lucide-react";
import type { EnrichedThreat } from "@/types/pest-disease-ui";
import StageWiseSprayCard from "@/components/pest-diseases/StageWiseSprayCard";
import EtlGuideCard from "@/components/shell/EtlGuideCard";
import { AV } from "@/lib/design/tokens";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { getWeedProgramForCrop } from "@/lib/crops/weedAbioticBridge";
import { parseRemediationBuckets } from "@/lib/pest/farmerSpray";
import { useLocale } from "@/components/i18n/LocaleProvider";

type PestTab = "spray" | "control";

function weedIdentifyTips(threat: EnrichedThreat, hi: boolean): string[] {
  const name = threat.name;
  const sci = threat.scientificName;
  const typeHint = /sedge|cyperus/i.test(`${name} ${sci}`)
    ? hi
      ? "तनों के कोने तीखे (तिरछे काट) — घास जैसी पर किनारे तेज"
      : "Triangular stem edges — grass-like but sharp corners"
    : /broad|leaf|monochoria|amaranth|कुंदरू|पत्ती/i.test(`${name} ${sci}`)
      ? hi
        ? "चौड़ी पत्तियाँ, घास नहीं — खेत की फसल से अलग दिखती हैं"
        : "Broad leaves, not grass — stands out from the crop"
      : hi
        ? "पतली पत्ती / घास जैसी — फसल के साथ मिलकर बढ़ती है"
        : "Narrow grassy leaves — grows mixed with the crop";

  return hi
    ? [
        `नाम: ${name}${sci ? ` (${sci})` : ""}`,
        typeHint,
        `कड़ा समय: ${threat.stage || "शुरुआती 30–45 दिन"} — इसी समय खेत साफ रखें`,
        "जड़ों / गांठों को देखकर पहचानें — हाथ से उखाड़कर अपनी फसल से तुलना करें",
        "संदेह हो तो साफ पत्तियों की फोटो AI Doctor को भेजें",
      ]
    : [
        `Name: ${name}${sci ? ` (${sci})` : ""}`,
        typeHint,
        `Critical window: ${threat.stage || "first 30–45 days"} — keep field clean then`,
        "Compare roots/tillers with your crop plants after pulling a sample",
        "If unsure, send a clear leaf photo to AI Doctor",
      ];
}

function chemicalLinesForWeed(threat: EnrichedThreat): string[] {
  const buckets = parseRemediationBuckets(
    threat.remediation.map((r) =>
      /^(pre|post)-emergence/i.test(r) ? `Chemical: ${r}` : r
    )
  );
  const fromThreat = [
    ...buckets.chemical,
    ...threat.remediation.filter((r) =>
      /pre-emergence|post-emergence|EC|WP|SC|kg|g\/|ml\/|herbicide|@/i.test(r)
    ),
  ];

  const program = getWeedProgramForCrop(threat.cropSlug);
  const fromProgram =
    program?.chemical.map((c) => {
      const parts = [
        c.technical,
        c.dose && `@ ${c.dose}`,
        c.timing && `(${c.timing})`,
        c.targets && `→ ${c.targets}`,
        c.note && `· ${c.note}`,
      ].filter(Boolean);
      return parts.join(" ");
    }) ?? [];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of [...fromThreat, ...fromProgram]) {
    const key = line.toLowerCase().replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) continue;
    if (/cultural control|maintain weed-free|follow field/i.test(key)) continue;
    seen.add(key);
    out.push(line.trim());
  }
  return out;
}

function controlSectionsForPest(
  threat: EnrichedThreat,
  hi: boolean
): { key: string; title: string; icon: typeof Sprout; items: string[] }[] {
  const buckets = parseRemediationBuckets(threat.remediation);
  const sections: { key: string; title: string; icon: typeof Sprout; items: string[] }[] = [];
  if (buckets.prevention.length) {
    sections.push({
      key: "prevention",
      title: hi ? "पहले से बचें" : "Prevention",
      icon: Shield,
      items: buckets.prevention.slice(0, 4),
    });
  }
  if (buckets.cultural.length) {
    sections.push({
      key: "cultural",
      title: hi ? "खेत का तरीका" : "Cultural control",
      icon: Sprout,
      items: buckets.cultural.slice(0, 4),
    });
  }
  // Intentionally omit empty Mechanical / Biological filler cards
  if (buckets.mechanical.length) {
    sections.push({
      key: "mechanical",
      title: hi ? "हाथ / मशीन" : "Mechanical",
      icon: Sprout,
      items: buckets.mechanical.slice(0, 4),
    });
  }
  if (buckets.biological.length) {
    sections.push({
      key: "biological",
      title: hi ? "जैविक" : "Biological",
      icon: Leaf,
      items: buckets.biological.slice(0, 4),
    });
  }
  return sections;
}

export default function ThreatDetailClient({ threat }: { threat: EnrichedThreat }) {
  const { locale } = useLocale();
  const hi = locale === "hi" || locale === "hinglish";
  const isWeed = threat.type === "weed";

  const TypeIcon = threat.type === "pest" ? Bug : threat.type === "disease" ? ShieldAlert : Leaf;
  const cropHi = getCropHindiName(threat.cropSlug);
  const riskLevel = threat.category === "insect" ? "high" : "medium";

  const weedChems = useMemo(
    () => (isWeed ? chemicalLinesForWeed(threat) : []),
    [isWeed, threat]
  );
  const pestControls = useMemo(
    () => (isWeed ? [] : controlSectionsForPest(threat, hi)),
    [isWeed, threat, hi]
  );

  const hasSpray =
    Boolean(threat.stageSprays?.length) ||
    Boolean(threat.activeIngredient) ||
    parseRemediationBuckets(threat.remediation).chemical.length > 0;

  const [pestTab, setPestTab] = useState<PestTab>("spray");

  const backHref = isWeed
    ? `/pest-diseases?type=weed&crop=${threat.cropSlug}`
    : `/pest-diseases?crop=${threat.cropSlug}`;

  const pestTabs = (
    [
      { id: "spray" as const, label: hi ? "दवा + डोज़" : "Spray + Dose", show: hasSpray },
      { id: "control" as const, label: hi ? "बिना दवा उपाय" : "Other controls", show: pestControls.length > 0 },
    ] as const
  ).filter((t) => t.show);

  const activePestTab = pestTabs.some((t) => t.id === pestTab)
    ? pestTab
    : pestTabs[0]?.id ?? "spray";

  return (
    <AppShell
      breadcrumbs={[
        { label: hi ? "होम" : "Home", href: "/" },
        { label: isWeed ? (hi ? "खरपतवार" : "Weeds") : hi ? "कीट-रोग" : "Pests", href: backHref },
        { label: threat.name },
      ]}
    >
      <header className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <TypeIcon className="h-5 w-5 text-[var(--av-accent)]" />
          <h1 className={AV.pageTitle}>{threat.name}</h1>
          <RiskBadge
            level={riskLevel}
            label={
              hi
                ? riskLevel === "high"
                  ? "ज्यादा खतरा"
                  : "मध्यम"
                : riskLevel === "high"
                  ? "High"
                  : "Medium"
            }
          />
        </div>
        {!isWeed && <p className={`italic ${AV.micro}`}>{threat.scientificName}</p>}
        <p className="text-xs text-[var(--av-text-muted)]">
          {threat.cropName}
          {cropHi ? ` (${cropHi})` : ""}
          {threat.stage ? ` · ${threat.stage}` : ""}
        </p>
      </header>

      {isWeed ? (
        <div className="mt-3 space-y-3">
          <DarkCard className="!p-3 border-emerald-500/25">
            <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
              <Eye className="h-4 w-4" />
              {hi ? "खेत में कैसे पहचानें" : "How to spot in the field"}
            </h2>
            <ul className="mt-2 space-y-2">
              {weedIdentifyTips(threat, hi).map((tip) => (
                <li
                  key={tip}
                  className="rounded-lg bg-[var(--av-surface-inset)] px-3 py-2 text-xs leading-relaxed text-[var(--av-text-secondary)]"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </DarkCard>

          <DarkCard className="!p-3 border-violet-500/20">
            <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
              <FlaskConical className="h-4 w-4" />
              {hi ? "रासायनिक दवा (टेक्निकल)" : "Chemical — technical molecules"}
            </h2>
            <p className="mt-1 text-[11px] text-[var(--av-text-muted)]">
              {hi
                ? `${threat.cropName} के लिए प्रभावी अणु / कॉम्बिनेशन। दुकान पर टेक्निकल नाम बोलें। लेबल पढ़ें।`
                : `Effective molecules / combos for ${threat.cropName}. Ask shop by technical name. Follow label.`}
            </p>
            {weedChems.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {weedChems.map((line, i) => (
                  <li key={`${line}-${i}`} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--av-accent)] text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-[var(--av-text-muted)]">
                {hi
                  ? "इस फसल के लिए स्थानीय KVK / लेबल सलाह देखें।"
                  : "Follow local KVK / CIBRC label advice for this crop."}
              </p>
            )}
          </DarkCard>
        </div>
      ) : (
        <>
          {pestTabs.length > 1 && (
            <div className="mt-3 flex gap-1 overflow-x-auto border-b border-[var(--av-border)] scrollbar-hide">
              {pestTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPestTab(t.id)}
                  className={`shrink-0 px-3 py-2.5 text-xs font-bold ${
                    activePestTab === t.id
                      ? "border-b-2 border-[var(--av-accent)] text-[var(--av-accent)]"
                      : "text-[var(--av-text-muted)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          <div className="mt-3 space-y-3">
            {activePestTab === "spray" && (
              <DarkCard className="border-violet-500/20 !p-3">
                <h2 className={`flex items-center gap-2 ${AV.sectionTitle}`}>
                  <FlaskConical className="h-4 w-4" />
                  {hi ? "दवा और मात्रा" : "Medicine & dose"}
                </h2>
                {threat.stageSprays?.length ? (
                  <div className="mt-3">
                    <StageWiseSprayCard
                      stages={threat.stageSprays}
                      rotationNotes={threat.rotationNotes}
                    />
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    {threat.activeIngredient && (
                      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-2.5">
                        <p className="text-[10px] font-bold uppercase text-violet-600">
                          {hi ? "टेक्निकल + डोज़" : "Technical + dose"}
                        </p>
                        <p className="mt-1 text-sm font-bold text-[var(--av-text-primary)]">
                          {threat.activeIngredient}
                        </p>
                      </div>
                    )}
                    {parseRemediationBuckets(threat.remediation).chemical.slice(0, 4).map((c, i) => (
                      <p key={i} className="rounded-lg bg-[var(--av-surface-inset)] px-3 py-2 text-xs">
                        {c}
                      </p>
                    ))}
                  </div>
                )}
                {(threat.etl || threat.type === "pest") && (
                  <div className="mt-3">
                    <EtlGuideCard etl={threat.etl} pestName={threat.name} compact />
                  </div>
                )}
              </DarkCard>
            )}

            {activePestTab === "control" &&
              pestControls.map((section) => {
                const Icon = section.icon;
                return (
                  <DarkCard key={section.key} className="!p-3">
                    <p className="flex items-center gap-1.5 text-xs font-bold text-[var(--av-text-primary)]">
                      <Icon className="h-3.5 w-3.5 text-[var(--av-accent)]" />
                      {section.title}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                          <span className="text-[var(--av-accent)]">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </DarkCard>
                );
              })}
          </div>
        </>
      )}

      <AppLink href="/ai-doctor" className={`mt-4 inline-flex gap-2 ${AV.btnSecondarySm}`}>
        <Sparkles className="h-4 w-4" />
        {hi ? "AI Doctor से फोटो चेक करें" : "Check photo with AI Doctor"}
      </AppLink>
    </AppShell>
  );
}
