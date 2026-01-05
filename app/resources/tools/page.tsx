import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { RESOURCE_ARTICLES, RESOURCE_CATEGORIES } from '@/lib/resource-data';

export const metadata = {
    title: 'Tools & Calculators | SaaS Valuation Resources',
    description:
        'Browse valuation and efficiency tools with their companion guides. Every calculator now links to a full article with logic, assumptions, and FAQs.',
};

export default function ToolsIndex() {
    const tools = RESOURCE_CATEGORIES.filter(category => category.type === 'tools');
    return (
        <>
            <Header />
            <div className="min-h-screen bg-slate-50">
                <section className="bg-white py-12 border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-4">
                        <p className="text-sm font-semibold text-teal-700 uppercase">Tools</p>
                        <h1 className="text-4xl font-bold text-gray-900 font-display">Tools & calculators</h1>
                        <p className="text-gray-700 max-w-3xl">
                            Use these calculators and templates alongside their explainer articles. Everything is indexable and linked back to the resources hub.
                        </p>
                    </div>
                </section>

                <section className="py-10">
                    <div className="max-w-6xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {tools.map(category => (
                            <div key={category.slug} className="bg-white border border-gray-200 rounded-xl p-6 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        <Link href={`/resources/${category.slug}`} className="hover:underline">
                                            {category.title}
                                        </Link>
                                    </h2>
                                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-900 text-sm font-semibold">
                                        {category.badge}
                                    </span>
                                </div>
                                <p className="text-gray-700 text-sm">{category.description}</p>
                                <ul className="space-y-2">
                                    {RESOURCE_ARTICLES.filter(article => article.categorySlug === category.slug).map(article => (
                                        <li key={article.slug} className="text-teal-700 font-semibold text-sm">
                                            <Link href={`/resources/${article.slug}`} className="hover:underline">
                                                {article.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
