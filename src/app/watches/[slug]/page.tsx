import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WatchSlugRedirect({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/catalog/${slug}`);
}
