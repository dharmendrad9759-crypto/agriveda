"use client";

import { useMemo, useState } from "react";
import { Download, FlaskConical, Leaf, Calculator, FileText, Droplets } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import { DonutChart } from "@/components/shell/charts";
import { useToast } from "@/components/ui/Toast";
import { AV } from "@/lib/design/tokens";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { getVarietiesForCrop } from "@/lib/crops/cropVarieties";
import { buildFertilizerPlan } from "@/lib/agriveda2/fertilizerEngine";
import {
  calculateFertilizerProducts,
  getFertilizerForCrop,
  haToAcre,
} from "@/data/knowledge/fertilizer-recommendations";
import { cn } from "@/lib/cn";
import type { Crop } from "@/types/crop";

type SubTabId = "schedule" | "foliar" | "organic" | "calculator" | "notes";

const SUB_TABS: {
  id: SubTabId;
  label: string;
  labelHi: string;
  icon: typeof FlaskConical;
  ring: string;
}[] = [
  { id: "schedule", label: "Schedule", labelHi: "समयसारिणी", icon: FlaskConical, ring: "ring-amber-500/40" },
  { id: "foliar", label: "Foliar", labelHi: "पर्णीय", icon: Droplets, ring: "ring-cyan-500/40" },
  { id: "organic", label: "Organic", labelHi: "जैविक", icon: Leaf, ring: "ring-emerald-500/40" },
  { id: "calculator", label: "Calculator", labelHi: "कैलकुलेटर", icon: Calculator, ring: "ring-violet-500/40" },
  { id: "notes", label: "ICAR Notes", labelHi: "नोट्स", icon: FileText, ring: "ring-slate-500/40" },
];

function nutrientTotal(detail: string): number | null {
  const m = detail.match(/total:\s*([\d.]+)/i) || detail.match(/^([\d.]+)/);
  return m ? Number(m[1]) : null;
}

