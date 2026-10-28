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

  it("accurately resolves user-reported chemicals to their dedicated photorealistic photos without mismatches", () => {
    // 1. Isoprothiolane 40% EC (Fungicide) - NOT Hexaconazole
    expect(hasRealBottlePhoto("आइसोप्रोथियोलेन 40% EC")).toBe(true);
    expect(chemBottleImageSrc("आइसोप्रोथियोलेन 40% EC")).toBe("/images/chem/real/isoprothiolane-40-ec.jpg");
    expect(chemBottleImageSrc("Isoprothiolane 40% EC")).toBe("/images/chem/real/isoprothiolane-40-ec.jpg");

    // 2. Kitazin 48% EC (IBP Organophosphate Fungicide) - NOT flat SVG
    expect(hasRealBottlePhoto("किटाज़िन 48% EC")).toBe(true);
    expect(chemBottleImageSrc("किटाज़िन 48% EC")).toBe("/images/chem/real/kitazin-48-ec.jpg");
    expect(chemBottleImageSrc("Kitazin 48% EC")).toBe("/images/chem/real/kitazin-48-ec.jpg");

    // 3. Tebuconazole 50% + Trifloxystrobin 25% WG - Dedicated metallic pouch, NOT 25.9% EC bottle
    expect(hasRealBottlePhoto("टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG")).toBe(true);
    expect(chemBottleImageSrc("टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG")).toBe("/images/chem/real/tebuconazole-trifloxystrobin-wg.jpg");
    expect(chemBottleImageSrc("टेबुकोनाज़ोल 50% + ट्राइफ्लॉक्सीस्ट्रोबिन 25% WG")).not.toBe("/images/chem/real/tebuconazole-25-9-ec.jpg");

    // 4. Metiram 55% + Pyraclostrobin 5% WG - Dedicated metallic pouch, NOT Pyraclostrobin 20% WG packet
    expect(hasRealBottlePhoto("मेटिराम 55% + पायराक्लोस्ट्रोबिन 5% WG")).toBe(true);
    expect(chemBottleImageSrc("मेटिराम 55% + पायराक्लोस्ट्रोबिन 5% WG")).toBe("/images/chem/real/metiram-55-pyraclostrobin-5-wg.jpg");
    expect(chemBottleImageSrc("मेटिराम 55% + पायराक्लोस्ट्रोबिन 5% WG")).not.toBe("/images/chem/real/pyraclostrobin-20-wg.jpg");

    // 5. Azoxystrobin 18.2% + Difenoconazole 11.4% SC - Dedicated bottle, NOT Azoxystrobin 23% SC
    expect(hasRealBottlePhoto("एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC")).toBe(true);
    expect(chemBottleImageSrc("एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC")).toBe("/images/chem/real/azoxystrobin-difenoconazole-sc.jpg");
    expect(chemBottleImageSrc("एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC")).not.toBe("/images/chem/real/azoxystrobin-250-sc.jpg");

    // 6. Bifenthrin 10% EC - NOT flat SVG
    expect(hasRealBottlePhoto("बाइफेंथ्रिन 10% EC")).toBe(true);
    expect(chemBottleImageSrc("बाइफेंथ्रिन 10% EC")).toBe("/images/chem/real/bifenthrin-10-ec.jpg");
    expect(chemBottleImageSrc("Bifenthrin 10% EC")).toBe("/images/chem/real/bifenthrin-10-ec.jpg");

    // 7. Quinalphos 25% EC - Dedicated bottle, NOT Cypermethrin 25% EC
    expect(hasRealBottlePhoto("Quinalphos 25% EC")).toBe(true);
    expect(chemBottleImageSrc("Quinalphos 25% EC")).toBe("/images/chem/real/quinalphos-25-ec.jpg");
    expect(chemBottleImageSrc("क्विनालफॉस 25% EC")).toBe("/images/chem/real/quinalphos-25-ec.jpg");
    expect(chemBottleImageSrc("Quinalphos 25% EC")).not.toBe("/images/chem/real/cypermethrin-25-ec.jpg");

    // 8. Indoxacarb 14.5% SC - Dedicated bottle, NOT Flubendiamide
    expect(hasRealBottlePhoto("Indoxacarb 14.5% SC")).toBe(true);
    expect(chemBottleImageSrc("Indoxacarb 14.5% SC")).toBe("/images/chem/real/indoxacarb-14-5-sc.jpg");
    expect(chemBottleImageSrc("इंडोक्साकार्ब 14.5% SC")).toBe("/images/chem/real/indoxacarb-14-5-sc.jpg");

    // 9. Pyriproxyfen 10% + Bifenthrin 10% EC - Dedicated bottle, NOT Buprofezin 25% SC
    expect(hasRealBottlePhoto("Pyriproxyfen 10% + Bifenthrin 10% EC")).toBe(true);
    expect(chemBottleImageSrc("Pyriproxyfen 10% + Bifenthrin 10% EC")).toBe("/images/chem/real/pyriproxyfen-bifenthrin-ec.jpg");
    expect(chemBottleImageSrc("पायरीप्रॉक्सीफेन 10% + बाइफेंथ्रिन 10% EC")).toBe("/images/chem/real/pyriproxyfen-bifenthrin-ec.jpg");

    // 10. Carbendazim 12% + Mancozeb 63% WP - Single combo pouch, NOT two separate packets
    expect(hasRealBottlePhoto("Carbendazim 12% + Mancozeb 63% WP")).toBe(true);
    expect(chemBottleImageSrc("Carbendazim 12% + Mancozeb 63% WP")).toBe("/images/chem/real/carbendazim-mancozeb-wp.jpg");
    expect(chemBottleImageSrc("कार्बेन्डाजिम 12% + मैंकोजेब 63% WP")).toBe("/images/chem/real/carbendazim-mancozeb-wp.jpg");

    // 11. Fipronil 5% SC - Dedicated bottle, NOT Chlorantraniliprole 18.5% SC
    expect(hasRealBottlePhoto("Fipronil 5% SC")).toBe(true);
    expect(chemBottleImageSrc("Fipronil 5% SC")).toBe("/images/chem/real/fipronil-5-sc.jpg");
    expect(chemBottleImageSrc("फ़िप्रोनिल 5% SC")).toBe("/images/chem/real/fipronil-5-sc.jpg");

    // 12. Cypermethrin 10% EC - Dedicated 10% EC bottle
    expect(hasRealBottlePhoto("Cypermethrin 10% EC")).toBe(true);
    expect(chemBottleImageSrc("Cypermethrin 10% EC")).toBe("/images/chem/real/cypermethrin-10-ec.jpg");
    expect(chemBottleImageSrc("साइपरमेथ्रिन 10% EC")).toBe("/images/chem/real/cypermethrin-10-ec.jpg");

    // 13. Cartap Hydrochloride 50% SP - Dedicated metallic pouch
    expect(hasRealBottlePhoto("Cartap Hydrochloride 50% SP")).toBe(true);
    expect(chemBottleImageSrc("Cartap Hydrochloride 50% SP")).toBe("/images/chem/real/cartap-50-sp.jpg");
  });

  it("resolves bidirectional combo technical names correctly", () => {
    // Trifloxystrobin first vs Tebuconazole first
    expect(chemBottleImageSrc("Trifloxystrobin 25% + Tebuconazole 50% WG")).toBe("/images/chem/real/tebuconazole-trifloxystrobin-wg.jpg");
    expect(chemBottleImageSrc("Tebuconazole 50% + Trifloxystrobin 25% WG")).toBe("/images/chem/real/tebuconazole-trifloxystrobin-wg.jpg");
    expect(chemBottleImageSrc("ट्राइफ्लॉक्सीस्ट्रोबिन 25% + टेबुकोनाज़ोल 50% WG")).toBe("/images/chem/real/tebuconazole-trifloxystrobin-wg.jpg");

    // Pyraclostrobin first vs Metiram first
    expect(chemBottleImageSrc("Pyraclostrobin 5% + Metiram 55% WG")).toBe("/images/chem/real/metiram-55-pyraclostrobin-5-wg.jpg");
    expect(chemBottleImageSrc("Metiram 55% + Pyraclostrobin 5% WG")).toBe("/images/chem/real/metiram-55-pyraclostrobin-5-wg.jpg");

    // Difenoconazole first vs Azoxystrobin first
    expect(chemBottleImageSrc("Difenoconazole 11.4% + Azoxystrobin 18.2% SC")).toBe("/images/chem/real/azoxystrobin-difenoconazole-sc.jpg");
    expect(chemBottleImageSrc("Azoxystrobin 18.2% + Difenoconazole 11.4% SC")).toBe("/images/chem/real/azoxystrobin-difenoconazole-sc.jpg");

    // Mancozeb first vs Carbendazim first
    expect(chemBottleImageSrc("Mancozeb 63% + Carbendazim 12% WP")).toBe("/images/chem/real/carbendazim-mancozeb-wp.jpg");
    expect(chemBottleImageSrc("Carbendazim 12% + Mancozeb 63% WP")).toBe("/images/chem/real/carbendazim-mancozeb-wp.jpg");
  });

  it("resolves all newly added herbicide and PGR photorealistic packages", () => {
    // Herbicide pouches
    expect(chemBottleImageSrc("Clodinafop-propargyl 15% WP")).toBe("/images/chem/real/clodinafop-15-wp.jpg");
    expect(chemBottleImageSrc("Sulfosulfuron 75% WG")).toBe("/images/chem/real/sulfosulfuron-75-wg.jpg");
    expect(chemBottleImageSrc("Metsulfuron-methyl 20% WP")).toBe("/images/chem/real/metsulfuron-methyl-20-wp.jpg");
    expect(chemBottleImageSrc("Ethoxysulfuron 15% WDG")).toBe("/images/chem/real/ethoxysulfuron-15-wdg.jpg");
    expect(chemBottleImageSrc("Halosulfuron-methyl 75% WG")).toBe("/images/chem/real/halosulfuron-75-wg.jpg");
    expect(chemBottleImageSrc("Metribuzin 70% WP")).toBe("/images/chem/real/metribuzin-70-wp.jpg");
    expect(chemBottleImageSrc("Pyrazosulfuron-ethyl 10% WP")).toBe("/images/chem/real/pyrazosulfuron-10-wp.jpg");
    expect(chemBottleImageSrc("Diuron 80% WP")).toBe("/images/chem/real/diuron-80-wp.jpg");

    // Herbicide bottles
    expect(chemBottleImageSrc("Butachlor 50% EC")).toBe("/images/chem/real/butachlor-50-ec.jpg");
    expect(chemBottleImageSrc("2,4-D Amine Salt 58% SL")).toBe("/images/chem/real/2-4-d-amine-58-sl.jpg");
    expect(chemBottleImageSrc("Imazethapyr 10% SL")).toBe("/images/chem/real/imazethapyr-10-sl.jpg");
    expect(chemBottleImageSrc("Quizalofop-ethyl 5% EC")).toBe("/images/chem/real/quizalofop-5-ec.jpg");
    expect(chemBottleImageSrc("Tembotrione 34.4% SC")).toBe("/images/chem/real/tembotrione-34-sc.jpg");
    expect(chemBottleImageSrc("Topramezone 33.6% SC")).toBe("/images/chem/real/topramezone-33-sc.jpg");
    expect(chemBottleImageSrc("Pinoxaden 5.1% EC")).toBe("/images/chem/real/pinoxaden-5-ec.jpg");

    // Other agrochemicals & PGRs
    expect(chemBottleImageSrc("Spirotetramat 15.31% OD")).toBe("/images/chem/real/spirotetramat-15-od.jpg");
    expect(chemBottleImageSrc("Mandipropamid 23.4% SC")).toBe("/images/chem/real/mandipropamid-23-sc.jpg");
    expect(chemBottleImageSrc("Paclobutrazol 23% SC")).toBe("/images/chem/real/paclobutrazol-23-sc.jpg");
    expect(chemBottleImageSrc("Mepiquat Chloride 5% AS")).toBe("/images/chem/real/mepiquat-chloride-5-as.jpg");
    expect(chemBottleImageSrc("Sulphur 80% WDG")).toBe("/images/chem/real/wettable-sulphur-80-wdg.jpg");
  });
});
