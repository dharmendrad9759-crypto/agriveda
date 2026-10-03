"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import type { FieldSituation, FieldVariety, FieldVarietyGuide } from "@/lib/crops/fieldVarietyGuide";
import SeedPacket from "@/components/crops/SeedPacket";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { varietySeedRate } from "@/lib/crops/practicalSeedRates";
import { varietyEnglishName, varietyLooksHybrid } from "@/lib/crops/varietyEnglish";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const STATE_HI: Record<string, string> = {
  Punjab: "पंजाब",
  Haryana: "हरियाणा",
  "Uttar Pradesh": "उत्तर प्रदेश",
  "Madhya Pradesh": "मध्य प्रदेश",
  Bihar: "बिहार",
  Rajasthan: "राजस्थान",
  Maharashtra: "महाराष्ट्र",
  Gujarat: "गुजरात",
  Karnataka: "कर्नाटक",
  Telangana: "तेलंगाना",
  "Andhra Pradesh": "आंध्र प्रदेश",
  "West Bengal": "पश्चिम बंगाल",
  Jharkhand: "झारखंड",
  Chhattisgarh: "छत्तीसगढ़",
  Uttarakhand: "उत्तराखंड",
  "Himachal Pradesh": "हिमाचल",
  "Jammu and Kashmir": "जम्मू-कश्मीर",
  Delhi: "दिल्ली",
  Odisha: "ओडिशा",
  "Tamil Nadu": "तमिलनाडु",
  Kerala: "केरल",
};

const POPULAR = [
  "Haryana",
  "Punjab",
  "Uttar Pradesh",
  "Bihar",
  "Rajasthan",
  "Madhya Pradesh",
  "Maharashtra",
  "Gujarat",
  "West Bengal",
  "Karnataka",
];

type SortId = "area" | "early" | "yield";

function packetKind(cropSlug: string, shop: boolean): "hybrid" | "shop" | "public" {
  if (varietyLooksHybrid(cropSlug, shop)) return "hybrid";
  return shop ? "shop" : "public";
}

function stateLabel(name: string, hi: boolean) {
  if (!hi) return name;
  return STATE_HI[name] ?? name;
}

