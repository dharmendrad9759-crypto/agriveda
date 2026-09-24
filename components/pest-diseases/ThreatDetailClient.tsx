"use client";

import { useMemo, useState } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import {
  Bug,
  Leaf,
  ShieldAlert,
  Sparkles,
  Shield,
  Sprout,
  Eye,
  FlaskConical,
  ZoomIn,
  AlertTriangle,
} from "lucide-react";
import type { EnrichedThreat } from "@/types/pest-disease-ui";
import EtlGuideCard from "@/components/shell/EtlGuideCard";
import { parseRemediationBuckets, shortRotationTip } from "@/lib/pest/farmerSpray";
import { getCropHindiName } from "@/lib/crops/crop-display";
import {
  formatFarmerChemicalLine,
  formatFarmerDoseSummary,
  stripMoaCodes,
} from "@/lib/crops/farmerSprayDose";
import { bilingualAgriName } from "@/lib/crops/bilingualAgriName";
import { farmerSpeak } from "@/lib/crops/farmerSpeak";
import { farmerThreatDisplayName } from "@/lib/crops/farmerThreatTitle";
import { getWeedProgramForCrop } from "@/lib/crops/weedAbioticBridge";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getWeedStageImages, getWeedCardImage } from "@/lib/weeds/weedStageImages";
import ChemBottleThumb from "@/components/crops/ChemBottleThumb";
import CropSprayMedicineList from "@/components/crops/CropSprayMedicineList";
import { technicalFromSprayLine } from "@/lib/crops/chemBottle";
import { getCropManagementProfile } from "@/data/crop-management";
import { buildThreatSprayList } from "@/lib/crops/modernTechnicalBridge";
import ImageLightbox from "@/components/ui/ImageLightbox";

type PestTab = "identify" | "spray" | "control";

function farmerSymptomLine(s: string, hi: boolean): string {
  const cleaned = stripMoaCodes(s).trim();
  if (!cleaned) return "";
  if (!hi) return cleaned;
  return farmerSpeak(
    cleaned
      .replace(/\bDead hearts?\b/gi, "डेडहार्ट")
      .replace(/\bWhite ears?\b/gi, "सफ़ेद बालियाँ")
      .replace(/\bcentral shoot\b/gi, "बीच का तना")
      .replace(/\bempty chaffy panicle\b/gi, "खाली फूस वाली बाली")
      .replace(/\bbore holes\b/gi, "छेद")
      .replace(/\bfrass\b/gi, "कीट की विष्ठा / बुरादा")
      .replace(/\bheading\s*पर\b/gi, "बालियाँ निकलते समय")
      .replace(/\bheading\b/gi, "बालियाँ निकलते समय")
      .replace(/\bStem\b/g, "तना")
      .replace(/Grey\s*centre\s*brown\s*margin\s*वाले\s*diamond[-\s]*shaped\s*lesions/gi, "बीच धूसर / किनारा भूरा — हीरे जैसे धब्बे (Diamond spots)")
      .replace(/diamond[-\s]*shaped\s*lesions?/gi, "हीरे जैसे धब्बे")
      .replace(/Grey\s*centre\s*brown\s*margin/gi, "बीच धूसर, किनारा भूरा")
      .replace(/\bNeck\s*rot\b/gi, "गर्दन सड़न (Neck rot)")
      .replace(/blackened\s*panicle\s*neck/gi, "बाली की गर्दन काली")
      .replace(/chaffy\s*grains?/gi, "खोखले दाने")
      .replace(/\bNode\s*rot\b/gi, "गाँठ सड़न (Node rot)")
      .replace(/plant\s*breakage/gi, "पौधा टूटना")
      .replace(/\blesions?\b/gi, "धब्बे")
  );
}

function splitDisplayName(name: string): { primary: string; secondary?: string } {
  const m = name.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (m?.[1] && m[2]) return { primary: m[1].trim(), secondary: m[2].trim() };
  return { primary: name };
}

