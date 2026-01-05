import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
            <article className="bg-slate-50">
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Resources', href: '/resources' },
                        { label: categoryInfo.title, href: `/resources/${categoryInfo.slug}` },
                        { label: article!.title },
                    ]}
                />

                <section className="bg-white py-12">
                    <div className="max-w-5xl mx-auto px-6 lg:px-10 space-y-6">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold">
                                {article!.badge}
                            </span>
                            <span className="text-sm text-gray-600">Category: {categoryInfo.title}</span>
                            <span className="text-sm text-gray-600">Last updated: {article!.lastUpdated}</span>
                            <Link
                                href={`/resources/${categoryInfo.slug}`}
                                className="text-teal-700 font-semibold text-sm hover:underline"
                            >
                                View category
                            </Link>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 font-display">{article!.title}</h1>
                        <p className="text-lg text-gray-700 max-w-4xl">{article!.excerpt}</p>
                    </div>
                </section>

                <section className="py-10">
                    <div className="max-w-5xl mx-auto px-6 lg:px-10 space-y-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                        <ArticleSection title="What you'll learn" content={article!.whatYouLearn} />
                        <DefinitionBox definition={article!.definition} />
                        <BulletSection title="Why it matters" items={article!.whyItMatters} />
                        <ArticleSection title="The metric or formula" content={article!.metricOrFormula} />
                        <BulletSection title="Benchmarks & ranges" items={article!.benchmarks} />
                        <BulletSection title="Common mistakes" items={article!.commonMistakes} />
                        <BulletSection title="How to improve it" items={article!.improvements} />
                        <ExamplesSection examples={article!.examples} />
                        <ChecklistSection checklist={article!.checklist} />
                        <FAQSection faqs={article!.faqs} />
                        <RelatedSection related={relatedArticles} />
                        <CTASection />
                        <p className="text-sm text-gray-500">Last updated: {article!.lastUpdated}</p>
                    </div>
                </section>
            </article>
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

function ArticleSection({ title, content }: { title: string; content: string }) {
    return (
        <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-700 leading-relaxed">{content}</p>
        </div>
    );
}

function DefinitionBox({ definition }: { definition: string }) {
    return (
        <div className="border border-teal-100 bg-teal-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-teal-900 mb-1">Quick definition (TL;DR)</h3>
            <p className="text-teal-900">{definition}</p>
        </div>
    );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
    return (
        <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {items.map(item => (
                    <li key={item} className="leading-relaxed">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ExamplesSection({ examples }: { examples: { title: string; content: string }[] }) {
    return (
        <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Examples</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {examples.map(example => (
                    <div key={example.title} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">{example.title}</h3>
                        <p className="text-gray-700 mt-2 leading-relaxed">{example.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ChecklistSection({ checklist }: { checklist: string[] }) {
    return (
        <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Checklist (copy/paste)</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {checklist.map(item => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

function FAQSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
    return (
        <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">FAQs</h2>
            <div className="space-y-3">
                {faqs.map(faq => (
                    <div key={faq.question} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <p className="text-gray-900 font-semibold">{faq.question}</p>
                        <p className="text-gray-700 mt-1 leading-relaxed">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RelatedSection({ related }: { related: ResourceArticle[] }) {
    if (!related.length) return null;
    return (
        <div className="space-y-3">
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
                        <p className="text-gray-700 text-sm mt-1">{item.excerpt}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CTASection() {
    return (
        <div className="border border-teal-200 bg-teal-50 rounded-xl p-5 space-y-2">
            <h3 className="text-xl font-bold text-teal-900">Run the SaaS valuation calculator</h3>
            <p className="text-teal-900">
                Plug your ARR, growth, retention, and margin into the calculator to see how these playbooks translate into value. No login required.
            </p>
            <div className="flex flex-wrap gap-3">
                <Link href="/" className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700">
                    Open calculator
                </Link>
                <Link
                    href="/resources/tools-calculators"
                    className="px-4 py-2 border border-teal-200 text-teal-900 rounded-lg font-semibold hover:bg-white"
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
