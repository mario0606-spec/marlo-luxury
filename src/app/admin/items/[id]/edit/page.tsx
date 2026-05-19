import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminItemForm, centsToEuros } from "@/components/admin-item-form";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Admin — Edit Item" };

export default async function EditItemPage({ params }: PageProps) {
  const { id } = await params;

  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide text-stone-900">Edit Item</h1>
        <p className="text-sm text-stone-400 mt-1">{item.name}</p>
      </div>
      <AdminItemForm
        mode="edit"
        itemId={item.id}
        initial={{
          name: item.name,
          slug: item.slug,
          description: item.description,
          category: item.category,
          brand: item.brand,
          model: item.model ?? "",
          referenceNumber: item.referenceNumber ?? "",
          retailPrice: centsToEuros(item.retailPrice),
          dailyRate: centsToEuros(item.dailyRate),
          weeklyRate: item.weeklyRate ? centsToEuros(item.weeklyRate) : "",
          monthlyRate: item.monthlyRate ? centsToEuros(item.monthlyRate) : "",
          depositAmount: centsToEuros(item.depositAmount),
          images: item.images.join("\n"),
          available: item.available,
          featured: item.featured,
        }}
      />
    </main>
  );
}
