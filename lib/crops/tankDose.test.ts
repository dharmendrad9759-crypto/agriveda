import { describe, expect, it } from "vitest";
import { parseFarmerDose } from "@/lib/crops/tankDose";

describe("parseFarmerDose foliar safety", () => {
  it("keeps 150 L field water and splits 80 g/acre across 10 × 15 L tanks", () => {
    const d = parseFarmerDose("80 ग्राम प्रति एकड़");
    expect(d.doseParsed).toBe(true);
    expect(d.waterIsFieldDefault).toBe(true);
    expect(d.waterVolume).toContain("150 लीटर");
    expect(d.tankDose).toMatch(/8 ग्राम/);
    expect(d.perLitre).not.toMatch(/1–2 मिली/);
  });

  it("uses label water when written", () => {
    const d = parseFarmerDose("200 मिली प्रति एकड़ 200 लीटर पानी");
    expect(d.waterIsFieldDefault).toBe(false);
    expect(d.tankDose).toMatch(/15 मिली/);
  });

  it("does not invent ml when nothing parses", () => {
    const d = parseFarmerDose("लेबल अनुसार");
    expect(d.doseParsed).toBe(false);
    expect(d.tankDose).toBe("");
    expect(d.perLitre).toBe("");
    expect(JSON.stringify(d)).not.toMatch(/15–20 मिली/);
    expect(JSON.stringify(d)).not.toMatch(/1–2 मिली\/लीटर/);
  });

  it("does not force sticker unless mentioned", () => {
    const d = parseFarmerDose("1 मिली / लीटर पानी (200 मिली प्रति एकड़)");
    expect(d.useSticker).toBe(false);
    expect(d.tankDose).toMatch(/15 मिली/);
  });

  it("16 L tank scales per-litre dose", () => {
    const d = parseFarmerDose("1 मिली / लीटर", { tankLitres: 16 });
    expect(d.tankDose).toMatch(/16 मिली/);
  });

  it("irrigation-with-water is drench, not foliar spray", () => {
    const d = parseFarmerDose("1 लीटर प्रति एकड़ (सिंचाई के पानी के साथ)", {
      technical: "Chlorpyrifos 50% EC",
    });
    expect(d.isSpray).toBe(false);
    expect(d.method).toBe("drench_irrigation");
  });
});
