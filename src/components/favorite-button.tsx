"use client";

import { useState, useTransition } from "react";

interface FavoriteButtonProps {
  itemId: string;
  initialFavorited: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({
  itemId,
  initialFavorited,
  className = "",
  size = "md",
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [popping, setPopping] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const method = favorited ? "DELETE" : "POST";
      const res = await fetch(`/api/favorites/${itemId}`, { method });
      if (res.ok) {
        const adding = !favorited;
        setFavorited(adding);
        if (adding) {
          setPopping(true);
          setTimeout(() => setPopping(false), 250);
        }
      }
    });
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      disabled={isPending}
      aria-label={favorited ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
      className={`flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full transition-colors ${
        favorited
          ? "text-rose-500 hover:text-rose-600"
          : "text-stone-300 hover:text-rose-400"
      } disabled:opacity-50 active:scale-90 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={favorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={favorited ? 0 : 1.5}
        className={`${iconSize} transition-transform duration-200 ${popping ? "scale-125" : "scale-100"}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
