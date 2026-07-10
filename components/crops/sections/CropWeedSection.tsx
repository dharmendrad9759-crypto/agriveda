"use client";

import { getCropManagementProfile } from "@/data/crop-management";
import CropManagementWeedManagement from "@/components/crop-management/CropManagementWeedManagement";
import type { Crop } from "@/types/crop";

export default function CropWeedSection({ crop }: { crop: Crop }) {
  const profile = getCropManagementProfile(crop.slug);
  if (!profile) {
    return (
      <div className="crop-premium-empty">
        <p className="text-sm text-[var(--av-text-secondary)]">
          Weed management data is not available for this crop yet.
        </p>
        {crop.cropProtection.weedManagement.length > 0 && (
          <ul className="mt-4 space-y-2">
            {crop.cropProtection.weedManagement.map((w) => (
              <li key={w} className="crop-premium-inset text-xs text-[var(--av-text-primary)]">
                {w}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  return <CropManagementWeedManagement profile={profile} />;
}
