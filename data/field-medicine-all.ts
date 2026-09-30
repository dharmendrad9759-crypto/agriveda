import { FIELD_MEDICINE_BATCH_1 } from "@/data/field-medicine-batch1";
import { FIELD_MEDICINE_BATCH_2 } from "@/data/field-medicine-batch2";
import { FIELD_MEDICINE_BATCH_3 } from "@/data/field-medicine-batch3";
import { FIELD_MEDICINE_BATCH_4 } from "@/data/field-medicine-batch4";
import { FIELD_MEDICINE_BATCH_5 } from "@/data/field-medicine-batch5";
import { FIELD_MEDICINE_BATCH_6 } from "@/data/field-medicine-batch6";
import { FIELD_MEDICINE_BATCH_7 } from "@/data/field-medicine-batch7";
import { FIELD_MEDICINE_BATCH_8 } from "@/data/field-medicine-batch8";
import { FIELD_MEDICINE_BATCH_9 } from "@/data/field-medicine-batch9";
import type { FieldMedicine } from "@/lib/crops/fieldMedicine";

export const ALL_FIELD_MEDICINE: FieldMedicine[] = [
  ...FIELD_MEDICINE_BATCH_1,
  ...FIELD_MEDICINE_BATCH_2,
  ...FIELD_MEDICINE_BATCH_3,
  ...FIELD_MEDICINE_BATCH_4,
  ...FIELD_MEDICINE_BATCH_5,
  ...FIELD_MEDICINE_BATCH_6,
  ...FIELD_MEDICINE_BATCH_7,
  ...FIELD_MEDICINE_BATCH_8,
  ...FIELD_MEDICINE_BATCH_9,
];
