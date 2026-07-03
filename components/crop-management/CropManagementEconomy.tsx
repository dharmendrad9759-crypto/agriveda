import type { CropManagementProfile } from "@/types/crop-management";

interface CropManagementEconomyProps {
  profile: CropManagementProfile;
}

export default function CropManagementEconomy({ profile }: CropManagementEconomyProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
      <h2 className="text-xl font-bold text-white">Economics</h2>
      <p className="text-sm text-slate-300">Expected yield: {profile.yield}</p>
      <p className="text-sm text-slate-300">Market demand: {profile.marketInformation.demand}</p>
      <p className="text-sm text-slate-300">Price trend: {profile.marketInformation.priceTrend}</p>
    </section>
  );
}
