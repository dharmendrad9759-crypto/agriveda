import { describe, expect, it } from "vitest";
import {
  formatSowingDisplay,
  parseSowingISO,
} from "@/lib/farm/fieldStatus";

describe("parseSowingISO", () => {
  it("keeps a calendar date", () => {
    expect(parseSowingISO("2026-10-14")).toBe("2026-10-14");
  });

  it("strips a full UTC timestamp from the measure/save flow", () => {
    expect(parseSowingISO("2026-10-14T18:30:00.000Z")).toBe("2026-10-14");
  });

  it("rejects Invalid Date leftovers", () => {
    expect(parseSowingISO("Invalid Date")).toBeNull();
    expect(parseSowingISO("बुवाई Invalid Date")).toBeNull();
  });
});

describe("formatSowingDisplay", () => {
  it("never prints Invalid Date for a timestamp", () => {
    const out = formatSowingDisplay("2026-10-14T18:30:00.000Z", true);
    expect(out.toLowerCase()).not.toContain("invalid");
    expect(out).toMatch(/14/);
    expect(out).toMatch(/2026/);
  });

  it("returns empty string for garbage", () => {
    expect(formatSowingDisplay("Invalid Date", true)).toBe("");
    expect(formatSowingDisplay("", false)).toBe("");
  });
});
