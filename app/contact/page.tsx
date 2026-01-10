import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
    title: 'Contact SaaS Valuation | Get Support, Partnerships, or Sales Help',
    description:
        'Contact the SaaS Valuation team for product support, partnership requests, or enterprise pricing. We reply within two business days with next steps.',
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <Header />

            <section className="relative py-20 border-b border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
                <div className="relative max-w-5xl mx-auto px-6 space-y-6">
                    <p className="text-sm uppercase tracking-wide text-brand-400 font-semibold">Contact</p>
                    <h1 className="text-4xl md:text-5xl font-bold font-display">Let&#39;s talk about your SaaS valuation goals</h1>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Whether you are a founder preparing for a raise, a broker assembling deal materials, or a finance leader
                        testing valuation scenarios, we are here to help. Use this page to route your request so we can get you to
                        the right person quickly. We read every message and respond with clear next steps, timelines, and any
                        resources you can use immediately.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            className="bg-brand-500 text-slate-950 px-4 py-2 rounded-lg font-semibold hover:bg-brand-400"
                            href="mailto:hello@saasvaluation.app"
                        >
                            Email hello@saasvaluation.app
                        </a>
                        <Link
                            href="/resources"
                            className="border border-slate-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-900"
                        >
                            Browse valuation resources
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-6 space-y-8 text-slate-300 leading-relaxed">
                    <h2 className="text-3xl font-bold font-display text-white">How we can help</h2>
                    <p>
                        We support founders and operators across the valuation lifecycle. If you are looking for product help, include
                        the email you used for your purchase, the report type (Free or Pro), and any error messages or screenshots you
                        can share. If you are planning a transaction, tell us your ARR band, your growth profile, and your timing so we
                        can point you to the right resources or introduce you to partners who specialize in your segment. For enterprise
                        requests, we can share API documentation, white-label options, and sample workflows for bulk valuations.
                    </p>
                    <p>
                        Investors, brokers, and corporate development teams can also use this channel to request diligence-style
                        analyses or data exports. We keep data handling secure and do not share your inputs with third parties without
                        explicit consent. If you need a non-disclosure agreement before sending data, mention it in your note and we will
                        provide a standard template within one business day.
                    </p>
                    <p>
                        Our typical response window is 48 business hours. Complex enterprise requests may take longer, but we always
                        reply with a clear timeline. For urgent questions related to a live transaction, let us know the deadline and we
                        will do our best to prioritize the request. We are based in North America and usually respond Monday through
                        Friday, 9 a.m. to 6 p.m. Pacific.
                    </p>
                    <p>
                        If you are unsure where to start, send a short overview of your business and goals. We will ask follow-up
                        questions and point you to the most relevant tools, playbooks, or next steps. The more detail you provide, the
                        faster we can deliver a helpful response.
                    </p>
                </div>
            </section>

            <section className="py-16 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-6 space-y-8 text-slate-300 leading-relaxed">
                    <h2 className="text-3xl font-bold font-display text-white">What to include in your message</h2>
                    <p>
                        The quickest way to get support is to give us context. Include your company name, your ARR range, and whether
                        you are bootstrapped or venture-backed. If you are using the calculator, tell us which valuation method or metric
                        you are testing (Rule of 40, NRR, burn multiple, or DCF). If you are focused on an exit, share the type of buyer
                        you are targeting (strategic, financial, or brokered) and any constraints you have around timing or structure.
                    </p>
                    <p>
                        For product issues, attach screenshots, the browser you are using, and the approximate time you encountered the
                        problem. We are able to diagnose most issues within the same day when we have those details. If the issue is
                        related to billing, include the last four digits of the card or the invoice ID so we can locate the payment
                        quickly without requesting sensitive information.
                    </p>
                    <p>
                        If you are exploring partnership opportunities, outline the audience you serve and what success looks like for
                        you. We receive a high volume of partnership requests and prioritize those that align with our focus on SaaS
                        founders, M&A advisors, and finance leaders. Clear information about your distribution channel, average deal
                        size, and customer profile helps us evaluate fit quickly.
                    </p>
                </div>
            </section>

            <section className="py-16 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-6 space-y-8 text-slate-300 leading-relaxed">
                    <h2 className="text-3xl font-bold font-display text-white">FAQ</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-white">Do you offer live calls or consulting?</h3>
                            <p>
                                We do offer advisory sessions for founders preparing for a raise or exit, but availability is limited. If
                                you are interested, include your ARR range and timeline so we can suggest a format and price. Most founders
                                start with the Pro Valuation report and the resources hub before scheduling a call.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">Can you review a draft deck or data room?</h3>
                            <p>
                                Yes. We can provide feedback on your valuation narrative, metrics framing, and buyer story. We do not
                                publish your materials, and we keep your data confidential. Tell us what stage you are in and what feedback
                                you want, and we will confirm scope before you share any files.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">How do you handle privacy?</h3>
                            <p>
                                We collect only the data we need to generate your valuation outputs, and we do not sell or share that data
                                with third parties. You can request deletion of your data at any time by emailing us. Details are available
                                in our privacy policy.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">What if I need help right away?</h3>
                            <p>
                                Mark your email as urgent and include your deadline. While we cannot guarantee immediate responses,
                                providing a clear time window helps us prioritize urgent requests. We also recommend reviewing the resources
                                hub for answers to common valuation questions while you wait for a response.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-5xl mx-auto px-6 space-y-6 text-slate-300 leading-relaxed">
                    <h2 className="text-3xl font-bold font-display text-white">Prefer self-serve support?</h2>
                    <p>
                        If you want to move fast, start with the resources hub and calculators. Each article explains the underlying
                        valuation logic, benchmarks, and practical steps founders can take to improve outcomes. Many founders use these
                        guides to prepare internal leadership updates or investor memos before reaching out for deeper help.
                    </p>
                    <p>
                        You can also run the free valuation tool on the homepage to test scenarios in minutes. The pro report expands on
                        that output with detailed commentary, scorecards, and a downloadable PDF. If you are not sure which option is best,
                        send us a note with your goals and we will recommend the fastest path.
                    </p>
                </div>
            </section>

            <Footer />
        </main>
    );
}
