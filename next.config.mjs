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
    return lookbookSlugs.map((slug) => ({
      source: `/stories/${slug}`,
      destination: `/de/stories/${slug}`,
      permanent: true,
    }));
  },
};
export default nextConfig;
