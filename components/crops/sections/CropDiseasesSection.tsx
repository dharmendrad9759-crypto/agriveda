"use client";

import { useMemo, useState } from "react";
import { Search, ShieldAlert, AlertTriangle, Eye, Droplets } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import RiskBadge from "@/components/shell/RiskBadge";
import { ShellTabBar } from "@/components/shell/AppShell";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getIpmDiseaseListForCrop } from "@/lib/crops/ipmDataBridge";
import { getCropFieldGuideDiseaseListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getEnrichedCropThreats } from "@/lib/pest-disease-catalog";
import type { Crop } from "@/types/crop";
import { AV } from "@/lib/design/tokens";

type MgmtTab = "prevention" | "chemical" | "monitoring" | "cultural" | "biological";

const MGMT_ORDER: MgmtTab[] = ["prevention", "chemical", "monitoring", "cultural", "biological"];

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

function fallbackTips(tab: MgmtTab, name: string, isHi: boolean): string[] {
  if (isHi) {
    const map: Record<MgmtTab, string[]> = {
      prevention: [
        "रोगमुक्त बीज / नर्सरी लें",
        "खेत में पानी जमा न रहने दें",
        `${name} वाले मौसम में निगरानी बढ़ाएँ`,
      ],
      chemical: [
        "लक्षण दिखते ही सही दवाई — लेबल मात्रा",
        "एक ही दवा बार-बार न दोहराएँ",
        "कटाई से पहले PHI (इंतज़ार दिन) पूरा करें",
      ],
      monitoring: ["नीचे की पत्तियाँ और फल रोज/हफ्ते में देखें", "गीला मौसम = ज्यादा खतरा"],
      cultural: ["संक्रमित पत्ते/फल हटाएँ", "फसल चक्र अपनाएँ"],
      biological: ["ट्राइकोडर्मा / स्यूडोमोनास बीज या मिट्टी में", "नीम आधारित विकल्प पहले"],
    };
    return map[tab];
  }
  const map: Record<MgmtTab, string[]> = {
    prevention: ["Clean seed/nursery", "Avoid standing water", `Scout more when weather favours ${name}`],
    chemical: ["Spray at first symptoms — label dose", "Rotate fungicides", "Respect pre-harvest interval"],
    monitoring: ["Check lower leaves & fruits weekly", "Wet weather = higher risk"],
    cultural: ["Remove infected parts", "Rotate crops"],
    biological: ["Trichoderma / Pseudomonas where useful", "Neem options first"],
  };
  return map[tab];
}

