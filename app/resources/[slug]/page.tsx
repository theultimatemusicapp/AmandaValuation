import { MDXRemote } from 'next-mdx-remote/rsc';
import { getResourceBySlug, getResourceSlugs } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { Metadata } from 'next';
import ResourceAnalytics from '@/components/ResourceAnalytics';
import TrackedLink from '@/components/TrackedLink';

// Generate static params for all resources to pre-build them (optional but good for SEO)
export async function generateStaticParams() {
    const slugs = getResourceSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const resource = getResourceBySlug(slug);

    if (!resource) {
        return {
            title: 'Resource Not Found',
        };
    }

    return {
        title: `${resource.meta.title} | SaaS Valuation Resources`,
        description: resource.meta.description,
        openGraph: {
            title: resource.meta.title,
            description: resource.meta.description,
            type: 'article',
            publishedTime: resource.meta.date,
            authors: [resource.meta.author],
        },
    };
}

export default async function ResourceArticle({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const resource = getResourceBySlug(slug);

    if (!resource) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <Header />

            <main className="pt-24 pb-16">
                <ResourceAnalytics slug={slug} />
                <article className="max-w-3xl mx-auto px-6">
                    {/* Breadcrumb / Back */}
                    <div className="mb-8 flex items-center gap-2 text-sm">
                        <Link href="/resources" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors font-medium">
                            <ArrowLeft className="w-4 h-4" /> Back to Resources
                        </Link>
                        <span className="text-slate-600">/</span>
                        <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-md">{resource.meta.title}</span>
                    </div>

                    {/* Header */}
                    <header className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-900/50 text-teal-200 border border-teal-800">
                                {resource.meta.category}
                            </span>
                            <span className="text-slate-600 text-sm">•</span>
                            <span className="text-slate-400 text-sm font-medium">{resource.meta.readTime}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6 leading-tight">
                            {resource.meta.title}
                        </h1>

                        <div className="flex items-center justify-between border-y border-slate-800 py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-900/50 flex items-center justify-center text-brand-400 font-bold text-lg border border-brand-800">
                                    {resource.meta.author.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold text-white text-sm">{resource.meta.author}</div>
                                    <div className="text-slate-400 text-xs flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {resource.meta.date}
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </header>

                    {resource.meta.image && (
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                            <img
                                src={resource.meta.image}
                                alt={resource.meta.title}
                                className="w-full h-auto object-cover max-h-[400px]"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-lg prose-invert prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white prose-teal max-w-none 
                        prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h3:text-xl
                        prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-brand-500 prose-blockquote:bg-slate-800/50 prose-blockquote:py-1 prose-blockquote:pr-4"
                    >
                        <MDXRemote source={resource.content} components={{ a: TrackedLink }} />
                    </div>

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
