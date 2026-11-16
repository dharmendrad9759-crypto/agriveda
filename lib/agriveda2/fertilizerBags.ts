/** Show existing kilogram lines as bags. Does not change the dose. */

function bagNote(kg: number, bagKg: number): string | null {
  if (!Number.isFinite(kg) || kg < bagKg) return null;
  const bags = Math.floor(kg / bagKg);
  const left = Math.round((kg - bags * bagKg) * 10) / 10;
  if (bags < 1) return null;
  if (left <= 0) return `${bags} बोरी · ${bagKg} किलो`;
  return `${bags} बोरी + ${left} किलो · ${bagKg} किलो बोरी`;
}

export function withFertilizerBags(text: string): string {
  return text.replace(
    /(DAP|डीएपी|MOP|एमओपी|पोटाश|यूरिया|Urea)([^।\n]{0,48}?)(\d+(?:\.\d+)?)\s*(किग्रा|किलो|kg)/gi,
    (full, name: string, _mid: string, num: string) => {
      if (full.includes("बोरी")) return full;
      const kg = parseFloat(num);
      const urea = /यूरिया|urea/i.test(name);
      const bagKg = urea ? 45 : /dap|डीएपी|mop|एमओपी|पोटाश/i.test(name) ? 50 : 0;
      const note = bagKg ? bagNote(kg, bagKg) : null;
      return note ? `${full} (${note})` : full;
    }
  );
}
