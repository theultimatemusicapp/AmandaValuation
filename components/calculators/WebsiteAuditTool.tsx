'use client';

import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Clipboard, Loader2, AlertTriangle, Globe, CheckCircle2 } from 'lucide-react';
import type { WebsiteAuditResult } from '@/lib/website-audit';

const TEAM_SIZES = ['1-2', '3-5', '6-10', '11-25', '26-50', '50+'];

type GrowthMode = 'monthly' | 'yoy';

type AuditFormState = {
    url: string;
    mrr: string;
    growthRate: string;
    growthMode: GrowthMode;
    grossMargin: string;
    churnRate: string;
    cac: string;
    ltv: string;
    teamSize: string;
    runwayMonths: string;
    notes: string;
};

const initialForm: AuditFormState = {
    url: '',
    mrr: '',
    growthRate: '',
    growthMode: 'monthly',
    grossMargin: '',
    churnRate: '',
    cac: '',
    ltv: '',
    teamSize: TEAM_SIZES[0],
    runwayMonths: '',
    notes: '',
};

export default function WebsiteAuditTool() {
    const [form, setForm] = useState<AuditFormState>(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<WebsiteAuditResult | null>(null);
    const [copied, setCopied] = useState(false);

    const reportText = useMemo(() => (result ? buildReportText(result) : ''), [result]);

    const handleChange = (field: keyof AuditFormState) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setCopied(false);

        try {
            const metrics: Record<string, string | undefined> = {
                mrr: form.mrr || undefined,
                grossMargin: form.grossMargin || undefined,
                churnRate: form.churnRate || undefined,
                cac: form.cac || undefined,
                ltv: form.ltv || undefined,
                teamSize: form.teamSize || undefined,
                runwayMonths: form.runwayMonths || undefined,
                notes: form.notes || undefined,
            };

            if (form.growthRate) {
                if (form.growthMode === 'monthly') {
                    metrics.monthlyGrowthRate = form.growthRate;
                } else {
                    metrics.yoyGrowthRate = form.growthRate;
                }
            }

            const response = await fetch('/api/website-audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: form.url,
                    metrics,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Unable to run audit');
            }

            setResult(data as WebsiteAuditResult);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!reportText) return;
        try {
            await navigator.clipboard.writeText(reportText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-[1.1fr_1.4fr] gap-10 items-start">
            <div className="glass-card p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-brand-400" /> Audit Inputs
                </h3>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Website URL *</label>
                        <input
                            type="url"
                            required
                            value={form.url}
                            onChange={handleChange('url')}
                            placeholder="https://example.com"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">MRR ($)</label>
                            <input
                                type="number"
                                value={form.mrr}
                                onChange={handleChange('mrr')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Gross Margin %</label>
                            <input
                                type="number"
                                value={form.grossMargin}
                                onChange={handleChange('grossMargin')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Growth rate</label>
                            <input
                                type="number"
                                value={form.growthRate}
                                onChange={handleChange('growthRate')}
                                placeholder="e.g. 6"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Growth window</label>
                            <select
                                value={form.growthMode}
                                onChange={handleChange('growthMode')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            >
                                <option value="monthly">Monthly %</option>
                                <option value="yoy">Year-over-year %</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Churn % (monthly)</label>
                            <input
                                type="number"
                                value={form.churnRate}
                                onChange={handleChange('churnRate')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Runway (months)</label>
                            <input
                                type="number"
                                value={form.runwayMonths}
                                onChange={handleChange('runwayMonths')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">CAC ($)</label>
                            <input
                                type="number"
                                value={form.cac}
                                onChange={handleChange('cac')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">LTV ($)</label>
                            <input
                                type="number"
                                value={form.ltv}
                                onChange={handleChange('ltv')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Team size</label>
                            <select
                                value={form.teamSize}
                                onChange={handleChange('teamSize')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            >
                                {TEAM_SIZES.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
                            <input
                                type="text"
                                value={form.notes}
                                onChange={handleChange('notes')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-600 text-white font-bold hover:bg-brand-500 transition disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Running audit...
                            </>
                        ) : (
                            'Generate Website Audit'
                        )}
                    </button>

                    <p className="text-xs text-slate-500">
                        This crawler scans the provided URL and up to five internal pages while respecting robots.txt.
                    </p>
                </form>
            </div>

            <div className="space-y-6">
                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {!result && !error && (
                    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-300">
                        <h3 className="text-lg font-bold text-white mb-2">Your audit report will appear here.</h3>
                        <p className="text-sm text-slate-400">
                            Enter a public website URL and optional metrics to generate an investor-ready scorecard and action plan.
                        </p>
                    </div>
                )}

                {result && (
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm text-slate-400">Audit summary</p>
                                    <h3 className="text-2xl font-bold text-white">Overall score: {result.scores.overall}</h3>
                                    <p className="text-sm text-slate-400">URL: {result.url}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-200 hover:border-brand-400"
                                >
                                    <Clipboard className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy report'}
                                </button>
                            </div>
                            <div className="mt-6 grid md:grid-cols-3 gap-4">
                                <ScoreCard label="Positioning & clarity" score={result.scores.positioning} />
                                <ScoreCard label="Conversion & UX" score={result.scores.conversion} />
                                <ScoreCard label="Trust & credibility" score={result.scores.trust} />
                                <ScoreCard label="Technical SEO" score={result.scores.seo} />
                                <ScoreCard
                                    label="Performance"
                                    score={result.scores.performance}
                                    note={result.scores.performance === 0 ? 'Not run' : undefined}
                                />
                                <ScoreCard label="Investor readiness" score={result.scores.investor} />
                            </div>
                        </div>

                        <details className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40" open>
                            <summary className="text-lg font-bold text-white cursor-pointer">Top issues + fixes</summary>
                            <div className="mt-4 space-y-4">
                                {result.issues.map(issue => (
                                    <div key={issue.title} className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-white">{issue.title}</h4>
                                            <span className="text-xs uppercase text-slate-400">Impact {issue.impact}/5</span>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-2">Evidence: {issue.evidence}</p>
                                        <p className="text-sm text-slate-300 mt-2">Fix: {issue.fix}</p>
                                    </div>
                                ))}
                            </div>
                        </details>

                        <details className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
                            <summary className="text-lg font-bold text-white cursor-pointer">Quick wins</summary>
                            <ul className="mt-4 space-y-2 text-sm text-slate-300">
                                {result.quickWins.map(item => (
                                    <li key={item} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-brand-400 mt-0.5" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </details>

                        <details className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
                            <summary className="text-lg font-bold text-white cursor-pointer">1–2 week lifts</summary>
                            <ul className="mt-4 space-y-2 text-sm text-slate-300">
                                {result.mediumLifts.map(item => (
                                    <li key={item} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </details>

                        <details className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
                            <summary className="text-lg font-bold text-white cursor-pointer">1–2 month bets</summary>
                            <ul className="mt-4 space-y-2 text-sm text-slate-300">
                                {result.bigBets.map(item => (
                                    <li key={item} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </details>

                        <details className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40" open>
                            <summary className="text-lg font-bold text-white cursor-pointer">Valuation range</summary>
                            <div className="mt-4 space-y-3 text-sm text-slate-300">
                                {result.valuation.status === 'insufficient_data' ? (
                                    <div className="text-slate-400">
                                        Not enough data to estimate valuation. Add MRR (and ideally growth + churn) for a meaningful range.
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <ValuationCard label="Low" value={result.valuation.low} />
                                        <ValuationCard label="Base" value={result.valuation.base} />
                                        <ValuationCard label="High" value={result.valuation.high} />
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs uppercase text-slate-500">Assumptions</p>
                                    <ul className="mt-2 space-y-1 text-sm text-slate-300">
                                        {result.valuation.assumptions.map(item => (
                                            <li key={item}>• {item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-slate-500">Sensitivity</p>
                                    <ul className="mt-2 space-y-1 text-sm text-slate-300">
                                        {result.valuation.sensitivity.map(item => (
                                            <li key={item}>• {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </details>

                        <details className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
                            <summary className="text-lg font-bold text-white cursor-pointer">Next actions</summary>
                            <div className="mt-4 grid md:grid-cols-2 gap-4">
                                {result.toolCtas.map(cta => (
                                    <a
                                        key={cta.href}
                                        href={cta.href}
                                        className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-brand-400 transition"
                                    >
                                        <div className="text-white font-semibold">{cta.label}</div>
                                        <p className="text-sm text-slate-400 mt-1">{cta.why}</p>
                                    </a>
                                ))}
                            </div>
                        </details>

                        <details className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
                            <summary className="text-lg font-bold text-white cursor-pointer">Crawled pages</summary>
                            <ul className="mt-4 space-y-2 text-sm text-slate-400">
                                {result.crawledPages.map(page => (
                                    <li key={page}>{page}</li>
                                ))}
                            </ul>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
}

function ScoreCard({ label, score, note }: { label: string; score: number; note?: string }) {
    return (
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
            <p className="text-xs uppercase text-slate-500">{label}</p>
            <div className="text-2xl font-bold text-white">
                {note ? note : score}
            </div>
        </div>
    );
}

function ValuationCard({ label, value }: { label: string; value: number | null }) {
    return (
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
            <p className="text-xs uppercase text-slate-500">{label}</p>
            <div className="text-2xl font-bold text-white">
                {value !== null ? `$${value.toLocaleString()}` : '—'}
            </div>
        </div>
    );
}

function buildReportText(result: WebsiteAuditResult) {
    const lines = [
        `Website Audit Report`,
        `URL: ${result.url}`,
        '',
        `Overall score: ${result.scores.overall}`,
        `Positioning & clarity: ${result.scores.positioning}`,
        `Conversion & UX: ${result.scores.conversion}`,
        `Trust & credibility: ${result.scores.trust}`,
        `Technical SEO: ${result.scores.seo}`,
        `Performance: ${result.scores.performance === 0 ? 'Not run' : result.scores.performance}`,
        `Investor readiness: ${result.scores.investor}`,
        '',
        'Top issues:',
        ...result.issues.map(issue => `- ${issue.title} (Impact ${issue.impact}/5): ${issue.fix}`),
        '',
        'Quick wins:',
        ...result.quickWins.map(win => `- ${win}`),
        '',
        '1–2 week lifts:',
        ...result.mediumLifts.map(lift => `- ${lift}`),
        '',
        '1–2 month bets:',
        ...result.bigBets.map(bet => `- ${bet}`),
        '',
        'Valuation:',
    ];

    if (result.valuation.status === 'computed') {
        lines.push(`Low: $${result.valuation.low?.toLocaleString()}`);
        lines.push(`Base: $${result.valuation.base?.toLocaleString()}`);
        lines.push(`High: $${result.valuation.high?.toLocaleString()}`);
    } else {
        lines.push('Insufficient data. Provide MRR + growth/churn for a tighter range.');
    }

    lines.push('', 'Next actions:');
    lines.push(...result.toolCtas.map(cta => `- ${cta.label}: ${cta.href}`));

    return lines.join('\n');
}
