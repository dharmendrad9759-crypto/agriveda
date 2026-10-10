/**
 * Common Indian market brands for AI Doctor medicine cards.
 * Prefer Gemini-returned brands; fall back to this when empty.
 */

type MedBrandHint = {
  fullName: string;
  brands: string[];
};

const TABLE: { match: RegExp; hint: MedBrandHint }[] = [
  {
    match: /hexaconazole/i,
    hint: {
      fullName: "Hexaconazole 5% SC",
      brands: ["Contaf Plus (Tata Rallis)", "Sitara", "Hexazol"],
    },
  },
  {
    match: /tebuconazole/i,
    hint: {
      fullName: "Tebuconazole 25.9% EC",
      brands: ["Folicur (Bayer)", "Orius", "Constant"],
    },
  },
  {
    match: /propiconazole/i,
    hint: {
      fullName: "Propiconazole 25% EC",
      brands: ["Tilt (Syngenta)", "Bumper (Adama)", "Result"],
    },
  },
  {
    match: /azoxystrobin/i,
    hint: {
      fullName: "Azoxystrobin 23% SC",
      brands: ["Amistar (Syngenta)", "Mirador", "Azoxy"],
    },
  },
  {
    match: /mancozeb/i,
    hint: {
      fullName: "Mancozeb 75% WP",
      brands: ["Dithane M-45 (Corteva)", "Indofil M-45", "Uthane"],
    },
  },
  {
    match: /carbendazim/i,
    hint: {
      fullName: "Carbendazim 50% WP",
      brands: ["Bavistin", "Derosal", "Zoom"],
    },
  },
  {
    match: /metalaxyl|mefenoxam|ridomil/i,
    hint: {
      fullName: "Metalaxyl-M 4% + Mancozeb 64% WP",
      brands: ["Ridomil Gold MZ 68 WP (Syngenta)", "Master (Indofil)", "Krilaxyl"],
    },
  },
  {
    match: /chlorothalonil/i,
    hint: {
      fullName: "Chlorothalonil 75% WP",
      brands: ["Kavach (Syngenta)", "Cover"],
    },
  },
  {
    match: /copper\s*(oxy|hydrox|oxychloride)|कॉपर/i,
    hint: {
      fullName: "Copper oxychloride 50% WP",
      brands: ["Blitox", "Blue Copper", "Dhanucop"],
    },
  },
  {
    match: /imidacloprid/i,
    hint: {
      fullName: "Imidacloprid 17.8% SL",
      brands: ["Confidor (Bayer)", "Tatamida", "Courage"],
    },
  },
  {
    match: /thiamethoxam/i,
    hint: {
      fullName: "Thiamethoxam 25% WG",
      brands: ["Actara (Syngenta)", "Areva", "Click"],
    },
  },
  {
    match: /chlorantraniliprole/i,
    hint: {
      fullName: "Chlorantraniliprole 18.5% SC",
      brands: ["Coragen (FMC)", "Cover"],
    },
  },
  {
    match: /emamectin/i,
    hint: {
      fullName: "Emamectin benzoate 5% SG",
      brands: ["Proclaim (Syngenta)", "Missile", "Sperto"],
    },
  },
  {
    match: /fipronil/i,
    hint: {
      fullName: "Fipronil 5% SC / 0.3% GR",
      brands: ["Regent (Bayer)", "Jump", "Fenom"],
    },
  },
  {
    match: /spinosad/i,
    hint: {
      fullName: "Spinosad 45% SC",
      brands: ["Tracer (Corteva)"],
    },
  },
  {
    match: /spinetoram/i,
    hint: {
      fullName: "Spinetoram 11.7% SC",
      brands: ["Delegate (Corteva)"],
    },
  },
  {
    match: /diafenthiuron/i,
    hint: {
      fullName: "Diafenthiuron 50% WP",
      brands: ["Pegasus (Syngenta)", "Polo"],
    },
  },
  {
    match: /pyriproxyfen/i,
    hint: {
      fullName: "Pyriproxyfen 10% EC",
      brands: ["Lano (Sumitomo)", "Admiral"],
    },
  },
  {
    match: /flonicamid/i,
    hint: {
      fullName: "Flonicamid 50% WG",
      brands: ["Ulala (UPL)"],
    },
  },
  {
    match: /spiromesifen/i,
    hint: {
      fullName: "Spiromesifen 22.9% SC",
      brands: ["Oberon (Bayer)"],
    },
  },
  {
    match: /tricyclazole/i,
    hint: {
      fullName: "Tricyclazole 75% WP",
      brands: ["Beam (Corteva)", "Baan (Dhanuka)", "Sivic"],
    },
  },
  {
    match: /validamycin/i,
    hint: {
      fullName: "Validamycin 3% L",
      brands: ["Sheathmar (Dhanuka)", "Rhizocin"],
    },
  },
  {
    match: /pymetrozine/i,
    hint: {
      fullName: "Pymetrozine 50% WDG",
      brands: ["Chess (Syngenta)", "Fulstop"],
    },
  },
  {
    match: /dinotefuran/i,
    hint: {
      fullName: "Dinotefuran 20% SG",
      brands: ["Token (Indofil)", "Oshin"],
    },
  },
  {
    match: /flubendiamide/i,
    hint: {
      fullName: "Flubendiamide 39.35% SC",
      brands: ["Fame (Bayer)"],
    },
  },
  {
    match: /cartap/i,
    hint: {
      fullName: "Cartap hydrochloride 50% SP",
      brands: ["Caldan 50 SP (Dhanuka)", "Padan"],
    },
  },
  {
    match: /chlorpyrifos/i,
    hint: {
      fullName: "Chlorpyrifos 20% EC",
      brands: ["Dursban (Corteva)", "Radar"],
    },
  },
  {
    match: /abamectin/i,
    hint: {
      fullName: "Abamectin 1.9% EC",
      brands: ["Vertimec (Syngenta)"],
    },
  },
  {
    match: /lambda.?cyhalothrin/i,
    hint: {
      fullName: "Lambda-cyhalothrin 5% EC",
      brands: ["Karate (Syngenta)", "Reeva", "Agent Plus"],
    },
  },
];

