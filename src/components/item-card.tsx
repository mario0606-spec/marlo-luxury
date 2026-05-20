import Link from "next/link";
import Image from "next/image";

interface ItemCardProps {
  item: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    category: string;
    dailyRate: number;
    weeklyRate: number | null;
    images: string[];
    available: boolean;
    avgRating?: number | null;
    reviewCount?: number;
  };
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function ItemCard({ item }: ItemCardProps) {
  const image = item.images[0] ?? null;
  const showRating = item.avgRating != null;

  return (
    <Link
      href={`/catalog/${item.slug}`}
      className="group block bg-white border border-stone-200 hover:border-stone-400 transition-colors"
    >
      <div className="aspect-square bg-stone-100 overflow-hidden relative">
        {image ? (
          <Image
            src={image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <span className="text-xs tracking-widest uppercase">No image</span>
          </div>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
            <span className="text-white text-xs tracking-widest uppercase">
              Unavailable
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">
          {item.brand}
        </p>
        <h3 className="text-sm font-medium text-stone-900 leading-snug mb-3 line-clamp-2">
          {item.name}
        </h3>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-stone-900">
            {formatPrice(item.dailyRate)}
            <span className="text-xs text-stone-400 ml-1">/ day</span>
          </span>
          {item.weeklyRate && (
            <span className="text-xs text-stone-400">
              {formatPrice(item.weeklyRate)} / week
            </span>
          )}
        </div>
        {showRating && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-sm text-stone-900">{item.avgRating!.toFixed(1)} ★</span>
            <span className="text-xs text-stone-400">({item.reviewCount})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
