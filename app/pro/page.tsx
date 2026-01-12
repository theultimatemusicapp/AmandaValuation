import ProValuationWizard from '@/components/ProValuationWizard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type ProValuationPageProps = {
    searchParams?: {
        paid?: string;
    };
};

export default function ProValuation({ searchParams }: ProValuationPageProps) {
    return (
        <>
            <Header />
            <ProValuationWizard paid={searchParams?.paid} />
            <Footer />
        </>
    );
}
