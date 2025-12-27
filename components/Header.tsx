'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white font-display">SaaS Valuation</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <NavLink href="/">Valuation Tool</NavLink>
                        <NavLink href="/resources">Resources</NavLink>
                        <NavLink href="/payment">Pricing</NavLink>
                        <Link
                            href="/payment"
                            className="ml-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <Sparkles className="w-4 h-4" />
                            Unlock Pro — $19
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-800 bg-gray-900">
                    <nav className="px-4 py-4 space-y-2">
                        <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>
                            Valuation Tool
                        </MobileNavLink>
                        <MobileNavLink href="/resources" onClick={() => setMobileMenuOpen(false)}>
                            Resources
                        </MobileNavLink>
                        <MobileNavLink href="/payment" onClick={() => setMobileMenuOpen(false)}>
                            Pricing
                        </MobileNavLink>
                        <Link
                            href="/payment"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full text-center px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg mt-4"
                        >
                            Unlock Pro — $19
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors font-medium text-sm"
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors font-medium"
        >
            {children}
        </Link>
    );
}
