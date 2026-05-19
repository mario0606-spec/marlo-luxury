import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { PurchaseCheckoutButton } from "./purchase-checkout-button";

interface PageProps {
  params: Promise<{ itemId: string }>;
  searchParams: Promise<{ rentalId?: string }>;
}

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(cents / 100);
}

export default async function PurchasePage({ params, searchParams }: PageProps) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/auth/signin");

  const { itemId } = await params;
  const { rentalId } = await searchParams;

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { id: true, name: true, brand: true, images: true, purchasable: true, purchasePrice: true, description: true },
  });

  if (!item) notFound();

  // Find the most recent qualifying rental (returned, same item, same user, with lead sent)
  const rental = rentalId
    ? await prisma.rental.findFirst({
        where: { id: rentalId, userId, itemId: item.id, status: "RETURNED" },
      })
    : await prisma.rental.findFirst({
        where: { userId, itemId: item.id, status: "RETURNED", purchaseLeadSentAt: { not: null } },
        orderBy: { createdAt: "desc" },
      });

  const creditAmount = rental ? (rental.purchaseCreditAmount ?? rental.totalAmount) : 0;

  if (!item.purchasable || !item.purchasePrice) {
    // Item not for sale — show notify page
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-light tracking-wide text-stone-900 mb-4">{item.brand} {item.name}</h1>
        <p className="text-stone-500 mb-8">This piece is not currently available for purchase.</p>
        <p className="text-stone-400 text-sm">
          We&apos;ll notify you when it becomes available. For inquiries, contact{" "}
          <a href="mailto:concierge@marloluxury.com" className="underline">concierge@marloluxury.com</a>.
        </p>
      </main>
    );
  }

  const finalAmount = Math.max(0, item.purchasePrice - creditAmount);

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Item image */}
        <div className="aspect-square relative bg-stone-100 overflow-hidden">
          {item.images[0] ? (
            <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          ) : (
            <div className="w-full h-full bg-stone-100" />
          )}
        </div>

        {/* Purchase details */}
        <div className="flex flex-col justify-center">
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">{item.brand}</p>
          <h1 className="text-3xl font-light tracking-wide text-stone-900 mb-4">{item.name}</h1>
          <p className="text-stone-500 text-sm mb-8 leading-relaxed">{item.description.slice(0, 200)}{item.description.length > 200 ? "…" : ""}</p>

          <div className="border border-stone-200 p-6 mb-8">
            <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4">Your Exclusive Offer</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Purchase price</span>
                <span className="text-stone-900">{formatEur(item.purchasePrice)}</span>
              </div>
              {creditAmount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Rental credit</span>
                  <span>− {formatEur(creditAmount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-stone-200 font-medium">
                <span className="text-stone-900">You pay</span>
                <span className="text-stone-900 text-lg">{formatEur(finalAmount)}</span>
              </div>
            </div>
          </div>

          {rental && !rental.convertedToPurchaseAt ? (
            <PurchaseCheckoutButton rentalId={rental.id} itemId={item.id} />
          ) : rental?.convertedToPurchaseAt ? (
            <div className="text-center py-4 border border-green-200 bg-green-50 text-green-800 text-sm tracking-wide">
              Purchase complete — this piece is yours.
            </div>
          ) : (
            <p className="text-stone-400 text-sm text-center">
              This offer is only available via the purchase invitation email. Please check your inbox.
            </p>
          )}

          <p className="text-stone-400 text-xs mt-6 text-center">
            Questions? Contact <a href="mailto:concierge@marloluxury.com" className="underline">concierge@marloluxury.com</a>
          </p>
        </div>
      </div>
    </main>
  );
}
