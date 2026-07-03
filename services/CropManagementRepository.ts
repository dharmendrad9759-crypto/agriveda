import { cropManagementCatalog, getCropManagementProfile } from "@/data/crop-management";
import type { CropManagementProfile } from "@/types/crop-management";

export interface CropManagementRepository {
  getAllCrops(): Promise<CropManagementProfile[]>;
  getCropBySlug(slug: string): Promise<CropManagementProfile | null>;
}

export class CropManagementRepositoryImpl implements CropManagementRepository {
  async getAllCrops(): Promise<CropManagementProfile[]> {
    return cropManagementCatalog;
  }

  async getCropBySlug(slug: string): Promise<CropManagementProfile | null> {
    return getCropManagementProfile(slug);
  }
}

export const cropManagementRepository = new CropManagementRepositoryImpl();
