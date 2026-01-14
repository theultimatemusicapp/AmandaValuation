import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LTVCalculator from '@/components/calculators/LTVCalculator';
import Link from 'next/link';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SaaS LTV Calculator | Customer Lifetime Value Formula',
    description: 'Calculate Customer Lifetime Value (LTV) and LTV:CAC ratio. Understand how long your customers stay and what they are worth. Free tool.',
    keywords: ['ltv calculator', 'customer lifetime value', 'saas ltv', 'ltv cac ratio'],
    openGraph: {
        title: 'SaaS LTV Calculator | Know Your Customer Value',
        description: 'Instant LTV calculation based on ARPA, Churn, and Gross Margin. Optimize your acquisition spend today.',
        url: 'https://saasvaluation.app/resources/tools-calculators/ltv-calculator',
    }
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SaaS LTV Calculator',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
    },
    description: 'Calculate Customer Lifetime Value (LTV) for SaaS businesses.'
};

export default function LTVCalculatorPage() {
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
                        <span className="text-slate-200 font-medium">LTV Calculator</span>
                    </div>

                    {/* Header */}
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-4">
                            <DollarSign className="w-4 h-4" />
                            <span>Unit Economics</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
                            LTV Calculator
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                            Customer Lifetime Value (LTV) is the total profit you expect to make from a single customer. It is the ceiling for your customer acquisition cost (CAC).
                        </p>
                    </div>

                    {/* Calculator Component */}
                    <div className="mb-16">
                        <LTVCalculator />
                    </div>

                    {/* SEO Content / Guide */}
                    <div className="prose prose-invert prose-lg max-w-none border-t border-slate-800 pt-16">
                        <h2>How to Calculate LTV</h2>
                        <p>
                            The simplified formula for LTV in SaaS is:
                        </p>
                        <blockquote className="not-italic font-medium text-xl text-white border-l-4 border-emerald-500 pl-6 py-2">
                            LTV = (ARPA × Gross Margin %) / Churn Rate
                        </blockquote>
                        <p>
                            Where:
                        </p>
                        <ul>
                            <li><strong>ARPA:</strong> Average Revenue Per Account (monthly).</li>
                            <li><strong>Gross Margin:</strong> The percentage of revenue you keep after direct costs (hosting, support). Usually ~80% for SaaS.</li>
                            <li><strong>Churn Rate:</strong> The percentage of customers who cancel each month.</li>
                        </ul>

                        <h2>Why Churn Kills LTV</h2>
                        <p>
                            Look at the math. Churn rate is the <strong>denominator</strong>. Because it divides the numerator, small changes in churn have massive exponential effects on LTV.
                        </p>
                        <p>
                            Halving your churn rate (e.g., from 5% to 2.5%) <strong>doubles</strong> your LTV. This is why retention is often a better lever for growth than acquisition.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
