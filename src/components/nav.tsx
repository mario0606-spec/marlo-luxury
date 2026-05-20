"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface NavProps {
  isAdmin?: boolean;
  isSignedIn?: boolean;
  signOutAction?: () => Promise<void>;
}

export function Nav({ isAdmin, isSignedIn, signOutAction }: NavProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <nav
      className="border-b border-stone-200 bg-white sticky top-0 z-40"
      aria-label="Hauptnavigation"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl tracking-widest font-light uppercase focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
          aria-label="Marlo – zur Startseite"
        >
          Marlo
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6 text-sm tracking-wider uppercase list-none m-0 p-0">
          <li>
            <Link href="/catalog" className="text-stone-700 hover:text-stone-900 focus:outline-none focus:underline">
              Collection
            </Link>
          </li>
          <li>
            <Link href="/subscribe" className="text-stone-700 hover:text-stone-900 focus:outline-none focus:underline">
              Membership
            </Link>
          </li>
          <li>
            <Link href="/stories" className="text-stone-700 hover:text-stone-900 focus:outline-none focus:underline">
              Stories
            </Link>
          </li>
          {isSignedIn ? (
            <>
              {isAdmin && (
                <li>
                  <Link href="/admin" className="text-stone-700 hover:text-stone-900 focus:outline-none focus:underline">
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <Link href="/dashboard" className="text-stone-700 hover:text-stone-900 focus:outline-none focus:underline">
                  My Account
                </Link>
              </li>
              <li>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="text-stone-700 hover:text-stone-900 focus:outline-none focus:underline"
                  >
                    Sign Out
                  </button>
                </form>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/auth/signin" className="text-stone-700 hover:text-stone-900 focus:outline-none focus:underline">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="btn-primary py-2 min-h-[44px] flex items-center">
                  Join
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 rounded"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block w-6 h-px bg-stone-900 transition-transform duration-200 ${open ? "rotate-45 translate-y-[7px]" : ""}`}
          />
          <span
            className={`block w-6 h-px bg-stone-900 transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-px bg-stone-900 transition-transform duration-200 ${open ? "-rotate-45 -translate-y-[7px]" : ""}`}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="md:hidden border-t border-stone-200 bg-white"
        >
          <ul className="list-none m-0 p-0 flex flex-col">
            {[
              { label: "Collection", href: "/catalog" },
              { label: "Membership", href: "/subscribe" },
              { label: "Stories", href: "/stories" },
            ].map((item) => (
              <li key={item.href} className="border-b border-stone-100">
                <Link
                  href={item.href}
                  className="block px-4 py-4 text-sm tracking-wider uppercase text-stone-700 hover:text-stone-900 hover:bg-stone-50 focus:outline-none focus:bg-stone-50 min-h-[44px] flex items-center"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isSignedIn ? (
              <>
                {isAdmin && (
                  <li className="border-b border-stone-100">
                    <Link href="/admin" className="block px-4 py-4 text-sm tracking-wider uppercase text-stone-700 hover:text-stone-900 hover:bg-stone-50 focus:outline-none focus:bg-stone-50 min-h-[44px] flex items-center" onClick={() => setOpen(false)}>
                      Admin
                    </Link>
                  </li>
                )}
                <li className="border-b border-stone-100">
                  <Link href="/dashboard" className="block px-4 py-4 text-sm tracking-wider uppercase text-stone-700 hover:text-stone-900 hover:bg-stone-50 focus:outline-none focus:bg-stone-50 min-h-[44px] flex items-center" onClick={() => setOpen(false)}>
                    My Account
                  </Link>
                </li>
                <li>
                  <form action={signOutAction}>
                    <button type="submit" className="w-full text-left block px-4 py-4 text-sm tracking-wider uppercase text-stone-700 hover:text-stone-900 hover:bg-stone-50 focus:outline-none focus:bg-stone-50 min-h-[44px] flex items-center">
                      Sign Out
                    </button>
                  </form>
                </li>
              </>
            ) : (
              <>
                <li className="border-b border-stone-100">
                  <Link href="/auth/signin" className="block px-4 py-4 text-sm tracking-wider uppercase text-stone-700 hover:text-stone-900 hover:bg-stone-50 focus:outline-none focus:bg-stone-50 min-h-[44px] flex items-center" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </li>
                <li className="p-4">
                  <Link href="/auth/signup" className="btn-primary w-full justify-center min-h-[44px]" onClick={() => setOpen(false)}>
                    Join Waitlist
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
