import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BurnRateCalculator from '@/components/calculators/BurnRunwayCalculator';
import Link from 'next/link';
import { ArrowLeft, Activity } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Burn Rate & Runway Calculator | SaaS Cash Flow Tool',
    description: 'How long until you run out of cash? Calculate your startup runway and zero date based on monthly burn. Essential for founders.',
    keywords: ['burn rate calculator', 'startup runway', 'cash flow', 'zero date', 'saas finance'],
    openGraph: {
        title: 'Burn Rate & Runway Calculator | Survival Metrics',
        description: 'Visualize your cash runway. Know exactly when you need to raise or break even.',
        url: 'https://saasvaluation.app/resources/tools-calculators/burn-rate-calculator',
    }
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Burn Rate Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
    },
    description: 'Calculate cash runway and burn rate for startups.'
};

export default function BurnRatePage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <Header />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center gap-2 text-sm">
                        <Link href="/resources/tools-calculators" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors font-medium">
                            <ArrowLeft className="w-4 h-4" /> Tools
                        </Link>
                        <span className="text-slate-600">/</span>
                        <span className="text-slate-200 font-medium">Burn Rate Calculator</span>
                    </div>

                    {/* Header */}
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium mb-4">
                            <Activity className="w-4 h-4" />
                            <span>Cash Flow & Planning</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
                            Burn Rate & Runway
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                            "Cash is oxygen." knowing exactly when your startup runs out of money is the most critical metric for survival.
                        </p>
                    </div>

                    {/* Calculator Component */}
                    <div className="mb-16">
                        <BurnRateCalculator />
                    </div>

                    {/* SEO Content / Guide */}
                    <div className="prose prose-invert prose-lg max-w-none border-t border-slate-800 pt-16">
                        <h2>Why Runway is King</h2>
                        <p>
                            Runway is the amount of time (measured in months) your startup can survive before it runs out of cash.
                        </p>

                        <h3>Rules of Thumb for Fundraising</h3>
                        <ul>
                            <li><strong>Raise 18-24 months of runway:</strong> This gives you 12-18 months to build and grow, and 6 months to raise the next round.</li>
                            <li><strong>Start raising with 6-9 months left:</strong> Fundraising takes longer than you think. Do not wait until you have 3 months of cash left.</li>
                        </ul>

                        <h3>Net Burn vs. Gross Burn</h3>
                        <p>
                            This calculator uses <strong>Net Burn</strong> (Cash Spent - Cash Collected). This is the actual amount your bank account decreases each month.
                        </p>
                        <p>
                            <strong>Gross Burn</strong> is your total monthly expenses, ignoring revenue. Investors look at both to see how efficient you are.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
