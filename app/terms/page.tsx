import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-slate-950">
            <Header />

            <div className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold font-display text-white mb-8">Terms of Service</h1>

                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <p className="text-sm text-slate-500 mb-8">Last Updated: December 30, 2025</p>

                    <h2>1. Agreement to Terms</h2>
                    <p>
                        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and SaaS Valuation ("we," "us" or "our"), concerning your access to and use of the saasvaluation.app website.
                    </p>

                    <h2>2. Nature of Services</h2>
                    <p>
                        SaaS Valuation provides automated business valuation estimates based on user-provided data. <strong>These valuations are estimates only and do NOT constitute professional financial, legal, or investment advice.</strong> You should not rely solely on these results for any financial decisions, mergers, or acquisitions. Always consult with a qualified financial advisor.
                    </p>

                    <h2>3. Intellectual Property</h2>
                    <p>
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                    </p>

                    <h2>4. User Representations</h2>
                    <p>
                        By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information; (3) you have the legal capacity and you agree to comply with these Terms of Service.
                    </p>

                    <h2>5. Pro Plans and Payments</h2>
                    <p>
                        For our paid "Pro" services, you agree to provide current, complete, and accurate purchase and account information. All payments are processed securely via Stripe. We reserve the right to refuse or cancel any order for any reason including limitations on quantities available, inaccuracies, or errors in product or pricing information.
                    </p>
                    <p>All sales are final and no refunds will be issued unless otherwise required by law.</p>

                    <h2>6. Limitation of Liability</h2>
                    <p>
                        In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site.
                    </p>

                    <h2>7. Contact Us</h2>
                    <p>
                        In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at support@saasvaluation.app.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
