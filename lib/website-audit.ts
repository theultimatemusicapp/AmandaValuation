import { load } from 'cheerio';
import { lookup } from 'dns/promises';
import { setTimeout as delay } from 'timers/promises';
import net from 'net';

export type WebsiteAuditMetrics = {
    mrr?: number;
    monthlyGrowthRate?: number;
    yoyGrowthRate?: number;
    grossMargin?: number;
    churnRate?: number;
    cac?: number;
    ltv?: number;
    teamSize?: string;
    runwayMonths?: number;
    notes?: string;
};

export type WebsiteAuditIssue = {
    title: string;
    impact: number;
    evidence: string;
    fix: string;
};

export type WebsiteAuditResult = {
    url: string;
    crawledPages: string[];
    scores: {
        overall: number;
        positioning: number;
        conversion: number;
        trust: number;
        seo: number;
        performance: number;
        investor: number;
    };
    issues: WebsiteAuditIssue[];
    quickWins: string[];
    mediumLifts: string[];
    bigBets: string[];
    valuation: {
        status: 'computed' | 'insufficient_data';
        low: number | null;
        base: number | null;
        high: number | null;
        assumptions: string[];
        sensitivity: string[];
    };
    toolCtas: { label: string; href: string; why: string }[];
};

type PageSignals = {
    url: string;
    title: string | null;
    metaDescription: string | null;
    canonical: string | null;
    robots: string | null;
    viewport: string | null;
    h1Count: number;
    h2Count: number;
    internalLinks: number;
    hasPricing: boolean;
    hasCta: boolean;
    trustSignals: string[];
    hasTerms: boolean;
    hasPrivacy: boolean;
};

type RobotsRules = {
    disallow: string[];
};

const USER_AGENT = 'SaaSValuationWebsiteAuditBot/1.0 (+https://saasvaluation.app)';
const REQUEST_TIMEOUT_MS = 8000;
const MAX_PAGES = 5;
const MAX_REDIRECTS = 4;
const RATE_LIMIT_MS = 250;

const CTA_KEYWORDS = [
    'get started',
    'start free',
    'book demo',
    'request demo',
    'contact sales',
    'contact us',
    'sign up',
    'start trial',
    'free trial',
    'schedule',
    'talk to sales',
    'get a demo',
    'join now',
    'pricing',
];

const TRUST_KEYWORDS = [
    'trusted by',
    'testimonial',
    'case study',
    'reviews',
    'rated',
    'security',
    'compliance',
    'soc 2',
    'soc2',
    'iso 27001',
    'gdpr',
    'hipaa',
    'privacy',
    'terms',
    'partner',
    'customers',
];

const LINK_PRIORITIES = [
    { keyword: 'pricing', score: 5 },
    { keyword: 'plan', score: 4 },
    { keyword: 'product', score: 4 },
    { keyword: 'features', score: 4 },
    { keyword: 'platform', score: 3 },
    { keyword: 'solutions', score: 3 },
    { keyword: 'about', score: 3 },
    { keyword: 'company', score: 3 },
    { keyword: 'team', score: 3 },
    { keyword: 'blog', score: 2 },
    { keyword: 'resources', score: 2 },
];

const DISALLOWED_HOSTNAMES = new Set(['localhost']);

export function normalizeUrl(input: string): URL {
    const trimmed = input.trim();
    if (!trimmed) {
        throw new Error('URL is required');
    }

    const url = new URL(trimmed);
    if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Only http and https URLs are allowed');
    }
    if (url.username || url.password) {
        throw new Error('Credentials in URL are not allowed');
    }

    const hostname = url.hostname.toLowerCase();
    if (DISALLOWED_HOSTNAMES.has(hostname) || hostname.endsWith('.local')) {
        throw new Error('Localhost and .local domains are not allowed');
    }

    if (net.isIP(hostname)) {
        if (isPrivateIp(hostname)) {
            throw new Error('Private or loopback IPs are not allowed');
        }
    }

    return url;
}

