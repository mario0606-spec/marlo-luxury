import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "./booking-form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.item.findUnique({ where: { slug }, select: { name: true, brand: true } });
  if (!item) return { title: "Not Found" };
  return { title: `Book ${item.name} — Marlo` };
}

export default async function BookPage({ params }: PageProps) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const { slug } = await params;

  if (!userId) {
    redirect(`/auth/signin?callbackUrl=/book/${slug}`);
  }

  const [item, user] = await Promise.all([
    prisma.item.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        brand: true,
        slug: true,
        images: true,
        dailyRate: true,
        weeklyRate: true,
        monthlyRate: true,
        depositAmount: true,
        retailPrice: true,
        available: true,
        referenceNumber: true,
        rentals: {
          where: { status: { in: ["PENDING", "CONFIRMED", "ACTIVE"] } },
          select: { startDate: true, endDate: true },
          orderBy: { startDate: "asc" },
        },
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true },
    }),
  ]);

  if (!item) notFound();

  if (!item.available) {
    redirect(`/catalog/${slug}`);
  }

  const bookedRanges = item.rentals.map((r) => ({
    start: r.startDate.toISOString().split("T")[0],
    end: r.endDate.toISOString().split("T")[0],
  }));

  const { rentals: _removed, ...itemData } = item;

  return (
    <BookingForm
      item={itemData}
      bookedRanges={bookedRanges}
      kycStatus={user?.kycStatus ?? "UNVERIFIED"}
    />
  );
}
