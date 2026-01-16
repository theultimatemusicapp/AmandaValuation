export interface Author {
    id: string;
    name: string;
    role: string;
    bio: string;
    expertise: string[];
    avatarPath: string;
    slug: string;
}

export const AUTHORS: Record<string, Author> = {
    'sarah-mitchell': {
        id: 'sarah-mitchell',
        name: 'Sarah Mitchell',
        role: 'SaaS M&A Analyst',
        bio: 'Sarah has spent 10 years analyzing mid-market SaaS transactions. She specializes in helping founders understand buyer perspectives and prepare exit-ready financials.',
        expertise: ['M&A', 'Exit Strategy', 'Micro-SaaS', 'Due Diligence'],
        avatarPath: '/images/authors/sarah-mitchell.jpg',
        slug: 'sarah-mitchell'
    },
    'alex-morgan': {
        id: 'alex-morgan',
        name: 'Alex Morgan',
        role: 'Financial Modeling Specialist',
        bio: 'With 12 years in SaaS financial analysis, Alex focuses on valuation methodologies and building accurate financial models for growing companies.',
        expertise: ['Valuation Methods', 'Financial Modeling', 'DCF Analysis', 'Revenue Multiples'],
        avatarPath: '/images/authors/alex-morgan.jpg',
        slug: 'alex-morgan'
    },
    'jordan-blake': {
        id: 'jordan-blake',
        name: 'Jordan Blake',
        role: 'Growth Strategy Advisor',
        bio: 'Jordan has 9 years of experience helping SaaS companies optimize their growth metrics and unit economics for better valuations.',
        expertise: ['Growth Metrics', 'Unit Economics', 'Rule of 40', 'NRR Optimization'],
        avatarPath: '/images/authors/jordan-blake.jpg',
        slug: 'jordan-blake'
    }
};

export function getAuthorBySlug(slug: string): Author | undefined {
    return AUTHORS[slug];
}

export function getAllAuthors(): Author[] {
    return Object.values(AUTHORS);
}
