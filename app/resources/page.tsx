import ResourcesPage from '@/components/ResourcesPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'SaaS Valuation Multiples 2026 | Free Calculator & Exit Guide',
    description: 'Master SaaS valuation with 2026 multiples data, free calculator, and exit strategies. Learn how to value your SaaS business from $500K to $10M+ ARR with proven frameworks.',
    keywords: 'SaaS valuation calculator 2026, SaaS business valuation multiples, how to value a SaaS company, SaaS exit strategy, ARR multiples, Rule of 40, SaaS metrics',
    openGraph: {
        title: 'SaaS Valuation Multiples 2026 | Free Calculator & Resources',
        description: 'Get accurate SaaS valuation multiples for 2026. Free calculator, exit guides, and proven strategies to maximize your SaaS business value.',
    },
};

export default function Resources() {
    return (
        <>
            <Header />
            <ResourcesPage />
            <Footer />
        </>
    );
}
