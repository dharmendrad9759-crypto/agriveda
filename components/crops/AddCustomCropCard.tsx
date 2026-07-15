"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, X } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { fadeUp } from "@/lib/motion/variants";
import { useMyCrops } from "@/hooks/useMyCrops";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

const EMOJI_OPTIONS = ["🌱", "🌾", "🌽", "🥔", "🍅", "🧅", "🌶️", "🥜", "🫘", "🥭", "🍌", "🌿"];

export function AddCustomCropCard({ index }: { index: number }) {
  const { addCustomCrop, canAddMore, crops, maxCrops } = useMyCrops();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🌱");
  const [savedName, setSavedName] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setEmoji("🌱");
    setSavedName(null);
  };

  const handleOpen = () => {
    if (!canAddMore) {
      showToast(`Home पर पहले से ${maxCrops} फसलें हैं — एक हटाकर फिर जोड़ें`, "error");
      return;
    }
    reset();
    setOpen(true);
  };

  const handleSave = () => {
    const result = addCustomCrop({ name, emoji });
    if (!result.ok) {
      showToast(result.reason, "error");
      return;
    }
    setSavedName(result.crop.name);
    showToast(`${result.crop.emoji} ${result.crop.name} Home पर जोड़ दी गई`);
  };

  return (
    <>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={index} className="h-full">
        <button
          type="button"
          onClick={handleOpen}
          className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--av-accent)]/40 bg-[var(--av-accent-soft)]/30 p-6 text-center transition hover:border-[var(--av-accent)] hover:bg-[var(--av-accent-soft)]/50 active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--av-accent)] text-white shadow-md">
            <Plus className="h-6 w-6" />
          </span>
          <p className="text-sm font-bold text-[var(--av-accent)]">Add Custom Crop</p>
          <p className="text-[11px] text-[var(--av-text-muted)]">
            सूची में नहीं है? Home के लिए जोड़ें
          </p>
          <p className="text-[10px] font-semibold text-[var(--av-text-muted)]">
            {crops.length}/{maxCrops} Home crops
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
              aria-labelledby="add-custom-crop-title"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-md rounded-[24px] border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h2 id="add-custom-crop-title" className="text-base font-black text-[var(--av-text-primary)]">
                    Custom crop जोड़ें
                  </h2>
                  <p className="text-[11px] text-[var(--av-text-muted)]">
                    Home dashboard / My crops के लिए — सूची से अलग
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

              {savedName ? (
                <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-6 w-6" />
                  </span>
                  <p className="text-sm font-bold text-emerald-900">
                    {emoji} {savedName} Home पर जुड़ गई
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        reset();
                      }}
                      className="flex-1 rounded-xl border border-emerald-300 bg-white py-2.5 text-xs font-bold text-emerald-700"
                    >
                      और जोड़ें
                    </button>
                    <AppLink
                      href="/"
                      className="flex flex-1 items-center justify-center rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white"
                    >
                      Home खोलें
                    </AppLink>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--av-text-muted)]">
                      फसल का नाम *
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="जैसे: अर्हर, जीरा, लहसुन…"
                      className="mt-1 w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2.5 text-sm outline-none focus:border-[var(--av-accent)]"
                      autoFocus
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--av-text-muted)]">
                      Icon
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {EMOJI_OPTIONS.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => setEmoji(e)}
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-xl border text-lg transition",
                            emoji === e
                              ? "border-[var(--av-accent)] bg-[var(--av-accent-soft)]"
                              : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
                          )}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={name.trim().length < 2}
                    className="w-full rounded-xl bg-[var(--av-accent)] py-3 text-sm font-bold text-white disabled:opacity-50"
                  >
                    Home में जोड़ें
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
