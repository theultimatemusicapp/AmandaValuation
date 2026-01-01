import Link from 'next/link';
import { Sparkles, Mail, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-amber-500 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold font-display">SaaS Valuation</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Investor-ready valuations and growth tools for SaaS founders. Get accurate market valuations in minutes.
                        </p>
                        <div className="flex items-center space-x-3">
                            <a href="#" className="text-gray-400 hover:text-brand-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-brand-400 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-brand-400 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Product</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Free Valuation
                                </Link>
                            </li>
                            <li>
                                <Link href="/pro" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Pro Valuation
                                </Link>
                            </li>
                            <li>
                                <Link href="/payment" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Resources
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/resources#how-to-value-saas" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Valuation Guides
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources#micro-saas-valuation" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Exit Readiness
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources#rule-of-40" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Growth Strategies
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources#ai-valuation-bubble" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Market Insights
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400">
                            © 2025 SaaS Valuation App. All rights reserved.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>Built with</span>
                            <span className="text-brand-400">♥</span>
                            <span>for SaaS founders</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
