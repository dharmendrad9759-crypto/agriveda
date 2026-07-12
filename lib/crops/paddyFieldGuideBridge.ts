/** @deprecated Use cropFieldGuideBridge — kept for backward compatibility */
export {
  getCropFieldGuideThreatOverride as getPaddyFieldGuideThreatOverride,
  mergeCropFieldGuideIntoProfile as mergePaddyFieldGuideIntoProfile,
  mergeCropFieldGuideCatalog as mergePaddyFieldGuideCatalog,
  getCropFieldGuidePestListForCrop as getPaddyFieldGuidePestListForCrop,
  getCropFieldGuideDiseaseListForCrop as getPaddyFieldGuideDiseaseListForCrop,
  type CropFieldGuide as PaddyFieldGuide,
  type FieldGuideChemical,
  type FieldGuidePest,
  type FieldGuideDisease,
  type FieldGuideNutrient,
  type FieldGuideWeed,
} from "@/lib/crops/cropFieldGuideBridge";
