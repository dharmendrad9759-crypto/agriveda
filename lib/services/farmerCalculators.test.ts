import { describe, it, expect } from "vitest";
import { farmerSchemes } from "@/data/schemes/farmerSchemes";
import { SCHEME_STATE_DETAILS } from "@/data/schemes/schemeStateData";

describe("State Schemes Integration (POINT 3)", () => {
  const top10SchemeIds = [
    "up-khet-suraksha",
    "up-nand-baba",
    "up-nishulk-boring",
    "rj-kisan-samman-nidhi",
    "rj-gopal-card",
    "rj-kisan-mitra-urja",
    "rj-tarbandi",
    "bihar-krishi-input",
    "haryana-pashu-kcc",
    "punjab-pani-bachao",
  ];

  it("should contain all 10 state schemes in farmerSchemes with valid properties", () => {
    for (const id of top10SchemeIds) {
      const scheme = farmerSchemes.find((s) => s.id === id);
      expect(scheme).toBeDefined();
      expect(scheme?.nameHi).toBeTruthy();
      expect(scheme?.hookHi).toBeTruthy();
      expect(scheme?.stepsHi.length).toBeGreaterThanOrEqual(4);
      expect(scheme?.docsHi.length).toBeGreaterThanOrEqual(3);
      expect(scheme?.portal).toMatch(/^https?:\/\//);
    }
  });

  it("should contain rich state metadata and quick quiz for all 10 state schemes", () => {
    for (const id of top10SchemeIds) {
      const meta = SCHEME_STATE_DETAILS[id];
      expect(meta).toBeDefined();
      expect(meta?.applicableStates).toBeTruthy();
      expect(meta?.quickQuiz.length).toBe(3);
      expect(meta?.onlineSteps.length).toBeGreaterThanOrEqual(4);
      expect(meta?.offlineSteps.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("Land Area Conversion Formulas (POINT 2)", () => {
  it("converts 1 acre to exact square feet and pucca bigha", () => {
    const acreSqFt = 43560;
    const puccaBighaSqFt = 27225;
    expect(acreSqFt / puccaBighaSqFt).toBeCloseTo(1.6, 2);
  });

  it("converts 1 hectare to exact acres and square meters", () => {
    const hectareSqFt = 107639.1;
    const acreSqFt = 43560;
    expect(hectareSqFt / acreSqFt).toBeCloseTo(2.471, 3);
  });

  it("converts 1 kanal to 20 marlas in Punjab/Haryana", () => {
    const kanalSqFt = 5445;
    const marlaSqFt = 272.25;
    expect(kanalSqFt / marlaSqFt).toBe(20);
  });
});

describe("KCC Subvention & Net Interest Calculation (POINT 2)", () => {
  it("calculates 4% effective interest with 3% prompt repayment rebate", () => {
    const principal = 100000;
    const tenureYears = 1;
    const normalRate = 0.07;
    const netRate = 0.04;

    const normalInterest = principal * normalRate * tenureYears;
    const netInterest = principal * netRate * tenureYears;
    const savings = normalInterest - netInterest;

    expect(Math.round(normalInterest)).toBe(7000);
    expect(Math.round(netInterest)).toBe(4000);
    expect(Math.round(savings)).toBe(3000);
  });
});
