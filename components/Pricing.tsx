import { Check } from 'lucide-react';

const tiers = [
    {
        name: 'Free Valuation',
        price: '$0',
        description: 'Perfect for curiosity and initial benchmarking.',
        features: [
            'Instant Valuation Range',
            'Basic Revenue Multiple Check',
            'Industry Benchmark Comparison',
            'No Credit Card Required',
        ],
        cta: 'Start Free',
        highlighted: false,
    },
    {
        name: 'Pro Report',
        price: '$19',
        originalPrice: '$99',
        description: 'For founders raising capital or planning an exit.',
        features: [
            'Everything in Free',
            'Downloadable PDF Report',
            'Investor-Ready Formatting',
            'Deep Financial Analysis',
            'AI-Powered Strategic Insights',
            '30-Day Export Access',
        ],
        cta: 'Get Pro Report',
        highlighted: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For M&A firms and marketplaces.',
        features: [
            'Bulk Valuations',
            'API Access',
            'White-label Reports',
            'Dedicated Account Manager',
        ],
        cta: 'Contact Sales',
        highlighted: false,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Start for free, upgrade when you need the details.
                        <span className="text-brand-400 block mt-2 font-medium">Holiday Special: 80% OFF Pro Reports</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative rounded-2xl p-8 border backdrop-blur-sm transition-all duration-300 hover:-translate-y-2
                ${tier.highlighted
                                    ? 'bg-slate-800/80 border-brand-500/50 shadow-2xl shadow-brand-500/10'
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                }`}
                        >
                            {tier.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-brand-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-xl font-bold font-display mb-2">{tier.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold text-white">{tier.price}</span>
                                {tier.originalPrice && (
                                    <span className="text-lg text-slate-500 line-through decoration-slate-500/50">{tier.originalPrice}</span>
                                )}
                            </div>
                            <p className="text-slate-400 text-sm mb-8 h-10">{tier.description}</p>

                            <ul className="space-y-4 mb-8">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                                        <Check className={`w-5 h-5 flex-shrink-0 ${tier.highlighted ? 'text-brand-400' : 'text-slate-600'}`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={tier.name === 'Pro Report' ? '/pro' : tier.name === 'Free Valuation' ? '#free-valuation' : '/contact'}
                                className={`w-full py-3 rounded-xl font-semibold transition-all inline-block text-center
                ${tier.highlighted
                                        ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/20'
                                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                                    }`}
                            >
                                {tier.cta}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
