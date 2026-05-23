"use client";

import { useState, useEffect } from "react";
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
  country: "DE",
};

const TRIO_LABELS = ["Our top pick", "Also recommended", ""] as const;

export function SelectionClient({ watches }: { watches: Watch[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "address">("select");
  const [address, setAddress] = useState<ShippingAddress>(BLANK_ADDRESS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  const selectedWatch = watches.find((w) => w.id === selected);

  useEffect(() => {
    if (selected) {
      const t = setTimeout(() => setCtaVisible(true), 10);
      return () => clearTimeout(t);
    }
    setCtaVisible(false);
  }, [selected]);

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
        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="18" className="stroke-stone-900" />
          <path d="M24 14v10l6 4" className="stroke-stone-900" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 6v2M24 40v2M6 24h2M40 24h2" className="stroke-stone-300" strokeLinecap="round" />
        </svg>
        <h2 className="text-2xl font-light text-stone-900 mb-4">
          Our collection is being curated for you.
        </h2>
        <p className="text-stone-500 leading-relaxed mb-8 max-w-md mx-auto">
          Our concierge team will reach out within 24 hours to handpick your first timepiece personally.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/watches"
            className="inline-block px-8 py-4 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors"
          >
            Browse the full collection →
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-stone-500 underline text-center"
          >
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (step === "address" && selectedWatch) {
    return (
      <div>
        <div className="bg-white border border-stone-200 p-6 mb-8 flex gap-5">
          {selectedWatch.images[0] && (
            <div className="relative w-20 h-20 flex-shrink-0 bg-stone-50">
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
                <optgroup label="DACH">
                  <option value="DE">Germany</option>
                  <option value="AT">Austria</option>
                  <option value="CH">Switzerland</option>
                </optgroup>
                <optgroup label="Rest of Europe">
                  <option value="BE">Belgium</option>
                  <option value="CZ">Czech Republic</option>
                  <option value="DK">Denmark</option>
                  <option value="FI">Finland</option>
                  <option value="FR">France</option>
                  <option value="IE">Ireland</option>
                  <option value="IT">Italy</option>
                  <option value="LU">Luxembourg</option>
                  <option value="NL">Netherlands</option>
                  <option value="NO">Norway</option>
                  <option value="PL">Poland</option>
                  <option value="PT">Portugal</option>
                  <option value="ES">Spain</option>
                  <option value="SE">Sweden</option>
                  <option value="GB">United Kingdom</option>
                </optgroup>
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
        {watches.map((watch, index) => (
          <div key={watch.id}>
            {TRIO_LABELS[index] && (
              <p className={`text-xs tracking-widest uppercase mb-2 ${
                index === 0 ? "text-gold-600" : "text-stone-400"
              }`}>
                {TRIO_LABELS[index]}
              </p>
            )}
            <button
              type="button"
              onClick={() => setSelected(watch.id)}
              className={`w-full text-left flex gap-5 p-6 min-h-[120px] border transition-all ${
                selected === watch.id
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white hover:border-stone-400"
              }`}
            >
              {watch.images[0] && (
                <div className="relative w-24 h-24 flex-shrink-0 bg-stone-50">
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
                    selected === watch.id ? "text-stone-300" : "text-stone-500"
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
                <p className="text-xs text-stone-500 italic mb-2">
                  {watch.matchReason}
                </p>
                <p
                  className={`text-sm leading-relaxed ${
                    selected === watch.id ? "text-stone-300" : "text-stone-500"
                  }`}
                >
                  {watch.brandNote}
                </p>
              </div>
              {selected === watch.id && (
                <div className="flex-shrink-0 self-center">
                  <div className="w-5 h-5 border-2 border-gold-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gold-400" />
                  </div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {selected ? (
        <button
          onClick={() => setStep("address")}
          className={`btn-primary w-full py-4 min-h-[48px] transition-all duration-150 ${
            ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          }`}
        >
          Continue to delivery →
        </button>
      ) : (
        <div className="w-full py-4 min-h-[48px] bg-transparent border border-stone-200 text-stone-400 cursor-default text-sm tracking-widest uppercase text-center">
          Select a watch to continue
        </div>
      )}
    </div>
  );
}