export default function CropDiseasesSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const isHi = locale === "hi";
  const [search, setSearch] = useState("");
  const [mgmtTab, setMgmtTab] = useState<MgmtTab>("prevention");

  const labels: Record<MgmtTab, string> = {
    prevention: isHi ? "रोकथाम" : "Prevention",
    chemical: isHi ? "दवाई (स्प्रे)" : "Chemical",
    monitoring: isHi ? "निगरानी" : "Watch",
    cultural: isHi ? "खेती तरीका" : "Field practice",
    biological: isHi ? "जैविक" : "Bio",
  };

  const ipmDiseases = useMemo(() => getIpmDiseaseListForCrop(crop.slug), [crop.slug]);
  const fieldGuideDiseases = useMemo(() => getCropFieldGuideDiseaseListForCrop(crop.slug), [crop.slug]);
  const catalogDiseases = useMemo(
    () => getEnrichedCropThreats(crop.slug).filter((t) => t.type === "disease"),
    [crop.slug]
  );

  const diseases = fieldGuideDiseases.length
    ? fieldGuideDiseases
    : ipmDiseases.length
      ? ipmDiseases
      : catalogDiseases.map((d) => ({
          id: d.id,
          name: d.name,
          scientific: d.pathogen ?? d.scientificName,
          risk: d.category === "viral" ? ("high" as const) : ("medium" as const),
          type: d.category,
          desc: d.description,
          conditions: d.symptoms[0],
          ipm: {
            prevention: d.remediation.filter((r) => r.startsWith("Prevention")),
            monitoring: [] as string[],
            cultural: d.remediation.filter((r) => r.startsWith("Cultural")),
            biological: [] as string[],
            chemical: [] as string[],
          },
          fracNote: d.fracGroup,
        }));

  const filtered = diseases.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  const [selected, setSelected] = useState(filtered[0]?.id ?? "");
  const detail = filtered.find((d) => d.id === selected) ?? filtered[0];

  const mgmtTips = useMemo(() => {
    if (!detail?.ipm) return fallbackTips(mgmtTab, detail?.name ?? "disease", isHi);
    const raw = detail.ipm[mgmtTab as keyof typeof detail.ipm];
    const list = Array.isArray(raw) ? raw.map(tipText).filter(Boolean) : [];
    return list.length ? list : fallbackTips(mgmtTab, detail.name, isHi);
  }, [detail, mgmtTab, isHi]);

  const viralCount = diseases.filter((d) => /viral|virus|yvm|leaf curl/i.test(`${d.name} ${(d as { type?: string }).type ?? ""}`)).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          icon={ShieldAlert}
          label={isHi ? "मुख्य रोग" : "Main diseases"}
          value={`${diseases.length}`}
          sub={isHi ? "इस फसल पर" : "on this crop"}
        />
        <StatCard
          icon={AlertTriangle}
          iconColor="text-red-500"
          label={isHi ? "वायरस सावधानी" : "Virus caution"}
          value={viralCount ? (isHi ? "कीट रोकें" : "Stop vectors") : isHi ? "सामान्य" : "Normal watch"}
          sub={isHi ? "वायरस का सीधा इलाज नहीं" : "No direct virus cure"}
        />
        <StatCard
          icon={Eye}
          iconColor="text-amber-500"
          label={isHi ? "सबसे पहले" : "Watch first"}
          value={diseases[0]?.name ?? (isHi ? "साप्ताहिक जाँच" : "Weekly scout")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-1">
          <DarkCard>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isHi ? "रोग खोजें..." : "Search disease..."}
                className="av-input py-2 pl-9"
              />
            </div>
          </DarkCard>
          {filtered.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelected(d.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                selected === d.id
                  ? "border-[var(--av-accent)] bg-[var(--av-accent-soft)]"
                  : "border-[var(--av-border)] bg-[var(--av-surface)] hover:border-[var(--av-accent)]/30"
              }`}
            >
              <ShieldAlert className="h-6 w-6 shrink-0 text-[var(--av-accent)]" />
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-[var(--av-text-primary)]">{d.name}</p>
                <RiskBadge level={d.risk} />
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-4 lg:col-span-2">
          {detail ? (
            <>
              <DarkCard hover>
                <h2 className="text-lg font-bold text-[var(--av-text-primary)]">{detail.name}</h2>
                {detail.scientific && (
                  <p className="text-xs text-[var(--av-text-muted)]">({detail.scientific})</p>
                )}
                <RiskBadge level={detail.risk} />
                <p className="mt-3 text-sm leading-snug text-[var(--av-text-secondary)] line-clamp-4">
                  {detail.desc}
                </p>
                {detail.conditions && (
                  <p className="mt-2 text-xs text-amber-500">
                    {isHi ? "कब बढ़ता है:" : "Favours:"} {detail.conditions}
                  </p>
                )}
                <AppLink
                  href={`/pest-diseases/${crop.slug}/disease/${detail.id}`}
                  className={`mt-3 inline-flex ${AV.btnPrimarySm}`}
                >
                  {isHi ? "पूरी जानकारी →" : "Full detail →"}
                </AppLink>
              </DarkCard>

              <DarkCard delay={4}>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-[var(--av-accent)]" />
                  <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
                    {isHi ? "क्या करें" : "What to do"} — {detail.name}
                  </h3>
                </div>
                <ShellTabBar
                  tabs={MGMT_ORDER.map((id) => ({ id, label: labels[id] }))}
                  active={mgmtTab}
                  onChange={setMgmtTab}
                />
                <ul className="mt-1 space-y-2">
                  {mgmtTips.map((c) => (
                    <li key={c} className="flex gap-2 text-xs leading-snug text-[var(--av-text-secondary)]">
                      <span className="text-[var(--av-accent)]">•</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </DarkCard>
            </>
          ) : (
            <DarkCard className="text-center">
              <p className="text-sm text-[var(--av-text-muted)]">
                {isHi ? "इस फसल के रोग डेटा जल्द।" : "No disease data for this crop yet."}
              </p>
            </DarkCard>
          )}
        </div>
      </div>
    </div>
  );
}
