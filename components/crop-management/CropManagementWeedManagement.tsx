import type { CropManagementProfile } from "@/types/crop-management";

interface CropManagementWeedManagementProps {
  profile: CropManagementProfile;
}

export default function CropManagementWeedManagement({ profile }: CropManagementWeedManagementProps) {
  if (!profile.weedManagement?.length) {
    return (
      <section className="agriveda-glass rounded-2xl p-6">
        <p className="text-sm theme-text-muted">Weed management data not available for this crop yet.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-extrabold theme-text-primary">Weed Management</h2>
      {profile.weedManagement.map((weed) => (
        <article key={weed.weedName} className="agriveda-glass space-y-2 rounded-2xl p-4">
          <h3 className="font-bold theme-text-primary">{weed.weedName}</h3>
          <p className="text-sm italic theme-text-muted">{weed.scientificName}</p>
          <p className="text-sm theme-text-muted">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Critical period:</span>{" "}
            {weed.criticalPeriod}
          </p>
          <p className="text-sm theme-text-muted">
            <span className="font-semibold theme-text-primary">Pre-emergence:</span>{" "}
            {weed.preEmergenceHerbicide}
          </p>
          <p className="text-sm theme-text-muted">
            <span className="font-semibold theme-text-primary">Post-emergence:</span>{" "}
            {weed.postEmergenceHerbicide}
          </p>
        </article>
      ))}
    </section>
  );
}
