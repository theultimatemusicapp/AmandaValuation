import { NextResponse } from 'next/server';
import { normalizeUrl, runWebsiteAudit, WebsiteAuditMetrics } from '@/lib/website-audit';

export const revalidate = 0;

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const urlInput = typeof payload?.url === 'string' ? payload.url : '';
        const url = normalizeUrl(urlInput);

        const metrics = parseMetrics(payload?.metrics);

        const result = await runWebsiteAudit(url, metrics);

        return NextResponse.json(result);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

function parseMetrics(input: any): WebsiteAuditMetrics | undefined {
    if (!input || typeof input !== 'object') return undefined;

    const metrics: WebsiteAuditMetrics = {
        mrr: toNumber(input.mrr),
        monthlyGrowthRate: toNumber(input.monthlyGrowthRate),
        yoyGrowthRate: toNumber(input.yoyGrowthRate),
        grossMargin: toNumber(input.grossMargin),
        churnRate: toNumber(input.churnRate),
        cac: toNumber(input.cac),
        ltv: toNumber(input.ltv),
        teamSize: typeof input.teamSize === 'string' ? input.teamSize : undefined,
        runwayMonths: toNumber(input.runwayMonths),
        notes: typeof input.notes === 'string' ? input.notes : undefined,
    };

    return metrics;
}

function toNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') return undefined;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return undefined;
    return parsed;
}
