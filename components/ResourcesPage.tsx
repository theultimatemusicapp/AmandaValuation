'use client';

import { FileText, Target, TrendingUp, Shield, Bot, Calculator, BookOpen, Zap, Calendar, Clock, User } from 'lucide-react';
import { RESOURCES, Resource } from '@/lib/resources';
import Link from 'next/link';

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-teal-700 to-blue-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-10 items-center">
                    <div className="space-y-5">
                        <p className="uppercase tracking-wide text-sm font-semibold text-teal-100">Resources</p>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight font-display">
                            Resources hub for valuation, exits, and growth
                        </h1>
                        <p className="text-lg text-teal-50 max-w-2xl">
                            Find pillar articles and cluster playbooks to price your SaaS, document diligence, and unlock higher multiples. Each track links directly to the articles and tools that reinforce it.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Pill icon={<FileText className="w-4 h-4" />} text="Valuation fundamentals" />
                            <Pill icon={<Target className="w-4 h-4" />} text="Exit readiness" />
                            <Pill icon={<TrendingUp className="w-4 h-4" />} text="Growth & efficiency" />
                            <Pill icon={<Bot className="w-4 h-4" />} text="AI & market shifts" />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <a href="/" className="bg-white text-gray-900 font-semibold px-5 py-3 rounded-lg shadow hover:bg-teal-50 transition-colors">
                                Run a valuation
                            </a>
                            <a href="/payment" className="border border-white/60 text-white font-semibold px-5 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-colors">
                                Unlock Pro
                            </a>
                        </div>
                    </div>

                    {/* Quick Reference Card */}
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur">
                        <div className="bg-white text-gray-900 rounded-xl p-6 space-y-4 shadow-lg">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm uppercase font-semibold text-teal-600">Pillar playbooks</p>
                                    <h2 className="text-2xl font-bold">Start with a pillar, dive into clusters</h2>
                                </div>
                                <span className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold">
                                    <BookOpen className="w-4 h-4" /> Map
                                </span>
                            </div>
                            <ul className="space-y-3 text-gray-700 text-sm">
                                <li className="flex items-start gap-3">
                                    <span className="text-teal-600">✓</span>
                                    <span>Pricing your SaaS: valuation multiples and the 2025 valuation guide.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-teal-600">✓</span>
                                    <span>Exit readiness: buyer scorecards and exit calculator walkthroughs.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-teal-600">✓</span>
                                    <span>Efficiency & pricing: burn multiples plus pricing lifts.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-teal-600">✓</span>
                                    <span>Market shifts: AI multiples reset and new founder playbooks.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pillar Pages Section */}
            <section className="py-14 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-teal-700 uppercase">Pillar tracks</p>
                        <h2 className="text-3xl font-bold text-gray-900 font-display">Start with a pillar page</h2>
                        <p className="text-gray-700 max-w-3xl">
                            Each pillar frames the story buyers expect. Use the paired cluster articles to go deeper on risks, pricing moves, and diligence readiness.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <ResourceCard
                            id="valuation-fundamentals"
                            title="Valuation fundamentals"
                            badge="Pillar"
                            icon={<FileText className="w-5 h-5" />}
                            description="Get your baseline multiple and the metrics that justify it."
                            resources={RESOURCES.filter(r => r.category === 'Guide' || r.id === 'rule-of-40')}
                        />
                        <ResourceCard
                            id="exit-readiness"
                            title="Exit readiness"
                            badge="Pillar"
                            icon={<Target className="w-5 h-5" />}
                            description="Match your story to buyer scorecards and diligence checkpoints."
                            resources={RESOURCES.filter(r => r.category === 'Exit')}
                        />
                        <ResourceCard
                            id="efficiency-metrics"
                            title="Efficiency & metrics"
                            badge="Pillar"
                            icon={<TrendingUp className="w-5 h-5" />}
                            description="Tune burn multiples, ARPU, and retention to unlock higher offers."
                            resources={RESOURCES.filter(r => r.category === 'Metrics')}
                        />
                        <ResourceCard
                            id="market-insights"
                            title="AI & market shifts"
                            badge="Cluster"
                            icon={<Bot className="w-5 h-5" />}
                            description="Position AI-era products and founder profiles for durable value."
                            resources={RESOURCES.filter(r => r.category === 'Market')}
                        />
                        <ResourceCard
                            title="Tools & calculators"
                            badge="Tools"
                            icon={<Calculator className="w-5 h-5" />}
                            description="Run quick valuations and build investor-ready narratives."
                            links={[
                                'Free Valuation Calculator',
                                'SaaS Growth Calculator',
                                'Pro Valuation',
                            ]}
                        />
                        <ResourceCard
                            title="Risk & resilience"
                            badge="Cluster"
                            icon={<Shield className="w-5 h-5" />}
                            description="Reduce concentration and operational fragility before diligence."
                            links={[
                                'Rule of 40',
                                'How to Value a SaaS',
                                'SaaS Exit Calculator Logic',
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* Cluster Deep-Dives Section */}
            <section className="py-14 bg-gray-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-1 space-y-3">
                        <p className="text-sm font-semibold text-teal-700 uppercase">Cluster deep-dives</p>
                        <h2 className="text-3xl font-bold text-gray-900 font-display">Pick your next step</h2>
                        <p className="text-gray-700">
                            Choose a theme to find related posts that reinforce the same narrative and metrics.
                        </p>
                    </div>
                    <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
                        <ClusterCard
                            title="Revenue quality"
                            description="Reduce churn and improve retention before diligence."
                            links={[
                                'Rule of 40',
                                'Master Guide',
                                'Micro-SaaS Valuation',
                            ]}
                        />
                        <ClusterCard
                            title="Pricing power"
                            description="Raise ARPU while protecting retention."
                            links={[
                                'Rule of 40',
                                'How to Value a SaaS',
                                'SaaS Exit Calculator Logic',
                            ]}
                        />
                        <ClusterCard
                            title="Market positioning"
                            description="Show why your category and buyer fit deserve a premium."
                            links={[
                                'AI SaaS Valuation Bubble',
                                'SaaS Exit Calculator Logic',
                                'Rule of 40',
                            ]}
                        />
                        <ClusterCard
                            title="Founder pathways"
                            description="Pick the content tailored to your current stage."
                            links={[
                                'Micro-SaaS Under $1M ARR',
                                'The Rule of 40',
                                'How to Value My SaaS',
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-14 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-10 items-center">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-4">
                        <p className="text-sm font-semibold text-teal-700 uppercase">Need a shortcut?</p>
                        <h2 className="text-3xl font-bold text-gray-900 font-display">
                            Use the calculators + exit checklists together
                        </h2>
                        <p className="text-gray-700">
                            Pair the valuation calculators with the diligence checklist and buyer scorecard articles to ship a complete, investor-ready story.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 text-sm font-semibold">
                            <a href="/" className="text-center bg-teal-600 text-white rounded-lg py-3 hover:bg-teal-700 transition-colors">
                                Run the free valuation
                            </a>
                            <a href="/pro" className="text-center bg-gray-900 text-white rounded-lg py-3 hover:bg-gray-800 transition-colors">
                                Try Pro valuation
                            </a>
                            <a href="/" className="text-center border border-teal-200 text-teal-800 rounded-lg py-3 hover:bg-teal-50 transition-colors">
                                Model growth scenarios
                            </a>
                            <a href="/payment" className="text-center border border-gray-200 text-gray-900 rounded-lg py-3 hover:bg-gray-100 transition-colors">
                                See pricing
                            </a>
                        </div>
                    </div>

                    {/* Newsletter Signup */}
                    <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-lg space-y-5">
                        <p className="text-sm font-semibold text-teal-200 uppercase">Stay in the loop</p>
                        <h3 className="text-2xl font-bold">Get new pillars & clusters in your inbox</h3>
                        <p className="text-gray-200">
                            We share valuation updates, exit prep checklists, and pricing experiments as soon as they ship.
                        </p>
                        <form action="https://formspree.io/f/mjkowkld" method="POST" className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-200" htmlFor="newsletter-email">
                                Your Email
                            </label>
                            <input
                                type="email"
                                id="newsletter-email"
                                name="email"
                                className="w-full border border-gray-700 rounded-lg px-4 py-3 text-gray-900"
                                placeholder="you@company.com"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 rounded-lg transition-colors"
                            >
                                Get resources
                            </button>
                            <p className="text-xs text-gray-300">
                                By subscribing, you agree to our Privacy Policy.
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Pill({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white px-3 py-2 rounded-full font-semibold text-sm">
            {icon} {text}
        </span>
    );
}

function ResourceCard({ id, title, badge, icon, description, links = [], resources = [] }: any) {
    const getLinkHref = (linkText: string) => {
        if (linkText.toLowerCase().includes('pro valuation')) return '/pro';
        if (linkText.toLowerCase().includes('free valuation')) return '/';
        const found = RESOURCES.find(r =>
            r.title.toLowerCase().includes(linkText.toLowerCase()) ||
            r.id.toLowerCase().includes(linkText.toLowerCase().replace(/ /g, '-'))
        );
        return found ? `/resources/${found.id}` : '#';
    };

    return (
        <div id={id} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow scroll-mt-20">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {icon} {badge}
                </span>
            </div>
            <p className="text-gray-700">{description}</p>
            <ul className="space-y-2">
                {resources.map((resource: any) => (
                    <li key={resource.id}>
                        <Link
                            href={`/resources/${resource.id}`}
                            className="text-teal-700 font-semibold hover:text-teal-800 cursor-pointer text-sm flex items-start gap-2 group"
                        >
                            <span className="mt-1.5 w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" />
                            <span className="group-hover:underline">{resource.title}</span>
                        </Link>
                    </li>
                ))}
                {links.map((link: string, index: number) => {
                    const href = getLinkHref(link);
                    return (
                        <li key={index}>
                            <Link
                                href={href}
                                className="text-teal-700 font-semibold hover:text-teal-800 cursor-pointer text-sm flex items-start gap-2 group"
                            >
                                <span className="mt-1.5 w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" />
                                <span className="group-hover:underline">{link}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function ClusterCard({ title, description, links }: any) {
    const getLinkHref = (linkText: string) => {
        const found = RESOURCES.find(r =>
            r.title.toLowerCase().includes(linkText.toLowerCase()) ||
            r.id.toLowerCase().includes(linkText.toLowerCase().replace(/ /g, '-'))
        );
        return found ? `/resources/${found.id}` : '#';
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                    <Zap className="w-3 h-3" /> Cluster
                </span>
            </div>
            <p className="text-gray-700 text-sm">{description}</p>
            <ul className="space-y-2">
                {links.map((link: string, index: number) => {
                    const href = getLinkHref(link);
                    return (
                        <li key={index}>
                            <Link
                                href={href}
                                className="text-teal-700 font-semibold hover:text-teal-800 cursor-pointer text-sm flex items-start gap-2 group"
                            >
                                <span className="mt-1.5 w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" />
                                <span className="group-hover:underline">{link}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