export async function assertSafeHost(url: URL) {
    const hostname = url.hostname;
    if (net.isIP(hostname)) {
        return;
    }

    const lookupPromise = lookup(hostname, { all: true, verbatim: true });
    const results = await Promise.race([
        lookupPromise,
        delay(2000).then(() => {
            throw new Error('DNS lookup timeout');
        }),
    ]);

    for (const record of results) {
        if (isPrivateIp(record.address)) {
            throw new Error('DNS resolves to a private IP');
        }
    }
}

function isPrivateIp(ip: string): boolean {
    if (net.isIP(ip) === 4) {
        const [a, b, c, d] = ip.split('.').map(part => Number(part));
        if ([a, b, c, d].some(part => Number.isNaN(part))) {
            return true;
        }
        if (a === 10 || a === 127 || a === 0) return true;
        if (a === 169 && b === 254) return true;
        if (a === 172 && b >= 16 && b <= 31) return true;
        if (a === 192 && b === 168) return true;
        if (a === 100 && b >= 64 && b <= 127) return true;
        if (a === 192 && b === 0 && c === 0) return true;
        if (a === 198 && (b === 18 || b === 19)) return true;
        if (a === 255 && b === 255 && c === 255 && d === 255) return true;
        return false;
    }

    if (net.isIP(ip) === 6) {
        const normalized = ip.toLowerCase();
        if (normalized === '::1') return true;
        if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
        if (normalized.startsWith('fe80')) return true;
        if (normalized === '::') return true;
        return false;
    }

    return true;
}

