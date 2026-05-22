"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type WatchStyle = "sports" | "dress" | "casual" | "mixed";
type OccasionFocus = "business" | "social_events" | "everyday" | "special_occasions";
type CaseSizePreference = "size_36_38" | "size_39_41" | "size_42_plus" | "no_preference";

const BRANDS = ["Rolex", "Patek Philippe", "IWC", "Breitling", "Omega", "TAG Heuer", "Nomos", "A. Lange & Söhne", "Jaeger-LeCoultre", "Cartier"];

const STYLE_OPTIONS: { value: WatchStyle; label: string; description: string }[] = [
  { value: "dress", label: "Dress", description: "Elegant, slim dials for formal occasions" },
  { value: "sports", label: "Sports", description: "Bold, robust — diver, pilot, or chronograph" },
  { value: "casual", label: "Casual", description: "Versatile, everyday comfort" },
  { value: "mixed", label: "Mixed", description: "I appreciate variety across styles" },
];

const OCCASION_OPTIONS: { value: OccasionFocus; label: string }[] = [
  { value: "business", label: "Business & Professional" },
  { value: "social_events", label: "Social Events & Galas" },
  { value: "everyday", label: "Everyday Wear" },
  { value: "special_occasions", label: "Weddings & Special Occasions" },
];

const SIZE_OPTIONS: { value: CaseSizePreference; label: string }[] = [
  { value: "size_36_38", label: "36–38mm — refined, understated" },
  { value: "size_39_41", label: "39–41mm — the classic sweet spot" },
  { value: "size_42_plus", label: "42mm+ — bold presence" },
  { value: "no_preference", label: "No preference — surprise me" },
];

export default function OnboardingQuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [watchStyle, setWatchStyle] = useState<WatchStyle | null>(null);
  const [occasionFocus, setOccasionFocus] = useState<OccasionFocus | null>(null);
  const [caseSizePreference, setCaseSizePreference] = useState<CaseSizePreference | null>(null);
  const [familiarBrands, setFamiliarBrands] = useState<string[]>([]);
  const [firstOccasion, setFirstOccasion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = 5;

  function toggleBrand(brand: string) {
    setFamiliarBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }

  async function handleSubmit() {
    if (!watchStyle || !occasionFocus || !caseSizePreference) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watchStyle, occasionFocus, caseSizePreference, familiarBrands, firstOccasion: firstOccasion || undefined }),
      });

      if (!res.ok) throw new Error("Failed to save preferences");
      router.push("/onboarding/selection");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-widest font-light uppercase">Marlo</Link>
          <span className="text-xs text-stone-400 tracking-widest uppercase">
            Step {step} of {totalSteps}
          </span>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="h-0.5 bg-stone-200">
        <div
          className="h-full bg-stone-900 transition-all duration-500"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <main className="max-w-2xl mx-auto px-4 py-16">
        {step === 1 && (
          <div>
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">Your Style</p>
            <h1 className="text-3xl font-light tracking-wide mb-3">
              What kind of watch speaks to you?
            </h1>
            <p className="text-stone-500 mb-10">This helps us curate your first selection.</p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setWatchStyle(opt.value)}
                  className={`text-left p-6 border transition-all ${
                    watchStyle === opt.value
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white hover:border-stone-400"
                  }`}
                >
                  <p className="font-medium mb-1 tracking-wide">{opt.label}</p>
                  <p className={`text-sm ${watchStyle === opt.value ? "text-stone-300" : "text-stone-500"}`}>
                    {opt.description}
                  </p>
                </button>
              ))}
            </div>

            <button
              disabled={!watchStyle}
              onClick={() => setStep(2)}
              className="w-full py-3 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">Occasion</p>
            <h1 className="text-3xl font-light tracking-wide mb-3">
              When will you be wearing it?
            </h1>
            <p className="text-stone-500 mb-10">We match watches to the moment.</p>

            <div className="space-y-3 mb-10">
              {OCCASION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setOccasionFocus(opt.value)}
                  className={`w-full text-left px-6 py-4 border transition-all ${
                    occasionFocus === opt.value
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white hover:border-stone-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-stone-300 text-stone-600 text-sm tracking-widest uppercase hover:border-stone-500 transition-colors">
                Back
              </button>
              <button
                disabled={!occasionFocus}
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">Case Size</p>
            <h1 className="text-3xl font-light tracking-wide mb-3">
              How do you wear your watches?
            </h1>
            <p className="text-stone-500 mb-10">Case diameter affects how a watch sits on the wrist.</p>

            <div className="space-y-3 mb-10">
              {SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCaseSizePreference(opt.value)}
                  className={`w-full text-left px-6 py-4 border transition-all ${
                    caseSizePreference === opt.value
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white hover:border-stone-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-3 border border-stone-300 text-stone-600 text-sm tracking-widest uppercase hover:border-stone-500 transition-colors">
                Back
              </button>
              <button
                disabled={!caseSizePreference}
                onClick={() => setStep(4)}
                className="flex-1 py-3 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">Brand Familiarity</p>
            <h1 className="text-3xl font-light tracking-wide mb-3">
              Which maisons are you already familiar with?
            </h1>
            <p className="text-stone-500 mb-10">Select any you know — we'll introduce you to new ones too.</p>

            <div className="flex flex-wrap gap-3 mb-10">
              {BRANDS.map((brand) => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`px-4 py-2 border text-sm transition-all ${
                    familiarBrands.includes(brand)
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white hover:border-stone-400"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="px-6 py-3 border border-stone-300 text-stone-600 text-sm tracking-widest uppercase hover:border-stone-500 transition-colors">
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex-1 py-3 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">Your Occasion</p>
            <h1 className="text-3xl font-light tracking-wide mb-3">
              Tell us about your first rental.
            </h1>
            <p className="text-stone-500 mb-10">
              Optional — but it helps us find exactly the right watch for you.
            </p>

            <textarea
              value={firstOccasion}
              onChange={(e) => setFirstOccasion(e.target.value)}
              placeholder="e.g. A wedding in September, a business trip to Vienna, a milestone birthday..."
              maxLength={500}
              rows={4}
              className="w-full border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-stone-400 resize-none mb-2"
            />
            <p className="text-xs text-stone-400 text-right mb-10">{firstOccasion.length}/500</p>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => setStep(4)} className="px-6 py-3 border border-stone-300 text-stone-600 text-sm tracking-widest uppercase hover:border-stone-500 transition-colors">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors disabled:opacity-60"
              >
                {submitting ? "Saving..." : "See My Recommendations →"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
