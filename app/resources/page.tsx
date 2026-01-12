import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RESOURCE_ARTICLES, RESOURCE_CATEGORIES } from '@/lib/resource-data';
import SaaSNews from '@/components/SaaSNews';

const baseUrl = 'https://saasvaluation.app';

const metaTitle = 'Resources Hub | SaaS Valuation App';
const metaDescription =
    'Browse SaaS valuation resources organized by pillar, cluster, and tools. Dive into valuation fundamentals, exit readiness, efficiency metrics, AI market shifts, and resilience playbooks.';

export const metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords:
        'SaaS valuation resources, valuation guides, SaaS pricing, exit readiness, SaaS multiples, AI SaaS trends, burn multiple, Rule of 40',
    alternates: {
        canonical: `${baseUrl}/resources`,
    },
    openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: `${baseUrl}/resources`,
    },
    twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
    },
};

export default function ResourcesHub() {
    const pillars = RESOURCE_CATEGORIES.filter(category => category.type === 'pillar');
    const clusters = RESOURCE_CATEGORIES.filter(category => category.type === 'cluster');
    const tools = RESOURCE_CATEGORIES.filter(category => category.type === 'tools');

    const featuredArticles = RESOURCE_ARTICLES.slice(0, 3);
    const valuationCluster = RESOURCE_CATEGORIES.find(category => category.slug === 'saas-valuation');
    const startHere = RESOURCE_ARTICLES.filter(article =>
        [
            'how-to-value-a-saas-company',
            'saas-valuation-101',
            'arr-mrr-and-valuation-multiples',
            'valuation-multiples-by-growth-rate',
            'saas-valuation-checklist-template',
        ].includes(article.slug),
    );

    return (
        <>
            <Header />
            <div className="min-h-screen bg-slate-50">
                <section className="bg-gradient-to-r from-teal-700 to-blue-700 text-white py-16">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-10 items-center">
                        <div className="space-y-5">
                            <p className="uppercase tracking-wide text-sm font-semibold text-teal-100">Resources</p>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight font-display">
                                Resources hub for valuation, exits, and growth
                            </h1>
                            <p className="text-lg text-teal-50 max-w-2xl">
                                Every resource now lives on its own indexable page. Pick a pillar or cluster, then dive into the
                                deep guides with calculators, benchmarks, and action checklists.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {RESOURCE_CATEGORIES.map(category => (
                                    <span
                                        key={category.slug}
                                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white px-3 py-2 rounded-full font-semibold text-sm"
                                    >
                                        {category.badge} · {category.title}
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-3 flex-wrap pt-2">
                                <Link
                                    href="/resources/pillars"
                                    className="bg-white text-teal-800 px-4 py-2 rounded-lg font-semibold hover:bg-teal-50"
                                >
                                    Explore pillars
                                </Link>
                                <Link
                                    href="/resources/clusters"
                                    className="border border-white/40 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/10"
                                >
                                    Explore clusters
                                </Link>
                                <Link
                                    href="/resources/tools"
                                    className="border border-white/40 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/10"
                                >
                                    Tools & calculators
                                </Link>
                            </div>
                        </div>
                        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur">
                            <div className="bg-white text-gray-900 rounded-xl p-6 space-y-4 shadow-lg">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm uppercase font-semibold text-teal-600">Pillar playbooks</p>
                                        <h2 className="text-2xl font-bold">Start with a pillar, dive into clusters</h2>
                                    </div>
                                    <span className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold">
                                        Map
                                    </span>
                                </div>
                                <ul className="space-y-3 text-gray-700 text-sm">
                                    <li className="flex items-start gap-3">
                                        <span className="text-teal-600">✓</span>
                                        <span>Pricing your SaaS: valuation multiples, calculators, and the 2026 valuation guide.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-teal-600">✓</span>
                                        <span>Exit readiness: buyer scorecards, resilience playbooks, and founder decision frameworks.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-teal-600">✓</span>
                                        <span>Efficiency: burn multiples, Rule of 40, NRR, and pricing power experiments.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-teal-600">✓</span>
                                        <span>Market shifts: AI premiums, positioning, and cluster-level next steps.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {valuationCluster && (
                    <section className="py-14 bg-white border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
                            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
                                <div className="space-y-4">
                                    <p className="text-sm font-semibold text-teal-700 uppercase">New valuation cluster</p>
                                    <h2 className="text-3xl font-bold text-gray-900 font-display">{valuationCluster.title}</h2>
                                    <p className="text-gray-700 max-w-3xl">{valuationCluster.description}</p>
                                    <div className="flex flex-wrap gap-3">
                                        <Link
                                            href={`/resources/${valuationCluster.slug}`}
                                            className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700"
                                        >
                                            View the full cluster
                                        </Link>
                                        <Link href="/resources/clusters" className="text-teal-700 font-semibold hover:underline">
                                            Explore all clusters
                                        </Link>
                                    </div>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4">
                                    <p className="text-sm font-semibold text-gray-600 uppercase">Start here</p>
                                    <ul className="space-y-3">
                                        {startHere.map(article => (
                                            <li key={article.slug} className="text-sm font-semibold text-teal-700">
                                                <Link href={`/resources/${article.slug}`} className="hover:underline">
                                                    {article.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/resources"
                                    className="px-3 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                                >
                                    All categories
                                </Link>
                                {RESOURCE_CATEGORIES.map(category => (
                                    <Link
                                        key={category.slug}
                                        href={`/resources/${category.slug}`}
                                        className="px-3 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                                    >
                                        {category.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section className="py-14 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-teal-700 uppercase">Pillar tracks</p>
                            <h2 className="text-3xl font-bold text-gray-900 font-display">Start with a pillar page</h2>
                            <p className="text-gray-700 max-w-3xl">
                                Each pillar frames the story buyers expect. Every category page now links to its articles so Google and your
                                team can index them directly.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {pillars.map(category => (
                                <CategoryCard key={category.slug} category={category} />
                            ))}
                            {tools.map(category => (
                                <CategoryCard key={category.slug} category={category} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-14 bg-gray-100">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-1 space-y-3">
                            <p className="text-sm font-semibold text-teal-700 uppercase">Cluster deep-dives</p>
                            <h2 className="text-3xl font-bold text-gray-900 font-display">Pick your next step</h2>
                            <p className="text-gray-700">
                                Choose a theme to find related posts that reinforce the same narrative and metrics.
                            </p>
                            <div className="flex gap-3 flex-wrap pt-1">
                                <Link
                                    href="/resources/clusters"
                                    className="text-teal-800 font-semibold underline-offset-4 hover:underline"
                                >
                                    View all clusters
                                </Link>
                            </div>
                        </div>
                        <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
                            {clusters.map(cluster => (
                                <ClusterCard key={cluster.slug} category={cluster} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-14 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-10 items-start">
                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-teal-700 uppercase">Latest resources</p>
                            <h2 className="text-3xl font-bold text-gray-900 font-display">Freshly published</h2>
                            <p className="text-gray-700 max-w-2xl">
                                Each article is a standalone URL with full templates, benchmarks, and checklists to keep click depth low and utility high.
                            </p>
                            <div className="space-y-4">
                                {featuredArticles.map(article => (
                                    <div key={article.slug} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-sm text-teal-700 font-semibold">
                                            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs">
                                                {article.badge}
                                            </span>
                                            <span>{article.updatedAt}</span>
                                        </div>
                                        <h3 className="text-xl font-semibold mt-2 text-gray-900">
                                            <Link href={`/resources/${article.slug}`} className="hover:underline">
                                                {article.title}
                                            </Link>
                                        </h3>
                                        <p className="text-gray-700 text-sm mt-2">{article.excerpt}</p>
                                        <div className="mt-3 flex gap-3">
                                            <Link
                                                href={`/resources/${article.slug}`}
                                                className="text-teal-700 font-semibold text-sm hover:underline"
                                            >
                                                Read the guide
                                            </Link>
                                            <Link
                                                href={`/resources/${article.categorySlug}`}
                                                className="text-gray-700 font-semibold text-sm hover:underline"
                                            >
                                                View category
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

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
                                <p className="text-xs text-gray-300">By subscribing, you agree to our Privacy Policy.</p>
                            </form>
                        </div>
                    </div>
                </section>

                <section className="py-14 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-6">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-teal-700 uppercase">Latest SaaS + Tech Business Trends</p>
                            <h2 className="text-3xl font-bold text-gray-900 font-display">
                                Latest SaaS + Tech Business Trends
                            </h2>
                        </div>
                        <SaaSNews />
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

function CategoryCard({ category }: { category: (typeof RESOURCE_CATEGORIES)[number] }) {
    const articles = RESOURCE_ARTICLES.filter(article => article.categorySlug === category.slug);
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                    <Link href={`/resources/${category.slug}`} className="hover:underline">
                        {category.title}
                    </Link>
                </h3>
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {category.badge}
                </span>
            </div>
            <p className="text-gray-700">{category.description}</p>
            <ul className="space-y-2">
                {articles.map(article => (
                    <li key={article.slug} className="text-teal-700 font-semibold hover:text-teal-800 text-sm flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0" />
                        <Link href={`/resources/${article.slug}`} className="group-hover:underline">
                            {article.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ClusterCard({ category }: { category: (typeof RESOURCE_CATEGORIES)[number] }) {
    const articles = RESOURCE_ARTICLES.filter(article => article.categorySlug === category.slug);
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                    <Link href={`/resources/${category.slug}`} className="hover:underline">
                        {category.title}
                    </Link>
                </h3>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                    {category.badge}
                </span>
            </div>
            <p className="text-gray-700 text-sm">{category.description}</p>
            <ul className="space-y-2">
                {articles.map(article => (
                    <li key={article.slug} className="text-teal-700 font-semibold hover:text-teal-800 text-sm flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0" />
                        <Link href={`/resources/${article.slug}`} className="group-hover:underline">
                            {article.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
