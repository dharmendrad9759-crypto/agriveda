"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropCommonMistakes, type CropMistake } from "@/lib/crops/cropCommonMistakes";
import type { Crop } from "@/types/crop";

const GROUPS = [
  { id: "before", hi: "बुवाई से पहले", en: "Before sowing" },
  { id: "after", hi: "बुवाई के बाद", en: "After sowing" },
  { id: "other", hi: "और गलतियाँ", en: "Other mistakes" },
] as const;

export default function CropMistakesSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const all = getCropCommonMistakes(crop.slug);

  return (
    <div className="space-y-3">
      {GROUPS.map((group) => {
        const rows = all.filter((row) => row.when === group.id);
        if (rows.length === 0) return null;
        return (
          <section key={group.id} className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-[0_10px_24px_-18px_rgba(11,61,40,0.45)]">
            <h2 className="bg-[#0B3D28] px-3.5 py-2.5 text-[16px] font-black text-white">
              {hi ? group.hi : group.en}
            </h2>
            <ul>
              {rows.map((row) => (
                <li key={row.wrong} className="border-t border-emerald-900/10 px-3.5 py-3">
                  <p className="text-[15px] font-bold leading-snug text-[#8a3b32]">
                    <span className="mr-1.5 text-[12px] font-black text-[#a33b32]">{hi ? "गलती" : "Wrong"}</span>
                    {row.wrong}
                  </p>
                  <p className="mt-1 text-[15px] font-bold leading-snug text-[#0B3D28]">
                    <span className="mr-1.5 text-[12px] font-black text-emerald-800">{hi ? "सही" : "Right"}</span>
                    {row.right}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
