"use client";

import { useState, useMemo } from "react";
import {
  Compass,
  ArrowRightLeft,
  Copy,
  Check,
  Share2,
  Info,
  MapPin,
  Sparkles,
  Calculator,
  ChevronDown,
} from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import AppLink from "@/components/ui/AppLink";

export type UnitKey =
  | "acre"
  | "hectare"
  | "pucca_bigha"
  | "kachcha_bigha"
  | "bihar_bigha"
  | "mp_bigha"
  | "rj_west_bigha"
  | "biswa"
  | "kattha"
  | "dhur"
  | "guntha"
  | "kanal"
  | "marla"
  | "sqft"
  | "sqm"
  | "sqyard";

interface UnitMeta {
  key: UnitKey;
  labelHi: string;
  shortHi: string;
  sqFtFactor: number;
  regionHi: string;
  descriptionHi: string;
}

const UNITS: Record<UnitKey, UnitMeta> = {
  acre: {
    key: "acre",
    labelHi: "एकड़ (Acre)",
    shortHi: "एकड़",
    sqFtFactor: 43560,
    regionHi: "पूरे भारत में मान्य (मानक)",
    descriptionHi: "1 एकड़ = 43,560 वर्ग फुट ≈ 4,047 वर्ग मीटर",
  },
  hectare: {
    key: "hectare",
    labelHi: "हेक्टेयर (Hectare)",
    shortHi: "हेक्टेयर",
    sqFtFactor: 107639.1,
    regionHi: "सरकारी भूलेख रिकॉर्ड (मानक)",
    descriptionHi: "1 हेक्टेयर = 10,000 वर्ग मीटर ≈ 2.471 एकड़",
  },
  pucca_bigha: {
    key: "pucca_bigha",
    labelHi: "पक्का बीघा (UP / Haryana / RJ)",
    shortHi: "पक्का बीघा",
    sqFtFactor: 27225,
    regionHi: "पश्चिमी UP, हरियाणा, पूर्वी राजस्थान",
    descriptionHi: "1 पक्का बीघा = 0.625 एकड़ = 20 बिस्वा = 27,225 वर्ग फुट",
  },
  kachcha_bigha: {
    key: "kachcha_bigha",
    labelHi: "कच्चा बीघा (Purvanchal / Central UP)",
    shortHi: "कच्चा बीघा",
    sqFtFactor: 9075,
    regionHi: "पूर्वी UP, अवध, पूर्वांचल",
    descriptionHi: "1 कच्चा बीघा ≈ 1/3 पक्का बीघा = 0.208 एकड़ = 9,075 वर्ग फुट",
  },
  bihar_bigha: {
    key: "bihar_bigha",
    labelHi: "बिहार बीघा (20 कट्ठा)",
    shortHi: "बिहार बीघा",
    sqFtFactor: 27225,
    regionHi: "बिहार व झारखंड",
    descriptionHi: "1 बीघा = 20 कट्ठा = 400 धूर = 27,225 वर्ग फुट",
  },
  mp_bigha: {
    key: "mp_bigha",
    labelHi: "मध्य प्रदेश बीघा (MP Bigha)",
    shortHi: "MP बीघा",
    sqFtFactor: 17424,
    regionHi: "मध्य प्रदेश (मालवा, बुंदेलखंड)",
    descriptionHi: "1 MP बीघा = 0.40 एकड़ = 17,424 वर्ग फुट (लगभग 2.5 बीघा = 1 एकड़)",
  },
  rj_west_bigha: {
    key: "rj_west_bigha",
    labelHi: "बड़ा बीघा (पश्चिमी राजस्थान / बीकानेर)",
    shortHi: "बड़ा बीघा",
    sqFtFactor: 54450,
    regionHi: "बीकानेर, जैसलमेर, बाड़मेर, सीकर",
    descriptionHi: "1 बड़ा बीघा = 1.25 एकड़ = 54,450 वर्ग फुट",
  },
  biswa: {
    key: "biswa",
    labelHi: "बिस्वा (Biswa - 1/20 पक्का बीघा)",
    shortHi: "बिस्वा",
    sqFtFactor: 1361.25,
    regionHi: "UP, हरियाणा, राजस्थान, हिमाचल",
    descriptionHi: "1 बिस्वा = 1,361.25 वर्ग फुट (20 बिस्वा = 1 पक्का बीघा)",
  },
  kattha: {
    key: "kattha",
    labelHi: "कट्ठा (Kattha - बिहार / बंगाल)",
    shortHi: "कट्ठा",
    sqFtFactor: 1361.25,
    regionHi: "बिहार, पूर्वी UP, असम",
    descriptionHi: "1 कट्ठा = 1,361.25 वर्ग फुट = 20 धूर (20 कट्ठा = 1 बीघा)",
  },
  dhur: {
    key: "dhur",
    labelHi: "धूर (Dhur - 1/20 कट्ठा)",
    shortHi: "धूर",
    sqFtFactor: 68.0625,
    regionHi: "बिहार व पूर्वी UP",
    descriptionHi: "1 धूर = 68.06 वर्ग फुट (20 धूर = 1 कट्ठा)",
  },
  guntha: {
    key: "guntha",
    labelHi: "गुंठा (Guntha - MH / गुजरात)",
    shortHi: "गुंठा",
    sqFtFactor: 1089,
    regionHi: "महाराष्ट्र, गुजरात, कर्नाटक",
    descriptionHi: "1 गुंठा = 1,089 वर्ग फुट (40 गुंठा = 1 एकड़ = 101.17 m²)",
  },
  kanal: {
    key: "kanal",
    labelHi: "कनाल (Kanal - पंजाब / हरियाणा)",
    shortHi: "कनाल",
    sqFtFactor: 5445,
    regionHi: "पंजाब, हरियाणा, जम्मू कश्मीर",
    descriptionHi: "1 कनाल = 5,445 वर्ग फुट = 20 मरला (8 कनाल = 1 एकड़)",
  },
  marla: {
    key: "marla",
    labelHi: "मरला (Marla - 1/20 कनाल)",
    shortHi: "मरला",
    sqFtFactor: 272.25,
    regionHi: "पंजाब, हरियाणा, जम्मू",
    descriptionHi: "1 मरला = 272.25 वर्ग फुट (160 मरला = 1 एकड़)",
  },
  sqft: {
    key: "sqft",
    labelHi: "वर्ग फुट (Square Feet)",
    shortHi: "वर्ग फुट",
    sqFtFactor: 1,
    regionHi: "मानक माप",
    descriptionHi: "लंबाई (फुट) × चौड़ाई (फुट)",
  },
  sqm: {
    key: "sqm",
    labelHi: "वर्ग मीटर (Square Meter)",
    shortHi: "वर्ग मीटर",
    sqFtFactor: 10.7639,
    regionHi: "अंतर्राष्ट्रीय मानक (SI)",
    descriptionHi: "1 वर्ग मीटर = 10.764 वर्ग फुट",
  },
  sqyard: {
    key: "sqyard",
    labelHi: "वर्ग गज / गज (Square Yard)",
    shortHi: "वर्ग गज",
    sqFtFactor: 9,
    regionHi: "आवासीय व कृषि माप",
    descriptionHi: "1 वर्ग गज (गज) = 9 वर्ग फुट",
  },
};

