import { describe, expect, it } from "vitest";
import { CROP_PROBLEM_CROPS } from "@/data/crop-curative-problems";
import { getHubOverlay } from "@/data/hub/priorityOverlays";
import { getCurativeMedicines, getShopBrandExamples } from "@/lib/crops/cropProblemMedicines";
import {
  assembleHubProblem,
  checkShopSwap,
  listCanonicalProblems,
  matchSymptomChips,
  moaGroupsFromTechnical,
} from "@/lib/crops/intelligenceHub";

describe("canonical hub registry", () => {
  it("lists every crop-problem pair without dropping rows", () => {
    const listed = listCanonicalProblems();
    const raw = CROP_PROBLEM_CROPS.reduce((n, c) => n + c.problems.length, 0);
    expect(listed.length).toBe(raw);
    expect(listed.length).toBeGreaterThan(100);
  });

  it("resolves maize stem-fly alias", () => {
    const hub = assembleHubProblem("maize", "stem-fly");
    expect(hub?.problem.id).toBe("shoot-fly");
  });

  it("treats virus as disease subtype, not its own kind", () => {
    const hub = assembleHubProblem("tomato", "leaf-curl");
    expect(hub?.kind).toBe("disease");
    expect(hub?.subtype).toBe("viral");
  });

  it("matches chilli curl chips from existing Hindi text", () => {
    const hub = assembleHubProblem("chilli", "thrips");
    expect(hub?.symptomChips).toContain("curl");
  });

  it("splits premix MoA groups", () => {
    const groups = moaGroupsFromTechnical("Acephate 50% + Imidacloprid 1.8% SP");
    expect(groups.length).toBeGreaterThanOrEqual(2);
  });

  it("shop swap flags insecticide offered for a disease", () => {
    const hub = assembleHubProblem("paddy", "blast");
    const r = checkShopSwap({
      offeredText: "Cypermethrin 25% EC insecticide",
      recommended: hub?.medicines ?? [],
      problemKind: "disease",
    });
    expect(r.tone).toBe("red");
  });
});

describe("priority overlays", () => {
  it("does not invent numeric PHI", () => {
    const o = getHubOverlay("paddy", "stem-borer");
    expect(JSON.stringify(o)).not.toMatch(/\d+\s*दिन/);
    expect(o.fieldCheckHi).toBeTruthy();
  });
});

describe("classifyKind yellowing is a symptom not a kind", () => {
  it("keeps rust as disease", () => {
    const hub = assembleHubProblem("wheat", "yellow-rust");
    expect(hub?.kind).toBe("disease");
    expect(matchSymptomChips(hub!.problem)).toContain("yellow");
  });
});

describe("shop counter brands vs farmer cards", () => {
  it("keeps brands off farmer cards but exposes 2–3 examples for the shop card", () => {
    const farmer = getCurativeMedicines("chilli", "thrips");
    expect(farmer[0]?.brands).toEqual([]);
    const shop = getShopBrandExamples("chilli", "thrips", farmer[0]!.technical);
    expect(shop.length).toBeGreaterThan(0);
    expect(shop.length).toBeLessThanOrEqual(3);
  });

  it("does not invent a numeric dose when a problem has no mapped medicine", () => {
    const fallback = getCurativeMedicines("no-such-crop", "no-such-problem", ["नीम तेल — लेबल अनुसार"]);
    expect(fallback[0]?.dose).not.toMatch(/\d/);
    expect(fallback[0]?.dose).toMatch(/लेबल/);
  });
});
