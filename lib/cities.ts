export interface CityLanding {
  slug: string;
  name: string;
  region: string;
  country: "DE" | "AT" | "CH";
  metaTitle: string;
  metaDescription: string;
  headline: string;
  intro: string;
  occasions: string[];
  faq: { question: string; answer: string }[];
}

export const cityLandings: CityLanding[] = [
  {
    slug: "berlin",
    name: "Berlin",
    region: "Berlin",
    country: "DE",
    metaTitle: "Luxusuhr mieten in Berlin — Marlo",
    metaDescription:
      "Luxusuhren für besondere Anlässe in Berlin mieten. Patek Philippe, Rolex, Audemars Piguet — persönliche Übergabe, alles inklusive.",
    headline: "Luxusuhren mieten in Berlin",
    intro:
      "Ob Hochzeit am Wannsee, Gala im Hotel Adlon oder Firmenjubiläum in Mitte — mit Marlo tragen Sie eine Luxusuhr, die zu Ihrem Anlass passt. Persönliche Übergabe in Berlin, Concierge inklusive.",
    occasions: ["Hochzeit", "Gala", "Jubiläum", "Geschäftsabschluss"],
    faq: [
      {
        question: "Wie funktioniert die Uhrenmiete in Berlin?",
        answer:
          "Sie wählen ein Occasion Bundle, buchen online und erhalten die Uhr per persönlicher Übergabe in Berlin. Rücksendung und Versicherung sind inklusive.",
      },
      {
        question: "Welche Uhrenmarken kann ich in Berlin mieten?",
        answer:
          "Aktuell bieten wir Patek Philippe Calatrava, Rolex Daytona und Audemars Piguet Royal Oak an. Weitere Modelle folgen.",
      },
    ],
  },
  {
    slug: "muenchen",
    name: "München",
    region: "Bayern",
    country: "DE",
    metaTitle: "Luxusuhr mieten in München — Marlo",
    metaDescription:
      "Luxusuhren für besondere Anlässe in München mieten. Persönliche Übergabe, Concierge-Service, Versicherung inklusive.",
    headline: "Luxusuhren mieten in München",
    intro:
      "München — Wiesn, Opernball, Firmenjubiläen: Anlässe, die eine besondere Uhr verdienen. Marlo liefert persönlich in München und Umgebung.",
    occasions: ["Hochzeit", "Gala", "Jubiläum", "Festival"],
    faq: [
      {
        question: "Wie funktioniert die Uhrenmiete in München?",
        answer:
          "Bundle auswählen, online buchen, persönliche Übergabe in München. Alles inklusive — Versicherung, Concierge, Rückversand.",
      },
      {
        question: "Kann ich eine Uhr für die Wiesn mieten?",
        answer:
          "Ja — unser Gala-Wochenende-Bundle eignet sich perfekt für die Wiesn. Drei Tage Rolex Daytona mit Weiße-Handschuhe-Lieferung.",
      },
    ],
  },
  {
    slug: "hamburg",
    name: "Hamburg",
    region: "Hamburg",
    country: "DE",
    metaTitle: "Luxusuhr mieten in Hamburg — Marlo",
    metaDescription:
      "Luxusuhren für besondere Anlässe in Hamburg mieten. Rolex, Patek Philippe, AP — persönliche Übergabe, alles inklusive.",
    headline: "Luxusuhren mieten in Hamburg",
    intro:
      "Elbphilharmonie-Gala, Alster-Hochzeit oder Geschäftsessen an der Binnenalster — tragen Sie eine Uhr, die dem Moment gerecht wird. Persönliche Übergabe in Hamburg.",
    occasions: ["Hochzeit", "Gala", "Geschäftsabschluss"],
    faq: [
      {
        question: "Wie funktioniert die Uhrenmiete in Hamburg?",
        answer:
          "Sie wählen ein Occasion Bundle, buchen online und erhalten Ihre Luxusuhr per persönlicher Übergabe in Hamburg.",
      },
      {
        question: "Bietet Marlo auch Lieferung nach Schleswig-Holstein an?",
        answer:
          "Die persönliche Übergabe ist aktuell auf Hamburg begrenzt. Versandlieferung in ganz Deutschland ist möglich.",
      },
    ],
  },
  {
    slug: "wien",
    name: "Wien",
    region: "Wien",
    country: "AT",
    metaTitle: "Luxusuhr mieten in Wien — Marlo",
    metaDescription:
      "Luxusuhren für besondere Anlässe in Wien mieten. Opernball, Hochzeit, Gala — Patek Philippe, Rolex, AP. Alles inklusive.",
    headline: "Luxusuhren mieten in Wien",
    intro:
      "Opernball, Hochzeit im Palais, Firmenjubiläum in der Innenstadt — Wien hat Anlässe, die eine besondere Uhr verdienen. Marlo liefert versichert nach Wien.",
    occasions: ["Hochzeit", "Gala", "Jubiläum"],
    faq: [
      {
        question: "Liefert Marlo nach Österreich?",
        answer:
          "Ja, wir versenden versichert nach Wien und ganz Österreich. Rückversand ist inklusive.",
      },
      {
        question: "Welche Währung gilt für Österreich?",
        answer: "Alle Preise sind in Euro (EUR) inklusive MwSt.",
      },
    ],
  },
  {
    slug: "zuerich",
    name: "Zürich",
    region: "Zürich",
    country: "CH",
    metaTitle: "Luxusuhr mieten in Zürich — Marlo",
    metaDescription:
      "Luxusuhren für besondere Anlässe in Zürich mieten. Rolex, Patek Philippe, AP — versicherter Versand, alles inklusive.",
    headline: "Luxusuhren mieten in Zürich",
    intro:
      "Zürich — Baur au Lac, Opernhaus, Bahnhofstrasse: Anlässe und Orte, die nach einer besonderen Uhr verlangen. Marlo liefert versichert in die Schweiz.",
    occasions: ["Hochzeit", "Gala", "Geschäftsabschluss"],
    faq: [
      {
        question: "Liefert Marlo in die Schweiz?",
        answer:
          "Ja, wir versenden versichert nach Zürich und in die gesamte Schweiz. Rückversand inklusive.",
      },
      {
        question: "Sind die Preise in CHF oder EUR?",
        answer:
          "Alle Preise sind in Euro (EUR). Die Abrechnung erfolgt in EUR, Ihr Kartenanbieter rechnet zum Tageskurs um.",
      },
    ],
  },
];

export function getCityBySlug(slug: string): CityLanding | undefined {
  return cityLandings.find((c) => c.slug === slug);
}
