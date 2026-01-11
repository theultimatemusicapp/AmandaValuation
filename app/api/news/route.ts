import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/news';

const CACHE_TTL_MS = 30 * 60 * 1000;

let cachedData: { data: Awaited<ReturnType<typeof fetchAllNews>>; timestamp: number } | null = null;

export async function GET() {
  const now = Date.now();

  if (cachedData && now - cachedData.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({ items: cachedData.data, cached: true });
  }

  const items = await fetchAllNews();
  cachedData = { data: items, timestamp: now };

  return NextResponse.json({ items, cached: false });
}
