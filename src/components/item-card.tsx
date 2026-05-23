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
  availableFrom?: string | null;
  showAvailableBadge?: boolean;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });
}

function AvailabilityBadge({
  available,
  availableFrom,
  showAvailableBadge,
}: {
  available: boolean;
  availableFrom?: string | null;
  showAvailableBadge?: boolean;
}) {
  if (available && !showAvailableBadge) return null;

  let bg: string;
  let label: string;

  if (available) {
    bg = "bg-emerald-700/90";
    label = "Verfügbar";
  } else if (availableFrom) {
    bg = "bg-amber-600/90";
    label = `Gebucht bis ${formatDate(availableFrom)}`;
  } else {
    bg = "bg-stone-700/90";
    label = "Nicht verfügbar";
  }

  return (
    <span
      className={`absolute bottom-3 left-3 ${bg} text-white text-[10px] tracking-widest uppercase font-medium px-2.5 py-1 backdrop-blur-sm`}
      style={{ maxWidth: "calc(100% - 24px)" }}
    >
      {label}
    </span>
  );
}

export function ItemCard({
  item,
  isFavorited,
  averageRating,
  reviewCount,
  priority,
  availableFrom,
  showAvailableBadge,
}: ItemCardProps) {
  const image0 = item.images[0] ?? null;
  const image1 = item.images.length >= 2 ? item.images[1] : null;

  return (
    <Link
      href={`/catalog/${item.slug}`}
      className="group block bg-white border border-stone-200 hover:border-stone-400 transition-colors active:opacity-80"
    >
      <div className="aspect-square bg-stone-100 overflow-hidden relative">
        {image0 ? (
          <>
            <Image
              src={image0}
              alt={item.name}
              fill
              priority={priority}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {image1 && (
              <Image
                src={image1}
                alt=""
                fill
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                aria-hidden="true"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-500">
            <span className="text-xs tracking-widest uppercase">No image</span>
          </div>
        )}

        <AvailabilityBadge
          available={item.available}
          availableFrom={availableFrom}
          showAvailableBadge={showAvailableBadge}
        />

        {isFavorited !== undefined && (
          <div className="absolute top-3 right-3 bg-white/90 rounded-full shadow-sm">
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
        <div className="flex items-baseline gap-3">
          {item.weeklyRate ? (
            <>
              <span className="text-sm text-stone-900">
                {formatPrice(item.weeklyRate)}
                <span className="text-xs text-stone-600 ml-1">/ Woche</span>
              </span>
              <span className="text-xs text-stone-500">
                {formatPrice(item.dailyRate)} / Tag
              </span>
            </>
          ) : (
            <span className="text-sm text-stone-900">
              {formatPrice(item.dailyRate)}
              <span className="text-xs text-stone-600 ml-1">/ Tag</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
