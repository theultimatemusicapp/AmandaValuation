
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import * as cheerio from 'cheerio';

const CONTENT_DIR = path.join(process.cwd(), 'content/resources');
const MIN_WORD_COUNT = 1000;
const REQUIRED_SECTIONS = [
    'What you’ll learn',
    'TL;DR',
    'Examples',
    'Checklist',
    'FAQ',
    'Valuation Calculator' // CTA
];

async function validateContent() {
    if (!fs.existsSync(CONTENT_DIR)) {
        console.error(`❌ Content directory not found: ${CONTENT_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'));
    let hasError = false;

    console.log(`🔍 Scanning ${files.length} articles in ${CONTENT_DIR}...\n`);

    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        const errors: string[] = [];

        // 1. Metadata Checks
        if (!data.title) errors.push('Missing Title');
        if (!data.description) errors.push('Missing Description');
        if (!data.canonicalUrl) errors.push('Missing Canonical URL');
        // OG Title derived from title is fine


        // 2. Word Count
        const wordCount = content.split(/\s+/).length;
        if (wordCount < MIN_WORD_COUNT) {
            errors.push(`Word count too low: ${wordCount} (Min: ${MIN_WORD_COUNT})`);
        }

        // 3. Structure Checks (H1 check is implicit via metadata title usually, but let's check content for headers)
        // We use simple regex or string includes for MDX specific components

        // H1 check - usually title in frontmatter is used as H1, but if content must include it:
        // if (!content.includes('# ')) errors.push('Missing H1 (# Title)'); 

        REQUIRED_SECTIONS.forEach(section => {
            // Flexible matching: check if the phrase exists in content
            // For components like <Examples />, check for that string
            // For "What you'll learn", check string
            const regex = new RegExp(section, 'i');
            if (!regex.test(content)) {
                errors.push(`Missing section: "${section}"`);
            }
        });

        // 4. Image Count
        const imageMatches = content.match(/!\[.*?\]\(.*?\)|<img/g) || [];
        // Also check for custom Image components if used
        const componentImageMatches = content.match(/<Image/g) || [];
        const totalImages = imageMatches.length + componentImageMatches.length;

        if (totalImages < 2) {
            errors.push(`Not enough images: ${totalImages} (Min: 2)`);
        }

        // 5. Alt Text (Simplistic check: ensure ![]() has text inside brackets)
        const emptyAltMatches = content.match(/!\[\]\(.*?\)/g);
        if (emptyAltMatches) {
            errors.push(`Found ${emptyAltMatches.length} images with missing alt text`);
        }

        // Output Result
        if (errors.length > 0) {
            hasError = true;
            console.error(`❌ ${file} FAILED:`);
            errors.forEach(e => console.error(`   - ${e}`));
        } else {
            console.log(`✅ ${file} PASSED (${wordCount} words)`);
        }
    }

    if (hasError) {
        console.error('\n💥 Validation Failed. Please fix the errors above.');
        process.exit(1);
    } else {
        console.log('\n✨ All articles passed quality gate!');
    }
}

validateContent();
