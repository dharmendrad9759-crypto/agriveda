import { describe, expect, it } from "vitest";
import { lookupChemBottle } from "@/lib/crops/chemBottle";
import { chemBottleImageSrc, hasRealBottlePhoto } from "@/lib/crops/chemBottleSvg";
import { parseFarmerDose } from "@/lib/crops/tankDose";

describe("formulation must not steal another pack photo", () => {
  it("Fipronil 80% WG is Jump WG, not 0.3% GR", () => {
    expect(lookupChemBottle("Fipronil 80% WG")?.slug).toBe("fipronil-80-wg");
    expect(lookupChemBottle("फिप्रोनिल 80% WG")?.slug).toBe("fipronil-80-wg");
    expect(chemBottleImageSrc("Fipronil 80% WG")).toBe("/images/chem/real/fipronil-80-wg.jpg");
    expect(chemBottleImageSrc("Fipronil 80% WG")).not.toBe("/images/chem/real/fipronil-0-3-gr.jpg");
    expect(hasRealBottlePhoto("Fipronil 80% WG")).toBe(true);
  });

  it("keeps Fipronil 0.3% GR and 5% SC distinct", () => {
    expect(lookupChemBottle("Fipronil 0.3% GR")?.slug).toBe("fipronil-0-3-gr");
    expect(chemBottleImageSrc("Fipronil 0.3% GR")).toBe("/images/chem/real/fipronil-0-3-gr.jpg");
    expect(lookupChemBottle("Fipronil 5% SC")?.slug).toBe("fipronil-5-sc");
    expect(chemBottleImageSrc("Fipronil 5% SC")).toBe("/images/chem/real/fipronil-5-sc.jpg");
  });

  it("Chlorpyrifos 50% EC is not 1.5% DP dust", () => {
    expect(lookupChemBottle("Chlorpyrifos 50% EC")?.slug).toBe("chlorpyrifos-50-ec");
    expect(chemBottleImageSrc("Chlorpyrifos 50% EC")).toBe("/images/chem/real/chlorpyrifos-50-ec.jpg");
    expect(chemBottleImageSrc("Chlorpyrifos 50% EC")).not.toBe(
      "/images/chem/real/chlorpyrifos-1-5-dp.jpg"
    );
    expect(lookupChemBottle("Chlorpyrifos 20% EC")?.slug).toBe("chlorpyrifos-20-ec");
    expect(lookupChemBottle("Chlorpyrifos 1.5% DP")?.slug).toBe("chlorpyrifos-1-5-dp");
  });

  it("Hexaconazole 5% SC is not 5% EC", () => {
    expect(lookupChemBottle("Hexaconazole 5% SC")?.slug).toBe("hexaconazole-5-sc");
    expect(chemBottleImageSrc("Hexaconazole 5% SC")).toBe("/images/chem/real/hexaconazole-5-sc.jpg");
    expect(lookupChemBottle("Hexaconazole 5% EC")?.slug).toBe("hexaconazole-5-ec");
    expect(chemBottleImageSrc("Hexaconazole 5% EC")).toBe("/images/chem/real/hexaconazole-5-ec.jpg");
  });

  it("Diafenthiuron 47.8% SC is not 50% WP", () => {
    expect(lookupChemBottle("Diafenthiuron 47.8% SC")?.slug).toBe("diafenthiuron-47-8-sc");
    expect(chemBottleImageSrc("Diafenthiuron 47.8% SC")).toBe(
      "/images/chem/real/diafenthiuron-47-8-sc.jpg"
    );
    expect(lookupChemBottle("Diafenthiuron 50% WP")?.slug).toBe("diafenthiuron-50-wp");
  });

  it("does not map a mix onto a single-active bottle", () => {
    expect(lookupChemBottle("Chlorantraniliprole 9.3% + Lambda-cyhalothrin 4.6% ZC")?.slug).toBe(
      "chlorantraniliprole-lambda-zc"
    );
    expect(chemBottleImageSrc("Chlorantraniliprole 9.3% + Lambda-cyhalothrin 4.6% ZC")).toBe(
      "/images/chem/real/chlorantraniliprole-lambda-zc.jpg"
    );
    expect(
      chemBottleImageSrc("Chlorantraniliprole 9.3% + Lambda-cyhalothrin 4.6% ZC")
    ).not.toBe("/images/chem/real/chlorantraniliprole-18-5-sc.jpg");

    expect(lookupChemBottle("Kasugamycin 5% + Copper Oxychloride 45% WP")?.slug).toBe(
      "kasugamycin-copper-wp"
    );
    expect(chemBottleImageSrc("Kasugamycin 5% + Copper Oxychloride 45% WP")).toBe(
      "/images/chem/real/kasugamycin-copper-wp.jpg"
    );

    expect(lookupChemBottle("Beta-cyfluthrin 8.49% + Imidacloprid 19.81% OD")?.slug).toBe(
      "beta-cyfluthrin-imidacloprid-od"
    );
    expect(lookupChemBottle("Pyriproxyfen 5% + Diafenthiuron 25% SE")?.slug).toBe(
      "pyriproxyfen-diafenthiuron-se"
    );
    expect(lookupChemBottle("Indoxacarb 14.5% + Acetamiprid 7.7% w/w SC")?.slug).toBe(
      "indoxacarb-acetamiprid-sc"
    );
  });

  it("Wettable Sulphur 80% WP is not confused with 80% WDG", () => {
    expect(lookupChemBottle("Wettable Sulphur 80% WP")?.slug).toBe("wettable-sulphur-80-wp");
    expect(chemBottleImageSrc("Wettable Sulphur 80% WP")).toBe(
      "/images/chem/real/wettable-sulphur-80-wp.jpg"
    );
  });
});

describe("GR/CG never compute a 15 L spray tank", () => {
  it("maize Fipronil 0.3% GR is sand broadcast", () => {
    const d = parseFarmerDose("7-8 किग्रा प्रति एकड़, सूखी रेत में मिलाकर हल्की नमी में बुरकाव", {
      technical: "Fipronil 0.3% GR",
    });
    expect(d.isSpray).toBe(false);
    expect(d.method).toBe("soil_broadcast");
    expect(d.tankDose).not.toMatch(/15 लीटर/);
  });

  it("Ferterra 0.4% GR is whorl placement, not foliar", () => {
    const d = parseFarmerDose("4 किग्रा प्रति एकड़", {
      technical: "Chlorantraniliprole 0.4% GR",
    });
    expect(d.isSpray).toBe(false);
    expect(d.method).toBe("soil_broadcast");
  });

  it("Afidopyropen 50 g/L DC stays a spray", () => {
    const d = parseFarmerDose("2 मिली / लीटर पानी (400 मिली प्रति एकड़)", {
      technical: "Afidopyropen 50 g/L DC",
    });
    expect(d.isSpray).toBe(true);
    expect(d.method).toBe("foliar_spray");
  });
});
