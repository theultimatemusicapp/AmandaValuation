import { getResource, RESOURCES } from '@/lib/resources';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import { Metadata } from 'next';

// Generate static params for all resources to pre-build them (optional but good for SEO)
export async function generateStaticParams() {
    return RESOURCES.map((resource) => ({
        slug: resource.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const resource = getResource(slug);

    if (!resource) {
        return {
            title: 'Resource Not Found',
        };
    }

    return {
        title: `${resource.title} | SaaS Valuation Resources`,
        description: resource.description,
        openGraph: {
            title: resource.title,
            description: resource.description,
            type: 'article',
            publishedTime: resource.date, // Note: Date format might need parsing if strict ISO
            authors: [resource.author],
        },
    };
}

export default async function ResourceArticle({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const resource = getResource(slug);

    if (!resource) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="pt-24 pb-16">
                <article className="max-w-3xl mx-auto px-6">
                    {/* Breadcrumb / Back */}
                    <div className="mb-8">
                        <Link href="/resources" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors text-sm font-medium">
                            <ArrowLeft className="w-4 h-4" /> Back to Resources
                        </Link>
                    </div>

                    {/* Header */}
                    <header className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                                {resource.category}
                            </span>
                            <span className="text-slate-400 text-sm">•</span>
                            <span className="text-slate-500 text-sm font-medium">{resource.readTime}</span>
                        </div>

                        {resource.image && (
                            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                                <img
                                    src={resource.image}
                                    alt={resource.title}
                                    className="w-full h-auto object-cover max-h-[400px]"
                                />
                            </div>
                        )}

                        <h1 className="text-3xl md:text-5xl font-bold font-display text-slate-900 mb-6 leading-tight">
                            {resource.title}
                        </h1>

                        <div className="flex items-center justify-between border-y border-slate-200 py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg">
                                    {resource.author.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900 text-sm">{resource.author}</div>
                                    <div className="text-slate-500 text-xs flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {resource.date}
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </header>

                    {/* Content */}
                    <div
                        className="prose prose-lg prose-slate prose-teal max-w-none 
                        prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h3:text-xl
                        prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: resource.content }}
                    />

                    {/* CTA Box */}
                    <div className="mt-16 bg-slate-900 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-500/10 to-blue-500/10 z-0" />
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-4 font-display">Ready to value your SaaS?</h3>
                            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                                Stop guessing. Get a data-driven valuation in less than 2 minutes with our free calculator.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-8 py-3 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-brand-500/25"
                            >
                                Start Free Valuation
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
