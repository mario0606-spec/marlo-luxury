"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProgressIndicator } from "@/components/quiz/progress-indicator";
import { StepTransition } from "@/components/quiz/step-transition";

const WATCH_STYLES = [
  { value: "dress", label: "Dress", description: "Slim, refined — boardrooms and black tie" },
  { value: "sports", label: "Sports", description: "Robust, purposeful — built for movement" },
  { value: "casual", label: "Casual", description: "Versatile, everyday — effortlessly worn" },
  { value: "mixed", label: "Mixed", description: "All of the above — I rotate by occasion" },
] as const;

const OCCASION_FOCUSES = [
  { value: "business", label: "Business", description: "Meetings, travel, client dinners" },
  { value: "social_events", label: "Social Events", description: "Galas, weddings, private functions" },
  { value: "everyday", label: "Everyday", description: "Daily wear, relaxed settings" },
  { value: "special_occasions", label: "Special Occasions", description: "Milestones, gifts to self" },
] as const;

const CASE_SIZES = [
  { value: "36-38mm", label: "36–38mm", description: "Classic, understated" },
  { value: "39-41mm", label: "39–41mm", description: "Versatile, balanced" },
  { value: "42mm+", label: "42mm+", description: "Statement, bold" },
  { value: "no_preference", label: "No preference", description: "Surprise me" },
] as const;

const BRANDS = [
  "Rolex", "Patek Philippe", "IWC", "Breitling", "Omega",
  "TAG Heuer", "Nomos", "Jaeger-LeCoultre", "Vacheron Constantin", "Cartier",
];

type FormState = {
  watchStyle: string;
  occasionFocus: string;
  caseSizePreference: string;
  brandFamiliarity: string[];
  occasionNote: string;
};

const STEP_LABELS = ["Style", "Occasion", "Size", "Brands"];

