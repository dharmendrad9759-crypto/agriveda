import { describe, it, expect } from "vitest";
import { isChemicalMention } from "@/lib/crops/medicineParser";

describe("field hygiene is not a chemical", () => {
  it("rejects खेत साफ / मैदान साफ sanitation lines", () => {
    expect(isChemicalMention("खेत साफ रखें")).toBe(false);
    expect(isChemicalMention("खेत को खरपतवार मुक्त और साफ रखें")).toBe(false);
    expect(isChemicalMention("खेत की मैदान साफ")).toBe(false);
    expect(isChemicalMention("खरपतवार साफ रखें")).toBe(false);
  });

  it("still treats neem oil and actual SAAF as chemicals", () => {
    expect(isChemicalMention("नीम तेल 10000 PPM")).toBe(true);
    expect(isChemicalMention("साफ फंगीसाइड")).toBe(true);
    expect(isChemicalMention("Carbendazim 12% + Mancozeb 63% WP")).toBe(true);
  });
});
