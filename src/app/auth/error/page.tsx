"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  MissingToken: "The verification link is missing a token.",
  InvalidToken: "This verification link is invalid or has expired.",
  Configuration: "There is a configuration error. Please contact support.",
  AccessDenied: "Access denied.",
  Default: "Something went wrong. Please try again.",
};

function AuthErrorContent() {
  const params = useSearchParams();
  const error = params.get("error") ?? "Default";
  const message = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
      <Link href="/" className="text-2xl tracking-widest font-light uppercase mb-12">
        marianni
      </Link>
      <div className="w-full max-w-md bg-white border border-stone-200 p-10 text-center">
        <h1 className="text-xl font-light tracking-wide mb-4">Authentication Error</h1>
        <p className="text-stone-600 text-sm">{message}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/auth/signin" className="btn-primary w-full text-center">
            Back to Sign In
          </Link>
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-900">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}
