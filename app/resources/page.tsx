import ResourcesPage from '@/components/ResourcesPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Resources Hub | SaaS Valuation App',
    description: 'Browse SaaS valuation resources organized by pillar and cluster topics. Jump to valuation fundamentals, exit readiness, efficiency tactics, and AI market shifts.',
    keywords: 'SaaS valuation resources, valuation guides, SaaS pricing, exit readiness, SaaS multiples, AI SaaS trends',
    openGraph: {
        title: 'Resources Hub | SaaS Valuation App',
        description: 'Browse SaaS valuation resources organized by pillar and cluster topics, including valuation guides, exit prep checklists, and pricing playbooks.',
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
