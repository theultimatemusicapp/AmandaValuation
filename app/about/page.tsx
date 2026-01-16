import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Target, Users, Shield, TrendingUp, Award, Rocket } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-slate-950">
            <Header />

            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-slate-950">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
                            Democratizing SaaS <span className="text-brand-400">Valuation</span>
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            We believe every founder deserves to know the true value of what they've built, without paying thousands in consultancy fees.
                        </p>
                    </div>

                    {/* Founder Story */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-brand-400 uppercase tracking-wider">
                                    The Founder
                                </div>
                                <h2 className="text-3xl font-bold font-display text-white">Meet David Miller</h2>
                                <div className="space-y-4 text-slate-300 leading-relaxed">
                                    <p>
                                        David Miller has been building and analyzing SaaS businesses for over a decade. After selling his first bootstrapped SaaS company in 2015, he experienced firsthand how confusing and opaque the valuation process can be for first-time founders.
                                    </p>
                                    <p>
                                        "Most founders don't have access to the data and frameworks that buyers and investors use," David explains. "I built SaaS Valuation to make those tools accessible to everyone."
                                    </p>
                                    <p>
                                        Today, David works with SaaS founders and business advisors to help them understand their metrics and prepare for growth or exit conversations. His goal with this platform is to provide transparent, data-driven valuation insights without the typical consultant fees.
                                    </p>
                                    <p className="text-sm text-slate-400 italic border-l-2 border-slate-700 pl-4">
                                        Note: The valuations provided by our calculators are estimates based on market data and industry benchmarks. They should not be considered as professional financial advice or guarantees of actual transaction value. Always consult with qualified financial and legal advisors before making business decisions.
                                    </p>
                                </div>
                                <div className="pt-4 flex items-center gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">10+</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Years Exp</div>
                                    </div>
                                    <div className="w-px h-10 bg-slate-800" />
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">SaaS</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Specialist</div>
                                    </div>
                                    <div className="w-px h-10 bg-slate-800" />
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">Data-Driven</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Approach</div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative w-full md:w-1/3 aspect-[3/4] md:aspect-square lg:aspect-[3/4] max-w-sm flex-shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500 to-amber-500 rounded-2xl rotate-3 opacity-20" />
                                <Image
                                    src="/david-miller.jpg"
                                    alt="David Miller, Founder"
                                    fill
                                    className="object-cover rounded-2xl shadow-2xl border border-slate-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Grid */}
            <section className="py-24 bg-slate-900 border-y border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-display text-white mb-4">Our Core Values</h2>
                        <p className="text-slate-400">Everything we do is driven by these principles.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ValueCard
                            icon={Target}
                            title="Accuracy First"
                            description="Our valuation models are built on market data from SaaS transactions and industry benchmarks. We prioritize transparent methodology over flashy promises."
                        />
                        <ValueCard
                            icon={Shield}
                            title="Founder Friendly"
                            description="We believe founders should understand their company's value before entering any negotiation. Our tools provide the insights you need to make informed decisions."
                        />
                        <ValueCard
                            icon={Rocket}
                            title="Speed & Clarity"
                            description="Get valuation estimates in minutes, not weeks. We combine automated analysis with clear explanations so you know exactly what the numbers mean."
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function ValueCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl hover:border-brand-500/50 transition-colors group">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