function weedIdentifyTips(threat: EnrichedThreat, hi: boolean): string[] {
  const name = hi && threat.nameHi ? threat.nameHi : threat.name;
  const sci = threat.scientificName;
  const typeHint = /sedge|cyperus/i.test(`${name} ${sci}`)
    ? hi
      ? "तनों के कोने तीखे — घास जैसी लेकिन किनारे तेज"
      : "Triangular stems — grass-like but sharp edges"
    : /broad|leaf|monochoria|amaranth|कुंदरू|पत्ती/i.test(`${name} ${sci}`)
      ? hi
        ? "चौड़ी पत्तियाँ — फसल से अलग दिखती हैं"
        : "Broad leaves — stands out from the crop"
      : hi
        ? "पतली पत्ती / घास जैसी — फसल में मिल जाती है"
        : "Narrow grassy leaves — mixes with the crop";

  return hi
    ? [
        typeHint,
        `कड़ा समय: ${threat.stage || "2–4 पत्ती / शुरू के 30–45 दिन"}`,
        "जड़ या गांठ निकालकर अपनी फसल से मिलाओ",
        "शक हो तो साफ फोटो AI Doctor को भेजो",
      ]
    : [
        typeHint,
        `Critical: ${threat.stage || "2–4 leaf / first 30–45 days"}`,
        "Pull root/tiller and compare with your crop",
        "If unsure, send a clear photo to AI Doctor",
      ];
}

function weedChemCards(lines: string[], hi: boolean): {
  technical: string;
  dose: string;
  stage: string;
  timing: string;
}[] {
  return lines.slice(0, 4).map((line) => {
    const formatted = formatFarmerChemicalLine(line, hi);
    const doseMatch =
      formatted.match(
        /(\d+(?:\.\d+)?(?:\s*[–\-]\s*\d+(?:\.\d+)?)?\s*(?:ml|g)(?:\/लीटर\s*पानी|\/L\s*water))/i
      ) || formatted.match(/@\s*([^—(·]+)/i);
    const stageMatch = line.match(/\(([^)]+)\)/);
    const technical = stripMoaCodes(
      formatted
        .split(/·|@/)[0]
        ?.replace(/^Chemical:\s*/i, "")
        .replace(/—.*$/, "")
        .trim() || formatted.slice(0, 40)
    );
    return {
      technical: technical.slice(0, 48),
      dose: doseMatch?.[1]?.trim() || doseMatch?.[0]?.trim() || (hi ? "लेबल अनुसार" : "Follow label"),
      stage: hi ? "2–4 पत्ती अवस्था" : "2–4 leaf stage",
      timing: stripMoaCodes(stageMatch?.[1]?.trim() || (hi ? "15–25 दिन" : "15–25 DAS")),
    };
  });
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

  const program =
    getCropManagementProfile(threat.cropSlug)?.weedProgram ??
    getWeedProgramForCrop(threat.cropSlug);
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
  const speak = (line: string) => (hi ? farmerSpeak(stripMoaCodes(line)) : stripMoaCodes(line));
  const sections: { key: string; title: string; icon: typeof Sprout; items: string[] }[] = [];
  if (buckets.prevention.length) {
    sections.push({
      key: "prevention",
      title: hi ? "पहले से बचाव (Prevention)" : "Prevention",
      icon: Shield,
      items: buckets.prevention.slice(0, 4).map(speak),
    });
  }
  if (buckets.cultural.length) {
    sections.push({
      key: "cultural",
      title: hi ? "खेत का तरीका (Cultural)" : "Cultural control",
      icon: Sprout,
      items: buckets.cultural.slice(0, 4).map(speak),
    });
  }
  if (buckets.mechanical.length) {
    sections.push({
      key: "mechanical",
      title: hi ? "हाथ / मशीन से (Mechanical)" : "Mechanical",
      icon: Sprout,
      items: buckets.mechanical.slice(0, 4).map(speak),
    });
  }
  if (buckets.biological.length) {
    sections.push({
      key: "biological",
      title: hi ? "मित्र जीव से (Biological)" : "Biological",
      icon: Leaf,
      items: buckets.biological.slice(0, 4).map(speak),
    });
  }
  return sections;
}

