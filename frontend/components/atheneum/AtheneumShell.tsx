"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import { IconClose, IconEdit, IconMenu } from "./icons";
import { AtheneumRightRail } from "./AtheneumRightRail";
import { AtheneumSearchBar } from "./AtheneumSearchBar";
import { AtheneumSidebar } from "./AtheneumSidebar";
import { NotificationMenu } from "./NotificationMenu";

const LG_MIN_PX = 1024;

export function AtheneumShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeNav = useCallback(() => setMobileNavOpen(false), []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onResize = () => {
      if (typeof window !== "undefined" && window.innerWidth >= LG_MIN_PX) {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  return (
    <div className="flex min-h-[100dvh] min-w-0 bg-background">
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] transition-opacity lg:hidden"
          aria-label="Close navigation menu"
          onClick={closeNav}
        />
      ) : null}

      <AtheneumSidebar mobileOpen={mobileNavOpen} onNavigate={closeNav} />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-56">
        <header className="sticky top-0 z-30 flex min-h-[3.25rem] flex-wrap items-center gap-2 border-b border-outline-variant/60 bg-surface/85 px-2 py-1.5 backdrop-blur-xl supports-[backdrop-filter]:bg-surface/70 sm:min-h-14 sm:gap-2 sm:px-3 md:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 touch-manipulation items-center justify-center rounded-[0.5rem] bg-surface-low text-on-surface transition hover:bg-surface-low/80 lg:hidden"
              aria-expanded={mobileNavOpen}
              aria-controls="atheneum-sidebar"
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              {mobileNavOpen ? (
                <IconClose className="h-5 w-5" />
              ) : (
                <IconMenu className="h-5 w-5" />
              )}
              <span className="sr-only">{mobileNavOpen ? "Close menu" : "Open menu"}</span>
            </button>
            <Suspense
              fallback={
                <div className="h-9 w-full max-w-2xl animate-pulse rounded-[0.5rem] bg-surface-low" aria-hidden />
              }
            >
              <AtheneumSearchBar />
            </Suspense>
          </div>
          <div className="ml-auto hidden shrink-0 items-center gap-1.5 sm:flex sm:gap-2 md:gap-3">
            <Link
              href="/login"
              className="hidden items-center gap-1 rounded-[0.5rem] bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover lg:inline-flex"
            >
              <span aria-hidden>+</span> New thread
            </Link>
            <NotificationMenu />
            <div className="flex items-center gap-1.5 rounded-[0.5rem] bg-surface-low py-0.5 pl-0.5 pr-2 md:gap-2 md:pr-2.5">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.5rem] bg-primary/10 text-xs font-bold text-primary"
                aria-hidden
              >
                G
              </div>
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-xs font-bold text-on-surface">Guest Reader</p>
                <p className="text-[0.65rem] text-on-surface-variant">Public session</p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-[min(100%,1600px)] flex-1 flex-col gap-4 px-2.5 py-4 sm:px-3 md:flex-row md:gap-5 md:px-5 md:py-5 lg:gap-6 lg:px-6">
          <div className="min-w-0 flex-1 pb-14 lg:pb-0">{children}</div>
          <AtheneumRightRail />
        </div>
      </div>

      <Link
        href="/login"
        className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] right-[max(0.75rem,env(safe-area-inset-right,0px))] z-30 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full bg-primary text-white shadow-float transition hover:bg-primary-hover hover:shadow-lg lg:hidden sm:bottom-6 sm:right-6 sm:h-12 sm:w-12"
        aria-label="New thread — sign in to post"
      >
        <IconEdit className="h-5 w-5" />
      </Link>
    </div>
  );
}
