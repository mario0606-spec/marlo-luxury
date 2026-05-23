import { EditorialStory } from "./types";

export const editorialStories: EditorialStory[] = [
  {
    id: "hochzeit-uhr-guide",
    title: "Die perfekte Uhr für den schönsten Tag",
    excerpt:
      "Warum eine Patek Philippe Calatrava der ideale Begleiter für Ihre Hochzeit ist — und wie Sie sie für sieben Tage mieten können.",
    bundleSlugs: ["hochzeitswoche-patek"],
  },
  {
    id: "gala-look-rolex",
    title: "Gala-Abend: Ihr Handgelenk verdient Applaus",
    excerpt:
      "Von der Einladung bis zum letzten Tanz — warum die Rolex Daytona das Statement-Stück jeder Gala ist.",
    bundleSlugs: ["gala-wochenende-rolex-daytona"],
  },
  {
    id: "jubilaeum-royal-oak",
    title: "30 Tage Royal Oak: Ein Jubiläum, das sich wie Luxus anfühlt",
    excerpt:
      "Ein ganzer Monat mit der Audemars Piguet Royal Oak — unser ausführlichster Erlebnisbericht.",
    bundleSlugs: ["jubilaeum-30-tage-ap"],
  },
];

export function getStoryById(id: string): EditorialStory | undefined {
  return editorialStories.find((s) => s.id === id);
}
