import PaymentPage from '@/components/PaymentPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type PaymentPageProps = {
    searchParams?: Promise<{
        returnTo?: string;
    }>;
};

export default async function Payment({ searchParams }: PaymentPageProps) {
    const resolvedParams = (await searchParams) ?? {};
    const returnTo = resolvedParams.returnTo ?? '/pro';

    return (
        <>
            <Header />
            <PaymentPage returnTo={returnTo} />
            <Footer />
        </>
    );
}
