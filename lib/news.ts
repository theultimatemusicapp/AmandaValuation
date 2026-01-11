export type NewsItem = {
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
  score?: number;
};

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

  if (BLOCK_KEYWORDS.some(keyword => text.includes(keyword))) {
    return false;
  }

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
  const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' }, next: { revalidate: 0 } });
  if (!response.ok) {
    throw new Error(`Failed fetch ${url}: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' }, next: { revalidate: 0 } });
  if (!response.ok) {
    throw new Error(`Failed fetch ${url}: ${response.status}`);
  }
  return response.text();
}

export function parseRssItems(xml: string): Array<{ title: string; link: string; pubDate?: string }> {
  const items: Array<{ title: string; link: string; pubDate?: string }> = [];
  const itemBlocks = xml.split('<item').slice(1).map(block => `<item${block}`);

  for (const block of itemBlocks) {
    const title = matchTag(block, 'title');
    const link = matchTag(block, 'link');
    const pubDate = matchTag(block, 'pubDate') || matchTag(block, 'published');

    if (title && link) {
      items.push({ title: decodeHtml(title), link: decodeHtml(link), pubDate });
    }
  }

  return items;
}

function matchTag(xml: string, tag: string) {
  const regex = new RegExp(`<${tag}[^>]*>([\s\S]*?)<\/${tag}>`, 'i');
  const match = xml.match(regex);
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
  if (!dateStr) {
    return undefined;
  }
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
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
          const item = await fetchJson<{ id: number; title: string; url?: string; time?: number; score?: number; type?: string }>(
            `${HN_ITEM_URL}/${id}.json`,
          );
          if (!item || item.type !== 'story') {
            return null;
          }

          const title = String(item.title || '').trim();
          const url = normalizeUrl(item.url || `https://news.ycombinator.com/item?id=${item.id}`);
          if (!title || !isRelevant(title, url)) {
            return null;
          }

          return {
            title,
            url,
            source: 'Hacker News',
            publishedAt: item.time ? new Date(item.time * 1000).toISOString() : undefined,
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

export const fetchAllNews = async () => {
  const [hnItems, techmemeItems, ...redditItems] = await Promise.all([
    fetchHackerNews(),
    fetchRssFeed(TECHMEME_RSS, 'Techmeme'),
    ...REDDIT_RSS.map(feed => fetchRssFeed(feed.url, feed.source)),
  ]);

  const combined = [...hnItems, ...techmemeItems, ...redditItems.flat()];

  const deduped = new Map<string, NewsItem>();
  combined.forEach(item => {
    const normalizedUrl = normalizeUrl(item.url);
    if (!deduped.has(normalizedUrl)) {
      deduped.set(normalizedUrl, { ...item, url: normalizedUrl });
    }
  });

  return Array.from(deduped.values())
    .sort((a, b) => {
      const left = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const right = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return right - left;
    })
    .slice(0, LIMIT);
};
