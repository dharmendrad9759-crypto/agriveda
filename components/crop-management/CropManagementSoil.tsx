import type { CropManagementProfile } from "@/types/crop-management";

interface CropManagementSoilProps {
  profile: CropManagementProfile;
}

export default function CropManagementSoil({ profile }: CropManagementSoilProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-xl font-bold text-white">Soil</h2>
      <p className="text-sm leading-7 text-slate-300">{profile.soil}</p>
    </section>
  );
}
