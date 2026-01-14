import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Calculator, TrendingDown, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Free SaaS Valuation Tools & Calculators | SaaS Valuation',
    description: 'Free interactive calculators for SaaS founders: Calculate Churn, LTV, Burn Rate, and more. Data-driven tools to help you grow and value your business.',
};

const tools = [
    {
        title: 'Churn Calculator',
        description: 'Calculate your logo and revenue churn rates. Understand how many customers you are losing and the impact on your revenue.',
        href: '/resources/tools-calculators/churn-calculator',
        icon: TrendingDown,
        color: 'text-rose-400',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/20'
    },
    {
        title: 'LTV / CAC Calculator',
        description: 'Determine your Customer Lifetime Value and acquisition efficiency. See if your unit economics are healthy enough to scale.',
        href: '/resources/tools-calculators/ltv-calculator',
        icon: DollarSign,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20'
    },
    {
        title: 'Burn Rate & Runway',
        description: 'Calculate your monthly burn rate and runway. Know exactly how much time you have left before you need to raise capital or become profitable.',
        href: '/resources/tools-calculators/burn-rate-calculator',
        icon: Activity,
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20'
    }
];

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <Header />

            <main className="pt-32 pb-24 px-6 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-brand-400 text-sm font-medium mb-6">
                            <Calculator className="w-4 h-4" />
                            <span>Free Interactive Tools</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-display text-white mb-6 leading-tight">
                            Tools to Measure <br /><span className="bg-gradient-to-r from-brand-300 to-blue-500 bg-clip-text text-transparent">SaaS Health</span>
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Stop guessing. Use our free calculators to benchmark your metrics, identify leaks, and plan your growth.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {tools.map((tool) => (
                            <Link
                                key={tool.title}
                                href={tool.href}
                                className={`group relative p-8 rounded-2xl border ${tool.borderColor} ${tool.bgColor} backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-900/20 block`}
                            >
                                <div className={`w-14 h-14 rounded-xl ${tool.bgColor} flex items-center justify-center mb-6 border ${tool.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <tool.icon className={`w-7 h-7 ${tool.color}`} />
                                </div>

                                <h3 className="text-xl font-bold font-display text-white mb-3 group-hover:text-brand-200 transition-colors">
                                    {tool.title}
                                </h3>
                                <p className="text-slate-400 mb-6 leading-relaxed">
                                    {tool.description}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all">
                                    Use Tool <ArrowRight className="w-4 h-4 text-brand-400" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* CTA section */}
                    <div className="mt-24 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-800 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-500/5 blur-3xl rounded-full" />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold font-display text-white mb-4">
                                Need a complete valuation?
                            </h2>
                            <p className="text-slate-400 mb-8">
                                These tools help with specific metrics. If you want to know what your entire business is worth, try our comprehensive valuation engine.
                            </p>
                            <Link href="/" className="inline-flex items-center justify-center px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-900/30">
                                Get Full Valuation
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>

    );
}
