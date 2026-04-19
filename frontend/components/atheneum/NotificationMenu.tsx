"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { fetchNotifications, type NotificationRecord } from "@/src/services/apiClient";

import { IconBell } from "./icons";

export function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const { items: next, ok } = await fetchNotifications();
      setItems(next);
      setFailed(!ok);
    } catch {
      setFailed(true);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      void load();
    }
  }, [open, load]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-[0.5rem] p-2 text-on-surface-variant transition hover:bg-surface-low hover:text-primary"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="notification-panel"
        aria-label="Notifications"
      >
        <IconBell className="h-[1.125rem] w-[1.125rem]" />
      </button>
      {open ? (
        <div
          id="notification-panel"
          role="region"
          aria-label="Library notifications"
          className="absolute right-0 z-50 mt-1 w-[min(calc(100vw-2rem),18rem)] rounded-[0.5rem] border border-outline-variant bg-surface py-2 shadow-float ring-1 ring-outline-variant/40"
        >
          {loading ? (
            <p className="px-3 py-2 font-sans text-xs text-on-surface-variant">Loading…</p>
          ) : failed ? (
            <p className="px-3 py-2 font-sans text-xs text-on-surface-variant">
              Could not load notifications. Start the Django API and try again.
            </p>
          ) : items.length === 0 ? (
            <p className="px-3 py-2 font-sans text-xs text-on-surface-variant">No notifications yet.</p>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {items.map((n) => (
                <li key={n.id} className="border-b border-outline-variant/40 px-3 py-2 last:border-b-0">
                  <p className="font-sans text-xs font-semibold text-on-surface">{n.title}</p>
                  {n.body ? <p className="mt-0.5 font-sans text-[0.7rem] text-on-surface-variant">{n.body}</p> : null}
                  <p className="mt-1 font-sans text-[0.65rem] text-on-surface-variant/80">
                    {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
