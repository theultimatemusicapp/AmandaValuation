import Link from 'next/link';
import { ReactNode } from 'react';
import clsx from 'clsx';

function normalizeParagraphs(content: string | string[]): string[] {
    if (Array.isArray(content)) return content;
    return content.split(/\n\n+/).map(paragraph => paragraph.trim()).filter(Boolean);
}

function renderParagraphs(content: string | string[], keyPrefix: string) {
    return normalizeParagraphs(content).map((paragraph, index) => (
        <p key={`${keyPrefix}-${index}`}>{paragraph}</p>
    ));
}

type ArticleProps = {
    children: ReactNode;
    className?: string;
};

export function Article({ children, className }: ArticleProps) {
    return <article className={clsx('article-shell', className)}>{children}</article>;
}

type ArticleHeaderProps = {
    badge?: string;
    category?: string;
    updated?: string;
    title: string;
    intro?: string;
};

export function ArticleHeader({ badge, category, updated, title, intro }: ArticleHeaderProps) {
    return (
        <header className="article-hero">
            <div className="flex items-center gap-3 flex-wrap text-sm text-slate-700">
                {badge && (
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-semibold">{badge}</span>
                )}
                {category && <span className="font-semibold text-teal-700">Category: {category}</span>}
                {updated && <span className="text-gray-600">Last updated: {updated}</span>}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 font-display leading-tight">{title}</h1>
            {intro && <p className="article-lead">{intro}</p>}
        </header>
    );
}

type ArticleSectionProps = {
    title: string;
    content: string | string[];
    kicker?: string;
};

export function ArticleSection({ title, content, kicker }: ArticleSectionProps) {
    return (
        <section className="article-card" aria-labelledby={title.replace(/\s+/g, '-').toLowerCase()}>
            <div className="space-y-2">
                {kicker && <p className="text-sm font-semibold text-teal-700 uppercase">{kicker}</p>}
                <h2 id={title.replace(/\s+/g, '-').toLowerCase()} className="text-2xl font-bold text-gray-900">
                    {title}
                </h2>
            </div>
            <div className="article-prose space-y-4 leading-relaxed">
                {renderParagraphs(content, title)}
            </div>
        </section>
    );
}

type ArticleListSectionProps = {
    title: string;
    items: string[];
};

export function ArticleListSection({ title, items }: ArticleListSectionProps) {
    return (
        <section className="article-card" aria-labelledby={title.replace(/\s+/g, '-').toLowerCase()}>
            <h2 id={title.replace(/\s+/g, '-').toLowerCase()} className="text-2xl font-bold text-gray-900 mb-2">
                {title}
            </h2>
            <ul className="article-prose list-disc pl-5 space-y-2 leading-relaxed">
                {items.map(item => (
                    <li key={item}>
                        <p>{item}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}

type ArticleExamplesSectionProps = {
    examples: { title: string; content: string }[];
};

export function ArticleExamplesSection({ examples }: ArticleExamplesSectionProps) {
    return (
        <section className="article-card space-y-4" aria-labelledby="examples">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <p className="text-sm font-semibold text-teal-700 uppercase">Examples</p>
                    <h2 id="examples" className="text-2xl font-bold text-gray-900">
                        Proof points you can reuse
                    </h2>
                </div>
                <span className="text-sm text-gray-500">Copyable narratives for your deck</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                {examples.map(example => (
                    <article key={example.title} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">{example.title}</h3>
                        <div className="article-prose space-y-3 leading-relaxed">
                            {renderParagraphs(example.content, `${example.title}-example`)}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

type ArticleChecklistSectionProps = {
    checklist: string[];
};

export function ArticleChecklistSection({ checklist }: ArticleChecklistSectionProps) {
    return (
        <section className="article-card" aria-labelledby="checklist">
            <h2 id="checklist" className="text-2xl font-bold text-gray-900 mb-2">
                Checklist (copy/paste)
            </h2>
            <ul className="article-prose list-disc pl-5 space-y-2 leading-relaxed">
                {checklist.map(item => (
                    <li key={item}>
                        <p>{item}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}

type ArticleFAQSectionProps = {
    faqs: { question: string; answer: string }[];
};

export function ArticleFAQSection({ faqs }: ArticleFAQSectionProps) {
    return (
        <section className="article-card space-y-4" aria-labelledby="faqs">
            <h2 id="faqs" className="text-2xl font-bold text-gray-900">
                FAQs
            </h2>
            <div className="space-y-3">
                {faqs.map(faq => (
                    <article key={faq.question} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <h3 className="text-gray-900 font-semibold text-lg">{faq.question}</h3>
                        <div className="article-prose space-y-3 leading-relaxed">
                            {renderParagraphs(faq.answer, `${faq.question}-answer`)}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export type ArticleBreadcrumbItem = { label: string; href?: string };

type ArticleFrameProps = {
    breadcrumbs: ArticleBreadcrumbItem[];
    children: ReactNode;
};

export function ArticleFrame({ breadcrumbs, children }: ArticleFrameProps) {
    return (
        <Article>
            <nav className="bg-gray-100 border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 lg:px-12 py-3 text-sm text-gray-700 flex flex-wrap gap-1 items-center">
                    {breadcrumbs.map((item, index) => (
                        <span key={item.label} className="flex items-center gap-1">
                            {item.href ? (
                                <Link href={item.href} className="hover:underline text-teal-700 font-semibold">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-gray-900 font-semibold">{item.label}</span>
                            )}
                            {index < breadcrumbs.length - 1 && <span>/</span>}
                        </span>
                    ))}
                </div>
            </nav>
            {children}
        </Article>
    );
}
