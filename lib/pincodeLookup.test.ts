import { describe, expect, it } from "vitest";
import {
  cleanPostOfficeVillage,
  expandPostalBbox,
  formatVillageLabel,
  nominatimViewbox,
  parseNominatimBoundingBox,
  splitBboxLatBands,
  uniqueVillageNames,
  villageMatchesPinArea,
  villageMergeKey,
  villageNamesMatch,
} from "@/lib/pincodeLookup";
import { villagesFromNominatimPlaces } from "@/lib/pinAreaVillages";

describe("pincode village names", () => {
  it("strips post-office suffixes", () => {
    expect(cleanPostOfficeVillage("Nagla Beech B.O")).toBe("Nagla Beech");
    expect(cleanPostOfficeVillage("Indore G.P.O.")).toBe("Indore");
    expect(cleanPostOfficeVillage("NA")).toBe("");
  });

  it("keeps unique village names from a PIN office list", () => {
    expect(
      uniqueVillageNames(["Khera BO", "Khera B.O", "Sikandarpur SO", "NA", ""])
    ).toEqual(["Khera", "Sikandarpur"]);
  });

  it("merges Hindi + English spellings of the same गाँव", () => {
    expect(formatVillageLabel("Bhogpur", "भोगपुर")).toBe("भोगपुर (Bhogpur)");
    expect(villageMergeKey("भोगपुर (Bhogpur)")).toBe("bhogpur");
    expect(uniqueVillageNames(["Bhogpur", "भोगपुर (Bhogpur)", "Bamani"])).toEqual([
      "Bamani",
      "भोगपुर (Bhogpur)",
    ]);
    expect(villageNamesMatch("भोगपुर", "भोगपुर (Bhogpur)")).toBe(true);
    expect(villageNamesMatch("bhogpur", "भोगपुर (Bhogpur)")).toBe(true);
  });
});

describe("PIN area bbox", () => {
  it("expands a tight postal bbox so nearby census villages are not clipped", () => {
    const box = parseNominatimBoundingBox(["27.911", "28.001", "77.792", "77.893"]);
    expect(box).toEqual({ south: 27.911, north: 28.001, west: 77.792, east: 77.893 });
    const expanded = expandPostalBbox(box!, 0.06);
    expect(expanded.south).toBeCloseTo(27.851);
    expect(expanded.north).toBeCloseTo(28.061);
    const [south, north] = splitBboxLatBands(expanded);
    expect(south.north).toBeCloseTo(north.south);
    expect(nominatimViewbox(south)).toContain("77.732");
  });

  it("keeps same-district OSM villages and drops the next district", () => {
    expect(
      villageMatchesPinArea("Bhogpur, Khair, Aligarh, Uttar Pradesh, India", {
        pin: "202138",
        district: "Aligarh",
      })
    ).toBe(true);
    expect(
      villageMatchesPinArea("Kolahar, Mat, Mathura, Uttar Pradesh, India", {
        pin: "202138",
        district: "Aligarh",
      })
    ).toBe(false);
  });

  it("includes Bhogpur from OSM places even when it is not a post office", () => {
    const names = villagesFromNominatimPlaces(
      [
        {
          name: "Khair",
          display_name: "Khair, Aligarh, Uttar Pradesh, 202138, India",
        },
        {
          name: "Bhogpur",
          display_name: "Bhogpur, Khair, Aligarh, Uttar Pradesh, India",
          namedetails: { name: "Bhogpur", "name:hi": "भोगपुर" },
        },
        {
          name: "Kolahar",
          display_name: "Kolahar, Mat, Mathura, Uttar Pradesh, India",
        },
      ],
      { pin: "202138", district: "Aligarh" }
    );
    expect(names.some((item) => /bhogpur/i.test(item))).toBe(true);
    expect(names.some((item) => item.includes("भोगपुर"))).toBe(true);
    expect(names.some((item) => /kolahar/i.test(item))).toBe(false);
  });
});
