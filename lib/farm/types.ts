export interface FarmField {
  id: string;
  name: string;
  area: string;
  ownership: string;
  crop: string;
  status: string;
  sowingDate: string;
  emoji: string;
  health: number;
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
