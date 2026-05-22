"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Item {
  id: string;
  name: string;
  brand: string;
  slug: string;
  images: string[];
  dailyRate: number;
  weeklyRate: number | null;
  monthlyRate: number | null;
  depositAmount: number;
  referenceNumber: string | null;
}

interface BookingFormProps {
  item: Item;
  bookedRanges: { start: string; end: string }[];
}

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function calcTotal(item: Item, days: number): number {
  if (item.monthlyRate && days >= 28) {
    const months = Math.floor(days / 30);
    const remainder = days % 30;
    return months * item.monthlyRate + remainder * item.dailyRate;
  }
  if (item.weeklyRate && days >= 7) {
    const weeks = Math.floor(days / 7);
    const remainder = days % 7;
    return weeks * item.weeklyRate + remainder * item.dailyRate;
  }
  return days * item.dailyRate;
}

function isDateBooked(dateStr: string, ranges: { start: string; end: string }[]): boolean {
  return ranges.some((r) => dateStr >= r.start && dateStr <= r.end);
}

const TODAY = new Date().toISOString().split("T")[0];

export function BookingForm({ item, bookedRanges }: BookingFormProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [step, setStep] = useState<"dates" | "address" | "review">("dates");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const days = startDate && endDate
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const rentalTotal = days > 0 ? calcTotal(item, days) : 0;
  const grandTotal = rentalTotal + item.depositAmount;

  useEffect(() => {
    if (startDate && endDate && endDate <= startDate) {
      setEndDate("");
    }
  }, [startDate, endDate]);

  function hasOverlap(): boolean {
    if (!startDate || !endDate) return false;
    const s = new Date(startDate);
    const e = new Date(endDate);
    return bookedRanges.some((r) => {
      const rs = new Date(r.start);
      const re = new Date(r.end);
      return s < re && e > rs;
    });
  }

  function validateDates(): string {
    if (!startDate || !endDate) return "Please select both start and end dates.";
    if (days < 1) return "End date must be after start date.";
    if (hasOverlap()) return "Selected dates overlap with an existing booking. Please choose different dates.";
    return "";
  }

  function validateAddress(): string {
    if (!address.fullName.trim()) return "Full name is required.";
    if (!address.addressLine1.trim()) return "Address is required.";
    if (!address.city.trim()) return "City is required.";
    if (!address.postalCode.trim()) return "Postal code is required.";
    if (!address.country.trim()) return "Country is required.";
    return "";
  }

  function handleDateNext() {
    const err = validateDates();
    if (err) { setError(err); return; }
    setError("");
    setStep("address");
  }

  function handleAddressNext() {
    const err = validateAddress();
    if (err) { setError(err); return; }
    setError("");
    setStep("review");
  }

  async function handleSubmit() {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          startDate,
          endDate,
          shippingAddress: {
            fullName: address.fullName,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || undefined,
            city: address.city,
            postalCode: address.postalCode,
            country: address.country,
            phone: address.phone || undefined,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Booking failed. Please try again.");
        return;
      }

      router.push(`/rentals/${data.rentalId}/confirmation`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepLabels = ["Select Dates", "Delivery Address", "Confirm Booking"];
  const stepIndex = step === "dates" ? 0 : step === "address" ? 1 : 2;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="border-b border-stone-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-widest font-light uppercase">marianni</Link>
          <Link href={`/catalog/${item.slug}`} className="text-sm tracking-wider text-stone-500 hover:text-stone-900">
            ← Back to {item.name}
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="flex items-center gap-0 mb-10">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                  ${i < stepIndex ? "bg-stone-900 text-white" :
                    i === stepIndex ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-400"}`}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span className={`text-xs tracking-widest uppercase ${i === stepIndex ? "text-stone-900" : "text-stone-400"}`}>
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`flex-1 h-px mx-4 ${i < stepIndex ? "bg-stone-900" : "bg-stone-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form area */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Dates */}
            {step === "dates" && (
              <div className="bg-white border border-stone-200 p-8">
                <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-6">Rental Period</h2>

                {bookedRanges.length > 0 && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-xs text-amber-700">
                    <p className="font-medium mb-1 tracking-widest uppercase">Already Booked</p>
                    {bookedRanges.map((r, i) => (
                      <p key={i}>{r.start} — {r.end}</p>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="label">Start Date</label>
                    <input
                      type="date"
                      min={TODAY}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">End Date</label>
                    <input
                      type="date"
                      min={startDate || TODAY}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input-field"
                      disabled={!startDate}
                    />
                  </div>
                </div>

                {days > 0 && (
                  <p className="text-sm text-stone-500 mb-6">
                    {days} day{days !== 1 ? "s" : ""} selected — rental total {formatEur(rentalTotal)}
                  </p>
                )}

                <button onClick={handleDateNext} className="btn-primary w-full">
                  Continue to Delivery Address
                </button>
              </div>
            )}

            {/* Step 2: Address */}
            {step === "address" && (
              <div className="bg-white border border-stone-200 p-8">
                <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-6">Delivery Address</h2>

                <div className="space-y-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))}
                      placeholder="Jane Smith"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Address Line 1 *</label>
                    <input
                      type="text"
                      value={address.addressLine1}
                      onChange={(e) => setAddress((a) => ({ ...a, addressLine1: e.target.value }))}
                      placeholder="123 Rue du Faubourg"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Address Line 2</label>
                    <input
                      type="text"
                      value={address.addressLine2}
                      onChange={(e) => setAddress((a) => ({ ...a, addressLine2: e.target.value }))}
                      placeholder="Apartment, suite, etc."
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">City *</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                        placeholder="Paris"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">Postal Code *</label>
                      <input
                        type="text"
                        value={address.postalCode}
                        onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
                        placeholder="75001"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Country *</label>
                    <input
                      type="text"
                      value={address.country}
                      onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                      placeholder="France"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Phone (optional)</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                      placeholder="+33 6 12 34 56 78"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => { setError(""); setStep("dates"); }} className="btn-outline flex-1">
                    ← Back
                  </button>
                  <button onClick={handleAddressNext} className="btn-primary flex-1">
                    Review Booking
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review + Confirm */}
            {step === "review" && (
              <div className="bg-white border border-stone-200 p-8">
                <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-6">Review & Confirm</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs tracking-widest uppercase text-stone-400 mb-3">Rental Period</h3>
                    <p className="text-sm text-stone-700">
                      {startDate} — {endDate} ({days} day{days !== 1 ? "s" : ""})
                    </p>
                    <button
                      onClick={() => { setError(""); setStep("dates"); }}
                      className="text-xs text-stone-400 hover:text-stone-600 underline mt-1"
                    >
                      Edit
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xs tracking-widest uppercase text-stone-400 mb-3">Delivery Address</h3>
                    <p className="text-sm text-stone-700">
                      {address.fullName}<br />
                      {address.addressLine1}
                      {address.addressLine2 && <><br />{address.addressLine2}</>}<br />
                      {address.postalCode} {address.city}<br />
                      {address.country}
                      {address.phone && <><br />{address.phone}</>}
                    </p>
                    <button
                      onClick={() => { setError(""); setStep("address"); }}
                      className="text-xs text-stone-400 hover:text-stone-600 underline mt-1"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="border-t border-stone-100 pt-4 text-xs text-stone-400 leading-relaxed">
                    By confirming, you agree to our rental terms. Payment is due within 24 hours to secure
                    your booking. The refundable deposit will be returned within 5 business days after the item
                    is returned in its original condition.
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => { setError(""); setStep("address"); }} className="btn-outline flex-1">
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary flex-1"
                  >
                    {submitting ? "Confirming…" : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: order summary */}
          <div className="space-y-4">
            <div className="bg-white border border-stone-200 p-6 sticky top-20">
              {item.images[0] && (
                <div className="aspect-square relative mb-4 overflow-hidden">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
              )}
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">{item.brand}</p>
              <p className="text-base font-light text-stone-900 mb-1">{item.name}</p>
              {item.referenceNumber && (
                <p className="text-xs text-stone-400 mb-4">Ref. {item.referenceNumber}</p>
              )}

              <div className="border-t border-stone-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Daily rate</span>
                  <span>{formatEur(item.dailyRate)}</span>
                </div>
                {item.weeklyRate && (
                  <div className="flex justify-between text-stone-500 text-xs">
                    <span>7+ days</span>
                    <span>{formatEur(item.weeklyRate)}/wk</span>
                  </div>
                )}
                {days > 0 && (
                  <>
                    <div className="flex justify-between text-stone-700">
                      <span>Rental ({days}d)</span>
                      <span>{formatEur(rentalTotal)}</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>Refundable deposit</span>
                      <span>{formatEur(item.depositAmount)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-stone-900 border-t border-stone-100 pt-2 mt-2">
                      <span>Total due</span>
                      <span>{formatEur(grandTotal)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
