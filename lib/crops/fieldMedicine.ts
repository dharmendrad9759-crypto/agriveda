export interface FieldMedicineTier {
  title: string;
  lines: string[];
}

export interface FieldMedicine {
  cropSlug: string;
  type: "pest" | "disease";
  keys: string[];
  tiers: FieldMedicineTier[];
  tips: string[];
}

export function medicineRow(
  cropSlug: string,
  type: FieldMedicine["type"],
  keys: string[],
  tiers: FieldMedicine["tiers"],
  tips: string[]
): FieldMedicine {
  return { cropSlug, type, keys, tiers, tips };
}

const CROP_ALIAS: Record<string, string> = {
  arhar: "pulses",
  tur: "pulses",
  pigeonpea: "pulses",
  tuar: "pulses",
};

export function findFieldMedicine(
  cropSlug: string,
  type: "pest" | "disease" | "weed",
  name: string,
  scientific: string,
  list: FieldMedicine[]
): FieldMedicine | undefined {
  if (type === "weed") return undefined;
  const slug = CROP_ALIAS[cropSlug] || cropSlug;
  const hay = `${name} ${scientific}`.toLowerCase();
  return list.find(
    (item) =>
      item.cropSlug === slug &&
      item.type === type &&
      item.keys.some((key) => hay.includes(key.toLowerCase()))
  );
}
