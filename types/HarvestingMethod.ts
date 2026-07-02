export interface HarvestingMethod {
  method: string;
  timing: string;
  maturitySigns: string[];
  tools: string[];
  postHarvestHandling: string[];
  yieldEstimate: string;
}
