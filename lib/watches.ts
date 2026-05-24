export interface WatchAssets {
  slug: string;
  name: string;
  brand: string;
  heroImage: string;
  images360: string[];
  arModelGlb: string | null;
  arModelUsdz: string | null;
  arEnabled: boolean;
  posterImage: string;
}

function generate360Frames(slug: string, count = 36): string[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = String(i * 10).padStart(3, "0");
    return `/images/360/${slug}_360_${angle}.webp`;
  });
}

export const watchCatalog: WatchAssets[] = [
  {
    slug: "patek-calatrava-5196r",
    name: "Patek Philippe Calatrava 5196R",
    brand: "Patek Philippe",
    heroImage: "/images/watches/patek-calatrava-5196r.webp",
    images360: generate360Frames("patek-calatrava-5196r"),
    arModelGlb: "/models/patek-calatrava-5196r.glb",
    arModelUsdz: "/models/patek-calatrava-5196r.usdz",
    arEnabled: true,
    posterImage: "/images/posters/patek-calatrava-5196r-poster.webp",
  },
  {
    slug: "patek-calatrava-5227g",
    name: "Patek Philippe Calatrava 5227G",
    brand: "Patek Philippe",
    heroImage: "/images/watches/patek-calatrava-5227g.webp",
    images360: generate360Frames("patek-calatrava-5227g"),
    arModelGlb: "/models/patek-calatrava-5227g.glb",
    arModelUsdz: "/models/patek-calatrava-5227g.usdz",
    arEnabled: true,
    posterImage: "/images/posters/patek-calatrava-5227g-poster.webp",
  },
  {
    slug: "patek-calatrava-6119r",
    name: "Patek Philippe Calatrava 6119R",
    brand: "Patek Philippe",
    heroImage: "/images/watches/patek-calatrava-6119r.webp",
    images360: generate360Frames("patek-calatrava-6119r"),
    arModelGlb: "/models/patek-calatrava-6119r.glb",
    arModelUsdz: "/models/patek-calatrava-6119r.usdz",
    arEnabled: true,
    posterImage: "/images/posters/patek-calatrava-6119r-poster.webp",
  },
  {
    slug: "rolex-daytona-116500ln",
    name: "Rolex Daytona 116500LN",
    brand: "Rolex",
    heroImage: "/images/watches/rolex-daytona-116500ln.webp",
    images360: generate360Frames("rolex-daytona-116500ln"),
    arModelGlb: "/models/rolex-daytona-116500ln.glb",
    arModelUsdz: "/models/rolex-daytona-116500ln.usdz",
    arEnabled: true,
    posterImage: "/images/posters/rolex-daytona-116500ln-poster.webp",
  },
  {
    slug: "rolex-daytona-116508",
    name: "Rolex Daytona 116508",
    brand: "Rolex",
    heroImage: "/images/watches/rolex-daytona-116508.webp",
    images360: generate360Frames("rolex-daytona-116508"),
    arModelGlb: "/models/rolex-daytona-116508.glb",
    arModelUsdz: "/models/rolex-daytona-116508.usdz",
    arEnabled: true,
    posterImage: "/images/posters/rolex-daytona-116508-poster.webp",
  },
  {
    slug: "ap-royal-oak-15500st",
    name: "Audemars Piguet Royal Oak 15500ST",
    brand: "Audemars Piguet",
    heroImage: "/images/watches/ap-royal-oak-15500st.webp",
    images360: generate360Frames("ap-royal-oak-15500st"),
    arModelGlb: "/models/ap-royal-oak-15500st.glb",
    arModelUsdz: "/models/ap-royal-oak-15500st.usdz",
    arEnabled: true,
    posterImage: "/images/posters/ap-royal-oak-15500st-poster.webp",
  },
  {
    slug: "ap-royal-oak-15202st",
    name: "Audemars Piguet Royal Oak 15202ST",
    brand: "Audemars Piguet",
    heroImage: "/images/watches/ap-royal-oak-15202st.webp",
    images360: generate360Frames("ap-royal-oak-15202st"),
    arModelGlb: "/models/ap-royal-oak-15202st.glb",
    arModelUsdz: "/models/ap-royal-oak-15202st.usdz",
    arEnabled: true,
    posterImage: "/images/posters/ap-royal-oak-15202st-poster.webp",
  },
  {
    slug: "ap-royal-oak-15510st",
    name: "Audemars Piguet Royal Oak 15510ST",
    brand: "Audemars Piguet",
    heroImage: "/images/watches/ap-royal-oak-15510st.webp",
    images360: generate360Frames("ap-royal-oak-15510st"),
    arModelGlb: "/models/ap-royal-oak-15510st.glb",
    arModelUsdz: "/models/ap-royal-oak-15510st.usdz",
    arEnabled: true,
    posterImage: "/images/posters/ap-royal-oak-15510st-poster.webp",
  },
];

export function getWatchBySlug(slug: string): WatchAssets | undefined {
  return watchCatalog.find((w) => w.slug === slug);
}

export function getWatchesForPool(pool: string[]): WatchAssets[] {
  return pool
    .map((slug) => getWatchBySlug(slug))
    .filter((w): w is WatchAssets => w !== undefined);
}
