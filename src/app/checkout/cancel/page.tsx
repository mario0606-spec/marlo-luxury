import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-stone-300">
          <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-light tracking-wide mb-3">Payment Cancelled</h1>
        <p className="text-stone-500 mb-10">
          Your payment was not completed. No charge was made.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/catalog"
            className="py-3 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors"
          >
            Return to Catalog
          </Link>
          <Link
            href="/dashboard"
            className="py-3 border border-stone-300 text-stone-600 text-sm tracking-widest uppercase hover:border-stone-500 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
