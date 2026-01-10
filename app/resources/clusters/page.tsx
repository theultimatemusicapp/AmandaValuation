import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { RESOURCE_ARTICLES, RESOURCE_CATEGORIES } from '@/lib/resource-data';

export const metadata = {
    title: 'Resource Clusters | SaaS Valuation Resources',
    description:
        'Explore cluster pages focused on AI market shifts and risk resilience. Each cluster links to its deep-dive articles and related playbooks.',
};

export default function ClustersIndex() {
    const clusters = RESOURCE_CATEGORIES.filter(category => category.type === 'cluster');
    return (
        <>
            <Header />
            <div className="min-h-screen bg-slate-50">
                <section className="bg-white py-12 border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-4">
                        <p className="text-sm font-semibold text-teal-700 uppercase">Clusters</p>
                        <h1 className="text-4xl font-bold text-gray-900 font-display">Cluster deep-dives</h1>
                        <p className="text-gray-700 max-w-3xl">
                            Find the cluster that matches your next move. Each cluster page is indexable and includes related guides to keep readers moving.
                        </p>
                    </div>
                </section>

                <section className="py-10">
                    <div className="max-w-6xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-6">
                        {clusters.map(category => (
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
