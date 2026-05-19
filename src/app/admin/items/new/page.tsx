import { AdminItemForm } from "@/components/admin-item-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — New Item" };

export default function NewItemPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide text-stone-900">New Item</h1>
        <p className="text-sm text-stone-400 mt-1">Add a new piece to the catalog</p>
      </div>
      <AdminItemForm mode="create" />
    </main>
  );
}
