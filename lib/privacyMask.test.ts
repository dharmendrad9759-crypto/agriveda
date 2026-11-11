import { describe, expect, it } from "vitest";
import { isAllowedHttpsPhotoUrl, maskPhone } from "@/lib/privacyMask";

describe("maskPhone", () => {
  it("masks 10-digit numbers", () => {
    expect(maskPhone("9876543210")).toBe("98••••10");
  });

  it("returns null for empty", () => {
    expect(maskPhone("")).toBeNull();
    expect(maskPhone(null)).toBeNull();
  });
});

describe("isAllowedHttpsPhotoUrl", () => {
  it("rejects arbitrary https hosts", () => {
    expect(isAllowedHttpsPhotoUrl("https://evil.example/pixel.png")).toBe(false);
  });

  it("rejects http", () => {
    expect(isAllowedHttpsPhotoUrl("http://example.com/a.png")).toBe(false);
  });
});
