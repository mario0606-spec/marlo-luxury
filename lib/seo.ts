export const BASE_URL = "https://www.marlo.de";

const GERMAN_CHAR_MAP: Record<string, string> = {
  ü: "ue",
  ö: "oe",
  ä: "ae",
  ß: "ss",
  Ü: "Ue",
  Ö: "Oe",
  Ä: "Ae",
};

export function transliterateSlug(input: string): string {
  let result = input;
  for (const [char, replacement] of Object.entries(GERMAN_CHAR_MAP)) {
    result = result.replaceAll(char, replacement);
  }
  return result
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function hreflangAlternates(path: string) {
  return {
    canonical: `${BASE_URL}${path}`,
    languages: {
      de: `${BASE_URL}${path}`,
      "de-AT": `${BASE_URL}${path}`,
      "de-CH": `${BASE_URL}${path}`,
    },
  };
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}
