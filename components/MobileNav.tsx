"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { MenuIcon, CloseIcon } from "@/components/icons";
import { NAV_LINKS } from "@/lib/nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="-mr-2 rounded-lg p-2 text-white/80 hover:text-white"
      >
        <MenuIcon className="h-6 w-6" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col bg-brand bg-grain p-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg text-white">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="-mr-2 rounded-lg p-2 text-white/80 hover:text-white"
                >
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-white/85 hover:bg-white/5 hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/#search"
                onClick={() => setOpen(false)}
                className="mt-auto rounded-lg bg-lime px-4 py-3 text-center text-sm font-semibold text-ink hover:bg-lime-strong"
              >
                Find my money
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