export default function CropFertilizerSection({ crop }: { crop: Crop }) {
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>("schedule");
  const [acres, setAcres] = useState(1);

  const hindi = getCropHindiName(crop.slug);
  const variety = getVarietiesForCrop(crop.slug)[0]?.name ?? "Certified seed";
  const plan = useMemo(() => buildFertilizerPlan(crop.slug, acres), [crop.slug, acres]);
  const icar = useMemo(() => getFertilizerForCrop(crop.slug), [crop.slug]);

  const scheduleRows = useMemo(() => {
    if (plan?.schedule?.length) {
      return plan.schedule.map((s, i) => ({
        stage: i + 1,
        time: s.time,
        apply: s.apply,
      }));
    }
    const basal = crop.fertilizerSchedule.basalDose.map((d, i) => ({
      stage: i + 1,
      time: "Basal",
      apply: d,
    }));
    const stageWise = crop.fertilizerSchedule.stageWise.flatMap((st, si) =>
      st.details.map((d, di) => ({
        stage: basal.length + si + di + 1,
        time: st.stage,
        apply: d,
      }))
    );
    return [...basal, ...stageWise];
  }, [plan, crop.fertilizerSchedule]);

  const foliarRows = useMemo(() => {
    const micros = crop.fertilizerSchedule.micronutrients ?? [];
    const sprays = crop.fertilizerSchedule.foliarSpray ?? [];
    const fromIcar = icar?.micronutrients ?? [];
    const fromPlan =
      plan?.nutrients.filter((n) => ["Zn", "Fe", "B", "Mg", "S", "Micro"].includes(n.nutrient)) ??
      [];

    const rows: { name: string; detail: string }[] = [];
    for (const m of micros) rows.push({ name: "Micronutrient", detail: m });
    for (const s of sprays) rows.push({ name: "Foliar spray", detail: s });
    for (const m of fromIcar) rows.push({ name: "ICAR / PoP", detail: m });
    for (const n of fromPlan) rows.push({ name: n.nutrient, detail: n.detail });

    if (!rows.length) {
      rows.push({
        name: "Soil test first",
        detail: `${crop.name}: Zn/Fe/B foliar only if deficiency — soil test every 2–3 years (ICAR guidance)`,
      });
    }
    // de-dupe by detail
    const seen = new Set<string>();
    return rows.filter((r) => {
      if (seen.has(r.detail)) return false;
      seen.add(r.detail);
      return true;
    });
  }, [crop, icar, plan]);

  const organicRows = useMemo(() => {
    const rows: string[] = [];
    const entryNotes = icar?.notes ?? [];
    for (const n of entryNotes) {
      if (/FYM|compost|Rhizobium|PSB|organic|bio/i.test(n)) rows.push(n);
    }
    for (const n of plan?.nutrients ?? []) {
      if (/Rhizobium|PSB|FYM|organic/i.test(n.nutrient + n.detail)) {
        rows.push(`${n.nutrient}: ${n.detail}`);
      }
    }
    if (/soybean|moong|moongfali|pulses|groundnut/i.test(crop.slug)) {
      rows.push("Rhizobium (or Rhizobium + PSB) seed treatment — essential for legumes (ICAR/SAU PoP)");
    }
    rows.push("Farmyard manure / compost as basal — improves soil carbon and nutrient use efficiency");
    rows.push("Avoid dumping excess urea on legumes — reduces nodulation");
    const seen = new Set<string>();
    return rows.filter((r) => {
      if (seen.has(r.toLowerCase())) return false;
      seen.add(r.toLowerCase());
      return true;
    });
  }, [crop.slug, icar, plan]);

  const npkAcre = useMemo(() => {
    if (icar) {
      return {
        n: haToAcre(icar.n, 1),
        p: haToAcre(icar.p2o5, 1),
        k: haToAcre(icar.k2o, 1),
        source: icar.source,
      };
    }
    const nRow = plan?.nutrients.find((x) => x.nutrient === "N");
    const pRow = plan?.nutrients.find((x) => x.nutrient === "P");
    const kRow = plan?.nutrients.find((x) => x.nutrient === "K");
    return {
      n: nRow ? nutrientTotal(nRow.detail) ?? 0 : 0,
      p: pRow ? nutrientTotal(pRow.detail) ?? 0 : 0,
      k: kRow ? nutrientTotal(kRow.detail) ?? 0 : 0,
      source: plan?.source === "verified" ? "Agriveda verified PoP (kg/acre)" : "Crop guide / soil test",
    };
  }, [icar, plan]);

  const bags = useMemo(() => {
    if (plan?.bags?.length) return plan.bags;
    if (npkAcre.n || npkAcre.p || npkAcre.k) {
      const calc = calculateFertilizerProducts({
        n: icar?.n ?? npkAcre.n * 2.47,
        p2o5: icar?.p2o5 ?? npkAcre.p * 2.47,
        k2o: icar?.k2o ?? npkAcre.k * 2.47,
        acres,
      });
      return [
        { name: "Urea (46% N)", amount: `${calc.ureaKg} kg` },
        { name: "DAP (18-46-0)", amount: `${calc.dapKg} kg` },
        { name: "MOP (60% K₂O)", amount: `${calc.mopKg} kg` },
      ];
    }
    return [];
  }, [plan, npkAcre, icar, acres]);

  const notes = useMemo(() => {
    const list: string[] = [];
    if (icar?.splits?.length) list.push(...icar.splits.map((s) => `Split: ${s}`));
    if (icar?.notes?.length) list.push(...icar.notes);
    if (plan?.guideNotes?.length) list.push(...plan.guideNotes);
    if (plan?.unitNote) list.push(plan.unitNote);
    list.push("Doses are research/PoP based (ICAR / NFSM / SAU style). Always adjust to local soil test.");
    list.push("Never apply all nitrogen at once — split as per schedule.");
    return list;
  }, [icar, plan]);

  const donutSegments = [
    { label: "N", value: Math.max(npkAcre.n, 1), color: "#10b981" },
    { label: "P₂O₅", value: Math.max(npkAcre.p, 1), color: "#3b82f6" },
    { label: "K₂O", value: Math.max(npkAcre.k, 1), color: "#f59e0b" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold text-[var(--av-text-muted)]">
          Source: {npkAcre.source}
          {plan?.source === "verified" ? " · verified bags" : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => showToast("PDF download — jald available")}
            className={AV.btnSecondarySm}
          >
            <Download className="mr-1.5 inline h-3.5 w-3.5" />
            PDF
          </button>
          <AppLink href="/services/fertilizer-calculator" className={AV.btnPrimarySm}>
            Full Calculator
          </AppLink>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-muted)]/50 p-3 sm:grid-cols-5">
        {[
          { label: "Crop", value: `${crop.name}${hindi ? ` (${hindi})` : ""}` },
          { label: "Season", value: crop.suitableSeason },
          { label: "Variety tip", value: variety },
          { label: "Area", value: `${acres} Acre` },
          { label: "Est. Yield", value: crop.estimatedYield, highlight: true },
        ].map((item) => (
          <div key={item.label} className="text-center sm:text-left">
            <p className={AV.label}>{item.label}</p>
            <p
              className={`mt-0.5 text-xs font-bold ${
                item.highlight
                  ? "inline-block rounded-lg bg-[var(--av-accent-soft)] px-2 py-0.5 text-[var(--av-accent)]"
                  : "text-[var(--av-text-primary)]"
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Home-style sub-tab grid — each button switches content */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl border p-2 text-center shadow-sm transition active:scale-[0.97]",
                active
                  ? "border-emerald-500/45 bg-emerald-500/10"
                  : "border-[var(--av-border)] bg-[var(--av-surface)]"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-transparent ring-1",
                  tab.ring
                )}
              >
                <Icon className="h-3.5 w-3.5 text-[var(--av-accent)]" />
              </span>
              <span
                className={cn(
                  "line-clamp-2 text-[9px] font-bold leading-tight sm:text-[10px]",
                  active ? "text-emerald-700 dark:text-emerald-300" : "text-[var(--av-text-primary)]"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {activeSubTab === "schedule" && (
        <DarkCard>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
            {crop.name} — Fertilizer Schedule (per acre)
          </h3>
          <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
            Stage-wise doses for this crop — not a generic template
          </p>
          <ul className="mt-3 space-y-2">
            {scheduleRows.map((row) => (
              <li
                key={`${row.stage}-${row.time}-${row.apply.slice(0, 24)}`}
                className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5"
              >
                <div className="flex items-start gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--av-accent)] text-[10px] font-bold text-white">
                    {row.stage}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--av-accent)]">{row.time}</p>
                    <p className="mt-0.5 text-xs text-[var(--av-text-secondary)]">{row.apply}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {!scheduleRows.length && (
            <p className="mt-2 text-xs text-[var(--av-text-muted)]">
              Schedule data loading… soil-test based dose recommended.
            </p>
          )}
        </DarkCard>
      )}

      {activeSubTab === "foliar" && (
        <DarkCard>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
            Foliar & Micronutrients — {crop.name}
          </h3>
          <ul className="mt-3 space-y-2">
            {foliarRows.map((r, i) => (
              <li key={i} className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase text-cyan-700 dark:text-cyan-300">{r.name}</p>
                <p className="mt-0.5 text-xs text-[var(--av-text-secondary)]">{r.detail}</p>
              </li>
            ))}
          </ul>
        </DarkCard>
      )}

      {activeSubTab === "organic" && (
        <DarkCard>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
            Organic / Bio options — {crop.name}
          </h3>
          <ul className="mt-3 space-y-2">
            {organicRows.map((r) => (
              <li key={r} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                <span className="text-[var(--av-accent)]">✓</span>
                {r}
              </li>
            ))}
          </ul>
        </DarkCard>
      )}

      {activeSubTab === "calculator" && (
        <div className="space-y-3">
          <DarkCard>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
              Nutrient need — {crop.name} (research PoP)
            </h3>
            <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-[var(--av-text-secondary)]">
              Area (acre)
              <input
                type="number"
                min={0.5}
                max={50}
                step={0.5}
                value={acres}
                onChange={(e) => setAcres(Math.max(0.5, Number(e.target.value) || 1))}
                className="w-20 rounded-lg border border-[var(--av-border)] bg-[var(--av-surface)] px-2 py-1.5 text-sm font-bold"
              />
            </label>
            <div className="mt-4 flex justify-center">
              <DonutChart
                segments={donutSegments}
                centerValue={`${Math.round(npkAcre.n * acres)}:${Math.round(npkAcre.p * acres)}:${Math.round(npkAcre.k * acres)}`}
                centerLabel="N:P:K kg"
                size={140}
              />
            </div>
            <p className="mt-2 text-center text-[10px] text-[var(--av-text-muted)]">
              Per acre base ≈ N {npkAcre.n} · P₂O₅ {npkAcre.p} · K₂O {npkAcre.k} kg
            </p>
          </DarkCard>

          <DarkCard>
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Bag estimate ({acres} acre)</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {bags.map((b) => (
                <div key={b.name} className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5">
                  <p className="text-[10px] font-bold text-[var(--av-text-muted)]">{b.name}</p>
                  <p className="mt-0.5 text-sm font-black text-[var(--av-accent)]">{b.amount}</p>
                </div>
              ))}
            </div>
            {!bags.length && (
              <p className="mt-2 text-xs text-[var(--av-text-muted)]">
                Open Full Calculator for custom soil-test NPK.
              </p>
            )}
          </DarkCard>
        </div>
      )}

      {activeSubTab === "notes" && (
        <DarkCard>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">
            ICAR / PoP notes — {crop.name}
          </h3>
          <ul className="mt-3 space-y-2">
            {notes.map((n) => (
              <li key={n} className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-[var(--av-text-secondary)]">
                {n}
              </li>
            ))}
          </ul>
          {icar?.splits?.length ? (
            <p className="mt-3 text-[10px] font-semibold text-[var(--av-text-muted)]">
              Ref: {icar.source}
            </p>
          ) : null}
        </DarkCard>
      )}
    </div>
  );
}
