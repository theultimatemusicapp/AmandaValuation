export type NewsItem = {
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
  score?: number;
};

export const DEMO_NEWS: NewsItem[] = [
  {
    title: 'SaaS pricing benchmarks: what top ARR companies charge in 2024',
    url: 'https://example.com/saas-news/pricing-benchmarks-2024',
    source: 'Demo',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'How AI copilots are changing B2B product roadmaps',
    url: 'https://example.com/saas-news/ai-copilots-b2b-roadmaps',
    source: 'Demo',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'The best SaaS onboarding flows we saw this quarter',
    url: 'https://example.com/saas-news/onboarding-flows-quarter',
    source: 'Demo',
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const ALLOW_KEYWORDS = [
  'saas',
  'startup',
  'founder',
  'mrr',
  'arr',
  'subscription',
  'pricing',
  'cloud',
  'devops',
  'api',
  'open source',
  'open-source',
  'security',
  'breach',
  'funding',
  'acquisition',
  'ipo',
  'ai',
  'llm',
  'gpt',
  'claude',
  'gemini',
  'automation',
  'b2b',
  'enterprise',
  'productivity',
  'crm',
  'erp',
];

const BLOCK_KEYWORDS = [
  'celebrity',
  'kardashian',
  'taylor swift',
  'football',
  'nba',
  'soccer',
  'minecraft',
  'fortnite',
  'movie trailer',
  'dating',
  'astrology',
];

const HN_TOP_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const HN_ITEM_URL = 'https://hacker-news.firebaseio.com/v0/item';
const TECHMEME_RSS = 'https://www.techmeme.com/feed.xml';
const REDDIT_RSS = [
  { url: 'https://www.reddit.com/r/SaaS/.rss', source: 'Reddit r/SaaS' },
  { url: 'https://www.reddit.com/r/startups/.rss', source: 'Reddit r/startups' },
];

const LIMIT = 20;

export function isRelevant(title: string, url: string) {
  const text = `${title} ${url}`.toLowerCase();

  if (BLOCK_KEYWORDS.some(keyword => text.includes(keyword))) return false;
  return ALLOW_KEYWORDS.some(keyword => text.includes(keyword));
}

export function normalizeUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    return url;
  }
}

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!response.ok) throw new Error(`Failed fetch ${url}: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!response.ok) throw new Error(`Failed fetch ${url}: ${response.status}`);
  return response.text();
}

/**
 * Minimal RSS parser (no extra deps).
 * It’s “good enough” for common RSS feeds.
 */
export function parseRssItems(xml: string): Array<{ title: string; link: string; pubDate?: string }> {
  const items: Array<{ title: string; link: string; pubDate?: string }> = [];
  const itemBlocks = xml.split('<item').slice(1).map(block => '<item' + block);

  for (const block of itemBlocks) {
    const title = matchTag(block, 'title');
    const link = matchTag(block, 'link');
    const pubDate = matchTag(block, 'pubDate') || matchTag(block, 'published');

    if (title && link) items.push({ title: decodeHtml(title), link: decodeHtml(link), pubDate });
  }
  return items;
}

function matchTag(xml: string, tag: string) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(re);
  return match?.[1]?.trim();
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function toIsoDate(dateStr?: string) {
  if (!dateStr) return undefined;
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

const fetchRssFeed = async (url: string, source: string) => {
  try {
    const xml = await fetchText(url);
    return parseRssItems(xml)
      .map(item => {
        const normalizedUrl = normalizeUrl(item.link);
        if (!isRelevant(item.title, normalizedUrl)) {
          return null;
        }
        return {
          title: item.title,
          url: normalizedUrl,
          source,
          publishedAt: toIsoDate(item.pubDate),
        } as NewsItem;
      })
      .filter(Boolean) as NewsItem[];
  } catch (error) {
    console.warn(`Failed to fetch RSS feed from ${url}`, error);
    return [] as NewsItem[];
  }
};

const fetchHackerNews = async () => {
  try {
    const ids = await fetchJson<number[]>(HN_TOP_STORIES_URL);
    const topIds = ids.slice(0, 30);

    const items = await Promise.all(
      topIds.map(async id => {
        try {
          const item = await fetchJson<Record<string, unknown>>(`${HN_ITEM_URL}/${id}.json`);
          if (!item || item.type !== 'story') {
            return null;
          }

          const title = String(item.title || '').trim();
          if (!title) {
            return null;
          }

          const url = normalizeUrl(
            typeof item.url === 'string' && item.url.length > 0
              ? item.url
              : `https://news.ycombinator.com/item?id=${item.id}`,
          );
          if (!isRelevant(title, url)) {
            return null;
          }

          const publishedAt = toIsoDate(
            typeof item.time === 'number' ? new Date(item.time * 1000).toISOString() : undefined,
          );

          return {
            title,
            url,
            source: 'Hacker News',
            publishedAt,
            score: typeof item.score === 'number' ? item.score : undefined,
          } as NewsItem;
        } catch (error) {
          console.warn(`Failed to fetch HN story ${id}`, error);
          return null;
        }
      }),
    );

    return items.filter(Boolean) as NewsItem[];
  } catch (error) {
    console.warn('Failed to fetch Hacker News stories', error);
    return [] as NewsItem[];
  }
};

const getPublishedTime = (value?: string) => {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const fetchAllNews = async () => {
  const [hnItems, techmemeItems, ...redditItems] = await Promise.all([
    fetchHackerNews(),
    fetchRssFeed(TECHMEME_RSS, 'Techmeme'),
    ...REDDIT_RSS.map(feed => fetchRssFeed(feed.url, feed.source)),
  ]);

  const combined = [...hnItems, ...techmemeItems, ...redditItems.flat()];
  if (combined.length === 0) {
    return DEMO_NEWS;
  }

  const deduped = new Map<string, NewsItem>();
  combined.forEach(item => {
    if (!deduped.has(item.url)) {
      deduped.set(item.url, item);
    }
  });

  return Array.from(deduped.values())
    .sort((a, b) => getPublishedTime(b.publishedAt) - getPublishedTime(a.publishedAt))
    .slice(0, LIMIT);
};
