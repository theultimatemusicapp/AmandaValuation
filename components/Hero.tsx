'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
    return (
        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-sm mb-8"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse"></span>
                        Used by 1,000+ Founders this month
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6"
                    >
                        Know What Your <br />
                        <span className="hero-gradient-text">SaaS Is Really Worth</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Get an instant, data-driven valuation report for your startup.
                        Calibrate your exit strategy with benchmarks from over 10,000 deals.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <a href="#valuation-tool" className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-semibold text-lg transition-all shadow-[0_0_20px_-5px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2 group">
                            Start Free Valuation
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#sample-report" className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                            View Sample Report
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500"
                    >
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand-500" /> Free to start</span>
                        <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-brand-500" /> 100% Private & Secure</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand-500" /> No Card Required</span>
                    </motion.div>

                    {/* Demo Video Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-16"
                    >
                        <p className="text-sm text-slate-500 mb-4">See it in action →</p>
                        <div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden border-2 border-slate-700/50 bg-slate-900 shadow-2xl">
                            <img
                                src="/demo-recording.webp"
                                alt="Watch the valuation tool demo"
                                className="w-full h-auto"
                            />
                            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700">
                                <p className="text-white text-sm font-semibold flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse"></span>
                                    Get Your Valuation in 60 Seconds
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Dashboard Preview / Hero Image */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-20 relative mx-auto max-w-5xl"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-blue-600 rounded-2xl blur opacity-20"></div>
                    <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900 shadow-2xl">
                        {/* Mock Browser Bar */}
                        <div className="h-8 bg-slate-800/50 border-b border-slate-700/50 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                        </div>
                        {/* The Dashboard Image */}
                        <div className="relative aspect-[16/9] w-full bg-slate-900 flex items-center justify-center group overflow-hidden">
                            <Image
                                src="/hero_dashboard.png"
                                alt="SaaS Valuation Dashboard"
                                fill
                                className="object-cover object-top"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
