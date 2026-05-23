import Link from "next/link";
import type { WatchAuthenticity, WatchConditionGrade } from "@/lib/types";

const CONDITION_META: Record<
  WatchConditionGrade,
  { label: string; helper: string }
> = {
  "A+": {
    label: "Neuwertig",
    helper: "Wie neu, ungetragen oder Vitrinenstück",
  },
  A: {
    label: "Sehr gut",
    helper: "Leichte, gleichmäßige Tragespuren",
  },
  "B+": {
    label: "Gut",
    helper: "Sichtbare Gebrauchsspuren, voll funktionsfähig",
  },
  B: {
    label: "Gut",
    helper: "Sichtbare Gebrauchsspuren, voll funktionsfähig",
  },
};

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function AuthenticatedRow({
  record,
}: {
  record: WatchAuthenticity;
}) {
  const latestCondition = record.conditionLog[record.conditionLog.length - 1];
  const meta: string[] = [];
  if (latestCondition) meta.push(`Inspiziert von ${latestCondition.inspectedBy}`);
  if (record.inspectionVideoUrl) meta.push("Video verfügbar");
  if (record.nfcUid) meta.push("NFC-Karte enthalten");

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-gold-50">
      <div className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-gold-600 text-gold-600 shrink-0">
        <ShieldIcon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">marianni Authenticated</span>
          <span className="inline-flex items-center rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-medium text-gold-700 tracking-wide">
            Geprüft
          </span>
        </div>
        {meta.length > 0 && (
          <p className="mt-1 text-xs text-gold-700">{meta.join(" · ")}</p>
        )}
        <Link
          href={`/auth/${record.serial}`}
          className="mt-1.5 inline-block text-xs font-medium text-gold-700 hover:text-gold-800 transition-colors"
        >
          Echtheitszertifikat ansehen →
        </Link>
      </div>
    </div>
  );
}

function FallbackAuthRow() {
  return (
    <div className="flex items-start gap-4 p-4">
      <div className="flex items-center justify-center w-9 h-9 rounded-full border border-gold-300 text-gold-400 shrink-0">
        <ShieldIcon className="w-5 h-5" />
      </div>
      <div>
        <span className="text-sm font-medium">Von marianni authentifiziert</span>
        <p className="mt-0.5 text-xs text-stone-500">
          Jede Uhr wird von unseren hauseigenen Uhrmachern geprüft und
          authentifiziert.
        </p>
      </div>
    </div>
  );
}

function ConditionRow({ grade }: { grade: WatchConditionGrade }) {
  const meta = CONDITION_META[grade];
  return (
    <div className="flex items-start gap-4 p-4">
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gold-100 text-gold-700 text-xs font-medium shrink-0">
        {grade}
      </div>
      <div>
        <span className="text-sm font-medium">Zustand: {meta.label}</span>
        <p className="mt-0.5 text-xs text-stone-500">{meta.helper}</p>
      </div>
    </div>
  );
}

function InsuranceRow() {
  return (
    <div className="flex items-start gap-4 p-4">
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-stone-100 text-stone-600 shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <div>
        <span className="text-sm font-medium">Premium-Versicherung</span>
        <p className="mt-0.5 text-xs text-stone-500">
          Vollständiger Schutz während der gesamten Mietdauer inklusive.
        </p>
      </div>
    </div>
  );
}

export function TrustSignals({
  authenticityRecord,
  conditionGrade,
}: {
  authenticityRecord?: WatchAuthenticity | null;
  conditionGrade?: WatchConditionGrade;
}) {
  return (
    <div className="border border-gold-200 rounded-lg bg-white divide-y divide-gold-100 overflow-hidden">
      {authenticityRecord ? (
        <AuthenticatedRow record={authenticityRecord} />
      ) : (
        <FallbackAuthRow />
      )}
      {conditionGrade && <ConditionRow grade={conditionGrade} />}
      <InsuranceRow />
    </div>
  );
}
