import type { CropManagementProfile } from "@/types/crop-management";
import {
  cropManagementRepository,
  type CropManagementRepository,
} from "./CropManagementRepository";

export class CropManagementService {
  constructor(private readonly repository: CropManagementRepository = cropManagementRepository) {}

  getAllCrops(): Promise<CropManagementProfile[]> {
    return this.repository.getAllCrops();
  }

  getCropBySlug(slug: string): Promise<CropManagementProfile | null> {
    return this.repository.getCropBySlug(slug);
  }
}

export const cropManagementService = new CropManagementService();
