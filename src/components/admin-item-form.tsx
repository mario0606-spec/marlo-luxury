"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ItemFormData {
  name: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  referenceNumber: string;
  retailPrice: string;
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  depositAmount: string;
  images: string;
  available: boolean;
  featured: boolean;
}

interface AdminItemFormProps {
  mode: "create" | "edit";
  itemId?: string;
  initial?: Partial<ItemFormData>;
}

const CATEGORIES = ["WATCH", "JEWELRY", "BAG", "ACCESSORY", "OTHER"];

function eurosToCents(value: string) {
  const n = parseFloat(value.replace(",", "."));
  return isNaN(n) ? 0 : Math.round(n * 100);
}

function centsToEuros(cents: number) {
  return (cents / 100).toFixed(2);
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function AdminItemForm({ mode, itemId, initial }: AdminItemFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ItemFormData>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "WATCH",
    brand: initial?.brand ?? "",
    model: initial?.model ?? "",
    referenceNumber: initial?.referenceNumber ?? "",
    retailPrice: initial?.retailPrice ?? "",
    dailyRate: initial?.dailyRate ?? "",
    weeklyRate: initial?.weeklyRate ?? "",
    monthlyRate: initial?.monthlyRate ?? "",
    depositAmount: initial?.depositAmount ?? "",
    images: initial?.images ?? "",
    available: initial?.available ?? true,
    featured: initial?.featured ?? false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key: keyof ItemFormData, value: string | boolean) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "name" && mode === "create"
        ? { slug: generateSlug(value as string) }
        : {}),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const imageUrls = form.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (imageUrls.length === 0) {
      setError("At least one image URL is required.");
      return;
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      category: form.category,
      brand: form.brand,
      model: form.model || undefined,
      referenceNumber: form.referenceNumber || undefined,
      retailPrice: eurosToCents(form.retailPrice),
      dailyRate: eurosToCents(form.dailyRate),
      weeklyRate: form.weeklyRate ? eurosToCents(form.weeklyRate) : undefined,
      monthlyRate: form.monthlyRate ? eurosToCents(form.monthlyRate) : undefined,
      depositAmount: eurosToCents(form.depositAmount),
      images: imageUrls,
      available: form.available,
      featured: form.featured,
    };

    setLoading(true);
    try {
      const url = mode === "create" ? "/api/admin/items" : `/api/admin/items/${itemId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      router.push("/admin/items");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Item name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="label">Slug *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="input-field font-mono text-sm"
            pattern="^[a-z0-9-]+$"
            required
          />
          <p className="text-xs text-stone-400 mt-1">Lowercase letters, numbers, hyphens only</p>
        </div>

        <div>
          <label className="label">Category *</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="input-field"
            required
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Brand *</label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="label">Model</label>
          <input
            type="text"
            value={form.model}
            onChange={(e) => set("model", e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Reference number</label>
          <input
            type="text"
            value={form.referenceNumber}
            onChange={(e) => set("referenceNumber", e.target.value)}
            className="input-field"
          />
        </div>

        <div className="col-span-2">
          <label className="label">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="input-field min-h-28"
            required
          />
        </div>
      </div>

      <div>
        <h3 className="text-xs tracking-widest uppercase text-stone-500 mb-4">
          Pricing (in EUR)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Retail price (€) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.retailPrice}
              onChange={(e) => set("retailPrice", e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">Deposit (€) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.depositAmount}
              onChange={(e) => set("depositAmount", e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">Daily rate (€) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.dailyRate}
              onChange={(e) => set("dailyRate", e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">Weekly rate (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.weeklyRate}
              onChange={(e) => set("weeklyRate", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Monthly rate (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.monthlyRate}
              onChange={(e) => set("monthlyRate", e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="label">Image URLs *</label>
        <textarea
          value={form.images}
          onChange={(e) => set("images", e.target.value)}
          className="input-field font-mono text-sm min-h-24"
          placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
          required
        />
        <p className="text-xs text-stone-400 mt-1">One URL per line. First image is used as the cover.</p>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => set("available", e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-stone-700">Available for rental</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-stone-700">Featured item</span>
        </label>
      </div>

      <div className="flex gap-4 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving…" : mode === "create" ? "Create Item" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/items")}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export { centsToEuros };
