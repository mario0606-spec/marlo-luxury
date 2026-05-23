import type { MetadataRoute } from "next";
import { occasionBundles } from "@/lib/bundles";
import { editorialStories } from "@/lib/stories";
import { cityLandings } from "@/lib/cities";

const BASE_URL = "https://www.marlo.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/de`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/de/bundles`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  const bundlePages: MetadataRoute.Sitemap = occasionBundles.map((b) => ({
    url: `${BASE_URL}/de/bundles/${b.bundleSlug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const storyPages: MetadataRoute.Sitemap = editorialStories.map((s) => ({
    url: `${BASE_URL}/de/stories/${s.id}`,
    lastModified: s.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const cityPages: MetadataRoute.Sitemap = cityLandings.map((c) => ({
    url: `${BASE_URL}/de/stadt/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...bundlePages, ...storyPages, ...cityPages];
}
