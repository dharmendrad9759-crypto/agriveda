export interface Soil {
  type: string;
  ph: { min: number; max: number };
  texture: string;
  drainage: string;
  organicMatter: string;
  preparation: string[];
  amendments?: string[];
}
