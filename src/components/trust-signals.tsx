import Link from "next/link";

interface AuthenticityData {
  serialNumber: string;
  watchmaker: string;
  authenticatedBy: string;
  hasVideo: boolean;
  hasNfc: boolean;
}

interface TrustSignalsProps {
  condition: string | null;
  authenticity?: AuthenticityData | null;
}

const CONDITION_META: Record<string, { label: string; dots: number; helper: string }> = {
  MINT: { label: "Mint condition", dots: 3, helper: "As-new, unworn or display piece" },
  VERY_GOOD: { label: "Very good condition", dots: 2, helper: "Light, even wear consistent with careful use" },
  GOOD: { label: "Good condition", dots: 1, helper: "Visible signs of wear, fully functional" },
};

export function TrustSignals({ condition, authenticity }: TrustSignalsProps) {
  const meta = condition ? CONDITION_META[condition] : null;

  return (
    <div className="border border-stone-200 bg-white">
      {/* Condition badge */}
      {meta && (
        <div className="flex items-start gap-4 px-6 py-4 border-b border-stone-100">
          <div className="flex gap-1 pt-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block w-1.5 h-1.5 rounded-full ${
                  i < meta.dots ? "bg-stone-900" : "bg-stone-200"
                }`}
              />
            ))}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-stone-900">{meta.label}</p>
            <p className="text-xs text-stone-600 mt-0.5">{meta.helper}</p>
          </div>
        </div>
      )}

      {/* Authentication seal — data-driven when authenticity record exists */}
      <div className="flex items-start gap-4 px-6 py-4 border-b border-stone-100">
        <div
          className={`shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center ${
            authenticity ? "text-amber-700" : "text-stone-400"
          }`}
          style={{ borderColor: authenticity ? "#b08840" : undefined }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="min-w-0">
          {authenticity ? (
            <>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-stone-900">marianni Authenticated</p>
                <span
                  className="inline-block px-1.5 py-0.5 text-[10px] tracking-wider uppercase font-medium border rounded-sm"
                  style={{ color: "#b08840", borderColor: "#b08840" }}
                >
                  Verified
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Inspected by {authenticity.watchmaker}
                {authenticity.hasVideo && " · Video on file"}
                {authenticity.hasNfc && " · NFC card included"}
              </p>
              <Link
                href={`/verify/${encodeURIComponent(authenticity.serialNumber)}`}
                className="inline-block text-xs text-amber-800 hover:text-amber-900 mt-1 underline underline-offset-2"
              >
                View authenticity certificate →
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-stone-900">Authenticated by marianni</p>
              <p className="text-xs text-stone-600 mt-0.5">
                Every piece is inspected and verified by our in-house horologists
              </p>
            </>
          )}
        </div>
      </div>

      {/* Insurance row */}
      <div className="flex items-start gap-4 px-6 py-4">
        <div
          className="shrink-0 w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-700"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path
              d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-stone-900">Fully insured rental</p>
          <p className="text-xs text-stone-600 mt-0.5">
            Comprehensive coverage included — your deposit is fully refundable on return
          </p>
        </div>
      </div>
    </div>
  );
}
