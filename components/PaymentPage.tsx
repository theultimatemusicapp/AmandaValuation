'use client';

import { useState } from 'react';
import { Check, X, Sparkles, Shield, Zap, FileText, Download, Star } from 'lucide-react';
import { generateProPDF } from '@/lib/pdf-generator';
import { calculateSaaSValuation } from '@/lib/valuation';

export default function PaymentPage() {
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState(false);

    const handleApplyCoupon = () => {
        // Simulated coupon validation (from legacy system)
        const VALID_COUPON = 'sasvalcoup26x92f';

        if (couponCode.trim().toLowerCase() === VALID_COUPON) {
            setCouponSuccess(true);
            setCouponError('');
            setTimeout(() => {
                window.location.href = '/pro?paid=true';
            }, 2000);
        } else {
            setCouponError('Invalid coupon code. Please try again.');
            setCouponSuccess(false);
        }
    };

    const downloadSampleReport = () => {
        // Generate a sample report with dummy data
        const sampleInputs = {
            companyName: 'Acme SaaS Corp (Sample)',
            arr: 1200000,
            mrr: 100000,
            growthYoy: 45,
            customerChurn: 2.1,
            netProfit: 300000,
            retentionRate: 108,
            nps: 72,
            grossMargin: 84,
            cac: 920,
            ltv: 5400,
            activeCustomers: 850,
            contractValue: 1400,
            keyStaff: 4,
            ipOwnership: 'fully-owned',
            legalIssues: 'none',
            scalableInfrastructure: 'fully-scalable',
            dataPrivacy: 'compliant',
            businessType: 'B2B SaaS',
            discountRate: 0.12
        };
        const sampleResult = calculateSaaSValuation(sampleInputs as any);
        generateProPDF(sampleResult, sampleInputs, sampleInputs.companyName);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-6xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-bold mb-4">
                        LIMITED TIME OFFER
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
                        Unlock Your <span className="text-gradient bg-gradient-to-r from-brand-500 to-amber-500 bg-clip-text text-transparent">Pro Valuation</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Get investor-grade insights with Pro's comprehensive 50+ data point analysis and professional PDF reports
                    </p>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center gap-8 mb-16">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Shield className="w-5 h-5 text-brand-400" />
                        <span className="text-sm">Secure Stripe Payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span className="text-sm">1,000+ Founders Trust Us</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                        <Zap className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm">Instant Access</span>
                    </div>
                </div>

                {/* Free vs Pro Comparison Table */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center font-display">Compare Free vs Pro</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left py-4 px-4 text-slate-300 font-semibold">Feature</th>
                                    <th className="text-center py-4 px-4 text-slate-300 font-semibold">Free</th>
                                    <th className="text-center py-4 px-4 text-brand-400 font-semibold">Pro — $19</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                <ComparisonRow feature="Core valuation calculator" free={true} pro={true} />
                                <ComparisonRow feature="Basic PDF export (1-2 pages)" free={true} pro={false} />
                                <ComparisonRow feature="Multi-method valuation (DCF, revenue, earnings)" free={false} pro={true} highlight />
                                <ComparisonRow feature="Interactive charts & benchmarking" free={false} pro={true} highlight />
                                <ComparisonRow feature="50+ detailed input fields" free={false} pro={true} highlight />
                                <ComparisonRow feature="AI recommendations to boost value" free={false} pro={true} highlight />
                                <ComparisonRow feature="Professional 5-page PDF report" free={false} pro={true} highlight />
                                <ComparisonRow feature="Exit scenario modeling" free={false} pro={true} highlight />
                                <ComparisonRow feature="Investor readiness checklist" free={false} pro={true} />
                                <ComparisonRow feature="Priority email support" free={false} pro={true} />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* What You Get with Pro */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <div className="md:row-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col justify-center items-center text-center">
                        <div className="relative mb-6 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="absolute -inset-4 bg-brand-500/20 blur-xl rounded-full" />
                            <img
                                src="/hero_dashboard.png"
                                alt="Pro Report Preview"
                                className="w-64 h-auto rounded-lg shadow-2xl relative z-10 border border-slate-700"
                            />
                            <div className="absolute -bottom-4 -right-4 bg-amber-500 text-slate-950 px-4 py-2 rounded-lg font-bold shadow-lg z-20 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                5+ PAGES
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Detailed Investor Grade Report</h3>
                        <p className="text-slate-400 text-sm mb-6">Transparent methodology with multi-method valuation logic and custom uplift actions.</p>
                        <button
                            onClick={downloadSampleReport}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all border border-slate-700"
                        >
                            <Download className="w-4 h-4" />
                            Download Sample Pro PDF
                        </button>
                    </div>
                    <FeatureCard
                        icon={<FileText className="w-6 h-6" />}
                        title="Comprehensive 5-Page PDF"
                        description="Download a professional investor-ready report with charts, benchmarking, and actionable insights"
                    />
                    <FeatureCard
                        icon={<Sparkles className="w-6 h-6" />}
                        title="50+ Data Points"
                        description="Input detailed financials, team metrics, legal factors, and more for accuracy"
                    />
                    <FeatureCard
                        icon={<Zap className="w-6 h-6" />}
                        title="Value Uplift Actions"
                        description="Get prioritized recommendations to increase your valuation by 15-30%"
                    />
                    <FeatureCard
                        icon={<Shield className="w-6 h-6" />}
                        title="Exit Scenario Planning"
                        description="Model conservative, base case, and optimistic exit projections"
                    />
                </div>

                {/* Payment Section */}
                <div className="max-w-md mx-auto">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                        <div className="text-center mb-6">
                            <p className="text-slate-400 text-sm mb-2">One-time payment · No subscription</p>
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <span className="text-slate-500 line-through text-lg">$99 USD</span>
                                <span className="text-4xl font-bold text-white">$19 USD</span>
                            </div>
                            <p className="text-brand-400 text-sm font-semibold">Save 80% · Limited Time</p>
                            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-400" /> Secure Checkout</span>
                                <span className="flex items-center gap-1">💯 Money-Back Guarantee</span>
                            </div>
                        </div>

                        {/* Coupon Code Input - Minimized */}
                        <div className="mb-6">
                            <button
                                onClick={() => document.getElementById('coupon-section')?.classList.toggle('hidden')}
                                className="text-xs text-slate-400 hover:text-slate-300 underline mb-2"
                            >
                                Have a coupon code?
                            </button>
                            <div id="coupon-section" className="hidden">
                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        id="coupon"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter coupon code"
                                        className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-semibold transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {couponError && (
                                    <p className="text-red-400 text-sm mt-2">{couponError}</p>
                                )}
                                {couponSuccess && (
                                    <p className="text-emerald-400 text-sm mt-2">✓ Coupon applied! Redirecting to Pro Valuation...</p>
                                )}
                            </div>
                        </div>

                        {/* Stripe Buy Button */}
                        {!couponSuccess && (
                            <div className="mb-4">
                                {/* Stripe Buy Button Container */}
                                <script async src="https://js.stripe.com/v3/buy-button.js"></script>
                                <div className="flex justify-center min-h-[60px]">
                                    <div
                                        className="w-full max-w-[300px]"
                                        dangerouslySetInnerHTML={{
                                            __html: `<stripe-buy-button
                                        buy-button-id="buy_btn_1RwYAKAllg3p8PieXf2I55uz"
                                        publishable-key="pk_live_51RKjA3Allg3p8PieE0WcuVpmP3FobLM7ml3KFlCGS6ouJmgDjfBO5nSheNz4xlB7N0RgPTtcsgeTHGnYlLo03EtS00GSUxDA3j"
                                        >
                                        </stripe-buy-button>`
                                        }}
                                    />
                                </div>

                            </div>
                        )}

                        {/* Security Badge */}
                        <div className="text-center text-xs text-slate-500">
                            <Shield className="w-4 h-4 inline mr-1" />
                            Secured by Stripe · 256-bit SSL encryption
                        </div>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TestimonialCard
                        quote="This tool helped us secure funding by providing an investor-ready report."
                        author="Sarah Jenkins"
                        role="Founder, CloudFlow SaaS"
                        image="/avatar_sarah.png"
                    />
                    <TestimonialCard
                        quote="The most comprehensive SaaS valuation tool I've found. Worth every penny."
                        author="Marcus Thorne"
                        role="CEO, HR-Nexus"
                        image="/avatar_michael.png"
                    />
                    <TestimonialCard
                        quote="As a sub-$1M ARR founder, the insights were incredibly helpful for my exit planning."
                        author="Elena Rodriguez"
                        role="Owner, Micro-SEO Tools"
                        image="/avatar_emily.png"
                    />
                </div>

                {/* FAQ */}
                <div className="mt-16 max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-8 text-center font-display">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        <FAQItem
                            question="How fast is the report?"
                            answer="Most founders finish the Pro inputs in ~5 minutes and receive the investor PDF instantly."
                        />
                        <FAQItem
                            question="Is my data private?"
                            answer="We don't sell your data. All inputs stay encrypted and you control what gets shared."
                        />
                        <FAQItem
                            question="What happens after I pay?"
                            answer="You will be redirected to the Pro Valuation dashboard instantly. Your progress is saved and you can access your reports at any time."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ComparisonRow({ feature, free, pro, highlight = false }: { feature: string; free: boolean; pro: boolean; highlight?: boolean }) {
    return (
        <tr className={`border-b border-slate-800/50 ${highlight ? 'bg-brand-500/5' : ''}`}>
            <td className="py-4 px-4 text-sm">{feature}</td>
            <td className="py-4 px-4 text-center">
                {free ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-slate-600 mx-auto" />}
            </td>
            <td className="py-4 px-4 text-center">
                {pro ? <Check className="w-5 h-5 text-brand-400 mx-auto" /> : <X className="w-5 h-5 text-slate-600 mx-auto" />}
            </td>
        </tr>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-brand-500/10 border border-brand-500/20 rounded-lg text-brand-400">
                    {icon}
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-1">{title}</h4>
                    <p className="text-slate-400 text-sm">{description}</p>
                </div>
            </div>
        </div>
    );
}

function TestimonialCard({ quote, author, role, image }: { quote: string; author: string; role: string; image: string }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-brand-500/30 transition-all duration-300 group">
            <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
            </div>
            <p className="text-slate-300 text-sm mb-6 relative z-10 italic">"{quote}"</p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 shadow-lg">
                    <img src={image} alt={author} className="w-full h-full object-cover" />
                </div>
                <div>
                    <p className="text-white font-bold text-sm tracking-tight">{author}</p>
                    <p className="text-slate-500 text-[10px] uppercase font-semibold">{role}</p>
                </div>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h4 className="text-white font-semibold mb-2">{question}</h4>
            <p className="text-slate-400 text-sm">{answer}</p>
        </div>
    );
}
