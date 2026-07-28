"use client";

import { useMemo, useState } from "react";
import { Search, Shield, Bug, Eye, Droplets } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import RiskBadge from "@/components/shell/RiskBadge";
import { ShellTabBar } from "@/components/shell/AppShell";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getIpmPestListForCrop } from "@/lib/crops/ipmDataBridge";
import { getCropFieldGuidePestListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getEnrichedCropThreats } from "@/lib/pest-disease-catalog";
import type { Crop } from "@/types/crop";
import { AV } from "@/lib/design/tokens";

type IpmTab = "prevention" | "chemical" | "monitoring" | "cultural" | "biological";

const IPM_ORDER: IpmTab[] = ["prevention", "chemical", "monitoring", "cultural", "biological"];

function tipText(item: unknown): string {
  if (typeof item === "string") return item.replace(/^(Prevention|Monitoring|Cultural|Biological|Chemical):\s*/i, "").trim();
  if (item && typeof item === "object") {
    const c = item as { technical?: string; dose?: string; note?: string };
    if (c.technical) {
      return `${c.technical}${c.dose ? ` — ${c.dose}` : ""}${c.note ? ` · ${c.note}` : ""}`;
    }
  }
  return "";
}

function farmerEtl(etl: string | undefined, isHi: boolean): string {
  if (!etl) return isHi ? "हफ्ते में एक बार पत्ते/फल देखें" : "Scout leaves/fruits weekly";
  return etl
    .replace(/\bETL\b:?/gi, isHi ? "स्प्रे कब:" : "Spray when:")
    .replace(/\bIRAC\b/gi, "")
    .trim();
}

function fallbackTips(tab: IpmTab, pestName: string, isHi: boolean): string[] {
  if (isHi) {
    const map: Record<IpmTab, string[]> = {
      prevention: [
        "साफ बीज / नर्सरी से शुरू करें",
        "खरपतवार और पुरानी फसल के अवशेष हटाएँ",
        `${pestName} के अनुकूल मौसम में ज्यादा निगरानी रखें`,
      ],
      chemical: [
        "केवल नुकसान दिखे / सीमा पार हो तो स्प्रे करें",
        "लेबल पर लिखी मात्रा (ml या g / लीटर या एकड़) ही दें",
        "एक ही दवा बार-बार न दोहराएँ — बदलकर स्प्रे करें",
      ],
      monitoring: [
        "सुबह खेत घूमें — पत्ती के नीचे और फल चेक करें",
        "पीले/नीले स्टिकी ट्रैप लगाएँ जहाँ ज़रूरी हो",
      ],
      cultural: [
        "फसल चक्र अपनाएँ",
        "संक्रमित फल/पौधे तोड़कर नष्ट करें",
      ],
      biological: [
        "नीम तेल / जैविक दवा पहले आज़माएँ",
        "मित्र कीट (लेडीबर्ड आदि) बचाएँ — ज़रूरत से ज़्यादा स्प्रे न करें",
      ],
    };
    return map[tab];
  }
  const map: Record<IpmTab, string[]> = {
    prevention: ["Clean seed/nursery", "Remove weeds & crop trash", `Watch weather favouring ${pestName}`],
    chemical: ["Spray only at damage/threshold", "Use label dose only", "Rotate chemistry — don't repeat same spray"],
    monitoring: ["Scout weekly — underside of leaves & fruits", "Use sticky traps where useful"],
    cultural: ["Rotate crops", "Remove & destroy damaged fruits/plants"],
    biological: ["Try neem / bio options first", "Protect beneficial insects"],
  };
  return map[tab];
}

