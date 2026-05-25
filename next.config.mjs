/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    const lookbookSlugs = [
      "die-hochzeit",
      "gala-charity-abend",
      "business-dinner",
      "wochenend-ausflug-genf-wien",
      "silvester",
      "geburtstag",
      "erstes-date",
      "sommerurlaub-mittelmeer",
      "kunst-kultur-vernissage",
      "vatertag",
    ];
    const bundleRedirects = [
      "/de/bundles/jubilaeum-30-tage-ap",
      "/de/bundles/jubilaeum-30-tage-ap/buchen",
      "/de/bundles/jubilaeum-30-tage-ap/bestaetigung",
    ].map((source) => ({
      source,
      destination: source.replace("jubilaeum-30-tage-ap", "jubilaeum-audemars-piguet"),
      permanent: true,
    }));

    return [
      ...lookbookSlugs.map((slug) => ({
        source: `/stories/${slug}`,
        destination: `/de/stories/${slug}`,
        permanent: true,
      })),
      ...bundleRedirects,
    ];
  },
};
export default nextConfig;
