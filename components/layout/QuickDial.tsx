"use client";

import { Phone, X } from "lucide-react";
import { useState } from "react";

const HELPLINES = [
  {
    name: "Kisan Call Centre",
    number: "1800-180-1551",
    tel: "18001801551",
    desc: "24×7 — सभी फसल सवाल",
  },
  {
    name: "Agriveda Expert",
    number: "1800-572-1551",
    tel: "18005721551",
    desc: "कीट-रोग सलाह",
  },
  {
    name: "Soil Health Helpline",
    number: "1800-267-6768",
    tel: "18002676768",
    desc: "मिट्टी परीक्षण",
  },
];

export default function QuickDial() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-36 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500 text-white shadow-lg transition hover:scale-105 md:bottom-20"
        aria-label="Expert helpline"
      >
        <Phone className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-md animate-sheet-up rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold theme-text-primary">कृषि विशेषज्ञ कॉल</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 theme-text-muted hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-sm theme-text-muted">तुरंत मदद — निःशुल्क हेल्पलाइन</p>
            <div className="mt-4 space-y-3">
              {HELPLINES.map((h) => (
                <a
                  key={h.tel}
                  href={`tel:${h.tel}`}
                  className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4 transition hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20"
                >
                  <div>
                    <p className="font-bold text-emerald-800 dark:text-emerald-300">{h.name}</p>
                    <p className="text-xs theme-text-muted">{h.desc}</p>
                  </div>
                  <span className="text-sm font-black text-emerald-600">{h.number}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
