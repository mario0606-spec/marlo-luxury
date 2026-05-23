"use client";

import { useMemo, useState } from "react";

interface BookedRange {
  start: string; // YYYY-MM-DD
  end: string;
}

interface PricingAvailabilityProps {
  dailyRate: number;
  weeklyRate: number | null;
  monthlyRate: number | null;
  depositAmount: number;
  bookedRanges: BookedRange[];
  available: boolean;
}

function formatEur(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildBookedSet(ranges: BookedRange[]) {
  const set = new Set<string>();
  for (const r of ranges) {
    const start = new Date(r.start + "T00:00:00");
    const end = new Date(r.end + "T00:00:00");
    const cursor = new Date(start);
    while (cursor <= end) {
      set.add(dateKey(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return set;
}

function nextAvailableDate(bookedSet: Set<string>): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cursor = new Date(today);
  for (let i = 0; i < 365; i++) {
    if (!bookedSet.has(dateKey(cursor))) return cursor;
    cursor.setDate(cursor.getDate() + 1);
  }
  return today;
}

export function PricingAvailability({
  dailyRate,
  weeklyRate,
  monthlyRate,
  depositAmount,
  bookedRanges,
  available,
}: PricingAvailabilityProps) {
  const bookedSet = useMemo(() => buildBookedSet(bookedRanges), [bookedRanges]);
  const nextDate = useMemo(() => nextAvailableDate(bookedSet), [bookedSet]);

  const [monthOffset, setMonthOffset] = useState(0);
  const now = new Date();
  const viewMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);

  const weeklySaving =
    weeklyRate != null ? Math.max(0, dailyRate * 7 - weeklyRate) : 0;
  const monthlySaving =
    monthlyRate != null ? Math.max(0, dailyRate * 30 - monthlyRate) : 0;
  const weeklySavingPct =
    weeklyRate != null && dailyRate > 0
      ? Math.round((weeklySaving / (dailyRate * 7)) * 100)
      : 0;
  const monthlySavingPct =
    monthlyRate != null && dailyRate > 0
      ? Math.round((monthlySaving / (dailyRate * 30)) * 100)
      : 0;

  // Calendar grid (Mon-first)
  const firstDay = new Date(viewMonth);
  const startWeekday = (firstDay.getDay() + 6) % 7; // 0 = Monday
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="border border-stone-200 bg-white">
      {/* Rate comparison */}
      <div className="p-6">
        <h2 className="text-xs tracking-widest uppercase text-stone-500 mb-4">Rental Pricing</h2>
        <div className="space-y-3">
          <Row label="Daily" amount={dailyRate} suffix="/ day" />
          {weeklyRate != null && (
            <Row
              label="Weekly"
              amount={weeklyRate}
              suffix={`/ week · ${formatEur(Math.round(weeklyRate / 7))}/day`}
              chip={weeklySavingPct >= 5 ? `Save ${weeklySavingPct}%` : null}
            />
          )}
          {monthlyRate != null && (
            <Row
              label="Monthly"
              amount={monthlyRate}
              suffix={`/ month · ${formatEur(Math.round(monthlyRate / 30))}/day`}
              chip={monthlySavingPct >= 5 ? `Save ${monthlySavingPct}%` : null}
              accent
            />
          )}
          <div className="pt-3 mt-1 border-t border-stone-100 flex justify-between items-center text-sm">
            <span className="text-stone-500">Refundable deposit</span>
            <span className="text-stone-700">{formatEur(depositAmount)}</span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="border-t border-stone-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs tracking-widest uppercase text-stone-500">Availability</h2>
          <p className="text-xs text-stone-600">
            {available ? (
              <>
                Next available{" "}
                <span className="text-stone-900 font-medium">
                  {nextDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </>
            ) : (
              <span className="text-red-600">Currently unavailable</span>
            )}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => setMonthOffset((o) => Math.max(0, o - 1))}
            aria-label="Previous month"
            disabled={monthOffset === 0}
            className="text-stone-600 hover:text-stone-900 disabled:opacity-30 text-lg w-8 h-8"
          >
            ‹
          </button>
          <p className="text-sm font-medium text-stone-900">
            {viewMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </p>
          <button
            type="button"
            onClick={() => setMonthOffset((o) => Math.min(11, o + 1))}
            aria-label="Next month"
            disabled={monthOffset >= 11}
            className="text-stone-600 hover:text-stone-900 disabled:opacity-30 text-lg w-8 h-8"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i} className="text-[10px] tracking-widest uppercase text-stone-400">
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <span key={i} />;
            const key = dateKey(d);
            const isBooked = bookedSet.has(key);
            const isPast = d < today;
            const isToday = d.getTime() === today.getTime();
            return (
              <span
                key={i}
                aria-label={`${d.toDateString()}${isBooked ? " — booked" : ""}`}
                className={[
                  "aspect-square flex items-center justify-center text-xs rounded-sm",
                  isPast
                    ? "text-stone-300"
                    : isBooked
                      ? "bg-stone-200 text-stone-400 line-through"
                      : "text-stone-700 hover:bg-stone-50",
                  isToday ? "ring-1 ring-stone-900" : "",
                ].join(" ")}
              >
                {d.getDate()}
              </span>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 text-[11px] text-stone-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-stone-200 rounded-sm" /> Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm ring-1 ring-stone-900" /> Today
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  amount,
  suffix,
  chip,
  accent,
}: {
  label: string;
  amount: number;
  suffix?: string;
  chip?: string | null;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`text-sm ${accent ? "text-stone-900 font-medium" : "text-stone-600"}`}>
          {label}
        </span>
        {chip && (
          <span className="text-[10px] tracking-wider uppercase bg-stone-900 text-stone-50 px-1.5 py-0.5 rounded-sm">
            {chip}
          </span>
        )}
      </div>
      <div className="text-right">
        <span className="text-lg font-light text-stone-900">{formatEur(amount)}</span>
        {suffix && <span className="ml-2 text-xs text-stone-500">{suffix}</span>}
      </div>
    </div>
  );
}
