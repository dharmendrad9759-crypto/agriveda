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
    match: /metalaxyl|mefenoxam/i,
    hint: {
      fullName: "Metalaxyl + Mancozeb",
      brands: ["Ridomil Gold MZ (Syngenta)", "Master", "Krilaxyl"],
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
    match: /spinosad|spinetoram/i,
    hint: {
      fullName: "Spinosad / Spinetoram",
      brands: ["Tracer (Corteva)", "Delegate (Corteva)"],
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
      brands: ["Admiral", "Lano"],
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
  const fullName = hit && !hasFormulation ? hit.hint.fullName : rawName;

  const brands =
    existingBrands.length > 0 ? existingBrands.slice(0, 4) : hit?.hint.brands.slice(0, 3) ?? [];

  return {
    name: fullName,
    dose: input.dose || "—",
    fracIrac: input.fracIrac || "—",
    brands,
  };
}
