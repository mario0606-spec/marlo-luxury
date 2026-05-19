"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type ConditionStatus = "PASS" | "DAMAGE_NOTED" | "FAIL";

interface ExistingLog {
  id: string;
  phase: "DISPATCH" | "RETURN";
  status: ConditionStatus;
  notes: string | null;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

interface Props {
  rentalId: string;
  phase: "DISPATCH" | "RETURN";
  existing: ExistingLog | null;
}

const STATUS_OPTIONS: { value: ConditionStatus; label: string; desc: string }[] = [
  { value: "PASS", label: "Pass", desc: "No damage, item in expected condition" },
  { value: "DAMAGE_NOTED", label: "Damage Noted", desc: "Minor wear or existing damage documented" },
  { value: "FAIL", label: "Fail", desc: "Significant damage — deposit action required" },
];

const STATUS_STYLES: Record<ConditionStatus, string> = {
  PASS: "border-green-500 bg-green-50 text-green-800",
  DAMAGE_NOTED: "border-amber-500 bg-amber-50 text-amber-800",
  FAIL: "border-red-500 bg-red-50 text-red-800",
};

async function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1200;
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas error")); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ConditionLogForm({ rentalId, phase, existing }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(!existing);
  const [status, setStatus] = useState<ConditionStatus>(existing?.status ?? "PASS");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [photos, setPhotos] = useState<string[]>(existing?.photos ?? []);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phaseLabel = phase === "DISPATCH" ? "Dispatch" : "Return";

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    if (photos.length + files.length > 10) {
      setError("Maximum 10 photos per log.");
      return;
    }
    setLoadingPhotos(true);
    setError(null);
    try {
      const processed = await Promise.all(files.map(resizeImageToDataUrl));
      setPhotos((prev) => [...prev, ...processed]);
    } catch {
      setError("Failed to process one or more images.");
    } finally {
      setLoadingPhotos(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (photos.length === 0) {
      setError("Please add at least one photo.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/rentals/${rentalId}/condition-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase, status, notes: notes.trim() || undefined, photos }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save");
      }
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  if (!isEditing && existing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={`text-xs tracking-widest uppercase px-3 py-1 border font-medium ${STATUS_STYLES[existing.status]}`}>
            {existing.status.replace("_", " ")}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs tracking-wider uppercase text-stone-500 hover:text-stone-900 underline underline-offset-2"
          >
            Edit {phaseLabel} Log
          </button>
        </div>

        {existing.notes && (
          <p className="text-sm text-stone-600 italic">"{existing.notes}"</p>
        )}

        {existing.photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {existing.photos.map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${phaseLabel} photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-stone-400">
          Last updated {new Date(existing.updatedAt).toLocaleString()}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Status */}
      <div>
        <p className="text-xs tracking-widest uppercase text-stone-500 mb-2">Condition Status</p>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex-1 min-w-[120px] border cursor-pointer px-3 py-2 text-center transition-colors ${
                status === opt.value
                  ? STATUS_STYLES[opt.value]
                  : "border-stone-200 text-stone-500 hover:border-stone-400"
              }`}
            >
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={status === opt.value}
                onChange={() => setStatus(opt.value)}
                className="sr-only"
              />
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="text-xs mt-0.5 opacity-75">{opt.desc}</p>
            </label>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div>
        <p className="text-xs tracking-widest uppercase text-stone-500 mb-2">
          Photos ({photos.length}/10)
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
          {photos.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden border border-stone-200 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
          {photos.length < 10 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loadingPhotos}
              className="aspect-square border border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 hover:border-stone-500 hover:text-stone-600 transition-colors disabled:opacity-50"
            >
              {loadingPhotos ? (
                <span className="text-xs">Processing…</span>
              ) : (
                <>
                  <span className="text-2xl leading-none">+</span>
                  <span className="text-xs mt-1">Add photo</span>
                </>
              )}
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={handleFileChange}
        />
        <p className="text-xs text-stone-400">
          Photos are resized to max 1200px. JPEG or PNG. Up to 10 per phase.
        </p>
      </div>

      {/* Notes */}
      <div>
        <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={2000}
          rows={3}
          placeholder={`Describe the condition at ${phaseLabel.toLowerCase()}…`}
          className="w-full border border-stone-200 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || loadingPhotos}
          className="bg-stone-900 text-white text-xs tracking-widest uppercase px-6 py-2 hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : `Save ${phaseLabel} Log`}
        </button>
        {existing && (
          <button
            type="button"
            onClick={() => { setIsEditing(false); setStatus(existing.status); setNotes(existing.notes ?? ""); setPhotos(existing.photos); setError(null); }}
            className="text-xs tracking-wider uppercase text-stone-500 hover:text-stone-900 px-4 py-2 border border-stone-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
