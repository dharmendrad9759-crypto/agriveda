"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AgronomicSection } from "@/data/crop-dashboard";
import GlassCard from "@/components/ui/GlassCard";

interface AgronomicAccordionProps {
  sections: AgronomicSection[];
}

export default function AgronomicAccordion({ sections }: AgronomicAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(sections[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const isOpen = openId === section.id;

        return (
          <GlassCard key={section.id} strong className="overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : section.id)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-emerald-50/30"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 text-xl shadow-sm">
                {section.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-slate-900">{section.title}</p>
                <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                  {section.summary}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 flex-shrink-0 text-emerald-600 transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="border-t border-emerald-100/60 px-5 pb-5 pt-4">
                  <div className="space-y-3">
                    {section.fields.map((field) => (
                      <div
                        key={field.label}
                        className="rounded-2xl bg-gradient-to-r from-slate-50/80 to-emerald-50/40 px-4 py-3"
                      >
                        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                          {field.label}
                        </p>
                        <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">
                          {field.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {section.tips.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Pro Tips
                      </p>
                      <ul className="space-y-2">
                        {section.tips.map((tip) => (
                          <li
                            key={tip}
                            className="flex items-start gap-2 text-xs font-medium leading-relaxed text-slate-600"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
