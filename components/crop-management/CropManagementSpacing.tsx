import type { CropManagementProfile } from "@/types/crop-management";
import { calculatePlantPopulation } from "@/lib/spacingCalculator";

interface CropManagementSpacingProps {
  profile: CropManagementProfile;
}

export default function CropManagementSpacing({ profile }: CropManagementSpacingProps) {
  const estimate = calculatePlantPopulation(profile.spacing, 1);

  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-xl font-bold text-white">Spacing</h2>
      <p className="text-sm text-slate-300">{profile.spacing}</p>
      {estimate && (
        <p className="text-sm text-emerald-300">
          Estimated population: {estimate.plantsPerAcre.toLocaleString()} plants/acre
        </p>
      )}
    </section>
  );
}
