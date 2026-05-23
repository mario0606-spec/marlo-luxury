"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Watch {
  id: string;
  name: string;
  brand: string;
  slug: string;
  images: string[];
  brandNote: string;
  matchReason: string;
}

interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
}

const BLANK_ADDRESS: ShippingAddress = {
  fullName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  country: "",
};

const COUNTRIES = [
  "Germany",
  "Austria",
  "Switzerland",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Luxembourg",
  "United Kingdom",
  "Denmark",
  "Sweden",
  "Norway",
  "Finland",
  "Ireland",
  "Portugal",
  "Poland",
  "Czech Republic",
];

export function SelectionClient({ watches }: { watches: Watch[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "address">("select");
  const [address, setAddress] = useState<ShippingAddress>(BLANK_ADDRESS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedWatch = watches.find((w) => w.id === selected);

  function handleAddressChange(field: keyof ShippingAddress, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  const addressComplete =
    address.fullName &&
    address.addressLine1 &&
    address.city &&
    address.postalCode &&
    address.country;

  async function handleConfirm() {
    if (!selected || !addressComplete) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subscriptions/first-rental", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: selected, shippingAddress: address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to confirm selection");
      router.push(`/onboarding/confirmation/${data.rentalId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (watches.length === 0) {
    return (
      <div className="bg-white border border-stone-200 p-10 text-center">
        <p className="text-xs tracking-widest uppercase text-stone-500 mb-3">
          Curated for you
        </p>
        <h2 className="text-2xl font-light text-stone-900 mb-4">
          We&rsquo;re hand-selecting your pieces.
        </h2>
        <p className="text-stone-500 leading-relaxed mb-8 max-w-md mx-auto">
          Our concierge is curating a selection that fits your taste exactly.
          You&rsquo;ll receive an email within 48 hours with three pieces
          chosen for you.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-8 py-4 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors"
        >
          Return to dashboard
        </Link>
      </div>
    );
  }

  if (step === "address" && selectedWatch) {
    return (
      <div>
        <div className="bg-white border border-stone-200 p-6 mb-8 flex gap-5">
          {selectedWatch.images[0] && (
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={selectedWatch.images[0]}
                alt={selectedWatch.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-xs tracking-widest uppercase text-stone-500 mb-1">Your selection</p>
            <p className="text-lg font-light text-stone-900">{selectedWatch.brand}</p>
            <p className="text-stone-700">{selectedWatch.name}</p>
          </div>
          <button
            onClick={() => setStep("select")}
            className="ml-auto text-xs tracking-widest uppercase text-stone-400 hover:text-stone-900 self-start"
          >
            Change
          </button>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-light tracking-wide mb-6">Delivery address</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input
                type="text"
                className="input-field"
                value={address.fullName}
                onChange={(e) => handleAddressChange("fullName", e.target.value)}
                placeholder="As it appears on your ID"
              />
            </div>
            <div>
              <label className="label">Address line 1</label>
              <input
                type="text"
                className="input-field"
                value={address.addressLine1}
                onChange={(e) => handleAddressChange("addressLine1", e.target.value)}
                placeholder="Street address"
              />
            </div>
            <div>
              <label className="label">Address line 2 (optional)</label>
              <input
                type="text"
                className="input-field"
                value={address.addressLine2}
                onChange={(e) => handleAddressChange("addressLine2", e.target.value)}
                placeholder="Apartment, suite, floor"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <input
                  type="text"
                  className="input-field"
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                />
              </div>
              <div>
                <label className="label">Postal code</label>
                <input
                  type="text"
                  className="input-field"
                  value={address.postalCode}
                  onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label">Country</label>
              <select
                className="input-field"
                value={address.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
              >
                <option value="">Select a country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          onClick={handleConfirm}
          disabled={!addressComplete || loading}
          className="btn-primary w-full py-4 min-h-[48px] disabled:opacity-40"
        >
          {loading ? "Confirming…" : "Confirm my first watch →"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 mb-10">
        {watches.map((watch) => (
          <button
            key={watch.id}
            type="button"
            onClick={() => setSelected(watch.id)}
            className={`w-full text-left flex gap-5 p-6 min-h-[120px] border transition-all ${
              selected === watch.id
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white hover:border-stone-400"
            }`}
          >
            {watch.images[0] && (
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={watch.images[0]}
                  alt={watch.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <p
                className={`text-xs tracking-widest uppercase mb-1 ${
                  selected === watch.id ? "text-gold-400" : "text-stone-500"
                }`}
              >
                {watch.brand}
              </p>
              <p
                className={`text-lg font-light mb-2 ${
                  selected === watch.id ? "text-white" : "text-stone-900"
                }`}
              >
                {watch.name}
              </p>
              <p
                className={`text-xs italic mb-3 ${
                  selected === watch.id ? "text-gold-400" : "text-stone-600"
                }`}
              >
                {watch.matchReason}
              </p>
              <p
                className={`text-sm leading-relaxed ${
                  selected === watch.id ? "text-stone-300" : "text-stone-500"
                }`}
                dangerouslySetInnerHTML={{ __html: watch.brandNote }}
              />
            </div>
            {selected === watch.id && (
              <div className="flex-shrink-0 self-center">
                <div className="w-5 h-5 border-2 border-gold-400 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gold-400" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        disabled={!selected}
        onClick={() => setStep("address")}
        className="btn-primary w-full py-4 min-h-[48px] disabled:opacity-40"
      >
        {selected ? "Continue to delivery →" : "Select a watch to continue"}
      </button>
    </div>
  );
}
