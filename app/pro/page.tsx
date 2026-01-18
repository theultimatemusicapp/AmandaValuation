import ProValuationWizard from '@/components/ProValuationWizard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type ProValuationPageProps = {
    searchParams?: Promise<{
        paid?: string;
    }>;
};

export default async function ProValuation({ searchParams }: ProValuationPageProps) {
    const resolvedParams = (await searchParams) ?? {};
    return (
        <>
            <Header />
            <ProValuationWizard paid={resolvedParams.paid} />
            <Footer />
        </>
    );
}
