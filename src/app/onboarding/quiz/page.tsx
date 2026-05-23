import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { QuizForm } from "./quiz-form";

export const metadata = {
  title: "Your taste — Marlo",
  description: "A few questions to curate your first selection.",
};

export default async function OnboardingQuizPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/auth/signin?callbackUrl=/onboarding/quiz");

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-widest font-light uppercase">
            Marlo
          </Link>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <header className="mb-10">
          <p className="text-xs tracking-widest uppercase text-stone-500 mb-3">
            Welcome
          </p>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-stone-900 mb-3">
            Let&rsquo;s find your first watch.
          </h1>
          <p className="text-stone-500 leading-relaxed">
            Four short questions. We&rsquo;ll use your answers to curate three pieces
            we think you&rsquo;ll love.
          </p>
        </header>
        <QuizForm />
      </main>
    </div>
  );
}
