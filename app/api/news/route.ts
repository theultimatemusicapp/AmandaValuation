import { NextResponse } from 'next/server';
import {
  NewsItem,
  DEMO_NEWS,
  fetchJson,
  fetchText,
  isRelevant,
  normalizeUrl,
  parseRssItems,
  toIsoDate,
} from '@/lib/news';

// Simple in-memory cache (works on a single server instance)
let cache: { ts: number; data: NewsItem[] } | null = null;
const CACHE_MS = 30 * 60 * 1000; // 30 minutes

export const revalidate = 0; // don’t ISR cache this route

type HNItem = {
  id: number;
  title?: string;
  url?: string;
  score?: number;
  time?: number; // unix seconds
  type?: string;
};

export async function GET() {
  try {
    if (cache && Date.now() - cache.ts < CACHE_MS) {
      return NextResponse.json({ items: cache.data, cached: true });
    }

    const items: NewsItem[] = [];
    const errors: string[] = [];

    // 1) Hacker News top stories (free JSON)
    try {
      const topIds = await fetchJson<number[]>(
        'https://hacker-news.firebaseio.com/v0/topstories.json',
      );
      const slice = topIds.slice(0, 60);

      const hnDetails = await Promise.all(
        slice.map(async id => {
          try {
            const it = await fetchJson<HNItem>(
              `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
            );
            if (!it || it.type !== 'story') return null;
            if (!it.title) return null;

            // HN posts can be "Ask HN" without URL
            const url = it.url
              ? normalizeUrl(it.url)
              : `https://news.ycombinator.com/item?id=${id}`;

            if (!isRelevant(it.title, url)) return null;

            return {
              title: it.title,
              url,
              source: 'Hacker News',
              score: it.score ?? undefined,
              publishedAt: it.time ? new Date(it.time * 1000).toISOString() : undefined,
            } satisfies NewsItem;
          } catch {
            return null;
          }
        }),
      );

      items.push(...(hnDetails.filter(Boolean) as NewsItem[]));
    } catch (error: unknown) {
      errors.push(
        `HN: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    // 2) Reddit RSS (free)
    // Note: Reddit may occasionally rate limit. Cache helps.
    const redditFeeds = [
      { name: 'r/SaaS', url: 'https://www.reddit.com/r/SaaS/.rss' },
      { name: 'r/startups', url: 'https://www.reddit.com/r/startups/.rss' },
    ];

    for (const feed of redditFeeds) {
      try {
        const xml = await fetchText(feed.url);
        const rssItems = parseRssItems(xml);

        for (const r of rssItems.slice(0, 30)) {
          const url = normalizeUrl(r.link);
          if (!isRelevant(r.title, url)) continue;

          items.push({
            title: r.title,
            url,
            source: `Reddit ${feed.name}`,
            publishedAt: toIsoDate(r.pubDate),
          });
        }
      } catch (error: unknown) {
        errors.push(
          `${feed.name}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // 3) RSS feeds (free)
    const rssFeeds = [
      { name: 'Techmeme', url: 'https://www.techmeme.com/feed.xml' },
      { name: 'SaaStr', url: 'https://www.saastr.com/feed/' },
      { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
      { name: 'VentureBeat', url: 'https://venturebeat.com/feed/' },
    ];

    for (const feed of rssFeeds) {
      try {
        const xml = await fetchText(feed.url);
        const rssItems = parseRssItems(xml);

        for (const t of rssItems.slice(0, 40)) {
          const url = normalizeUrl(t.link);
          if (!isRelevant(t.title, url)) continue;

          items.push({
            title: t.title,
            url,
            source: feed.name,
            publishedAt: toIsoDate(t.pubDate),
          });
        }
      } catch (error: unknown) {
        errors.push(
          `${feed.name}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // Deduplicate by URL
    const seen = new Set<string>();
    const deduped = items.filter(it => {
      const key = it.url;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort newest first (fallback: keep HN order otherwise)
    deduped.sort((a, b) => {
      const at = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bt - at;
    });

    const finalItems = deduped.slice(0, 20);

    const output = finalItems.length > 0 ? finalItems : DEMO_NEWS;

    cache = { ts: Date.now(), data: output };

    return NextResponse.json({
      items: output,
      cached: false,
      demo: finalItems.length === 0,
      partialFailures: errors.length ? errors : undefined,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
