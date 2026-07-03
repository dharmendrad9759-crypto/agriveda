import type { CropManagementProfile } from "@/types/crop-management";
import CropManagementClimate from "./CropManagementClimate";
import CropManagementDetails from "./CropManagementDetails";
import CropManagementDiseaseManagement from "./CropManagementDiseaseManagement";
import CropManagementEconomy from "./CropManagementEconomy";
import CropManagementFAQ from "./CropManagementFAQ";
import CropManagementFertilizerSchedule from "./CropManagementFertilizerSchedule";
import CropManagementGrowthStages from "./CropManagementGrowthStages";
import CropManagementHarvesting from "./CropManagementHarvesting";
import CropManagementInterculturalOperations from "./CropManagementInterculturalOperations";
import CropManagementIrrigation from "./CropManagementIrrigation";
import CropManagementLandPreparation from "./CropManagementLandPreparation";
import CropManagementMarketInformation from "./CropManagementMarketInformation";
import CropManagementMicronutrients from "./CropManagementMicronutrients";
import CropManagementNutrientDeficiencies from "./CropManagementNutrientDeficiencies";
import CropManagementOverview from "./CropManagementOverview";
import CropManagementPestManagement from "./CropManagementPestManagement";
import CropManagementPhysiologicalDisorder from "./CropManagementPhysiologicalDisorder";
import CropManagementSeedRate from "./CropManagementSeedRate";
import CropManagementSeedTreatment from "./CropManagementSeedTreatment";
import CropManagementSoil from "./CropManagementSoil";
import CropManagementSowingTime from "./CropManagementSowingTime";
import CropManagementSpacing from "./CropManagementSpacing";
import CropManagementStorage from "./CropManagementStorage";
import CropManagementWeedManagement from "./CropManagementWeedManagement";
import CropManagementYield from "./CropManagementYield";

interface CropManagementProps {
  profile: CropManagementProfile;
}

export default function CropManagement({ profile }: CropManagementProps) {
  return (
    <div className="space-y-8">
      <CropManagementOverview profile={profile} />
      <CropManagementDetails profile={profile} />
      <CropManagementClimate profile={profile} />
      <CropManagementSoil profile={profile} />
      <CropManagementLandPreparation profile={profile} />
      <CropManagementSeedTreatment profile={profile} />
      <CropManagementSowingTime profile={profile} />
      <CropManagementSeedRate profile={profile} />
      <CropManagementSpacing profile={profile} />
      <CropManagementIrrigation profile={profile} />
      <CropManagementFertilizerSchedule profile={profile} />
      <CropManagementMicronutrients profile={profile} />
      <CropManagementGrowthStages profile={profile} />
      <CropManagementInterculturalOperations profile={profile} />
      <CropManagementWeedManagement profile={profile} />
      <CropManagementPestManagement profile={profile} />
      <CropManagementDiseaseManagement profile={profile} />
      <CropManagementPhysiologicalDisorder profile={profile} />
      <CropManagementNutrientDeficiencies profile={profile} />
      <CropManagementHarvesting profile={profile} />
      <CropManagementYield profile={profile} />
      <CropManagementStorage profile={profile} />
      <CropManagementMarketInformation profile={profile} />
      <CropManagementEconomy profile={profile} />
      <CropManagementFAQ profile={profile} />
    </div>
  );
}
