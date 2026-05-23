export type Occasion =
  | "Hochzeit"
  | "Gala"
  | "Jubiläum"
  | "Geburtstag"
  | "Geschäftsabschluss"
  | "Festival";

export interface AvailabilityWindow {
  from: string;
  to: string;
}

export interface OccasionBundle {
  bundleSlug: string;
  displayName: string;
  occasion: Occasion;
  watchPool: string[];
  watchFamily: string;
  durationDays: number;
  includes: string[];
  priceEur: number;
  availabilityWindow: AvailabilityWindow | null;
  editorialAnchorStoryId: string;
  optionalAddOns?: { name: string; priceEur: number }[];
  heroDescription: string;
}

export interface Booking {
  id: string;
  bundleSlug: string;
  customerName: string;
  customerEmail: string;
  startDate: string;
  createdAt: string;
}

export type StoryContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "watch_cta"; bundleSlug: string }
  | { type: "image"; alt: string; caption?: string };

export interface EditorialStory {
  id: string;
  title: string;
  excerpt: string;
  occasion: Occasion;
  brand: string;
  author: string;
  publishedAt: string;
  heroImageAlt: string;
  bundleSlugs: string[];
  contentBlocks: StoryContentBlock[];
}
