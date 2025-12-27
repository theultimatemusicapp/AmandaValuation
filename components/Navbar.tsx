import Link from 'next/link';


export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-slate-800/10 backdrop-blur-md bg-slate-950/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg font-display">S</span>
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight text-white">SaaS<span className="text-brand-400">Valuation</span></span>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="#features" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium">Features</Link>
                            <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium">Pricing</Link>
                            <Link href="#faq" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium">Questions</Link>
                        </div>
                    </div>

                    <div>
                        <a href="#valuation-tool" className="bg-brand-500 hover:bg-brand-400 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-[0_0_20px_-5px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_-5px_rgba(20,184,166,0.5)]">
                            Get Free Validation
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
