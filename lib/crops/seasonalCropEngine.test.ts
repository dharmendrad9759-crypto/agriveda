import { describe, it, expect } from "vitest";
import {
  getCurrentAgriSeason,
  calculateCropSeasonalityScore,
  sortCropsByCurrentSeason,
  getTopCurrentSeasonCropSlug,
} from "./seasonalCropEngine";

describe("Seasonal Crop Intelligence Engine", () => {
  it("correctly identifies Rabi season in October & November", () => {
    const octDate = new Date(2026, 9, 31); // Month index 9 = October
    const novDate = new Date(2026, 10, 15); // Month index 10 = November

    expect(getCurrentAgriSeason(octDate).seasonId).toBe("rabi");
    expect(getCurrentAgriSeason(novDate).seasonId).toBe("rabi");
    expect(getTopCurrentSeasonCropSlug(octDate)).toBe("wheat");
  });

  it("prioritizes Wheat, Mustard, Potato, Chana over Paddy & Soybean in October", () => {
    const octDate = new Date(2026, 9, 31); // 31 October
    const sampleCrops = [
      { slug: "tomato", name: "टमाटर" },
      { slug: "paddy", name: "धान" },
      { slug: "soybean", name: "सोयाबीन" },
      { slug: "maize", name: "मक्का" },
      { slug: "wheat", name: "गेहूँ" },
      { slug: "mustard", name: "सरसों" },
      { slug: "potato", name: "आलू" },
      { slug: "chana", name: "चना" },
    ];

    const sorted = sortCropsByCurrentSeason(sampleCrops, octDate);
    const sortedSlugs = sorted.map((c) => c.slug);

    // Rabi sowing crops MUST be at the top!
    const top4 = sortedSlugs.slice(0, 4);
    expect(top4).toContain("wheat");
    expect(top4).toContain("mustard");
    expect(top4).toContain("potato");
    expect(top4).toContain("chana");

    // Off-season Kharif crops like Paddy and Soybean MUST be at the bottom!
    const bottom2 = sortedSlugs.slice(-2);
    expect(bottom2).toContain("paddy");
    expect(bottom2).toContain("soybean");
  });

  it("prioritizes Paddy, Soybean, Maize, Cotton in June (Kharif)", () => {
    const junDate = new Date(2026, 5, 20); // Month index 5 = June
    expect(getCurrentAgriSeason(junDate).seasonId).toBe("kharif");
    expect(getTopCurrentSeasonCropSlug(junDate)).toBe("paddy");

    const sampleCrops = [
      { slug: "wheat", name: "गेहूँ" },
      { slug: "mustard", name: "सरसों" },
      { slug: "paddy", name: "धान" },
      { slug: "soybean", name: "सोयाबीन" },
      { slug: "maize", name: "मक्का" },
    ];

    const sorted = sortCropsByCurrentSeason(sampleCrops, junDate);
    const sortedSlugs = sorted.map((c) => c.slug);

    // Paddy, Soybean, Maize must be before Wheat and Mustard in June
    expect(sortedSlugs.indexOf("paddy")).toBeLessThan(sortedSlugs.indexOf("wheat"));
    expect(sortedSlugs.indexOf("soybean")).toBeLessThan(sortedSlugs.indexOf("wheat"));
    expect(sortedSlugs.indexOf("maize")).toBeLessThan(sortedSlugs.indexOf("mustard"));
  });

  it("prioritizes Moong, Urad, Cucumber in March (Zaid)", () => {
    const marDate = new Date(2026, 2, 15); // Month index 2 = March
    const sampleCrops = [
      { slug: "wheat", name: "गेहूँ" },
      { slug: "paddy", name: "धान" },
      { slug: "moong", name: "मूंग" },
      { slug: "cucumber", name: "खीरा" },
    ];

    const sorted = sortCropsByCurrentSeason(sampleCrops, marDate);
    const sortedSlugs = sorted.map((c) => c.slug);

    expect(sortedSlugs.indexOf("moong")).toBeLessThan(sortedSlugs.indexOf("paddy"));
    expect(sortedSlugs.indexOf("cucumber")).toBeLessThan(sortedSlugs.indexOf("paddy"));
  });
});