async function fetchWithRedirects(startUrl: URL): Promise<{ url: URL; html: string }> {
    let current = startUrl;

    for (let i = 0; i <= MAX_REDIRECTS; i += 1) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        const response = await fetch(current.toString(), {
            method: 'GET',
            headers: { 'User-Agent': USER_AGENT },
            redirect: 'manual',
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('location');
            if (!location) {
                throw new Error('Redirect without location');
            }
            const nextUrl = new URL(location, current);
            normalizeUrl(nextUrl.toString());
            await assertSafeHost(nextUrl);
            current = nextUrl;
            continue;
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} for ${current.toString()}`);
        }

        const html = await response.text();
        return { url: current, html };
    }

    throw new Error('Too many redirects');
}

function parseRobots(content: string): RobotsRules {
    const lines = content.split('\n').map(line => line.trim());
    let currentApplies = false;
    const disallow: string[] = [];

    for (const line of lines) {
        if (!line || line.startsWith('#')) continue;
        const [directive, value] = line.split(':').map(part => part.trim());
        if (!directive || !value) continue;

        if (directive.toLowerCase() === 'user-agent') {
            currentApplies = value === '*' || value.toLowerCase().includes('saasvaluation');
            continue;
        }

        if (currentApplies && directive.toLowerCase() === 'disallow') {
            if (value !== '/') {
                disallow.push(value);
            } else {
                disallow.push('/');
            }
        }
    }

    return { disallow };
}

function isAllowedByRobots(pathname: string, rules: RobotsRules | null): boolean {
    if (!rules) return true;
    if (rules.disallow.includes('/')) return false;
    return !rules.disallow.some(rule => pathname.startsWith(rule));
}

function extractSignals(url: string, html: string): PageSignals {
    const $ = load(html);
    const title = $('title').first().text().trim() || null;
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() || null;
    const canonical = $('link[rel="canonical"]').attr('href')?.trim() || null;
    const robots = $('meta[name="robots"]').attr('content')?.trim() || null;
    const viewport = $('meta[name="viewport"]').attr('content')?.trim() || null;
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;

    const bodyText = $('body').text().replace(/\s+/g, ' ').toLowerCase();
    const trustSignals = TRUST_KEYWORDS.filter(keyword => bodyText.includes(keyword));

    const ctaFound = findCta($);
    const internalLinks = $('a[href]').filter((_, el) => {
        const href = $(el).attr('href') ?? '';
        return href.startsWith('/') || href.includes(new URL(url).hostname);
    }).length;

    const hasTerms = $('a[href*="terms"], a[href*="privacy"], a[href*="legal"]').length > 0;
    const hasPrivacy = $('a[href*="privacy"]').length > 0;
    const hasPricing = bodyText.includes('pricing') || $('a[href*="pricing"], a[href*="/plans"]').length > 0;

    return {
        url,
        title,
        metaDescription,
        canonical,
        robots,
        viewport,
        h1Count,
        h2Count,
        internalLinks,
        hasPricing,
        hasCta: ctaFound,
        trustSignals,
        hasTerms,
        hasPrivacy,
    };
}

function findCta($: ReturnType<typeof load>) {
    const ctaTexts = ['button', 'a']
        .flatMap(selector => $(selector).toArray())
        .map(el => $(el).text().trim().toLowerCase())
        .filter(Boolean);

    return ctaTexts.some(text => CTA_KEYWORDS.some(keyword => text.includes(keyword)));
}

function extractInternalLinks(base: URL, html: string): string[] {
    const $ = load(html);
    const links = new Set<string>();

    $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href) return;
        if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

        try {
            const url = new URL(href, base);
            if (url.hostname !== base.hostname) return;
            url.hash = '';
            links.add(url.toString());
        } catch {
            return;
        }
    });

    return [...links];
}

function rankLink(url: string): number {
    const path = new URL(url).pathname.toLowerCase();
    let score = 0;
    for (const entry of LINK_PRIORITIES) {
        if (path.includes(entry.keyword)) {
            score = Math.max(score, entry.score);
        }
    }
    return score;
}

async function checkTextEndpoint(url: URL): Promise<{ ok: boolean; text: string | null }> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: { 'User-Agent': USER_AGENT },
            signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!response.ok) return { ok: false, text: null };
        const text = await response.text();
        return { ok: true, text };
    } catch {
        return { ok: false, text: null };
    }
}

export async function runWebsiteAudit(url: URL, metrics?: WebsiteAuditMetrics): Promise<WebsiteAuditResult> {
    await assertSafeHost(url);

    const homeUrl = new URL('/', url);
    const queue = new Set<string>([url.toString()]);
    if (homeUrl.toString() !== url.toString()) {
        queue.add(homeUrl.toString());
    }

    const crawled = new Set<string>();
    const pages: PageSignals[] = [];

    const robotsUrl = new URL('/robots.txt', url);
    const sitemapUrl = new URL('/sitemap.xml', url);
    const robotsResponse = await checkTextEndpoint(robotsUrl);
    const sitemapResponse = await checkTextEndpoint(sitemapUrl);
    const robotsRules = robotsResponse.ok && robotsResponse.text ? parseRobots(robotsResponse.text) : null;

    while (queue.size > 0 && pages.length < MAX_PAGES) {
        const [next] = queue;
        queue.delete(next);
        if (crawled.has(next)) continue;

        const nextUrl = new URL(next);
        if (!isAllowedByRobots(nextUrl.pathname, robotsRules) && next !== url.toString()) {
            crawled.add(next);
            continue;
        }

        try {
            const { url: finalUrl, html } = await fetchWithRedirects(nextUrl);
            const signals = extractSignals(finalUrl.toString(), html);
            pages.push(signals);
            crawled.add(next);

            const internalLinks = extractInternalLinks(finalUrl, html)
                .filter(link => !crawled.has(link) && !queue.has(link));

            internalLinks
                .sort((a, b) => rankLink(b) - rankLink(a))
                .slice(0, 8)
                .forEach(link => queue.add(link));

            await delay(RATE_LIMIT_MS);
        } catch {
            crawled.add(next);
        }
    }

    return buildAuditResult(url, pages, {
        robotsPresent: robotsResponse.ok,
        sitemapPresent: sitemapResponse.ok,
    }, metrics);
}

function buildAuditResult(
    url: URL,
    pages: PageSignals[],
    siteSignals: { robotsPresent: boolean; sitemapPresent: boolean },
    metrics?: WebsiteAuditMetrics,
): WebsiteAuditResult {
    const combinedTextSignals = pages.flatMap(page => page.trustSignals);
    const uniqueTrustSignals = Array.from(new Set(combinedTextSignals));

    const positioningScore = clampScore(30 + (pages.some(page => page.h1Count > 0) ? 30 : 0)
        + (pages.some(page => page.title) ? 20 : 0)
        + (pages.some(page => page.metaDescription) ? 20 : 0));

    const conversionScore = clampScore(20
        + (pages.some(page => page.hasCta) ? 40 : 0)
        + (pages.some(page => page.hasPricing) ? 20 : 0)
        + (pages.some(page => page.internalLinks >= 5) ? 20 : 0));

    const trustScore = clampScore(20
        + Math.min(uniqueTrustSignals.length * 8, 40)
        + (pages.some(page => page.hasTerms) ? 20 : 0)
        + (pages.some(page => page.hasPrivacy) ? 20 : 0));

    const seoScore = clampScore(20
        + (pages.some(page => page.title) ? 20 : 0)
        + (pages.some(page => page.metaDescription) ? 20 : 0)
        + (pages.some(page => page.canonical) ? 15 : 0)
        + (pages.some(page => page.h1Count === 1) ? 15 : 0)
        + (pages.some(page => page.viewport) ? 10 : 0)
        + (siteSignals.robotsPresent ? 10 : 0)
        + (siteSignals.sitemapPresent ? 10 : 0));

    const performanceScore = 0;

    const investorScore = clampScore(30
        + (metrics?.grossMargin ? Math.min(Math.max((metrics.grossMargin - 60) * 0.8, 0), 25) : 10)
        + (metrics?.churnRate ? Math.max(20 - metrics.churnRate * 2, 0) : 10)
        + (metrics?.runwayMonths ? Math.min(metrics.runwayMonths * 1.5, 25) : 10));

    const overallScore = clampScore(
        Math.round((positioningScore + conversionScore + trustScore + seoScore + performanceScore + investorScore) / 6),
    );

    const issues = buildIssues(pages, siteSignals, metrics);
    const quickWins = buildQuickWins(pages, siteSignals, metrics);
    const mediumLifts = buildMediumLifts(pages);
    const bigBets = buildBigBets(metrics);

    const valuation = buildValuation(metrics);

    return {
        url: url.toString(),
        crawledPages: pages.map(page => page.url),
        scores: {
            overall: overallScore,
            positioning: positioningScore,
            conversion: conversionScore,
            trust: trustScore,
            seo: seoScore,
            performance: performanceScore,
            investor: investorScore,
        },
        issues,
        quickWins,
        mediumLifts,
        bigBets,
        valuation,
        toolCtas: [
            {
                label: 'Risk Assessment',
                href: '/resources/tools-calculators/risk-assessment',
                why: 'Quantify diligence red flags that could cut your multiple.',
            },
            {
                label: 'Smart Audit',
                href: '/resources/tools-calculators/smart-audit',
                why: 'Scan pitch decks and docs for deal-killing gaps.',
            },
            {
                label: 'Churn Calculator',
                href: '/resources/tools-calculators/churn-calculator',
                why: 'Benchmark logo + revenue churn before buyers do.',
            },
            {
                label: 'LTV / CAC Calculator',
                href: '/resources/tools-calculators/ltv-cac-calculator',
                why: 'Check unit economics and payback health.',
            },
            {
                label: 'Burn Rate & Runway',
                href: '/resources/tools-calculators/burn-rate-calculator',
                why: 'Model runway and capital timing for investor confidence.',
            },
            {
                label: 'Get a free valuation',
                href: '/#free-valuation',
                why: 'Run the full valuation engine with your real numbers.',
            },
            {
                label: 'Upgrade to Pro',
                href: '/pro',
                why: 'Generate a full diligence-ready valuation report.',
            },
        ],
    };
}

function buildIssues(pages: PageSignals[], siteSignals: { robotsPresent: boolean; sitemapPresent: boolean }, metrics?: WebsiteAuditMetrics): WebsiteAuditIssue[] {
    const issues: WebsiteAuditIssue[] = [];
    if (!pages.some(page => page.h1Count > 0)) {
        issues.push({
            title: 'Missing primary H1 headline',
            impact: 5,
            evidence: 'No H1 tag found on the scanned pages.',
            fix: 'Add a single, benefit-led H1 that clearly states who you help and the outcome.',
        });
    }

    if (pages.some(page => page.h1Count > 1)) {
        issues.push({
            title: 'Multiple H1 tags detected',
            impact: 3,
            evidence: 'One or more pages include more than one H1.',
            fix: 'Consolidate to a single H1 and use H2s for supporting sections.',
        });
    }

    if (!pages.some(page => page.metaDescription)) {
        issues.push({
            title: 'Meta descriptions missing',
            impact: 3,
            evidence: 'No meta description detected on key pages.',
            fix: 'Write 140–160 character descriptions that highlight the main benefit and audience.',
        });
    }

    if (!pages.some(page => page.canonical)) {
        issues.push({
            title: 'Canonical tags missing',
            impact: 2,
            evidence: 'Canonical link tags were not detected.',
            fix: 'Add rel="canonical" tags to prevent duplicate content issues.',
        });
    }

    if (!siteSignals.sitemapPresent) {
        issues.push({
            title: 'Sitemap.xml not detected',
            impact: 2,
            evidence: 'No sitemap found at /sitemap.xml.',
            fix: 'Publish a sitemap and reference it in robots.txt for better crawl coverage.',
        });
    }

    if (!siteSignals.robotsPresent) {
        issues.push({
            title: 'Robots.txt not detected',
            impact: 2,
            evidence: 'No robots.txt found at /robots.txt.',
            fix: 'Add a robots.txt file to control crawling and reference your sitemap.',
        });
    }

    if (!pages.some(page => page.hasCta)) {
        issues.push({
            title: 'Primary CTA is unclear',
            impact: 5,
            evidence: 'Buttons or links do not consistently mention a clear CTA.',
            fix: 'Add a high-contrast CTA like “Book a demo” or “Start free trial” above the fold.',
        });
    }

    if (!pages.some(page => page.hasTerms && page.hasPrivacy)) {
        issues.push({
            title: 'Trust/legal links are missing',
            impact: 4,
            evidence: 'Terms and Privacy links were not found consistently.',
            fix: 'Add Terms and Privacy links in the footer across all pages.',
        });
    }

    if (pages.every(page => page.trustSignals.length === 0)) {
        issues.push({
            title: 'Limited trust signals',
            impact: 4,
            evidence: 'No testimonials, security, or customer proof detected.',
            fix: 'Add customer logos, case studies, and security badges near CTAs.',
        });
    }

    if (pages.some(page => page.robots?.toLowerCase().includes('noindex'))) {
        issues.push({
            title: 'Noindex tag detected',
            impact: 5,
            evidence: 'A meta robots tag contains “noindex”.',
            fix: 'Remove noindex from public pages you want ranking.',
        });
    }

    if (metrics?.runwayMonths !== undefined && metrics.runwayMonths < 6) {
        issues.push({
            title: 'Runway under 6 months',
            impact: 5,
            evidence: `Runway entered: ${metrics.runwayMonths} months.`,
            fix: 'Cut burn, improve collections, or start fundraising immediately.',
        });
    }

    issues.push({
        title: 'Performance audit not run',
        impact: 2,
        evidence: 'Lighthouse data was not collected in this MVP.',
        fix: 'Run a Lighthouse audit and focus on Core Web Vitals improvements.',
    });

    return issues.sort((a, b) => b.impact - a.impact).slice(0, 8);
}

function buildQuickWins(pages: PageSignals[], siteSignals: { robotsPresent: boolean; sitemapPresent: boolean }, metrics?: WebsiteAuditMetrics): string[] {
    const wins: string[] = [];
    if (!pages.some(page => page.hasCta)) {
        wins.push('Add a single primary CTA above the fold and in the header.');
    }
    if (!pages.some(page => page.metaDescription)) {
        wins.push('Write meta descriptions for home, pricing, and product pages.');
    }
    if (!siteSignals.sitemapPresent) {
        wins.push('Publish /sitemap.xml and submit it to Google Search Console.');
    }
    if (!pages.some(page => page.hasTerms && page.hasPrivacy)) {
        wins.push('Add Terms and Privacy links in the global footer.');
    }
    if (metrics?.runwayMonths !== undefined && metrics.runwayMonths < 9) {
        wins.push('Share runway targets and fundraising milestones on the About or Investor page.');
    }
    if (wins.length === 0) {
        wins.push('Tighten your hero headline to call out the ICP and the measurable outcome.');
    }
    return wins.slice(0, 4);
}

function buildMediumLifts(pages: PageSignals[]): string[] {
    const lifts = ['Build a pricing page with clear packaging, ROI proof, and FAQ.'];
    if (pages.every(page => page.trustSignals.length === 0)) {
        lifts.push('Collect 2–3 customer testimonials and add a “Trusted by” logo strip.');
    }
    lifts.push('Create a comparison page against the top competitor to clarify differentiation.');
    return lifts.slice(0, 4);
}

function buildBigBets(metrics?: WebsiteAuditMetrics): string[] {
    const bets = ['Launch a buyer-focused narrative deck (Problem → Proof → Metrics → Risk plan).'];
    if (metrics?.churnRate && metrics.churnRate > 5) {
        bets.push('Invest in onboarding and lifecycle programs to cut churn by 1–2 points.');
    }
    bets.push('Build a security/QA page with compliance roadmap for enterprise buyers.');
    return bets.slice(0, 3);
}

function buildValuation(metrics?: WebsiteAuditMetrics) {
    if (!metrics?.mrr) {
        return {
            status: 'insufficient_data' as const,
            low: null,
            base: null,
            high: null,
            assumptions: [
                'Provide MRR (and ideally growth + churn) for a meaningful valuation range.',
            ],
            sensitivity: ['Valuation ranges tighten once ARR, growth, and churn are known.'],
        };
    }

    const arr = metrics.mrr * 12;
    let multiple = 3;

    if (metrics.monthlyGrowthRate !== undefined) {
        multiple += growthMultiplier(metrics.monthlyGrowthRate, 'monthly');
    } else if (metrics.yoyGrowthRate !== undefined) {
        multiple += growthMultiplier(metrics.yoyGrowthRate, 'yoy');
    }

    if (metrics.churnRate !== undefined) {
        multiple += churnMultiplier(metrics.churnRate);
    }

    if (metrics.grossMargin !== undefined) {
        multiple += marginMultiplier(metrics.grossMargin);
    }

    multiple = clamp(multiple, 1.5, 12);

    const low = Math.round(arr * multiple * 0.8);
    const base = Math.round(arr * multiple);
    const high = Math.round(arr * multiple * 1.25);

    return {
        status: 'computed' as const,
        low,
        base,
        high,
        assumptions: [
            `ARR calculated as MRR × 12 = ${arr.toLocaleString()}.`,
            `Multiple derived from growth, churn, and margin inputs (${multiple.toFixed(1)}x).`,
            'Range assumes stable retention and no major customer concentration issues.',
        ],
        sensitivity: [
            'Reducing churn by 1% can add roughly 0.3–0.6x to the multiple.',
            'Improving gross margin by 5 points can add ~0.2–0.4x.',
        ],
    };
}

function growthMultiplier(value: number, mode: 'monthly' | 'yoy') {
    if (mode === 'monthly') {
        if (value >= 10) return 2;
        if (value >= 5) return 1.5;
        if (value >= 2) return 0.8;
        if (value >= 0) return 0.2;
        return -0.8;
    }

    if (value >= 100) return 2;
    if (value >= 50) return 1.5;
    if (value >= 20) return 0.8;
    if (value >= 0) return 0.2;
    return -0.8;
}

function churnMultiplier(value: number) {
    if (value <= 2) return 1;
    if (value <= 4) return 0.5;
    if (value <= 7) return 0;
    if (value <= 10) return -0.7;
    return -1.2;
}

function marginMultiplier(value: number) {
    if (value >= 85) return 1;
    if (value >= 75) return 0.6;
    if (value >= 65) return 0.2;
    if (value >= 55) return -0.2;
    return -0.6;
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function clampScore(value: number) {
    return Math.min(Math.max(Math.round(value), 0), 100);
}
