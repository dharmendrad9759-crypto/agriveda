import { describe, expect, it } from "vitest";
import { fieldPlaceFor } from "@/lib/farm/placeProfile";

describe("field place from state", () => {
  it("uses the UP pucca bigha and alluvial soil", () => {
    const place = fieldPlaceFor("Uttar Pradesh", "Meerut");
    expect(place.stateHi).toBe("उत्तर प्रदेश");
    expect(place.acresPerBigha).toBe(0.625);
    expect(place.soil).toContain("जलोढ़");
    expect(place.climateHi.length).toBeGreaterThan(8);
    expect(place.bighaLineHi).toContain("1 बीघा");
  });

  it("switches Mathura to the smaller Braj bigha", () => {
    const place = fieldPlaceFor("Uttar Pradesh", "Mathura");
    expect(place.bighaId).toBe("up_braj");
    expect(place.acresPerBigha).toBe(0.5);
    expect(place.soil).toContain("बलुई");
  });

  it("uses the larger Rajasthan bigha in Jodhpur", () => {
    const place = fieldPlaceFor("Rajasthan", "Jodhpur");
    expect(place.bighaId).toBe("rajasthan_bada");
    expect(place.acresPerBigha).toBe(1.6);
    expect(place.soil).toContain("बलुई");
  });

  it("reads Aligarh as the upper Gangetic plain, not as the field area", () => {
    const place = fieldPlaceFor("Uttar Pradesh", "Aligarh", "Bhopur");
    expect(place.village).toBe("Bhopur");
    expect(place.district).toBe("Aligarh");
    expect(place.acresPerBigha).toBe(0.619);
    expect(place.soil).toContain("जलोढ़");
    expect(place.climateHi).toBe("ऊपरी गंगा का मैदान");
    expect(place.bighaLineHi).toBe("1 बीघा = 0.619 एकड़");
  });

  it("does not treat the default bigha factor as the field size", () => {
    const place = fieldPlaceFor("Sikkim");
    expect(place.acresPerBigha).toBe(0);
    expect(place.bighaLineHi).not.toContain("0.625");
    expect(place.soil).toBe("");
  });
});
