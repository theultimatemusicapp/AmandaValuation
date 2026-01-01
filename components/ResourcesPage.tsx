'use client';

import { FileText, Target, TrendingUp, Shield, Bot, Calculator, BookOpen, Zap, X, Calendar, Clock, User } from 'lucide-react';
import { RESOURCES, Resource } from '@/lib/resources';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResourcesPage() {
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const found = RESOURCES.find(r => r.id === hash);
            if (found) {
                setSelectedResource(found);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <AnimatePresence>
                {selectedResource && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedResource(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                                            {selectedResource.category}
                                        </span>
                                        <div className="flex items-center gap-3 text-sm text-slate-500">
                                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedResource.date}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedResource.readTime}</span>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 font-display">{selectedResource.title}</h2>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                                        <User className="w-4 h-4" /> <span>{selectedResource.author}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedResource(null)}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-slate-500" />
                                </button>
                            </div>
                            <div className="p-6 md:p-10 overflow-y-auto prose prose-slate prose-teal max-w-none">
                                <div
                                    className="resource-content"
                                    dangerouslySetInnerHTML={{ __html: selectedResource.content }}
                                />
                                <style jsx global>{`
                                    .resource-content h3 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #0f172a; }
                                    .resource-content h4 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1e293b; }
                                    .resource-content p { margin-bottom: 1.25rem; line-height: 1.75; color: #334155; }
                                    .resource-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; color: #334155; }
                                    .resource-content li { margin-bottom: 0.5rem; }
                                    .resource-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem; }
                                    .resource-content th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 0.75rem 0.5rem; text-align: left; font-weight: 700; color: #0f172a; }
                                    .resource-content td { border-bottom: 1px solid #f1f5f9; padding: 0.75rem 0.5rem; color: #475569; }
                                    .resource-content strong { color: #0f172a; }
                                `}</style>
                            </div>
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedResource(null)}
                                    className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                                >
                                    Close
                                </button>
                                <a
                                    href="/"
                                    className="px-6 py-2.5 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-shadow shadow-md hover:shadow-lg"
                                >
                                    Run Valuation
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
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
                            onResourceClick={setSelectedResource}
                        />
                        <ResourceCard
                            id="exit-readiness"
                            title="Exit readiness"
                            badge="Pillar"
                            icon={<Target className="w-5 h-5" />}
                            description="Match your story to buyer scorecards and diligence checkpoints."
                            resources={RESOURCES.filter(r => r.category === 'Exit')}
                            onResourceClick={setSelectedResource}
                        />
                        <ResourceCard
                            id="efficiency-metrics"
                            title="Efficiency & metrics"
                            badge="Pillar"
                            icon={<TrendingUp className="w-5 h-5" />}
                            description="Tune burn multiples, ARPU, and retention to unlock higher offers."
                            resources={RESOURCES.filter(r => r.category === 'Metrics')}
                            onResourceClick={setSelectedResource}
                        />
                        <ResourceCard
                            id="market-insights"
                            title="AI & market shifts"
                            badge="Cluster"
                            icon={<Bot className="w-5 h-5" />}
                            description="Position AI-era products and founder profiles for durable value."
                            resources={RESOURCES.filter(r => r.category === 'Market')}
                            onResourceClick={setSelectedResource}
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
                            onResourceClick={setSelectedResource}
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
                            onResourceClick={setSelectedResource}
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
                            onResourceClick={setSelectedResource}
                        />
                        <ClusterCard
                            title="Pricing power"
                            description="Raise ARPU while protecting retention."
                            links={[
                                'Rule of 40',
                                'How to Value a SaaS',
                                'SaaS Exit Calculator Logic',
                            ]}
                            onResourceClick={setSelectedResource}
                        />
                        <ClusterCard
                            title="Market positioning"
                            description="Show why your category and buyer fit deserve a premium."
                            links={[
                                'AI SaaS Valuation Bubble',
                                'SaaS Exit Calculator Logic',
                                'Rule of 40',
                            ]}
                            onResourceClick={setSelectedResource}
                        />
                        <ClusterCard
                            title="Founder pathways"
                            description="Pick the content tailored to your current stage."
                            links={[
                                'Micro-SaaS Under $1M ARR',
                                'The Rule of 40',
                                'How to Value My SaaS',
                            ]}
                            onResourceClick={setSelectedResource}
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

function ResourceCard({ id, title, badge, icon, description, links = [], resources = [], onResourceClick }: any) {
    const handleLinkClick = (linkText: string) => {
        if (linkText.toLowerCase().includes('pro valuation')) {
            window.location.href = '/pro';
            return;
        }
        if (linkText.toLowerCase().includes('free valuation')) {
            window.location.href = '/';
            return;
        }
        const found = RESOURCES.find(r =>
            r.title.toLowerCase().includes(linkText.toLowerCase()) ||
            r.id.toLowerCase().includes(linkText.toLowerCase().replace(/ /g, '-'))
        );
        if (found) {
            onResourceClick?.(found);
        }
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
                    <li
                        key={resource.id}
                        onClick={() => onResourceClick?.(resource)}
                        className="text-teal-700 font-semibold hover:text-teal-800 cursor-pointer text-sm flex items-start gap-2 group"
                    >
                        <span className="mt-1.5 w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="group-hover:underline">{resource.title}</span>
                    </li>
                ))}
                {links.map((link: string, index: number) => (
                    <li
                        key={index}
                        onClick={() => handleLinkClick(link)}
                        className="text-teal-700 font-semibold hover:text-teal-800 cursor-pointer text-sm flex items-start gap-2 group"
                    >
                        <span className="mt-1.5 w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="group-hover:underline">{link}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ClusterCard({ title, description, links, onResourceClick }: any) {
    const handleLinkClick = (linkText: string) => {
        const found = RESOURCES.find(r =>
            r.title.toLowerCase().includes(linkText.toLowerCase()) ||
            r.id.toLowerCase().includes(linkText.toLowerCase().replace(/ /g, '-'))
        );
        if (found) {
            onResourceClick?.(found);
        }
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
                {links.map((link: string, index: number) => (
                    <li
                        key={index}
                        onClick={() => handleLinkClick(link)}
                        className="text-teal-700 font-semibold hover:text-teal-800 cursor-pointer text-sm flex items-start gap-2 group"
                    >
                        <span className="mt-1.5 w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="group-hover:underline">{link}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
