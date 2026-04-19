"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  IconBook,
  IconForum,
  IconGroups,
  IconHome,
  IconSettings,
} from "./icons";

const nav: {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { href: "/", label: "Home", Icon: IconHome },
  { href: "/announcements", label: "Research Threads", Icon: IconForum },
  { href: "/documents", label: "Library Resources", Icon: IconBook },
  { href: "/announcements?q=circles", label: "Scholarly Circles", Icon: IconGroups },
  { href: "/login", label: "Settings", Icon: IconSettings },
];

type AtheneumSidebarProps = {
  mobileOpen: boolean;
  onNavigate?: () => void;
};

export function AtheneumSidebar({ mobileOpen, onNavigate }: AtheneumSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      id="atheneum-sidebar"
      className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-[min(17rem,92vw)] max-w-[100vw] flex-col bg-surface-low transition-transform duration-200 ease-out will-change-transform lg:z-30 lg:w-56 lg:max-w-none lg:translate-x-0 lg:shadow-soft ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } `}
      aria-label="Main navigation"
    >
      <div className="shrink-0 border-b border-outline-variant/50 px-3 py-3 sm:px-4">
        <div className="mb-3 flex items-center gap-2">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.5rem] bg-gradient-to-br from-primary to-primary-container text-sm font-bold text-white shadow-sm"
            aria-hidden
          >
            L
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold leading-tight text-primary">Library Services</p>
          </div>
        </div>

        <div className="mb-3 flex gap-2 rounded-[0.5rem] bg-surface p-2 ring-1 ring-inset ring-outline-variant/80">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.5rem] bg-surface-low text-xs font-bold text-primary"
            aria-hidden
          >
            ST
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-on-surface">Student</p>
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.08em] text-on-surface-variant">
              Batangas State University
            </p>
          </div>
        </div>

        <Link
          href="/login"
          onClick={onNavigate}
          className="flex w-full items-center justify-center gap-1 rounded-[0.5rem] bg-primary py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover"
        >
          <span aria-hidden>+</span> New Thread
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-2 py-3 sm:px-3" aria-label="Primary">
        <p className="mb-1 px-2 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
          Navigate
        </p>
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : item.href.startsWith("#")
                ? false
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.Icon;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-2.5 rounded-[0.5rem] px-2.5 py-2 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.06em] transition-colors sm:gap-3 sm:text-[0.72rem] ${
                active
                  ? "bg-surface text-primary shadow-sm ring-1 ring-outline-variant/60"
                  : "text-on-surface-variant hover:bg-surface/80 hover:text-primary"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-[1.125rem] w-[1.125rem] shrink-0" />
              <span className="min-w-0 break-words leading-snug">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-outline-variant/50 p-2.5 sm:p-3">
        <div className="rounded-[0.5rem] bg-gradient-to-br from-primary to-primary-container p-3 text-white shadow-sm">
          <p className="mb-0.5 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-white/80">
            Pro tip
          </p>
          <p className="mb-2 font-sans text-[0.7rem] font-medium leading-snug text-white/95">
            Join a study circle to earn scholarly badges.
          </p>
          <Link
            href="/announcements"
            onClick={onNavigate}
            className="inline-flex w-full touch-manipulation items-center justify-center rounded-[0.5rem] bg-white/15 px-2 py-1.5 font-sans text-[0.65rem] font-bold backdrop-blur-sm transition hover:bg-white/25"
          >
            Explore groups
          </Link>
        </div>
      </div>
    </aside>
  );
}