export default function CropPestsSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const [search, setSearch] = useState("");
  const [ipmTab, setIpmTab] = useState<IpmTab>("prevention");
  const [selectedPestId, setSelectedPestId] = useState<string | null>(null);

  const labels: Record<IpmTab, string> = {
    prevention: isHi ? "रोकथाम" : "Prevention",
    chemical: isHi ? "दवाई (स्प्रे)" : "Chemical",
    monitoring: isHi ? "निगरानी" : "Watch",
    cultural: isHi ? "खेती तरीका" : "Field practice",
    biological: isHi ? "जैविक" : "Bio",
  };

  const ipmPests = useMemo(() => getIpmPestListForCrop(crop.slug), [crop.slug]);
  const fieldGuidePests = useMemo(() => getCropFieldGuidePestListForCrop(crop.slug), [crop.slug]);
  const catalogPests = useMemo(() => getEnrichedCropThreats(crop.slug).filter((t) => t.type === "pest"), [crop.slug]);

  const pests = fieldGuidePests.length
    ? fieldGuidePests
    : ipmPests.length
      ? ipmPests
      : catalogPests.map((p) => ({
          id: p.id,
          name: p.name,
          scientific: p.scientificName,
          desc: p.description,
          damage: p.symptoms[0]?.slice(0, 60) ?? "—",
          spread: p.iracGroup ?? "—",
          loss: "Yield loss if untreated",
          etl: p.etl,
          attackStage: p.stage,
          monitoring: "Weekly scout",
          risk: "high" as const,
          ipm: {
            prevention: p.remediation.filter((r) => r.startsWith("Prevention")),
            monitoring: p.remediation.filter((r) => r.startsWith("Monitoring")),
            cultural: p.remediation.filter((r) => r.startsWith("Cultural")),
            biological: p.remediation.filter((r) => r.startsWith("Biological")),
            chemical: [] as string[],
          },
        }));

  const filtered = pests.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.scientific || "").toLowerCase().includes(search.toLowerCase())
  );

  const activePest = filtered.find((p) => p.id === selectedPestId) ?? filtered[0];

  const ipmTips = useMemo(() => {
    if (!activePest?.ipm) return fallbackTips(ipmTab, activePest?.name ?? "pest", isHi);
    const raw = activePest.ipm[ipmTab as keyof typeof activePest.ipm];
    const list = Array.isArray(raw) ? raw.map(tipText).filter(Boolean) : [];
    return list.length ? list : fallbackTips(ipmTab, activePest.name, isHi);
  }, [activePest, ipmTab, isHi]);

  const topWatch = pests[0]?.name ?? (isHi ? "साप्ताहिक जाँच" : "Weekly scout");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          icon={Bug}
          iconColor="text-red-500"
          label={isHi ? "मुख्य कीट" : "Main pests"}
          value={`${pests.length}`}
          sub={isHi ? "इस फसल पर" : "on this crop"}
        />
        <StatCard
          icon={Eye}
          iconColor="text-amber-500"
          label={isHi ? "सबसे पहले देखें" : "Watch first"}
          value={topWatch}
        />
        <StatCard
          icon={Droplets}
          label={isHi ? "स्प्रे नियम" : "Spray rule"}
          value={isHi ? "नुकसान दिखे तब" : "Only at damage"}
          sub={isHi ? "रोजाना कैलेंडर स्प्रे नहीं" : "Not calendar spray"}
        />
      </div>

      <DarkCard>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isHi ? "कीट खोजें..." : "Search pest..."}
            className="av-input py-2.5 pl-10"
          />
        </div>
      </DarkCard>

      <div className="space-y-2.5">
        {filtered.map((pest, i) => {
          const pinpoint =
            (pest as { damage?: string }).damage ||
            pest.desc?.split(/[.।]/)[0] ||
            "";
          return (
            <DarkCard
              key={pest.id}
              hover
              delay={i}
              className={selectedPestId === pest.id ? "ring-1 ring-[var(--av-accent)]" : ""}
            >
              <button type="button" className="w-full text-left" onClick={() => setSelectedPestId(pest.id)}>
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                    <Bug className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{pest.name}</h3>
                      <RiskBadge level={pest.risk} />
                    </div>
                    {pest.scientific && (
                      <p className="text-[10px] text-[var(--av-text-muted)]">({pest.scientific})</p>
                    )}
                    <p className="mt-1.5 text-xs leading-snug text-[var(--av-text-secondary)] line-clamp-2">
                      {pinpoint}
                    </p>
                    <p className="mt-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      {farmerEtl(pest.etl, isHi)}
                    </p>
                    {(pest as { attackStage?: string }).attackStage && (
                      <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">
                        {isHi ? "स्टेज:" : "Stage:"} {(pest as { attackStage?: string }).attackStage}
                      </p>
                    )}
                  </div>
                </div>
              </button>
              <AppLink
                href={`/pest-diseases/${crop.slug}/pest/${pest.id}`}
                className={`mt-2 inline-flex ${AV.btnSecondarySm}`}
              >
                {isHi ? "पूरी जानकारी →" : "Full detail →"}
              </AppLink>
            </DarkCard>
          );
        })}
      </div>

      {activePest && (
        <DarkCard delay={2}>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--av-accent)]" />
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
              {isHi ? "क्या करें" : "What to do"} — {activePest.name}
            </h3>
          </div>
          <ShellTabBar
            tabs={IPM_ORDER.map((k) => ({ id: k, label: labels[k] }))}
            active={ipmTab}
            onChange={setIpmTab}
          />
          <ul className="mt-1 space-y-2">
            {ipmTips.map((tip) => (
              <li key={tip} className="flex gap-2 text-xs leading-snug text-[var(--av-text-secondary)]">
                <span className="mt-0.5 text-[var(--av-accent)]">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </DarkCard>
      )}
    </div>
  );
}
