import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content/resources');

export function getResourceSlugs() {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    return fs.readdirSync(CONTENT_DIR)
        .filter(f => f.endsWith('.mdx'))
        .map(f => f.replace(/\.mdx$/, ''));
}

export function getResourceBySlug(slug: string) {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) return null;

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
        slug,
        meta: data,
        content
    };
}

export function getAllResources() {
    const slugs = getResourceSlugs();
    const resources = slugs.map(slug => getResourceBySlug(slug)).filter(Boolean);
    // Sort by date if present
    return resources.sort((a: any, b: any) => {
        return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
    });
}
