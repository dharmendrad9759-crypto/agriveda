import { describe, it, expect } from "vitest";
import { chemBottleImageSrc, hasRealBottlePhoto, REAL_BOTTLE_PHOTOS } from "@/lib/crops/chemBottleSvg";
import { lookupChemBottle } from "@/lib/crops/chemBottle";
import fs from "fs";
import path from "path";

describe("Chemical Bottle Photorealistic Images Resolution", () => {
  it("every photo referenced in REAL_BOTTLE_PHOTOS must physically exist on disk", () => {
    const missing: string[] = [];
    for (const [key, photoPath] of Object.entries(REAL_BOTTLE_PHOTOS)) {
      const diskPath = path.join(process.cwd(), "public", photoPath);
      if (!fs.existsSync(diskPath)) {
        missing.push(`${key} -> ${photoPath}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("resolves Propiconazole 25% EC to real authentic photo", () => {
    expect(hasRealBottlePhoto("Propiconazole 25% EC")).toBe(true);
    expect(chemBottleImageSrc("Propiconazole 25% EC")).toBe("/images/chem/real/propiconazole-25-ec.jpg");
  });

  it("resolves Cartap Hydrochloride 50% SP to real pouch photo", () => {
    expect(hasRealBottlePhoto("Cartap Hydrochloride 50% SP")).toBe(true);
    expect(chemBottleImageSrc("Cartap Hydrochloride 50% SP")).toBe("/images/chem/real/cartap-50-sp.jpg");
  });

  it("resolves Chlorantraniliprole 18.5% SC to real bottle photo", () => {
    expect(hasRealBottlePhoto("Chlorantraniliprole 18.5% SC")).toBe(true);
    expect(chemBottleImageSrc("Chlorantraniliprole 18.5% SC")).toBe("/images/chem/real/chlorantraniliprole-18-5-sc.jpg");
  });

  it("resolves Fipronil 0.3% GR vs 0.6% GR distinctly with accurate percentage photos", () => {
    expect(hasRealBottlePhoto("Fipronil 0.3% GR")).toBe(true);
    expect(chemBottleImageSrc("Fipronil 0.3% GR")).toBe("/images/chem/real/fipronil-0-3-gr.jpg");

    expect(hasRealBottlePhoto("Fipronil 0.6% GR")).toBe(true);
    expect(chemBottleImageSrc("Fipronil 0.6% GR")).toBe("/images/chem/real/fipronil-0-6-gr.jpg");

    // Hindi technical names
    expect(hasRealBottlePhoto("फ़िप्रोनिल 0.6% जीआर")).toBe(true);
    expect(chemBottleImageSrc("फ़िप्रोनिल 0.6% जीआर")).toBe("/images/chem/real/fipronil-0-6-gr.jpg");

    expect(hasRealBottlePhoto("फ़िप्रोनिल 0.3% जीआर")).toBe(true);
    expect(chemBottleImageSrc("फ़िप्रोनिल 0.3% जीआर")).toBe("/images/chem/real/fipronil-0-3-gr.jpg");
  });

  it("resolves Streptocycline to clean generic photo without commercial brand name", () => {
    expect(hasRealBottlePhoto("Streptocycline")).toBe(true);
    expect(chemBottleImageSrc("Streptocycline")).toBe("/images/chem/real/streptocycline-sp.jpg");
  });

  it("resolves Picoxystrobin + Propiconazole SC to real product photo", () => {
    expect(hasRealBottlePhoto("Picoxystrobin 7.05% + Propiconazole 11.71% SC")).toBe(true);
    expect(chemBottleImageSrc("Picoxystrobin 7.05% + Propiconazole 11.71% SC")).toBe("/images/chem/real/picoxystrobin-propiconazole-sc.jpg");
  });

  it("resolves pure technical regenerated photos (Thiamethoxam, Flubendiamide, Pymetrozine, Triflumezopyrim)", () => {
    expect(chemBottleImageSrc("Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC")).toBe("/images/chem/real/thiamethoxam-lambda-zc.jpg");
    expect(chemBottleImageSrc("Flubendiamide 20% WG")).toBe("/images/chem/real/flubendiamide-20-wg.jpg");
    expect(chemBottleImageSrc("Pymetrozine 50% WG")).toBe("/images/chem/real/pymetrozine-50-wg.jpg");
    expect(chemBottleImageSrc("Triflumezopyrim 10% SC")).toBe("/images/chem/real/triflumezopyrim-10-sc.jpg");
  });

  it("resolves Thiodicarb 75% WP to real metallic pouch photo", () => {
    expect(hasRealBottlePhoto("Thiodicarb 75% WP")).toBe(true);
    expect(chemBottleImageSrc("Thiodicarb 75% WP")).toBe("/images/chem/real/thiodicarb-75-wp.jpg");
    expect(chemBottleImageSrc("थायोडिकार्ब 75% WP")).toBe("/images/chem/real/thiodicarb-75-wp.jpg");
  });

  it("resolves Tolfenpyrad 15% EC to real bottle photo", () => {
    expect(hasRealBottlePhoto("Tolfenpyrad 15% EC")).toBe(true);
    expect(chemBottleImageSrc("Tolfenpyrad 15% EC")).toBe("/images/chem/real/tolfenpyrad-15-ec.jpg");
    expect(chemBottleImageSrc("टोलफेनपायराड 15% EC")).toBe("/images/chem/real/tolfenpyrad-15-ec.jpg");
  });

  it("resolves Fipronil 40% + Imidacloprid 40% WG correctly and avoids the .3 GR bug", () => {
    // English lookup
    expect(hasRealBottlePhoto("Fipronil 40% + Imidacloprid 40% WG")).toBe(true);
    expect(chemBottleImageSrc("Fipronil 40% + Imidacloprid 40% WG")).toBe("/images/chem/real/fipronil-40-imidacloprid-40-wg.jpg");
    expect(chemBottleImageSrc("Fipronil 40% + Imidacloprid 40% WG")).not.toBe("/images/chem/real/fipronil-0-3-gr.jpg");

    // Hindi lookup
    expect(hasRealBottlePhoto("फ़िप्रोनिल 40% + इमिडाक्लोप्रिड 40% WG")).toBe(true);
    expect(chemBottleImageSrc("फ़िप्रोनिल 40% + इमिडाक्लोप्रिड 40% WG")).toBe("/images/chem/real/fipronil-40-imidacloprid-40-wg.jpg");
    expect(chemBottleImageSrc("फ़िप्रोनिल 40% + इमिडाक्लोप्रिड 40% WG")).not.toBe("/images/chem/real/fipronil-0-3-gr.jpg");

    const entry = lookupChemBottle("फ़िप्रोनिल 40% + इमिडाक्लोप्रिड 40% WG");
    expect(entry).toBeDefined();
    expect(entry?.slug).toBe("fipronil-40-imidacloprid-40-wg");
    expect(entry?.formulation).toBe("40% + 40% WG");
    expect(entry?.formulation).not.toContain("0.3%");
  });
});