export default function ThreatDetailClient({ threat }: { threat: EnrichedThreat }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const isWeed = threat.type === "weed";
  const isPest = threat.type === "pest";

  const TypeIcon = isPest ? Bug : threat.type === "disease" ? ShieldAlert : Leaf;
  const cropHi = getCropHindiName(threat.cropSlug);
  const riskHigh = threat.category === "insect" || isPest;
  const names = (() => {
    const soft = farmerThreatDisplayName(
      isWeed && threat.nameHi ? `${threat.nameHi} (${threat.name})` : threat.name,
      threat.scientificName
    );
    if (soft.primary) {
      return { primary: soft.primary, secondary: soft.english };
    }
    return splitDisplayName(
      isWeed && hi && threat.nameHi ? threat.nameHi : threat.name
    );
  })();

  const weedChems = useMemo(
    () => (isWeed ? chemicalLinesForWeed(threat) : []),
    [isWeed, threat]
  );
  const pestControls = useMemo(
    () => (isWeed ? [] : controlSectionsForPest(threat, hi)),
    [isWeed, threat, hi]
  );

  const sprayProducts = useMemo(
    () =>
      buildThreatSprayList({
        profile: getCropManagementProfile(threat.cropSlug),
        type: threat.type,
        name: threat.name,
        scientific: threat.scientificName,
        stageSprays: threat.stageSprays,
        hi,
      }),
    [threat.cropSlug, threat.type, threat.name, threat.scientificName, threat.stageSprays, hi]
  );

  const rotationTip = useMemo(
    () => shortRotationTip(stripMoaCodes(threat.rotationNotes || "") || undefined, hi),
    [threat.rotationNotes, hi]
  );

  const hasSpray =
    Boolean(threat.stageSprays?.length) ||
    Boolean(threat.activeIngredient) ||
    parseRemediationBuckets(threat.remediation).chemical.length > 0 ||
    sprayProducts.length > 0;

  const identifyTips = useMemo(() => {
    if (isWeed) return [];
    const fromSymptoms = (threat.symptoms || [])
      .map((s) => farmerSymptomLine(s, hi))
      .filter(Boolean);
    if (fromSymptoms.length) return fromSymptoms.slice(0, 6);
    const desc = farmerSymptomLine(threat.description || "", hi);
    return desc ? [desc] : [];
  }, [isWeed, threat.symptoms, threat.description, hi]);

  const defaultPestTab: PestTab = identifyTips.length
    ? "identify"
    : hasSpray
      ? "spray"
      : "control";
  const [pestTab, setPestTab] = useState<PestTab>(defaultPestTab);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const chemCards = useMemo(() => weedChemCards(weedChems, hi), [weedChems, hi]);

  const farmerChemLines = useMemo(() => {
    if (isWeed) return [];
    return parseRemediationBuckets(threat.remediation)
      .chemical.slice(0, 6)
      .map((c) => formatFarmerChemicalLine(c, hi));
  }, [isWeed, threat.remediation, hi]);

  const farmerAiDose = useMemo(() => {
    if (!threat.activeIngredient) return null;
    return formatFarmerDoseSummary(threat.activeIngredient, "", hi);
  }, [threat.activeIngredient, hi]);

  const cropTab =
    threat.type === "weed"
      ? "weeds"
      : threat.type === "disease"
        ? "diseases"
        : "pests";
  const backHref = `/crops/${threat.cropSlug}/care/${cropTab}`;
  const cropListLabel = cropHi
    ? `${threat.cropName} (${cropHi})`
    : threat.cropName;

  const pestTabs = (
    [
      {
        id: "identify" as const,
        label: hi ? "पहचान" : "ID",
        show: identifyTips.length > 0,
      },
      { id: "spray" as const, label: hi ? "दवा" : "Spray", show: hasSpray },
      {
        id: "control" as const,
        label: hi ? "बिना दवा" : "Other",
        show: pestControls.length > 0,
      },
    ] as const
  ).filter((t) => t.show);

  const activePestTab = pestTabs.some((t) => t.id === pestTab)
    ? pestTab
    : pestTabs[0]?.id ?? "spray";

  return (
    <AppShell
      backHref={backHref}
      breadcrumbs={[
        { label: hi ? "होम" : "Home", href: "/" },
        { label: cropListLabel, href: `/crops/${threat.cropSlug}` },
        {
          label: isWeed ? (hi ? "खरपतवार" : "Weeds") : hi ? "कीट-रोग" : "Pests",
          href: backHref,
        },
        { label: names.primary },
      ]}
    >
      {/* ─── PEST / DISEASE — field dossier ─── */}
      {!isWeed ? (
        <div className="mx-auto w-full max-w-2xl space-y-5">
          {/* Photo plane — chips only, title lives below */}
          <button
            type="button"
            onClick={() => setLightbox(threat.image)}
            className="group relative block w-full overflow-hidden rounded-[1.5rem] text-left ring-1 ring-black/[0.06] active:scale-[0.997]"
          >
            <div className="relative aspect-[5/3] w-full sm:aspect-[2/1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={threat.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(6,40,24,0.55)_0%,transparent_55%)]" />
              <span className="absolute left-0 top-0 h-full w-[3px] bg-emerald-500" />
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-950 shadow-sm">
                  <TypeIcon className="h-3 w-3" />
                  {isPest ? (hi ? "कीट" : "Pest") : hi ? "रोग" : "Disease"}
                </span>
                <span
                  className={
                    riskHigh
                      ? "inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm"
                      : "inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-amber-950 shadow-sm"
                  }
                >
                  <AlertTriangle className="h-3 w-3" />
                    {hi
                    ? riskHigh
                      ? "ज्यादा खतरा (High)"
                      : "मध्यम (Medium)"
                    : riskHigh
                      ? "High"
                      : "Medium"}
                </span>
              </div>
              <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-emerald-950 shadow-md backdrop-blur-sm transition group-hover:bg-white">
                <ZoomIn className="h-4 w-4" />
              </span>
            </div>
          </button>

          {/* Title block — name + scientific only */}
          <header className="space-y-2 px-0.5">
            <h1 className="font-display text-[1.85rem] font-bold leading-[1.12] tracking-tight text-[var(--av-text-primary)] sm:text-[2.15rem]">
              {names.primary}
            </h1>
            {names.secondary ? (
              <p className="text-[15px] font-semibold text-[var(--av-text-secondary)]">
                {names.secondary}
              </p>
            ) : null}
            {threat.scientificName ? (
              <p className="text-[12px] italic text-[var(--av-text-muted)]">
                {threat.scientificName}
              </p>
            ) : null}
          </header>

          {/* Segmented field tabs */}
          {pestTabs.length > 1 ? (
            <div
              role="tablist"
              className="grid gap-1 rounded-2xl bg-[var(--av-surface-inset)] p-1"
              style={{
                gridTemplateColumns: `repeat(${pestTabs.length}, minmax(0, 1fr))`,
              }}
            >
              {pestTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={activePestTab === t.id}
                  onClick={() => setPestTab(t.id)}
                  className={
                    activePestTab === t.id
                      ? "rounded-[0.9rem] bg-[var(--av-surface)] px-2 py-2.5 text-[13px] font-bold text-[var(--av-text-primary)] shadow-[0_8px_20px_-12px_rgba(0,0,0,0.4)]"
                      : "rounded-[0.9rem] px-2 py-2.5 text-[13px] font-semibold text-[var(--av-text-muted)]"
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          ) : null}

          {activePestTab === "identify" ? (
            <section className="space-y-3">
              <div className="flex items-end justify-between gap-2">
                <h2 className="font-display text-[1.2rem] font-bold tracking-tight text-[var(--av-text-primary)]">
                  {hi ? "खेत में कैसे दिखे" : "How it shows in field"}
                </h2>
                <Eye className="mb-1 h-5 w-5 text-emerald-800/45" />
              </div>
              <ol className="space-y-0">
                {identifyTips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex gap-3 border-t border-[var(--av-border)] py-3 first:border-t-0 first:pt-0"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-950 text-[11px] font-black text-emerald-100">
                      {i + 1}
                    </span>
                    <p className="min-w-0 flex-1 pt-0.5 text-[13px] leading-snug text-[var(--av-text-secondary)]">
                      {tip}
                    </p>
                  </li>
                ))}
              </ol>
              {hasSpray ? (
                <button
                  type="button"
                  onClick={() => setPestTab("spray")}
                  className="w-full rounded-2xl border border-emerald-800/15 bg-emerald-950/[0.04] px-4 py-3 text-[13px] font-bold text-emerald-950 dark:text-emerald-100"
                >
                  {hi ? "दवा और मात्रा देखें →" : "See medicine & dose →"}
                </button>
              ) : null}
            </section>
          ) : null}

          {activePestTab === "spray" ? (
            <section className="space-y-3">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <h2 className="font-display text-[1.2rem] font-bold tracking-tight text-[var(--av-text-primary)]">
                    {hi ? "दवा और मात्रा" : "Medicine & dose"}
                  </h2>
                  <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
                    {hi
                      ? "ऊपर वाली पहली पसंद से शुरू करें"
                      : "Start with the first pick"}
                  </p>
                </div>
                <FlaskConical className="mb-1 h-5 w-5 text-emerald-800/45" />
              </div>

              {sprayProducts.length > 0 ? (
                <CropSprayMedicineList products={sprayProducts} hi={hi} initialVisible={3} />
              ) : (
                <div className="space-y-2">
                  {farmerAiDose ? (
                    <div className="flex overflow-hidden rounded-2xl border border-emerald-800/15 bg-[var(--av-surface)]">
                      <ChemBottleThumb
                        technical={technicalFromSprayLine(farmerAiDose)}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1 px-3 py-2.5">
                        <p className="text-[10px] font-bold text-emerald-800">
                          {hi ? "विकल्प 1" : "Option 1"}
                        </p>
                        <p className="mt-1 text-sm font-bold text-[var(--av-text-primary)]">
                          {farmerAiDose}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {farmerChemLines.map((c, i) => (
                    <div
                      key={i}
                      className="flex overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]"
                    >
                      <ChemBottleThumb technical={technicalFromSprayLine(c)} size="sm" />
                      <p className="min-w-0 flex-1 px-3 py-2.5 text-xs leading-snug text-[var(--av-text-secondary)]">
                        <span className="mr-1 font-bold text-[var(--av-text-primary)]">
                          {farmerAiDose ? i + 2 : i + 1}.
                        </span>
                        {c}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {rotationTip ? (
                <p className="rounded-2xl border border-amber-600/20 bg-amber-50 px-3 py-2.5 text-[11px] font-medium leading-snug text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
                  {rotationTip}
                </p>
              ) : null}

              {(threat.etl || isPest) && (
                <div className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]">
                  <EtlGuideCard etl={threat.etl} pestName={names.primary} compact />
                </div>
              )}
            </section>
          ) : null}

          {activePestTab === "control" ? (
            <section className="space-y-3">
              <h2 className="font-display text-[1.2rem] font-bold tracking-tight text-[var(--av-text-primary)]">
                {hi ? "बिना दवा के उपाय" : "Non-chemical controls"}
              </h2>
              {pestControls.map((section, si) => {
                const Icon = section.icon;
                return (
                  <div key={section.key} className="border-l-[3px] border-emerald-600/40 pl-3.5">
                    <p className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--av-text-primary)]">
                      <Icon className="h-3.5 w-3.5 text-emerald-800" />
                      {si + 1}. {section.title}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {section.items.map((item, i) => (
                        <li
                          key={i}
                          className="text-[12px] leading-snug text-[var(--av-text-secondary)]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </section>
          ) : null}

          <AppLink
            href="/ai-doctor"
            className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-950 px-4 py-3.5 text-white shadow-[0_16px_36px_-20px_rgba(6,78,59,0.85)]"
          >
            <span className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/20">
                <Sparkles className="h-4 w-4 text-emerald-300" />
              </span>
              <span>
                <span className="block text-[13px] font-bold">
                  {hi ? "फोटो से पहचान चेक करें" : "Check with a photo"}
                </span>
                <span className="block text-[10px] font-medium text-emerald-100/70">
                  {hi ? "AI Doctor · खेत की फोटो भेजो" : "AI Doctor · send a field photo"}
                </span>
              </span>
            </span>
            <span className="text-[11px] font-bold text-emerald-300">→</span>
          </AppLink>
        </div>
      ) : (
        /* ─── WEED PATH (kept, lightly cleaned) ─── */
        <div className="mt-1 space-y-3.5">
          {(() => {
            const stages = getWeedStageImages(threat.scientificName);
            const soft = farmerThreatDisplayName(
              threat.nameHi ? `${threat.nameHi} (${threat.name})` : threat.name,
              threat.scientificName
            );
            const displayName = soft.primary;
            const displaySecondary = soft.english;
            const heroSrc =
              stages?.late ||
              stages?.early ||
              getWeedCardImage(threat.scientificName) ||
              "/images/threats/threat-weed.jpg";
            return (
              <>
                <div className="relative min-h-[152px] overflow-hidden rounded-[1.35rem] border border-lime-500/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroSrc}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-r from-lime-950/90 via-black/55 to-transparent" />
                  <div className="relative z-10 flex min-h-[152px] flex-col justify-between p-4">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-lime-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-lime-950">
                      <Leaf className="h-3 w-3" />
                      {hi ? "खरपतवार" : "Weed"}
                    </span>
                    <div>
                      <p className="font-display text-[22px] font-bold leading-tight text-white">
                        {displayName}
                      </p>
                      {displaySecondary ? (
                        <p className="mt-0.5 text-[13px] font-semibold text-white/85">
                          {displaySecondary}
                        </p>
                      ) : null}
                      {threat.scientificName ? (
                        <p className="mt-1 text-[11px] font-medium italic text-white/75">
                          {threat.scientificName}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {stages ? (
                  <div>
                    <p className="mb-2 px-0.5 text-sm font-bold text-[var(--av-text-primary)]">
                      {hi ? "दो अवस्था — टैप करो, बड़ा देखो" : "2 stages — tap to enlarge"}
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {(
                        [
                          {
                            key: "early",
                            src: stages.early,
                            titleHi: "छोटा पौधा",
                            titleEn: "Young plant",
                            ring: "border-emerald-400/40",
                            badge: "bg-emerald-500 text-white",
                            tint: "from-emerald-950/85 via-emerald-950/35 to-transparent",
                            n: "1",
                          },
                          {
                            key: "late",
                            src: stages.late,
                            titleHi: "बड़ा पौधा",
                            titleEn: "Grown plant",
                            ring: "border-amber-400/40",
                            badge: "bg-amber-400 text-amber-950",
                            tint: "from-amber-950/85 via-amber-950/40 to-transparent",
                            n: "2",
                          },
                        ] as const
                      ).map((s) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setLightbox(s.src)}
                          className={`relative min-h-[158px] overflow-hidden rounded-2xl border text-left ${s.ring} active:scale-[0.99]`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.src}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <span className={`absolute inset-0 bg-gradient-to-t ${s.tint}`} />
                          <span
                            className={`absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-black shadow ${s.badge}`}
                          >
                            {s.n}
                          </span>
                          <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                            <ZoomIn className="h-4 w-4" />
                          </span>
                          <div className="relative z-10 flex h-full min-h-[158px] flex-col justify-end p-3">
                            <p className="text-[15px] font-extrabold text-white">
                              {hi ? s.titleHi : s.titleEn}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            );
          })()}

          <div>
            <p className="mb-2 flex items-center gap-1.5 px-0.5 text-sm font-bold text-[var(--av-text-primary)]">
              <Eye className="h-4 w-4 text-emerald-600" />
              {hi ? "खेत में कैसे पहचानें" : "How to spot in the field"}
            </p>
            <ul className="space-y-2">
              {weedIdentifyTips(threat, hi).map((tip, i) => (
                <li
                  key={tip}
                  className="flex gap-3 overflow-hidden rounded-2xl border border-emerald-500/20 bg-[var(--av-surface)] p-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-sm font-black text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-[13px] font-semibold leading-snug text-[var(--av-text-primary)]">
                    {tip}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 px-0.5 text-sm font-bold text-[var(--av-text-primary)]">
              <FlaskConical className="h-4 w-4 text-emerald-700" />
              {hi ? "रासायनिक दवा" : "Chemical spray"}
            </p>
            {chemCards.length > 0 ? (
              <ul className="space-y-2.5">
                {chemCards.map((card, i) => (
                  <li
                    key={`${card.technical}-${i}`}
                    className="flex gap-3 overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)]"
                  >
                    <div className="relative shrink-0 overflow-hidden bg-emerald-50">
                      <ChemBottleThumb technical={card.technical} size="sm" />
                    </div>
                    <div className="min-w-0 flex-1 py-3 pr-3">
                      <p className="text-[10px] font-bold tracking-wide text-emerald-800">
                        {hi ? `विकल्प ${i + 1}` : `Option ${i + 1}`}
                      </p>
                      <p className="mt-0.5 text-[14px] font-extrabold leading-snug text-[var(--av-text-primary)]">
                        {hi ? bilingualAgriName(card.technical) : card.technical}
                      </p>
                      <p className="mt-1.5 text-[12px] font-bold text-emerald-800">
                        {hi ? "खुराक" : "Dose"}: {card.dose}
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold text-[var(--av-text-secondary)]">
                        {hi ? "अवस्था" : "Stage"}: {card.stage}
                      </p>
                      <p className="text-[11px] font-medium text-[var(--av-text-muted)]">
                        {hi ? "कब" : "When"}: {card.timing}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-dashed border-[var(--av-border)] px-3 py-4 text-center text-xs text-[var(--av-text-muted)]">
                {hi
                  ? "इस फसल के लिए स्थानीय KVK / लेबल सलाह देखें।"
                  : "Follow local KVK / label advice for this crop."}
              </p>
            )}
          </div>

          <AppLink
            href="/ai-doctor"
            className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-950 px-4 py-3.5 text-white"
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              <span className="text-[13px] font-bold">
                {hi ? "AI Doctor से फोटो चेक करें" : "Check photo with AI Doctor"}
              </span>
            </span>
            <span className="text-emerald-300">→</span>
          </AppLink>
        </div>
      )}

      <ImageLightbox
        src={lightbox}
        onClose={() => setLightbox(null)}
        closeLabel={hi ? "बंद करें" : "Close"}
      />
    </AppShell>
  );
}
