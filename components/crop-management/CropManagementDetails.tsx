import type { CropManagementProfile } from "@/types/crop-management";
import { calculateSeedRequirement } from "@/lib/seedRateCalculator";
import { calculatePlantPopulation } from "@/lib/spacingCalculator";

interface CropManagementDetailsProps {
  profile: CropManagementProfile;
}

export default function CropManagementDetails({ profile }: CropManagementDetailsProps) {
  const seedEstimate = calculateSeedRequirement(profile.seedRate, 1);
  const spacingEstimate = calculatePlantPopulation(profile.spacing, 1);

  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-xl font-bold text-white">Crop Details</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">Category</p>
          <p className="mt-1 text-white">{profile.category}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">Scientific name</p>
          <p className="mt-1 text-white">{profile.scientificName}</p>
        </div>
      </div>
      {seedEstimate && (
        <p className="text-sm text-slate-300">
          Seed requirement estimate: {seedEstimate.perAcre} {seedEstimate.unit}
        </p>
      )}
      {spacingEstimate && (
        <p className="text-sm text-slate-300">
          Estimated plant population: {spacingEstimate.plantsPerAcre.toLocaleString()} plants/acre
        </p>
      )}
    </section>
  );
}
