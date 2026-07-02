export interface Pest {
  pestId: string;
  name: string;
  scientificName: string;
  type: "insect" | "mite" | "nematode" | "rodent" | "other";
  identification: string;
  symptoms: string[];
  etl: string;
  biologicalControl: string[];
  chemicalControl: string[];
  preventiveMeasures: string[];
}
