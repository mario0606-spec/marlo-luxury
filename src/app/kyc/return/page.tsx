"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function KycReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "verified" | "pending" | "rejected">("loading");

  useEffect(() => {
    // Poll for KYC status update (Stripe webhook may not have fired yet)
    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      try {
        const res = await fetch("/api/kyc/status");
        if (!res.ok) return;
        const data = await res.json();

        if (data.kycStatus === "VERIFIED") {
          setStatus("verified");
          return;
        }
        if (data.kycStatus === "REJECTED") {
          setStatus("rejected");
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setStatus("pending");
        }
      } catch {
        setStatus("pending");
      }
    };

    poll();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-stone-300 border-t-stone-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-stone-500">Checking verification status…</p>
        </div>
      </div>
    );
  }

  if (status === "verified") {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-stone-300 mb-6">
            <svg className="w-6 h-6 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-light tracking-wide text-stone-900 mb-3">Identity Verified</h1>
          <p className="text-sm text-stone-500 mb-8">
            Your identity has been confirmed. You can now complete your rental booking.
          </p>
          <button
            onClick={() => router.back()}
            className="btn-primary w-full mb-3"
          >
            Continue Booking
          </button>
          <Link href="/catalog" className="text-sm text-stone-400 hover:text-stone-600">
            Browse catalog
          </Link>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-red-200 mb-6">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-light tracking-wide text-stone-900 mb-3">Verification Failed</h1>
          <p className="text-sm text-stone-500 mb-8">
            We couldn&apos;t verify your identity. Please ensure your document is valid and try again,
            or contact us for assistance.
          </p>
          <Link href="/catalog" className="btn-primary block text-center mb-3">
            Back to Catalog
          </Link>
          <a href="mailto:support@marloluxury.com" className="text-sm text-stone-400 hover:text-stone-600">
            Contact support
          </a>
        </div>
      </div>
    );
  }

  // Pending
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 border border-stone-300 mb-6">
          <svg className="w-6 h-6 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-light tracking-wide text-stone-900 mb-3">Verification in Progress</h1>
        <p className="text-sm text-stone-500 mb-8">
          Your documents are being reviewed. This usually takes a few minutes.
          We&apos;ll notify you once verified.
        </p>
        <Link href="/catalog" className="btn-primary block text-center">
          Back to Catalog
        </Link>
      </div>
    </div>
  );
}
