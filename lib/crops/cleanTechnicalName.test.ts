import { describe, expect, it } from "vitest";
import { cleanTechnicalName } from "@/data/mix-advisor/mix-plans";

describe("cleanTechnicalName", () => {
  it("keeps the first medicine and drops the या alternative formulation", () => {
    expect(
      cleanTechnicalName(
        "क्लोरफेनापायर 10% SC (इन्ट्रेपिड) या स्पिनोसैड 45% SC (ट्रेसर)"
      )
    ).toBe("क्लोरफेनापायर 10% SC");
  });

  it("does not leave a stray second strength like 5% SG", () => {
    expect(
      cleanTechnicalName("कार्टाप हाइड्रोक्लोराइड 50% SP या इमामेक्टिन 5% SG")
    ).toBe("कार्टाप हाइड्रोक्लोराइड 50% SP");
  });

  it("keeps premix strengths joined by +", () => {
    expect(
      cleanTechnicalName("फेनामिडोन 10% + मैंकोजेब 50% WG (सेक्टिन)")
    ).toBe("फेनामिडोन 10% + मैंकोजेब 50% WG");
  });

  it("strips a leftover second formulation even without या", () => {
    expect(cleanTechnicalName("क्लोरफेनापायर 10% SC 45% SC")).toBe(
      "क्लोरफेनापायर 10% SC"
    );
  });
});
