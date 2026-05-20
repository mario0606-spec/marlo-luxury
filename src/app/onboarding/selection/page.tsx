"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface WatchItem {
  id: string;
  name: string;
  brand: string;
  description: string;
  images: string[];
  monthlyRate: number | null;
  dailyRate: number;
  depositAmount: number;
  metadata: Record<string, unknown> | null;
}

interface Preferences {
  watchStyle: string | null;
  occasionFocus: string | null;
}

const OCCASION_LABELS: Record<string, string> = {
  business: "Business & Professional",
  social_events: "Social Events",
  everyday: "Everyday Elegance",
  special_occasions: "Special Occasions",
};

const STYLE_NOTES: Record<string, string> = {
  Rolex: "The benchmark — worn by heads of state and athletes alike.",
  "Patek Philippe": "Heirlooms in waiting. Timekeeping at its most poetic.",
  IWC: "Engineering meets elegance. Pilot heritage, boardroom finish.",
  Breitling: "Built for cockpits, worn at galas. The aviator's first choice.",
  Omega: "From the moon landings to the deep sea. Quietly extraordinary.",
  "TAG Heuer": "The racing driver's wrist companion. Precision above all.",
  Nomos: "Bauhaus clarity. German craft at its most considered.",
  "A. Lange & Söhne": "Saxon gold and generations of mastery.",
  "Jaeger-LeCoultre": "Complications you can feel. Watchmaking as fine art.",
  Cartier: "Where jewellery meets time. Wrist art for the discerning.",
};

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export default function OnboardingSelectionPage() {
  const router = useRouter();
  const [items, setItems] = useState<WatchItem[]>([]);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "DE",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/onboarding/recommendations")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.recommendations ?? []);
        setPreferences(data.preferences ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleConfirm() {
    if (!selected) return;
    if (!showAddressForm) {
      setShowAddressForm(true);
      return;
    }

    if (!address.fullName || !address.addressLine1 || !address.city || !address.postalCode) {
      setError("Please fill in all required address fields.");
      return;
    }

    setConfirming(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding/confirm-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: selected, shippingAddress: address }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to confirm selection");
      }

      const data = await res.json();
      router.push(`/onboarding/confirmation/${data.rental.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-400 tracking-widest text-sm uppercase">Curating your selection…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-widest font-light uppercase">Marlo</Link>
          <Link href="/onboarding/quiz" className="text-xs text-stone-400 tracking-widest uppercase hover:text-stone-700">
            ← Retake Quiz
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12">
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">Your Curated Selection</p>
          <h1 className="text-3xl font-light tracking-wide mb-3">
            We found{" "}
            {preferences?.occasionFocus ? (
              <span className="text-stone-500">{OCCASION_LABELS[preferences.occasionFocus] ?? preferences.occasionFocus}</span>
            ) : "the right watches"}{" "}
            for you.
          </h1>
          <p className="text-stone-500">
            Select the watch you'd like for your first delivery. You can change your selection before we ship.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-500 mb-6">We're adding new pieces to the collection. Our concierge will be in touch.</p>
            <Link href="/catalog" className="text-sm tracking-widest uppercase underline">Browse Full Catalog</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => { setSelected(item.id); setShowAddressForm(false); }}
                className={`text-left border transition-all ${
                  selected === item.id
                    ? "border-stone-900 ring-1 ring-stone-900"
                    : "border-stone-200 hover:border-stone-400"
                } bg-white`}
              >
                {/* Watch image */}
                <div className="aspect-square bg-stone-100 relative overflow-hidden">
                  {item.images[0] ? (
                    <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-stone-300 text-xs tracking-widest uppercase">No image</span>
                    </div>
                  )}
                  {index === 0 && (
                    <div className="absolute top-3 left-3 bg-stone-900 text-white text-xs px-2 py-1 tracking-widest uppercase">
                      Top Pick
                    </div>
                  )}
                  {selected === item.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-stone-900 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-xs tracking-widest uppercase text-stone-500 mb-1">{item.brand}</p>
                  <h3 className="text-lg font-light mb-3">{item.name}</h3>

                  {STYLE_NOTES[item.brand] && (
                    <p className="text-xs text-stone-500 italic mb-4 leading-relaxed">
                      "{STYLE_NOTES[item.brand]}"
                    </p>
                  )}

                  <div className="border-t border-stone-100 pt-4 flex justify-between items-baseline">
                    <span className="text-xs text-stone-400 tracking-wide">Monthly rate</span>
                    <span className="text-stone-900 font-medium">
                      {formatEur(item.monthlyRate ?? item.dailyRate * 30)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Address form */}
        {showAddressForm && selected && (
          <div className="bg-white border border-stone-200 p-8 mb-8 max-w-xl">
            <h2 className="text-lg font-light tracking-wide mb-6">Delivery Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-1">Full Name *</label>
                <input
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-1">Address *</label>
                <input
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  placeholder="Street and number"
                  className="w-full border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400 mb-2"
                />
                <input
                  value={address.addressLine2}
                  onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                  placeholder="Apartment, suite, etc. (optional)"
                  className="w-full border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-500 mb-1">Postal Code *</label>
                  <input
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-500 mb-1">City *</label>
                  <input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone-500 mb-1">Country</label>
                <select
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="w-full border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400 bg-white"
                >
                  <option value="DE">Germany</option>
                  <option value="AT">Austria</option>
                  <option value="CH">Switzerland</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {items.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <button
              disabled={!selected || confirming}
              onClick={handleConfirm}
              className="px-10 py-4 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {confirming
                ? "Confirming…"
                : showAddressForm
                ? "Confirm My First Watch →"
                : "Select This Watch →"}
            </button>
            <Link
              href="/catalog"
              className="px-6 py-4 border border-stone-300 text-stone-600 text-sm tracking-widest uppercase hover:border-stone-500 transition-colors"
            >
              Browse Full Catalog
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
