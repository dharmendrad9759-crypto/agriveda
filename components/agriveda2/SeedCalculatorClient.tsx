"use client";

import { useEffect, useMemo, useState } from "react";
import { Calculator, Mic, Sprout, Info, Leaf } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import { cropCatalog } from "@/data/crop-catalog";
import { useMyCrops } from "@/hooks/useMyCrops";
import { resolveSeedRateEntry } from "@/lib/agriveda2/seedRateFallback";
import {
  buildSeedCalculatorResult,
  getDefaultMethodId,
  parseVoiceArea,
} from "@/lib/agriveda2/seedCalculatorEngine";

export default function SeedCalculatorClient() {
  const { crops } = useMyCrops();
  const catalogWithData = useMemo(
    () => cropCatalog.filter((c) => resolveSeedRateEntry(c.slug)),
    []
  );

  const defaultSlug =
    crops.find((c) => resolveSeedRateEntry(c.slug))?.slug ??
    catalogWithData[0]?.slug ??
    "wheat";

  const [cropSlug, setCropSlug] = useState(defaultSlug);
  const [methodId, setMethodId] = useState<string | undefined>(() =>
    getDefaultMethodId(defaultSlug)
  );
  const [area, setArea] = useState("2");
  const [voiceText, setVoiceText] = useState("");

  useEffect(() => {
    setMethodId(getDefaultMethodId(cropSlug));
  }, [cropSlug]);

  const entry = useMemo(() => resolveSeedRateEntry(cropSlug), [cropSlug]);
  const activeMethodId = methodId ?? entry?.methods[0]?.id;

  const result = useMemo(() => {
    const n = parseFloat(area);
    if (!n || n <= 0) return null;
    return buildSeedCalculatorResult(cropSlug, n, "acre", activeMethodId);
  }, [cropSlug, area, activeMethodId]);

  const applyVoice = () => {
    const parsed = parseVoiceArea(voiceText);
    if (!parsed) return;
    if (parsed.unit === "acre") setArea(String(parsed.value));
    else if (parsed.unit === "hectare")
      setArea(String(Math.round(parsed.value * 2.471 * 10) / 10));
    else setArea(String(parsed.value));
    if (parsed.cropHint) setCropSlug(parsed.cropHint);
  };

  const selectedCrop = cropCatalog.find((c) => c.slug === cropSlug);

  return (
    <div className="space-y-5">
      <DarkCard className="border-emerald-500/20 p-4">
        <p className="text-sm font-bold theme-text-primary">बीज कैलकुलेटर</p>
        <p className="mt-1 text-xs theme-text-muted">
          फसल चुनें, तरीका और खेत का क्षेत्र (एकड़) — बीज kg अपने आप निकलेगा।
        </p>

        <label className="mt-4 block text-xs font-bold theme-text-muted">फसल</label>
        <select
          value={cropSlug}
          onChange={(e) => setCropSlug(e.target.value)}
          className="theme-input mt-1 w-full rounded-xl border px-3 py-2.5 text-sm font-semibold"
        >
          {catalogWithData.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>

        {selectedCrop && entry && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs">
            <Leaf className="h-4 w-4 text-emerald-600" />
            <span className="font-bold theme-text-primary">
              {selectedCrop.emoji} {selectedCrop.name}
            </span>
            <span className="theme-text-muted">— {entry.methods.length} बुवाई विकल्प</span>
          </div>
        )}

        {entry && entry.methods.length > 0 && (
          <>
            <label className="mt-4 block text-xs font-bold theme-text-muted">
              बुवाई / बीज का तरीका ({selectedCrop?.name})
            </label>
            <select
              value={activeMethodId ?? ""}
              onChange={(e) => setMethodId(e.target.value)}
              className="theme-input mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
            >
              {entry.methods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                  {m.note ? ` — ${m.note}` : ""}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="mt-4">
          <label className="text-xs font-bold theme-text-muted">खेत का क्षेत्र (एकड़)</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="theme-input mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
          />
        </div>

        <input
          type="range"
          min="0.5"
          max="15"
          step="0.1"
          value={Math.min(15, parseFloat(area) || 1)}
          onChange={(e) => setArea(e.target.value)}
          className="mt-4 w-full accent-emerald-600"
        />

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={voiceText}
            onChange={(e) => setVoiceText(e.target.value)}
            placeholder="जैसे: 2 एकड़ गेहूँ"
            className="theme-input flex-1 rounded-xl border px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={applyVoice}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white active:scale-95"
            aria-label="Voice command"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>
      </DarkCard>

      {result ? (
        <DarkCard className="space-y-3 border-emerald-500/20 p-5">
          <div className="flex items-center gap-2 text-emerald-600">
            <Calculator className="h-5 w-5" />
            <span className="text-sm font-extrabold">
              {result.cropName} — {result.methodLabel}
            </span>
          </div>
          <ul className="space-y-2 text-sm theme-text-primary">
            <li>
              ✅ <strong>Variety:</strong> {result.varietyHint}
            </li>
            <li>
              ✅ <strong>बीज दर:</strong> {result.perAcreMin}–{result.perAcreMax} {result.unit}
            </li>
            <li>
              ✅ <strong>{result.areaDisplay} के लिए कुल:</strong>{" "}
              <span className="text-lg font-black text-emerald-600">
                {result.totalSeedMin}–{result.totalSeedMax}
              </span>{" "}
              ({result.unit.split(" ")[0]})
            </li>
            {result.spacing && (
              <li>
                ✅ <strong>दूरी:</strong> {result.spacing}
              </li>
            )}
          </ul>

          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 text-xs">
            <p className="flex items-center gap-2 font-bold text-sky-800">
              <Info className="h-4 w-4" />
              इकाई
            </p>
            <p className="mt-1 theme-text-muted">{result.unitExplanation}</p>
            {result.proTip && (
              <p className="mt-2 font-semibold text-sky-900 dark:text-sky-200">💡 {result.proTip}</p>
            )}
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <p className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <Sprout className="h-4 w-4" />
              बीज उपचार
            </p>
            <p className="mt-1 text-xs theme-text-muted">{result.seedTreatment}</p>
          </div>
        </DarkCard>
      ) : (
        <DarkCard className="p-4 text-center text-sm theme-text-muted">
          एकड़ डालें — परिणाम यहाँ दिखेगा
        </DarkCard>
      )}
    </div>
  );
}
