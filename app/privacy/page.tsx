import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-slate-950">
            <Header />

            <div className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold font-display text-white mb-8">Privacy Policy</h1>

                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <p className="text-sm text-slate-500 mb-8">Last Updated: December 30, 2025</p>

                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to SaaS Valuation ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
                    </p>

                    <h2>2. Information We Collect</h2>
                    <p>
                        We collect personal information that you voluntarily provide to us when you use our valuation tools, register for an account, or express an interest in obtaining information about us or our products and services.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Personal Data:</strong> Name, email address, and company name provided during the valuation process.</li>
                        <li><strong>Financial Data:</strong> Revenue, churn, and other business metrics entered into our calculator. This data is used solely for the purpose of generating your report.</li>
                        <li><strong>Usage Data:</strong> Information about how you interact with our website, such as page views and click patterns, collected via Google Analytics.</li>
                    </ul>

                    <h2>3. How We Use Your Information</h2>
                    <p>
                        We use the information we collect or receive:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>To generate accurate valuation reports and PDF downloads.</li>
                        <li>To send you the requested valuation results via email.</li>
                        <li>To improve our valuation algorithms and market benchmarks (data is anonymized for this purpose).</li>
                        <li>To comply with legal obligations.</li>
                    </ul>

                    <h2>4. Sharing Your Information</h2>
                    <p>
                        We do NOT sell your personal or financial data to third parties. We may share data with specific service providers (e.g., payment processors like Stripe, email services like Formspree) only as necessary to provide our services to you.
                    </p>

                    <h2>5. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
                    </p>

                    <h2>6. Contact Us</h2>
                    <p>
                        If you have questions or comments about this policy, you may email us at support@saasvaluation.app.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
