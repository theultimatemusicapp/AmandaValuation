import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChurnCalculator from '@/components/calculators/ChurnCalculator';
import Link from 'next/link';
import { ArrowLeft, TrendingDown } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SaaS Churn Calculator: Logo & Revenue Churn - Free Tool',
    description: 'Calculate your monthly SaaS churn rate for both logos and revenue. Understand the impact of lost customers on your annual revenue.',
};

export default function ChurnCalculatorPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <Header />

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center gap-2 text-sm">
                        <Link href="/resources/tools-calculators" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors font-medium">
                            <ArrowLeft className="w-4 h-4" /> Tools
                        </Link>
                        <span className="text-slate-600">/</span>
                        <span className="text-slate-200 font-medium">Churn Calculator</span>
                    </div>

                    {/* Header */}
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium mb-4">
                            <TrendingDown className="w-4 h-4" />
                            <span>Retention Metric</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
                            SaaS Churn Calculator
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                            Churn is the "silent killer" of SaaS growth. Use this calculator to track both Logo Churn (customers lost) and Revenue Churn (dollars lost).
                        </p>
                    </div>

                    {/* Calculator Component */}
                    <div className="mb-16">
                        <ChurnCalculator />
                    </div>

                    {/* SEO Content / Guide */}
                    <div className="prose prose-invert prose-lg max-w-none border-t border-slate-800 pt-16">
                        <h2>Why Churn Matters</h2>
                        <p>
                            In SaaS, you don't just sell a product once; you have to sell it every month. Churn rate is the percentage of your customers who leave your service over a given period of time.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 not-prose my-12">
                            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                                <h3 className="text-xl font-bold text-white mb-3">Acceptable Churn Rates</h3>
                                <ul className="space-y-3 text-slate-400 text-sm">
                                    <li className="flex justify-between border-b border-slate-800 pb-2">
                                        <span>Enterprise ($10k+ ACV)</span>
                                        <span className="text-white font-medium">0.5% - 1% / mo</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-800 pb-2">
                                        <span>Mid-Market ($1k-10k ACV)</span>
                                        <span className="text-white font-medium">1% - 2% / mo</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>SMB / Prosumer (&lt;$1k ACV)</span>
                                        <span className="text-white font-medium">3% - 7% / mo</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                                <h3 className="text-xl font-bold text-white mb-3">How to Reduce Churn</h3>
                                <ul className="list-disc list-inside space-y-2 text-slate-400 text-sm">
                                    <li>Improve onboarding to get users to "Aha!" moment faster</li>
                                    <li>Switch to annual contracts (annual plans churn less)</li>
                                    <li>Implement dunning management for failed payments</li>
                                    <li>Regular customer success check-ins</li>
                                </ul>
                            </div>
                        </div>

                        <h2>Logo vs. Revenue Churn</h2>
                        <p>
                            <strong>Logo Churn</strong> tells you if your product is sticky. High logo churn suggests product-market fit issues.
                        </p>
                        <p>
                            <strong>Revenue Churn</strong> tells you if you are losing your best customers. If Revenue Churn is higher than Logo Churn, you are losing high-value accounts, which is dangerous.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
