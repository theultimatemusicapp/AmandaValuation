import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    ArticleExamplesSection,
    ArticleFAQSection,
    ArticleFrame,
    ArticleHeader,
    ArticleListSection,
    ArticleSection,
    ArticleChecklistSection,
} from '@/components/Article';
import { RESOURCE_ARTICLES, RESOURCE_CATEGORIES, ResourceArticle, ResourceCategory } from '@/lib/resource-data';

const baseUrl = 'https://saasvaluation.app';

type PageParams = { params: { slug: string } };

export async function generateMetadata({ params }: PageParams, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = params;
    const category = RESOURCE_CATEGORIES.find(item => item.slug === slug);
    const article = RESOURCE_ARTICLES.find(item => item.slug === slug);

    if (!category && !article) {
        return (await parent) as Metadata;
    }

    if (category) {
        const title = `${category.title} | SaaS Valuation Resources`;
        return {
            title,
            description: category.description,
            keywords: category.keywords.join(', '),
            alternates: { canonical: `${baseUrl}/resources/${category.slug}` },
            openGraph: {
                title,
                description: category.description,
                url: `${baseUrl}/resources/${category.slug}`,
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description: category.description,
            },
        };
    }

    const categoryInfo = RESOURCE_CATEGORIES.find(item => item.slug === article!.categorySlug);
    const title = `${article!.title} | SaaS Valuation Resources`;
    return {
        title,
        description: article!.excerpt,
        keywords: article!.keywords.join(', '),
        alternates: { canonical: `${baseUrl}/resources/${article!.slug}` },
        openGraph: {
            title,
            description: article!.excerpt,
            url: `${baseUrl}/resources/${article!.slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: article!.excerpt,
        },
        other: {
            'article:section': categoryInfo?.title ?? 'Resources',
        },
    };
}

export function generateStaticParams() {
    const slugs = [...RESOURCE_CATEGORIES.map(item => item.slug), ...RESOURCE_ARTICLES.map(item => item.slug)];
    return slugs.map(slug => ({ slug }));
}

export default function ResourcePage({ params }: PageParams) {
    const { slug } = params;
    const category = RESOURCE_CATEGORIES.find(item => item.slug === slug);
    const article = RESOURCE_ARTICLES.find(item => item.slug === slug);

    if (!category && !article) {
        notFound();
    }

    if (category) {
        const articles = RESOURCE_ARTICLES.filter(item => item.categorySlug === category.slug);
        return (
            <>
                <Header />
                <div className="min-h-screen bg-slate-50">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Resources', href: '/resources' },
                            { label: category.title },
                        ]}
                    />
                    <section className="py-12 bg-white">
                        <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold">
                                    {category.badge}
                                </span>
                                <span className="text-sm text-gray-600">Last updated weekly</span>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 font-display">{category.title}</h1>
                            <p className="text-lg text-gray-700 max-w-3xl">{category.intro}</p>
                        </div>
                    </section>

                    <section className="py-12 bg-gray-50">
                        <div className="max-w-6xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-6">
                            {articles.map(item => (
                                <ArticleCard key={item.slug} article={item} category={category} />
                            ))}
                        </div>
                    </section>

                    <section className="py-12 bg-white">
                        <div className="max-w-6xl mx-auto px-6 lg:px-12 flex flex-wrap gap-4 items-center">
                            <Link
                                href="/resources"
                                className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700"
                            >
                                Back to resources hub
                            </Link>
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50"
                            >
                                Run the valuation calculator
                            </Link>
                        </div>
                    </section>
                </div>
                <Footer />
            </>
        );
    }

    const categoryInfo = RESOURCE_CATEGORIES.find(item => item.slug === article!.categorySlug)!;
    const relatedArticles = RESOURCE_ARTICLES.filter(item => article!.relatedSlugs.includes(item.slug));

    return (
        <>
            <Header />
            <ArticleFrame
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Resources', href: '/resources' },
                    { label: categoryInfo.title, href: `/resources/${categoryInfo.slug}` },
                    { label: article!.title },
                ]}
            >
                <section className="bg-white py-10">
                    <div className="article-container px-6 lg:px-0 space-y-6">
                        <ArticleHeader
                            badge={article!.badge}
                            category={categoryInfo.title}
                            updated={article!.lastUpdated}
                            title={article!.title}
                            intro={article!.excerpt}
                        />
                        <div className="flex gap-4 text-sm font-semibold flex-wrap text-teal-700">
                            <Link href={`/resources/${categoryInfo.slug}`} className="hover:underline">
                                View category
                            </Link>
                            <Link href="/resources" className="text-gray-700 hover:underline">
                                Back to resources
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-slate-50">
                    <div className="article-container px-6 lg:px-0 space-y-8">
                        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
                            <ArticleSection title="What you'll learn" content={article!.whatYouLearn} />
                            <DefinitionBox
                                definition={article!.definition}
                                categoryTitle={categoryInfo.title}
                                lastUpdated={article!.lastUpdated}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <ArticleListSection title="Why it matters" items={article!.whyItMatters} />
                            <ArticleSection title="The metric or formula" content={article!.metricOrFormula} />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <ArticleListSection title="Benchmarks & ranges" items={article!.benchmarks} />
                            <ArticleListSection title="Common mistakes" items={article!.commonMistakes} />
                        </div>

                        <ArticleListSection title="How to improve it" items={article!.improvements} />

                        <ArticleExamplesSection examples={article!.examples} />
                        <ArticleChecklistSection checklist={article!.checklist} />
                        <ArticleFAQSection faqs={article!.faqs} />
                        <RelatedSection related={relatedArticles} />
                        <CTASection lastUpdated={article!.lastUpdated} />
                    </div>
                </section>
            </ArticleFrame>
            <Footer />
            <StructuredData article={article!} category={categoryInfo} />
        </>
    );
}

function ArticleCard({ article, category }: { article: ResourceArticle; category: ResourceCategory }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 text-sm text-teal-700 font-semibold">
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs">{article.badge}</span>
                <span>{article.lastUpdated}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
                <Link href={`/resources/${article.slug}`} className="hover:underline">
                    {article.title}
                </Link>
            </h3>
            <p className="text-gray-700 text-sm">{article.excerpt}</p>
            <div className="flex gap-3 text-sm font-semibold">
                <Link href={`/resources/${article.slug}`} className="text-teal-700 hover:underline">
                    Read guide
                </Link>
                <Link href={`/resources/${category.slug}`} className="text-gray-700 hover:underline">
                    {category.badge}
                </Link>
            </div>
        </div>
    );
}

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
    return (
        <nav className="bg-gray-100 border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6 lg:px-12 py-3 text-sm text-gray-700 flex flex-wrap gap-1 items-center">
                {items.map((item, index) => (
                    <span key={item.label} className="flex items-center gap-1">
                        {item.href ? (
                            <Link href={item.href} className="hover:underline text-teal-700 font-semibold">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-900 font-semibold">{item.label}</span>
                        )}
                        {index < items.length - 1 && <span>/</span>}
                    </span>
                ))}
            </div>
        </nav>
    );
}

function DefinitionBox({
    definition,
    categoryTitle,
    lastUpdated,
}: {
    definition: string;
    categoryTitle: string;
    lastUpdated: string;
}) {
    const definitionParagraphs = definition
        .split(/\n\n+/)
        .map(paragraph => paragraph.trim())
        .filter(Boolean);

    return (
        <div className="article-card border-teal-100 space-y-3">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-teal-900">Quick definition (TL;DR)</h3>
                <span className="text-xs px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-semibold">{categoryTitle}</span>
            </div>
            <div className="article-prose text-teal-900 leading-relaxed space-y-3 max-w-3xl">
                {definitionParagraphs.map((paragraph, index) => (
                    <p key={`${categoryTitle}-definition-${index}`}>{paragraph}</p>
                ))}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-teal-900/80">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-teal-200 font-semibold">
                    <span className="text-teal-600">•</span> Updated {lastUpdated}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-teal-200 font-semibold">
                    <span className="text-teal-600">•</span> Save for deal prep
                </span>
            </div>
        </div>
    );
}

function RelatedSection({ related }: { related: ResourceArticle[] }) {
    if (!related.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Related resources</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {related.map(item => (
                    <div key={item.slug} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <p className="text-sm text-teal-700 font-semibold">{item.badge}</p>
                        <h3 className="text-lg font-semibold text-gray-900">
                            <Link href={`/resources/${item.slug}`} className="hover:underline">
                                {item.title}
                            </Link>
                        </h3>
                        <p className="text-gray-700 text-sm mt-1 leading-relaxed">{item.excerpt}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CTASection({ lastUpdated }: { lastUpdated: string }) {
    return (
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-6 shadow-sm space-y-3 text-white">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-xl font-bold">Run the SaaS valuation calculator</h3>
                <span className="text-xs px-3 py-1 rounded-full bg-white/20 font-semibold">Updated {lastUpdated}</span>
            </div>
            <p className="text-white/90 leading-relaxed">
                Plug your ARR, growth, retention, and margin into the calculator to see how these playbooks translate into value. No login required.
            </p>
            <div className="flex flex-wrap gap-3">
                <Link href="/" className="px-4 py-2 bg-white text-teal-800 rounded-lg font-semibold hover:bg-teal-50">
                    Open calculator
                </Link>
                <Link
                    href="/resources/tools-calculators"
                    className="px-4 py-2 border border-white/40 text-white rounded-lg font-semibold hover:bg-white/10"
                >
                    See tools & checklists
                </Link>
            </div>
        </div>
    );
}

function StructuredData({ article, category }: { article: ResourceArticle; category: ResourceCategory }) {
    const breadcrumbList = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
            { '@type': 'ListItem', position: 2, name: 'Resources', item: `${baseUrl}/resources` },
            {
                '@type': 'ListItem',
                position: 3,
                name: category.title,
                item: `${baseUrl}/resources/${category.slug}`,
            },
            {
                '@type': 'ListItem',
                position: 4,
                name: article.title,
                item: `${baseUrl}/resources/${article.slug}`,
            },
        ],
    };

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        author: { '@type': 'Person', name: article.author },
        dateModified: article.lastUpdated,
        mainEntityOfPage: `${baseUrl}/resources/${article.slug}`,
        about: article.keywords,
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        </>
    );
}
