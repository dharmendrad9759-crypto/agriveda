"use client";

import type { FieldMedicine } from "@/lib/crops/fieldMedicine";

const TONE = [
  "border-emerald-700/20 bg-emerald-50/80",
  "border-sky-700/20 bg-sky-50/80",
  "border-rose-700/20 bg-rose-50/70",
  "border-amber-700/25 bg-amber-50/80",
  "border-stone-400/30 bg-stone-50",
];

export default function FieldMedicinePanel({
  guide,
  hi,
}: {
  guide: FieldMedicine;
  hi: boolean;
}) {
  return (
    <div className="space-y-3">
      {guide.tiers.map((tier, index) => (
        <section
          key={tier.title}
          className={`rounded-2xl border p-3 ${TONE[index % TONE.length]}`}
        >
          <h3 className="text-[15px] font-black leading-snug text-[#12281C]">
            {index + 1}. {tier.title}
          </h3>
          <ul className="mt-2 space-y-2">
            {tier.lines.map((line) => (
              <li
                key={line}
                className="rounded-xl border border-black/5 bg-white px-3 py-2.5 text-[14px] font-medium leading-relaxed text-[#1c3328]"
              >
                {line}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {guide.tips.length ? (
        <section className="rounded-2xl border border-[#1B4D3E]/20 bg-[#f4f7f2] p-3">
          <h3 className="text-[15px] font-black leading-snug text-[#12281C]">
            {hi ? "खेत की बात" : "Field note"}
          </h3>
          <ul className="mt-2 space-y-2">
            {guide.tips.map((tip) => (
              <li
                key={tip}
                className="text-[14px] font-medium leading-relaxed text-[#1c3328]"
              >
                {tip}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
