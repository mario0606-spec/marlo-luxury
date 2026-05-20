import Link from "next/link";
import Image from "next/image";
import { FavoriteButton } from "@/components/favorite-button";

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
  };
  isFavorited?: boolean;
  averageRating?: number | null;
  reviewCount?: number;
  priority?: boolean;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function ItemCard({ item, isFavorited, averageRating, reviewCount, priority }: ItemCardProps) {
  const image = item.images[0] ?? null;

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
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-500">
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
        {isFavorited !== undefined && (
          <div className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 shadow-sm">
            <FavoriteButton itemId={item.id} initialFavorited={isFavorited} size="sm" />
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs tracking-widest uppercase text-stone-600 mb-1">
          {item.brand}
        </p>
        <h3 className="text-sm font-medium text-stone-900 leading-snug mb-1 line-clamp-2">
          {item.name}
        </h3>
        {averageRating !== null && averageRating !== undefined && reviewCount ? (
          <p className="text-xs text-amber-500 mb-2">
            ★ {averageRating.toFixed(1)}
            <span className="text-stone-400 ml-1">({reviewCount})</span>
          </p>
        ) : (
          <div className="mb-3" />
        )}
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-stone-900">
            {formatPrice(item.dailyRate)}
            <span className="text-xs text-stone-600 ml-1">/ day</span>
          </span>
          {item.weeklyRate && (
            <span className="text-xs text-stone-600">
              {formatPrice(item.weeklyRate)} / week
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
