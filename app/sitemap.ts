import { MetadataRoute } from 'next';
import { RESOURCE_ARTICLES, RESOURCE_CATEGORIES } from '@/lib/resource-data';

export default function sitemap(): MetadataRoute.Sitemap {
    const base = 'https://saasvaluation.app';
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
        { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
        { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
        { url: `${base}/pro`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${base}/payment`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${base}/editorial-standards`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
        { url: `${base}/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
        { url: `${base}/resources`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${base}/resources/pillars`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${base}/resources/clusters`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${base}/resources/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    ];

    const categoryPages: MetadataRoute.Sitemap = RESOURCE_CATEGORIES.map(category => ({
        url: `${base}/resources/${category.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: category.type === 'pillar' ? 0.75 : 0.6,
    }));

    const articlePages: MetadataRoute.Sitemap = RESOURCE_ARTICLES.map(article => ({
        url: `${base}/resources/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    return [...staticPages, ...categoryPages, ...articlePages];
}
