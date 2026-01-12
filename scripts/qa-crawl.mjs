#!/usr/bin/env node

const baseArg = process.argv[2];
const baseEnv = process.env.BASE_URL;
const baseUrl = baseArg || baseEnv || 'http://localhost:3000';

if (!/^https?:\/\//.test(baseUrl)) {
    console.error(`Base URL must start with http(s)://. Received: ${baseUrl}`);
    process.exit(2);
}

const origin = new URL(baseUrl).origin;

const normalizeUrl = (raw) => {
    const url = new URL(raw, origin);
    url.hash = '';
    if (url.pathname !== '/' && url.pathname.endsWith('/')) {
        url.pathname = url.pathname.replace(/\/+$/, '');
    }
    return url.toString();
};

const isSameOrigin = (raw) => {
    try {
        const url = new URL(raw, origin);
        return url.origin === origin;
    } catch {
        return false;
    }
};

const visited = new Map();
const inboundLinks = new Map();
const redirectChains = [];
const notFoundLinks = [];

const addInbound = (target, source) => {
    if (!inboundLinks.has(target)) {
        inboundLinks.set(target, new Set());
    }
    inboundLinks.get(target).add(source);
};

const linkRegex = /href=["']([^"']+)["']/gi;

const fetchWithRedirects = async (startUrl) => {
    let current = startUrl;
    const chain = [];

    for (let i = 0; i < 10; i += 1) {
        const res = await fetch(current, { redirect: 'manual' });
        const location = res.headers.get('location');
        if (res.status >= 300 && res.status < 400 && location) {
            const nextUrl = new URL(location, current).toString();
            chain.push({ from: current, to: nextUrl, status: res.status });
            current = nextUrl;
            continue;
        }
        return { response: res, finalUrl: current, chain };
    }

    return { response: null, finalUrl: current, chain };
};

const queue = [normalizeUrl(baseUrl)];
addInbound(normalizeUrl(baseUrl), '__seed__');

while (queue.length) {
    const url = queue.shift();
    if (visited.has(url)) {
        continue;
    }

    let result;
    try {
        result = await fetchWithRedirects(url);
    } catch (error) {
        visited.set(url, { status: 'error', error: error.message });
        continue;
    }

    const { response, finalUrl, chain } = result;
    if (chain.length >= 2) {
        redirectChains.push({ start: url, chain });
    }

    const status = response?.status ?? 0;
    visited.set(url, { status, finalUrl });

    if (status === 404) {
        const sources = inboundLinks.get(url) ? Array.from(inboundLinks.get(url)) : [];
        notFoundLinks.push({ url, sources });
        continue;
    }

    if (!response) {
        continue;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
        continue;
    }

    const html = await response.text();
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
        const rawLink = match[1].trim();
        if (!rawLink || rawLink.startsWith('#')) {
            continue;
        }
        if (/^(mailto:|tel:|javascript:)/i.test(rawLink)) {
            continue;
        }
        if (!isSameOrigin(rawLink)) {
            continue;
        }
        const absolute = normalizeUrl(new URL(rawLink, url).toString());
        addInbound(absolute, url);
        if (!visited.has(absolute)) {
            queue.push(absolute);
        }
    }
}

const sitemapUrl = `${origin}/sitemap.xml`;
let sitemapUrls = [];
try {
    const sitemapResponse = await fetch(sitemapUrl);
    if (sitemapResponse.ok) {
        const sitemapXml = await sitemapResponse.text();
        sitemapUrls = Array.from(sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)).map(match => normalizeUrl(match[1]));
    }
} catch {
    sitemapUrls = [];
}

const orphanUrls = sitemapUrls.filter((url) => {
    if (url === normalizeUrl(baseUrl)) {
        return false;
    }
    return !inboundLinks.has(url);
});

const summary = {
    totalCrawled: visited.size,
    totalNotFound: notFoundLinks.length,
    totalRedirectChains: redirectChains.length,
    totalOrphans: orphanUrls.length,
};

console.log('QA Crawl Summary');
console.log(JSON.stringify(summary, null, 2));

if (notFoundLinks.length) {
    console.log('\n404s detected:');
    notFoundLinks.forEach(({ url, sources }) => {
        console.log(`- ${url}`);
        sources.forEach(source => console.log(`  referenced from: ${source}`));
    });
}

if (redirectChains.length) {
    console.log('\nRedirect chains detected:');
    redirectChains.forEach(({ start, chain }) => {
        const chainSummary = chain.map(step => `${step.from} -> ${step.to} (${step.status})`).join(' | ');
        console.log(`- ${start}: ${chainSummary}`);
    });
}

if (orphanUrls.length) {
    console.log('\nOrphan pages (in sitemap, not linked):');
    orphanUrls.forEach((url) => console.log(`- ${url}`));
}

if (summary.totalNotFound || summary.totalRedirectChains || summary.totalOrphans) {
    process.exit(1);
}
