import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ serial?: string }>;
}

export default async function VerifyRedirect({ searchParams }: PageProps) {
  const { serial } = await searchParams;
  if (serial) {
    redirect(`/verify/${encodeURIComponent(serial)}`);
  }
  redirect("/authentifiziert");
}
