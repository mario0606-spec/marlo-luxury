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

export type WatchConditionGrade = "A+" | "A" | "B+" | "B";

export interface ConditionEntry {
  date: string;
  grade: WatchConditionGrade;
  notes: string;
  inspectedBy: string;
}

export interface WatchAuthenticity {
  id: string;
  serial: string;
  brand: string;
  model: string;
  referenceNumber: string;
  watchmaker: string;
  // swap-when-funded: Mux/Cloudflare Stream — replace static URL with streaming video platform
  inspectionVideoUrl: string | null;
  // swap-when-funded: NFC NTAG 424 DNA — replace null stubs with real NFC UIDs from physical cards
  nfcUid: string | null;
  conditionLog: ConditionEntry[];
  authenticatedAt: string;
  certificateNumber: string;
}
