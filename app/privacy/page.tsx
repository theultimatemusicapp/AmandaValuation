import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

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

                    <h2>6. Advertising and Analytics Partners</h2>
                    <p>
                        We use Google Analytics to understand how visitors use our website. Google Analytics collects information such as how often users visit the site, what pages they visit, and what other sites they used prior to coming to our site. We use this information to improve our website and services.
                    </p>
                    <p>
                        Google Analytics uses cookies to collect this data. You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on, available at{' '}
                        <a
                            href="https://tools.google.com/dlpage/gaoptout"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-400 hover:text-brand-300 underline"
                        >
                            https://tools.google.com/dlpage/gaoptout
                        </a>.
                    </p>
                    <p>
                        We may partner with third-party advertising networks in the future, such as Google AdSense, to display advertisements on our website. These advertising partners may use cookies and similar technologies to collect information about your browsing activities across different websites to provide you with relevant advertising. If we implement advertising, we will notify users and comply with all applicable advertising and privacy regulations.
                    </p>
                    <p>
                        For more detailed information about how we use cookies and tracking technologies, please see our{' '}
                        <Link href="/cookie-policy" className="text-brand-400 hover:text-brand-300 underline">
                            Cookie Policy
                        </Link>.
                    </p>

                    <h2>7. Data Retention</h2>
                    <p>
                        We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Specifically:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Valuation Data:</strong> We retain the business metrics you enter into our calculators for 12 months to improve our algorithms and benchmarks. This data is anonymized after 30 days.</li>
                        <li><strong>Email Addresses:</strong> If you provide your email to receive valuation reports, we retain it for up to 24 months or until you request deletion.</li>
                        <li><strong>Purchase Records:</strong> For Pro Valuation purchases, we retain transaction records for 7 years to comply with tax and accounting regulations.</li>
                        <li><strong>Analytics Data:</strong> Google Analytics data is retained for 26 months from your last interaction with our site.</li>
                    </ul>

                    <h2>8. Your Privacy Rights</h2>
                    <p>
                        Depending on your location, you may have certain rights regarding your personal information:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Access:</strong> You can request a copy of the personal information we hold about you.</li>
                        <li><strong>Correction:</strong> You can request that we correct any inaccurate information we have about you.</li>
                        <li><strong>Deletion:</strong> You can request that we delete your personal information, subject to certain legal exceptions.</li>
                        <li><strong>Opt-out:</strong> You can opt out of marketing communications at any time.</li>
                        <li><strong>Data Portability:</strong> You can request your data in a structured, commonly used format.</li>
                    </ul>
                    <p>
                        If you are a resident of California (CCPA) or the European Union (GDPR), you have additional rights under those regulations. To exercise any of these rights, please contact us at hello@saasvaluation.app with your request. We will respond within 30 days.
                    </p>

                    <h2>9. International Data Transfers</h2>
                    <p>
                        Our servers and service providers may be located in the United States and other countries. If you are accessing our website from outside these countries, your information may be transferred to, stored, and processed in countries that may have different data protection laws than your country of residence. By using our services, you consent to this transfer.
                    </p>

                    <h2>10. Children's Privacy</h2>
                    <p>
                        Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately and we will delete it.
                    </p>

                    <h2>11. Contact Us</h2>
                    <p>
                        If you have questions or comments about this policy, wish to exercise your privacy rights, or want to request deletion of your data, you may email us at{' '}
                        <a href="mailto:hello@saasvaluation.app" className="text-brand-400 hover:text-brand-300 underline">
                            hello@saasvaluation.app
                        </a>.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
