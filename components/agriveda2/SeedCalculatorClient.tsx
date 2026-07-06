"use client";

import { useMemo, useState } from "react";
import { Calculator, Mic, Sprout, Info } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { cropCatalog } from "@/data/crop-catalog";
import { useMyCrops } from "@/hooks/useMyCrops";
import {
  buildSeedCalculatorResult,
  parseVoiceArea,
  type AreaUnit,
} from "@/lib/agriveda2/seedCalculatorEngine";
import { SLUG_TO_DATA_KEY } from "@/data/agriveda2/crop-slug-map";
import { SEED_RATE_DATA } from "@/data/agriveda2/seed-rate-data";

const VERIFIED_SLUGS = Object.keys(SLUG_TO_DATA_KEY).filter(
  (slug) => SEED_RATE_DATA[SLUG_TO_DATA_KEY[slug]!]
);

export default function SeedCalculatorClient() {
  const { crops } = useMyCrops();
  const defaultSlug =
    crops.find((c) => VERIFIED_SLUGS.includes(c.slug))?.slug ??
    VERIFIED_SLUGS[0] ??
    "wheat";

  const [cropSlug, setCropSlug] = useState(defaultSlug);
  const [methodId, setMethodId] = useState<string | undefined>();
  const [area, setArea] = useState("2.3");
  const [unit, setUnit] = useState<AreaUnit>("acre");
  const [voiceText, setVoiceText] = useState("");

  const result = useMemo(() => {
    const n = parseFloat(area);
    if (!n || n <= 0) return null;
    return buildSeedCalculatorResult(cropSlug, n, unit, methodId);
  }, [cropSlug, area, unit, methodId]);

  const applyVoice = () => {
    const parsed = parseVoiceArea(voiceText);
    if (!parsed) return;
    setArea(String(parsed.value));
    setUnit(parsed.unit);
    if (parsed.cropHint) setCropSlug(parsed.cropHint);
  };

  const catalogFiltered = cropCatalog.filter((c) => VERIFIED_SLUGS.includes(c.slug));

  return (
    <div className="space-y-5">
      <GlassCard neon className="p-4">
        <p className="text-sm font-bold theme-text-primary">
          खेत का area — slider ya voice se
        </p>
        <p className="mt-1 text-xs theme-text-muted">
          ICAR verified seed rate — kg/acre, gram/acre, quintal/acre
        </p>

        <label className="mt-4 block text-xs font-bold theme-text-muted">फसल</label>
        <select
          value={cropSlug}
          onChange={(e) => {
            setCropSlug(e.target.value);
            setMethodId(undefined);
          }}
          className="theme-input mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
        >
          {catalogFiltered.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>

        {result && result.availableMethods.length > 1 && (
          <>
            <label className="mt-4 block text-xs font-bold theme-text-muted">Buwai method</label>
            <select
              value={result.methodId}
              onChange={(e) => setMethodId(e.target.value)}
              className="theme-input mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
            >
              {result.availableMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold theme-text-muted">Area</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="theme-input mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold theme-text-muted">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as AreaUnit)}
              className="theme-input mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
            >
              <option value="acre">Acre</option>
              <option value="bigha">Bigha</option>
              <option value="hectare">Hectare</option>
            </select>
          </div>
        </div>

        <input
          type="range"
          min="0.5"
          max="10"
          step="0.1"
          value={Math.min(10, parseFloat(area) || 1)}
          onChange={(e) => setArea(e.target.value)}
          className="mt-4 w-full accent-emerald-600"
        />

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={voiceText}
            onChange={(e) => setVoiceText(e.target.value)}
            placeholder='बोलें: "डेढ़ बीघा में सरसों"'
            className="theme-input flex-1 rounded-xl border px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={applyVoice}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>
      </GlassCard>

      {result && (
        <GlassCard neon className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-emerald-600">
            <Calculator className="h-5 w-5" />
            <span className="text-sm font-extrabold">Verified seed package</span>
          </div>
          <ul className="space-y-2 text-sm theme-text-primary">
            <li>
              ✅ <strong>Variety:</strong> {result.varietyHint}
            </li>
            <li>
              ✅ <strong>बीज दर ({result.methodLabel}):</strong> {result.perAcreMin}–{result.perAcreMax}{" "}
              {result.unit}
            </li>
            <li>
              ✅ <strong>{result.areaDisplay} ke liye:</strong>{" "}
              <span className="text-lg font-black text-emerald-600">
                {result.totalSeedMin}–{result.totalSeedMax}
              </span>{" "}
              ({result.unit.split(" ")[0]})
            </li>
            {result.spacing && (
              <li>
                ✅ <strong>Spacing:</strong> {result.spacing}
              </li>
            )}
          </ul>

          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 text-xs">
            <p className="flex items-center gap-2 font-bold text-sky-800">
              <Info className="h-4 w-4" />
              Unit samjhaav
            </p>
            <p className="mt-1 theme-text-muted">{result.unitExplanation}</p>
            {result.proTip && (
              <p className="mt-2 font-semibold text-sky-900 dark:text-sky-200">💡 {result.proTip}</p>
            )}
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <p className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <Sprout className="h-4 w-4" />
              Seed treatment (verified)
            </p>
            <p className="mt-1 text-xs theme-text-muted">{result.seedTreatment}</p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
