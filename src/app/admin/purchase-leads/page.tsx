import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { SendOfferButton } from "./send-offer-button";

export const metadata: Metadata = { title: "Admin — Purchase Leads" };

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(cents / 100);
}

export default async function PurchaseLeadsPage() {
  // All users who have 2+ completed rentals of the same item
  const leads = await prisma.$queryRaw<
    {
      userId: string;
      itemId: string;
      rentalCount: bigint;
      lastRentalId: string;
      lastRentalAmount: number;
      purchaseLeadSentAt: Date | null;
      convertedToPurchaseAt: Date | null;
      purchaseCreditAmount: number | null;
      userEmail: string;
      userName: string | null;
      itemName: string;
      itemBrand: string;
      purchasable: boolean;
      purchasePrice: number | null;
    }[]
  >`
    SELECT
      r."userId",
      r."itemId",
      COUNT(r.id) AS "rentalCount",
      (ARRAY_AGG(r.id ORDER BY r."createdAt" DESC))[1] AS "lastRentalId",
      (ARRAY_AGG(r."totalAmount" ORDER BY r."createdAt" DESC))[1] AS "lastRentalAmount",
      (ARRAY_AGG(r."purchaseLeadSentAt" ORDER BY r."createdAt" DESC))[1] AS "purchaseLeadSentAt",
      (ARRAY_AGG(r."convertedToPurchaseAt" ORDER BY r."createdAt" DESC))[1] AS "convertedToPurchaseAt",
      (ARRAY_AGG(r."purchaseCreditAmount" ORDER BY r."createdAt" DESC))[1] AS "purchaseCreditAmount",
      u."email" AS "userEmail",
      u."name" AS "userName",
      i."name" AS "itemName",
      i."brand" AS "itemBrand",
      i."purchasable",
      i."purchasePrice"
    FROM "Rental" r
    JOIN "User" u ON u.id = r."userId"
    JOIN "Item" i ON i.id = r."itemId"
    WHERE r.status = 'RETURNED'
    GROUP BY r."userId", r."itemId", u."email", u."name", i."name", i."brand", i."purchasable", i."purchasePrice"
    HAVING COUNT(r.id) >= 2
    ORDER BY COUNT(r.id) DESC, "purchaseLeadSentAt" ASC NULLS FIRST
  `;

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide text-stone-900">Purchase Leads</h1>
        <p className="text-sm text-stone-400 mt-1">
          Customers who have rented the same item 2+ times — warm acquisition targets.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-24 border border-stone-200 bg-white">
          <p className="text-stone-400 text-sm tracking-widest uppercase">No purchase leads yet</p>
          <p className="text-stone-400 text-xs mt-2">Leads appear when a customer returns the same item a second time.</p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Customer</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Item</th>
                <th className="text-center px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Rentals</th>
                <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Credit</th>
                <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Purchase Price</th>
                <th className="text-center px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Status</th>
                <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const credit = lead.purchaseCreditAmount ?? lead.lastRentalAmount;
                const finalPrice = lead.purchasePrice ? Math.max(0, lead.purchasePrice - credit) : null;
                const isConverted = !!lead.convertedToPurchaseAt;
                const offerSent = !!lead.purchaseLeadSentAt;

                return (
                  <tr key={`${lead.userId}-${lead.itemId}`} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-900">{lead.userName ?? "—"}</p>
                      <p className="text-xs text-stone-400">{lead.userEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-900">{lead.itemName}</p>
                      <p className="text-xs text-stone-400">{lead.itemBrand}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-stone-100 text-stone-700 text-xs px-2 py-0.5">
                        ×{Number(lead.rentalCount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-stone-900">{formatEur(credit)}</td>
                    <td className="px-4 py-3 text-right">
                      {lead.purchasable && lead.purchasePrice ? (
                        <div>
                          <p className="text-stone-400 text-xs line-through">{formatEur(lead.purchasePrice)}</p>
                          <p className="text-stone-900 font-medium">{formatEur(finalPrice!)}</p>
                        </div>
                      ) : (
                        <span className="text-stone-400 text-xs">Not for sale</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isConverted ? (
                        <span className="text-xs tracking-widest uppercase text-green-700 bg-green-50 px-2 py-0.5">Converted</span>
                      ) : offerSent ? (
                        <span className="text-xs tracking-widest uppercase text-amber-700 bg-amber-50 px-2 py-0.5">Offer Sent</span>
                      ) : (
                        <span className="text-xs tracking-widest uppercase text-stone-400 bg-stone-100 px-2 py-0.5">No Offer</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!isConverted && (
                        <SendOfferButton rentalId={lead.lastRentalId} disabled={offerSent} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