interface StatePreset {
  nameHi: string;
  defaultFrom: UnitKey;
  defaultTo: UnitKey;
  highlightUnits: UnitKey[];
  noteHi: string;
}

const STATE_PRESETS: Record<string, StatePreset> = {
  up: {
    nameHi: "उत्तर प्रदेश",
    defaultFrom: "pucca_bigha",
    defaultTo: "acre",
    highlightUnits: ["pucca_bigha", "kachcha_bigha", "biswa", "acre", "hectare"],
    noteHi: "पश्चिमी UP में 1 पक्का बीघा = 0.625 एकड़ (20 बिस्वा)। पूर्वी UP (पूर्वांचल) में कच्चा बीघा (0.208 एकड़) भी खूब चलता है।",
  },
  rajasthan: {
    nameHi: "राजस्थान",
    defaultFrom: "pucca_bigha",
    defaultTo: "acre",
    highlightUnits: ["pucca_bigha", "rj_west_bigha", "biswa", "acre", "hectare"],
    noteHi: "पूर्वी राजस्थान में 1 बीघा = 0.625 एकड़ (27,225 वर्ग फुट), जबकि बीकानेर, सीकर व पश्चिमी जिलों में 1 बीघा = 1.25 एकड़ तक होता है।",
  },
  bihar: {
    nameHi: "बिहार",
    defaultFrom: "kattha",
    defaultTo: "acre",
    highlightUnits: ["pucca_bigha", "kattha", "dhur", "acre", "hectare"],
    noteHi: "बिहार में 1 बीघा = 20 कट्ठा, 1 कट्ठा = 20 धूर = 1,361 वर्ग फुट। 1 एकड़ में लगभग 32 कट्ठा (1.6 बीघा) होता है।",
  },
  haryana: {
    nameHi: "हरियाणा",
    defaultFrom: "kanal",
    defaultTo: "acre",
    highlightUnits: ["kanal", "marla", "acre", "pucca_bigha", "hectare"],
    noteHi: "हरियाणा में 1 एकड़ = 8 कनाल = 160 मरला (किला)। 1 कनाल = 20 मरला = 5,445 वर्ग फुट।",
  },
  punjab: {
    nameHi: "पंजाब",
    defaultFrom: "kanal",
    defaultTo: "acre",
    highlightUnits: ["kanal", "marla", "acre", "hectare", "sqft"],
    noteHi: "पंजाब में भूमि की माप कनाल, मरला और किल्ला (एकड़) में होती है। 1 किल्ला = 8 कनाल = 160 मरला।",
  },
  mp: {
    nameHi: "मध्य प्रदेश",
    defaultFrom: "mp_bigha",
    defaultTo: "acre",
    highlightUnits: ["mp_bigha", "acre", "hectare", "biswa", "sqft"],
    noteHi: "मध्य प्रदेश में 1 बीघा = 0.40 एकड़ (17,424 वर्ग फुट)। लगभग 2.5 बीघा मिलकर 1 एकड़ बनता है।",
  },
  maharashtra: {
    nameHi: "महाराष्ट्र",
    defaultFrom: "guntha",
    defaultTo: "acre",
    highlightUnits: ["guntha", "acre", "hectare", "sqm", "sqft"],
    noteHi: "महाराष्ट्र और गुजरात में 1 एकड़ = 40 गुंठा = 43,560 वर्ग फुट। 1 गुंठा = 1,089 वर्ग फुट (101.17 वर्ग मीटर)।",
  },
};

