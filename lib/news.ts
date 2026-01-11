import { load } from 'cheerio';

export type NewsItem = {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  score?: number;
};

const ALLOWLIST = [
  'saas',
  'startup',
  'startups',
  'software',
  'cloud',
  'enterprise',
  'b2b',
  'ai',
  'ml',
  'automation',
  'platform',
  'product',
  'growth',
  'revenue',
  'subscription',
  'recurring',
  'tech',
  'business',
  'fintech',
  'devtools',
  'security',
  'data',
  'analytics',
  'funding',
  'venture',
  'vc',
  'seed',
  'series',
  'acquisition',
  'launch',
  'founder',
  'api',
];

const BLOCKLIST = [
  'celebrity',
  'hollywood',
  'kardashian',
  'gossip',
  'music',
  'movie',
  'tv',
  'oscars',
  'sports',
  'soccer',
  'football',
  'nba',
  'nfl',
  'mlb',
  'nhl',
  'ufc',
  'politics',
  'election',
  'war',
  'crime',
];

const HN_TOP_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const HN_ITEM_URL = 'https://hacker-news.firebaseio.com/v0/item';
const TECHMEME_RSS = 'https://www.techmeme.com/feed.xml';
const REDDIT_RSS = [
  { url: 'https://www.reddit.com/r/SaaS/.rss', source: 'Reddit r/SaaS' },
  { url: 'https://www.reddit.com/r/startups/.rss', source: 'Reddit r/startups' },
];

const LIMIT = 20;

const matchesList = (title: string, list: string[]) => {
  const normalized = title.toLowerCase();
  return list.some(keyword => normalized.includes(keyword));
};

const isRelevant = (title: string) => {
  if (matchesList(title, BLOCKLIST)) {
    return false;
  }
  return matchesList(title, ALLOWLIST);
};

const toIsoDate = (value?: string | null) => {
  if (!value) {
    return new Date().toISOString();
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }
  return parsed.toISOString();
};

const parseRssItems = (xml: string, source: string): NewsItem[] => {
  const $ = load(xml, { xmlMode: true });
  const items: NewsItem[] = [];

  const feedItems = $('item');
  if (feedItems.length > 0) {
    feedItems.each((_, element) => {
      const title = $(element).find('title').first().text().trim();
      const url = $(element).find('link').first().text().trim();
      const publishedAt = toIsoDate(
        $(element).find('pubDate').first().text().trim() ||
          $(element).find('dc\\:date').first().text().trim(),
      );
      if (!title || !url || !isRelevant(title)) {
        return;
      }
      items.push({
        title,
        url,
        source,
        publishedAt,
      });
    });
    return items;
  }

  $('entry').each((_, element) => {
    const title = $(element).find('title').first().text().trim();
    const linkElement = $(element).find('link[rel="alternate"]').first();
    const url = (linkElement.attr('href') || $(element).find('link').first().attr('href') || '').trim();
    const publishedAt = toIsoDate(
      $(element).find('updated').first().text().trim() ||
        $(element).find('published').first().text().trim(),
    );
    if (!title || !url || !isRelevant(title)) {
      return;
    }
    items.push({
      title,
      url,
      source,
      publishedAt,
    });
  });

  return items;
};

const fetchRssFeed = async (url: string, source: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SaaSValuationBot/1.0',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return [] as NewsItem[];
    }

    const xml = await response.text();
    return parseRssItems(xml, source);
  } catch (error) {
    console.warn(`Failed to fetch RSS feed from ${url}`, error);
    return [] as NewsItem[];
  }
};

const fetchHackerNews = async () => {
  try {
    const response = await fetch(HN_TOP_STORIES_URL, { next: { revalidate: 0 } });
    if (!response.ok) {
      return [] as NewsItem[];
    }

    const ids = (await response.json()) as number[];
    const topIds = ids.slice(0, 30);

    const items = await Promise.all(
      topIds.map(async id => {
        try {
          const itemResponse = await fetch(`${HN_ITEM_URL}/${id}.json`, { next: { revalidate: 0 } });
          if (!itemResponse.ok) {
            return null;
          }
          const item = await itemResponse.json();
          if (!item || item.type !== 'story') {
            return null;
          }

          const title = String(item.title || '').trim();
          if (!title || !isRelevant(title)) {
            return null;
          }

          const url = item.url || `https://news.ycombinator.com/item?id=${item.id}`;
          const publishedAt = toIsoDate(item.time ? new Date(item.time * 1000).toISOString() : undefined);

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

export const fetchAllNews = async () => {
  const [hnItems, techmemeItems, ...redditItems] = await Promise.all([
    fetchHackerNews(),
    fetchRssFeed(TECHMEME_RSS, 'Techmeme'),
    ...REDDIT_RSS.map(feed => fetchRssFeed(feed.url, feed.source)),
  ]);

  const combined = [...hnItems, ...techmemeItems, ...redditItems.flat()];

  const deduped = new Map<string, NewsItem>();
  combined.forEach(item => {
    if (!deduped.has(item.url)) {
      deduped.set(item.url, item);
    }
  });

  return Array.from(deduped.values())
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, LIMIT);
};
