'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { NewsItem } from '@/lib/news';

const MAX_ITEMS = 15;

type NewsResponse = {
  items: NewsItem[];
};

const formatDate = (value?: string) => {
  if (!value) {
    return 'Recent';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Recent';
  }
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function SaaSNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadNews = async () => {
      try {
        const response = await fetch('/api/news', { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Failed to load news');
        }
        const data = (await response.json()) as NewsResponse;
        if (isMounted) {
          setItems(data.items || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load news');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNews();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const visibleItems = useMemo(() => items.slice(0, MAX_ITEMS), [items]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading SaaS news…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!visibleItems.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">No SaaS headlines right now. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <ul className="space-y-4">
        {visibleItems.map(item => (
          <li key={`${item.source}-${item.url}`} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <Link
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-lg font-semibold text-slate-900 hover:text-teal-700 hover:underline"
              >
                {item.title}
              </Link>
              {typeof item.score === 'number' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {item.score} HN points
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span className="font-medium text-slate-600">{item.source}</span>
              <span className="text-slate-300">•</span>
              <span>{formatDate(item.publishedAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
