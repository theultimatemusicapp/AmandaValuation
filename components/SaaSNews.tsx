"use client";

import { useEffect, useMemo, useState } from "react";
import { NewsItem } from "@/lib/news";

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

type SaaSNewsProps = {
  limit?: number;
  initialItems?: NewsItem[];
};

const COLUMN_SIZE = 5;

export default function SaaSNews({ limit = 10, initialItems = [] }: SaaSNewsProps) {
  const hasInitialItems = initialItems.length > 0;
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [loading, setLoading] = useState(!hasInitialItems);
  const [hasError, setHasError] = useState(false);
  const [isDemo, setIsDemo] = useState(
    hasInitialItems && initialItems.every(item => item.source === "Demo"),
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setHasError(false);
        if (!hasInitialItems) {
          setLoading(true);
        }
        const res = await fetch("/api/news", { cache: "no-store" });
        const data = await res.json();
        if (!alive) return;
        setItems(Array.isArray(data.items) ? data.items : []);
        setIsDemo(Boolean(data.demo));
      } catch {
        if (!alive) return;
        setHasError(true);
        if (hasInitialItems) setItems(initialItems);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [hasInitialItems, initialItems]);

  const visible = useMemo(() => items.slice(0, limit), [items, limit]);
  const columns = useMemo(() => {
    const left = visible.slice(0, COLUMN_SIZE);
    const right = visible.slice(COLUMN_SIZE, COLUMN_SIZE * 2);
    return [left, right];
  }, [visible]);

  return (
    <div className="w-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-neutral-900">Current SaaS News</h3>
        <span className="text-xs text-neutral-500">
          {loading ? "Updating…" : `Showing ${visible.length} items`}
        </span>
      </div>

      {hasError ? (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Live sources are temporarily unavailable. Showing the last available items.
        </div>
      ) : isDemo ? (
        <div className="mb-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-700">
          Showing demo headlines while live sources warm up.
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-neutral-600">Pulling fresh items from free sources…</div>
      ) : visible.length === 0 ? (
        <div className="text-sm text-neutral-600">
          No items right now. (Could be rate limiting — refresh later.)
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {columns.map((column, columnIndex) => (
            <ul key={`column-${columnIndex}`} className="space-y-3">
              {column.map((it) => (
                <li key={it.url} className="rounded-xl border border-neutral-100 p-3 hover:bg-neutral-50">
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm font-medium text-neutral-900 hover:underline"
                  >
                    {it.title}
                  </a>
                  <div className="mt-1 text-xs text-neutral-500">
                    {it.source}
                    {it.publishedAt ? ` • ${formatDate(it.publishedAt)}` : ""}
                    {typeof it.score === "number" ? ` • ${it.score} pts` : ""}
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      )}

      <div className="mt-4 text-xs text-neutral-500">
        Sources: Hacker News, Reddit RSS, Techmeme, SaaStr, TechCrunch, VentureBeat (filtered for SaaS/tech business).
      </div>
    </div>
  );
}
