import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
    title: 'Cookie Policy | SaaS Valuation',
    description: 'Learn how SaaS Valuation uses cookies and tracking technologies to improve your experience.',
};

export default function CookiePolicyPage() {
    return (
        <main className="min-h-screen bg-slate-950">
            <Header />

            <div className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold font-display text-white mb-8">Cookie Policy</h1>

                <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                    <p className="text-sm text-slate-500 mb-8">Last Updated: January 17, 2026</p>

                    <h2>1. What Are Cookies</h2>
                    <p>
                        Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, understanding how you use our site, and improving our services.
                    </p>

                    <h2>2. How We Use Cookies</h2>
                    <p>
                        SaaS Valuation uses cookies and similar tracking technologies for the following purposes:
                    </p>

                    <h3>Essential Cookies</h3>
                    <p>
                        These cookies are necessary for the website to function properly. They enable basic features like page navigation, access to secure areas, and ensure the valuation calculator works correctly. The website cannot function properly without these cookies.
                    </p>

                    <h3>Analytics Cookies</h3>
                    <p>
                        We use Google Analytics to understand how visitors interact with our website. This helps us improve the user experience and identify which content is most valuable to our users. The information collected includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Pages visited and time spent on each page</li>
                        <li>How you arrived at our site (referral source)</li>
                        <li>Device type, browser, and operating system</li>
                        <li>General geographic location (city/country level)</li>
                        <li>Interaction with calculators and tools</li>
                    </ul>
                    <p>
                        Google Analytics uses cookies to collect this data. The data is anonymized and aggregated, and we do not use it to personally identify individual users.
                    </p>

                    <h3>Advertising Cookies (Future Use)</h3>
                    <p>
                        We may partner with advertising networks such as Google AdSense in the future to display relevant advertisements on our website. These advertising partners may use cookies to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Show you relevant ads based on your browsing history</li>
                        <li>Measure ad performance and effectiveness</li>
                        <li>Limit the number of times you see the same advertisement</li>
                    </ul>
                    <p>
                        If we implement advertising, we will provide clear notice and comply with all applicable advertising regulations.
                    </p>

                    <h2>3. Third-Party Services</h2>
                    <p>
                        In addition to cookies, we use the following third-party services that may collect data:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Google Analytics:</strong> For website analytics and usage insights (tracking ID: G-772JV93TYR)</li>
                        <li><strong>Stripe:</strong> For payment processing on our Pro Valuation service (does not use cookies on our site)</li>
                        <li><strong>Formspree:</strong> For contact form submissions (minimal data collection)</li>
                    </ul>
                    <p>
                        Each of these services has its own privacy policy governing how they handle data. We encourage you to review their policies.
                    </p>

                    <h2>4. Your Choices</h2>
                    <p>
                        You have control over how cookies are used on your device:
                    </p>

                    <h3>Browser Settings</h3>
                    <p>
                        Most web browsers allow you to manage cookies through their settings. You can typically:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>View which cookies are stored and delete them individually</li>
                        <li>Block third-party cookies</li>
                        <li>Block all cookies from specific websites</li>
                        <li>Delete all cookies when you close your browser</li>
                        <li>Block all cookies (note: this may affect site functionality)</li>
                    </ul>

                    <h3>Opt Out of Google Analytics</h3>
                    <p>
                        You can opt out of Google Analytics tracking by installing the{' '}
                        <a
                            href="https://tools.google.com/dlpage/gaoptout"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-400 hover:text-brand-300 underline"
                        >
                            Google Analytics Opt-out Browser Add-on
                        </a>.
                    </p>

                    <h3>Do Not Track Signals</h3>
                    <p>
                        Some browsers have a "Do Not Track" feature that signals to websites that you do not want your online activities tracked. We currently do not respond to Do Not Track signals, as there is no industry standard for how to interpret them. We will monitor developments in this area and update our practices accordingly.
                    </p>

                    <h2>5. Data Retention</h2>
                    <p>
                        Cookie data collected through Google Analytics is retained for 26 months from your last interaction with our website. After this period, the data is automatically deleted.
                    </p>

                    <h2>6. Updates to This Policy</h2>
                    <p>
                        We may update this Cookie Policy from time to time to reflect changes in our practices or for legal and regulatory reasons. When we make changes, we will update the "Last Updated" date at the top of this page. For significant changes, we may provide more prominent notice.
                    </p>

                    <h2>7. Contact Us</h2>
                    <p>
                        If you have questions about our use of cookies or this policy, please contact us at{' '}
                        <a href="mailto:hello@saasvaluation.app" className="text-brand-400 hover:text-brand-300 underline">
                            hello@saasvaluation.app
                        </a>.
                    </p>

                    <p className="mt-8 text-sm text-slate-500">
                        For information about how we handle your personal data, please see our{' '}
                        <Link href="/privacy" className="text-brand-400 hover:text-brand-300 underline">
                            Privacy Policy
                        </Link>.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
