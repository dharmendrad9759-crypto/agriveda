import type { CropManagementProfile } from "@/types/crop-management";
import FuturisticPanel, { SciBadge } from "@/components/ui/FuturisticPanel";
import { ShieldAlert } from "lucide-react";

interface Props {
  profile: CropManagementProfile;
}

export default function CropManagementDiseaseManagement({ profile }: Props) {
  return (
    <FuturisticPanel
      title="Disease Management"
      subtitle="Pathogen taxonomy · FRAC classification"
      icon={ShieldAlert}
      glow
    >
      <div className="space-y-5">
        {profile.diseaseManagement.map((disease) => (
          <article
            key={disease.diseaseName}
            className="overflow-hidden rounded-2xl border border-purple-500/15 bg-black/30"
          >
            <div className="border-b border-purple-500/10 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-white">{disease.diseaseName}</h3>
                <SciBadge variant="cyan">FRAC {disease.fracGroup}</SciBadge>
              </div>
              <p className="mt-1 text-xs italic text-purple-300">{disease.pathogen}</p>
            </div>
            <div className="space-y-3 p-4 text-sm text-slate-300">
              <p><span className="font-bold text-white">Type:</span> {disease.type}</p>
              <p><span className="font-bold text-white">Symptoms:</span> {disease.symptoms.join("; ")}</p>
              <p><span className="font-bold text-white">Active ingredient:</span> {disease.activeIngredient} @ {disease.dose}</p>
              <p><span className="font-bold text-white">Pre-harvest interval:</span> {disease.waitingPeriod}</p>
            </div>
          </article>
        ))}
      </div>
    </FuturisticPanel>
  );
}
