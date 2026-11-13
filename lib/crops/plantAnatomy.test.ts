import { describe, expect, it } from "vitest";
import { getCropProblem } from "@/data/crop-curative-problems";
import {
  anatomyForCrop,
  matchProblems,
  partsMentioned,
  symptomsForPart,
} from "@/lib/crops/plantAnatomy";

describe("plant anatomy", () => {
  it("gives wheat an ear and tomato a fruit", () => {
    const wheat = anatomyForCrop("wheat").parts.map((p) => p.id);
    const tomato = anatomyForCrop("tomato").parts.map((p) => p.id);
    expect(wheat).toEqual(["ear", "leaf", "stem", "root"]);
    expect(wheat).not.toContain("fruit");
    expect(tomato).toContain("fruit");
    expect(tomato).toContain("flower");
    expect(anatomyForCrop("banana").parts.map((p) => p.id)).toContain("bunch");
    expect(anatomyForCrop("potato").parts.map((p) => p.id)).toContain("tuber");
    expect(anatomyForCrop("chilli").morphologyType).toBe("generic");
  });

  it("maps wheat organs only when the existing text names them", () => {
    const rust = getCropProblem("wheat", "yellow-rust");
    const root = getCropProblem("wheat", "termite-root-aphid");
    const ear = getCropProblem("wheat", "earhead-aphid");
    expect(rust).toBeTruthy();
    expect(partsMentioned("wheat", rust!.problem)).toContain("leaf");
    expect(partsMentioned("wheat", rust!.problem)).not.toContain("root");
    expect(partsMentioned("wheat", root!.problem)).toContain("root");
    expect(partsMentioned("wheat", ear!.problem)).toContain("ear");
  });

  it("filters leaf yellowing away from root problems", () => {
    const leaf = matchProblems({ cropId: "wheat", part: "leaf", symptoms: ["yellow"] });
    expect(leaf.matches.some((m) => m.hub.problem.id === "yellow-rust")).toBe(true);
    expect(leaf.matches.some((m) => m.hub.problem.id === "termite-root-aphid")).toBe(false);
    expect(leaf.matches[0]?.reasonHi).toMatch(/पत्ती/);
    expect(symptomsForPart("wheat", "leaf").map((s) => s.id)).toContain("yellow");
  });

  it("keeps unmapped problems out of a part filter", () => {
    const all = matchProblems({ cropId: "wheat", part: "leaf" });
    expect(all.unmapped).toBeGreaterThanOrEqual(0);
    expect(all.matches.every((m) => m.parts.includes("leaf"))).toBe(true);
  });

  it("keeps fruit symptoms on the fruit and leaf symptoms on the leaf", () => {
    const fruit = symptomsForPart("tomato", "fruit").map((s) => s.labelHi);
    expect(fruit.some((label) => /पत्ती/.test(label))).toBe(false);
    expect(fruit).toContain("फल में छेद");
    expect(fruit).toContain("फल पर धब्बे");
    const spots = matchProblems({ cropId: "tomato", part: "fruit", symptoms: ["spots"] });
    expect(spots.matches.some((m) => m.hub.problem.id === "bacterial-spot-wilt")).toBe(true);
    expect(spots.matches.some((m) => m.hub.problem.id === "leaf-curl")).toBe(false);
    const leaf = symptomsForPart("tomato", "leaf").map((s) => s.id);
    expect(leaf).toContain("curl");
    const drying = matchProblems({ cropId: "tomato", part: "leaf", symptoms: ["wilt"] });
    const dryingIds = drying.matches.map((m) => m.hub.problem.id);
    expect(dryingIds).toContain("early-blight");
    expect(dryingIds).not.toContain("thrips");
    expect(dryingIds).not.toContain("pinworm");
    expect(dryingIds).not.toContain("late-blight");
    expect(drying.matches.every((m) => /सूख|मुरझा/.test(m.reasonHi))).toBe(true);
  });
});
