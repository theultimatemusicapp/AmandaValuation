import { Star, User, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah Jenkins',
        role: 'Founder, CloudFlow SaaS',
        content: 'This valuation gave us the confidence to negotiate our Series A. The detail in the Pro report is unmatched.',
        rating: 5,
        image: '/avatar_sarah.png',
        color: 'bg-blue-500/10 text-blue-400'
    },
    {
        name: 'Marcus Thorne',
        role: 'CEO, HR-Nexus',
        content: 'Simple, fast, and surprisingly accurate. We used the benchmark data to optimize our pricing model.',
        rating: 5,
        image: '/avatar_michael.png',
        color: 'bg-brand-500/10 text-brand-400'
    },
    {
        name: 'Elena Rodriguez',
        role: 'Owner, Micro-SEO Tools',
        content: 'Even at the sub-$1M ARR level, the insights were incredibly helpful for my exit planning.',
        rating: 5,
        image: '/avatar_emily.png',
        color: 'bg-emerald-500/10 text-emerald-400'
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-display mb-4 italic text-slate-100">
                        Trusted by <span className="text-brand-400">1,000+</span> Founders
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        See how other SaaS leaders are using our data to drive growth and successful exits.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl relative group hover:border-brand-500/30 transition-all duration-300"
                        >
                            <Quote className="absolute top-6 right-8 w-12 h-12 text-slate-800 group-hover:text-brand-500/10 transition-colors" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            <p className="text-slate-300 text-lg mb-8 relative z-10">
                                "{t.content}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700 shadow-xl group-hover:border-brand-500/50 transition-colors">
                                    <img
                                        src={t.image}
                                        alt={t.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{t.name}</h4>
                                    <p className="text-slate-500 text-xs">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
