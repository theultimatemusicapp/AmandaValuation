
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RiskAssessmentWizard from '@/components/calculators/RiskAssessmentWizard';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SaaS Risk Assessment & Valuation Engine | Free Tool',
    description: 'Diagnose valuation risks and calculate your "Risk-Adjusted" SDE multiple. Covers market concentration, IP, and key person dependency.',
    keywords: ['business valuation', 'risk assessment', 'sde multiple', 'valuation discount', 'due diligence'],
    openGraph: {
        title: 'Guided Risk Assessment for SaaS Founders',
        description: 'How risky is your business to a buyer? Get a score and a dollar-value impact analysis in minutes.',
        url: 'https://saasvaluation.app/resources/tools-calculators/risk-assessment',
    }
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SaaS Risk Assessment Tool',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
    },
    description: 'Analyze business risks and calculate valuation impact for SaaS companies.'
};

export default function RiskAssessmentPage() {
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
                        <span className="text-slate-200 font-medium">Risk Assessment</span>
                    </div>

                    {/* Header */}
                    <div className="mb-12 text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-4">
                            <ShieldAlert className="w-4 h-4" />
                            <span>Due Diligence Tool</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
                            SaaS Risk Assessment
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Investors deduct value for every risk they find. Take this 2-minute assessment to spot your "Red Flags" before they do.
                        </p>
                    </div>

                    {/* Calculator Component */}
                    <div className="mb-16">
                        <RiskAssessmentWizard />
                    </div>

                    {/* SEO Content / Guide */}
                    <div className="prose prose-invert prose-lg max-w-none border-t border-slate-800 pt-16">
                        <h2>The "Discount Factor"</h2>
                        <p>
                            Most founders focus on increasing revenue (Output). Investors focus on reducing risk (Certainty).
                        </p>
                        <p>
                            A business with $1M ARR and <strong>High Risk</strong> might sell for 2x ($2M). <br />
                            A business with $1M ARR and <strong>Low Risk</strong> might sell for 6x ($6M).
                        </p>

                        <h3>The 4 Horsemen of SaaS Risk</h3>
                        <ul>
                            <li><strong>Product Risk:</strong> Technical debt and IP ownership. Do you actually own what you are selling?</li>
                            <li><strong>Market Risk:</strong> Is your market growing or shrinking? Are you a small fish in a dying pond?</li>
                            <li><strong>Team Risk:</strong> "Key Person Risk". If the founder gets hit by a bus, does the business survive?</li>
                            <li><strong>Concentration Risk:</strong> If one customer leaves, do you lose &gt;10% of your revenue?</li>
                        </ul>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
