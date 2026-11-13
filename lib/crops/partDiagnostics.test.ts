import { describe, expect, it } from "vitest";
import { getCropProblem } from "@/data/crop-curative-problems";
import { PART_DX, dxForPart } from "@/data/partDiagnostics";

describe("part diagnostics", () => {
  it("opens only problems that already exist", () => {
    for (const row of PART_DX) {
      expect(getCropProblem(row.cropId, row.problemId), row.id).toBeTruthy();
      if (row.yesProblemId) expect(getCropProblem(row.cropId, row.yesProblemId), row.id).toBeTruthy();
      if (row.noProblemId) expect(getCropProblem(row.cropId, row.noProblemId), row.id).toBeTruthy();
    }
  });

  it("splits paddy neck blast from a white ear", () => {
    const ear = dxForPart("paddy", "ear").map((row) => row.symptomHi);
    expect(ear.some((line) => /गर्दन काली/.test(line))).toBe(true);
    expect(ear.some((line) => /सफेद सूखी/.test(line))).toBe(true);
    const neck = dxForPart("paddy", "ear").find((row) => row.id === "paddy-ear-blast");
    expect(neck?.yesProblemId).toBe("stem-borer");
    expect(neck?.noProblemId).toBe("blast");
  });

  it("keeps potato late blight and early blight apart", () => {
    const leaf = dxForPart("potato", "leaf");
    expect(leaf.find((row) => row.id === "potato-leaf-late")?.noProblemId).toBe("early-blight");
    expect(leaf.find((row) => row.id === "potato-leaf-early")?.problemId).toBe("early-blight");
  });
});
