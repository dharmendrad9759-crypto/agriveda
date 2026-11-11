import { describe, it, expect } from "vitest";
import { attachProducts, productFromLog } from "@/lib/sprayRotation";
import type { SprayLog } from "@/types/spray-rotation";

function log(partial: Partial<SprayLog>): SprayLog {
  return {
    id: "local-1",
    farmerId: "f1",
    cropId: "mustard",
    fieldId: "hub",
    productId: "Flonicamid 50% WG",
    sprayDate: "2026-11-05",
    doseUsed: "60 g / acre",
    growthStageAtSpray: "फूल अवस्था",
    technical: "Flonicamid 50% WG",
    moaGroups: ["29"],
    synced: false,
    createdAt: "2026-11-05T10:00:00.000Z",
    ...partial,
  };
}

describe("spray diary attachProducts", () => {
  it("keeps hub 1-tap logs whose productId is a technical name, not a catalog id", () => {
    const rows = attachProducts([log({})]);
    expect(rows).toHaveLength(1);
    expect(rows[0].product.productName).toMatch(/Flonicamid/i);
    expect(rows[0].product.activeIngredient).toMatch(/Flonicamid/i);
    expect(rows[0].product.moaGroup).toBe("29");
  });

  it("synthesizes a product from technical when catalog lookup misses", () => {
    const p = productFromLog(
      log({ productId: "unknown-tech", technical: "Dimethoate 30% EC", moaGroups: ["1B"] })
    );
    expect(p.productName).toBe("Dimethoate 30% EC");
    expect(p.moaGroup).toBe("1B");
  });
});
