import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
    title: 'Editorial Standards & Methodology | SaaS Valuation',
    description:
        'Learn how SaaS Valuation sources data, validates metrics, and updates valuation guidance. Our editorial standards explain our research process, review cadence, and author accountability.',
};

export default function EditorialStandardsPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <Header />

            <section className="relative py-20 border-b border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
                <div className="relative max-w-5xl mx-auto px-6 space-y-6">
                    <p className="text-sm uppercase tracking-wide text-brand-400 font-semibold">Editorial Standards</p>
                    <h1 className="text-4xl md:text-5xl font-bold font-display">How we build trustworthy valuation guidance</h1>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        SaaS Valuation publishes playbooks and calculators used by founders, operators, and advisors to make high-stakes
                        decisions. This page explains how we research each guide, how we validate data, and what review process keeps our
                        content accurate and useful. We prioritize clarity, defensible methodology, and founder-friendly explanations over
                        hype or speculation.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/resources"
                            className="bg-brand-500 text-slate-950 px-4 py-2 rounded-lg font-semibold hover:bg-brand-400"
                        >
                            Browse resources
                        </Link>
                        <Link
                            href="/contact"
                            className="border border-slate-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-900"
                        >
                            Ask a methodology question
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-6 space-y-8 text-slate-300 leading-relaxed">
                    <h2 className="text-3xl font-bold font-display text-white">Our research process</h2>
                    <p>
                        Each pillar or cluster guide begins with a review of published benchmarks from investor reports, public SaaS
                        disclosures, and transaction data shared in trusted industry databases. We compare trends across ARR bands,
                        business models, and retention profiles to identify ranges that remain stable across multiple sources. We avoid
                        one-off anecdotes unless the data is corroborated by other evidence.
                    </p>
                    <p>
                        When we publish frameworks such as the Rule of 40, burn multiple, or revenue multiple ranges, we document the
                        calculations and the assumptions that underpin them. If a metric depends on definitions that vary (for example,
                        EBITDA vs. free cash flow), we note the trade-offs and offer guidance on which definition to use for the specific
                        valuation context.
                    </p>
                </div>
            </section>

            <section className="py-16 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-6 space-y-8 text-slate-300 leading-relaxed">
                    <h2 className="text-3xl font-bold font-display text-white">Fact checking & review cadence</h2>
                    <p>
                        Every resource is reviewed before publish by a valuation analyst and then updated on a quarterly cadence or when
                        new market data materially shifts benchmarks. Articles show a “last updated” date so readers can assess freshness.
                        If a benchmark changes rapidly, we add editorial notes explaining what moved and why.
                    </p>
                    <p>
                        We do not publish auto-generated filler content. Templates, checklists, and examples are written by human
                        contributors with direct SaaS operator or advisory experience. If we reference a third-party dataset or report,
                        we cite it within the article or in the resources hub context so readers can verify the source independently.
                    </p>
                </div>
            </section>

            <section className="py-16 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-6 space-y-8 text-slate-300 leading-relaxed">
                    <h2 className="text-3xl font-bold font-display text-white">Author accountability</h2>
                    <p>
                        Articles list the lead author and are written under their real name. Authors have either SaaS operator experience,
                        M&A advisory exposure, or finance leadership backgrounds. We maintain internal author bios that describe this
                        experience and provide citations when necessary. We will expand public author pages as our contributor team grows.
                    </p>
                    <p>
                        If you spot an error or want to request clarification, contact us with the article URL and the specific section in
                        question. We will confirm receipt within two business days and publish corrections alongside an update note.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-5xl mx-auto px-6 space-y-6 text-slate-300 leading-relaxed">
                    <h2 className="text-3xl font-bold font-display text-white">Calculator methodology</h2>
                    <p>
                        Our calculators aggregate multiple valuation methods to present a defensible range. We weight revenue multiple,
                        earnings multiple, and discounted cash flow outputs based on the company’s ARR band, growth profile, and margin
                        structure. We also apply qualitative risk adjustments for factors such as IP ownership, customer concentration,
                        and legal readiness. The output is a starting point for discussion—not a substitute for formal advice.
                    </p>
                    <p>
                        For transparency, each calculator guide includes the exact formulas and sensitivity levers used. If you are
                        preparing for a transaction, we recommend pairing the calculator with the exit readiness and efficiency pillars to
                        identify the operational improvements that most directly influence valuation.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Link
                            href="/resources"
                            className="bg-slate-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-700"
                        >
                            Explore valuation guides
                        </Link>
                        <Link
                            href="/"
                            className="border border-slate-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-900"
                        >
                            Run the calculator
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