function firstNumber(text: string): number | null {
  const match = text.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function isLeadSeed(name: string, situation: FieldSituation | null) {
  if (!situation) return false;
  const pick = situation.pick.toLowerCase();
  const hay = name.toLowerCase();
  return situation.match.some(
    (token) => token.length > 2 && pick.includes(token.toLowerCase()) && hay.includes(token.toLowerCase())
  );
}

function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[86vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white px-4 pb-8 pt-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-emerald-900/15" />
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[18px] font-black text-[#0B3D28]">{title}</h2>
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-[#0B3D28]" aria-label="बंद करें">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default function FieldVarietyBoard({
  guide,
  state,
  cropSlug,
  cropLabel,
}: {
  guide: FieldVarietyGuide;
  state?: string;
  cropSlug: string;
  cropLabel: string;
}) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const photo = resolveCropImage({ slug: cropSlug, name: cropLabel });
  const [query, setQuery] = useState("");
  const [situationId, setSituationId] = useState("all");
  const [stateId, setStateId] = useState("all");
  const [stateTouched, setStateTouched] = useState(false);
  const [sort, setSort] = useState<SortId>("area");
  const [stateOpen, setStateOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [stateQuery, setStateQuery] = useState("");
  const [openVariety, setOpenVariety] = useState<FieldVariety | null>(null);

  const states = useMemo(() => {
    const set = new Set<string>();
    for (const item of guide.varieties) for (const name of item.states) set.add(name);
    return [...set].sort((a, b) => a.localeCompare(b, "en"));
  }, [guide.varieties]);

  useEffect(() => {
    if (stateTouched || !state) return;
    const hit = states.find((name) => name.toLowerCase() === state.toLowerCase());
    if (hit) setStateId(hit);
  }, [state, states, stateTouched]);

  const situation = guide.situations.find((item) => item.id === situationId) ?? null;
  const visibleSituations = guide.situations.slice(0, 3);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = guide.varieties.filter((item) => {
      if (stateId !== "all" && !item.states.some((name) => name.toLowerCase() === stateId.toLowerCase())) return false;
      if (situation) {
        const hay = item.name.toLowerCase();
        if (!situation.match.some((token) => hay.includes(token.toLowerCase()))) return false;
      }
      if (!q) return true;
      const blob = `${item.name} ${varietyEnglishName(item.name)} ${item.who} ${item.why} ${item.fit} ${item.days}`.toLowerCase();
      return blob.includes(q);
    });
    const ranked = [...rows];
    if (sort === "early") {
      ranked.sort((a, b) => (firstNumber(a.days) ?? 9999) - (firstNumber(b.days) ?? 9999));
    } else if (sort === "yield") {
      ranked.sort((a, b) => (firstNumber(b.farmQ) ?? 0) - (firstNumber(a.farmQ) ?? 0));
    } else if (situation) {
      ranked.sort((a, b) => Number(isLeadSeed(b.name, situation)) - Number(isLeadSeed(a.name, situation)));
    }
    return ranked;
  }, [guide.varieties, stateId, situation, query, sort]);

  const place = stateId === "all" ? (hi ? "पूरा भारत" : "All India") : stateLabel(stateId, hi);
  const resultTitle = stateId === "all"
    ? hi ? "सारी किस्में" : "All varieties"
    : hi ? `${place} के लिए किस्में` : `Varieties for ${place}`;

  const stateHits = states.filter((name) => {
    const q = stateQuery.trim().toLowerCase();
    if (!q) return true;
    return name.toLowerCase().includes(q) || stateLabel(name, true).includes(stateQuery.trim());
  });
  const popularHits = POPULAR.filter((name) => states.includes(name) && stateHits.includes(name));

  function clearFilters() {
    setQuery("");
    setSituationId("all");
    setSort("area");
    setStateTouched(true);
    const hit = state ? states.find((name) => name.toLowerCase() === state.toLowerCase()) : undefined;
    setStateId(hit ?? "all");
  }

  return (
    <div className="space-y-2.5 pb-6">
      <label className="flex min-h-10 items-center gap-2 rounded-xl border border-emerald-900/10 bg-white px-3">
        <Search className="h-5 w-5 shrink-0 text-emerald-800" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label={hi ? "किस्म खोजें" : "Search variety"}
          placeholder={hi ? "जैसे: मेघा, पूसा..." : "Try: Megha, Pusa..."}
          className="w-full bg-transparent text-[16px] font-semibold text-[#0B3D28] outline-none placeholder:text-[#6d857a]"
        />
      </label>

      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          <button type="button" onClick={() => setStateOpen(true)} className="min-h-9 shrink-0 rounded-full bg-emerald-800 px-3 text-[13px] font-black text-white">
            {place}
          </button>
          {visibleSituations.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSituationId(situationId === item.id ? "all" : item.id)}
              className={`min-h-9 shrink-0 rounded-full border px-3 text-[13px] font-bold ${
                situationId === item.id ? "border-emerald-800 bg-emerald-50 text-emerald-900" : "border-emerald-900/10 bg-white text-[#0B3D28]"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button type="button" onClick={() => setMoreOpen(true)} className="min-h-9 shrink-0 rounded-full border border-emerald-900/10 bg-white px-3 text-[13px] font-bold text-[#0B3D28]">
            {hi ? "और फ़िल्टर" : "More filters"}
          </button>
      </div>

      {situation ? (
        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50 px-3.5 py-3">
          <p className="text-[16px] font-black text-[#0B3D28]">{situation.pick}</p>
          <p className="mt-1 text-[14px] font-semibold text-[#34584a]">{hi ? `न मिले तो ${situation.backup}` : `If missing: ${situation.backup}`}</p>
          <p className="mt-1 text-[14px] leading-snug text-[#34584a]">{situation.note}</p>
        </div>
      ) : null}

      <p className="text-[14px] font-black text-[#0B3D28]">
        {resultTitle}
        <span className="font-semibold text-[#34584a]">
          {" · "}
          {hi
            ? list.length === 0
              ? "कोई किस्म नहीं"
              : list.length === 1
                ? "1 किस्म"
                : `${list.length} किस्में`
            : `${list.length}`}
        </span>
      </p>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-emerald-900/20 bg-white px-4 py-8 text-center">
          <p className="text-3xl" aria-hidden>🌱</p>
          <p className="mt-2 text-[18px] font-black text-[#0B3D28]">{hi ? "अभी कोई किस्म नहीं मिली" : "No variety found"}</p>
          <p className="mt-1 text-[15px] text-[#34584a]">{situation && situation.match.length === 0 ? situation.note : hi ? "फ़िल्टर बदलकर फिर देखें।" : "Change the filters and look again."}</p>
          <button type="button" onClick={clearFilters} className="mt-4 min-h-12 rounded-full bg-emerald-800 px-5 text-[15px] font-black text-white">
            {hi ? "फ़िल्टर साफ करें" : "Clear filters"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {list.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setOpenVariety(item)}
              className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white text-left active:scale-[0.99]"
            >
              <SeedPacket
                photo={photo}
                cropLabel={cropLabel}
                englishName={varietyEnglishName(item.name)}
                hindiName={item.name}
                kind={packetKind(cropSlug, item.shop)}
                compact
              />
              <div className="flex items-center justify-between gap-2 px-2.5 py-1.5">
                <p className="min-w-0 text-[12px] font-bold leading-tight text-[#0B3D28]">
                  {item.days}
                  <span className="text-[#34584a]"> · {item.farmQ.replace(/^खेत में\s*/, "")}</span>
                </p>
                <p className="shrink-0 text-[12px] font-black text-emerald-800">{hi ? "पूरी जानकारी" : "Details"}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {stateOpen ? (
        <Sheet title={hi ? "अपना राज्य चुनें" : "Choose your state"} onClose={() => setStateOpen(false)}>
          <label className="mb-3 flex min-h-12 items-center gap-2 rounded-2xl border border-emerald-900/10 px-3">
            <Search className="h-5 w-5 text-emerald-800" />
            <input value={stateQuery} onChange={(event) => setStateQuery(event.target.value)} placeholder={hi ? "राज्य खोजें" : "Search state"} className="w-full bg-transparent text-[16px] outline-none" />
          </label>
          <button type="button" className="mb-2 flex min-h-12 w-full items-center rounded-2xl px-2 text-left text-[16px] font-bold" onClick={() => { setStateTouched(true); setStateId("all"); setStateOpen(false); }}>
            {hi ? "सभी राज्य" : "All states"}
          </button>
          {(stateQuery.trim() ? stateHits : [...new Set([...popularHits, ...stateHits])]).map((name) => (
            <button
              key={name}
              type="button"
              className="flex min-h-12 w-full items-center rounded-2xl px-2 text-left text-[16px] font-bold text-[#0B3D28] active:bg-emerald-50"
              onClick={() => { setStateTouched(true); setStateId(name); setStateOpen(false); }}
            >
              {stateLabel(name, hi)}
            </button>
          ))}
        </Sheet>
      ) : null}

      {moreOpen ? (
        <Sheet title={hi ? "और फ़िल्टर" : "More filters"} onClose={() => setMoreOpen(false)}>
          <p className="mb-2 text-[14px] font-black text-[#34584a]">{hi ? "खेत की हालत" : "Field situation"}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setSituationId("all")} className={`min-h-11 rounded-full px-3 text-[14px] font-bold ${situationId === "all" ? "bg-emerald-800 text-white" : "bg-emerald-50 text-[#0B3D28]"}`}>{hi ? "सारी" : "All"}</button>
            {guide.situations.map((item) => (
              <button key={item.id} type="button" onClick={() => setSituationId(item.id)} className={`min-h-11 rounded-full px-3 text-left text-[14px] font-bold ${situationId === item.id ? "bg-emerald-800 text-white" : "bg-emerald-50 text-[#0B3D28]"}`}>
                {item.label}
              </button>
            ))}
          </div>
          <p className="mb-2 mt-4 text-[14px] font-black text-[#34584a]">{hi ? "क्रम" : "Order"}</p>
          {([
            ["area", hi ? "आपके क्षेत्र के अनुसार" : "For your area"],
            ["early", hi ? "जल्दी तैयार होने वाली" : "Ready sooner"],
            ["yield", hi ? "लिखा हुआ अधिक उपज" : "Higher written yield"],
          ] as const).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setSort(id)} className={`mb-2 flex min-h-12 w-full items-center rounded-2xl px-3 text-left text-[16px] font-bold ${sort === id ? "bg-emerald-800 text-white" : "bg-emerald-50 text-[#0B3D28]"}`}>
              {label}
            </button>
          ))}
          <button type="button" onClick={() => setMoreOpen(false)} className="mt-2 min-h-12 w-full rounded-full bg-emerald-800 text-[16px] font-black text-white">
            {hi ? "देखें" : "Show"}
          </button>
        </Sheet>
      ) : null}

      {openVariety ? (
        <Sheet title={hi ? "पूरी जानकारी" : "Details"} onClose={() => setOpenVariety(null)}>
          <SeedPacket
            photo={photo}
            cropLabel={cropLabel}
            englishName={varietyEnglishName(openVariety.name)}
            hindiName={openVariety.name}
            kind={packetKind(cropSlug, openVariety.shop)}
            large
          />
          <p className="text-[15px] font-semibold text-[#34584a]">{cropLabel} · {openVariety.who}</p>
          <p className="mt-2 text-[16px] font-black text-[#0B3D28]">{hi ? "तैयार होने में" : "Time"}: {openVariety.days}</p>
          <p className="mt-1 text-[16px] font-black text-[#0B3D28]">{hi ? "लगभग उपज" : "Field yield"}: {openVariety.farmQ}</p>
          {varietySeedRate(cropSlug, openVariety) ? (
            <>
              <p className="mt-1 text-[16px] font-black text-[#0B3D28]">
                {hi ? "बीज की मात्रा" : "Seed rate"}: {varietySeedRate(cropSlug, openVariety)?.labelHi}
              </p>
              {varietySeedRate(cropSlug, openVariety)?.noteHi ? (
                <p className="mt-1 text-[15px] leading-snug text-[#34584a]">{varietySeedRate(cropSlug, openVariety)?.noteHi}</p>
              ) : null}
            </>
          ) : null}
          <p className="mt-1 text-[15px] font-semibold text-[#34584a]">
            {openVariety.states.map((name) => stateLabel(name, hi)).join(", ")}
          </p>
          <h3 className="mt-4 text-[16px] font-black text-[#0B3D28]">{hi ? "इस किस्म की खास बात" : "What stands out"}</h3>
          <p className="mt-1 text-[15px] leading-snug text-[#0B3D28]">{openVariety.why}</p>
          <h3 className="mt-4 text-[16px] font-black text-[#0B3D28]">{hi ? "सावधानी" : "Watch out"}</h3>
          <p className="mt-1 text-[15px] leading-snug text-[#0B3D28]">{openVariety.weak}</p>
          <h3 className="mt-4 text-[16px] font-black text-[#0B3D28]">{hi ? "किस खेत में फिट" : "Where it fits"}</h3>
          <p className="mt-1 text-[15px] leading-snug text-[#0B3D28]">{openVariety.fit}</p>
          <p className="mt-4 rounded-2xl bg-emerald-50 px-3 py-3 text-[15px] font-semibold leading-snug text-[#0B3D28]">
            {stateId !== "all" && openVariety.states.some((name) => name.toLowerCase() === stateId.toLowerCase())
              ? hi
                ? "यह किस्म आपके चुने हुए राज्य की सूची में है। बाकी हालत ऊपर लिखी बात से मिला लें।"
                : "This variety is listed for the state you chose. Match the note above with your field."
              : hi
                ? "यह किस्म हर राज्य के लिए नहीं लिखी। अपना राज्य ऊपर से मिला लें।"
                : "This variety is not listed for every state. Check your state."}
          </p>
        </Sheet>
      ) : null}
    </div>
  );
}
