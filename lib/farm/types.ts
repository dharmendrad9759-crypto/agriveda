export interface FarmField {
  id: string;
  name: string;
  area: string;
  ownership: string;
  crop: string;
  /** Crop catalog slug — used for alerts and my-crops sync */
  cropSlug?: string;
  status: string;
  /** Display or ISO sowing date — prefer ISO yyyy-mm-dd */
  sowingDate: string;
  /** Canonical ISO sowing date when known */
  sowingDateIso?: string;
  emoji: string;
  /** Real measured health only — omit/undefined means unknown (never invent %) */
  health?: number;
  stage: string;
}

export interface FarmActivity {
  id: string;
  task: string;
  field: string;
  date: string;
}

export interface FarmNote {
  id: string;
  title: string;
  body: string;
  date: string;
  pinned: boolean;
}

export interface FarmData {
  fields: FarmField[];
  activities: FarmActivity[];
  notes: FarmNote[];
}
