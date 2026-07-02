export interface IrrigationSchedule {
  stage: string;
  frequency: string;
  waterDepth?: string;
  method: string;
  criticalNotes: string[];
}