export default function LandAreaConverterClient() {
  const [selectedState, setSelectedState] = useState<string>("up");
  const [inputValue, setInputValue] = useState<string>("5");
  const [fromUnit, setFromUnit] = useState<UnitKey>("pucca_bigha");
  const [toUnit, setToUnit] = useState<UnitKey>("acre");
  const [copied, setCopied] = useState<boolean>(false);

  const preset = STATE_PRESETS[selectedState] ?? STATE_PRESETS.up;

  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const p = STATE_PRESETS[st];
    if (p) {
      setFromUnit(p.defaultFrom);
      setToUnit(p.defaultTo);
    }
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Base calculation in Square Feet
  const areaInSqFt = useMemo(() => {
    const n = parseFloat(inputValue);
    if (isNaN(n) || n <= 0) return 0;
    const fromMeta = UNITS[fromUnit];
    return n * (fromMeta?.sqFtFactor || 1);
  }, [inputValue, fromUnit]);

  // Converted result in target "toUnit"
  const convertedTargetValue = useMemo(() => {
    if (areaInSqFt <= 0) return 0;
    const toMeta = UNITS[toUnit];
    if (!toMeta) return 0;
    const v = areaInSqFt / toMeta.sqFtFactor;
    return v < 0.001 ? Number(v.toFixed(6)) : Number(v.toFixed(4));
  }, [areaInSqFt, toUnit]);

  // Live grid of all units
  const allUnitValues = useMemo(() => {
    if (areaInSqFt <= 0) return [];
    return (Object.keys(UNITS) as UnitKey[]).map((key) => {
      const meta = UNITS[key];
      const val = areaInSqFt / meta.sqFtFactor;
      let formatted: string;
      if (val >= 100) formatted = val.toLocaleString("en-IN", { maximumFractionDigits: 2 });
      else if (val >= 1) formatted = val.toFixed(3);
      else formatted = val.toFixed(4);
      return {
        ...meta,
        value: val,
        formatted,
      };
    });
  }, [areaInSqFt]);

  const handleCopy = () => {
    const text = `${inputValue} ${UNITS[fromUnit]?.shortHi} = ${convertedTargetValue} ${UNITS[toUnit]?.shortHi} (Agriveda ज़मीन नाप कैलकुलेटर)`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `🌾 *Agriveda ज़मीन नाप रूपांतरण*\n\n📏 *${inputValue} ${UNITS[fromUnit]?.labelHi}* का मान:\n➡️ *${convertedTargetValue} ${UNITS[toUnit]?.labelHi}*\n\n📐 *अन्य इकाइयों में:*\n• एकड़: ${(areaInSqFt / UNITS.acre.sqFtFactor).toFixed(3)} एकड़\n• हेक्टेयर: ${(areaInSqFt / UNITS.hectare.sqFtFactor).toFixed(3)} हेक्टेयर\n• वर्ग फुट: ${areaInSqFt.toLocaleString("en-IN", { maximumFractionDigits: 1 })} sq ft\n\nअपने राज्य अनुसार सही नाप जानने के लिए Agriveda ऐप खोलें!`;
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-5">
      {/* State Selector Pills */}
      <DarkCard className="p-3 border-emerald-500/20 bg-emerald-950/20">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
          <MapPin className="h-3.5 w-3.5" />
          <span>अपना राज्य चुनें (स्थानीय बीघा व नाप अनुसार)</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {Object.entries(STATE_PRESETS).map(([k, p]) => (
            <button
              key={k}
              type="button"
              onClick={() => handleStateChange(k)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedState === k
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
                  : "bg-white/5 theme-text-muted hover:bg-white/10"
              }`}
            >
              {p.nameHi}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] theme-text-muted leading-relaxed">
          📌 {preset.noteHi}
        </p>
      </DarkCard>

      {/* Main Interactive Converter Box */}
      <DarkCard className="p-4 border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-bold theme-text-primary">
              ज़मीन नाप कैलकुलेटर
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {preset.nameHi} विशेष
          </span>
        </div>

        {/* Input Area + From Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold theme-text-muted mb-1">
              रकबा / नाप दर्ज करें
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="उदा. 5"
                className="theme-input w-full rounded-xl border px-3 py-3 text-lg font-bold"
              />
            </div>
            {/* Quick Chips */}
            <div className="flex gap-1.5 mt-2">
              {[1, 2, 5, 10].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInputValue(String(val))}
                  className="rounded-md bg-white/5 hover:bg-white/10 px-2 py-1 text-[11px] font-medium theme-text-muted transition"
                >
                  {val}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setInputValue((prev) => String((parseFloat(prev) || 0) + 1))}
                className="rounded-md bg-emerald-500/20 text-emerald-400 px-2 py-1 text-[11px] font-bold"
              >
                +1
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold theme-text-muted mb-1">
              मौजूदा इकाई (From)
            </label>
            <div className="relative">
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as UnitKey)}
                className="theme-input w-full rounded-xl border px-3 py-3 text-sm font-semibold appearance-none pr-8"
              >
                {Object.values(UNITS).map((u) => (
                  <option key={u.key} value={u.key}>
                    {u.labelHi}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 theme-text-muted" />
            </div>
            <p className="mt-2 text-[11px] theme-text-muted truncate">
              {UNITS[fromUnit]?.descriptionHi}
            </p>
          </div>
        </div>

        {/* Swap Button */}
        <div className="my-3 flex items-center justify-center">
          <button
            type="button"
            onClick={swapUnits}
            className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50 px-4 py-1.5 text-xs font-bold text-emerald-400 transition shadow-sm"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>इकाई आपस में बदलें (Swap)</span>
          </button>
        </div>

        {/* Target Unit & Converted Result Card */}
        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-emerald-900/20 to-transparent p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400">
              बदलने के लिए लक्ष्य इकाई (To)
            </span>
            <div className="w-48 relative">
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as UnitKey)}
                className="theme-input w-full rounded-lg border px-2 py-1.5 text-xs font-semibold appearance-none pr-6"
              >
                {Object.values(UNITS).map((u) => (
                  <option key={u.key} value={u.key}>
                    {u.labelHi}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 theme-text-muted" />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 tracking-tight">
              {convertedTargetValue.toLocaleString("en-IN", { maximumFractionDigits: 4 })}
            </span>
            <span className="text-base font-bold theme-text-primary">
              {UNITS[toUnit]?.labelHi}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <div className="text-[11px] theme-text-muted">
              = {areaInSqFt.toLocaleString("en-IN", { maximumFractionDigits: 1 })} वर्ग फुट (sq ft)
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-xs font-medium theme-text-primary transition"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "कॉपी हुआ" : "कॉपी"}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white transition shadow"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>शेयर</span>
              </button>
            </div>
          </div>
        </div>
      </DarkCard>

      {/* Live All-Unit Conversion Grid */}
      <DarkCard className="p-4 border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold theme-text-primary">
              सभी इकाइयों में एक साथ नाप (Live Grid)
            </h3>
          </div>
          <span className="text-xs theme-text-muted">
            {inputValue} {UNITS[fromUnit]?.shortHi} का मान
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {allUnitValues.map((item) => {
            const isTarget = item.key === toUnit;
            const isFrom = item.key === fromUnit;
            return (
              <div
                key={item.key}
                onClick={() => setToUnit(item.key)}
                className={`cursor-pointer rounded-xl p-2.5 border transition-all ${
                  isTarget
                    ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                    : isFrom
                    ? "border-amber-500/50 bg-amber-500/10"
                    : "border-white/5 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="text-[11px] font-semibold theme-text-muted truncate flex items-center justify-between">
                  <span>{item.shortHi}</span>
                  {isTarget && (
                    <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1 py-0.2 rounded">
                      चुना हुआ
                    </span>
                  )}
                </div>
                <div className="text-base font-black theme-text-primary mt-1 truncate">
                  {item.formatted}
                </div>
                <div className="text-[10px] theme-text-muted truncate mt-0.5">
                  {item.regionHi}
                </div>
              </div>
            );
          })}
        </div>
      </DarkCard>

      {/* Standard Indian Reference Table */}
      <DarkCard className="p-4 border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold theme-text-primary">
            अक्सर पूछे जाने वाले नाप (Quick Cheat-Sheet)
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <span className="font-semibold theme-text-primary">1 एकड़ (Acre)</span>
            <span className="text-emerald-400 font-bold">1.6 पक्का बीघा = 43,560 वर्ग फुट = 40 गुंठा = 8 कनाल</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <span className="font-semibold theme-text-primary">1 हेक्टेयर (Hectare)</span>
            <span className="text-emerald-400 font-bold">2.471 एकड़ = 3.95 पक्का बीघा = 10,000 वर्ग मीटर</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <span className="font-semibold theme-text-primary">1 पक्का बीघा (Pucca Bigha)</span>
            <span className="text-emerald-400 font-bold">20 बिस्वा = 27,225 वर्ग फुट = 0.625 एकड़ (3,025 गज)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <span className="font-semibold theme-text-primary">1 कच्चा बीघा (Kachcha Bigha)</span>
            <span className="text-emerald-400 font-bold">1/3 पक्का बीघा = 9,075 वर्ग फुट = 0.208 एकड़</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <span className="font-semibold theme-text-primary">1 बिहार बीघा (Bihar Bigha)</span>
            <span className="text-emerald-400 font-bold">20 कट्ठा = 400 धूर = 27,225 वर्ग फुट (1 कट्ठा = 1,361 sq ft)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <span className="font-semibold theme-text-primary">1 कनाल (Kanal - पंजाब/हरियाणा)</span>
            <span className="text-emerald-400 font-bold">20 मरला = 5,445 वर्ग फुट (1/8 एकड़)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <span className="font-semibold theme-text-primary">1 गुंठा (Guntha - महाराष्ट्र)</span>
            <span className="text-emerald-400 font-bold">1,089 वर्ग फुट = 101.17 वर्ग मीटर (1/40 एकड़)</span>
          </div>
        </div>
      </DarkCard>

      {/* Cross-Link Card to other farming tools */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <AppLink
          href="/services/seed-calculator"
          className="rounded-xl border border-white/10 bg-white/5 p-3 hover:border-emerald-500/40 transition"
        >
          <div className="text-xs font-bold text-emerald-400">🌱 बीज दर कैलकुलेटर</div>
          <div className="text-[11px] theme-text-muted mt-1">
            अपने खेत के बीघा/एकड़ के अनुसार सटीक बीज kg निकालें
          </div>
        </AppLink>
        <AppLink
          href="/services/fertilizer-calculator"
          className="rounded-xl border border-white/10 bg-white/5 p-3 hover:border-emerald-500/40 transition"
        >
          <div className="text-xs font-bold text-amber-400">⚖️ खाद व उर्वरक शेड्यूल</div>
          <div className="text-[11px] theme-text-muted mt-1">
            यूरिया, डीएपी, पोटाश की सटीक बोरी व मात्रा जानें
          </div>
        </AppLink>
      </div>
    </div>
  );
}
