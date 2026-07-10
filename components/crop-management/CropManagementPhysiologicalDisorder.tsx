import type { CropManagementProfile } from "@/types/crop-management";
import CropManagementAbioticStress from "./CropManagementAbioticStress";

interface CropManagementPhysiologicalDisorderProps {
  profile: CropManagementProfile;
}

/** @deprecated Use CropManagementAbioticStress — kept for CropManagement shell */
export default function CropManagementPhysiologicalDisorder({ profile }: CropManagementPhysiologicalDisorderProps) {
  return <CropManagementAbioticStress profile={profile} />;
}
