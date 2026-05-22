import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FOUNDING_MEMBER_LIMIT } from "@/lib/founding-member";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin — Founding Members" };

function formatDate(d: Date) {
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function FoundingMembersPage() {
  const [members, totalReferrals] = await Promise.all([
    prisma.foundingMember.findMany({
      orderBy: { confirmedAt: "asc" },
      include: {
        referralsGiven: { select: { id: true, creditApplied: true } },
      },
    }),
    prisma.referral.count(),
  ]);

  const slotsUsed = members.length;
  const slotsRemaining = Math.max(0, FOUNDING_MEMBER_LIMIT - slotsUsed);
  const conversionRate = slotsUsed > 0
    ? ((slotsUsed / FOUNDING_MEMBER_LIMIT) * 100).toFixed(0)
    : "0";
  const totalCreditsEur = members.reduce((sum, m) => sum + m.creditCents, 0) / 100;

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide text-stone-900">
          Founding Members
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Gründungsmitglieder-Dashboard — Kampagnenstatus
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Plätze belegt", value: `${slotsUsed} / ${FOUNDING_MEMBER_LIMIT}` },
          { label: "Plätze frei", value: String(slotsRemaining) },
          { label: "Conversion-Rate", value: `${conversionRate} %` },
          { label: "Referrals gesamt", value: String(totalReferrals) },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white border border-stone-200 p-6"
          >
            <p className="text-2xl font-light text-stone-900 mb-1">{kpi.value}</p>
            <p className="text-xs tracking-widest uppercase text-stone-400">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex justify-between text-xs tracking-wider uppercase text-stone-500 mb-2">
          <span>{slotsUsed} von 50 Plätzen vergeben</span>
          <span>{slotsRemaining} verfügbar</span>
        </div>
        <div className="h-2 bg-stone-100 border border-stone-200 overflow-hidden">
          <div
            className="h-full transition-all"
            style={{ width: `${(slotsUsed / FOUNDING_MEMBER_LIMIT) * 100}%`, background: "#C9A84C" }}
          />
        </div>
      </div>

      {/* Member list */}
      {members.length === 0 ? (
        <div className="text-center py-24 border border-stone-200 bg-white">
          <p className="text-stone-400 text-sm tracking-widest uppercase">
            Noch keine Gründungsmitglieder
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 overflow-hidden overflow-x-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
            <h2 className="text-xs tracking-widest uppercase text-stone-500 font-normal">
              Mitglieder ({members.length})
            </h2>
            <p className="text-xs text-stone-400">
              Referral-Guthaben gesamt: {formatEur(totalCreditsEur * 100)}
            </p>
          </div>
          <table className="w-full text-sm min-w-[700px]">
            <thead className="border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">#</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Name</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">E-Mail</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Referral-Code</th>
                <th className="text-center px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Referrals</th>
                <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Guthaben</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Eingeladen von</th>
                <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-stone-500 font-normal">Angemeldet</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, idx) => (
                <tr key={m.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="px-4 py-3 text-xs text-stone-400">{idx + 1}</td>
                  <td className="px-4 py-3 text-stone-900">{m.firstName}</td>
                  <td className="px-4 py-3 text-stone-600 text-xs">{m.email}</td>
                  <td className="px-4 py-3">
                    <code className="text-xs bg-stone-50 border border-stone-200 px-2 py-0.5 text-stone-700 font-mono">
                      {m.referralCode}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="text-xs px-2 py-0.5 border"
                      style={
                        m.referralCount > 0
                          ? { background: "rgba(201,168,76,0.1)", borderColor: "rgba(201,168,76,0.4)", color: "#8a6f1e" }
                          : { background: "#f5f5f4", borderColor: "#e7e5e4", color: "#78716c" }
                      }
                    >
                      {m.referralCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-stone-900">
                    {m.creditCents > 0 ? formatEur(m.creditCents) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-400">
                    {m.referredByCode ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-stone-400">
                    {formatDate(m.confirmedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
