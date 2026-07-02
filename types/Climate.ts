export interface ClimateRequirement {
  temperature: { min: number; max: number; unit: string };
  rainfall: { min: number; max: number; unit: string };
  humidity: { min: number; max: number; unit: string };
  sunlight: string;
  frostTolerance: string;
  notes: string[];
}
