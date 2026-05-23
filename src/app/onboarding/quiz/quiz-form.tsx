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

function StyleIcon({ value, selected }: { value: string; selected: boolean }) {
  const cls = `w-5 h-5 ${selected ? "text-stone-200" : "text-stone-400"}`;
  switch (value) {
    case "dress":
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <ellipse cx="10" cy="10" rx="4" ry="8" />
        </svg>
      );
    case "sports":
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M4 16 A8 8 0 0 1 16 4" strokeLinecap="round" />
          <path d="M10 2v3M18 10h-3" strokeLinecap="round" />
        </svg>
      );
    case "casual":
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="10" cy="10" r="7" />
        </svg>
      );
    case "mixed":
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="7" cy="7" r="1.5" fill="currentColor" />
          <circle cx="13" cy="7" r="1.5" fill="currentColor" />
          <circle cx="7" cy="13" r="1.5" fill="currentColor" />
          <circle cx="13" cy="13" r="1.5" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

function OccasionIcon({ value, selected }: { value: string; selected: boolean }) {
  const cls = `w-5 h-5 ${selected ? "text-stone-200" : "text-stone-400"}`;
  switch (value) {
    case "business":
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="7" width="14" height="10" rx="1" />
          <path d="M7 7V5a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case "social_events":
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M7 18l3-8 3 8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 10V7" strokeLinecap="round" />
          <circle cx="10" cy="5" r="2" />
        </svg>
      );
    case "everyday":
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M2 14h16" strokeLinecap="round" />
          <path d="M4 14c0-3 2.5-6 6-6s6 3 6 6" />
        </svg>
      );
    case "special_occasions":
      return (
        <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M10 2l3 6-3 6-3-6z" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function QuizForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
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
      .catch(() => {})
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
    if (step < 4) {
      setDirection("forward");
      setStep(step + 1);
    }
  }

  function back() {
    if (step > 1) {
      setDirection("back");
      setStep(step - 1);
    }
  }

  async function handleSubmit(overrides?: Partial<FormState>) {
    const payload = overrides ? { ...form, ...overrides } : form;
    if (!payload.watchStyle || !payload.occasionFocus || !payload.caseSizePreference) return;
    setLoading(true);
    setError(null);
    try {
      const url = isEdit
        ? "/api/subscriptions/preferences?edit=true"
        : "/api/subscriptions/preferences";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save preferences");

      if (isEdit) {
        router.push("/dashboard/subscription?toast=preferences-updated");
      } else {
        router.push("/onboarding/selection");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  function handleSkipStep4() {
    handleSubmit({ brandFamiliarity: [] });
  }

  if (initializing) {
    return (
      <div className="py-20 text-center text-sm tracking-widest uppercase text-stone-400">
        Preparing your selection…
      </div>
    );
  }

  return (
    <div>
      <ProgressIndicator current={step} total={4} onBack={back} />

      <StepTransition stepKey={step} direction={direction}>
        {step === 1 && (
          <fieldset>
            <legend className="text-lg font-light text-stone-900 mb-1 block">
              What style speaks to you?
            </legend>
            <p className="text-sm text-stone-500 mb-6">
              Pick the one that best matches how you&rsquo;d wear it.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WATCH_STYLES.map(({ value, label, description }) => {
                const sel = form.watchStyle === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, watchStyle: value }))}
                    className={`relative text-left p-5 min-h-[88px] border transition-all ${
                      sel
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white hover:border-stone-400"
                    }`}
                  >
                    {sel && <div className="absolute top-2 right-2 w-1 h-1 bg-gold-400" />}
                    <StyleIcon value={value} selected={sel} />
                    <p className={`font-light mb-1 mt-2 ${sel ? "text-white" : "text-stone-900"}`}>
                      {label}
                    </p>
                    <p className={`text-xs ${sel ? "text-stone-300" : "text-stone-500"}`}>
                      {description}
                    </p>
                  </button>
                );
              })}
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
              {OCCASION_FOCUSES.map(({ value, label, description }) => {
                const sel = form.occasionFocus === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, occasionFocus: value }))}
                    className={`relative text-left p-5 min-h-[88px] border transition-all ${
                      sel
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white hover:border-stone-400"
                    }`}
                  >
                    {sel && <div className="absolute top-2 right-2 w-1 h-1 bg-gold-400" />}
                    <OccasionIcon value={value} selected={sel} />
                    <p className={`font-light mb-1 mt-2 ${sel ? "text-white" : "text-stone-900"}`}>
                      {label}
                    </p>
                    <p className={`text-xs ${sel ? "text-stone-300" : "text-stone-500"}`}>
                      {description}
                    </p>
                  </button>
                );
              })}
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
              {CASE_SIZES.map(({ value, label, description }) => {
                const sel = form.caseSizePreference === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, caseSizePreference: value }))}
                    className={`relative text-left p-5 min-h-[88px] border transition-all ${
                      sel
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white hover:border-stone-400"
                    }`}
                  >
                    {sel && <div className="absolute top-2 right-2 w-1 h-1 bg-gold-400" />}
                    <p className={`font-light mb-1 ${sel ? "text-white" : "text-stone-900"}`}>
                      {label}
                    </p>
                    <p className={`text-xs ${sel ? "text-stone-300" : "text-stone-500"}`}>
                      {description}
                    </p>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset>
            <legend className="text-lg font-light text-stone-900 mb-1 block">
              Brands you already know
            </legend>
            <p className="text-xs text-stone-400 mb-6">
              Optional — skip if you prefer
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {BRANDS.map((brand) => {
                const sel = form.brandFamiliarity.includes(brand);
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => toggleBrand(brand)}
                    className={`relative min-h-[44px] px-5 py-2 text-sm border transition-all ${
                      sel
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    {sel && <div className="absolute top-2 right-2 w-1 h-1 bg-gold-400" />}
                    {brand}
                  </button>
                );
              })}
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
      </StepTransition>

      {error && (
        <p className="text-red-600 text-sm mt-6">{error}</p>
      )}

      <div className="flex flex-col items-center gap-3 mt-10">
        <div className="flex items-center gap-3 w-full">
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
              onClick={() => handleSubmit()}
              disabled={loading}
              className="btn-primary flex-1 py-4 min-h-[48px]"
            >
              {loading
                ? "Saving your preferences…"
                : isEdit
                  ? "Update my preferences →"
                  : "Finish & see my selection →"}
            </button>
          )}
        </div>
        {step === 4 && !loading && (
          <button
            type="button"
            onClick={handleSkipStep4}
            className="text-xs text-stone-400 underline"
          >
            Skip this step →
          </button>
        )}
      </div>
    </div>
  );
}
