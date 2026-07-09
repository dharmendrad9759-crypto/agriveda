export interface MandiRow {
  id: string;
  crop: string;
  cropHi: string;
  variety: string;
  mandi: string;
  state: string;
  min: number;
  max: number;
  modal: number;
  change: number;
  changeAmt: number;
  trend: number[];
  category: string;
  arrivalDate?: string;
}

export interface MandiApiResponse {
  source: "live" | "mock";
  state: string;
  district?: string;
  lastUpdated: string;
  rows: MandiRow[];
  error?: string;
}

export interface PriceAlert {
  id: string;
  crop: string;
  target: number;
  direction: "above" | "below";
  enabled: boolean;
  createdAt: string;
}

export interface PriceAlertSettings {
  masterEnabled: boolean;
  alerts: PriceAlert[];
}
