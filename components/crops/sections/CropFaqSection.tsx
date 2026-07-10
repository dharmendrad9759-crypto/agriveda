"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { getCropManagementProfile } from "@/data/crop-management";
import type { Crop } from "@/types/crop";

export default function CropFaqSection({ crop }: { crop: Crop }) {
  const profile = getCropManagementProfile(crop.slug);
  const faqs = profile?.faqs ?? [];
  const [open, setOpen] = useState<number | null>(0);

  if (!faqs.length) {
    return (
      <div className="crop-premium-empty">
        <p className="text-sm text-[var(--av-text-secondary)]">FAQ data coming soon for {crop.name}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <SectionHeader title="Frequently Asked Questions" />
      <p className="mb-3 text-xs text-[var(--av-text-muted)]">सरल हिंदी-अंग्रेज़ी जवाब</p>
      {faqs.map((faq, i) => (
        <DarkCard key={faq.question} className="!p-0 overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
          >
            <span className="text-sm font-bold text-[var(--av-text-primary)]">{faq.question}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-[var(--av-text-muted)] transition ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[var(--av-border-subtle)]"
              >
                <p className="px-4 py-3 text-sm leading-relaxed text-[var(--av-text-secondary)]">{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DarkCard>
      ))}
    </div>
  );
}
