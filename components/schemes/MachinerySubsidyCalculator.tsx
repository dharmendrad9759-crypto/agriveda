"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MACHINERY_CATEGORY_OPTIONS,
  MACHINERY_KIND_OPTIONS,
  type MachineryFarmerCategory,
  type MachineryKind,
} from "@/data/schemes/machinerySubsidyBands";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { INDIAN_STATES } from "@/lib/india-locations";
import {
  estimateMachinerySubsidy,
  formatInrShort,
} from "@/lib/schemes/machinerySubsidyEstimate";

export default function MachinerySubsidyCalculator() {
  const { profile } = useFarmerProfile();
  const [kind, setKind] = useState<MachineryKind>("tractor");
  const [category, setCategory] = useState<MachineryFarmerCategory>("sc_st");
  const [state, setState] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (profile.state && !state) setState(profile.state);
  }, [profile.state, state]);

  const result = useMemo(() => {
    const n = parseFloat(price.replace(/,/g, ""));
    return estimateMachinerySubsidy({
      kind,
      category,
      priceInr: Number.isFinite(n) ? n : undefined,
    });
  }, [kind, category, price]);

  const kindMeta = MACHINERY_KIND_OPTIONS.find((k) => k.id === kind);
  const hasCeiling =
    result.band.ceilingMinInr != null && result.band.ceilingMaxInr != null;

  return (
    <div className="space-y-3 rounded-2xl border border-sky-500/25 bg-sky-500/[0.06] p-4">
      <p className="text-[13px] font-bold text-[var(--av-text-primary)]">
        यंत्र / ट्रैक्टर अनुदान अनुमान
      </p>
      <p className="text-[11px] leading-snug text-[var(--av-text-muted)]">
        असल नियम: <strong>लागत का %</strong> और <strong>अधिकतम सीमा (ceiling)</strong> — दोनों में
        जो कम हो, वही मिलता है। % और सीला <strong>राज्य अनुसार अलग</strong> होते हैं।
      </p>

      <label className="block text-[11px] font-semibold text-[var(--av-text-muted)]">
        राज्य
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-sm font-bold text-[var(--av-text-primary)] outline-none focus:border-sky-500/40"
        >
          <option value="">राज्य चुनें</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {state ? (
          <span className="mt-1 block text-[10px] font-medium text-[var(--av-text-muted)]">
            {state} की पक्की सूची agrimachinery.nic.in या राज्य कृषि पोर्टल पर देखें।
          </span>
        ) : (
          <span className="mt-1 block text-[10px] font-medium text-amber-800 dark:text-amber-200">
            प्रोफ़ाइल में राज्य सेट करें या यहाँ चुनें — अनुमान सामान्य SMAM शैली पर है।
          </span>
        )}
      </label>

      <label className="block text-[11px] font-semibold text-[var(--av-text-muted)]">
        यंत्र / रास्ता
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as MachineryKind)}
          className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-sm font-bold text-[var(--av-text-primary)] outline-none focus:border-sky-500/40"
        >
          {MACHINERY_KIND_OPTIONS.map((k) => (
            <option key={k.id} value={k.id}>
              {k.labelHi}
            </option>
          ))}
        </select>
        {kindMeta ? (
          <span className="mt-1 block text-[10px] font-medium text-[var(--av-text-muted)]">
            {kindMeta.hintHi}
          </span>
        ) : null}
      </label>

      <label className="block text-[11px] font-semibold text-[var(--av-text-muted)]">
        आपकी श्रेणी
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as MachineryFarmerCategory)}
          className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-sm font-bold text-[var(--av-text-primary)] outline-none focus:border-sky-500/40"
        >
          {MACHINERY_CATEGORY_OPTIONS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.labelHi}
            </option>
          ))}
        </select>
      </label>

      {!result.isHireOnly ? (
        <label className="block text-[11px] font-semibold text-[var(--av-text-muted)]">
          यंत्र कीमत (₹) — वैकल्पिक
          <input
            type="number"
            min={1000}
            step={1000}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={kind === "tractor" ? "जैसे 750000" : "जैसे 85000"}
            className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-sm font-bold text-[var(--av-text-primary)] outline-none focus:border-sky-500/40"
          />
        </label>
      ) : null}

      <div className="space-y-2 border-t border-sky-500/20 pt-3">
        {result.isHireOnly ? (
          <p className="text-[13px] font-bold text-[var(--av-text-primary)]">
            खरीद-अनुदान नहीं — किराया पूछें
          </p>
        ) : (
          <>
            <p className="text-[12px] text-[var(--av-text-secondary)]">
              सार्वजनिक % शैली (SMAM):{" "}
              <span className="font-black text-sky-900 dark:text-sky-100">
                {result.band.minPct === result.band.maxPct
                  ? `${result.band.minPct}%`
                  : `${result.band.minPct}% – ${result.band.maxPct}%`}
              </span>
            </p>
            {hasCeiling ? (
              <p className="text-[12px] text-[var(--av-text-secondary)]">
                अक्सर दिखने वाली अधिकतम सीमा:{" "}
                <span className="font-black text-sky-900 dark:text-sky-100">
                  {formatInrShort(result.band.ceilingMinInr!)} –{" "}
                  {formatInrShort(result.band.ceilingMaxInr!)}
                </span>
              </p>
            ) : null}
            {result.estimateMinInr != null && result.estimateMaxInr != null ? (
              <p className="font-display text-lg font-bold text-sky-900 dark:text-sky-100">
                अनुमान अनुदान ≈ {formatInrShort(result.estimateMinInr)}
                {result.estimateMinInr !== result.estimateMaxInr
                  ? ` – ${formatInrShort(result.estimateMaxInr)}`
                  : ""}
              </p>
            ) : null}
            {!price && kind === "tractor" ? (
              <p className="text-[11px] text-[var(--av-text-muted)]">
                कीमत डालें तो % और सीलिंग काट कर रुपये का अनुमान भी दिखेगा।
              </p>
            ) : null}
            {result.band.hardPath ? (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-950 dark:text-amber-50">
                ट्रैक्टर: कोटा / लॉटरी / चयन समिति आम — पात्र ≠ पक्की मंजूरी।
              </p>
            ) : null}
          </>
        )}
        <p className="text-[11px] leading-snug text-[var(--av-text-secondary)]">{result.band.noteHi}</p>
        <p className="text-[10px] leading-snug text-[var(--av-text-muted)]">{result.band.sourceHi}</p>
        <p className="text-[11px] leading-snug text-amber-900/90 dark:text-amber-100/90">
          {result.disclaimerHi}
        </p>
      </div>
    </div>
  );
}