export function QuizForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    watchStyle: "",
    occasionFocus: "",
    caseSizePreference: "",
    brandFamiliarity: [],
    occasionNote: "",
  });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill from existing preferences when editing
  useEffect(() => {
    if (!isEdit) return;
    fetch("/api/subscriptions/preferences")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setForm({
            watchStyle: data.watchStyle ?? "",
            occasionFocus: data.occasionFocus ?? "",
            caseSizePreference: data.caseSizePreference ?? "",
            brandFamiliarity: Array.isArray(data.brandFamiliarity) ? data.brandFamiliarity : [],
            occasionNote: data.occasionNote ?? "",
          });
        }
      })
      .catch(() => { /* non-blocking */ })
      .finally(() => setInitializing(false));
  }, [isEdit]);

  function toggleBrand(brand: string) {
    setForm((prev) => ({
      ...prev,
      brandFamiliarity: prev.brandFamiliarity.includes(brand)
        ? prev.brandFamiliarity.filter((b) => b !== brand)
        : [...prev.brandFamiliarity, brand],
    }));
  }

  function canAdvance(): boolean {
    if (step === 1) return Boolean(form.watchStyle);
    if (step === 2) return Boolean(form.occasionFocus);
    if (step === 3) return Boolean(form.caseSizePreference);
    return true;
  }

  function next() {
    if (!canAdvance()) return;
    if (step < 4) setStep(step + 1);
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  async function handleSubmit() {
    if (!form.watchStyle || !form.occasionFocus || !form.caseSizePreference) return;
    setLoading(true);
    setError(null);
    try {
      const url = isEdit
        ? "/api/subscriptions/preferences?edit=true"
        : "/api/subscriptions/preferences";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save preferences");
      router.push(isEdit ? "/dashboard/subscription" : "/onboarding/selection");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (initializing) {
    return (
      <div className="py-20 text-center text-sm tracking-widest uppercase text-stone-400">
        Loading your preferences…
      </div>
    );
  }

  return (
    <div>
      <ProgressIndicator
        current={step}
        total={4}
        label={`${STEP_LABELS[step - 1]} — Step ${step} of 4`}
      />

      <StepTransition stepKey={step}>
        {step === 1 && (
          <fieldset>
            <legend className="text-lg font-light text-stone-900 mb-1 block">
              What style speaks to you?
            </legend>
            <p className="text-sm text-stone-500 mb-6">
              Pick the one that best matches how you&rsquo;d wear it.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WATCH_STYLES.map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, watchStyle: value }))}
                  className={`text-left p-5 min-h-[88px] border transition-all ${
                    form.watchStyle === value
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white hover:border-stone-400"
                  }`}
                >
                  <p className={`font-light mb-1 ${form.watchStyle === value ? "text-white" : "text-stone-900"}`}>
                    {label}
                  </p>
                  <p className={`text-xs ${form.watchStyle === value ? "text-stone-300" : "text-stone-500"}`}>
                    {description}
                  </p>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="text-lg font-light text-stone-900 mb-1 block">
              Where will you wear it most?
            </legend>
            <p className="text-sm text-stone-500 mb-6">
              This shapes which pieces we put forward.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OCCASION_FOCUSES.map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, occasionFocus: value }))}
                  className={`text-left p-5 min-h-[88px] border transition-all ${
                    form.occasionFocus === value
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white hover:border-stone-400"
                  }`}
                >
                  <p className={`font-light mb-1 ${form.occasionFocus === value ? "text-white" : "text-stone-900"}`}>
                    {label}
                  </p>
                  <p className={`text-xs ${form.occasionFocus === value ? "text-stone-300" : "text-stone-500"}`}>
                    {description}
                  </p>
                </button>
              ))}
            </div>
            <div className="mt-8">
              <label className="text-xs tracking-widest uppercase text-stone-500 mb-2 block">
                A specific occasion in mind? (optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. My sister's wedding in Florence in July…"
                className="input-field resize-none text-sm"
                value={form.occasionNote}
                onChange={(e) => setForm((f) => ({ ...f, occasionNote: e.target.value }))}
                maxLength={500}
              />
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="text-lg font-light text-stone-900 mb-1 block">
              Case size preference
            </legend>
            <p className="text-sm text-stone-500 mb-6">
              We&rsquo;ll match pieces to your wrist.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CASE_SIZES.map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, caseSizePreference: value }))}
                  className={`text-left p-5 min-h-[88px] border transition-all ${
                    form.caseSizePreference === value
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white hover:border-stone-400"
                  }`}
                >
                  <p className={`font-light mb-1 ${form.caseSizePreference === value ? "text-white" : "text-stone-900"}`}>
                    {label}
                  </p>
                  <p className={`text-xs ${form.caseSizePreference === value ? "text-stone-300" : "text-stone-500"}`}>
                    {description}
                  </p>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset>
            <legend className="text-lg font-light text-stone-900 mb-1 block">
              Brands you already know
            </legend>
            <p className="text-sm text-stone-500 mb-6">
              Optional — helps us calibrate the introduction. Select any that apply.
            </p>
            <div className="flex flex-wrap gap-2">
              {BRANDS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => toggleBrand(brand)}
                  className={`px-4 py-3 min-h-[44px] text-sm border transition-all ${
                    form.brandFamiliarity.includes(brand)
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </fieldset>
        )}
      </StepTransition>

      {error && (
        <p className="text-red-600 text-sm mt-6">{error}</p>
      )}

      <div className="flex items-center gap-3 mt-10">
        {step > 1 && (
          <button
            type="button"
            onClick={back}
            disabled={loading}
            className="px-6 py-4 min-h-[48px] border border-stone-300 text-sm tracking-widest uppercase text-stone-600 hover:border-stone-500 transition-colors"
          >
            ← Back
          </button>
        )}
        {step < 4 ? (
          <button
            type="button"
            onClick={next}
            disabled={!canAdvance()}
            className="btn-primary flex-1 py-4 min-h-[48px] disabled:opacity-40"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary flex-1 py-4 min-h-[48px]"
          >
            {loading
              ? "Saving…"
              : isEdit
                ? "Save preferences"
                : "See my curated selection →"}
          </button>
        )}
      </div>
    </div>
  );
}
