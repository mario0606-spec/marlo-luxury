import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { LanguageToggle } from "@/components/language-toggle";

export async function Nav() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  return (
    <nav className="border-b border-stone-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl tracking-widest font-light lowercase" aria-label="marianni home">
          marianni
        </Link>
        <div className="flex items-center gap-6 text-sm tracking-wider uppercase">
          <Link href="/catalog" className="text-stone-600 hover:text-stone-900">
            Kollektion
          </Link>
          <Link href="/stories" className="text-stone-600 hover:text-stone-900">
            Stories
          </Link>
          {session ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="text-stone-600 hover:text-stone-900">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="text-stone-600 hover:text-stone-900">
                Mein Konto
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="text-stone-600 hover:text-stone-900"
                >
                  Abmelden
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-stone-600 hover:text-stone-900">
                Anmelden
              </Link>
              <Link href="/auth/signup" className="btn-primary py-2">
                Beitreten
              </Link>
            </>
          )}
          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
}
