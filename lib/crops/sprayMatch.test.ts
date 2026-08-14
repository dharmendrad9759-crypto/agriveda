import { describe, expect, it } from "vitest";
import { classifyChemText, scientificNamesMatch } from "@/lib/crops/pestGuild";
import { matchModernTechnicals } from "@/lib/crops/modernTechnicalBridge";
import { stripMoaCodes, formatFarmerChemicalLine } from "@/lib/crops/farmerSprayDose";

describe("pestGuild", () => {
  it("classifies yellow stem borer as stem-borer only", () => {
    const g = classifyChemText("पीला तना छेदक (Yellow Stem Borer) Scirpophaga incertulas");
    expect([...g]).toContain("stem-borer");
    expect([...g]).not.toContain("planthopper");
  });

  it("classifies brown planthopper as planthopper", () => {
    const g = classifyChemText("भूरा फुदका (Brown Planthopper) Nilaparvata lugens");
    expect([...g]).toContain("planthopper");
    expect([...g]).not.toContain("stem-borer");
  });

  it("matches scientific genus/species loosely", () => {
    expect(scientificNamesMatch("Scirpophaga incertulas", "Scirpophaga incertulas Walker")).toBe(
      true
    );
    expect(scientificNamesMatch("Scirpophaga incertulas", "Nilaparvata lugens")).toBe(false);
  });
});

describe("matchModernTechnicals", () => {
  it("does not attach hopper molecules to paddy stem borer", () => {
    const names = matchModernTechnicals({
      cropSlug: "paddy",
      kind: "pest",
      haystack: "पीला तना छेदक (Yellow Stem Borer) Scirpophaga incertulas",
    }).map((p) => p.technical.toLowerCase());

    expect(names.some((n) => n.includes("chlorantraniliprole") || n.includes("broflanilide"))).toBe(
      true
    );
    expect(names.some((n) => /pymetrozine|triflumezopyrim|dinotefuran|isocycloseram/.test(n))).toBe(
      false
    );
  });

  it("attaches BPH molecules to brown planthopper", () => {
    const names = matchModernTechnicals({
      cropSlug: "paddy",
      kind: "pest",
      haystack: "भूरा फुदका (Brown Planthopper) Nilaparvata lugens",
    }).map((p) => p.technical.toLowerCase());

    expect(names.some((n) => n.includes("pymetrozine") || n.includes("triflumezopyrim"))).toBe(
      true
    );
    expect(names.some((n) => n.includes("chlorantraniliprole 18.5"))).toBe(false);
  });
});

describe("farmerSprayDose", () => {
  it("strips IRAC/FRAC codes for farmers", () => {
    expect(stripMoaCodes("Cartap hydrochloride 50 SP (IRAC 14)")).toBe(
      "Cartap hydrochloride 50 SP"
    );
  });

  it("converts acre dose to per-litre water", () => {
    const line = formatFarmerChemicalLine("Chlorantraniliprole 18.5% SC 60 ml/acre", true);
    expect(line).toMatch(/0\.3\s*ml\/लीटर/);
  });
});
