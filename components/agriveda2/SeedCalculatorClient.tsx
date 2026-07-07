"use client";

import { useEffect, useMemo, useState } from "react";
import { Calculator, Mic, Sprout, Info, Leaf } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { cropCatalog } from "@/data/crop-catalog";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { getBighaInfo } from "@/lib/bighaConversion";
import { resolveSeedRateEntry } from "@/lib/agriveda2/seedRateFallback";
import {
  buildSeedCalculatorResult,
  getDefaultMethodId,
  parseVoiceArea,
  type AreaUnit,
} from "@/lib/agriveda2/seedCalculatorEngine";

const UNIT_LABELS: Record<AreaUnit, string> = {
  acre: "एकड़ (Acre)",
  bigha: "बीघा (Bigha)",
  hectare: "हेक्टेयर (Hectare)",
};

export default function SeedCalculatorClient() {
  const { crops } = useMyCrops();
  const { profile } = useFarmerProfile();
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
  const [unit, setUnit] = useState<AreaUnit>("acre");
  const [voiceText, setVoiceText] = useState("");

  useEffect(() => {
    setMethodId(getDefaultMethodId(cropSlug));
  }, [cropSlug]);

  const entry = useMemo(() => resolveSeedRateEntry(cropSlug), [cropSlug]);
  const activeMethodId = methodId ?? entry?.methods[0]?.id;

  const result = useMemo(() => {
    const n = parseFloat(area);
    if (!n || n <= 0) return null;
    return buildSeedCalculatorResult(cropSlug, n, unit, activeMethodId, {
      state: profile.state,
      district: profile.district,
    });
  }, [cropSlug, area, unit, activeMethodId, profile.state, profile.district]);

  const bighaInfo = useMemo(
    () => (unit === "bigha" ? getBighaInfo(profile.state, profile.district) : null),
    [unit, profile.state, profile.district]
  );

  const applyVoice = () => {
    const parsed = parseVoiceArea(voiceText);
    if (!parsed) return;
    setArea(String(parsed.value));
    setUnit(parsed.unit);
    if (parsed.cropHint) setCropSlug(parsed.cropHint);
  };

  const selectedCrop = cropCatalog.find((c) => c.slug === cropSlug);

  return (
    <div className="space-y-5">
      <GlassCard neon className="p-4">
        <p className="text-sm font-bold theme-text-primary">बीज कैलकुलेटर</p>
        <p className="mt-1 text-xs theme-text-muted">
          फसल चुनें, तरीका और खेत का area — बीज kg अपने आप निकलेगा। बीघा आपके ज़िले के हिसाब से।
        </p>

        {!profile.district && unit === "bigha" && (
          <p className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-[11px] font-semibold text-amber-900 dark:text-amber-200">
            सही बीघा के लिए प्रोफ़ाइल में राज्य/ज़िला सेट करें।
          </p>
        )}

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
            <span className="theme-text-muted">— {entry.methods.length} buwai option</span>
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

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold theme-text-muted">खेत का area</label>
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
              {(Object.keys(UNIT_LABELS) as AreaUnit[]).map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {bighaInfo && (
          <p className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-[11px] font-semibold text-amber-900 dark:text-amber-200">
            {profile.district ? `${profile.district}: ` : ""}
            {bighaInfo.label} = {bighaInfo.acresPerBigha} एकड़ — {bighaInfo.note}
          </p>
        )}

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
            placeholder='बोलें: "डेढ़ बीघा में सरसों"'
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
      </GlassCard>

      {result ? (
        <GlassCard neon className="space-y-3 p-5">
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
              ✅ <strong>{result.areaDisplay} ke liye total:</strong>{" "}
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
              Seed treatment
            </p>
            <p className="mt-1 text-xs theme-text-muted">{result.seedTreatment}</p>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-4 text-center text-sm theme-text-muted">
          Area daalein — result yahan dikhega
        </GlassCard>
      )}
    </div>
  );
}
