"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface ConditionLogData {
  id: string;
  photos: string[];
  notes: string | null;
  capturedAt: string;
  assessment?: string | null;
}

interface Props {
  rentalId: string;
  status: string;
  dispatchLog: ConditionLogData | null;
  returnLog: ConditionLogData | null;
}

const ASSESSMENT_LABELS: Record<string, { label: string; className: string }> = {
  PRISTINE: { label: "Pristine", className: "text-green-700 bg-green-50 border-green-200" },
  MINOR_WEAR: { label: "Minor Wear", className: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  DAMAGE: { label: "Damage", className: "text-red-700 bg-red-50 border-red-200" },
  MISSING_ITEM: { label: "Missing Item", className: "text-red-900 bg-red-100 border-red-300" },
};

function PhotoUploadZone({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange([...photos, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (idx: number) => {
    onChange(photos.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div
        className="border-2 border-dashed border-stone-200 p-6 text-center cursor-pointer hover:border-stone-400 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <p className="text-sm text-stone-400">
          Click or drag photos here
        </p>
        <p className="text-xs text-stone-300 mt-1">Minimum 2 photos required</p>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((src, idx) => (
            <div key={idx} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-24 object-cover border border-stone-200" />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoGallery({ photos, label }: { photos: string[]; label: string }) {
  const [selected, setSelected] = useState(0);
  return (
    <div>
      <p className="text-xs tracking-widest uppercase text-stone-500 mb-2">{label}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[selected]}
        alt={`${label} photo ${selected + 1}`}
        className="w-full h-56 object-cover border border-stone-200 mb-2"
      />
      {photos.length > 1 && (
        <div className="grid grid-cols-4 gap-1">
          {photos.map((src, idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={idx}
              src={src}
              alt={`Thumbnail ${idx + 1}`}
              onClick={() => setSelected(idx)}
              className={`w-full h-12 object-cover cursor-pointer border ${
                selected === idx ? "border-stone-800" : "border-stone-200"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ConditionLogPanel({ rentalId, status, dispatchLog, returnLog }: Props) {
  const router = useRouter();

  // Dispatch modal state
  const [showDispatch, setShowDispatch] = useState(false);
  const [dispatchPhotos, setDispatchPhotos] = useState<string[]>([]);
  const [dispatchNotes, setDispatchNotes] = useState("");
  const [dispatchLoading, setDispatchLoading] = useState(false);
  const [dispatchError, setDispatchError] = useState("");

  // Return modal state
  const [showReturn, setShowReturn] = useState(false);
  const [returnPhotos, setReturnPhotos] = useState<string[]>([]);
  const [returnNotes, setReturnNotes] = useState("");
  const [returnAssessment, setReturnAssessment] = useState<string>("PRISTINE");
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnError, setReturnError] = useState("");

  const canDispatch = status === "CONFIRMED" && !dispatchLog;
  const canReturn = (status === "DISPATCHED" || status === "ACTIVE") && !returnLog;

  const submitDispatch = async () => {
    if (dispatchPhotos.length < 2) {
      setDispatchError("Upload at least 2 photos.");
      return;
    }
    setDispatchLoading(true);
    setDispatchError("");
    try {
      const res = await fetch(`/api/admin/rentals/${rentalId}/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: dispatchPhotos, notes: dispatchNotes || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        setDispatchError(data.error ?? "Failed to save dispatch log");
        return;
      }
      setShowDispatch(false);
      router.refresh();
    } catch {
      setDispatchError("Network error. Please try again.");
    } finally {
      setDispatchLoading(false);
    }
  };

  const submitReturn = async () => {
    if (returnPhotos.length < 2) {
      setReturnError("Upload at least 2 photos.");
      return;
    }
    setReturnLoading(true);
    setReturnError("");
    try {
      const res = await fetch(`/api/admin/rentals/${rentalId}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photos: returnPhotos,
          assessment: returnAssessment,
          notes: returnNotes || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setReturnError(data.error ?? "Failed to save return log");
        return;
      }
      setShowReturn(false);
      router.refresh();
    } catch {
      setReturnError("Network error. Please try again.");
    } finally {
      setReturnLoading(false);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs tracking-widest uppercase text-stone-500">Condition Log</h2>
        <div className="flex gap-3">
          {canDispatch && (
            <button
              onClick={() => setShowDispatch(true)}
              className="px-4 py-2 text-xs tracking-widest uppercase bg-stone-900 text-white hover:bg-stone-700 transition-colors"
            >
              Mark Dispatched
            </button>
          )}
          {canReturn && (
            <button
              onClick={() => setShowReturn(true)}
              className="px-4 py-2 text-xs tracking-widest uppercase bg-stone-900 text-white hover:bg-stone-700 transition-colors"
            >
              Mark Returned
            </button>
          )}
        </div>
      </div>

      {/* Side-by-side comparison when both logs exist */}
      {dispatchLog && returnLog ? (
        <div className="grid grid-cols-2 gap-6">
          <div className="border border-stone-200 bg-white p-6">
            <PhotoGallery photos={dispatchLog.photos} label="Dispatch Condition" />
            {dispatchLog.notes && <p className="text-sm text-stone-500 mt-3">{dispatchLog.notes}</p>}
            <p className="text-xs text-stone-300 mt-2">{new Date(dispatchLog.capturedAt).toLocaleString()}</p>
          </div>
          <div className="border border-stone-200 bg-white p-6">
            <PhotoGallery photos={returnLog.photos} label="Return Condition" />
            {returnLog.assessment && (
              <span
                className={`inline-block mt-3 text-xs tracking-widest uppercase px-2 py-0.5 border ${
                  ASSESSMENT_LABELS[returnLog.assessment]?.className ?? ""
                }`}
              >
                {ASSESSMENT_LABELS[returnLog.assessment]?.label ?? returnLog.assessment}
              </span>
            )}
            {returnLog.notes && <p className="text-sm text-stone-500 mt-2">{returnLog.notes}</p>}
            {returnLog.assessment === "DAMAGE" || returnLog.assessment === "MISSING_ITEM" ? (
              <div className="mt-3 p-3 border border-red-200 bg-red-50 text-xs text-red-700">
                Deposit capture may be required — check marianni Schutz.
              </div>
            ) : null}
            <p className="text-xs text-stone-300 mt-2">{new Date(returnLog.capturedAt).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div className="border border-stone-200 bg-white p-6">
            {dispatchLog ? (
              <>
                <PhotoGallery photos={dispatchLog.photos} label="Dispatch Condition" />
                {dispatchLog.notes && <p className="text-sm text-stone-500 mt-3">{dispatchLog.notes}</p>}
                <p className="text-xs text-stone-300 mt-2">{new Date(dispatchLog.capturedAt).toLocaleString()}</p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-stone-300">
                <p className="text-xs tracking-widest uppercase">No dispatch photos yet</p>
              </div>
            )}
          </div>
          <div className="border border-stone-200 bg-white p-6">
            {returnLog ? (
              <>
                <PhotoGallery photos={returnLog.photos} label="Return Condition" />
                {returnLog.assessment && (
                  <span
                    className={`inline-block mt-3 text-xs tracking-widest uppercase px-2 py-0.5 border ${
                      ASSESSMENT_LABELS[returnLog.assessment]?.className ?? ""
                    }`}
                  >
                    {ASSESSMENT_LABELS[returnLog.assessment]?.label ?? returnLog.assessment}
                  </span>
                )}
                {returnLog.notes && <p className="text-sm text-stone-500 mt-2">{returnLog.notes}</p>}
                <p className="text-xs text-stone-300 mt-2">{new Date(returnLog.capturedAt).toLocaleString()}</p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-stone-300">
                <p className="text-xs tracking-widest uppercase">No return photos yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dispatch Modal */}
      {showDispatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-lg w-full p-8 overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-light tracking-wide text-stone-900 mb-6">Dispatch Condition Log</h2>
            <p className="text-sm text-stone-500 mb-6">
              Upload at least 2 photos of the item before dispatching. The customer will receive the first photo by email.
            </p>

            <div className="mb-4">
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2">Photos (min. 2)</label>
              <PhotoUploadZone photos={dispatchPhotos} onChange={setDispatchPhotos} />
            </div>

            <div className="mb-6">
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2">Condition Notes (optional)</label>
              <textarea
                value={dispatchNotes}
                onChange={(e) => setDispatchNotes(e.target.value)}
                className="w-full border border-stone-200 p-3 text-sm text-stone-900 resize-none focus:outline-none focus:border-stone-400"
                rows={3}
                placeholder="Any notes about the item's condition..."
              />
            </div>

            {dispatchError && (
              <p className="text-sm text-red-600 mb-4">{dispatchError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={submitDispatch}
                disabled={dispatchLoading || dispatchPhotos.length < 2}
                className="flex-1 px-4 py-3 text-xs tracking-widest uppercase bg-stone-900 text-white disabled:bg-stone-300 disabled:cursor-not-allowed hover:bg-stone-700 transition-colors"
              >
                {dispatchLoading ? "Saving..." : `Confirm Dispatch (${dispatchPhotos.length}/2+ photos)`}
              </button>
              <button
                onClick={() => { setShowDispatch(false); setDispatchPhotos([]); setDispatchNotes(""); setDispatchError(""); }}
                className="px-4 py-3 text-xs tracking-widest uppercase border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-lg w-full p-8 overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-light tracking-wide text-stone-900 mb-6">Return Condition Log</h2>
            <p className="text-sm text-stone-500 mb-6">
              Upload at least 2 photos of the returned item and select a condition assessment.
            </p>

            <div className="mb-4">
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2">Photos (min. 2)</label>
              <PhotoUploadZone photos={returnPhotos} onChange={setReturnPhotos} />
            </div>

            <div className="mb-4">
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2">Condition Assessment</label>
              <select
                value={returnAssessment}
                onChange={(e) => setReturnAssessment(e.target.value)}
                className="w-full border border-stone-200 p-3 text-sm text-stone-900 focus:outline-none focus:border-stone-400 bg-white"
              >
                <option value="PRISTINE">Pristine</option>
                <option value="MINOR_WEAR">Minor Wear</option>
                <option value="DAMAGE">Damage</option>
                <option value="MISSING_ITEM">Missing Item</option>
              </select>
            </div>

            {(returnAssessment === "DAMAGE" || returnAssessment === "MISSING_ITEM") && (
              <div className="mb-4 p-3 border border-red-200 bg-red-50 text-xs text-red-700">
                This will flag the rental for deposit capture via marianni Schutz.
              </div>
            )}

            <div className="mb-6">
              <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2">Notes (optional)</label>
              <textarea
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                className="w-full border border-stone-200 p-3 text-sm text-stone-900 resize-none focus:outline-none focus:border-stone-400"
                rows={3}
                placeholder="Describe any damage or notable condition..."
              />
            </div>

            {returnError && (
              <p className="text-sm text-red-600 mb-4">{returnError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={submitReturn}
                disabled={returnLoading || returnPhotos.length < 2}
                className="flex-1 px-4 py-3 text-xs tracking-widest uppercase bg-stone-900 text-white disabled:bg-stone-300 disabled:cursor-not-allowed hover:bg-stone-700 transition-colors"
              >
                {returnLoading ? "Saving..." : `Confirm Return (${returnPhotos.length}/2+ photos)`}
              </button>
              <button
                onClick={() => { setShowReturn(false); setReturnPhotos([]); setReturnNotes(""); setReturnError(""); setReturnAssessment("PRISTINE"); }}
                className="px-4 py-3 text-xs tracking-widest uppercase border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
