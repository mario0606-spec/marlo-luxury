import { auth, signOut } from "@/lib/auth";
import { Nav } from "@/components/nav";

export async function NavServer() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const isSignedIn = !!session?.user;

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return <Nav isAdmin={isAdmin} isSignedIn={isSignedIn} signOutAction={handleSignOut} />;
}
