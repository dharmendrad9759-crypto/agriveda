import { describe, expect, it } from "vitest";
import { sniffImageMime } from "@/lib/imageSniff";

describe("sniffImageMime", () => {
  it("detects JPEG", () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]).toString(
      "base64"
    );
    expect(sniffImageMime(jpeg)).toBe("image/jpeg");
  });

  it("detects PNG", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]).toString(
      "base64"
    );
    expect(sniffImageMime(png)).toBe("image/png");
  });

  it("rejects random bytes labeled as an image", () => {
    const junk = Buffer.from("not-an-image!!!!").toString("base64");
    expect(sniffImageMime(junk)).toBeNull();
  });
});
