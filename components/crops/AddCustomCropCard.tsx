"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { cropCatalog } from "@/data/crop-catalog";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { fadeUp } from "@/lib/motion/variants";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { cn } from "@/lib/cn";
import type { Crop } from "@/types/crop";

/** Extra popular names/aliases to make search easier (maps to existing crop slug when possible). */
const SEARCH_ALIASES: { slug: string; aliases: string[] }[] = [
  { slug: "paddy", aliases: ["rice", "dhaan", "धान", "चावल", "paddy"] },
  { slug: "wheat", aliases: ["gehun", "गेहूँ", "गेहूं"] },
  { slug: "maize", aliases: ["makka", "corn", "मक्का"] },
  { slug: "bajra", aliases: ["pearl millet", "बाजरा"] },
  { slug: "potato", aliases: ["aloo", "आलू"] },
  { slug: "tomato", aliases: ["tamatar", "टमाटर"] },
  { slug: "onion", aliases: ["pyaz", "प्याज"] },
  { slug: "chilli", aliases: ["mirch", "मिर्च", "lal mirch"] },
  { slug: "cauliflower", aliases: ["gobhi", "फूलगोभी", "gobi"] },
  { slug: "cucumber", aliases: ["kheera", "खीरा"] },
  { slug: "brinjal", aliases: ["baingan", "बैंगन", "eggplant"] },
  { slug: "bhindi", aliases: ["okra", "भिंडी", "bhindi"] },
  { slug: "cotton", aliases: ["kapas", "कपास"] },
  { slug: "sugarcane", aliases: ["ganna", "गन्ना"] },
  { slug: "soybean", aliases: ["soya", "सोयाबीन"] },
  { slug: "moongfali", aliases: ["groundnut", "peanut", "मूंगफली", "mungfali"] },
  { slug: "mustard", aliases: ["sarson", "सरसों"] },
  { slug: "pulses", aliases: ["arhar", "tur", "dal", "दाल", "अरहर", "तूर"] },
  { slug: "moong", aliases: ["mung", "मूंग", "green gram"] },
  { slug: "mango", aliases: ["aam", "आम"] },
  { slug: "banana", aliases: ["kela", "केला"] },
  { slug: "grapes", aliases: ["angoor", "अंगूर"] },
];

interface Props {
  crops: Crop[];
  index: number;
  /** When set, picking a crop also fills the page search */
  onSelectName?: (name: string) => void;
}

export function AddCustomCropCard({ crops, index, onSelectName }: Props) {
  const navigate = useAppNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const entries = useMemo(() => {
    return crops.map((crop) => {
      const hi = getCropHindiName(crop.slug) ?? "";
      const aliases =
        SEARCH_ALIASES.find((a) => a.slug === crop.slug)?.aliases.join(" ") ?? "";
      const hay = `${crop.name} ${hi} ${crop.scientificName} ${crop.category} ${aliases}`.toLowerCase();
      return { crop, hi, hay };
    });
  }, [crops]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((e) => e.hay.includes(needle));
  }, [entries, q]);

  const popular = useMemo(() => entries.slice(0, 8), [entries]);

  const pick = (crop: Crop) => {
    onSelectName?.(crop.name);
    setOpen(false);
    setQ("");
    navigate(`/crops/${crop.slug}`);
  };

  return (
    <>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={index} className="h-full">
        <button
          type="button"
          onClick={() => {
            setQ("");
            setOpen(true);
          }}
          className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--av-accent)]/40 bg-[var(--av-accent-soft)]/30 p-6 text-center transition hover:border-[var(--av-accent)] hover:bg-[var(--av-accent-soft)]/50 active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--av-accent)] text-white shadow-md">
            <Search className="h-6 w-6" />
          </span>
          <p className="text-sm font-bold text-[var(--av-accent)]">फसल खोजें</p>
          <p className="text-[11px] text-[var(--av-text-muted)]">
            लिस्ट + सर्च से आसानी से खोलें
          </p>
          <p className="text-[10px] font-semibold text-[var(--av-text-muted)]">
            {crops.length} crops in guide
          </p>
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-3 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="find-crop-title"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-[24px] border border-[var(--av-border)] bg-[var(--av-surface)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2 border-b border-[var(--av-border)] px-4 py-3">
                <div>
                  <h2 id="find-crop-title" className="text-base font-black text-[var(--av-text-primary)]">
                    फसल चुनें
                  </h2>
                  <p className="text-[11px] text-[var(--av-text-muted)]">
                    नाम / हिंदी / alias से सर्च करें
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-[var(--av-surface-inset)] p-2 text-[var(--av-text-muted)]"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="border-b border-[var(--av-border)] px-4 py-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="जैसे: धान, aloo, sarson, cotton…"
                    className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[var(--av-accent)]"
                    autoFocus
                  />
                </div>
                {!q.trim() && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {popular.map(({ crop, hi }) => (
                      <button
                        key={crop.slug}
                        type="button"
                        onClick={() => pick(crop)}
                        className="rounded-full border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-2.5 py-1 text-[10px] font-bold text-[var(--av-text-primary)]"
                      >
                        {crop.name}
                        {hi ? ` · ${hi}` : ""}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <ul className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
                {filtered.length === 0 ? (
                  <li className="px-3 py-8 text-center text-sm text-[var(--av-text-muted)]">
                    कोई फसल नहीं मिली — दूसरा शब्द try करें
                  </li>
                ) : (
                  filtered.map(({ crop, hi }) => (
                    <li key={crop.slug}>
                      <button
                        type="button"
                        onClick={() => pick(crop)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                          "hover:bg-[var(--av-accent-soft)]/60 active:scale-[0.99]"
                        )}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--av-surface-inset)] text-xl">
                          {cropCatalog.find((c) => c.slug === crop.slug)?.emoji ?? "🌿"}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-[var(--av-text-primary)]">
                            {crop.name}
                            {hi ? (
                              <span className="ml-1 font-semibold text-[var(--av-text-muted)]">
                                ({hi})
                              </span>
                            ) : null}
                          </span>
                          <span className="block truncate text-[10px] text-[var(--av-text-muted)]">
                            {crop.category} · {crop.suitableSeason}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