export function enrichMedicineDisplay(input: {
  name: string;
  dose: string;
  fracIrac?: string;
  brands?: string[];
}): { name: string; dose: string; fracIrac: string; brands: string[] } {
  const rawName = input.name?.trim() || "—";
  const existingBrands = (input.brands ?? []).map((b) => b.trim()).filter(Boolean);
  const hit = TABLE.find((row) => row.match.test(rawName));

  const hasFormulation = /\d|\bSC\b|\bEC\b|\bWP\b|\bWG\b|\bSL\b|\bGR\b|\bSG\b|%/i.test(rawName);
  let fullName = hit && !hasFormulation ? hit.hint.fullName : rawName;

  // Authoritative normalization for Ridomil Gold (Metalaxyl-M 4% + Mancozeb 64% WP @ 2 to 2.5 g/L)
  let dose = input.dose?.trim() || "—";
  let brands =
    existingBrands.length > 0 ? existingBrands.slice(0, 4) : hit?.hint.brands.slice(0, 3) ?? [];

  if (/metalaxyl|mefenoxam|ridomil|मेटालैक्सिल/i.test(rawName) || /metalaxyl|ridomil/i.test(fullName)) {
    fullName = "Metalaxyl-M 4% + Mancozeb 64% WP (Ridomil Gold MZ 68 WP)";
    if (!dose || dose === "—" || /\b(3|3\.0|3\.5)\s*(g|ग्राम)/i.test(dose)) {
      dose = "2 से 2.5 ग्राम / लीटर (500 ग्राम प्रति एकड़)";
    }
    if (!brands.some((b) => /ridomil/i.test(b))) {
      brands = ["Ridomil Gold MZ 68 WP (Syngenta)", ...brands].slice(0, 3);
    }
  }

  return {
    name: fullName,
    dose,
    fracIrac: input.fracIrac || "—",
    brands,
  };
}
