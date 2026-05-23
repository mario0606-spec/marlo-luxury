import Link from "next/link";
import { BASE_URL } from "@/lib/seo";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const ldItems = items.map((item, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    name: item.name,
    item: `${BASE_URL}${item.href}`,
  }));

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: ldItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <nav aria-label="Breadcrumb" className="px-6 py-3 text-xs text-marlo-dark/50">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < items.length - 1 ? (
                <Link href={item.href} className="hover:text-marlo-gold transition-colors">
                  {item.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-marlo-dark/70">
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
