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

export interface EditorialStory {
  id: string;
  title: string;
  excerpt: string;
  bundleSlugs: string[];
}
