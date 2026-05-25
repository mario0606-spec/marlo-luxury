import { OccasionBundle } from "./types";

export const occasionBundles: OccasionBundle[] = [
  {
    bundleSlug: "hochzeitswoche-patek",
    displayName: "Hochzeitswoche — 7 Tage Patek + Concierge",
    occasion: "Hochzeit",
    watchPool: ["patek-calatrava-5196r", "patek-calatrava-5227g", "patek-calatrava-6119r"],
    watchFamily: "Patek Philippe Calatrava",
    durationDays: 7,
    includes: [
      "Persönliche Übergabe in Berlin, München oder Hamburg",
      "24/7 Concierge-Hotline",
      "Versicherung Premium inkl.",
      "Rückversand inkl.",
    ],
    priceEur: 890,
    availabilityWindow: null,
    editorialAnchorStoryId: "die-hochzeit",
    heroDescription:
      "Ihre Hochzeit verdient einen Zeitmesser, der diesem Moment gerecht wird. Sieben Tage lang tragen Sie eine Patek Philippe Calatrava — persönlich übergeben, rundum versichert, mit Concierge an Ihrer Seite.",
  },
  {
    bundleSlug: "gala-wochenende-rolex-daytona",
    displayName: "Gala-Wochenende Rolex Daytona",
    occasion: "Gala",
    watchPool: ["rolex-daytona-116500ln", "rolex-daytona-116508"],
    watchFamily: "Rolex Daytona",
    durationDays: 3,
    includes: [
      "Versand Donnerstag / Rücksendung Montag",
      "Weiße-Handschuhe-Lieferung",
      "24/7 Concierge-Hotline",
      "Rückversand inkl.",
    ],
    priceEur: 490,
    availabilityWindow: null,
    editorialAnchorStoryId: "gala-charity-abend",
    optionalAddOns: [
      { name: "Smoking-Hemdmanschetten (Paar)", priceEur: 45 },
    ],
    heroDescription:
      "Ein Wochenende, das in Erinnerung bleibt. Die Rolex Daytona am Handgelenk, weiße Handschuhe bei der Lieferung, Rücksendung am Montag — alles inklusive.",
  },
  {
    bundleSlug: "jubilaeum-audemars-piguet",
    displayName: "Jubiläum 30 Tage Audemars Piguet",
    occasion: "Jubiläum",
    watchPool: ["ap-royal-oak-15500st", "ap-royal-oak-15202st", "ap-royal-oak-15510st"],
    watchFamily: "Audemars Piguet Royal Oak",
    durationDays: 30,
    includes: [
      "Einmonatige Miete",
      "24/7 Concierge-Hotline",
      "Versicherung Premium inkl.",
      "Rückversand inkl.",
    ],
    priceEur: 1890,
    availabilityWindow: null,
    editorialAnchorStoryId: "geburtstag",
    optionalAddOns: [
      { name: "Professionelle Foto-Session", priceEur: 250 },
    ],
    heroDescription:
      "Ein ganzer Monat mit der Royal Oak am Handgelenk. Ob Firmenjubiläum, Ehejahrestag oder persönlicher Meilenstein — feiern Sie die Zeit, die zählt.",
  },
];

export function getBundleBySlug(slug: string): OccasionBundle | undefined {
  return occasionBundles.find((b) => b.bundleSlug === slug);
}
