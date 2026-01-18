import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WebsiteAuditTool from '@/components/calculators/WebsiteAuditTool';
import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Website Audit Tool for SaaS | Conversion, SEO, Investor Readiness',
    description: 'Audit your SaaS website for positioning, conversion, trust, SEO, and investor readiness. Get prioritized fixes and a valuation range in minutes.',
    keywords: ['website audit', 'saas conversion audit', 'seo checklist', 'investor readiness', 'saas valuation tool'],
    openGraph: {
        title: 'Website Audit for SaaS Founders',
        description: 'Generate a structured website audit with fixes, risks, and valuation insights.',
        url: 'https://saasvaluation.app/resources/tools-calculators/website-audit',
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Website Audit Tool',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    description: 'Generate a structured SaaS website audit with conversion, SEO, and investor readiness insights.',
};

export default function WebsiteAuditPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <Header />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="pt-32 pb-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 flex items-center gap-2 text-sm">
                        <Link href="/resources/tools-calculators" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors font-medium">
                            <ArrowLeft className="w-4 h-4" /> Tools
                        </Link>
                        <span className="text-slate-600">/</span>
                        <span className="text-slate-200 font-medium">Website Audit</span>
                    </div>

                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium mb-4">
                            <Globe className="w-4 h-4" />
                            <span>Investor Readiness</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
                            Website Audit
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                            Scan your SaaS website for conversion, trust, SEO, and investor readiness gaps. Get a ranked fix list, quick wins, and a valuation range when metrics are provided.
                        </p>
                    </div>

                    <div className="mb-16">
                        <WebsiteAuditTool />
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none border-t border-slate-800 pt-16">
                        <h2>What this audit covers</h2>
                        <ul>
                            <li><strong>Positioning & clarity:</strong> Does your hero section explain the outcome and ICP?</li>
                            <li><strong>Conversion & UX:</strong> Are CTAs obvious and does pricing show up quickly?</li>
                            <li><strong>Trust & credibility:</strong> Are there testimonials, logos, security, and legal links?</li>
                            <li><strong>Technical SEO:</strong> Titles, descriptions, canonicals, headings, sitemap/robots.</li>
                            <li><strong>Investor readiness:</strong> Red flags like short runway or weak margins.</li>
                        </ul>
                        <p>
                            This tool crawls the provided URL plus up to five internal pages to keep the scan fast and respectful.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
