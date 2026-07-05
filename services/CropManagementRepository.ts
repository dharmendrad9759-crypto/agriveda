import { cropManagementCatalog, getCropManagementProfile } from "@/data/crop-management";
import { getEnrichedCropProfile } from "@/lib/knowledge/merge";
import type { CropManagementProfile } from "@/types/crop-management";

export interface CropManagementRepository {
  getAllCrops(): Promise<CropManagementProfile[]>;
  getCropBySlug(slug: string): Promise<CropManagementProfile | null>;
}

export class CropManagementRepositoryImpl implements CropManagementRepository {
  async getAllCrops(): Promise<CropManagementProfile[]> {
    return cropManagementCatalog
      .map((c) => getEnrichedCropProfile(c))
      .filter((c): c is CropManagementProfile => c !== null);
  }

  async getCropBySlug(slug: string): Promise<CropManagementProfile | null> {
    return getCropManagementProfile(slug);
  }
}

export const cropManagementRepository = new CropManagementRepositoryImpl();
