import Link from "next/link";
import type { CropManagementProfile } from "@/types/crop-management";
import FuturisticPanel from "@/components/ui/FuturisticPanel";
import { Microscope, ExternalLink } from "lucide-react";
import { toFarmerCropNutrientCard } from "@/lib/nutrients/farmerNutrientView";

interface Props {
  profile: CropManagementProfile;
}

const SLUG_BY_NAME: Record<string, string> = {
  Nitrogen: "nitrogen",
  Phosphorus: "phosphorus",
  Potassium: "potassium",
  Calcium: "calcium",
  Magnesium: "magnesium",
  Sulphur: "sulphur",
  Sulfur: "sulphur",
  Iron: "iron",
  Zinc: "zinc",
  Boron: "boron",
  Copper: "copper",
  Manganese: "manganese",
  Molybdenum: "molybdenum",
  Silicon: "silicon",
  Chlorine: "chlorine",
  Cobalt: "cobalt",
  Nickel: "nickel",
};

const DEFICIENCY_COLORS: Record<string, string> = {
  Nitrogen: "border-l-yellow-400",
  Phosphorus: "border-l-purple-400",
  Potassium: "border-l-orange-400",
  Magnesium: "border-l-green-400",
  Zinc: "border-l-blue-400",
  Boron: "border-l-pink-400",
  Calcium: "border-l-slate-300",
  Iron: "border-l-red-400",
};

export default function CropManagementNutrientDeficiencies({ profile }: Props) {
  const items = profile.nutrientDeficiencies.map((item) =>
    toFarmerCropNutrientCard(
      item.name,
      item.deficiencySymptoms,
      item.management,
      item.recommendedFertilizers
    )
  );

  return (
    <FuturisticPanel
      title="पोषक तत्व की कमी"
      subtitle="सरल हिंदी — लक्षण और उपाय"
      icon={Microscope}
      glow
    >
      <div className="space-y-3">
        {items.map((item, idx) => {
          const engName = profile.nutrientDeficiencies[idx]?.name ?? "";
          const slug = SLUG_BY_NAME[engName];
          const color =
            DEFICIENCY_COLORS[engName] ?? "border-l-emerald-400";

          return (
            <details
              key={engName}
              className={`group overflow-hidden rounded-2xl border border-white/8 border-l-4 bg-black/25 ${color}`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                <p className="text-sm font-extrabold text-white">{item.nameHi}</p>
                <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400 group-open:hidden">
                  खोलें
                </span>
              </summary>

              <div className="border-t border-white/5 px-4 pb-4 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">
                  लक्षण
                </p>
                <ul className="mt-1.5 space-y-1">
                  {item.lakshan.map((s) => (
                    <li key={s} className="text-xs text-yellow-100/85">
                      • {s}
                    </li>
                  ))}
                </ul>

                {item.upay.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
                      उपाय
                    </p>
                    <ul className="mt-1 space-y-1">
                      {item.upay.map((m) => (
                        <li key={m} className="text-xs text-emerald-200/85">
                          • {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.khad.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.khad.map((f) => (
                      <span
                        key={f}
                        className="rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-2 py-0.5 text-[11px] font-semibold text-emerald-200"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {slug && (
                  <Link
                    href={`/deficiencies/${slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    पूरा गाइड देखें
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </FuturisticPanel>
  );
}
