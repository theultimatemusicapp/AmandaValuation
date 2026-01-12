import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ValuationWizard from '@/components/ValuationTool';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import SaaSNews from '@/components/SaaSNews';
import { fetchAllNews } from '@/lib/news';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function Home() {
  noStore();
  const initialNews = await fetchAllNews().catch(() => []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      {/* Pro Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-center">
        <Link href="/pro" className="inline-flex items-center gap-2 text-white font-semibold hover:text-gray-100">
          <Sparkles className="w-4 h-4" />
          <span>🎄 Try our comprehensive Pro Valuation with 50+ data points — Only $19</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <Hero />

      <Pricing />

      <Testimonials />

      <div className="max-w-4xl mx-auto px-4 py-12 text-center" id="free-valuation">
        <div className="inline-flex items-center gap-3 px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
          <div className="p-2 bg-brand-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-brand-400" />
          </div>
          <p className="text-slate-300 font-medium">
            Below get your <span className="text-white font-bold">Free Valuation</span> for a more basic report
          </p>
        </div>
      </div>

      <ValuationWizard />

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm uppercase tracking-widest text-slate-400">Current SaaS News</p>
            <h2 className="text-3xl font-bold text-white">Current SaaS News</h2>
          </div>
          <SaaSNews initialItems={initialNews} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
