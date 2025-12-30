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
                                        David Miller is a serial SaaS entrepreneur and valuation expert with over 15 years of experience in the software industry. After selling his first bootstraped SaaS company in 2015, he realized how opaque and difficult the exit process was for first-time founders.
                                    </p>
                                    <p>
                                        "Founders were leaving millions on the table simply because they didn't know how to position their metrics," David says. "I built SaaS Valuation to solve that."
                                    </p>
                                    <p>
                                        Today, David advises private equity firms on SaaS due diligence and has helped over 500 founders prepare their exits. His mission with this platform is to bring institutional-grade valuation models to the open market for free.
                                    </p>
                                </div>
                                <div className="pt-4 flex items-center gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">15+</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Years Exp</div>
                                    </div>
                                    <div className="w-px h-10 bg-slate-800" />
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">$150M+</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Exits Guided</div>
                                    </div>
                                    <div className="w-px h-10 bg-slate-800" />
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">500+</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Founders Helped</div>
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
                            description="We don't guess. Our models are built on real-time market data from thousands of successful SaaS exits."
                        />
                        <ValueCard
                            icon={Shield}
                            title="Founder Friendly"
                            description="We are on the founder's side. Our tools are designed to maximize YOUR leverage in any negotiation."
                        />
                        <ValueCard
                            icon={Rocket}
                            title="Speed & Simplicity"
                            description="Valuation shouldn't take weeks. We deliver institutional-grade insights in seconds, not months."
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
