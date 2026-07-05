"use client";

import { Languages, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import {
  TRANSLATE_LANGUAGES,
  applyPageTranslation,
  getSavedTranslateCode,
  type TranslateLanguage,
} from "@/lib/translator";
import { cn } from "@/lib/cn";

export default function TranslatorFab() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("en");

  useEffect(() => {
    setActive(getSavedTranslateCode());
  }, []);

  const select = (lang: TranslateLanguage) => {
    if (lang.code === active) {
      setOpen(false);
      return;
    }
    applyPageTranslation(lang);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-36 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-600 shadow-lg transition hover:scale-105 md:bottom-8 md:right-8"
        style={{ color: "#ffffff" }}
        aria-label="Translate page"
      >
        <Languages className="h-5 w-5" style={{ color: "#ffffff" }} />
      </button>

      {open && (
        <div
          className="agriveda-force-dark fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-4 sm:items-center"
          data-theme="dark"
        >
          <div
            role="dialog"
            aria-label="Translate"
            className="max-h-[80vh] w-full max-w-sm overflow-hidden rounded-3xl border border-emerald-500/25 bg-[#030712] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-emerald-500/15 px-5 py-4">
              <div>
                <h2 className="text-base font-extrabold text-white">Translate</h2>
                <p className="text-[11px] text-slate-400">
                  App is in English — pick a language to read it
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-slate-400"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="max-h-[60vh] overflow-y-auto p-3">
              {TRANSLATE_LANGUAGES.map((lang) => (
                <li key={lang.code}>
                  <button
                    type="button"
                    onClick={() => select(lang)}
                    className={cn(
                      "mb-1.5 flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold transition",
                      active === lang.code
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-300"
                        : "border-transparent text-slate-100 hover:bg-emerald-500/10"
                    )}
                  >
                    <span>
                      {lang.label}
                      {lang.note && (
                        <span className="mt-0.5 block text-[10px] font-medium text-slate-500">
                          {lang.note}
                        </span>
                      )}
                    </span>
                    {active === lang.code && <Check className="h-4 w-4 text-emerald-400" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
