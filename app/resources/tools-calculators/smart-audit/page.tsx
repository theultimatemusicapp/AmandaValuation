
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmartAuditTool from '@/components/tools/SmartAuditTool';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Smart Audit Tool: AI-Powered Due Diligence',
    description: 'Free instant document audit for SaaS founders. Scan your pitch deck or P&L for red flags before investors see them.',
};

export default function SmartAuditPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <Header />

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center gap-2 text-sm">
                        <Link href="/resources/tools-calculators" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors font-medium">
                            <ArrowLeft className="w-4 h-4" /> Tools
                        </Link>
                        <span className="text-slate-600">/</span>
                        <span className="text-slate-200 font-medium">Smart Audit</span>
                    </div>

                    {/* Header */}
                    <div className="mb-12 text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium mb-4">
                            <Search className="w-4 h-4" />
                            <span>Data Room Intelligence</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
                            Smart Audit Tool
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Don't let a stray keyword kill your deal. Scan your executive summary or P&L notes for common investor "Red Flags."
                        </p>
                    </div>

                    {/* Tool Component */}
                    <div className="mb-16">
                        <SmartAuditTool />
                    </div>

                    {/* SEO Content / Guide */}
                    <div className="prose prose-invert prose-lg max-w-none border-t border-slate-800 pt-16 mx-auto container">
                        <h2>How it works</h2>
                        <p>
                            This tool runs entirely in your browser. No data is sent to our servers.
                        </p>
                        <p>
                            It uses a heuristics engine optimized for SaaS Due Diligence to spot keywords that typically trigger alarm bells for VCs and Private Equity firms, such as:
                        </p>
                        <ul>
                            <li><strong>Legal:</strong> "Lawsuit", "Dispute", "Infringement"</li>
                            <li><strong>Financial:</strong> "Cash burn", "Declining revenue", "Short runway"</li>
                            <li><strong>Operational:</strong> "Rewrite", "Technical debt", "Founder leaving"</li>
                        </ul>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
