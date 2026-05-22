"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
    }
  }

  if (success) {
    return (
      <AuthLayout title="Check Your Email">
        <p className="text-stone-600 text-sm leading-relaxed text-center">
          We sent a verification link to <strong>{form.email}</strong>.<br />
          Click the link in that email to activate your account.
        </p>
        <div className="mt-8 text-center">
          <Link href="/auth/signin" className="text-sm text-stone-500 hover:text-stone-900 tracking-wider">
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">Full Name</label>
          <input
            type="text"
            className="input-field"
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            minLength={2}
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="jane@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input-field"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating Account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-stone-900 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
      <Link href="/" className="text-2xl tracking-widest font-light uppercase mb-12">
        marianni
      </Link>
      <div className="w-full max-w-md bg-white border border-stone-200 p-10">
        <h1 className="text-xl font-light tracking-wide mb-8 text-center">{title}</h1>
        {children}
      </div>
    </div>
  );
}
